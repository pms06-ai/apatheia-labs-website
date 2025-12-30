import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { analyze, compareDocuments } from '@/lib/ai-client'

export const runtime = 'nodejs'
export const maxDuration = 120

type AnalysisType = 'contradictions' | 'claims' | 'entities' | 'summary' | 'compare'

export async function POST(request: NextRequest) {
  try {
    const { caseId, analysisType, documentIds, options } = await request.json() as {
      caseId: string
      analysisType: AnalysisType
      documentIds?: string[]
      options?: Record<string, unknown>
    }

    if (!caseId) {
      return NextResponse.json({ error: 'Case ID required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get documents for analysis
    let query = supabase
      .from('documents')
      .select('id, filename, extracted_text, doc_type')
      .eq('case_id', caseId)
      .eq('status', 'completed')

    if (documentIds?.length) {
      query = query.in('id', documentIds)
    }

    const { data: documents, error } = await query

    if (error || !documents?.length) {
      return NextResponse.json({ error: 'No documents found for analysis' }, { status: 404 })
    }

    let result: unknown

    switch (analysisType) {
      case 'contradictions': {
        // Use Gemini for multi-document comparison
        const docContents = documents.map((d: any) => ({
          name: d.filename,
          content: d.extracted_text?.slice(0, 50000) || '', // Limit per doc
        }))

        const comparisonResult = await compareDocuments(docContents)

        // Parse and store contradictions
        try {
          const parsed = JSON.parse(comparisonResult)

          for (const contradiction of parsed.contradictions || []) {
            await supabase.from('contradictions').insert({
              case_id: caseId,
              title: contradiction.title || 'Detected Contradiction',
              description: contradiction.explanation,
              source_a_text: contradiction.statement_a,
              source_b_text: contradiction.statement_b,
              contradiction_type: contradiction.type,
              severity: contradiction.severity,
            })
          }

          result = parsed
        } catch {
          result = comparisonResult
        }
        break
      }

      case 'claims': {
        // Analyze claims in each document
        const allClaims: unknown[] = []

        for (const doc of documents) {
          if (!doc.extracted_text) continue

          const claimResult = await analyze({
            text: doc.extracted_text.slice(0, 8000),
            task: 'analyze_claims',
            model: 'BALANCED',
          })

          const claims = (claimResult.result as { claims?: unknown[] })?.claims || []

          for (const claim of claims as Array<{
            claim_text: string
            claim_type: string
            foundation_type: string
            confidence: number
          }>) {
            await supabase.from('claims').insert({
              case_id: caseId,
              claim_text: claim.claim_text,
              claim_type: claim.claim_type,
              foundation_type: claim.foundation_type,
              confidence_score: claim.confidence,
              source_document_id: doc.id,
            })

            allClaims.push({ ...claim, document: doc.filename })
          }
        }

        result = { claims: allClaims }
        break
      }

      case 'entities': {
        // Extract entities from all documents
        const allEntities: unknown[] = []

        for (const doc of documents) {
          if (!doc.extracted_text) continue

          const entityResult = await analyze({
            text: doc.extracted_text.slice(0, 8000),
            task: 'extract_entities',
            model: 'FAST',
          })

          const entities = (entityResult.result as { entities?: unknown[] })?.entities || []
          allEntities.push(...entities.map(e => ({ ...e as object, document: doc.filename })))
        }

        result = { entities: allEntities }
        break
      }

      case 'summary': {
        // Summarize all documents
        const combinedText = documents
          .map((d: any) => `=== ${d.filename} ===\n${d.extracted_text?.slice(0, 10000) || ''}`)
          .join('\n\n')

        const summaryResult = await analyze({
          text: combinedText,
          task: 'summarize',
          model: 'BALANCED',
        })

        result = { summary: summaryResult.result }
        break
      }

      case 'compare': {
        const docContents = documents.map((d: any) => ({
          name: d.filename,
          content: d.extracted_text?.slice(0, 50000) || '',
        }))

        result = await compareDocuments(docContents, options?.focusAreas as string[])
        break
      }

      default:
        return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 })
    }

    // Create finding record
    await supabase.from('findings').insert({
      case_id: caseId,
      engine: analysisType === 'compare' ? 'contradiction' : analysisType === 'claims' ? 'argumentation' : 'entity_resolution',
      title: `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis`,
      description: `Automated ${analysisType} analysis of ${documents.length} documents`,
      document_ids: documents.map((d: any) => d.id),
      evidence: { result },
    })

    return NextResponse.json({
      status: 'completed',
      analysis_type: analysisType,
      documents_analyzed: documents.length,
      result,
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
