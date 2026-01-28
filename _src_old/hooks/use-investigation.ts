/**
 * Investigation Hook
 *
 * Provides state management for the unified investigation flow.
 * Orchestrates S.A.M. + all analysis engines into one flow.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  startInvestigation,
  getInvestigationProgress,
  getInvestigationResults,
  cancelInvestigation,
} from '@/lib/tauri/commands'
import type {
  InvestigationMode,
  InvestigationProgress,
  InvestigationResults,
  EngineSelection,
  InvestigateInput,
  Severity,
  Finding,
} from '@/CONTRACT'

// ============================================
// Types
// ============================================

export interface UseInvestigationOptions {
  /** Polling interval in ms when investigation is running (default: 1000) */
  pollingInterval?: number
}

export interface InvestigationMetrics {
  total: number
  critical: number
  high: number
  medium: number
  low: number
  criticalRate: string
  riskScore: string
  avgConfidence: string
  severityCounts: Record<string, number>
  categoryCounts: Record<string, number>
  documentsAnalyzed: number
  enginesRun: number
}

export interface UseInvestigationReturn {
  // State
  investigationId: string | null
  progress: InvestigationProgress | null
  results: InvestigationResults | null
  error: string | null
  isRunning: boolean
  isComplete: boolean
  metrics: InvestigationMetrics | null

  // Actions
  start: (input: InvestigateInput) => Promise<boolean>
  cancel: () => Promise<void>
  reset: () => void

  // Filtering
  filteredFindings: Finding[]
  categoryFilter: string | null
  severityFilter: Severity | null
  searchQuery: string
  setCategoryFilter: (category: string | null) => void
  setSeverityFilter: (severity: Severity | null) => void
  setSearchQuery: (query: string) => void
}

// ============================================
// Default Values
// ============================================

const DEFAULT_POLLING_INTERVAL = 1000

const DEFAULT_ENGINE_SELECTION: EngineSelection = {
  sam: true,
  contradiction: true,
  omission: true,
  temporal: true,
  entity: true,
  bias: true,
  professional: true,
  expert: true,
  accountability: true,
  narrative: true,
  documentary: true,
}

// ============================================
// Hook
// ============================================

export function useInvestigation(
  options: UseInvestigationOptions = {}
): UseInvestigationReturn {
  const { pollingInterval = DEFAULT_POLLING_INTERVAL } = options
  const queryClient = useQueryClient()

  // Core state
  const [investigationId, setInvestigationId] = useState<string | null>(null)
  const [progress, setProgress] = useState<InvestigationProgress | null>(null)
  const [results, setResults] = useState<InvestigationResults | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [severityFilter, setSeverityFilter] = useState<Severity | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Derived state
  const isRunning = progress?.status === 'running'
  const isComplete = progress?.status === 'completed'

  // Poll for progress while investigation is running
  useEffect(() => {
    if (!investigationId || progress?.status === 'completed' || progress?.status === 'failed' || progress?.status === 'cancelled') {
      return
    }

    const poll = async () => {
      try {
        const result = await getInvestigationProgress(investigationId)
        if (result.success && result.progress) {
          setProgress(result.progress)

          if (result.progress.status === 'completed') {
            const resultsResp = await getInvestigationResults(investigationId)
            if (resultsResp.success && resultsResp.results) {
              setResults(resultsResp.results)
            }
          }
        }
      } catch (err) {
        console.error('Failed to get progress:', err)
      }
    }

    const interval = setInterval(poll, pollingInterval)
    return () => clearInterval(interval)
  }, [investigationId, progress?.status, pollingInterval])

  // Compute metrics from results
  const metrics = useMemo((): InvestigationMetrics | null => {
    if (!results) return null

    const findings = results.findings
    const severityCounts = findings.reduce((acc, f) => {
      const sev = f.severity || 'info'
      acc[sev] = (acc[sev] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categoryCounts = findings.reduce((acc, f) => {
      acc[f.engine] = (acc[f.engine] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const criticalRate = findings.length > 0
      ? ((severityCounts.critical || 0) / findings.length * 100).toFixed(1)
      : '0'

    // Calculate risk score (0-100)
    const riskScore = findings.length > 0
      ? Math.min(
          100,
          ((severityCounts.critical || 0) * 10 +
            (severityCounts.high || 0) * 5 +
            (severityCounts.medium || 0) * 2 +
            (severityCounts.low || 0) * 0.5) /
            findings.length
        ).toFixed(1)
      : '0'

    // Average confidence
    const avgConfidence = findings.length > 0
      ? (findings.reduce((sum, f) => sum + (f.confidence || 0), 0) / findings.length * 100).toFixed(1)
      : '0'

    return {
      total: findings.length,
      critical: severityCounts.critical || 0,
      high: severityCounts.high || 0,
      medium: severityCounts.medium || 0,
      low: severityCounts.low || 0,
      criticalRate,
      riskScore,
      avgConfidence,
      severityCounts,
      categoryCounts,
      documentsAnalyzed: progress?.total_engines || 0, // This should be document count
      enginesRun: progress?.total_engines || 0,
    }
  }, [results, progress?.total_engines])

  // Filter findings
  const filteredFindings = useMemo(() => {
    if (!results) return []
    return results.findings.filter(f => {
      if (categoryFilter && f.engine !== categoryFilter) return false
      if (severityFilter && f.severity !== severityFilter) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          f.title.toLowerCase().includes(query) ||
          (f.description && f.description.toLowerCase().includes(query))
        )
      }
      return true
    })
  }, [results, categoryFilter, severityFilter, searchQuery])

  // Start investigation
  const start = useCallback(async (input: InvestigateInput): Promise<boolean> => {
    setError(null)
    setProgress(null)
    setResults(null)
    setCategoryFilter(null)
    setSeverityFilter(null)
    setSearchQuery('')

    try {
      const result = await startInvestigation(input)

      if (result.success && result.investigation_id) {
        setInvestigationId(result.investigation_id)
        const progressResult = await getInvestigationProgress(result.investigation_id)
        if (progressResult.success && progressResult.progress) {
          setProgress(progressResult.progress)
        }
        return true
      } else {
        setError(result.error || 'Failed to start investigation')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start investigation')
      return false
    }
  }, [])

  // Cancel investigation
  const cancel = useCallback(async () => {
    if (!investigationId) return
    try {
      await cancelInvestigation(investigationId)
      setProgress(prev => prev ? { ...prev, status: 'cancelled' } : null)
    } catch (err) {
      console.error('Failed to cancel:', err)
    }
  }, [investigationId])

  // Reset state for new investigation
  const reset = useCallback(() => {
    setInvestigationId(null)
    setProgress(null)
    setResults(null)
    setError(null)
    setCategoryFilter(null)
    setSeverityFilter(null)
    setSearchQuery('')
  }, [])

  return {
    // State
    investigationId,
    progress,
    results,
    error,
    isRunning,
    isComplete,
    metrics,

    // Actions
    start,
    cancel,
    reset,

    // Filtering
    filteredFindings,
    categoryFilter,
    severityFilter,
    searchQuery,
    setCategoryFilter,
    setSeverityFilter,
    setSearchQuery,
  }
}

// ============================================
// Utility: Engine Selection Helpers
// ============================================

/**
 * Get the default engine selection (all enabled)
 */
export function getDefaultEngineSelection(): EngineSelection {
  return { ...DEFAULT_ENGINE_SELECTION }
}

/**
 * Count selected engines
 */
export function countSelectedEngines(selection: EngineSelection): number {
  return Object.values(selection).filter(Boolean).length
}

/**
 * Validate engine selection (at least one engine must be selected)
 */
export function validateEngineSelection(selection: EngineSelection): boolean {
  return countSelectedEngines(selection) > 0
}
