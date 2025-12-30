import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDataLayer } from '@/lib/data'
import type { Case, CaseType } from '@/CONTRACT'

// ============================================
// CASES
// ============================================

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getCases()
    },
  })
}

export function useCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getCase(caseId)
    },
    enabled: !!caseId,
  })
}

export function useCreateCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      reference: string
      name: string
      case_type: CaseType
      description?: string
    }) => {
      const db = await getDataLayer()
      return db.createCase(input)
    },
    onMutate: async (newCase) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['cases'] })

      // Snapshot previous value
      const previousCases = queryClient.getQueryData<Case[]>(['cases'])

      // Optimistically update
      if (previousCases) {
        const optimisticCase: Case = {
          id: `temp-${Date.now()}`,
          reference: newCase.reference,
          name: newCase.name,
          case_type: newCase.case_type,
          description: newCase.description || null,
          status: 'active',
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<Case[]>(['cases'], [optimisticCase, ...previousCases])
      }

      return { previousCases }
    },
    onError: (_err, _newCase, context) => {
      // Rollback on error
      if (context?.previousCases) {
        queryClient.setQueryData(['cases'], context.previousCases)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })
}

export function useDeleteCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (caseId: string) => {
      const db = await getDataLayer()
      return db.deleteCase(caseId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })
}
