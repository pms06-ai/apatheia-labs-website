import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { runEngine, runEngines, getActiveEngines, getNewEngines, ENGINE_REGISTRY } from '@/lib/engines'
import type { EngineId, EngineRunParams } from '@/lib/engines'

/**
 * GET /api/engines
 * List available engines and their status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') // 'active', 'new', 'all'

  let engines
  switch (filter) {
    case 'active':
      engines = getActiveEngines()
      break
    case 'new':
      engines = getNewEngines()
      break
    default:
      engines = Object.values(ENGINE_REGISTRY)
  }

  return NextResponse.json({
    engines,
    counts: {
      total: Object.keys(ENGINE_REGISTRY).length,
      active: getActiveEngines().length,
      new: getNewEngines().length
    }
  })
}

/**
 * POST /api/engines
 * Run one or more analysis engines
 * 
 * Body:
 * {
 *   "runs": [
 *     {
 *       "engineId": "omission",
 *       "caseId": "uuid",
 *       "documentIds": ["source-uuid", "target-uuid"],
 *       "options": {}
 *     }
 *   ]
 * }
 * 
 * Or single run:
 * {
 *   "engineId": "expert_witness",
 *   "caseId": "uuid",
 *   "documentIds": ["report-uuid", "instruction-uuid"]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Handle batch runs
    if (body.runs && Array.isArray(body.runs)) {
      const params: EngineRunParams[] = body.runs.map((run: any) => ({
        engineId: run.engineId as EngineId,
        caseId: run.caseId,
        documentIds: run.documentIds,
        options: run.options
      }))

      // Verify user has access to all cases
      const caseIds = [...new Set(params.map(p => p.caseId))]
      const { data: cases, error: casesError } = await supabase
        .from('cases')
        .select('id')
        .in('id', caseIds)
        .eq('user_id', user.id)

      if (casesError || !cases || cases.length !== caseIds.length) {
        return NextResponse.json(
          { error: 'Access denied to one or more cases' },
          { status: 403 }
        )
      }

      const results = await runEngines(params)

      return NextResponse.json({
        success: results.every(r => r.success),
        results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          totalDuration: results.reduce((sum, r) => sum + r.duration, 0)
        }
      })
    }

    // Handle single run
    const { engineId, caseId, documentIds, options } = body

    if (!engineId || !caseId || !documentIds) {
      return NextResponse.json(
        { error: 'Missing required fields: engineId, caseId, documentIds' },
        { status: 400 }
      )
    }

    // Verify engine exists
    if (!ENGINE_REGISTRY[engineId as EngineId]) {
      return NextResponse.json(
        { error: `Unknown engine: ${engineId}` },
        { status: 400 }
      )
    }

    // Verify user has access to case
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id')
      .eq('id', caseId)
      .eq('user_id', user.id)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: 'Case not found or access denied' },
        { status: 403 }
      )
    }

    // Verify documents belong to case
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('id')
      .in('id', documentIds)
      .eq('case_id', caseId)

    if (docsError || !docs || docs.length !== documentIds.length) {
      return NextResponse.json(
        { error: 'One or more documents not found in case' },
        { status: 400 }
      )
    }

    // Run the engine
    const result = await runEngine({
      engineId: engineId as EngineId,
      caseId,
      documentIds,
      options
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      engineId,
      result: result.result,
      duration: result.duration
    })

  } catch (error) {
    console.error('Engine API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
