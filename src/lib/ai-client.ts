import { analyze as analyzeAnthropic, MODELS as ANTHROPIC_MODELS } from './anthropic'
import type { AnalysisRequest as AnthropicAnalysisRequest } from './anthropic'

export type AIProvider = 'anthropic'

interface AnalysisRequest {
  text: string
  task: 'extract_entities' | 'detect_contradictions' | 'analyze_claims' | 'summarize' | 'custom'
  customPrompt?: string
  model?: string
  jsonMode?: boolean
}

interface AnalysisResponse {
  result: unknown
  model: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * Route analysis request to Anthropic (Claude)
 */
export async function analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
  return analyzeAnthropic(toAnthropicRequest(request))
}

function toAnthropicRequest(request: AnalysisRequest): AnthropicAnalysisRequest {
  const model = resolveAnthropicModel(request.model)
  return {
    text: request.text,
    task: request.task,
    customPrompt: request.customPrompt,
    model,
    jsonMode: request.jsonMode,
  }
}

function resolveAnthropicModel(model?: string): AnthropicAnalysisRequest['model'] {
  if (!model) return undefined
  return isValidAnthropicModel(model) ? model : undefined
}

function isValidAnthropicModel(model: string): model is keyof typeof ANTHROPIC_MODELS {
  return Object.prototype.hasOwnProperty.call(ANTHROPIC_MODELS, model)
}

/**
 * Direct JSON generation helper
 * Supports two call signatures:
 * 1. generateJSON<T>(prompt) - single prompt containing instructions
 * 2. generateJSON<T>(systemPrompt, userContent) - system + user
 */
export async function generateJSON<T = unknown>(
  promptOrSystem: string,
  userContent?: string
): Promise<T> {
  const response = await analyze({
    task: 'custom',
    customPrompt: userContent ? promptOrSystem : '',
    text: userContent || promptOrSystem,
    jsonMode: true,
  })

  return response.result as T
}
