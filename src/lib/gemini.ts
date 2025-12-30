import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

// Gemini models available on free tier
export const MODELS = {
  FLASH: 'gemini-1.5-flash',      // Fast, 1M context
  PRO: 'gemini-1.5-pro',          // Best quality, 2M context
} as const

// Export a gemini object for engines that use it directly
export const gemini = {
  generateContent: async (prompt: string, model: keyof typeof MODELS = 'FLASH') => {
    const geminiModel = genAI.getGenerativeModel({ model: MODELS[model] })
    const result = await geminiModel.generateContent(prompt)
    return result
  }
}

/**
 * Analyze a long document that exceeds typical context limits
 */
export async function analyzeLongDocument(
  content: string,
  task: string,
  model: keyof typeof MODELS = 'FLASH'
): Promise<string> {
  const geminiModel = genAI.getGenerativeModel({ model: MODELS[model] })

  const prompt = `You are a forensic analyst. ${task}

Document content:
${content}

Provide your analysis in a structured format.`

  const result = await geminiModel.generateContent(prompt)
  const response = await result.response
  return response.text()
}

/**
 * Compare multiple documents for contradictions
 */
export async function compareDocuments(
  documents: Array<{ name: string; content: string }>,
  focusAreas?: string[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODELS.FLASH })

  const documentList = documents
    .map((d, i) => `=== DOCUMENT ${i + 1}: ${d.name} ===\n${d.content}`)
    .join('\n\n')

  const focusPrompt = focusAreas?.length
    ? `Focus particularly on: ${focusAreas.join(', ')}`
    : ''

  const prompt = `You are a forensic analyst comparing multiple documents for contradictions and inconsistencies.

${documentList}

Analyze these documents and identify:
1. Direct contradictions between statements
2. Timeline inconsistencies
3. Information present in one document but omitted from another
4. Claims that lack supporting evidence
5. Circular reasoning or self-referential citations

${focusPrompt}

Return your analysis in JSON format:
{
  "contradictions": [...],
  "omissions": [...],
  "timeline_issues": [...],
  "unsupported_claims": [...],
  "summary": "..."
}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

/**
 * Extract timeline from documents
 */
export async function extractTimeline(
  content: string,
  caseContext?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODELS.FLASH })

  const prompt = `You are a forensic analyst extracting a chronological timeline from legal documents.

${caseContext ? `Case context: ${caseContext}\n\n` : ''}

Document content:
${content}

Extract all dated events and create a timeline. For each event, note:
- Date (exact or approximate)
- Event description
- Source (who reported this)
- Evidence cited

Return JSON format:
{
  "events": [
    {
      "date": "YYYY-MM-DD",
      "date_precision": "exact|approximate|week|month|year",
      "description": "...",
      "source": "...",
      "evidence": "...",
      "anomalies": ["..."]
    }
  ],
  "timeline_gaps": [...],
  "date_conflicts": [...]
}`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

/**
 * Generate regulatory complaint draft
 */
export async function generateComplaint(
  regulator: string,
  findings: string,
  caseContext: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: MODELS.PRO })

  const regulatorGuidance: Record<string, string> = {
    ofcom: 'Focus on Broadcasting Code violations, particularly sections 5 (due impartiality), 7 (fairness), and 8 (privacy).',
    iopc: 'Focus on police misconduct, failures in investigation, and breaches of PACE.',
    lgo: 'Focus on maladministration, failure to follow procedures, and impact on the complainant.',
    hcpc: 'Focus on fitness to practise concerns and breaches of HCPC standards.',
    ico: 'Focus on GDPR violations, subject access request failures, and data protection breaches.',
  }

  const prompt = `You are drafting a regulatory complaint for submission to ${regulator.toUpperCase()}.

${regulatorGuidance[regulator] || ''}

Case context:
${caseContext}

Evidence and findings:
${findings}

Generate a professional complaint document that includes:
1. Executive summary
2. Legal basis and relevant regulations
3. Chronology of events
4. Specific breaches/failures with evidence
5. Impact statement
6. Remedy sought
7. List of supporting documents

The complaint should be formal, factual, and reference specific regulatory provisions where applicable.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

/**
 * Stream response for long content
 */
export async function* streamAnalysis(
  content: string,
  task: string,
  model: keyof typeof MODELS = 'FLASH'
) {
  const geminiModel = genAI.getGenerativeModel({ model: MODELS[model] })

  const prompt = `${task}\n\nContent:\n${content}`

  const result = await geminiModel.generateContentStream(prompt)

  for await (const chunk of result.stream) {
    yield chunk.text()
  }
}
