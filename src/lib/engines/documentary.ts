/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateJSON } from '@/lib/ai-client'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { Document } from '@/types'

// Prompt for analyzing editorial bias
const DOCUMENTARY_ANALYSIS_PROMPT = `
Analyze these documents for editorial manipulation and bias.

Documents to analyze:
{documents}

Focus on:
1. Selective Editing - Are key context or counter-arguments omitted?
2. Framing - Is language used to prime the reader/viewer?
3. Music/Visual Cues (if described) - Emotional manipulation?
4. Source Credibility - Are sources vetted or taken at face value?
5. Right of Reply - Was the subject given a fair chance to respond?

Return your analysis in JSON format:
{
  "bias_score": 0-100, // 100 = heavily biased
  "editorial_techniques": [
    {
      "technique": "Selective Editing|Framing|Emotional Manipulation",
      "severity": "critical|high|medium|low",
      "description": "...",
      "evidence": "..."
    }
  ],
  "omitted_context": [
    {
      "topic": "...",
      "significance": "high|medium|low",
      "impact": "..."
    }
  ],
  "summary": "..."
}`

export interface DocumentaryFinding {
    id: string
    technique: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    description: string
    evidence: string
}

export interface DocumentaryAnalysisResult {
    biasScore: number
    findings: DocumentaryFinding[]
    omittedContext: Array<{ topic: string, significance: string, impact: string }>
    summary: string
}

export async function analyzeDocumentaryBias(
    documents: Document[],
    caseId: string
): Promise<DocumentaryAnalysisResult> {

    const docContents = documents.slice(0, 5).map(d =>
        `=== ${d.filename} ===\nType: ${d.doc_type}\n\n${d.extracted_text?.slice(0, 8000) || ''}`
    ).join('\n\n')

    let result: any;

    // Use mock data if in placeholder mode or explicitly requested
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        console.log('[MOCK ENGINE] Using Mock Documentary Analysis')
        await new Promise(resolve => setTimeout(resolve, 2000))

        result = {
            bias_score: 85,
            editorial_techniques: [
                {
                    technique: "Selective Editing",
                    severity: "critical",
                    description: "Key exculpatory evidence regarding the timeline was omitted.",
                    evidence: "The footage cuts before the subject explains the reason for their presence."
                },
                {
                    technique: "Framing",
                    severity: "high",
                    description: "Subject is consistently referred to using derogatory terminology.",
                    evidence: "Repeated use of 'aggressive' to describe defensive posture."
                }
            ],
            omitted_context: [
                { topic: "Prior Police Contact", significance: "high", impact: "Creates false impression of first offense" }
            ],
            summary: "The documentary exhibits significant editorial bias, primarily through selective editing of confrontation scenes to portray the subject as the aggressor."
        }
    } else {
        result = await generateJSON('You are a media forensics expert.', DOCUMENTARY_ANALYSIS_PROMPT.replace('{documents}', docContents))
    }

    // Process and store findings
    const analysisResult: DocumentaryAnalysisResult = {
        biasScore: result.bias_score,
        findings: result.editorial_techniques.map((t: any, i: number) => ({
            id: `doc-bias-${i}`,
            technique: t.technique,
            severity: t.severity,
            description: t.description,
            evidence: t.evidence
        })),
        omittedContext: result.omitted_context || [],
        summary: result.summary
    }

    await storeDocumentaryFindings(caseId, analysisResult, documents)

    return analysisResult
}

async function storeDocumentaryFindings(
    caseId: string,
    result: DocumentaryAnalysisResult,
    documents: Document[]
) {
    const findings = result.findings.map(f => ({
        case_id: caseId,
        engine: 'documentary',
        title: `Editorial Bias: ${f.technique}`,
        description: f.description,
        severity: f.severity,
        document_ids: documents.map(d => d.id),
        evidence: {
            technique: f.technique,
            quote: f.evidence,
            biasScore: result.biasScore
        }
    }))

    if (findings.length > 0) {
        await supabaseAdmin.from('findings').insert(findings)
    }
}

export const documentaryEngine = {
    analyzeDocumentaryBias
}
