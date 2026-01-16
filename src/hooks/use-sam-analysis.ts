/**
 * React hooks for S.A.M. (Systematic Adversarial Methodology) analysis
 *
 * Provides hooks for:
 * - Running S.A.M. analysis (ANCHOR → INHERIT → COMPOUND → ARRIVE)
 * - Polling analysis progress
 * - Fetching analysis results
 * - Canceling/resuming analysis
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDataLayer } from '@/lib/data'
import type { SAMPhase } from '@/CONTRACT'

// ============================================
// Types
// ============================================

export interface SAMAnalysisInput {
  caseId: string
  documentIds: string[]
  focusClaims?: string[]
  stopAfterPhase?: SAMPhase
}

// ============================================
// S.A.M. Progress Query
// ============================================

/**
 * Poll S.A.M. analysis progress
 *
 * @param analysisId - The S.A.M. analysis ID to track
 * @param options - Query options including refetchInterval for polling
 */
export function useSAMProgress(
  analysisId: string | null,
  options?: {
    refetchInterval?: number | false
    enabled?: boolean
  }
) {
  return useQuery({
    queryKey: ['sam-progress', analysisId],
    queryFn: async () => {
      if (!analysisId) return null
      const db = await getDataLayer()
      return db.getSAMProgress(analysisId)
    },
    enabled: !!analysisId && options?.enabled !== false,
    refetchInterval: options?.refetchInterval ?? 2000, // Poll every 2 seconds by default
  })
}

// ============================================
// S.A.M. Results Query
// ============================================

/**
 * Fetch completed S.A.M. analysis results
 *
 * @param analysisId - The S.A.M. analysis ID
 */
export function useSAMResults(analysisId: string | null) {
  return useQuery({
    queryKey: ['sam-results', analysisId],
    queryFn: async () => {
      if (!analysisId) return null
      const db = await getDataLayer()
      return db.getSAMResults(analysisId)
    },
    enabled: !!analysisId,
    staleTime: Infinity, // Results don't change once analysis is complete
  })
}

// ============================================
// Run S.A.M. Analysis Mutation
// ============================================

/**
 * Start a new S.A.M. analysis
 *
 * Returns the analysis ID which can be used with useSAMProgress to track status
 */
export function useRunSAMAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SAMAnalysisInput) => {
      const db = await getDataLayer()
      return db.runSAMAnalysis({
        caseId: input.caseId,
        documentIds: input.documentIds,
        focusClaims: input.focusClaims,
        stopAfterPhase: input.stopAfterPhase,
      })
    },
    onSuccess: (analysisId, variables) => {
      // Invalidate any existing progress/results queries
      queryClient.invalidateQueries({ queryKey: ['sam-progress'] })
      queryClient.invalidateQueries({ queryKey: ['sam-results'] })
      // Also invalidate related analysis data that may be affected
      queryClient.invalidateQueries({ queryKey: ['analysis', variables.caseId] })
    },
    onError: error => {
      console.error('[S.A.M. Analysis Error]', error)
    },
  })
}

// ============================================
// Cancel S.A.M. Analysis Mutation
// ============================================

/**
 * Cancel a running S.A.M. analysis
 */
export function useCancelSAMAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (analysisId: string) => {
      const db = await getDataLayer()
      return db.cancelSAMAnalysis(analysisId)
    },
    onSuccess: (_, analysisId) => {
      queryClient.invalidateQueries({ queryKey: ['sam-progress', analysisId] })
    },
    onError: error => {
      console.error('[S.A.M. Cancel Error]', error)
    },
  })
}

// ============================================
// Resume S.A.M. Analysis Mutation
// ============================================

/**
 * Resume a paused or failed S.A.M. analysis
 */
export function useResumeSAMAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (analysisId: string) => {
      const db = await getDataLayer()
      return db.resumeSAMAnalysis(analysisId)
    },
    onSuccess: (_, analysisId) => {
      queryClient.invalidateQueries({ queryKey: ['sam-progress', analysisId] })
    },
    onError: error => {
      console.error('[S.A.M. Resume Error]', error)
    },
  })
}

// ============================================
// Combined Hook for Full S.A.M. Workflow
// ============================================

/**
 * Combined hook for managing full S.A.M. analysis lifecycle
 *
 * Provides:
 * - runAnalysis: Start new analysis
 * - progress: Current progress data
 * - results: Completed results
 * - cancel: Cancel running analysis
 * - resume: Resume paused analysis
 * - isRunning: Whether analysis is currently running
 * - isComplete: Whether analysis is complete
 * - currentPhase: Current phase name
 */
export function useSAMAnalysis(analysisId: string | null) {
  const runMutation = useRunSAMAnalysis()
  const cancelMutation = useCancelSAMAnalysis()
  const resumeMutation = useResumeSAMAnalysis()

  const { data: progress, isLoading: isLoadingProgress } = useSAMProgress(analysisId)

  const { data: results, isLoading: isLoadingResults } = useSAMResults(
    progress?.status === 'completed' ? analysisId : null
  )

  // Check for running-like statuses (pending or any *_running status)
  const isRunning =
    progress?.status === 'pending' || progress?.status?.endsWith('_running') === true
  const isComplete = progress?.status === 'completed'
  const isFailed = progress?.status === 'failed'
  const isCancelled = progress?.status === 'cancelled'

  return {
    // Mutations
    runAnalysis: runMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    resume: resumeMutation.mutateAsync,

    // State
    progress,
    results,
    isLoadingProgress,
    isLoadingResults,

    // Derived state
    isRunning,
    isComplete,
    isFailed,
    isCancelled,
    currentPhase: progress?.currentPhase ?? null,

    // Mutation states
    isStarting: runMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isResuming: resumeMutation.isPending,

    // Errors
    startError: runMutation.error,
    cancelError: cancelMutation.error,
    resumeError: resumeMutation.error,
  }
}
