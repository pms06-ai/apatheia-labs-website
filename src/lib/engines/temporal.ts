
import { generateJSON } from '@/lib/ai-client'
import type { Document } from '@/CONTRACT'
import * as chrono from 'chrono-node'
import { format, isValid, parseISO } from 'date-fns'

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
 * Layer 2: Chrono-node Validation
 * Validates AI-extracted dates by checking if they exist in the source text.
 * This prevents hallucination by confirming dates with chrono-node's parsing.
 *
 * @param aiEvents - Events extracted by AI (Layer 1)
 * @param documentText - Original document text for validation
 * @returns Validated events with updated extraction method and position
 */
function validateWithChronoNode(
    aiEvents: Array<{
        date: string
        time?: string
        rawText?: string
        position?: number
        dateType?: string
        anchorDate?: string
        description: string
        sourceDocId: string
        confidence: string
    }>,
    documentText: string
): Array<{
    date: string
    time?: string
    rawText?: string
    position?: number
    dateType?: string
    anchorDate?: string
    description: string
    sourceDocId: string
    confidence: string
    extractionMethod: 'ai' | 'chrono' | 'validated'
    chronoValidated: boolean
}> {
    // Parse document text with chrono-node to find all date references
    const chronoResults = chrono.parse(documentText)

    return aiEvents.map(event => {
        // Try to find a matching chrono-node result for this AI-extracted date
        const match = chronoResults.find(chronoResult => {
            // Match by raw text (exact or contained)
            if (event.rawText) {
                const normalizedEventText = event.rawText.toLowerCase().trim()
                const normalizedChronoText = chronoResult.text.toLowerCase().trim()

                if (normalizedEventText === normalizedChronoText ||
                    normalizedChronoText.includes(normalizedEventText) ||
                    normalizedEventText.includes(normalizedChronoText)) {
                    return true
                }
            }

            // Match by position (±10 characters tolerance)
            if (typeof event.position === 'number') {
                const positionTolerance = 10
                if (chronoResult.index >= event.position - positionTolerance &&
                    chronoResult.index <= event.position + positionTolerance) {
                    return true
                }
            }

            // Match by parsed date value (same day)
            try {
                const eventDate = new Date(event.date)
                const chronoDate = chronoResult.start.date()
                if (eventDate.toISOString().split('T')[0] === chronoDate.toISOString().split('T')[0]) {
                    return true
                }
            } catch {
                // Date parsing failed, skip this match method
            }

            return false
        })

        if (match) {
            // Chrono-node confirmed this date exists in source - upgrade to validated
            return {
                ...event,
                rawText: event.rawText || match.text, // Use chrono-node's text if AI didn't provide
                position: match.index, // Use chrono-node's more precise position
                extractionMethod: 'validated' as const, // Both AI and chrono-node agree
                chronoValidated: true
            }
        } else {
            // Could not validate with chrono-node - keep as AI-only extraction
            // Note: This doesn't necessarily mean hallucination - chrono-node may miss
            // relative dates or unusual formats that AI correctly identified
            return {
                ...event,
                extractionMethod: 'ai' as const,
                chronoValidated: false
            }
        }
    })
}

/**
 * Filter events to remove likely hallucinations.
 * Events with chrono validation or high confidence are kept.
 * Unvalidated events with low confidence may be filtered.
 *
 * @param events - Events after chrono-node validation
 * @returns Filtered events with hallucinations removed
 */
function filterHallucinatedDates<T extends { chronoValidated: boolean; confidence: string; dateType?: string }>(
    events: T[]
): T[] {
    return events.filter(event => {
        // Always keep chrono-validated events
        if (event.chronoValidated) return true

        // Keep relative dates even without chrono validation (chrono may not parse "three weeks later")
        if (event.dateType === 'relative' || event.dateType === 'resolved') return true

        // Keep high-confidence events from AI even without chrono validation
        if (event.confidence === 'exact') return true

        // Filter out estimated/inferred absolute dates that chrono couldn't validate
        // These are most likely to be hallucinations
        return false
    })
}

/**
 * Layer 3: date-fns Normalization and Validation
 * Validates all dates with isValid() and normalizes to YYYY-MM-DD format.
 * This ensures consistent date storage and filters out malformed dates.
 *
 * @param events - Events after chrono-node validation and hallucination filtering
 * @returns Events with normalized dates, invalid dates filtered out
 */
function normalizeWithDateFns<T extends { date: string }>(
    events: T[]
): Array<T & { normalizedDate: string; dateFnsValidated: boolean }> {
    return events
        .map(event => {
            // Attempt to parse the date string
            // First try parseISO for standard ISO formats (YYYY-MM-DD, ISO 8601)
            let parsedDate = parseISO(event.date)

            // If parseISO fails, try JavaScript Date constructor as fallback
            if (!isValid(parsedDate)) {
                parsedDate = new Date(event.date)
            }

            // Check if the parsed date is valid
            const dateIsValid = isValid(parsedDate)

            // Normalize to YYYY-MM-DD format if valid
            const normalizedDate = dateIsValid
                ? format(parsedDate, 'yyyy-MM-dd')
                : event.date // Keep original if invalid (will be filtered)

            return {
                ...event,
                date: normalizedDate, // Update to normalized format
                normalizedDate,
                dateFnsValidated: dateIsValid
            }
        })
        .filter(event => event.dateFnsValidated) // Filter out invalid dates
}

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

    // Map AI extraction results to intermediate format for validation
    const aiExtractedEvents = (result.events || []).map((e: any) => ({
        date: e.date,
        time: e.time || undefined,
        rawText: e.rawText || undefined,
        position: typeof e.position === 'number' ? e.position : undefined,
        dateType: e.dateType || 'absolute',
        anchorDate: e.anchorDate || undefined,
        description: e.description,
        sourceDocId: e.sourceDocId,
        confidence: e.confidence || 'inferred'
    }))

    // Layer 2: Chrono-node validation to prevent hallucination
    // Validate AI-extracted dates against chrono-node's parsing of source text
    const validatedEvents = validateWithChronoNode(aiExtractedEvents, docContents)

    // Filter out likely hallucinated dates
    const filteredEvents = filterHallucinatedDates(validatedEvents)

    // Layer 3: date-fns normalization and validation
    // Normalizes all dates to YYYY-MM-DD format and filters invalid dates
    const normalizedEvents = normalizeWithDateFns(filteredEvents)

    // Map validated results to TemporalEvent with Phase 1 fields
    const events: TemporalEvent[] = normalizedEvents.map((e, i: number) => ({
        id: `time-${i}`,
        date: e.date,
        time: e.time || undefined,
        description: e.description,
        sourceDocumentId: e.sourceDocId,
        confidence: e.confidence as 'exact' | 'inferred' | 'estimated',
        // Phase 1 enhancements for citation tracking
        rawText: e.rawText || undefined,
        position: e.position,
        dateType: e.dateType as 'absolute' | 'relative' | 'resolved' | undefined,
        anchorDate: e.anchorDate || undefined,
        extractionMethod: e.extractionMethod
    }))

    // Map inconsistencies with Phase 1 type categorization
    const inconsistencies: TemporalInconsistency[] = (result.inconsistencies || []).map((inc: any) => ({
        description: inc.description,
        events: (inc.conflictingIndices || []).map((idx: number) => `time-${idx}`),
        severity: inc.severity || 'medium',
        type: inc.type || undefined
    }))

    // Track validation layers used for transparency
    const validationLayers: string[] = ['ai', 'chrono', 'date-fns']
    const chronoValidatedCount = normalizedEvents.filter(e => e.chronoValidated).length
    const dateFnsValidatedCount = normalizedEvents.filter(e => e.dateFnsValidated).length

    return {
        timeline: events,
        inconsistencies,
        metadata: {
            documentsAnalyzed: documents.length,
            datesExtracted: events.length,
            validationLayersUsed: validationLayers
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
