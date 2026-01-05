'use client'

/**
 * PhaseProgress Component
 *
 * Displays the four-phase S.A.M. analysis progress:
 * ANCHOR → INHERIT → COMPOUND → ARRIVE
 *
 * Each phase shows:
 * - Status (pending/running/complete/failed)
 * - Duration if completed
 * - Metrics if available
 */

import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'
import type { SAMPhase } from '@/CONTRACT'

// ============================================
// Types
// ============================================

interface PhaseInfo {
  id: SAMPhase
  name: string
  symbol: string
  description: string
}

interface PhaseProgressProps {
  currentPhase: SAMPhase | null
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  phaseTimestamps: {
    anchorStartedAt?: string | null
    anchorCompletedAt?: string | null
    inheritStartedAt?: string | null
    inheritCompletedAt?: string | null
    compoundStartedAt?: string | null
    compoundCompletedAt?: string | null
    arriveStartedAt?: string | null
    arriveCompletedAt?: string | null
  }
  metrics?: {
    falsePremisesFound?: number
    propagationChainsFound?: number
    authorityAccumulationsFound?: number
    outcomesLinked?: number
  }
  errorMessage?: string | null
  errorPhase?: string | null
  className?: string
}

// ============================================
// Constants
// ============================================

const PHASES: PhaseInfo[] = [
  {
    id: 'anchor',
    name: 'ANCHOR',
    symbol: 'A',
    description: 'False premise origin identification',
  },
  {
    id: 'inherit',
    name: 'INHERIT',
    symbol: 'N',
    description: 'Claim propagation tracking',
  },
  {
    id: 'compound',
    name: 'COMPOUND',
    symbol: 'C',
    description: 'Authority accumulation mapping',
  },
  {
    id: 'arrive',
    name: 'ARRIVE',
    symbol: 'R',
    description: 'Outcome causation analysis',
  },
]

// ============================================
// Helper Functions
// ============================================

function getPhaseStatus(
  phaseId: SAMPhase,
  currentPhase: SAMPhase | null,
  overallStatus: string,
  timestamps: PhaseProgressProps['phaseTimestamps'],
  errorPhase?: string | null
): 'pending' | 'running' | 'completed' | 'failed' {
  const phaseIndex = PHASES.findIndex(p => p.id === phaseId)
  const currentIndex = currentPhase ? PHASES.findIndex(p => p.id === currentPhase) : -1

  // Check if this phase failed
  if (errorPhase === phaseId) {
    return 'failed'
  }

  // Check if completed based on timestamps
  const completedKey = `${phaseId}CompletedAt` as keyof typeof timestamps
  if (timestamps[completedKey]) {
    return 'completed'
  }

  // Check if running
  const startedKey = `${phaseId}StartedAt` as keyof typeof timestamps
  if (timestamps[startedKey] && !timestamps[completedKey]) {
    return 'running'
  }

  // Check if we're past this phase
  if (currentIndex > phaseIndex) {
    return 'completed'
  }

  // Check if this is the current phase
  if (phaseId === currentPhase) {
    return 'running'
  }

  return 'pending'
}

function formatDuration(startedAt: string, completedAt: string): string {
  const start = new Date(startedAt)
  const end = new Date(completedAt)
  const durationMs = end.getTime() - start.getTime()

  if (durationMs < 1000) {
    return `${durationMs}ms`
  } else if (durationMs < 60000) {
    return `${(durationMs / 1000).toFixed(1)}s`
  } else {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.round((durationMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }
}

function getMetricForPhase(phaseId: SAMPhase, metrics?: PhaseProgressProps['metrics']): string | null {
  if (!metrics) return null

  switch (phaseId) {
    case 'anchor':
      return metrics.falsePremisesFound !== undefined
        ? `${metrics.falsePremisesFound} false premises`
        : null
    case 'inherit':
      return metrics.propagationChainsFound !== undefined
        ? `${metrics.propagationChainsFound} propagation chains`
        : null
    case 'compound':
      return metrics.authorityAccumulationsFound !== undefined
        ? `${metrics.authorityAccumulationsFound} authority markers`
        : null
    case 'arrive':
      return metrics.outcomesLinked !== undefined
        ? `${metrics.outcomesLinked} outcomes linked`
        : null
    default:
      return null
  }
}

// ============================================
// Sub-Components
// ============================================

interface PhaseCardProps {
  phase: PhaseInfo
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration?: string | null
  metric?: string | null
  isLast?: boolean
  errorMessage?: string | null
}

function PhaseCard({ phase, status, duration, metric, isLast, errorMessage }: PhaseCardProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Status indicator */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-lg font-serif transition-all duration-300',
            status === 'completed' && 'bg-status-success-bg text-status-success',
            status === 'running' && 'bg-bronze-600/20 text-bronze-400 ring-2 ring-bronze-500/50',
            status === 'pending' && 'bg-charcoal-800 text-charcoal-500',
            status === 'failed' && 'bg-status-critical-bg text-status-critical'
          )}
        >
          {status === 'running' ? (
            <Spinner size="sm" />
          ) : status === 'completed' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : status === 'failed' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            phase.symbol
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div
            className={cn(
              'w-0.5 h-12 mt-2 transition-colors duration-300',
              status === 'completed' ? 'bg-status-success/30' : 'bg-charcoal-700'
            )}
          />
        )}
      </div>

      {/* Phase details */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2">
          <h4
            className={cn(
              'font-semibold text-sm',
              status === 'completed' && 'text-ivory-100',
              status === 'running' && 'text-bronze-400',
              status === 'pending' && 'text-charcoal-500',
              status === 'failed' && 'text-status-critical'
            )}
          >
            {phase.name}
          </h4>
          {duration && (
            <span className="text-xs text-charcoal-500">
              {duration}
            </span>
          )}
        </div>
        <p
          className={cn(
            'text-xs mt-0.5',
            status === 'pending' ? 'text-charcoal-600' : 'text-charcoal-400'
          )}
        >
          {phase.description}
        </p>
        {metric && status === 'completed' && (
          <p className="text-xs text-bronze-400 mt-1 font-medium">
            {metric}
          </p>
        )}
        {errorMessage && status === 'failed' && (
          <p className="text-xs text-status-critical mt-1">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================

export function PhaseProgress({
  currentPhase,
  status,
  phaseTimestamps,
  metrics,
  errorMessage,
  errorPhase,
  className,
}: PhaseProgressProps) {
  return (
    <div className={cn('p-4 rounded-lg bg-charcoal-900 border border-charcoal-800', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ivory-100">
          S.A.M. Analysis
        </h3>
        <span
          className={cn(
            'text-xs px-2 py-0.5 rounded',
            status === 'completed' && 'bg-status-success-bg text-status-success',
            status === 'running' && 'bg-bronze-600/20 text-bronze-400',
            status === 'pending' && 'bg-charcoal-800 text-charcoal-500',
            status === 'failed' && 'bg-status-critical-bg text-status-critical',
            status === 'cancelled' && 'bg-charcoal-800 text-charcoal-400'
          )}
        >
          {status === 'running' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Phases */}
      <div className="mt-2">
        {PHASES.map((phase, index) => {
          const phaseStatus = getPhaseStatus(
            phase.id,
            currentPhase,
            status,
            phaseTimestamps,
            errorPhase
          )

          const startKey = `${phase.id}StartedAt` as keyof typeof phaseTimestamps
          const endKey = `${phase.id}CompletedAt` as keyof typeof phaseTimestamps
          const startedAt = phaseTimestamps[startKey]
          const completedAt = phaseTimestamps[endKey]

          const duration = startedAt && completedAt
            ? formatDuration(startedAt, completedAt)
            : null

          const metric = getMetricForPhase(phase.id, metrics)

          return (
            <PhaseCard
              key={phase.id}
              phase={phase}
              status={phaseStatus}
              duration={duration}
              metric={metric}
              isLast={index === PHASES.length - 1}
              errorMessage={errorPhase === phase.id ? errorMessage : null}
            />
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// Compact Variant
// ============================================

interface PhaseProgressCompactProps {
  currentPhase: SAMPhase | null
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  completedCount: number
  className?: string
}

export function PhaseProgressCompact({
  currentPhase,
  status,
  completedCount,
  className,
}: PhaseProgressCompactProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {PHASES.map((phase, index) => {
        const isCompleted = index < completedCount
        const isRunning = phase.id === currentPhase && status === 'running'

        return (
          <div
            key={phase.id}
            className={cn(
              'w-8 h-8 rounded flex items-center justify-center text-sm font-serif transition-all',
              isCompleted && 'bg-status-success-bg text-status-success',
              isRunning && 'bg-bronze-600/20 text-bronze-400 ring-1 ring-bronze-500/50',
              !isCompleted && !isRunning && 'bg-charcoal-800 text-charcoal-600'
            )}
            title={`${phase.name}: ${phase.description}`}
          >
            {isRunning ? (
              <Spinner size="sm" />
            ) : isCompleted ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              phase.symbol
            )}
          </div>
        )
      })}
      <span className="text-xs text-charcoal-500 ml-1">
        {completedCount}/4
      </span>
    </div>
  )
}
