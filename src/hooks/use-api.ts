import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Document, Entity, Finding, Claim, Contradiction } from '@/types'

const supabase = createClient()

// ============================================
// CASES
// ============================================

export function useCases() {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
  })
}

export function useCase(caseId: string) {
  return useQuery({
    queryKey: ['case', caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!caseId,
  })
}

// ============================================
// DOCUMENTS
// ============================================

export function useDocuments(caseId: string) {
  return useQuery({
    queryKey: ['documents', caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Document[]
    },
    enabled: !!caseId,
  })
}

export function useDocument(documentId: string) {
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()

      if (error) throw error
      return data as Document
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
      docType: string
    }) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('caseId', caseId)
      formData.append('docType', docType)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents', variables.caseId] })
    },
  })
}

export function useProcessDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (documentId: string) => {
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
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('case_id', caseId)
        .order('canonical_name')

      if (error) throw error
      return data as Entity[]
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
      let query = supabase
        .from('findings')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (engine) {
        query = query.eq('engine', engine)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Finding[]
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
      const { data, error } = await supabase
        .from('claims')
        .select('*, source_entity:entities(canonical_name), source_document:documents(filename)')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as (Claim & {
        source_entity: { canonical_name: string } | null
        source_document: { filename: string } | null
      })[]
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
      const { data, error } = await supabase
        .from('contradictions')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Contradiction[]
    },
    enabled: !!caseId,
  })
}

// ============================================
// ANALYSIS
// ============================================

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
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, analysisType, documentIds }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['findings', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['claims', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['contradictions', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['entities', variables.caseId] })
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
      const response = await fetch(`/api/engines/${engineId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, documentIds, options }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Engine execution failed' }))
        throw new Error(error.error || 'Engine execution failed')
      }

      return response.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['findings', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['entities', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['contradictions', variables.caseId] })
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
