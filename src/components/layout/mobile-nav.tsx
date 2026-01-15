'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, AlertTriangle, Settings, Home, Plus, Search, X, ChevronDown, Scale } from 'lucide-react'
import { useCaseStore } from '@/hooks/use-case-store'
import { getDataLayer } from '@/lib/data'
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
    icon: 'O',
    priority: 1,
    href: '/analysis?engine=omission',
  },
  { id: 'expert', name: 'Expert Witness', icon: 'E', priority: 2, href: '/analysis?engine=expert' },
  {
    id: 'documentary',
    name: 'Documentary',
    icon: 'D',
    priority: 3,
    href: '/analysis?engine=documentary',
  },
  {
    id: 'narrative',
    name: 'Narrative Evolution',
    icon: 'M',
    priority: 4,
    href: '/analysis?engine=narrative',
  },
  {
    id: 'coordination',
    name: 'Cross-Institutional',
    icon: 'S',
    priority: 5,
    href: '/analysis?engine=coordination',
  },
]

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { pathname } = useLocation()
  const { activeCase, setActiveCase } = useCaseStore()
  const [isCaseSelectorOpen, setIsCaseSelectorOpen] = useState(false)
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Close on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Fetch cases
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const db = await getDataLayer()
        const data = await db.getCases()
        if (data && data.length > 0) {
          setCases(data)
          if (!activeCase) {
            setActiveCase(data[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch cases:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCases()
  }, [activeCase, setActiveCase])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleCaseSelect = useCallback((selectedCase: Case) => {
    setActiveCase(selectedCase)
    setIsCaseSelectorOpen(false)
  }, [setActiveCase])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed inset-y-0 left-0 flex w-72 flex-col bg-bg-secondary shadow-xl animate-slide-in-left"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-charcoal-700 p-4">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={onClose}
            aria-label="Apatheia Labs - Go to homepage"
          >
            <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" aria-hidden="true" />
            <div>
              <div className="font-display text-base tracking-wide text-charcoal-100">APATHEIA</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-charcoal-500">Labs</div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-charcoal-400 transition-colors hover:bg-charcoal-700 hover:text-charcoal-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Case Selector */}
        <div className="border-b border-charcoal-700 p-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-charcoal-500">Active Case</div>

          <div className="relative">
            <button
              onClick={() => setIsCaseSelectorOpen(!isCaseSelectorOpen)}
              className="flex w-full items-center justify-between rounded-lg bg-bg-tertiary p-3 text-left transition hover:bg-charcoal-700 focus:outline-none focus:ring-1 focus:ring-bronze-500/50"
              aria-haspopup="listbox"
              aria-expanded={isCaseSelectorOpen}
              aria-label={activeCase ? `Active case: ${activeCase.name}. Click to change.` : 'Select a case'}
            >
              <div className="min-w-0">
                {isLoading ? (
                  <div className="h-5 w-24 animate-pulse rounded bg-charcoal-700" />
                ) : activeCase ? (
                  <>
                    <div className="truncate text-sm font-medium text-charcoal-100">
                      {activeCase.reference}
                    </div>
                    <div className="truncate text-xs text-charcoal-400">{activeCase.name}</div>
                  </>
                ) : (
                  <div className="text-sm font-medium italic text-charcoal-400">Select Case...</div>
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
                className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-charcoal-600 bg-bg-tertiary shadow-xl"
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
                      <div className="text-sm font-medium text-charcoal-100">{c.reference}</div>
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
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" role="navigation" aria-label="Mobile navigation">
          <div className="mb-2 px-3 text-xs uppercase tracking-wider text-charcoal-500" aria-hidden="true">
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? 'bg-bronze-600/20 text-bronze-400'
                    : 'text-charcoal-300 hover:bg-charcoal-700 hover:text-charcoal-100'
                }`}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.name}
              </Link>
            )
          })}

          {/* Engines */}
          <div className="mb-2 mt-6 px-3 text-xs uppercase tracking-wider text-charcoal-500" aria-hidden="true">
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
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isActive
                    ? 'bg-bronze-600/20 text-bronze-400'
                    : 'text-charcoal-300 hover:bg-charcoal-700 hover:text-charcoal-100'
                }`}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-charcoal-600 font-serif text-xs" aria-hidden="true">
                  {engine.icon}
                </span>
                <span className="flex-1">{engine.name}</span>
                <span className="rounded bg-charcoal-700 px-1.5 py-0.5 text-xs text-charcoal-400" aria-label={`Priority ${engine.priority}`}>
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
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-charcoal-400 transition hover:bg-charcoal-700 hover:text-charcoal-100"
            aria-label="Application settings"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
            Settings
          </Link>
        </div>
      </aside>
    </div>
  )
}
