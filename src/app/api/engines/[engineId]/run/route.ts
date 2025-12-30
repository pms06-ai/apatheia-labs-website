/**
 * ENGINE EXECUTION API
 * POST /api/engines/[engineId]/run
 * 
 * Runs a specific analysis engine on selected documents
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { omissionEngine } from '@/lib/engines/omission'
import { contradictionEngine } from '@/lib/engines/contradiction'
import { narrativeEngine } from '@/lib/engines/narrative'
import { logger } from '@/lib/logger'
import { runEngineSchema, formatZodError } from '@/lib/validation'
import { toAppError } from '@/lib/errors'

type EngineId = 'omission' | 'contradiction' | 'narrative' | 'expert_witness' | 'documentary' | 'coordination' | 'temporal_parser' | 'entity_resolution' | 'argumentation' | 'bias_detection' | 'accountability_audit' | 'professional_tracker'

export async function POST(
  request: NextRequest,
  { params }: { params: { engineId: string } }
) {
  const startTime = Date.now()
  const engineId = params.engineId as EngineId
  const log = logger

  try {
    // Validate request body
    const body = await request.json().catch(() => ({}))
    const validation = runEngineSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: formatZodError(validation.error) },
        { status: 400 }
      )
    }

    const { caseId, documentIds, options } = validation.data
    const supabaseAdmin = createAdminClient()

    // Validate case exists
    const { data: caseData, error: caseError } = await supabaseAdmin
      .from('cases')
      .select('id, name')
      .eq('id', caseId)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }

    // Get documents
    const { data: documents, error: docError } = await supabaseAdmin
      .from('documents')
      .select('*')
      .in('id', documentIds)

    if (docError || !documents?.length) {
      return NextResponse.json(
        { error: 'No documents found' },
        { status: 404 }
      )
    }

    // Log analysis start
    log.info(`Running ${engineId} engine`, { caseId, documentCount: documents.length })

    let result: any

    switch (engineId) {
      case 'omission': {
        // Omission requires source and report documents
        const sourceIds = options?.sourceDocIds || documentIds.filter((id: string) =>
          documents.find((d: any) => d.id === id)?.doc_type?.includes('police') ||
          documents.find((d: any) => d.id === id)?.doc_type?.includes('disclosure')
        )
        const reportIds = options?.reportDocIds || documentIds.filter((id: string) =>
          documents.find((d: any) => d.id === id)?.doc_type?.includes('assessment') ||
          documents.find((d: any) => d.id === id)?.doc_type?.includes('report')
        )

        const sources = documents.filter((d: any) => sourceIds.includes(d.id))
        const reports = documents.filter((d: any) => reportIds.includes(d.id))

        if (sources.length === 0 || reports.length === 0) {
          return NextResponse.json(
            { error: 'Omission detection requires both source and report documents' },
            { status: 400 }
          )
        }

        // Run omission analysis for each source-report pair
        const results = []
        for (const source of sources) {
          for (const report of reports) {
            const analysis = await omissionEngine.detectOmissions(source, report, caseId)
            results.push(analysis)
          }
        }

        result = {
          engine: 'omission',
          analyses: results,
          summary: {
            totalFindings: results.reduce((sum, r) => sum + r.findings.length, 0),
            criticalCount: results.reduce((sum, r) => sum + r.summary.criticalCount, 0),
            averageBiasScore: results.reduce((sum, r) => sum + r.summary.biasScore, 0) / results.length
          }
        }
        break
      }

      case 'contradiction': {
        if (options?.specificClaim) {
          // Track evolution of a specific claim
          result = await contradictionEngine.trackClaimEvolution(
            options.specificClaim,
            documents,
            caseId
          )
        } else {
          // Full contradiction analysis
          result = await contradictionEngine.detectContradictions(documents, caseId)
        }
        break
      }

      case 'narrative': {
        if (options?.specificClaim) {
          // Track specific claim
          result = await narrativeEngine.trackSpecificClaim(
            options.specificClaim,
            documents,
            caseId
          )
        } else {
          // Full narrative analysis
          result = await narrativeEngine.analyzeNarrativeEvolution(documents, caseId)
        }
        break
      }

      case 'expert_witness': {
        // Find expert reports and instruction letters
        const expertReports = documents.filter((d: any) => d.doc_type === 'expert_report')
        const instructions = documents.filter((d: any) =>
          d.filename.toLowerCase().includes('instruction') ||
          d.doc_type === 'instruction_letter'
        )

        if (expertReports.length === 0) {
          return NextResponse.json(
            { error: 'No expert reports found in selected documents' },
            { status: 400 }
          )
        }

        // Import dynamically to avoid issues if file doesn't exist
        const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

        const results = []
        for (const report of expertReports) {
          const instruction = instructions[0] || null // Use first instruction letter if available
          const analysis = await expertWitnessEngine.analyze(report.id, instruction?.id || null, caseId)
          results.push({ reportId: report.id, analysis })
        }

        result = {
          engine: 'expert_witness',
          analyses: results,
          summary: {
            reportsAnalyzed: results.length,
            totalViolations: results.reduce((sum, r) => sum + r.analysis.violations.length, 0),
            criticalIssues: results.reduce((sum, r) => sum + r.analysis.summary.criticalCount, 0)
          }
        }
        break
      }

      case 'temporal_parser': {
        const { temporalEngine } = await import('@/lib/engines/temporal')
        result = await temporalEngine.parseTemporalEvents(documents, caseId)
        break
      }

      case 'argumentation': {
        const { legacyEngines } = await import('@/lib/engines/legacy')
        result = await legacyEngines.analyzeArgumentation(documents, caseId)
        break
      }

      case 'bias_detection': {
        const { legacyEngines } = await import('@/lib/engines/legacy')
        result = await legacyEngines.detectBias(documents, caseId)
        break
      }

      case 'accountability_audit': {
        const { legacyEngines } = await import('@/lib/engines/legacy')
        result = await legacyEngines.auditAccountability(documents, caseId)
        break
      }

      case 'professional_tracker': {
        const { legacyEngines } = await import('@/lib/engines/legacy')
        result = await legacyEngines.trackProfessional(documents, caseId)
        break
      }

      case 'entity_resolution': {
        const { entityResolutionEngine } = await import('@/lib/engines/entity-resolution')
        result = await entityResolutionEngine.resolveEntities(documents, caseId)
        break
      }

      case 'coordination': {
        const { coordinationEngine } = await import('@/lib/engines/coordination')
        result = await coordinationEngine.analyzeCoordination(documents, caseId)
        break
      }

      case 'documentary': {
        const { documentaryEngine } = await import('@/lib/engines/documentary')
        result = await documentaryEngine.analyzeDocumentaryBias(documents, caseId)
        break
      }

      default:
        return NextResponse.json(
          { error: `Engine '${engineId}' not implemented` },
          { status: 501 }
        )
    }

    // Log completion
    const duration = Date.now() - startTime
    log.info(`Engine ${engineId} completed`, { caseId, durationMs: duration })

    return NextResponse.json({
      success: true,
      engine: engineId,
      caseId,
      documentsAnalyzed: documents.length,
      durationMs: duration,
      result
    })

  } catch (error) {
    const appError = toAppError(error)
    log.error(`Engine ${engineId} failed`, error instanceof Error ? error : undefined, {
      engineId,
      durationMs: Date.now() - startTime,
    })

    return NextResponse.json(
      {
        error: appError.message,
        code: appError.code,
        ...(process.env.NODE_ENV === 'development' && { stack: appError.stack })
      },
      { status: appError.statusCode }
    )
  }
}

// GET - Get engine status and metadata
export async function GET(
  request: NextRequest,
  { params }: { params: { engineId: string } }
) {
  const { ENGINE_REGISTRY } = await import('@/lib/engines')
  const engineId = params.engineId as keyof typeof ENGINE_REGISTRY

  if (!ENGINE_REGISTRY[engineId]) {
    return NextResponse.json(
      { error: 'Engine not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    engine: ENGINE_REGISTRY[engineId],
    status: 'ready'
  })
}
