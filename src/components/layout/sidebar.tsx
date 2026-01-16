'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FileText,
  AlertTriangle,
  Settings,
  Home,
  ChevronDown,
  Plus,
  Search,
  Scale,
} from 'lucide-react'
import { useCaseStore } from '@/hooks/use-case-store'
import { getDataLayer } from '@/lib/data'
import { CreateCaseModal } from '@/components/cases/create-case-modal'
import type { Case } from '@/CONTRACT'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Analysis', href: '/analysis', icon: Search },
  { name: 'S.A.M.', href: '/sam', icon: AlertTriangle },
  { name: 'Complaints', href: '/complaints', icon: Scale },
]

const engines = [
  {
    id: 'omission',
    name: 'Omission Detection',
    icon: 'Ο',
    priority: 1,
    href: '/analysis?engine=omission',
  },
  {
    id: 'expert_witness',
    name: 'Expert Witness',
    icon: 'Ξ',
    priority: 2,
    href: '/analysis?engine=expert_witness',
  },
  {
    id: 'documentary',
    name: 'Documentary',
    icon: 'Δ',
    priority: 3,
    href: '/analysis?engine=documentary',
  },
  {
    id: 'narrative',
    name: 'Narrative Evolution',
    icon: 'Μ',
    priority: 4,
    href: '/analysis?engine=narrative',
  },
  {
    id: 'coordination',
    name: 'Cross-Institutional',
    icon: 'Σ',
    priority: 5,
    href: '/analysis?engine=coordination',
  },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const { activeCase, setActiveCase } = useCaseStore()
  const [isCaseSelectorOpen, setIsCaseSelectorOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  // Use refs to avoid dependency loops - we only want to auto-select once
  const hasAutoSelected = useRef(false)
  const activeCaseRef = useRef(activeCase)
  activeCaseRef.current = activeCase

  const fetchCases = useCallback(
    async (autoSelect = false) => {
      try {
        setIsLoading(true)
        setInitError(null)
        // Use unified data layer (routes to Tauri in desktop, mock in web)
        const db = await getDataLayer()
        const data = await db.getCases()

        setCases(data || [])

        // Only auto-select on initial load, not on refetches
        if (
          autoSelect &&
          data &&
          data.length > 0 &&
          !activeCaseRef.current &&
          !hasAutoSelected.current
        ) {
          hasAutoSelected.current = true
          setActiveCase(data[0])
          console.log('[Sidebar] Auto-selected case:', data[0].name)
        }
      } catch (error) {
        console.error('Failed to fetch cases:', error)
        setInitError(error instanceof Error ? error.message : 'Failed to load cases')
      } finally {
        setIsLoading(false)
      }
    },
    [setActiveCase]
  )

  // Initial fetch on mount only
  useEffect(() => {
    fetchCases(true) // Pass true to enable auto-select on first load
  }, [fetchCases])

  const handleCreateModalClose = (open: boolean) => {
    setIsCreateModalOpen(open)
    // Refetch cases when modal closes in case a new one was created
    if (!open) {
      fetchCases(false) // Don't auto-select on refetch
    }
  }

  const handleCaseSelect = (selectedCase: Case) => {
    setActiveCase(selectedCase)
    setIsCaseSelectorOpen(false)
  }

  return (
    <aside
      className="relative sticky top-0 hidden h-screen w-64 flex-col overflow-hidden border-r border-charcoal-700 bg-bg-secondary lg:flex"
      role="complementary"
      aria-label="Sidebar"
    >
      {/* Background Detail */}
      <div
        className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-bronze-500/20 to-transparent opacity-50"
        aria-hidden="true"
      />

      {/* Logo/Brand Header */}
      <Link
        to="/"
        className="flex items-center gap-3 border-b border-charcoal-700 p-4 transition-colors hover:bg-charcoal-800/50"
        aria-label="Apatheia Labs - Go to homepage"
      >
        <img
          src="/logo.svg"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10"
          aria-hidden="true"
        />
        <div>
          <div className="font-display text-lg tracking-wide text-charcoal-100">APATHEIA</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-charcoal-500">Labs</div>
        </div>
      </Link>

      {/* Case Selector */}
      <div className="border-b border-charcoal-700 p-4">
        <div className="mb-2 text-xs uppercase tracking-wider text-charcoal-500">Active Case</div>

        <div className="relative">
          <button
            onClick={() => setIsCaseSelectorOpen(!isCaseSelectorOpen)}
            className="flex w-full items-center justify-between rounded-lg bg-bg-tertiary p-3 text-left transition hover:bg-charcoal-700 focus:outline-none focus:ring-1 focus:ring-bronze-500/50"
            aria-haspopup="listbox"
            aria-expanded={isCaseSelectorOpen}
            aria-label={
              activeCase ? `Active case: ${activeCase.name}. Click to change.` : 'Select a case'
            }
          >
            <div className="min-w-0">
              {isLoading ? (
                <div className="h-5 w-24 animate-pulse rounded bg-charcoal-700" />
              ) : initError ? (
                <div className="font-medium text-status-critical">Load Error</div>
              ) : activeCase ? (
                <>
                  <div className="truncate font-medium text-charcoal-100">
                    {activeCase.reference}
                  </div>
                  <div className="truncate text-xs text-charcoal-400">{activeCase.name}</div>
                </>
              ) : (
                <div className="font-medium italic text-charcoal-400">Select Case...</div>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-charcoal-500 transition-transform ${isCaseSelectorOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown Menu */}
          {isCaseSelectorOpen && (
            <div
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-charcoal-600 bg-bg-tertiary shadow-xl"
              role="listbox"
              aria-label="Select a case"
            >
              {cases.length > 0 ? (
                cases.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleCaseSelect(c)}
                    role="option"
                    aria-selected={activeCase?.id === c.id}
                    className={`w-full p-3 text-left transition hover:bg-charcoal-700 ${
                      activeCase?.id === c.id ? 'border-l-2 border-bronze-500 bg-bronze-900/20' : ''
                    }`}
                  >
                    <div className="font-medium text-charcoal-100">{c.reference}</div>
                    <div className="text-xs text-charcoal-400">{c.name}</div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-sm text-charcoal-500">No cases found</div>
              )}
              <button
                className="flex w-full items-center gap-2 border-t border-charcoal-600/50 p-3 text-sm text-bronze-400 hover:bg-charcoal-700 hover:text-bronze-300"
                onClick={() => {
                  setIsCaseSelectorOpen(false)
                  setIsCreateModalOpen(true)
                }}
                aria-label="Create new case"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                New Case
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-1 overflow-y-auto p-3"
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className="mb-2 px-3 text-xs uppercase tracking-wider text-charcoal-500"
          aria-hidden="true"
        >
          Navigation
        </div>
        {navigation.map(item => {
          const isActive =
            pathname === item.href ||
            (item.href.includes('?') && pathname.startsWith(item.href.split('?')[0]))
          return (
            <Link
              key={item.name}
              to={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-bronze-600/20 text-bronze-400'
                  : 'text-charcoal-300 hover:bg-charcoal-700 hover:text-charcoal-100'
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.name}
              {isActive && (
                <div
                  className="absolute left-0 h-4 w-0.5 rounded-r bg-bronze-500 shadow-[0_0_10px_rgba(184,134,11,0.5)]"
                  aria-hidden="true"
                />
              )}
            </Link>
          )
        })}

        {/* Engines */}
        <div
          className="mb-2 mt-6 px-3 text-xs uppercase tracking-wider text-charcoal-500"
          aria-hidden="true"
        >
          Analysis Engines
        </div>
        {engines.map(engine => {
          const isActive =
            pathname + (typeof window !== 'undefined' ? window.location.search : '') === engine.href
          return (
            <Link
              key={engine.id}
              to={engine.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                isActive
                  ? 'bg-bronze-600/20 text-bronze-400'
                  : 'text-charcoal-300 hover:bg-charcoal-700 hover:text-charcoal-100'
              }`}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full border border-charcoal-600 font-serif text-xs"
                aria-hidden="true"
              >
                {engine.icon}
              </span>
              <span className="flex-1">{engine.name}</span>
              <span
                className="rounded bg-charcoal-700 px-1.5 py-0.5 text-xs text-charcoal-400"
                aria-label={`Priority ${engine.priority}`}
              >
                P{engine.priority}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-charcoal-700 p-4">
        <Link
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-charcoal-400 transition hover:bg-charcoal-700 hover:text-charcoal-100"
          aria-label="Application settings"
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
          Settings
        </Link>
      </div>

      {/* Create Case Modal */}
      <CreateCaseModal open={isCreateModalOpen} onOpenChange={handleCreateModalClose} />
    </aside>
  )
}
