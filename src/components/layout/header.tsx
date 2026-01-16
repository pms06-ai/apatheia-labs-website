'use client'

import { Search, Menu } from 'lucide-react'
import { useSearchContext } from '@/components/search'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { open: openSearch } = useSearchContext()

  return (
    <header className="flex h-14 items-center justify-between border-b border-charcoal-700 bg-bg-secondary px-4 lg:px-6">
      {/* Mobile menu button + Logo */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-charcoal-400 transition-colors hover:bg-charcoal-700 hover:text-charcoal-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <a
          href="/"
          className="flex items-center gap-2 lg:gap-3"
          aria-label="Apatheia Labs - Go to homepage"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded bg-bronze-500 font-display text-lg font-bold text-charcoal-900 shadow-md"
            aria-hidden="true"
          >
            A
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-base tracking-tight">
              <span className="font-medium text-bronze-400">Apatheia</span>
              <span className="text-charcoal-400"> Labs</span>
            </div>
          </div>
        </a>

        <div className="mx-2 hidden h-6 w-px bg-gradient-to-b from-transparent via-charcoal-600/50 to-transparent md:block lg:mx-4" />

        <div className="hidden items-center gap-2 rounded border border-charcoal-700/50 bg-charcoal-800/50 px-2 py-1 backdrop-blur-sm md:flex lg:px-3 lg:py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal-500">
            PHRONESIS
          </span>
          <div className="h-3 w-px bg-charcoal-700" />
          <span className="text-xs font-medium text-bronze-500">v6.0</span>
        </div>
      </div>

      {/* Search + Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Button - Opens Command Palette */}
        <button
          onClick={openSearch}
          className="group flex items-center gap-2 rounded-lg border border-charcoal-700/50 bg-charcoal-900/50 px-3 py-2 transition-colors hover:border-charcoal-600 hover:bg-charcoal-800"
          aria-label="Open search (Ctrl+K)"
        >
          <Search className="h-4 w-4 text-charcoal-500 transition-colors group-hover:text-charcoal-300" />
          <span className="hidden text-sm text-charcoal-500 transition-colors group-hover:text-charcoal-300 md:inline">
            Search...
          </span>
          <kbd className="hidden h-5 items-center gap-1 rounded border border-charcoal-700 bg-charcoal-800 px-1.5 font-mono text-[10px] font-medium text-charcoal-500 lg:inline-flex">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </button>

        {/* Export button - responsive */}
        <button
          className="relative hidden overflow-hidden rounded-lg bg-gradient-to-b from-bronze-500 to-bronze-600 px-3 py-2 text-sm font-medium text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-bronze-500/20 active:scale-[0.98] sm:block sm:px-4"
          aria-label="Export Report"
        >
          <div
            className="absolute inset-0 bg-white/10 opacity-0 transition-opacity hover:opacity-100"
            aria-hidden="true"
          />
          <span className="hidden md:inline">Export Report</span>
          <span className="md:hidden">Export</span>
        </button>
      </div>
    </header>
  )
}
