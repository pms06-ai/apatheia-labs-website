import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDataLayer } from '@/lib/data'
import { entityResolutionEngine } from '@/lib/engines/entity-resolution'
import type {
  EntityResolutionResult,
  EntityLinkageProposal,
} from '@/lib/engines/entity-resolution'

// ============================================
// Types
// ============================================

export interface EntityLinkageFeedback {
  linkageId: string
  status: 'confirmed' | 'rejected'
  reviewedBy?: string
}

export interface UpdateLinkageInput {
  caseId: string
  linkageId: string
  status: 'confirmed' | 'rejected'
  reviewedBy?: string
}

// ============================================
// ENTITY RESOLUTION
// ============================================

/**
 * Hook to run entity resolution engine and get full results
 * including entities, linkages, and graph data
 *
 * @param caseId - Case ID to resolve entities for
 * @param enabled - Whether the query should run (default: true when caseId exists)
 */
export function useEntityResolution(caseId: string, enabled = true) {
  return useQuery({
    queryKey: ['entity-resolution', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      const documents = await db.getDocuments(caseId)

      // Run entity resolution engine on all documents
      const result = await entityResolutionEngine.resolveEntities(documents, caseId)

      return result
    },
    enabled: !!caseId && enabled,
  })
}

// ============================================
// ENTITIES (Basic)
// ============================================

/**
 * Hook to fetch basic entities for a case
 * Uses the data layer's getEntities method
 *
 * @param caseId - Case ID to get entities for
 */
export function useResolvedEntities(caseId: string) {
  return useQuery({
    queryKey: ['resolved-entities', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getEntities(caseId)
    },
    enabled: !!caseId,
  })
}

// ============================================
// ENTITY LINKAGES
// ============================================

/**
 * Hook to get entity linkages from the resolution result
 * Extracts linkages from the entity resolution engine output
 *
 * @param caseId - Case ID to get linkages for
 */
export function useEntityLinkages(caseId: string) {
  return useQuery({
    queryKey: ['entity-linkages', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      const documents = await db.getDocuments(caseId)

      // Run entity resolution to get linkages
      const result = await entityResolutionEngine.resolveEntities(documents, caseId)

      return result.linkages
    },
    enabled: !!caseId,
  })
}

/**
 * Hook to get pending linkages (not yet reviewed)
 *
 * @param caseId - Case ID to get pending linkages for
 */
export function usePendingLinkages(caseId: string) {
  return useQuery({
    queryKey: ['pending-linkages', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      const documents = await db.getDocuments(caseId)

      const result = await entityResolutionEngine.resolveEntities(documents, caseId)

      // Filter to only pending linkages
      return result.linkages.filter((linkage) => linkage.status === 'pending')
    },
    enabled: !!caseId,
  })
}

// ============================================
// ENTITY GRAPH
// ============================================

/**
 * Hook to get the entity graph for visualization
 *
 * @param caseId - Case ID to get entity graph for
 */
export function useEntityGraph(caseId: string) {
  return useQuery({
    queryKey: ['entity-graph', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      const documents = await db.getDocuments(caseId)

      const result = await entityResolutionEngine.resolveEntities(documents, caseId)

      return result.graph
    },
    enabled: !!caseId,
  })
}

// ============================================
// LINKAGE FEEDBACK MUTATIONS
// ============================================

/**
 * Hook to update the status of an entity linkage (confirm/reject)
 * Provides user feedback loop for entity resolution
 *
 * @returns Mutation for updating linkage status
 */
export function useUpdateLinkageStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ caseId, linkageId, status, reviewedBy }: UpdateLinkageInput) => {
      // TODO: When subtask-6-3 is complete, this will call the data layer
      // to persist the feedback to the database
      // For now, we update optimistically in the cache

      // This is a placeholder - actual implementation will use:
      // const db = await getDataLayer()
      // return db.updateEntityLinkage({ linkageId, status, reviewedBy })

      return {
        linkageId,
        status,
        reviewedBy,
        reviewedAt: new Date().toISOString(),
      }
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['entity-resolution', variables.caseId] })
      await queryClient.cancelQueries({ queryKey: ['entity-linkages', variables.caseId] })
      await queryClient.cancelQueries({ queryKey: ['pending-linkages', variables.caseId] })

      // Snapshot the previous value
      const previousResolution = queryClient.getQueryData<EntityResolutionResult>([
        'entity-resolution',
        variables.caseId,
      ])
      const previousLinkages = queryClient.getQueryData<EntityLinkageProposal[]>([
        'entity-linkages',
        variables.caseId,
      ])

      // Optimistically update entity-resolution
      if (previousResolution) {
        queryClient.setQueryData<EntityResolutionResult>(
          ['entity-resolution', variables.caseId],
          {
            ...previousResolution,
            linkages: previousResolution.linkages.map((linkage) =>
              linkage.id === variables.linkageId
                ? { ...linkage, status: variables.status }
                : linkage
            ),
          }
        )
      }

      // Optimistically update entity-linkages
      if (previousLinkages) {
        queryClient.setQueryData<EntityLinkageProposal[]>(
          ['entity-linkages', variables.caseId],
          previousLinkages.map((linkage) =>
            linkage.id === variables.linkageId
              ? { ...linkage, status: variables.status }
              : linkage
          )
        )
      }

      // Remove from pending-linkages if confirmed/rejected
      queryClient.setQueryData<EntityLinkageProposal[]>(
        ['pending-linkages', variables.caseId],
        (old) => old?.filter((linkage) => linkage.id !== variables.linkageId) ?? []
      )

      return { previousResolution, previousLinkages }
    },
    onError: (_err, variables, context) => {
      // Roll back optimistic updates on error
      if (context?.previousResolution) {
        queryClient.setQueryData(
          ['entity-resolution', variables.caseId],
          context.previousResolution
        )
      }
      if (context?.previousLinkages) {
        queryClient.setQueryData(
          ['entity-linkages', variables.caseId],
          context.previousLinkages
        )
      }
    },
    onSettled: (_, __, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['entity-resolution', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['entity-linkages', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['pending-linkages', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['entity-graph', variables.caseId] })
    },
  })
}

/**
 * Hook to confirm an entity linkage
 * Convenience wrapper around useUpdateLinkageStatus
 */
export function useConfirmLinkage() {
  const mutation = useUpdateLinkageStatus()

  return {
    ...mutation,
    confirmLinkage: (caseId: string, linkageId: string, reviewedBy?: string) =>
      mutation.mutate({ caseId, linkageId, status: 'confirmed', reviewedBy }),
    confirmLinkageAsync: (caseId: string, linkageId: string, reviewedBy?: string) =>
      mutation.mutateAsync({ caseId, linkageId, status: 'confirmed', reviewedBy }),
  }
}

/**
 * Hook to reject an entity linkage
 * Convenience wrapper around useUpdateLinkageStatus
 */
export function useRejectLinkage() {
  const mutation = useUpdateLinkageStatus()

  return {
    ...mutation,
    rejectLinkage: (caseId: string, linkageId: string, reviewedBy?: string) =>
      mutation.mutate({ caseId, linkageId, status: 'rejected', reviewedBy }),
    rejectLinkageAsync: (caseId: string, linkageId: string, reviewedBy?: string) =>
      mutation.mutateAsync({ caseId, linkageId, status: 'rejected', reviewedBy }),
  }
}

// ============================================
// RUN ENTITY RESOLUTION ENGINE
// ============================================

/**
 * Hook to manually trigger entity resolution on documents
 * Useful when you want to re-run resolution after document changes
 */
export function useRunEntityResolution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      caseId,
      documentIds,
    }: {
      caseId: string
      documentIds?: string[]
    }) => {
      const db = await getDataLayer()

      // Get documents - either specified or all for the case
      let documents
      if (documentIds && documentIds.length > 0) {
        const allDocs = await db.getDocuments(caseId)
        documents = allDocs.filter((doc) => documentIds.includes(doc.id))
      } else {
        documents = await db.getDocuments(caseId)
      }

      // Run entity resolution
      return entityResolutionEngine.resolveEntities(documents, caseId)
    },
    onSuccess: (result, variables) => {
      // Update the cache with new results
      queryClient.setQueryData(['entity-resolution', variables.caseId], result)
      queryClient.setQueryData(['entity-linkages', variables.caseId], result.linkages)
      queryClient.setQueryData(
        ['pending-linkages', variables.caseId],
        result.linkages.filter((l) => l.status === 'pending')
      )
      queryClient.setQueryData(['entity-graph', variables.caseId], result.graph)

      // Also invalidate to ensure freshness
      queryClient.invalidateQueries({ queryKey: ['entities', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['resolved-entities', variables.caseId] })
    },
  })
}
