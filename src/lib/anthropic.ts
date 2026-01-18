import Anthropic from '@anthropic-ai/sdk'

// Lazy initialization to avoid browser detection issues in tests
let _anthropic: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
      // Allow browser usage in test environments
      dangerouslyAllowBrowser: process.env.NODE_ENV === 'test' || typeof window !== 'undefined',
    })
  }
  return _anthropic
}

// Available models
export const MODELS = {
  FAST: 'claude-3-haiku-20240307',
  BALANCED: 'claude-3-5-sonnet-20241022',
  POWERFUL: 'claude-3-opus-20240229',
} as const

export interface AnalysisRequest {
  text: string
  task: 'extract_entities' | 'detect_contradictions' | 'analyze_claims' | 'summarize' | 'custom'
  customPrompt?: string
  model?: keyof typeof MODELS
  jsonMode?: boolean
}

export interface AnalysisResponse {
  result: unknown
  model: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * System prompts for different analysis tasks
 */
const SYSTEM_PROMPTS = {
  extract_entities: `You are a forensic analyst extracting entities from legal documents.
Extract all named entities and classify them:
- PERSON: Individual names
- ORGANIZATION: Companies, institutions, agencies
- PROFESSIONAL: Named professionals with roles (social worker, expert witness, etc.)
- COURT: Court names and references
- DATE: Specific dates and date ranges
- LOCATION: Places and addresses
- DOCUMENT: Document references and exhibits

Return JSON format:
{
  "entities": [
    {"text": "...", "type": "...", "context": "..."}
  ]
}`,

  detect_contradictions: `You are a forensic analyst detecting contradictions in legal documents.
Compare statements and identify:
- Direct contradictions: Statements that cannot both be true
- Temporal contradictions: Timeline inconsistencies
- Logical contradictions: Statements that undermine each other
- Omission contradictions: Key information present in one source but absent in another

Return JSON format:
{
  "contradictions": [
    {
      "type": "direct|temporal|logical|omission",
      "severity": "critical|high|medium|low",
      "statement_a": "...",
      "statement_b": "...",
      "explanation": "..."
    }
  ]
}`,

  analyze_claims: `You are a forensic analyst evaluating institutional claims.
For each claim, assess:
- Foundation type: verified, supported, unsupported, contested, circular, contaminated, unfounded
- Evidence quality: What evidence supports or contradicts this claim?
- Source reliability: Is the source credible and independent?

Return JSON format:
{
  "claims": [
    {
      "claim_text": "...",
      "claim_type": "factual|opinion|finding|recommendation|conclusion|allegation",
      "foundation_type": "...",
      "confidence": 0.0-1.0,
      "evidence": ["..."],
      "concerns": ["..."]
    }
  ]
}`,

  summarize: `You are a forensic analyst summarizing legal documents.
Provide a structured summary including:
- Key facts and findings
- Timeline of events
- Named parties and their roles
- Important claims and allegations
- Evidence referenced

Keep the summary factual and objective.`,
}

/**
 * Run analysis on text using Anthropic
 */
export async function analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
  const model = MODELS[request.model || 'BALANCED']

  const systemPrompt =
    request.task === 'custom' ? request.customPrompt : SYSTEM_PROMPTS[request.task]

  // IMPORTANT: Do NOT send requests if key is missing/dummy
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'dummy_key') {
    throw new Error('ANTHROPIC_API_KEY is missing')
  }

  const msg = await getAnthropicClient().messages.create({
    model,
    max_tokens: 4096,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: 'user', content: request.text }],
  })

  // Anthropic text content extraction
  const contentBlock = msg.content[0]
  const content = contentBlock.type === 'text' ? contentBlock.text : ''

  let result: unknown
  // If JSON mode requested or task implies it, try parse
  if (request.task !== 'summarize') {
    try {
      // Find JSON in content if wrapped in markdown blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content
      result = JSON.parse(jsonStr)
    } catch {
      result = content // Fallback
    }
  } else {
    result = content
  }

  return {
    result,
    model,
    usage: {
      input_tokens: msg.usage.input_tokens,
      output_tokens: msg.usage.output_tokens,
    },
  }
}
