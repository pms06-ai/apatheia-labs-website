import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { isDesktop } from '@/lib/tauri/client'
import { searchDocuments } from '@/lib/tauri/commands'
import type { Engine } from '@/CONTRACT'

// ============================================
// ENGINES
// ============================================

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

// UI-expected shape for header.tsx and search-command.tsx
interface UISearchResult {
  id: string
  document_name: string
  document_id?: string
  content: string
  score: number
}

interface SearchData {
  results: UISearchResult[]
}

/**
 * Hook to debounce a value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Core search query hook - performs the actual search
 */
export function useSearch(query: string, caseId?: string) {
  return useQuery<SearchData>({
    queryKey: ['search', query, caseId],
    queryFn: async () => {
      if (isDesktop()) {
        if (!caseId) {
          throw new Error('caseId is required for desktop search')
        }
        const rustResults = await searchDocuments(query, caseId)
        // Map Rust shape → UI shape
        const results: UISearchResult[] = rustResults.map((r) => ({
          id: r.chunk_id,
          document_name: r.document_id,
          document_id: r.document_id,
          content: r.content,
          score: r.similarity,
        }))
        return { results }
      }

      // Web mode fallback
      const params = new URLSearchParams({ q: query })
      if (caseId) params.append('caseId', caseId)

      const response = await fetch(`/api/search?${params}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      return response.json()
    },
    enabled: query.length > 2 && !!caseId,
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Debounced search hook - waits for user to stop typing before searching
 * Useful for command palette and search inputs to avoid excessive API calls
 * @param query - The search query string
 * @param caseId - The case ID to search within
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 */
export function useDebouncedSearch(query: string, caseId?: string, delay: number = 300) {
  const debouncedQuery = useDebounce(query, delay)
  return useSearch(debouncedQuery, caseId)
}
