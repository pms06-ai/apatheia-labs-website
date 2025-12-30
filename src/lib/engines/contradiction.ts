/**
 * CONTRADICTION ENGINE (Κ)
 * "Claim Comparison Across Documents"
 * 
 * Detects contradictions, inconsistencies, and evolving claims
 * across multiple documents in a case.
 * 
 * Core Question: Do statements contradict each other across documents?
 */

import { generateJSON } from '@/lib/ai-client'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Document } from '@/CONTRACT'

export interface ContradictionFinding {
  id: string
  type: 'direct' | 'implicit' | 'temporal' | 'quantitative' | 'attributional'
  severity: 'critical' | 'high' | 'medium' | 'low'
  claim1: {
    documentId: string
    documentName: string
    text: string
    date?: string
    author?: string
    pageRef?: number
  }
  claim2: {
    documentId: string
    documentName: string
    text: string
    date?: string
    author?: string
    pageRef?: number
  }
  explanation: string
  implication: string
  suggestedResolution?: string
}

export interface ContradictionAnalysisResult {
  contradictions: ContradictionFinding[]
  claimClusters: {
    topic: string
    claims: { docId: string; text: string; stance: string }[]
    consensus: boolean
  }[]
  summary: {
    totalContradictions: number
    criticalCount: number
    mostContradictedTopics: string[]
    credibilityImpact: 'severe' | 'moderate' | 'minor' | 'none'
  }
}

const CONTRADICTION_PROMPT = `You are a forensic document analyst specializing in detecting contradictions across legal documents.

DOCUMENTS TO ANALYZE:
{documents}

Find all contradictions between statements in these documents. Types of contradictions:
1. DIRECT: Explicit opposite statements ("X happened" vs "X did not happen")
2. IMPLICIT: Logically incompatible claims (timing, location, presence)
3. TEMPORAL: Timeline inconsistencies (dates, sequences, durations)
4. QUANTITATIVE: Number/measurement discrepancies
5. ATTRIBUTIONAL: Different people credited for same action

For each contradiction found:
- Quote the exact conflicting text from each document
- Identify the document source and page if available
- Explain why these statements contradict
- Rate severity based on impact on case
- Suggest how to resolve (if possible)

Focus on contradictions that affect:
- Credibility of witnesses/parties
- Timeline of events
- Presence or absence of people
- Actions taken or not taken
- Professional assessments

Respond in JSON:
{
  "contradictions": [
    {
      "type": "direct|implicit|temporal|quantitative|attributional",
      "severity": "critical|high|medium|low",
      "claim1": {
        "documentId": "...",
        "text": "...",
        "date": "...",
        "author": "...",
        "pageRef": number
      },
      "claim2": {
        "documentId": "...",
        "text": "...",
        "date": "...",
        "author": "...",
        "pageRef": number
      },
      "explanation": "...",
      "implication": "...",
      "suggestedResolution": "..."
    }
  ],
  "claimClusters": [
    {
      "topic": "...",
      "claims": [{"docId": "...", "text": "...", "stance": "..."}],
      "consensus": true/false
    }
  ]
}`

/**
 * Detect contradictions across a set of documents
 */
export async function detectContradictions(
  documents: Document[],
  caseId: string
): Promise<ContradictionAnalysisResult> {
  // Get content from all documents
  const docContents = await Promise.all(
    documents.map(async (doc) => {
      const content = await getDocumentContent(doc.id)
      return {
        id: doc.id,
        name: doc.filename,
        type: doc.doc_type,
        date: doc.created_at,
        content: content.slice(0, 50000) // Limit for context window
      }
    })
  )

  // Format documents for prompt
  const formattedDocs = docContents.map(d =>
    `=== DOCUMENT: ${d.name} (ID: ${d.id}, Type: ${d.type}) ===\n${d.content}`
  ).join('\n\n---\n\n')

  const prompt = CONTRADICTION_PROMPT.replace('{documents}', formattedDocs)

  // Mock Mode Check
  let result: any

  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
    console.log('[MOCK ENGINE] Using Mock Contradiction Results')
    const mockResult = {
      contradictions: [
        {
          type: 'direct',
          severity: 'critical',
          claim1: {
            documentId: documents[0]?.id || 'mock-doc-1',
            text: 'Subject was at home all night',
            date: '2023-01-12T10:00:00Z',
            author: 'Officer A',
            pageRef: 2
          },
          claim2: {
            documentId: documents[1]?.id || 'mock-doc-2',
            text: 'Subject was seen at the pub at 9pm',
            date: '2023-01-15T14:30:00Z',
            author: 'Social Worker B',
            pageRef: 5
          },
          explanation: 'Direct contradiction regarding the subject\'s location on the night of the incident.',
          implication: 'Undermines the credibility of the subject\'s alibi.',
          suggestedResolution: 'Verify CCTV footage or third-party witness statements.'
        },
        {
          type: 'temporal',
          severity: 'high',
          claim1: {
            documentId: documents[0]?.id || 'mock-doc-1',
            text: 'Incident occurred at 10:00 PM',
            date: '2023-01-12T10:00:00Z'
          },
          claim2: {
            documentId: documents[2]?.id || 'mock-doc-3',
            text: 'Ambulance called at 9:45 PM',
            date: '2023-01-20T09:00:00Z'
          },
          explanation: 'Timeline inconsistency: Ambulance called before the stated incident time.',
          implication: 'Suggests the timeline of events is inaccurate or manipulated.',
          suggestedResolution: 'Cross-reference with emergency service call logs.'
        }
      ],
      claimClusters: [
        {
          topic: 'Subject Location',
          claims: [
            { docId: documents[0]?.id, text: 'At home', stance: 'Defense' },
            { docId: documents[1]?.id, text: 'At pub', stance: 'Prosecution' }
          ],
          consensus: false
        }
      ]
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Assign to result for processing
    result = mockResult
  } else {
    // Use Unified AI Router for multi-document analysis
    result = await generateJSON('You are a forensic document analyst.', prompt)
  }

  // Process contradictions
  const contradictions: ContradictionFinding[] = result.contradictions.map(
    (c: any, idx: number) => ({
      id: `contradiction-${caseId.slice(0, 8)}-${idx}`,
      type: c.type,
      severity: c.severity,
      claim1: {
        documentId: c.claim1.documentId,
        documentName: docContents.find(d => d.id === c.claim1.documentId)?.name || 'Unknown',
        text: c.claim1.text,
        date: c.claim1.date,
        author: c.claim1.author,
        pageRef: c.claim1.pageRef
      },
      claim2: {
        documentId: c.claim2.documentId,
        documentName: docContents.find(d => d.id === c.claim2.documentId)?.name || 'Unknown',
        text: c.claim2.text,
        date: c.claim2.date,
        author: c.claim2.author,
        pageRef: c.claim2.pageRef
      },
      explanation: c.explanation,
      implication: c.implication,
      suggestedResolution: c.suggestedResolution
    })
  )

  const analysisResult: ContradictionAnalysisResult = {
    contradictions,
    claimClusters: result.claimClusters || [],
    summary: {
      totalContradictions: contradictions.length,
      criticalCount: contradictions.filter(c => c.severity === 'critical').length,
      mostContradictedTopics: extractTopics(result.claimClusters),
      credibilityImpact: calculateCredibilityImpact(contradictions)
    }
  }

  // Store in database
  await storeContradictions(caseId, contradictions)

  return analysisResult
}

/**
 * Compare two specific claims for contradiction
 */
export async function compareSpecificClaims(
  claim1: string,
  claim2: string,
  context?: string
): Promise<{
  contradicts: boolean
  type?: ContradictionFinding['type']
  explanation: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
}> {
  const prompt = `Compare these two claims for contradiction:

CLAIM 1: "${claim1}"
CLAIM 2: "${claim2}"
${context ? `CONTEXT: ${context}` : ''}

Analyze:
1. Do these claims contradict each other?
2. If yes, what type of contradiction (direct/implicit/temporal/quantitative/attributional)?
3. Explain the nature of the contradiction
4. Rate severity if contradictory

Respond in JSON:
{
  "contradicts": boolean,
  "type": "direct|implicit|temporal|quantitative|attributional" or null,
  "explanation": "...",
  "severity": "critical|high|medium|low" or null
}`

  try {
    return await generateJSON('Compare claims for contradiction.', prompt)
  } catch {
    return { contradicts: false, explanation: "Unable to analyze" }
  }
}

/**
 * Track how a specific claim evolves across documents over time
 */
export async function trackClaimEvolution(
  claim: string,
  documents: Document[],
  caseId: string
): Promise<{
  versions: {
    documentId: string
    documentName: string
    date: string
    text: string
    changesFromPrevious?: string
  }[]
  evolutionPattern: 'stable' | 'escalating' | 'de-escalating' | 'inconsistent'
  summary: string
}> {
  // Sort documents by date
  const sortedDocs = [...documents].sort(
    (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
  )

  // Find claim in each document
  const versions: {
    documentId: string
    documentName: string
    date: string
    text: string
    changesFromPrevious?: string
  }[] = []

  for (const doc of sortedDocs) {
    const content = await getDocumentContent(doc.id)

    const findPrompt = `In this document, find any statement related to this claim: "${claim}"

Document content:
${content.slice(0, 30000)}

Return the exact quote(s) that relate to this claim, or "NOT_FOUND" if not mentioned.
Respond in JSON: { "found": boolean, "quotes": ["..."] }`

    const result = await generateJSON('Find evidence in document.', findPrompt)

    if (result.found && result.quotes?.length > 0) {
      versions.push({
        documentId: doc.id,
        documentName: doc.filename,
        date: doc.created_at || 'Unknown',
        text: result.quotes.join(' | ')
      })
    }
  }

  // Analyze evolution pattern
  if (versions.length < 2) {
    return {
      versions,
      evolutionPattern: 'stable',
      summary: 'Insufficient versions to track evolution'
    }
  }

  // Compare consecutive versions
  for (let i = 1; i < versions.length; i++) {
    const comparison = await compareSpecificClaims(
      versions[i - 1].text,
      versions[i].text
    )
    versions[i].changesFromPrevious = comparison.explanation
  }

  // Determine pattern
  const pattern = await analyzeEvolutionPattern(versions)

  return {
    versions,
    evolutionPattern: pattern.pattern,
    summary: pattern.summary
  }
}

// Helper functions

async function getDocumentContent(docId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from('document_chunks')
    .select('content, chunk_index')
    .eq('document_id', docId)
    .order('chunk_index')

  return (data || []).map((c: any) => c.content).join('\n\n')
}

function extractTopics(clusters: any[]): string[] {
  return (clusters || [])
    .filter(c => !c.consensus)
    .map(c => c.topic)
    .slice(0, 5)
}

function calculateCredibilityImpact(
  contradictions: ContradictionFinding[]
): 'severe' | 'moderate' | 'minor' | 'none' {
  const critical = contradictions.filter(c => c.severity === 'critical').length
  const high = contradictions.filter(c => c.severity === 'high').length

  if (critical >= 3 || (critical >= 1 && high >= 3)) return 'severe'
  if (critical >= 1 || high >= 3) return 'moderate'
  if (high >= 1 || contradictions.length >= 3) return 'minor'
  return 'none'
}

async function analyzeEvolutionPattern(
  versions: any[]
): Promise<{ pattern: 'stable' | 'escalating' | 'de-escalating' | 'inconsistent'; summary: string }> {
  const changes = versions.slice(1).map(v => v.changesFromPrevious).filter(Boolean)

  const prompt = `Analyze how this claim evolved through these changes:
${changes.map((c, i) => `Change ${i + 1}: ${c}`).join('\n')}

Determine if the claim is:
- stable: Stays consistent
- escalating: Becomes stronger/more serious over time
- de-escalating: Becomes weaker/less serious over time
- inconsistent: Changes back and forth

Respond in JSON: { "pattern": "...", "summary": "..." }`

  try {
    return await generateJSON('Analyze claim evolution pattern.', prompt)
  } catch {
    return { pattern: "inconsistent", summary: "Unable to determine pattern" }
  }
}

async function storeContradictions(caseId: string, contradictions: ContradictionFinding[]) {
  const findings = contradictions.map(c => ({
    case_id: caseId,
    engine: 'contradiction',
    title: `${c.type} contradiction: ${c.explanation.slice(0, 50)}...`,
    description: c.explanation,
    severity: c.severity,
    document_ids: [c.claim1.documentId, c.claim2.documentId],
    evidence: {
      type: c.type,
      claim1: c.claim1,
      claim2: c.claim2,
      implication: c.implication
    }
  }))

  if (findings.length > 0) {
    await supabaseAdmin.from('findings').insert(findings)
  }
}



export const contradictionEngine = {
  detectContradictions,
  compareSpecificClaims,
  trackClaimEvolution
}
