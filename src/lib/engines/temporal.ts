
import { generateJSON } from '@/lib/ai-client'
import type { Document } from '@/CONTRACT'

export interface TemporalEvent {
    id: string
    date: string
    time?: string
    description: string
    sourceDocumentId: string
    confidence: 'exact' | 'inferred' | 'estimated'
    // Phase 1 enhancements for citation tracking and validation
    rawText?: string                                      // Original extracted text (e.g., "three weeks later")
    position?: number                                     // Character index in source document (from chrono-node)
    dateType?: 'absolute' | 'relative' | 'resolved'       // Type of date reference
    anchorDate?: string                                   // Reference date if dateType='resolved' (YYYY-MM-DD)
    extractionMethod?: 'ai' | 'chrono' | 'validated'      // Which layer confirmed this date
}

export interface TemporalInconsistency {
    description: string
    events: string[]  // event IDs
    severity: 'critical' | 'high' | 'medium'
    // Phase 1 enhancement for inconsistency categorization
    type?: 'BACKDATING' | 'IMPOSSIBLE_SEQUENCE' | 'CONTRADICTION'
}

export interface TemporalAnalysisResult {
    timeline: TemporalEvent[]
    inconsistencies: TemporalInconsistency[]
    // Phase 1 metadata for transparency
    metadata?: {
        documentsAnalyzed: number
        datesExtracted: number
        validationLayersUsed: string[]  // e.g., ['ai', 'chrono', 'date-fns']
    }
}

/**
 * Layer 1: AI Date Extraction Prompt
 * Extracts dates with context including raw text, position, and date type classification.
 * This is the first layer of the multi-layer validation pipeline.
 */
const AI_DATE_EXTRACTION_PROMPT = `
You are a temporal analysis expert extracting dates from legal and institutional documents.
Extract ALL date references from the provided documents with their surrounding context.

For each date found, identify:
1. The normalized date in YYYY-MM-DD format
2. The exact raw text as it appears in the document (e.g., "January 15, 2024", "three weeks later", "last Tuesday")
3. The approximate character position in the document where this date appears
4. Whether this is an absolute date, relative date, or a resolved relative date
5. For relative dates, identify the anchor date if one exists in context
6. A brief description of what event this date refers to

Date Types:
- "absolute": Specific dates like "January 15, 2024", "2024-01-15", "15/01/2024"
- "relative": References like "three weeks later", "the following month", "next Tuesday"
- "resolved": A relative date that has been converted to absolute using context

Documents:
{documents}

Respond ONLY with valid JSON in this exact format:
{
  "events": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM or null",
      "rawText": "exact text from document",
      "position": 123,
      "dateType": "absolute|relative|resolved",
      "anchorDate": "YYYY-MM-DD or null",
      "description": "what this date refers to",
      "sourceDocId": "document ID",
      "confidence": "exact|inferred|estimated"
    }
  ],
  "inconsistencies": [
    {
      "description": "description of the temporal inconsistency",
      "conflictingIndices": [0, 2],
      "severity": "critical|high|medium",
      "type": "BACKDATING|IMPOSSIBLE_SEQUENCE|CONTRADICTION"
    }
  ]
}`

/**
 * Extract and analyze temporal events from documents using AI-powered date extraction.
 * This is the main entry point for temporal analysis.
 *
 * @param documents - Array of documents to analyze
 * @param caseId - Case identifier for tracking
 * @returns Temporal analysis result with timeline, inconsistencies, and metadata
 */
export async function parseTemporalEvents(
    documents: Document[],
    caseId: string
): Promise<TemporalAnalysisResult> {
    const docContents = documents.slice(0, 3).map(d =>
        `=== ID: ${d.id} | ${d.filename} ===\n${d.extracted_text?.slice(0, 5000) || ''}`
    ).join('\n\n')

    let result;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        // Mock mode for development/testing
        await new Promise(resolve => setTimeout(resolve, 1500))
        result = getMockTemporalResult(documents)
    } else {
        // Layer 1: AI-powered date extraction with context
        result = await generateJSON(
            'Temporal Analysis Expert',
            AI_DATE_EXTRACTION_PROMPT.replace('{documents}', docContents)
        )
    }

    // Map AI extraction results to TemporalEvent with Phase 1 fields
    const events: TemporalEvent[] = (result.events || []).map((e: any, i: number) => ({
        id: `time-${i}`,
        date: e.date,
        time: e.time || undefined,
        description: e.description,
        sourceDocumentId: e.sourceDocId,
        confidence: e.confidence || 'inferred',
        // Phase 1 enhancements for citation tracking
        rawText: e.rawText || undefined,
        position: typeof e.position === 'number' ? e.position : undefined,
        dateType: e.dateType || 'absolute',
        anchorDate: e.anchorDate || undefined,
        extractionMethod: 'ai' as const
    }))

    // Map inconsistencies with Phase 1 type categorization
    const inconsistencies: TemporalInconsistency[] = (result.inconsistencies || []).map((inc: any) => ({
        description: inc.description,
        events: (inc.conflictingIndices || []).map((idx: number) => `time-${idx}`),
        severity: inc.severity || 'medium',
        type: inc.type || undefined
    }))

    return {
        timeline: events,
        inconsistencies,
        metadata: {
            documentsAnalyzed: documents.length,
            datesExtracted: events.length,
            validationLayersUsed: ['ai']
        }
    }
}

/**
 * Generate mock temporal analysis result for development/testing.
 * Includes Phase 1 fields for realistic mock data.
 */
function getMockTemporalResult(documents: Document[]) {
    const docId = documents[0]?.id || 'd1'

    return {
        events: [
            {
                date: "2023-01-10",
                rawText: "January 10, 2023",
                position: 245,
                dateType: "absolute",
                description: "Initial referral received",
                sourceDocId: docId,
                confidence: "exact"
            },
            {
                date: "2023-01-12",
                rawText: "12th January 2023",
                position: 892,
                dateType: "absolute",
                description: "Home visit conducted",
                sourceDocId: docId,
                confidence: "exact"
            },
            {
                date: "2023-01-11",
                rawText: "11/01/2023",
                position: 1456,
                dateType: "absolute",
                description: "Report written (anomalous date)",
                sourceDocId: docId,
                confidence: "exact"
            },
            {
                date: "2023-02-02",
                rawText: "three weeks later",
                position: 2103,
                dateType: "resolved",
                anchorDate: "2023-01-12",
                description: "Follow-up assessment completed",
                sourceDocId: docId,
                confidence: "inferred"
            }
        ],
        inconsistencies: [
            {
                description: "Report appears to be written before the visit it describes",
                conflictingIndices: [1, 2],
                severity: "high",
                type: "BACKDATING"
            }
        ]
    }
}

export const temporalEngine = {
    parseTemporalEvents
}
