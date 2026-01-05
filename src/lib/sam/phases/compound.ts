/**
 * COMPOUND Phase - Authority Accumulation Tracking
 *
 * Purpose: Document how claims gain institutional authority
 * through repetition and endorsement across multiple sources.
 *
 * Key operations:
 * 1. Identify when institutions endorse/adopt claims
 * 2. Calculate cumulative authority scores
 * 3. Detect "authority laundering" (claims gain legitimacy through repetition)
 * 4. Track institutional hierarchy of endorsements
 * 5. Map how unverified claims become "established facts"
 */

import { supabaseAdmin } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai-client'
import { logger } from '@/lib/logger'
import type {
  PhaseContext,
  PhaseResults,
  COMPOUNDResult,
  AuthorityMarker
} from '../types'
import type { AuthorityType, EndorsementType } from '@/CONTRACT'

// Helper to safely get date from metadata
function getDocDate(doc: any): string {
  if (doc.metadata && typeof doc.metadata === 'object' && 'date' in doc.metadata) {
    return doc.metadata.date as string
  }
  return doc.created_at
}

// Authority weight by institution type (UK family court context)
const AUTHORITY_WEIGHTS: Record<string, number> = {
  'court_of_appeal': 10,
  'high_court': 9,
  'family_court': 8,
  'expert_witness': 7,
  'senior_professional': 6, // e.g., Principal Social Worker
  'professional': 5, // Social worker, CAFCASS officer
  'official_report': 4, // ISW, s.7 report
  'police': 3,
  'agency': 2, // LA, CAFCASS as institution
  'lay_person': 1,
  'unknown': 2
}

// AI prompt for authority analysis
const AUTHORITY_ANALYSIS_PROMPT = `You are a forensic analyst assessing how claims gain institutional authority.

Given a CLAIM and a DOCUMENT that references or endorses it, analyze:

1. What type of authority is endorsing this claim:
   - court_finding: Judicial determination
   - expert_opinion: Professional expert assessment
   - official_report: Institutional report (ISW, s.7, etc.)
   - professional_assessment: Social worker/CAFCASS assessment
   - police_conclusion: Law enforcement finding
   - agency_determination: LA or CAFCASS decision

2. How is the endorsement made:
   - explicit_adoption: Clear acceptance of the claim
   - implicit_reliance: Used without challenge
   - qualified_acceptance: Accepted with caveats
   - referenced_without_verification: Cited but not verified

3. What institution/role is the author?
   - Family Court Judge
   - Expert Witness (specify discipline)
   - Independent Social Worker
   - Local Authority Social Worker
   - CAFCASS Officer
   - Police Officer
   - Other professional

4. Is this "authority laundering"?
   - Does the claim gain legitimacy primarily through repetition?
   - Is there circular reinforcement (A cites B cites A)?
   - Has an unverified claim become treated as "established"?

Return structured JSON analysis.`

interface AuthorityAnalysis {
  authority_type: AuthorityType
  endorsement_type: EndorsementType
  author_role: string
  institution: string
  authority_weight: number
  is_authority_laundering: boolean
  laundering_evidence: string | null
  endorsement_context: string
  confidence: number
}

/**
 * Execute the COMPOUND phase
 */
export async function executeCOMPOUND(
  context: PhaseContext,
  previousResults: PhaseResults
): Promise<COMPOUNDResult> {
  const { analysisId, caseId, documents } = context
  const inheritResults = previousResults.inherit
  const anchorResults = previousResults.anchor

  if (!inheritResults || !anchorResults) {
    throw new Error('COMPOUND phase requires ANCHOR and INHERIT results')
  }

  logger.info(`COMPOUND phase starting`)

  const authorityMarkers: AuthorityMarker[] = []
  const authorityLaundering: AuthorityMarker[] = []
  const cumulativeScores: Record<string, number> = {}

  // Process each claim origin and its propagation chain
  for (const origin of anchorResults.origins) {
    // Find all propagations for this origin
    const claimPropagations = inheritResults.propagations.filter(
      p => p.source_claim_id === origin.claim_id
    )

    // Start with the origin document
    const originDoc = documents.find(d => d.id === origin.origin_document_id)
    if (originDoc) {
      const originAuthority = await analyzeAuthority(
        origin.origin_context || '',
        originDoc
      )

      const marker = createAuthorityMarker(
        caseId,
        origin.claim_id,
        originDoc,
        originAuthority,
        analysisId,
        false // Not from propagation
      )

      authorityMarkers.push(marker)
      cumulativeScores[origin.claim_id] = (cumulativeScores[origin.claim_id] || 0) + marker.authority_weight
    }

    // Process each propagation (claim adoption)
    for (const prop of claimPropagations) {
      const targetDoc = documents.find(d => d.id === prop.target_document_id)
      if (!targetDoc) continue

      const claimText = prop.mutated_text || prop.original_text || origin.origin_context || ''

      const authority = await analyzeAuthority(claimText, targetDoc)

      // Check for authority laundering
      const isLaundering = detectAuthorityLaundering(
        origin,
        prop,
        claimPropagations,
        cumulativeScores[origin.claim_id] || 0
      )

      const marker = createAuthorityMarker(
        caseId,
        origin.claim_id,
        targetDoc,
        {
          ...authority,
          is_authority_laundering: isLaundering.detected,
          laundering_evidence: isLaundering.evidence
        },
        analysisId,
        true,
        prop.id
      )

      authorityMarkers.push(marker)

      if (isLaundering.detected) {
        authorityLaundering.push(marker)
      }

      // Update cumulative score
      cumulativeScores[origin.claim_id] = (cumulativeScores[origin.claim_id] || 0) + marker.authority_weight
    }

    // Update all markers for this claim with final cumulative score
    const finalScore = cumulativeScores[origin.claim_id] || 0
    for (const marker of authorityMarkers) {
      if (marker.claim_id === origin.claim_id) {
        marker.cumulative_authority_score = finalScore
      }
    }
  }

  // Save authority markers to database
  if (authorityMarkers.length > 0) {
    await supabaseAdmin.from('authority_markers').insert(
      authorityMarkers.map(m => ({
        id: m.id,
        case_id: m.case_id,
        claim_id: m.claim_id,
        authority_entity_id: m.authority_entity_id,
        authority_document_id: m.authority_document_id,
        authority_date: m.authority_date,
        authority_type: m.authority_type,
        authority_weight: m.authority_weight,
        endorsement_type: m.endorsement_type,
        is_authority_laundering: m.is_authority_laundering,
        laundering_path: m.laundering_path,
        cumulative_authority_score: m.cumulative_authority_score,
        metadata: m.metadata
      }))
    )
  }

  logger.info(`COMPOUND phase complete: ${authorityMarkers.length} authority markers, ${authorityLaundering.length} laundering instances`)

  return {
    authority_markers: authorityMarkers,
    authority_laundering: authorityLaundering,
    cumulative_scores: cumulativeScores
  }
}

/**
 * Analyze authority in a document
 */
async function analyzeAuthority(
  claimText: string,
  document: any
): Promise<AuthorityAnalysis> {
  const docText = document.extracted_text?.substring(0, 15000) || ''
  const filename = document.filename || 'Unknown'
  const docType = document.doc_type || 'unknown'

  const systemPrompt = 'You are a forensic analyst assessing how claims gain institutional authority. Return your analysis as valid JSON.'

  const userContent = `${AUTHORITY_ANALYSIS_PROMPT}

Return a JSON object with:
- authority_type: one of "court_finding", "expert_opinion", "official_report", "professional_assessment", "police_conclusion", "agency_determination"
- endorsement_type: one of "explicit_adoption", "implicit_reliance", "qualified_acceptance", "referenced_without_verification"
- author_role: string
- institution: string
- authority_weight: number (1-10)
- is_authority_laundering: boolean
- laundering_evidence: string or null
- endorsement_context: string
- confidence: number (0-1)

CLAIM:
"${claimText}"

DOCUMENT (${filename}, type: ${docType}):
${docText}

Analyze the authority endorsing or adopting this claim.`

  try {
    const result = await generateJSON(systemPrompt, userContent)
    const parsed: AuthorityAnalysis = typeof result === 'string' ? JSON.parse(result) : result

    // Override weight based on our hierarchy if AI estimate seems off
    const calculatedWeight = inferAuthorityWeight(parsed.institution, parsed.author_role)
    if (Math.abs(parsed.authority_weight - calculatedWeight) > 2) {
      parsed.authority_weight = calculatedWeight
    }

    return parsed
  } catch (error) {
    logger.error(`Failed to analyze authority: ${error}`)
    return {
      authority_type: 'professional_assessment',
      endorsement_type: 'implicit_reliance',
      author_role: 'Unknown',
      institution: 'Unknown',
      authority_weight: 2,
      is_authority_laundering: false,
      laundering_evidence: null,
      endorsement_context: '',
      confidence: 0.3
    }
  }
}

/**
 * Infer authority weight from institution/role
 */
function inferAuthorityWeight(institution: string, role: string): number {
  const combined = `${institution} ${role}`.toLowerCase()

  if (combined.includes('court of appeal')) return AUTHORITY_WEIGHTS.court_of_appeal
  if (combined.includes('high court')) return AUTHORITY_WEIGHTS.high_court
  if (combined.includes('family court') || combined.includes('judge')) return AUTHORITY_WEIGHTS.family_court
  if (combined.includes('expert') || combined.includes('dr ') || combined.includes('psychologist')) return AUTHORITY_WEIGHTS.expert_witness
  if (combined.includes('principal') || combined.includes('senior')) return AUTHORITY_WEIGHTS.senior_professional
  if (combined.includes('social worker') || combined.includes('cafcass') || combined.includes('isw')) return AUTHORITY_WEIGHTS.professional
  if (combined.includes('police')) return AUTHORITY_WEIGHTS.police
  if (combined.includes('local authority') || combined.includes('council')) return AUTHORITY_WEIGHTS.agency

  return AUTHORITY_WEIGHTS.unknown
}

/**
 * Detect authority laundering patterns
 */
function detectAuthorityLaundering(
  origin: any,
  currentProp: any,
  allPropagations: any[],
  cumulativeSoFar: number
): { detected: boolean; evidence: string | null } {
  // Check 1: Origin was unverified/speculation but now has high authority
  if (
    ['speculation', 'hearsay', 'fabrication'].includes(origin.origin_type) &&
    cumulativeSoFar > 15
  ) {
    return {
      detected: true,
      evidence: `Claim originated as ${origin.origin_type} but accumulated ${cumulativeSoFar} authority points through institutional adoption`
    }
  }

  // Check 2: Circular reference detected in propagation
  if (currentProp.propagation_type === 'circular_reference') {
    return {
      detected: true,
      evidence: 'Circular reference detected in propagation chain'
    }
  }

  // Check 3: Multiple adoptions without verification
  const unverifiedAdoptions = allPropagations.filter(p => !p.verification_performed)
  if (unverifiedAdoptions.length >= 3) {
    return {
      detected: true,
      evidence: `Claim adopted ${unverifiedAdoptions.length} times without independent verification`
    }
  }

  // Check 4: False premise gaining authority
  if (origin.is_false_premise && cumulativeSoFar > 10) {
    return {
      detected: true,
      evidence: `False premise (${origin.false_premise_type}) accumulated ${cumulativeSoFar} authority points`
    }
  }

  return { detected: false, evidence: null }
}

/**
 * Create authority marker record
 */
function createAuthorityMarker(
  caseId: string,
  claimId: string,
  document: any,
  authority: AuthorityAnalysis & { is_authority_laundering?: boolean; laundering_evidence?: string | null },
  analysisId: string,
  fromPropagation: boolean,
  propagationId?: string
): AuthorityMarker {
  return {
    id: crypto.randomUUID(),
    case_id: caseId,
    claim_id: claimId,
    authority_entity_id: null,
    authority_document_id: document.id,
    authority_date: getDocDate(document),
    authority_type: authority.authority_type,
    authority_weight: authority.authority_weight,
    endorsement_type: authority.endorsement_type,
    is_authority_laundering: authority.is_authority_laundering || false,
    laundering_path: authority.laundering_evidence || null,
    cumulative_authority_score: null, // Will be set after all processing
    metadata: {
      author_role: authority.author_role,
      institution: authority.institution,
      endorsement_context: authority.endorsement_context,
      confidence: authority.confidence,
      from_propagation: fromPropagation,
      propagation_id: propagationId,
      analysis_id: analysisId
    },
    created_at: new Date().toISOString()
  }
}
