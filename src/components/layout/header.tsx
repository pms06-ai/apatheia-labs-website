'use client'

import { Search } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-charcoal-600/30 bg-bg-secondary px-6">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-bronze-500 to-bronze-700 font-display text-lg text-white shadow-glow">
            Α
          </div>
          <div>
            <div className="font-display text-base">
              <span className="text-bronze-500">Apatheia</span>
              <span className="text-charcoal-100"> Labs</span>
            </div>
          </div>
        </div>

        <div className="mx-4 h-6 w-px bg-charcoal-600/30" />

        <div className="flex items-center gap-2 rounded-md bg-bg-tertiary px-3 py-1.5">
          <span className="text-xs text-charcoal-400">PHRONESIS</span>
          <span className="text-sm text-bronze-500">FCIP v6.0</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-bg-tertiary px-3 py-2">
          <Search className="h-4 w-4 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search documents, entities, findings..."
            className="w-64 bg-transparent text-sm text-charcoal-100 placeholder:text-charcoal-500 focus:outline-none"
          />
          <kbd className="rounded bg-charcoal-700 px-1.5 py-0.5 text-xs text-charcoal-400">
            ⌘K
          </kbd>
        </div>

        <button className="rounded-lg bg-bronze-600 px-4 py-2 text-sm font-medium text-charcoal-900 transition hover:bg-bronze-500">
          Export Report
        </button>
      </div>
    </header>
  )
}
