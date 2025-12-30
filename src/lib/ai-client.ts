/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPreferredAIProvider } from './env'
import { analyze as analyzeGroq } from './groq'
import { analyze as analyzeAnthropic } from './anthropic'

export type AIProvider = 'anthropic' | 'groq' | 'gemini' | 'openai' | 'mock'

interface AnalysisRequest {
    text: string
    task: 'extract_entities' | 'detect_contradictions' | 'analyze_claims' | 'summarize' | 'custom'
    customPrompt?: string
    model?: string // Generic model support
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
 * Route analysis request to the preferred provider
 */
export async function analyze(request: AnalysisRequest): Promise<AnalysisResponse> {
    const provider = getPreferredAIProvider()

    switch (provider) {
        case 'anthropic':
            // Map generic request to Anthropic specific if needed
            return analyzeAnthropic(request as any)

        case 'groq': {
            const gResponse = await analyzeGroq(request as any)
            return {
                ...gResponse,
                usage: {
                    input_tokens: gResponse.usage.prompt_tokens,
                    output_tokens: gResponse.usage.completion_tokens
                }
            }
        }

        // Future providers
        case 'gemini':
        case 'openai':
            throw new Error(`Provider ${provider} not yet implemented in unified client`)

        case 'mock':
            console.log(`[MOCK AI] Analyzing task: ${request.task}`)
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Return context-aware mock data
            return {
                model: 'mock-model-v1',
                result: getMockResponse(request),
                usage: { input_tokens: 100, output_tokens: 50 }
            }

        default:
            // Fallback
            throw new Error("Unknown AI provider")
    }
}

function getMockResponse(request: AnalysisRequest): any {
    switch (request.task) {
        case 'extract_entities':
            return {
                entities: [
                    { text: 'John Doe', type: 'PERSON', context: 'Mentioned in statement' },
                    { text: 'Metropolitan Police', type: 'ORGANIZATION', context: 'Investigating body' }
                ]
            }
        case 'detect_contradictions':
            return {
                contradictions: [
                    {
                        title: 'Conflicting dates',
                        type: 'temporal',
                        description: 'Date mismatch between reports',
                        explanation: 'One report says Jan 1st, another Jan 2nd',
                        severity: 'medium'
                    }
                ]
            }
        case 'analyze_claims':
            return {
                claims: [
                    {
                        claim_text: 'Subject was present',
                        claim_type: 'factual',
                        foundation_type: 'supported',
                        confidence: 0.9
                    }
                ]
            }
        case 'summarize':
            return { summary: 'This is a mock summary of the provided document content.' }

        case 'custom':
        default:
            // Try to guess based on prompt content if it's a JSON request
            if (request.jsonMode || request.text?.includes('JSON')) {
                if (request.text?.includes('citations')) return { citations: ['Doc A', 'Report B'] }
                if (request.text?.includes('violation')) return {
                    violations: [{ type: 'scope_exceeded', title: 'Mock Violation', severity: 'medium', description: 'Mock violation description' }],
                    summary: { criticalCount: 0, overallAssessment: 'Compliant' }
                }
                if (request.text?.includes('shared language')) return {
                    sharedLanguage: [],
                    informationFlow: [],
                    independenceViolations: []
                }
                return {
                    analysis: 'Mock custom analysis result',
                    mock_data: true
                }
            }
            return "This is a mock response for the custom task."
    }
}

/**
 * Direct JSON generation helper (Provider agnostic)
 */
export async function generateJSON(systemPrompt: string, userContent: string): Promise<any> {
    const response = await analyze({
        task: 'custom',
        customPrompt: systemPrompt,
        text: userContent,
        jsonMode: true
    })

    return response.result
}

/**
 * Compare multiple documents for contradictions
 */
export async function compareDocuments(
    documents: Array<{ name: string; content: string }>,
    focusAreas?: string[]
): Promise<string> {
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
  "contradictions": [
    {
      "title": "Short title",
      "type": "direct|temporal|logical|omission",
      "severity": "critical|high|medium|low",
      "statement_a": "Query from Doc A",
      "statement_b": "Query from Doc B",
      "explanation": "..."
    }
  ],
  "omissions": [],
  "timeline_issues": [],
  "unsupported_claims": [],
  "summary": "..."
}`

    const result = await generateJSON('You are a forensic analyst.', prompt)
    return JSON.stringify(result)
}
