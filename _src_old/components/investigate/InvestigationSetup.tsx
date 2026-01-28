/**
 * Investigation Setup Component
 *
 * Document selection and analysis mode configuration.
 */

'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { FileText, Zap, Layers, Activity, Play } from 'lucide-react'
import type { Document, InvestigationMode, EngineSelection } from '@/CONTRACT'

// ============================================
// Types
// ============================================

export interface InvestigationSetupProps {
  documents: Document[]
  selectedDocIds: string[]
  loadingDocs: boolean
  mode: InvestigationMode
  customEngines: EngineSelection
  error: string | null
  onToggleDocument: (docId: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  onModeChange: (mode: InvestigationMode) => void
  onEngineChange: (key: keyof EngineSelection, checked: boolean) => void
  onStart: () => void
}

// ============================================
// Engine Configuration
// ============================================

const ENGINE_LABELS: Record<keyof EngineSelection, string> = {
  sam: 'S.A.M.',
  contradiction: 'Contradictions',
  omission: 'Omissions',
  temporal: 'Timeline',
  entity: 'Entities',
  bias: 'Bias',
  professional: 'Professional',
  expert: 'Expert',
  accountability: 'Accountability',
  narrative: 'Narrative',
  documentary: 'Documentary',
}

const MODE_OPTIONS = [
  { key: 'quick' as const, label: 'Quick Scan', desc: 'Core findings (4 engines)', icon: <Zap className="h-5 w-5" /> },
  { key: 'full' as const, label: 'Full Investigation', desc: 'S.A.M. + all engines', icon: <Layers className="h-5 w-5" /> },
  { key: 'custom' as const, label: 'Custom', desc: 'Select engines', icon: <Activity className="h-5 w-5" /> },
]

// ============================================
// Component
// ============================================

export function InvestigationSetup({
  documents,
  selectedDocIds,
  loadingDocs,
  mode,
  customEngines,
  error,
  onToggleDocument,
  onSelectAll,
  onClearSelection,
  onModeChange,
  onEngineChange,
  onStart,
}: InvestigationSetupProps) {
  // Count selected engines
  const selectedEngineCount = useMemo(() => {
    return Object.values(customEngines).filter(Boolean).length
  }, [customEngines])

  const canStart = selectedDocIds.length > 0 && (mode !== 'custom' || selectedEngineCount > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-charcoal-100">Analytics Hub</h1>
          <p className="text-sm text-charcoal-400">
            Unified forensic analysis with S.A.M. methodology
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Document Selection */}
        <Card className="p-4 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-charcoal-100">Evidence Corpus</h2>
            <div className="flex gap-2 text-xs">
              <button onClick={onSelectAll} className="text-bronze-400 hover:text-bronze-300 transition">
                Select All
              </button>
              <span className="text-charcoal-600">|</span>
              <button onClick={onClearSelection} className="text-charcoal-400 hover:text-charcoal-300 transition">
                Clear
              </button>
            </div>
          </div>

          {loadingDocs ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-8 w-8" />}
              title="No Documents"
              description="Upload and process documents before analysis"
            />
          ) : (
            <div className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
              {documents.map(doc => (
                <label
                  key={doc.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all ${
                    selectedDocIds.includes(doc.id)
                      ? 'bg-bronze-900/20 border border-bronze-500/30 scale-[1.02]'
                      : 'bg-bg-tertiary hover:bg-charcoal-700 border border-transparent'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedDocIds.includes(doc.id)}
                    onChange={() => onToggleDocument(doc.id)}
                    className="h-4 w-4 rounded border-charcoal-600 bg-bg-tertiary text-bronze-500"
                  />
                  <FileText className="h-4 w-4 shrink-0 text-charcoal-400" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-charcoal-100">{doc.filename}</div>
                    <div className="text-xs text-charcoal-500">{doc.doc_type || 'Document'}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-charcoal-700 pt-4">
            <span className="text-sm text-charcoal-400">
              {selectedDocIds.length} of {documents.length} documents selected
            </span>
            <Badge variant={selectedDocIds.length > 0 ? 'default' : 'info'}>
              {selectedDocIds.length > 0 ? 'Ready' : 'Select Documents'}
            </Badge>
          </div>
        </Card>

        {/* Mode Selection */}
        <Card className="p-4">
          <h2 className="mb-4 font-medium text-charcoal-100">Analysis Mode</h2>

          <div className="space-y-3">
            {MODE_OPTIONS.map(opt => (
              <label
                key={opt.key}
                className={`flex cursor-pointer items-center gap-3 rounded-lg p-4 transition-all ${
                  mode === opt.key
                    ? 'bg-bronze-900/20 border border-bronze-500/30 scale-[1.02]'
                    : 'bg-bg-tertiary hover:bg-charcoal-700 border border-transparent'
                }`}
              >
                <input
                  type="radio"
                  name="mode"
                  value={opt.key}
                  checked={mode === opt.key}
                  onChange={() => onModeChange(opt.key)}
                  className="sr-only"
                />
                <div className={`rounded-lg p-2 transition ${mode === opt.key ? 'bg-bronze-600/20 text-bronze-400' : 'bg-charcoal-700 text-charcoal-400'}`}>
                  {opt.icon}
                </div>
                <div>
                  <div className="font-medium text-charcoal-100">{opt.label}</div>
                  <div className="text-xs text-charcoal-400">{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {mode === 'custom' && (
            <div className="mt-4 rounded-lg border border-charcoal-700 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-charcoal-400">Select engines to run</span>
                <span className={`text-xs ${selectedEngineCount === 0 ? 'text-status-critical' : 'text-charcoal-400'}`}>
                  {selectedEngineCount} selected
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {(Object.entries(ENGINE_LABELS) as [keyof EngineSelection, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={customEngines[key]}
                      onChange={e => onEngineChange(key, e.target.checked)}
                      className="h-3 w-3 rounded border-charcoal-600 bg-bg-tertiary text-bronze-500"
                    />
                    <span className="text-charcoal-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-status-critical/30 bg-status-critical/10 p-3 text-sm text-status-critical">
              {error}
            </div>
          )}

          <button
            onClick={onStart}
            disabled={!canStart}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-bronze-600 px-4 py-3 font-medium text-white transition hover:bg-bronze-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-5 w-5" />
            Run Analysis
          </button>
        </Card>
      </div>
    </div>
  )
}
