/**
 * HEALTH CHECK ENDPOINT
 * GET /api/health
 * 
 * Returns system health status including:
 * - Database connectivity
 * - External service availability
 * - System information
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: ServiceCheck
    storage: ServiceCheck
    ai: ServiceCheck
  }
}

interface ServiceCheck {
  status: 'ok' | 'error' | 'unknown'
  latencyMs?: number
  message?: string
}

// Track server start time
const START_TIME = Date.now()

async function checkDatabase(): Promise<ServiceCheck> {
  const start = performance.now()
  try {
    const supabase = createAdminClient()

    // If we are in mock mode, we might just return ok or try the select
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
      return {
        status: 'ok',
        latencyMs: 1,
        message: 'Mock Database Active'
      }
    }

    const { error } = await supabase.from('cases').select('id').limit(1)

    if (error) {
      return {
        status: 'error',
        message: error.message,
      }
    }

    return {
      status: 'ok',
      latencyMs: Math.round(performance.now() - start),
    }
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function checkStorage(): Promise<ServiceCheck> {
  // R2 check - just verify env vars are set
  const hasR2Config = !!(
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  )

  if (!hasR2Config) {
    return {
      status: 'error',
      message: 'R2 configuration missing',
    }
  }

  return { status: 'ok' }
}

async function checkAI(): Promise<ServiceCheck> {
  // Check if AI providers are configured
  const hasGroq = !!process.env.GROQ_API_KEY
  const hasGemini = !!process.env.GOOGLE_AI_API_KEY

  if (!hasGroq && !hasGemini) {
    return {
      status: 'error',
      message: 'No AI provider configured',
    }
  }

  if (!hasGroq || !hasGemini) {
    return {
      status: 'ok',
      message: `Partial config: Groq=${hasGroq}, Gemini=${hasGemini}`,
    }
  }

  return { status: 'ok' }
}

export async function GET() {
  const timestamp = new Date().toISOString()

  // Run all health checks in parallel
  const [database, storage, ai] = await Promise.all([
    checkDatabase(),
    checkStorage(),
    checkAI(),
  ])

  const checks = { database, storage, ai }

  // Determine overall status
  const allOk = Object.values(checks).every(c => c.status === 'ok')
  const anyError = Object.values(checks).some(c => c.status === 'error')

  let status: HealthCheck['status']
  if (allOk) {
    status = 'healthy'
  } else if (anyError) {
    status = 'unhealthy'
  } else {
    status = 'degraded'
  }

  const health: HealthCheck = {
    status,
    timestamp,
    version: process.env.npm_package_version || '0.1.0',
    uptime: Math.round((Date.now() - START_TIME) / 1000),
    checks,
  }

  const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}

// HEAD request for simple liveness check
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
