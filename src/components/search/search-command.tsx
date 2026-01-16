'use client'

import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Search, FileText, Loader2, AlertCircle, X, Command } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useActiveCase } from '@/hooks/use-case-store'
import { useDebouncedSearch } from '@/hooks/use-search'

interface SearchCommandProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate()
  const [internalOpen, setInternalOpen] = useState(open ?? false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isOpen = open ?? internalOpen

  const activeCase = useActiveCase()
  const { data, isLoading, error } = useDebouncedSearch(query, activeCase?.id)
  const results = useMemo(() => data?.results ?? [], [data?.results])
  const activeIndex = results.length === 0 ? 0 : Math.min(selectedIndex, results.length - 1)

  // Handle open state change
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (open === undefined) {
        setInternalOpen(newOpen)
      }
      onOpenChange?.(newOpen)
      if (!newOpen) {
        // Reset state when closing
        setQuery('')
        setSelectedIndex(0)
      }
    },
    [onOpenChange, open]
  )

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        handleOpenChange(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleOpenChange])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure dialog is mounted
      const timeout = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && results.length > 0) {
      const selectedElement = listRef.current.children[activeIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex, results])

  // Navigate to a search result
  const navigateToResult = useCallback(
    (result: { id: string; document_name?: string; document_id?: string }) => {
      const docId = result.document_id || result.document_name || result.id
      navigate(`/documents/${docId}?chunk=${result.id}`)
      handleOpenChange(false)
    },
    [navigate, handleOpenChange]
  )

  // Handle keyboard navigation within the dialog
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (results.length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => (prev + 1) % results.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
          break
        case 'Enter':
          event.preventDefault()
          if (results[activeIndex]) {
            navigateToResult(results[activeIndex])
          }
          break
      }
    },
    [results, activeIndex, navigateToResult]
  )

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[20%] z-50 w-full max-w-xl translate-x-[-50%]',
            'border border-charcoal-700 bg-charcoal-900 shadow-2xl',
            'overflow-hidden rounded-xl',
            'duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]'
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-charcoal-700 px-4 py-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-bronze-500" />
            ) : (
              <Search className="h-5 w-5 flex-shrink-0 text-charcoal-400" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search documents..."
              className={cn(
                'flex-1 bg-transparent text-base text-charcoal-100',
                'placeholder:text-charcoal-500',
                'focus:outline-none'
              )}
              aria-label="Search documents"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-autocomplete="list"
              role="combobox"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="rounded p-1 text-charcoal-500 transition-colors hover:bg-charcoal-800 hover:text-charcoal-300"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden items-center gap-1 rounded border border-charcoal-700 bg-charcoal-800 px-1.5 py-0.5 font-mono text-xs text-charcoal-500 sm:flex">
              <span>Esc</span>
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto" id="search-results" role="listbox">
            {/* No Case Selected */}
            {!activeCase && (
              <div className="p-8 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-charcoal-600" />
                <p className="text-sm font-medium text-charcoal-300">No case selected</p>
                <p className="mt-1 text-xs text-charcoal-500">
                  Select a case from the sidebar to search documents
                </p>
              </div>
            )}

            {/* Loading State */}
            {activeCase && isLoading && query.length > 2 && (
              <div className="flex items-center justify-center gap-3 p-8">
                <Loader2 className="h-5 w-5 animate-spin text-bronze-500" />
                <span className="text-sm text-charcoal-400">Searching...</span>
              </div>
            )}

            {/* Error State */}
            {activeCase && error && !isLoading && (
              <div className="p-6">
                <div className="flex items-center gap-2 text-status-critical">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Search failed</span>
                </div>
                <p className="mt-2 text-xs text-charcoal-500">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
              </div>
            )}

            {/* Empty Query State */}
            {activeCase && !isLoading && !error && query.length <= 2 && (
              <div className="p-8 text-center">
                <Command className="mx-auto mb-3 h-10 w-10 text-charcoal-600" />
                <p className="text-sm font-medium text-charcoal-300">Start typing to search</p>
                <p className="mt-1 text-xs text-charcoal-500">
                  Search across all documents in {activeCase.name}
                </p>
              </div>
            )}

            {/* No Results */}
            {activeCase && !isLoading && !error && query.length > 2 && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="mx-auto mb-3 h-10 w-10 text-charcoal-600" />
                <p className="text-sm font-medium text-charcoal-300">No results found</p>
                <p className="mt-1 text-xs text-charcoal-500">
                  No matches for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}

            {/* Results List */}
            {!isLoading && !error && results.length > 0 && (
              <>
                <div className="border-b border-charcoal-800 px-4 py-2 text-xs text-charcoal-500">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
                <div ref={listRef} className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => navigateToResult(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'w-full px-4 py-3 text-left transition-colors',
                        index === activeIndex ? 'bg-charcoal-800' : 'hover:bg-charcoal-800/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <FileText
                          className={cn(
                            'h-4 w-4 flex-shrink-0',
                            index === activeIndex ? 'text-bronze-500' : 'text-charcoal-500'
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'truncate text-sm',
                                index === activeIndex ? 'text-charcoal-100' : 'text-charcoal-200'
                              )}
                            >
                              {result.document_name || 'Untitled'}
                            </span>
                            {result.score !== undefined && (
                              <span className="flex-shrink-0 text-xs text-charcoal-500">
                                {Math.round(result.score * 100)}%
                              </span>
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-charcoal-500">
                            {result.content}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer with keyboard hints */}
          {results.length > 0 && (
            <div className="flex items-center justify-between border-t border-charcoal-800 bg-charcoal-900/50 px-4 py-2">
              <div className="flex items-center gap-4 text-xs text-charcoal-500">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-charcoal-700 bg-charcoal-800 px-1 py-0.5 font-mono text-[10px]">
                    Up
                  </kbd>
                  <kbd className="rounded border border-charcoal-700 bg-charcoal-800 px-1 py-0.5 font-mono text-[10px]">
                    Down
                  </kbd>
                  <span className="ml-1">to navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-charcoal-700 bg-charcoal-800 px-1 py-0.5 font-mono text-[10px]">
                    Enter
                  </kbd>
                  <span className="ml-1">to open</span>
                </span>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// Export a hook to control the search command from other components
export function useSearchCommand() {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}
