/**
 * INHERIT Phase - Claim Propagation Tracking
 *
 * Purpose: Track how claims spread across institutional boundaries
 * without independent verification.
 *
 * Key operations:
 * 1. Trace claim adoption across documents
 * 2. Identify verification gaps (claims adopted without checking)
 * 3. Detect circular references
 * 4. Track mutations (amplification, attenuation, certainty drift)
 * 5. Map institutional boundary crossings
 */

import { supabaseAdmin } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai-client'
import { logger } from '@/lib/logger'
import type {
  PhaseContext,
  PhaseResults,
  INHERITResult,
  ClaimPropagation
} from '../types'
import type { PropagationType, MutationType } from '@/CONTRACT'

// Helper to safely get date from metadata
function getDocDate(doc: any): string {
  if (doc.metadata && typeof doc.metadata === 'object' && 'date' in doc.metadata) {
    return doc.metadata.date as string
  }
  return doc.created_at
}

// AI prompt for propagation analysis
const PROPAGATION_ANALYSIS_PROMPT = `You are a forensic analyst tracking how claims propagate through institutional documents.

Given a SOURCE claim and a TARGET document, analyze whether and how the claim was adopted:

1. Does the target document contain this claim or a variant?
2. If yes, how was it adopted:
   - verbatim: Exact or near-exact copy
   - paraphrase: Reworded but same meaning
   - citation: Formal reference to source
   - implicit_adoption: Used without attribution
   - circular_reference: References back to a document that itself referenced another
   - authority_appeal: "Expert X said" or similar

3. Was any verification performed?
   - Did the adopting party independently verify?
   - What method was used (if any)?

4. Did the claim MUTATE during adoption?
   - amplification: allegation became fact
   - attenuation: fact became mere concern
   - certainty_drift: "may have" became "definitely did"
   - attribution_shift: source changed
   - scope_expansion: specific became general
   - scope_contraction: general became specific

5. Did this cross an institutional boundary?
   - What institution authored the source?
   - What institution authored the target?

Return structured JSON analysis.`

interface PropagationAnalysis {
  claim_present: boolean
  propagation_type: PropagationType | null
  target_claim_text: string | null
  verification_performed: boolean
  verification_method: string | null
  verification_outcome: string | null
  mutation_detected: boolean
  mutation_type: MutationType | null
  original_text: string | null
  mutated_text: string | null
  source_institution: string | null
  target_institution: string | null
  confidence: number
  reasoning: string
}

/**
 * Execute the INHERIT phase
 */
export async function executeINHERIT(
  context: PhaseContext,
  previousResults: PhaseResults
): Promise<INHERITResult> {
  const { analysisId, caseId, documents } = context
  const anchorResults = previousResults.anchor

  if (!anchorResults) {
    throw new Error('INHERIT phase requires ANCHOR results')
  }

  logger.info(`INHERIT phase starting with ${anchorResults.origins.length} origins to trace`)

  const propagations: ClaimPropagation[] = []
  const verificationGaps: ClaimPropagation[] = []
  const circularReferences: ClaimPropagation[] = []
  const mutations: ClaimPropagation[] = []

  // Sort documents by date
  const sortedDocs = [...documents].sort((a, b) => {
    const dateA = new Date(getDocDate(a)).getTime()
    const dateB = new Date(getDocDate(b)).getTime()
    return dateA - dateB
  })

  // For each origin, trace propagation through subsequent documents
  for (const origin of anchorResults.origins) {
    const originDoc = documents.find(d => d.id === origin.origin_document_id)
    if (!originDoc) continue

    const originDate = new Date(origin.origin_date).getTime()

    // Find documents after the origin
    const subsequentDocs = sortedDocs.filter(d => {
      const docDate = new Date(getDocDate(d)).getTime()
      return docDate > originDate && d.id !== origin.origin_document_id
    })

    logger.info(`Tracing origin ${origin.id} through ${subsequentDocs.length} subsequent documents`)

    let previousDoc = originDoc
    let previousClaimText = origin.origin_context || ''

    for (const targetDoc of subsequentDocs) {
      if (!targetDoc.extracted_text) continue

      const analysis = await analyzePropagation(
        origin,
        previousClaimText,
        previousDoc,
        targetDoc
      )

      if (analysis.claim_present) {
        const propagation: ClaimPropagation = {
          id: crypto.randomUUID(),
          case_id: caseId,
          source_claim_id: origin.claim_id,
          source_document_id: previousDoc.id,
          source_entity_id: null,
          source_date: getDocDate(previousDoc),
          target_claim_id: null, // Would need to create target claim
          target_document_id: targetDoc.id,
          target_entity_id: null,
          target_date: getDocDate(targetDoc),
          propagation_type: analysis.propagation_type,
          verification_performed: analysis.verification_performed,
          verification_method: analysis.verification_method,
          verification_outcome: analysis.verification_outcome,
          crossed_institutional_boundary: analysis.source_institution !== analysis.target_institution,
          source_institution: analysis.source_institution,
          target_institution: analysis.target_institution,
          mutation_detected: analysis.mutation_detected,
          mutation_type: analysis.mutation_type,
          original_text: analysis.original_text,
          mutated_text: analysis.mutated_text,
          metadata: {
            reasoning: analysis.reasoning,
            confidence: analysis.confidence,
            analysis_id: analysisId,
            origin_id: origin.id
          },
          created_at: new Date().toISOString()
        }

        propagations.push(propagation)

        // Categorize the propagation
        if (!analysis.verification_performed) {
          verificationGaps.push(propagation)
        }

        if (analysis.propagation_type === 'circular_reference') {
          circularReferences.push(propagation)
        }

        if (analysis.mutation_detected) {
          mutations.push(propagation)
        }

        // Update for next iteration in the chain
        previousDoc = targetDoc
        previousClaimText = analysis.target_claim_text || previousClaimText
      }
    }
  }

  // Save propagations to database
  if (propagations.length > 0) {
    await supabaseAdmin.from('claim_propagations').insert(
      propagations.map(p => ({
        id: p.id,
        case_id: p.case_id,
        source_claim_id: p.source_claim_id,
        source_document_id: p.source_document_id,
        source_entity_id: p.source_entity_id,
        source_date: p.source_date,
        target_claim_id: p.target_claim_id,
        target_document_id: p.target_document_id,
        target_entity_id: p.target_entity_id,
        target_date: p.target_date,
        propagation_type: p.propagation_type,
        verification_performed: p.verification_performed,
        verification_method: p.verification_method,
        verification_outcome: p.verification_outcome,
        crossed_institutional_boundary: p.crossed_institutional_boundary,
        source_institution: p.source_institution,
        target_institution: p.target_institution,
        mutation_detected: p.mutation_detected,
        mutation_type: p.mutation_type,
        original_text: p.original_text,
        mutated_text: p.mutated_text,
        metadata: p.metadata
      }))
    )
  }

  logger.info(`INHERIT phase complete: ${propagations.length} propagations, ${verificationGaps.length} verification gaps, ${circularReferences.length} circular refs, ${mutations.length} mutations`)

  return {
    propagations,
    verification_gaps: verificationGaps,
    circular_references: circularReferences,
    mutations,
    chains_found: countUniquePropagationChains(propagations)
  }
}

/**
 * Analyze propagation between two documents
 */
async function analyzePropagation(
  origin: any,
  sourceClaimText: string,
  sourceDoc: any,
  targetDoc: any
): Promise<PropagationAnalysis> {
  // Truncate document text
  const maxLength = 20000
  const sourceText = sourceDoc.extracted_text?.substring(0, maxLength) || ''
  const targetText = targetDoc.extracted_text?.substring(0, maxLength) || ''

  const systemPrompt = 'You are a forensic analyst tracking claim propagation. Return your analysis as valid JSON.'

  const userContent = `${PROPAGATION_ANALYSIS_PROMPT}

Return a JSON object with:
- claim_present: boolean
- propagation_type: one of "verbatim", "paraphrase", "citation", "implicit_adoption", "circular_reference", "authority_appeal" or null
- target_claim_text: string or null
- verification_performed: boolean
- verification_method: string or null
- verification_outcome: string or null
- mutation_detected: boolean
- mutation_type: one of "amplification", "attenuation", "certainty_drift", "attribution_shift", "scope_expansion", "scope_contraction" or null
- original_text: string or null
- mutated_text: string or null
- source_institution: string or null
- target_institution: string or null
- confidence: number between 0 and 1
- reasoning: string

SOURCE CLAIM:
"${sourceClaimText}"

SOURCE DOCUMENT (${sourceDoc.filename || 'Unknown'}):
${sourceText.substring(0, 5000)}

TARGET DOCUMENT (${targetDoc.filename || 'Unknown'}):
${targetText}

Analyze whether and how the source claim appears in the target document.`

  try {
    const result = await generateJSON(systemPrompt, userContent)
    const parsed = typeof result === 'string' ? JSON.parse(result) : result
    return {
      claim_present: parsed.claim_present ?? false,
      propagation_type: parsed.propagation_type ?? null,
      target_claim_text: parsed.target_claim_text ?? null,
      verification_performed: parsed.verification_performed ?? false,
      verification_method: parsed.verification_method ?? null,
      verification_outcome: parsed.verification_outcome ?? null,
      mutation_detected: parsed.mutation_detected ?? false,
      mutation_type: parsed.mutation_type ?? null,
      original_text: parsed.original_text ?? null,
      mutated_text: parsed.mutated_text ?? null,
      source_institution: parsed.source_institution ?? null,
      target_institution: parsed.target_institution ?? null,
      confidence: parsed.confidence ?? 0,
      reasoning: parsed.reasoning ?? 'Analysis completed'
    }
  } catch (error) {
    logger.error(`Failed to analyze propagation: ${error}`)
    return {
      claim_present: false,
      propagation_type: null,
      target_claim_text: null,
      verification_performed: false,
      verification_method: null,
      verification_outcome: null,
      mutation_detected: false,
      mutation_type: null,
      original_text: null,
      mutated_text: null,
      source_institution: null,
      target_institution: null,
      confidence: 0,
      reasoning: 'Analysis failed'
    }
  }
}

/**
 * Count unique propagation chains
 */
function countUniquePropagationChains(propagations: ClaimPropagation[]): number {
  // Group by source_claim_id
  const chains = new Map<string, ClaimPropagation[]>()

  for (const prop of propagations) {
    const key = prop.source_claim_id || 'unknown'
    if (!chains.has(key)) {
      chains.set(key, [])
    }
    chains.get(key)!.push(prop)
  }

  return chains.size
}
