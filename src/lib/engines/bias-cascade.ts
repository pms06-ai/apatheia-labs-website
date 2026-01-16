/**
 * BIAS CASCADE ENGINE (Βκ)
 * "Cascading Bias Detection"
 *
 * Tracks how initial biases compound and cascade through subsequent documents.
 * Identifies anchor bias (first impression), confirmation bias (selective citing),
 * and authority amplification (bias gains weight through institutional repetition).
 *
 * Core Question: How did early bias compound into systemic failure?
 *
 * Status: PLANNED - Stub implementation
 */

import type { Document } from '@/CONTRACT'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * An anchor bias - the initial biased framing
 */
export interface AnchorBias {
  /** Anchor ID */
  id: string
  /** Document where anchor originated */
  originDocument: string
  /** Date of origin */
  originDate: string
  /** The biased claim/framing */
  claim: string
  /** Type of anchor bias */
  type: 'first_impression' | 'authority_statement' | 'headline_framing' | 'initial_allegation'
  /** Direction of bias */
  direction: 'prosecution' | 'defense' | 'institutional'
  /** Strength of anchor (0-1) */
  strength: number
  /** Evidence of bias */
  evidence: string
}

/**
 * A cascade step - how bias propagated
 */
export interface CascadeStep {
  /** Step ID */
  id: string
  /** Source document */
  sourceDocument: string
  /** Target document (where bias propagated to) */
  targetDocument: string
  /** Date of propagation */
  date: string
  /** The claim being propagated */
  claim: string
  /** How it was propagated */
  mechanism: 'direct_citation' | 'paraphrase' | 'assumption' | 'institutional_adoption'
  /** Whether verification occurred */
  wasVerified: boolean
  /** Amplification factor */
  amplification: number
  /** Mutation (if claim changed) */
  mutation?: {
    original: string
    mutated: string
    mutationType: 'strengthened' | 'weakened' | 'distorted' | 'fabricated'
  }
}

/**
 * A full cascade chain
 */
export interface BiasCascadeChain {
  /** Chain ID */
  id: string
  /** The anchor bias that started this chain */
  anchor: AnchorBias
  /** Steps in the cascade */
  steps: CascadeStep[]
  /** Total documents affected */
  documentsAffected: number
  /** Final amplification (how much stronger bias became) */
  totalAmplification: number
  /** Whether chain crossed institutional boundaries */
  crossedInstitutions: boolean
  /** Institutions involved */
  institutions: string[]
  /** Outcome influenced */
  influencedOutcomes: string[]
}

/**
 * Confirmation bias detection
 */
export interface ConfirmationBiasInstance {
  /** Instance ID */
  id: string
  /** Document where confirmation bias occurred */
  documentId: string
  /** The pre-existing belief being confirmed */
  belief: string
  /** Evidence that was selectively cited */
  selectedEvidence: string[]
  /** Evidence that was ignored */
  ignoredEvidence: string[]
  /** Ratio of selected to ignored */
  selectivityRatio: number
}

/**
 * Bias cascade analysis result
 */
export interface BiasCascadeResult {
  /** Case ID */
  caseId: string
  /** Identified anchor biases */
  anchors: AnchorBias[]
  /** Cascade chains */
  chains: BiasCascadeChain[]
  /** Confirmation bias instances */
  confirmationBias: ConfirmationBiasInstance[]
  /** Summary metrics */
  metrics: {
    totalAnchors: number
    totalCascadeSteps: number
    avgAmplification: number
    maxAmplification: number
    documentsWithUnverifiedClaims: number
    institutionalCrossings: number
  }
  /** Impact assessment */
  impact: {
    overallBiasScore: number // -1 to 1
    direction: 'prosecution' | 'defense' | 'neutral'
    confidence: number
    criticalChains: string[] // IDs of most impactful chains
  }
  /** Remediation suggestions */
  remediations: {
    chainId: string
    suggestion: string
    priority: 'low' | 'medium' | 'high' | 'critical'
  }[]
  /** Timestamp */
  analyzedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Patterns indicating prosecution-favoring language */
const PROSECUTION_INDICATORS = [
  'alleged',
  'accused',
  'suspect',
  'perpetrator',
  'offender',
  'failed to',
  'refused to',
  'denied',
  'concerns about',
  'risk to',
  'safeguarding',
  'harmful',
  'dangerous',
]

/** Patterns indicating defense-favoring language */
const DEFENSE_INDICATORS = [
  'innocent',
  'cleared',
  'exonerated',
  'no evidence',
  'cooperated',
  'complied',
  'supported',
  'positive',
  'no concerns',
  'appropriate',
  'suitable',
]

/** Institutional boundary keywords */
const INSTITUTIONAL_MARKERS = [
  'police',
  'social services',
  'local authority',
  'court',
  'cafcass',
  'expert',
  'school',
  'gp',
  'hospital',
  'nhs',
]

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function generateId(): string {
  return `bc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function extractClaims(text: string): string[] {
  // Split into sentences and filter for claim-like statements
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
  return sentences.filter(s => {
    const lower = s.toLowerCase()
    return (
      lower.includes('alleged') ||
      lower.includes('stated') ||
      lower.includes('reported') ||
      lower.includes('concern') ||
      lower.includes('evidence') ||
      lower.includes('found that') ||
      lower.includes('concluded')
    )
  })
}

function calculateBiasDirection(text: string): {
  score: number
  direction: 'prosecution' | 'defense' | 'neutral'
} {
  const lower = text.toLowerCase()
  let prosecutionScore = 0
  let defenseScore = 0

  for (const indicator of PROSECUTION_INDICATORS) {
    const matches = (lower.match(new RegExp(indicator, 'g')) || []).length
    prosecutionScore += matches
  }

  for (const indicator of DEFENSE_INDICATORS) {
    const matches = (lower.match(new RegExp(indicator, 'g')) || []).length
    defenseScore += matches
  }

  const total = prosecutionScore + defenseScore
  if (total === 0) return { score: 0, direction: 'neutral' }

  const score = (prosecutionScore - defenseScore) / total
  return {
    score,
    direction: score > 0.1 ? 'prosecution' : score < -0.1 ? 'defense' : 'neutral',
  }
}

function detectInstitution(text: string): string | null {
  const lower = text.toLowerCase()
  for (const marker of INSTITUTIONAL_MARKERS) {
    if (lower.includes(marker)) return marker
  }
  return null
}

function findClaimInDocument(claim: string, docText: string): boolean {
  const claimWords = claim
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 4)
  const docLower = docText.toLowerCase()
  const matchCount = claimWords.filter(w => docLower.includes(w)).length
  return matchCount / claimWords.length > 0.6
}

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export const biasCascadeEngine = {
  /**
   * Run full bias cascade analysis
   * Traces how initial biases compound through document chains
   * @param documents - Documents to analyze (in chronological order)
   * @param caseId - Case ID
   * @returns Bias cascade analysis result
   */
  async analyzeBiasCascade(documents: Document[], caseId: string): Promise<BiasCascadeResult> {
    if (documents.length === 0) {
      return {
        caseId,
        anchors: [],
        chains: [],
        confirmationBias: [],
        metrics: {
          totalAnchors: 0,
          totalCascadeSteps: 0,
          avgAmplification: 1.0,
          maxAmplification: 1.0,
          documentsWithUnverifiedClaims: 0,
          institutionalCrossings: 0,
        },
        impact: { overallBiasScore: 0, direction: 'neutral', confidence: 0, criticalChains: [] },
        remediations: [],
        analyzedAt: new Date().toISOString(),
      }
    }

    // Sort documents chronologically
    const sortedDocs = [...documents].sort((a, b) => {
      const dateA = a.metadata?.date ? new Date(String(a.metadata.date)).getTime() : 0
      const dateB = b.metadata?.date ? new Date(String(b.metadata.date)).getTime() : 0
      return dateA - dateB
    })

    // Step 1: Identify anchor biases in earliest documents
    const anchors = await this.identifyAnchors(sortedDocs.slice(0, Math.min(3, sortedDocs.length)))

    // Step 2: Trace cascades for each anchor
    const chains: BiasCascadeChain[] = []
    for (const anchor of anchors) {
      const chain = await this.traceCascade(anchor, sortedDocs)
      if (chain.steps.length > 0) {
        chains.push(chain)
      }
    }

    // Step 3: Detect confirmation bias instances
    const confirmationBias = await this.detectConfirmationBias(sortedDocs)

    // Step 4: Calculate metrics
    const totalSteps = chains.reduce((sum, c) => sum + c.steps.length, 0)
    const amplifications = chains.map(c => c.totalAmplification)
    const avgAmplification =
      amplifications.length > 0
        ? amplifications.reduce((a, b) => a + b, 0) / amplifications.length
        : 1.0
    const maxAmplification = amplifications.length > 0 ? Math.max(...amplifications) : 1.0

    const docsWithUnverified = new Set<string>()
    chains.forEach(c =>
      c.steps.forEach(s => {
        if (!s.wasVerified) docsWithUnverified.add(s.targetDocument)
      })
    )

    const institutionalCrossings = chains.reduce(
      (sum, c) => sum + (c.crossedInstitutions ? c.institutions.length - 1 : 0),
      0
    )

    // Step 5: Calculate impact
    const impact = await this.calculateImpact(chains)

    // Step 6: Generate remediations
    const remediations: BiasCascadeResult['remediations'] = []
    for (const chain of chains) {
      if (chain.totalAmplification > 2) {
        remediations.push({
          chainId: chain.id,
          suggestion: `Review original source for anchor claim: "${chain.anchor.claim.slice(0, 50)}..."`,
          priority: chain.totalAmplification > 5 ? 'critical' : 'high',
        })
      }
      if (chain.crossedInstitutions) {
        remediations.push({
          chainId: chain.id,
          suggestion: `Verify independent assessment by ${chain.institutions.join(', ')}`,
          priority: 'medium',
        })
      }
    }

    return {
      caseId,
      anchors,
      chains,
      confirmationBias,
      metrics: {
        totalAnchors: anchors.length,
        totalCascadeSteps: totalSteps,
        avgAmplification,
        maxAmplification,
        documentsWithUnverifiedClaims: docsWithUnverified.size,
        institutionalCrossings,
      },
      impact,
      remediations,
      analyzedAt: new Date().toISOString(),
    }
  },

  /**
   * Identify anchor biases in earliest documents
   */
  async identifyAnchors(documents: Document[]): Promise<AnchorBias[]> {
    const anchors: AnchorBias[] = []

    for (const doc of documents) {
      const text = doc.extracted_text || ''
      const claims = extractClaims(text)
      const { score, direction } = calculateBiasDirection(text)

      if (Math.abs(score) > 0.2 && claims.length > 0) {
        // Find the most biased claim
        let strongestClaim = claims[0]
        let strongestScore = 0

        for (const claim of claims) {
          const claimBias = calculateBiasDirection(claim)
          if (Math.abs(claimBias.score) > strongestScore) {
            strongestScore = Math.abs(claimBias.score)
            strongestClaim = claim
          }
        }

        anchors.push({
          id: generateId(),
          originDocument: doc.id,
          originDate: String(doc.metadata?.date || new Date().toISOString()),
          claim: strongestClaim,
          type: strongestClaim.toLowerCase().includes('alleged')
            ? 'initial_allegation'
            : strongestClaim.toLowerCase().includes('expert')
              ? 'authority_statement'
              : 'first_impression',
          direction: direction === 'neutral' ? 'institutional' : direction,
          strength: Math.min(1, Math.abs(score) + 0.3),
          evidence: `Bias indicators detected: ${Math.abs(score).toFixed(2)} directional score`,
        })
      }
    }

    return anchors
  },

  /**
   * Trace cascade from an anchor through subsequent documents
   */
  async traceCascade(anchor: AnchorBias, documents: Document[]): Promise<BiasCascadeChain> {
    const steps: CascadeStep[] = []
    const institutions = new Set<string>()
    let currentClaim = anchor.claim
    let totalAmplification = 1.0

    // Get origin document index
    const originIdx = documents.findIndex(d => d.id === anchor.originDocument)
    const originInstitution = detectInstitution(documents[originIdx]?.extracted_text || '')
    if (originInstitution) institutions.add(originInstitution)
    let lastMatchingDocumentId = anchor.originDocument

    // Trace through subsequent documents
    for (let i = originIdx + 1; i < documents.length; i++) {
      const doc = documents[i]
      const docText = doc.extracted_text || ''

      // Check if claim appears in this document
      if (findClaimInDocument(currentClaim, docText)) {
        const docInstitution = detectInstitution(docText)
        if (docInstitution) institutions.add(docInstitution)

        const { score } = calculateBiasDirection(docText)
        const amplification = 1 + Math.abs(score) * 0.5

        // Detect mutation by comparing language intensity
        const originBias = calculateBiasDirection(currentClaim)
        const docBias = calculateBiasDirection(docText)
        let mutation: CascadeStep['mutation'] = undefined

        if (Math.abs(docBias.score - originBias.score) > 0.3) {
          mutation = {
            original: currentClaim.slice(0, 100),
            mutated: extractClaims(docText)[0]?.slice(0, 100) || '',
            mutationType: docBias.score > originBias.score ? 'strengthened' : 'weakened',
          }
        }

        steps.push({
          id: generateId(),
          sourceDocument: lastMatchingDocumentId,
          targetDocument: doc.id,
          date: String(doc.metadata?.date || new Date().toISOString()),
          claim: currentClaim,
          mechanism: docText.toLowerCase().includes('as stated')
            ? 'direct_citation'
            : docText.toLowerCase().includes('according to')
              ? 'paraphrase'
              : docInstitution !== originInstitution
                ? 'institutional_adoption'
                : 'assumption',
          wasVerified:
            docText.toLowerCase().includes('verified') ||
            docText.toLowerCase().includes('confirmed independently'),
          amplification,
          mutation,
        })

        lastMatchingDocumentId = doc.id
        totalAmplification *= amplification
        if (mutation?.mutated) {
          currentClaim = mutation.mutated
        }
      }
    }

    return {
      id: generateId(),
      anchor,
      steps,
      documentsAffected: steps.length + 1,
      totalAmplification,
      crossedInstitutions: institutions.size > 1,
      institutions: Array.from(institutions),
      influencedOutcomes: [], // Would require outcome detection
    }
  },

  /**
   * Detect confirmation bias instances across documents
   */
  async detectConfirmationBias(documents: Document[]): Promise<ConfirmationBiasInstance[]> {
    const instances: ConfirmationBiasInstance[] = []

    for (const doc of documents) {
      const text = doc.extracted_text || ''
      const { direction } = calculateBiasDirection(text)

      if (direction !== 'neutral') {
        // Count evidence mentions by direction
        const prosecutionEvidence: string[] = []
        const defenseEvidence: string[] = []

        const sentences = text.split(/[.!?]+/)
        for (const sentence of sentences) {
          const lower = sentence.toLowerCase()
          if (
            lower.includes('evidence') ||
            lower.includes('showed') ||
            lower.includes('indicated')
          ) {
            const sentenceBias = calculateBiasDirection(sentence)
            if (sentenceBias.direction === 'prosecution') {
              prosecutionEvidence.push(sentence.trim())
            } else if (sentenceBias.direction === 'defense') {
              defenseEvidence.push(sentence.trim())
            }
          }
        }

        const selected = direction === 'prosecution' ? prosecutionEvidence : defenseEvidence
        const ignored = direction === 'prosecution' ? defenseEvidence : prosecutionEvidence

        if (selected.length > 0 && ignored.length > 0) {
          instances.push({
            id: generateId(),
            documentId: doc.id,
            belief:
              direction === 'prosecution'
                ? 'Subject poses risk or has acted improperly'
                : 'Subject is innocent or acted appropriately',
            selectedEvidence: selected.slice(0, 5),
            ignoredEvidence: ignored.slice(0, 5),
            selectivityRatio: selected.length / (selected.length + ignored.length),
          })
        }
      }
    }

    return instances
  },

  /**
   * Calculate overall impact from cascade chains
   */
  async calculateImpact(chains: BiasCascadeChain[]): Promise<BiasCascadeResult['impact']> {
    if (chains.length === 0) {
      return { overallBiasScore: 0, direction: 'neutral', confidence: 0, criticalChains: [] }
    }

    // Weight by amplification
    let weightedScore = 0
    let totalWeight = 0
    let prosecutionCount = 0
    let defenseCount = 0

    for (const chain of chains) {
      const weight = chain.totalAmplification
      totalWeight += weight

      if (chain.anchor.direction === 'prosecution') {
        weightedScore += chain.anchor.strength * weight
        prosecutionCount++
      } else if (chain.anchor.direction === 'defense') {
        weightedScore -= chain.anchor.strength * weight
        defenseCount++
      }
    }

    const overallBiasScore = totalWeight > 0 ? weightedScore / totalWeight : 0
    const direction =
      overallBiasScore > 0.1 ? 'prosecution' : overallBiasScore < -0.1 ? 'defense' : 'neutral'

    // Confidence based on chain consistency and count
    const consistency = Math.abs(prosecutionCount - defenseCount) / chains.length
    const confidence = Math.min(1, (chains.length / 5) * 0.5 + consistency * 0.5)

    // Critical chains are those with high amplification
    const criticalChains = chains
      .filter(c => c.totalAmplification > 2 || c.crossedInstitutions)
      .map(c => c.id)

    return { overallBiasScore, direction, confidence, criticalChains }
  },
}

export default biasCascadeEngine
