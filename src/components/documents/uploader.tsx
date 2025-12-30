'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUploadDocument, useProcessDocument } from '@/hooks/use-api'
import { useCaseStore } from '@/hooks/use-case-store'
import { formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'video/mp4': ['.mp4'],
}

const DOC_TYPES = [
  { value: 'court_order', label: 'Court Order' },
  { value: 'witness_statement', label: 'Witness Statement' },
  { value: 'expert_report', label: 'Expert Report' },
  { value: 'police_bundle', label: 'Police Bundle' },
  { value: 'social_work_assessment', label: 'SW Assessment' },
  { value: 'transcript', label: 'Transcript' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'disclosure', label: 'Disclosure' },
  { value: 'threshold_document', label: 'Threshold Document' },
  { value: 'other', label: 'Other' },
]

interface QueuedFile {
  file: File
  docType: string
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}

export function DocumentUploader() {
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const activeCase = useCaseStore((state) => state.activeCase)

  const uploadMutation = useUploadDocument()
  const processMutation = useProcessDocument()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      docType: 'other',
      status: 'pending' as const,
      progress: 0,
    }))
    setQueue((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const updateFileType = (index: number, docType: string) => {
    setQueue((prev) =>
      prev.map((item, i) => (i === index ? { ...item, docType } : item))
    )
  }

  const removeFile = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFile = async (index: number) => {
    if (!activeCase) {
      toast.error('No active case selected')
      return
    }

    const item = queue[index]

    setQueue((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, status: 'uploading', progress: 30 } : f
      )
    )

    try {
      const result = await uploadMutation.mutateAsync({
        file: item.file,
        caseId: activeCase.id,
        docType: item.docType,
      })

      setQueue((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'processing', progress: 60 } : f
        )
      )

      // Trigger processing
      await processMutation.mutateAsync(result.document_id)

      setQueue((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'completed', progress: 100 } : f
        )
      )

      toast.success(`${item.file.name} uploaded and processed`)
    } catch (_error) {
      setQueue((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        )
      )
      toast.error(`Failed to upload ${item.file.name}`)
    }
  }

  const uploadAll = async () => {
    const pendingIndices = queue
      .map((item, index) => (item.status === 'pending' ? index : -1))
      .filter((i) => i !== -1)

    for (const index of pendingIndices) {
      await uploadFile(index)
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${isDragActive
            ? 'border-bronze-500 bg-bronze-500/10'
            : 'border-charcoal-600 hover:border-charcoal-500 hover:bg-charcoal-800/50'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-charcoal-500" />
        <p className="mt-4 text-sm text-charcoal-300">
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-charcoal-500">
          PDF, DOCX, TXT, MP3, WAV, MP4 (max 50MB)
        </p>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <Card className="divide-y divide-charcoal-600/30">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-sm font-medium text-charcoal-100">
              Upload Queue ({queue.length} files)
            </h3>
            <button
              onClick={uploadAll}
              disabled={!activeCase || queue.every((f) => f.status !== 'pending')}
              className="rounded-md bg-bronze-600 px-3 py-1.5 text-xs font-medium text-charcoal-900 transition hover:bg-bronze-500 disabled:opacity-50"
            >
              Upload All
            </button>
          </div>

          {queue.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-4 py-3"
            >
              <FileText className="h-8 w-8 text-charcoal-500" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm text-charcoal-200">
                    {item.file.name}
                  </span>
                  <span className="text-xs text-charcoal-500">
                    {formatFileSize(item.file.size)}
                  </span>
                </div>

                {/* Progress bar */}
                {item.status !== 'pending' && (
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-charcoal-700">
                    <div
                      className={`h-full transition-all ${item.status === 'completed'
                          ? 'bg-status-success'
                          : item.status === 'error'
                            ? 'bg-status-critical'
                            : 'bg-bronze-500'
                        }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Doc type selector */}
              {item.status === 'pending' && (
                <select
                  value={item.docType}
                  onChange={(e) => updateFileType(index, e.target.value)}
                  className="rounded-md border border-charcoal-600 bg-charcoal-800 px-2 py-1 text-xs text-charcoal-200"
                >
                  {DOC_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Status */}
              {item.status === 'uploading' && (
                <Loader2 className="h-4 w-4 animate-spin text-bronze-500" />
              )}
              {item.status === 'processing' && (
                <Badge variant="info">Processing</Badge>
              )}
              {item.status === 'completed' && (
                <Badge variant="success">Done</Badge>
              )}
              {item.status === 'error' && (
                <Badge variant="critical">Error</Badge>
              )}

              {/* Actions */}
              {item.status === 'pending' && (
                <>
                  <button
                    onClick={() => uploadFile(index)}
                    disabled={!activeCase}
                    className="rounded-md bg-bronze-600 px-2 py-1 text-xs font-medium text-charcoal-900 transition hover:bg-bronze-500 disabled:opacity-50"
                  >
                    Upload
                  </button>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-charcoal-500 hover:text-charcoal-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
