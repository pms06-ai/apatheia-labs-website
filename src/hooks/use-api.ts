/**
 * Phronesis FCIP - React Query Hooks
 * 
 * Data fetching and mutation hooks using the unified data layer.
 * Automatically routes to Tauri (desktop) or Supabase (web).
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDataLayer, isDesktop } from '@/lib/data'
import type { 
  Document, 
  Entity, 
  Finding, 
  Claim, 
  Contradiction,
  Case,
  CaseType,
  DocType,
} from '@/CONTRACT'

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

// ============================================
// DOCUMENTS
// ============================================

export function useDocuments(caseId: string) {
  return useQuery({
    queryKey: ['documents', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getDocuments(caseId)
    },
    enabled: !!caseId,
  })
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getDocument(documentId)
    },
    enabled: !!documentId,
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      file,
      caseId,
      docType,
    }: {
      file: File
      caseId: string
      docType?: DocType
    }) => {
      const db = await getDataLayer()
      return db.uploadDocument({ caseId, file, docType })
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['documents', variables.caseId] })
      
      const previousDocs = queryClient.getQueryData<Document[]>(['documents', variables.caseId])
      
      // Optimistic update with pending document
      if (previousDocs) {
        const optimisticDoc: Document = {
          id: `temp-${Date.now()}`,
          case_id: variables.caseId,
          filename: variables.file.name,
          file_type: variables.file.type || 'application/octet-stream',
          file_size: variables.file.size,
          storage_path: '',
          hash_sha256: '',
          acquisition_date: new Date().toISOString(),
          doc_type: variables.docType || null,
          source_entity: null,
          status: 'pending',
          extracted_text: null,
          page_count: null,
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        queryClient.setQueryData<Document[]>(
          ['documents', variables.caseId], 
          [optimisticDoc, ...previousDocs]
        )
      }
      
      return { previousDocs }
    },
    onError: (_err, variables, context) => {
      if (context?.previousDocs) {
        queryClient.setQueryData(['documents', variables.caseId], context.previousDocs)
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.caseId] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentId: string) => {
      const db = await getDataLayer()
      return db.deleteDocument(documentId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

export function useProcessDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentId: string) => {
      // In desktop mode, processing happens automatically after upload
      if (isDesktop()) {
        console.log('[Desktop] Document processing initiated:', documentId)
        return { success: true, documentId }
      }
      
      // Web mode: call API
      const response = await fetch('/api/documents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

// ============================================
// ENTITIES
// ============================================

export function useEntities(caseId: string) {
  return useQuery({
    queryKey: ['entities', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getEntities(caseId)
    },
    enabled: !!caseId,
  })
}

// ============================================
// FINDINGS
// ============================================

export function useFindings(caseId: string, engine?: string) {
  return useQuery({
    queryKey: ['findings', caseId, engine],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getFindings(caseId, engine)
    },
    enabled: !!caseId,
  })
}

// ============================================
// CLAIMS
// ============================================

export function useClaims(caseId: string) {
  return useQuery({
    queryKey: ['claims', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getClaims(caseId)
    },
    enabled: !!caseId,
  })
}

// ============================================
// CONTRADICTIONS
// ============================================

export function useContradictions(caseId: string) {
  return useQuery({
    queryKey: ['contradictions', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getContradictions(caseId)
    },
    enabled: !!caseId,
  })
}

// ============================================
// ANALYSIS
// ============================================

export function useAnalysis(caseId: string) {
  return useQuery({
    queryKey: ['analysis', caseId],
    queryFn: async () => {
      const db = await getDataLayer()
      return db.getAnalysis(caseId)
    },
    enabled: !!caseId,
  })
}

export function useRunAnalysis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      caseId,
      analysisType,
      documentIds,
    }: {
      caseId: string
      analysisType: string
      documentIds?: string[]
    }) => {
      const db = await getDataLayer()
      return db.runEngine({
        caseId,
        engineId: analysisType,
        documentIds: documentIds || [],
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['findings', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['claims', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['contradictions', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['entities', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['analysis', variables.caseId] })
    },
  })
}

// ============================================
// ENGINES
// ============================================

export function useRunEngine() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      engineId,
      caseId,
      documentIds,
      options,
    }: {
      engineId: string
      caseId: string
      documentIds: string[]
      options?: Record<string, unknown>
    }) => {
      const db = await getDataLayer()
      return db.runEngine({
        caseId,
        engineId,
        documentIds,
        options,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['findings', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['entities', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['contradictions', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['analysis', variables.caseId] })
    },
    onError: (error) => {
      console.error('[Engine Error]', error)
    },
  })
}

export function useEngines() {
  return useQuery({
    queryKey: ['engines'],
    queryFn: async () => {
      // In desktop mode, engines are bundled - use metadata
      if (isDesktop()) {
        const { getActiveEngines } = await import('@/lib/engines/metadata')
        return getActiveEngines()
      }
      
      // Web mode: fetch from API
      const response = await fetch('/api/engines')
      if (!response.ok) throw new Error('Failed to fetch engines')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// ============================================
// SEARCH
// ============================================

export function useSearch(query: string, caseId?: string) {
  return useQuery({
    queryKey: ['search', query, caseId],
    queryFn: async () => {
      // Web mode only for now
      const params = new URLSearchParams({ q: query })
      if (caseId) params.append('caseId', caseId)

      const response = await fetch(`/api/search?${params}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      return response.json()
    },
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  })
}
