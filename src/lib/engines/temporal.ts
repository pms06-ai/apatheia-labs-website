
/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateJSON } from '@/lib/ai-client'
import type { Document } from '@/CONTRACT'

export interface TemporalEvent {
    id: string
    date: string
    time?: string
    description: string
    sourceDocumentId: string
    confidence: 'exact' | 'inferred' | 'estimated'
}

export interface TemporalAnalysisResult {
    timeline: TemporalEvent[]
    inconsistencies: {
        description: string
        events: string[] // event IDs
        severity: 'critical' | 'high' | 'medium'
    }[]
}

const TEMPORAL_PARSER_PROMPT = `
Extract a chronological timeline from these documents.
Identify specific dates and times.
Flag any timeline inconsistencies (e.g., events happening before their cause, or conflicting dates for the same event).

Documents:
{documents}

Respond in JSON:
{
  "events": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "description": "...",
      "sourceDocId": "...",
      "confidence": "exact|inferred|estimated"
    }
  ],
  "inconsistencies": [
    {
      "description": "...",
      "conflictingIndices": [0, 2],
      "severity": "critical|high|medium"
    }
  ]
}`

export async function parseTemporalEvents(
    documents: Document[],
    caseId: string
): Promise<TemporalAnalysisResult> {
    const docContents = documents.slice(0, 3).map(d =>
        `=== ID: ${d.id} | ${d.filename} ===\n${d.extracted_text?.slice(0, 5000) || ''}`
    ).join('\n\n')

    let result;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        console.log('[MOCK ENGINE] Using Mock Temporal Analysis')
        await new Promise(resolve => setTimeout(resolve, 1500))
        result = {
            events: [
                { date: "2023-01-10", description: "Initial referral received", sourceDocId: documents[0]?.id || 'd1', confidence: "exact" },
                { date: "2023-01-12", description: "Home visit conducted", sourceDocId: documents[0]?.id || 'd1', confidence: "exact" },
                { date: "2023-01-11", description: "Report written (anomalous date)", sourceDocId: documents[0]?.id || 'd1', confidence: "exact" }
            ],
            inconsistencies: [
                {
                    description: "Report appears to be written before the visit it describes",
                    conflictingIndices: [1, 2],
                    severity: "high"
                }
            ]
        }
    } else {
        result = await generateJSON('Temporal Parser', TEMPORAL_PARSER_PROMPT.replace('{documents}', docContents))
    }

    const events: TemporalEvent[] = (result.events || []).map((e: any, i: number) => ({
        id: `time-${i}`,
        date: e.date,
        time: e.time,
        description: e.description,
        sourceDocumentId: e.sourceDocId,
        confidence: e.confidence
    }))

    const inconsistencies = (result.inconsistencies || []).map((inc: any) => ({
        description: inc.description,
        events: (inc.conflictingIndices || []).map((idx: number) => `time-${idx}`),
        severity: inc.severity
    }))

    return { timeline: events, inconsistencies }
}

export const temporalEngine = {
    parseTemporalEvents
}
