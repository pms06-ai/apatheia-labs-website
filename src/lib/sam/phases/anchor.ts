/**
 * ANCHOR Phase - False Premise Origin Identification
 *
 * Purpose: Identify the first documented appearance of each claim
 * and assess whether it constitutes a false premise.
 *
 * Key operations:
 * 1. Extract claims from documents
 * 2. Find earliest occurrence of each claim
 * 3. Classify origin type (primary source, hearsay, speculation, etc.)
 * 4. Identify false premises and their types
 * 5. Document contradicting evidence that existed at origin point
 */

import { supabaseAdmin } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/ai-client'
import { logger } from '@/lib/logger'
import type {
  PhaseContext,
  ANCHORResult,
  ClaimOrigin
} from '../types'
import type { OriginType, FalsePremiseType } from '@/CONTRACT'

// Helper to safely get date from metadata
function getDocDate(doc: any): string {
  if (doc.metadata && typeof doc.metadata === 'object' && 'date' in doc.metadata) {
    return doc.metadata.date as string
  }
  return doc.created_at
}

// AI prompt for claim extraction
const CLAIM_EXTRACTION_PROMPT = `You are a forensic document analyst specializing in institutional accountability.

Analyze the following document and extract all substantive claims made.

For each claim, identify:
1. The exact claim text
2. Who is making the claim (author/entity)
3. The type of claim (factual, opinion, finding, recommendation, conclusion, allegation)
4. The foundation type (verified, supported, unsupported, contested, circular, contaminated, unfounded)
5. Any supporting evidence cited
6. The page/paragraph reference

Focus on claims that:
- Assert facts about individuals or events
- Make professional conclusions or findings
- Recommend actions based on assessments
- Attribute behaviors or characteristics to individuals

Return a JSON array of claims.`

// AI prompt for origin analysis
const ORIGIN_ANALYSIS_PROMPT = `You are a forensic analyst tracing the origins of institutional claims.

Given the following claim and document context, determine:

1. Is this the FIRST documented appearance of this claim, or does it reference earlier sources?
2. What is the origin type:
   - primary_source: Direct observation or hard evidence
   - professional_opinion: Expert assessment with disclosed methodology
   - hearsay: Reported speech ("X said that...")
   - speculation: Conjecture presented as possibility
   - misattribution: Claim wrongly attributed to another source
   - fabrication: No evidential basis found

3. If this appears to be a FALSE PREMISE, classify it:
   - factual_error: Demonstrably incorrect fact
   - misattribution: Wrong person/source credited
   - speculation_as_fact: Possibility stated as certainty
   - context_stripping: True fact with false implication
   - selective_quotation: Partial truth that misleads
   - temporal_distortion: Chronology manipulation

4. List any CONTRADICTING EVIDENCE that existed at the time this claim was made

Return structured JSON with your analysis.`

interface ExtractedClaim {
  claim_text: string
  author: string | null
  claim_type: string
  foundation_type: string
  supporting_evidence: string[]
  page_ref: string | null
}

interface OriginAnalysis {
  is_first_appearance: boolean
  origin_type: OriginType
  is_false_premise: boolean
  false_premise_type: FalsePremiseType | null
  contradicting_evidence: string | null
  confidence: number
  reasoning: string
}

/**
 * Execute the ANCHOR phase
 */
export async function executeANCHOR(context: PhaseContext): Promise<ANCHORResult> {
  const { analysisId, caseId, documents, claims: existingClaims, focusClaims } = context

  logger.info(`ANCHOR phase starting for ${documents.length} documents`)

  // Step 1: Extract claims from all documents
  const allExtractedClaims: Array<ExtractedClaim & { document_id: string; document_date: string }> = []

  for (const doc of documents) {
    if (!doc.extracted_text) continue

    const extracted = await extractClaimsFromDocument(doc.id, doc.extracted_text)
    const docDate = getDocDate(doc)

    for (const claim of extracted) {
      allExtractedClaims.push({
        ...claim,
        document_id: doc.id,
        document_date: docDate
      })
    }
  }

  logger.info(`Extracted ${allExtractedClaims.length} claims from documents`)

  // Step 2: Sort by date to find earliest occurrences
  allExtractedClaims.sort((a, b) =>
    new Date(a.document_date).getTime() - new Date(b.document_date).getTime()
  )

  // Step 3: Group similar claims and find origins
  const claimGroups = groupSimilarClaims(allExtractedClaims)

  // Step 4: Analyze each claim group's origin
  const origins: ClaimOrigin[] = []
  const falsePremises: ClaimOrigin[] = []

  for (const group of claimGroups) {
    // Skip if we have focus claims and this isn't one of them
    if (focusClaims?.length && !focusClaims.some(fc =>
      group.claims[0].claim_text.toLowerCase().includes(fc.toLowerCase())
    )) {
      continue
    }

    const earliest = group.claims[0] // Already sorted by date
    const originAnalysis = await analyzeClaimOrigin(earliest, documents)

    // Save claim to database if new
    const claimId = await saveOrFindClaim(caseId, earliest)

    // Create origin record
    const origin: ClaimOrigin = {
      id: crypto.randomUUID(),
      case_id: caseId,
      claim_id: claimId,
      origin_document_id: earliest.document_id,
      origin_entity_id: null, // Would need entity resolution
      origin_date: earliest.document_date,
      origin_page: earliest.page_ref ? parseInt(earliest.page_ref) : null,
      origin_context: earliest.claim_text.substring(0, 500),
      origin_type: originAnalysis.origin_type,
      is_false_premise: originAnalysis.is_false_premise,
      false_premise_type: originAnalysis.false_premise_type,
      contradicting_evidence: originAnalysis.contradicting_evidence,
      confidence_score: originAnalysis.confidence,
      metadata: {
        reasoning: originAnalysis.reasoning,
        total_occurrences: group.claims.length,
        analysis_id: analysisId
      },
      created_at: new Date().toISOString()
    }

    origins.push(origin)

    if (originAnalysis.is_false_premise) {
      falsePremises.push(origin)
    }
  }

  // Step 5: Save origins to database
  if (origins.length > 0) {
    await supabaseAdmin.from('claim_origins').insert(
      origins.map(o => ({
        id: o.id,
        case_id: o.case_id,
        claim_id: o.claim_id,
        origin_document_id: o.origin_document_id,
        origin_entity_id: o.origin_entity_id,
        origin_date: o.origin_date,
        origin_page: o.origin_page,
        origin_context: o.origin_context,
        origin_type: o.origin_type,
        is_false_premise: o.is_false_premise,
        false_premise_type: o.false_premise_type,
        contradicting_evidence: o.contradicting_evidence,
        confidence_score: o.confidence_score,
        metadata: o.metadata
      }))
    )
  }

  logger.info(`ANCHOR phase complete: ${origins.length} origins identified, ${falsePremises.length} false premises`)

  return {
    origins,
    false_premises: falsePremises,
    claims_analyzed: allExtractedClaims.length,
    confidence: calculateOverallConfidence(origins)
  }
}

/**
 * Extract claims from a document using AI
 */
async function extractClaimsFromDocument(
  documentId: string,
  text: string
): Promise<ExtractedClaim[]> {
  // Truncate very long documents
  const maxLength = 50000
  const truncatedText = text.length > maxLength
    ? text.substring(0, maxLength) + '\n[...truncated...]'
    : text

  const systemPrompt = 'You are a forensic document analyst. Return your analysis as valid JSON.'

  const userContent = `${CLAIM_EXTRACTION_PROMPT}

Return a JSON object with a "claims" array. Each claim should have:
- claim_text: string
- author: string or null
- claim_type: string
- foundation_type: string
- supporting_evidence: array of strings
- page_ref: string or null

Document:
${truncatedText}`

  try {
    const result = await generateJSON(systemPrompt, userContent)
    const parsed = typeof result === 'string' ? JSON.parse(result) : result
    return parsed?.claims || []
  } catch (error) {
    logger.error(`Failed to extract claims from document ${documentId}: ${error}`)
    return []
  }
}

/**
 * Analyze the origin of a claim
 */
async function analyzeClaimOrigin(
  claim: ExtractedClaim & { document_id: string },
  documents: any[]
): Promise<OriginAnalysis> {
  const doc = documents.find(d => d.id === claim.document_id)
  const contextText = doc?.extracted_text?.substring(0, 10000) || ''

  const systemPrompt = 'You are a forensic analyst tracing the origins of institutional claims. Return your analysis as valid JSON.'

  const userContent = `${ORIGIN_ANALYSIS_PROMPT}

Return a JSON object with:
- is_first_appearance: boolean
- origin_type: one of "primary_source", "professional_opinion", "hearsay", "speculation", "misattribution", "fabrication"
- is_false_premise: boolean
- false_premise_type: one of "factual_error", "misattribution", "speculation_as_fact", "context_stripping", "selective_quotation", "temporal_distortion" or null
- contradicting_evidence: string or null
- confidence: number between 0 and 1
- reasoning: string

Claim:
"${claim.claim_text}"

Author: ${claim.author || 'Unknown'}
Claimed foundation: ${claim.foundation_type}

Document context:
${contextText}`

  try {
    const result = await generateJSON(systemPrompt, userContent)
    const parsed = typeof result === 'string' ? JSON.parse(result) : result
    return {
      is_first_appearance: parsed.is_first_appearance ?? true,
      origin_type: parsed.origin_type ?? 'professional_opinion',
      is_false_premise: parsed.is_false_premise ?? false,
      false_premise_type: parsed.false_premise_type ?? null,
      contradicting_evidence: parsed.contradicting_evidence ?? null,
      confidence: parsed.confidence ?? 0.5,
      reasoning: parsed.reasoning ?? 'Analysis completed'
    }
  } catch (error) {
    logger.error(`Failed to analyze claim origin: ${error}`)
    return {
      is_first_appearance: true,
      origin_type: 'professional_opinion',
      is_false_premise: false,
      false_premise_type: null,
      contradicting_evidence: null,
      confidence: 0.5,
      reasoning: 'Analysis failed, defaulting to neutral assessment'
    }
  }
}

/**
 * Group similar claims together using text similarity
 */
function groupSimilarClaims(
  claims: Array<ExtractedClaim & { document_id: string; document_date: string }>
): Array<{ key: string; claims: typeof claims }> {
  const groups: Map<string, typeof claims> = new Map()

  for (const claim of claims) {
    // Simple key: normalize and truncate claim text
    const key = claim.claim_text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .substring(0, 100)
      .trim()

    // Find existing similar group
    let foundGroup = false
    for (const [existingKey, existingClaims] of groups) {
      if (stringSimilarity(key, existingKey) > 0.7) {
        existingClaims.push(claim)
        foundGroup = true
        break
      }
    }

    if (!foundGroup) {
      groups.set(key, [claim])
    }
  }

  return Array.from(groups.entries()).map(([key, claims]) => ({ key, claims }))
}

/**
 * Simple string similarity using Jaccard index
 */
function stringSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(/\s+/))
  const setB = new Set(b.split(/\s+/))
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  return intersection.size / union.size
}

/**
 * Save a claim to the database or find existing
 */
async function saveOrFindClaim(
  caseId: string,
  claim: ExtractedClaim & { document_id: string }
): Promise<string> {
  // Try to find existing claim
  const { data: existing } = await supabaseAdmin
    .from('claims')
    .select('id')
    .eq('case_id', caseId)
    .ilike('claim_text', claim.claim_text.substring(0, 100) + '%')
    .limit(1)
    .single()

  if (existing) {
    return existing.id
  }

  // Create new claim
  const { data: newClaim } = await supabaseAdmin
    .from('claims')
    .insert({
      case_id: caseId,
      claim_text: claim.claim_text,
      claim_type: claim.claim_type as any,
      source_document_id: claim.document_id,
      foundation_type: claim.foundation_type as any
    })
    .select('id')
    .single()

  return newClaim?.id || crypto.randomUUID()
}

/**
 * Calculate overall confidence for the ANCHOR results
 */
function calculateOverallConfidence(origins: ClaimOrigin[]): number {
  if (origins.length === 0) return 0
  const avgConfidence = origins.reduce((sum, o) => sum + (o.confidence_score || 0.5), 0) / origins.length
  return Math.round(avgConfidence * 100) / 100
}
