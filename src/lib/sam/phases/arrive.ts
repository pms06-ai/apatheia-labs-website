/**
 * ARRIVE Phase - Outcome Mapping
 *
 * Purpose: Map how false premises led to catastrophic outcomes
 * by tracing the causal chain from origin to consequence.
 *
 * Key operations:
 * 1. Identify outcomes/decisions in the case
 * 2. Link outcomes to the claims that supported them
 * 3. Trace "but-for" causation chains
 * 4. Assess harm levels
 * 5. Generate remediation recommendations
 */

import { supabaseAdmin } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai-client'
import { logger } from '@/lib/logger'
import type {
  PhaseContext,
  PhaseResults,
  ARRIVEResult,
  SAMOutcome
} from '../types'
import type { OutcomeType, HarmLevel } from '@/CONTRACT'

// AI prompt for outcome identification
const OUTCOME_IDENTIFICATION_PROMPT = `You are a forensic analyst identifying consequential outcomes in legal/institutional documents.

Analyze the document and identify all OUTCOMES - decisions, orders, findings, or actions that had real-world consequences:

For each outcome, identify:
1. Type of outcome:
   - court_order: Judicial order (contact, residence, non-molestation, etc.)
   - finding_of_fact: Formal court finding
   - recommendation: Professional recommendation acted upon
   - agency_decision: LA/CAFCASS decision
   - regulatory_action: Professional body action
   - media_publication: Broadcast/publication decision

2. Description of the outcome

3. Date of the outcome

4. Claims/assertions that appear to have supported this outcome

5. Harm level:
   - catastrophic: Irreversible major harm (loss of custody, criminal conviction)
   - severe: Significant ongoing harm (restricted contact, damaged reputation)
   - moderate: Notable harm (financial loss, relationship strain)
   - minor: Limited impact

Return structured JSON with all identified outcomes.`

// AI prompt for causation analysis
const CAUSATION_ANALYSIS_PROMPT = `You are a forensic analyst tracing causal chains in institutional failures.

Given an OUTCOME and the CLAIMS that were traced as false premises or unverified, analyze:

1. "But-for" causation: Would this outcome have occurred without the identified false premise(s)?
   - definitely_no: Outcome clearly depended on the false premise
   - probably_no: Strong likelihood outcome wouldn't have occurred
   - uncertain: Cannot determine
   - probably_yes: Outcome likely would have occurred anyway
   - definitely_yes: False premise irrelevant to outcome

2. What specific claims appear to have directly influenced this outcome?

3. What harm resulted from this outcome?

4. What remediation is possible?
   - Legal remedies (appeal, set aside, variation)
   - Regulatory complaints
   - Professional conduct complaints
   - Media correction
   - Public record correction

Return structured JSON analysis.`

interface OutcomeIdentification {
  outcomes: Array<{
    outcome_type: OutcomeType
    description: string
    date: string | null
    supporting_claims: string[]
    harm_level: HarmLevel
    harm_description: string
  }>
}

interface CausationAnalysis {
  but_for_result: 'definitely_no' | 'probably_no' | 'uncertain' | 'probably_yes' | 'definitely_yes'
  causation_confidence: number
  causal_claims: string[]
  harm_description: string
  remediation_possible: boolean
  remediation_actions: string[]
  reasoning: string
}

/**
 * Execute the ARRIVE phase
 */
export async function executeARRIVE(
  context: PhaseContext,
  previousResults: PhaseResults
): Promise<ARRIVEResult> {
  const { analysisId, caseId, documents } = context
  const anchorResults = previousResults.anchor
  const inheritResults = previousResults.inherit
  const compoundResults = previousResults.compound

  if (!anchorResults || !inheritResults || !compoundResults) {
    throw new Error('ARRIVE phase requires results from all previous phases')
  }

  logger.info(`ARRIVE phase starting`)

  // Step 1: Identify outcomes across all documents
  const allOutcomes: Array<{
    outcome: OutcomeIdentification['outcomes'][0]
    document_id: string
  }> = []

  for (const doc of documents) {
    if (!doc.extracted_text) continue

    // Focus on documents likely to contain outcomes
    const docType = doc.doc_type || 'other'
    const isOutcomeDocument = [
      'court_order', 'expert_report', 'witness_statement',
      'social_work_assessment', 'threshold_document'
    ].includes(docType)

    if (!isOutcomeDocument && docType !== 'other') continue

    const outcomes = await identifyOutcomes(doc)

    for (const outcome of outcomes.outcomes) {
      allOutcomes.push({
        outcome,
        document_id: doc.id
      })
    }
  }

  logger.info(`Identified ${allOutcomes.length} potential outcomes`)

  // Step 2: Analyze causation for each outcome
  const samOutcomes: SAMOutcome[] = []
  const causationChains: ARRIVEResult['causation_chains'] = []

  for (const { outcome, document_id } of allOutcomes) {
    // Find false premises that might relate to this outcome
    const relevantFalsePremises = anchorResults.false_premises.filter(fp => {
      // Check if any supporting claim text matches the false premise
      return outcome.supporting_claims.some(claim =>
        fp.origin_context?.toLowerCase().includes(claim.toLowerCase().substring(0, 50)) ||
        claim.toLowerCase().includes((fp.origin_context || '').toLowerCase().substring(0, 50))
      )
    })

    if (relevantFalsePremises.length === 0) {
      // No false premises linked - still record the outcome but with lower priority
      continue
    }

    // Analyze causation
    const causation = await analyzeCausation(
      outcome,
      relevantFalsePremises,
      inheritResults.propagations,
      compoundResults.cumulative_scores
    )

    // Create outcome record
    const rootClaimIds = relevantFalsePremises.map(fp => fp.claim_id)

    const samOutcome: SAMOutcome = {
      id: crypto.randomUUID(),
      case_id: caseId,
      outcome_type: outcome.outcome_type,
      outcome_description: outcome.description,
      outcome_date: outcome.date,
      outcome_document_id: document_id,
      harm_level: outcome.harm_level,
      harm_description: causation.harm_description || outcome.harm_description,
      root_claim_ids: rootClaimIds,
      but_for_analysis: causation.reasoning,
      causation_confidence: causation.causation_confidence,
      remediation_possible: causation.remediation_possible,
      remediation_actions: causation.remediation_actions,
      metadata: {
        but_for_result: causation.but_for_result,
        causal_claims: causation.causal_claims,
        analysis_id: analysisId
      },
      created_at: new Date().toISOString()
    }

    samOutcomes.push(samOutcome)

    // Build propagation path for causation chain
    const propagationPath = buildPropagationPath(
      rootClaimIds,
      inheritResults.propagations,
      document_id
    )

    // Get cumulative authority for root claims
    const totalAuthority = rootClaimIds.reduce((sum, claimId) =>
      sum + (compoundResults.cumulative_scores[claimId] || 0), 0
    )

    causationChains.push({
      outcome_id: samOutcome.id,
      root_claims: rootClaimIds,
      propagation_path: propagationPath,
      authority_accumulation: totalAuthority
    })
  }

  // Save outcomes to database
  if (samOutcomes.length > 0) {
    await supabaseAdmin.from('sam_outcomes').insert(
      samOutcomes.map(o => ({
        id: o.id,
        case_id: o.case_id,
        outcome_type: o.outcome_type,
        outcome_description: o.outcome_description,
        outcome_date: o.outcome_date,
        outcome_document_id: o.outcome_document_id,
        harm_level: o.harm_level,
        harm_description: o.harm_description,
        root_claim_ids: o.root_claim_ids,
        but_for_analysis: o.but_for_analysis,
        causation_confidence: o.causation_confidence,
        remediation_possible: o.remediation_possible,
        remediation_actions: o.remediation_actions,
        metadata: o.metadata
      }))
    )
  }

  logger.info(`ARRIVE phase complete: ${samOutcomes.length} outcomes mapped to false premises`)

  return {
    outcomes: samOutcomes,
    causation_chains: causationChains
  }
}

/**
 * Identify outcomes in a document
 */
async function identifyOutcomes(document: any): Promise<OutcomeIdentification> {
  const docText = document.extracted_text?.substring(0, 30000) || ''
  const filename = document.filename || 'Unknown'

  const systemPrompt = 'You are a forensic analyst identifying consequential outcomes in legal/institutional documents. Return your analysis as valid JSON.'

  const userContent = `${OUTCOME_IDENTIFICATION_PROMPT}

Return a JSON object with an "outcomes" array. Each outcome should have:
- outcome_type: one of "court_order", "finding_of_fact", "recommendation", "agency_decision", "regulatory_action", "media_publication"
- description: string
- date: string or null
- supporting_claims: array of strings
- harm_level: one of "catastrophic", "severe", "moderate", "minor"
- harm_description: string

DOCUMENT (${filename}):
${docText}

Identify all consequential outcomes in this document.`

  try {
    const result = await generateJSON(systemPrompt, userContent)
    const parsed: OutcomeIdentification = typeof result === 'string' ? JSON.parse(result) : result

    return parsed
  } catch (error) {
    logger.error(`Failed to identify outcomes: ${error}`)
    return { outcomes: [] }
  }
}

/**
 * Analyze causation between false premises and outcomes
 */
async function analyzeCausation(
  outcome: OutcomeIdentification['outcomes'][0],
  falsePremises: any[],
  propagations: any[],
  cumulativeScores: Record<string, number>
): Promise<CausationAnalysis> {
  const falsePremisesSummary = falsePremises.map(fp => ({
    type: fp.false_premise_type,
    text: fp.origin_context?.substring(0, 200),
    origin_type: fp.origin_type,
    authority_accumulated: cumulativeScores[fp.claim_id] || 0
  }))

  const systemPrompt = 'You are a forensic analyst tracing causal chains in institutional failures. Return your analysis as valid JSON.'

  const userContent = `${CAUSATION_ANALYSIS_PROMPT}

Return a JSON object with:
- but_for_result: one of "definitely_no", "probably_no", "uncertain", "probably_yes", "definitely_yes"
- causation_confidence: number (0-1)
- causal_claims: array of strings
- harm_description: string
- remediation_possible: boolean
- remediation_actions: array of strings
- reasoning: string

OUTCOME:
Type: ${outcome.outcome_type}
Description: ${outcome.description}
Harm Level: ${outcome.harm_level}
Supporting Claims: ${outcome.supporting_claims.join('; ')}

IDENTIFIED FALSE PREMISES:
${JSON.stringify(falsePremisesSummary, null, 2)}

PROPAGATION COUNT: ${propagations.length} claim transmissions identified

Analyze the causal relationship between these false premises and the outcome.`

  try {
    const result = await generateJSON(systemPrompt, userContent)
    const parsed: CausationAnalysis = typeof result === 'string' ? JSON.parse(result) : result

    return parsed
  } catch (error) {
    logger.error(`Failed to analyze causation: ${error}`)
    return {
      but_for_result: 'uncertain',
      causation_confidence: 0.3,
      causal_claims: [],
      harm_description: outcome.harm_description || '',
      remediation_possible: true,
      remediation_actions: ['Further investigation required'],
      reasoning: 'Causation analysis failed'
    }
  }
}

/**
 * Build propagation path from root claims to outcome document
 */
function buildPropagationPath(
  rootClaimIds: string[],
  propagations: any[],
  outcomeDocumentId: string
): string[] {
  const path: string[] = []

  for (const claimId of rootClaimIds) {
    // Find propagations for this claim
    const claimPropagations = propagations
      .filter(p => p.source_claim_id === claimId)
      .sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime())

    for (const prop of claimPropagations) {
      const step = `${prop.source_document_id} -> ${prop.target_document_id} (${prop.propagation_type || 'unknown'})`
      if (!path.includes(step)) {
        path.push(step)
      }

      // Check if we've reached the outcome document
      if (prop.target_document_id === outcomeDocumentId) {
        break
      }
    }
  }

  return path
}
