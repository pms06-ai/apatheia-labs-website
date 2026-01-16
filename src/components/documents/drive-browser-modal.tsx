'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Folder,
  File,
  FileText,
  ChevronRight,
  Home,
  Loader2,
  AlertCircle,
  Check,
  RefreshCw,
} from 'lucide-react'
import { listDriveFiles, downloadDriveFile, checkGoogleConnection } from '@/lib/tauri/commands'
import type { CloudFile, CloudFileListResult, DocType } from '@/CONTRACT'
import { cn } from '@/lib/utils'

interface DriveBrowserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  caseId: string
  onImportComplete?: () => void
}

interface BreadcrumbItem {
  id: string
  name: string
}

// Supported file types for import
const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'application/rtf',
  'application/vnd.oasis.opendocument.text',
  'image/jpeg',
  'image/png',
  'image/tiff',
]

function getFileIcon(file: CloudFile) {
  if (file.is_folder) {
    return <Folder className="h-5 w-5 text-bronze-400" />
  }
  if (file.mime_type?.includes('pdf')) {
    return <FileText className="h-5 w-5 text-red-400" />
  }
  if (file.mime_type?.includes('word') || file.mime_type?.includes('document')) {
    return <FileText className="h-5 w-5 text-[#2B579A]" />
  }
  if (file.mime_type?.includes('image')) {
    return <File className="h-5 w-5 text-purple-400" />
  }
  return <File className="h-5 w-5 text-charcoal-400" />
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return ''
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function isSupported(file: CloudFile): boolean {
  if (file.is_folder) return true
  return SUPPORTED_MIME_TYPES.some(type => file.mime_type?.includes(type))
}

export function DriveBrowserModal({
  open,
  onOpenChange,
  caseId,
  onImportComplete,
}: DriveBrowserModalProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<CloudFile[]>([])
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | undefined>(undefined)
  const [connected, setConnected] = useState(false)

  const loadFiles = useCallback(
    async (folderId: string | undefined, append = false) => {
      if (!append) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      try {
        const result: CloudFileListResult = await listDriveFiles(
          folderId,
          append ? (nextPageToken ?? undefined) : undefined
        )

        if (!result.success) {
          throw new Error(result.error || 'Failed to load files')
        }

        if (append) {
          setFiles(prev => [...prev, ...result.files])
        } else {
          setFiles(result.files)
        }
        setNextPageToken(result.next_page_token)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load files')
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [nextPageToken]
  )

  const checkConnectionAndLoad = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const status = await checkGoogleConnection()
      if (!status.connected) {
        setConnected(false)
        setError('Google Drive is not connected. Please connect in Settings first.')
        setLoading(false)
        return
      }
      setConnected(true)
      await loadFiles(undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check connection')
      setLoading(false)
    }
  }, [loadFiles])

  // Check connection and load initial files when modal opens
  useEffect(() => {
    if (open) {
      checkConnectionAndLoad()
    } else {
      // Reset state when closing
      setSelectedFiles(new Set())
      setBreadcrumbs([])
      setCurrentFolder(undefined)
      setFiles([])
      setError(null)
    }
  }, [open, checkConnectionAndLoad])

  const navigateToFolder = useCallback(
    (folder: CloudFile) => {
      if (!folder.is_folder) return

      setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }])
      setCurrentFolder(folder.id)
      setSelectedFiles(new Set())
      loadFiles(folder.id)
    },
    [loadFiles]
  )

  const navigateToBreadcrumb = useCallback(
    (index: number) => {
      if (index === -1) {
        // Home
        setBreadcrumbs([])
        setCurrentFolder(undefined)
        setSelectedFiles(new Set())
        loadFiles(undefined)
      } else {
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
        setBreadcrumbs(newBreadcrumbs)
        const folderId = newBreadcrumbs[newBreadcrumbs.length - 1]?.id
        setCurrentFolder(folderId)
        setSelectedFiles(new Set())
        loadFiles(folderId)
      }
    },
    [breadcrumbs, loadFiles]
  )

  const toggleFileSelection = useCallback((file: CloudFile) => {
    if (file.is_folder || !isSupported(file)) return

    setSelectedFiles(prev => {
      const next = new Set(prev)
      if (next.has(file.id)) {
        next.delete(file.id)
      } else {
        next.add(file.id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    const supportedFiles = files.filter(f => !f.is_folder && isSupported(f))
    if (selectedFiles.size === supportedFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(supportedFiles.map(f => f.id)))
    }
  }, [files, selectedFiles.size])

  async function handleImport() {
    if (selectedFiles.size === 0) return

    setImporting(true)
    setImportProgress(0)
    const total = selectedFiles.size
    let completed = 0
    const errors: string[] = []

    for (const fileId of selectedFiles) {
      const file = files.find(f => f.id === fileId)
      if (!file) continue

      try {
        // All imported files use 'other' doc type - user can recategorize later
        const docType: DocType = 'other'

        await downloadDriveFile(fileId, file.name, caseId, docType)
        completed++
        setImportProgress(Math.round((completed / total) * 100))
      } catch (e) {
        errors.push(`${file.name}: ${e instanceof Error ? e.message : 'Import failed'}`)
      }
    }

    setImporting(false)
    setImportProgress(0)
    setSelectedFiles(new Set())

    if (errors.length > 0) {
      toast.error(`${errors.length} file(s) failed to import`)
      console.error('Import errors:', errors)
    }

    if (completed > 0) {
      toast.success(`${completed} file(s) imported successfully`)
      onImportComplete?.()
    }

    if (errors.length === 0) {
      onOpenChange(false)
    }
  }

  const supportedFiles = files.filter(f => !f.is_folder && isSupported(f))

  // Memoize sorted files to avoid mutating state and prevent unnecessary re-sorting
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      // Folders first, then files
      if (a.is_folder && !b.is_folder) return -1
      if (!a.is_folder && b.is_folder) return 1
      return a.name.localeCompare(b.name)
    })
  }, [files])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <svg className="h-5 w-5" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                fill="#0066da"
              />
              <path
                d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
                fill="#00ac47"
              />
              <path
                d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                fill="#ea4335"
              />
              <path
                d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                fill="#00832d"
              />
              <path
                d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                fill="#2684fc"
              />
              <path
                d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                fill="#ffba00"
              />
            </svg>
            Import from Google Drive
          </DialogTitle>
          <DialogDescription>Select files to import into your case corpus.</DialogDescription>
        </DialogHeader>

        <div className="px-6">
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center gap-1 overflow-x-auto rounded-lg border border-charcoal-700 bg-charcoal-900 p-2">
            <button
              onClick={() => navigateToBreadcrumb(-1)}
              className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-sm text-charcoal-300 transition-colors hover:bg-charcoal-700 hover:text-charcoal-100"
            >
              <Home className="h-4 w-4" />
              My Drive
            </button>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex shrink-0 items-center gap-1">
                <ChevronRight className="h-4 w-4 text-charcoal-600" />
                <button
                  onClick={() => navigateToBreadcrumb(index)}
                  className="rounded px-2 py-1 text-sm text-charcoal-300 transition-colors hover:bg-charcoal-700 hover:text-charcoal-100"
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </div>

          {/* File List */}
          <div className="relative h-[400px] overflow-hidden rounded-lg border border-charcoal-700">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal-700 bg-charcoal-900/50 px-4 py-2">
              <div className="flex items-center gap-2">
                {supportedFiles.length > 0 && (
                  <button
                    onClick={selectAll}
                    className="flex items-center gap-2 text-sm text-charcoal-400 transition-colors hover:text-charcoal-200"
                  >
                    <div
                      className={cn(
                        'h-4 w-4 rounded border transition-colors',
                        selectedFiles.size === supportedFiles.length && supportedFiles.length > 0
                          ? 'border-bronze-500 bg-bronze-500'
                          : 'border-charcoal-600'
                      )}
                    >
                      {selectedFiles.size === supportedFiles.length &&
                        supportedFiles.length > 0 && <Check className="h-4 w-4 text-white" />}
                    </div>
                    {selectedFiles.size === supportedFiles.length && supportedFiles.length > 0
                      ? 'Deselect all'
                      : 'Select all'}
                  </button>
                )}
              </div>
              <button
                onClick={() => loadFiles(currentFolder)}
                disabled={loading}
                className="flex items-center gap-1 text-xs text-charcoal-400 transition-colors hover:text-charcoal-200 disabled:opacity-50"
              >
                <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
                Refresh
              </button>
            </div>

            {/* Content */}
            <div className="h-[calc(100%-40px)] overflow-y-auto">
              {loading && !loadingMore ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-bronze-500" />
                </div>
              ) : error ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                  <AlertCircle className="h-8 w-8 text-status-critical" />
                  <p className="text-center text-sm text-charcoal-400">{error}</p>
                  {!connected && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        onOpenChange(false)
                        navigate('/settings')
                      }}
                    >
                      Go to Settings
                    </Button>
                  )}
                </div>
              ) : files.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-charcoal-400">This folder is empty</p>
                </div>
              ) : (
                <div className="divide-y divide-charcoal-700/50">
                  {/* Folders first, then files */}
                  {sortedFiles.map(file => {
                    const supported = isSupported(file)
                    const selected = selectedFiles.has(file.id)

                    return (
                      <button
                        key={file.id}
                        onClick={() =>
                          file.is_folder ? navigateToFolder(file) : toggleFileSelection(file)
                        }
                        disabled={!file.is_folder && !supported}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                          file.is_folder
                            ? 'hover:bg-charcoal-800/50'
                            : supported
                              ? selected
                                ? 'bg-bronze-500/10'
                                : 'hover:bg-charcoal-800/50'
                              : 'cursor-not-allowed opacity-50'
                        )}
                      >
                        {/* Checkbox for files */}
                        {!file.is_folder && supported && (
                          <div
                            className={cn(
                              'h-4 w-4 shrink-0 rounded border transition-colors',
                              selected ? 'border-bronze-500 bg-bronze-500' : 'border-charcoal-600'
                            )}
                          >
                            {selected && <Check className="h-4 w-4 text-white" />}
                          </div>
                        )}

                        {/* Icon */}
                        <div className="shrink-0">{getFileIcon(file)}</div>

                        {/* File info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-charcoal-200">{file.name}</p>
                          <p className="text-xs text-charcoal-500">
                            {file.is_folder
                              ? 'Folder'
                              : `${formatFileSize(file.size)}${file.modified_time ? ` · ${new Date(file.modified_time).toLocaleDateString()}` : ''}`}
                          </p>
                        </div>

                        {/* Folder arrow */}
                        {file.is_folder && (
                          <ChevronRight className="h-4 w-4 shrink-0 text-charcoal-500" />
                        )}
                      </button>
                    )
                  })}

                  {/* Load more */}
                  {nextPageToken && (
                    <button
                      onClick={() => loadFiles(currentFolder, true)}
                      disabled={loadingMore}
                      className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm text-bronze-500 transition-colors hover:bg-charcoal-800/50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        'Load more files'
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6">
          <div className="flex w-full items-center justify-between">
            <p className="text-sm text-charcoal-400">
              {selectedFiles.size > 0
                ? `${selectedFiles.size} file${selectedFiles.size > 1 ? 's' : ''} selected`
                : 'Select files to import'}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={selectedFiles.size === 0 || importing}
              >
                {importing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing... {importProgress}%
                  </span>
                ) : (
                  `Import ${selectedFiles.size > 0 ? `(${selectedFiles.size})` : ''}`
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
