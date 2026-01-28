/**
 * Investigation Progress Component
 *
 * Displays real-time progress during investigation.
 */

'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { StopCircle, Activity, CheckCircle, XCircle, Clock } from 'lucide-react'
import type { InvestigationProgress as InvestigationProgressType } from '@/CONTRACT'

// ============================================
// Types
// ============================================

export interface InvestigationProgressProps {
  progress: InvestigationProgressType
  documentCount: number
  onCancel: () => void
}

// ============================================
// Color Constants
// ============================================

const BRONZE = '#b8860b'

// ============================================
// Progress Ring Component
// ============================================

function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = BRONZE
}: {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-charcoal-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500 ease-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-2xl text-charcoal-100">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

// ============================================
// Component
// ============================================

export function InvestigationProgress({
  progress,
  documentCount,
  onCancel,
}: InvestigationProgressProps) {
  const progressPercent = progress ? (progress.completed_engines / progress.total_engines) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-100">Analysis in Progress</h1>
          <p className="text-sm text-charcoal-400">
            Processing {documentCount} documents across {progress?.total_engines || 0} engines
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-status-critical/30 px-4 py-2 text-sm text-status-critical transition hover:bg-status-critical/10"
        >
          <StopCircle className="h-4 w-4" />
          Cancel
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-8 lg:col-span-1">
          <ProgressRing progress={progressPercent} size={160} strokeWidth={12} />
          <p className="mt-4 text-center text-sm text-charcoal-400">
            {progress?.completed_engines || 0} of {progress?.total_engines || 0} engines complete
          </p>
          {progress?.current_engine && (
            <Badge variant="default" className="mt-2">
              <Activity className="mr-1 h-3 w-3 animate-pulse" />
              {progress.current_engine}
            </Badge>
          )}
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-4 font-medium text-charcoal-100">Engine Status</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {progress?.engines.map(engine => (
              <div
                key={engine.engine}
                className={`flex items-center justify-between rounded-lg p-3 transition-all ${
                  engine.status === 'running'
                    ? 'bg-bronze-900/20 border border-bronze-500/30 scale-[1.02]'
                    : engine.status === 'completed'
                    ? 'bg-status-success/5 border border-status-success/20'
                    : engine.status === 'failed'
                    ? 'bg-status-critical/5 border border-status-critical/20'
                    : 'bg-bg-tertiary border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {engine.status === 'completed' && <CheckCircle className="h-4 w-4 text-status-success" />}
                  {engine.status === 'running' && <Spinner size="sm" />}
                  {engine.status === 'failed' && <XCircle className="h-4 w-4 text-status-critical" />}
                  {engine.status === 'pending' && <Clock className="h-4 w-4 text-charcoal-500" />}
                  <span className={`text-sm ${engine.status === 'running' ? 'text-bronze-400' : 'text-charcoal-300'}`}>
                    {engine.engine}
                  </span>
                </div>
                {engine.status === 'completed' && (
                  <span className="text-xs text-charcoal-400">{engine.findings_count}</span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
