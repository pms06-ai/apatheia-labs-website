import { useState } from 'react'
import { Cloud, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { bulkImportDriveFiles } from '@/lib/tauri/commands'
import type { BulkImportProgress } from '@/CONTRACT'
import { useCaseStore } from '@/hooks/use-case-store'

interface BulkDriveImportProps {
  onComplete?: () => void
}

export function BulkDriveImport({ onComplete }: BulkDriveImportProps) {
  const { activeCase } = useCaseStore()
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState<BulkImportProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleBulkImport() {
    if (!activeCase?.id) {
      setError('No active case selected')
      return
    }

    setImporting(true)
    setError(null)
    setProgress(null)

    try {
      const result = await bulkImportDriveFiles(activeCase.id)
      setProgress(result)
      onComplete?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to import files')
    } finally {
      setImporting(false)
    }
  }

  const successCount = progress?.results.filter(r => r.success).length || 0
  const failureCount = progress?.results.filter(r => !r.success).length || 0

  return (
    <Card className="border-charcoal-700 bg-charcoal-800/50 p-6">
      <div className="mb-6 flex items-start gap-4">
        <div className="rounded-lg bg-bronze-500/10 p-3">
          <Cloud className="h-6 w-6 text-bronze-500" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl text-charcoal-100">Bulk Import from Google Drive</h2>
          <p className="mt-1 text-sm text-charcoal-400">
            Import all files from your Google Drive into the active case.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-status-critical/30 bg-status-critical/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-status-critical" />
          <span className="text-status-critical">{error}</span>
        </div>
      )}

      {!activeCase && (
        <div className="mb-4 rounded-lg border border-bronze-500/20 bg-bronze-500/10 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-bronze-400" />
            <p className="text-xs text-bronze-400">
              Please select a case from the sidebar before importing files.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleBulkImport}
          disabled={importing || !activeCase}
          className="w-full rounded-lg bg-bronze-600 px-4 py-3 font-medium text-white transition-colors hover:bg-bronze-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {importing ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing files...
            </span>
          ) : (
            'Import All Files'
          )}
        </button>

        {progress && (
          <div className="space-y-3">
            <div className="rounded-lg border border-charcoal-700 bg-charcoal-900/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-charcoal-300">Import Summary</span>
                <Badge variant="outline" className="border-status-success/50 text-status-success">
                  Completed
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-charcoal-200">{progress.total}</div>
                  <div className="text-xs text-charcoal-500">Total Files</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-status-success">{successCount}</div>
                  <div className="text-xs text-charcoal-500">Successful</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-status-critical">{failureCount}</div>
                  <div className="text-xs text-charcoal-500">Failed</div>
                </div>
              </div>
            </div>

            {progress.results.length > 0 && (
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-charcoal-700 bg-charcoal-900/50 p-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-charcoal-400">
                  Import Results
                </div>
                {progress.results.map(result => (
                  <div
                    key={result.file_id}
                    className="flex items-start gap-3 rounded-lg border border-charcoal-700 bg-charcoal-800 p-3"
                  >
                    {result.success ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-status-success" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-status-critical" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-mono text-sm text-charcoal-200">
                        {result.file_name}
                      </div>
                      {result.error && (
                        <div className="mt-1 text-xs text-status-critical">{result.error}</div>
                      )}
                      {result.document_id && (
                        <div className="mt-1 font-mono text-xs text-charcoal-500">
                          ID: {result.document_id.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
