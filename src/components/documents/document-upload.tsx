'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle, Loader2 } from 'lucide-react'
import { useUploadDocument, useProcessDocument } from '@/hooks/use-api'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface DocumentUploadProps {
  caseId: string
  onUploadComplete?: () => void
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error'

interface FileUpload {
  file: File
  status: UploadStatus
  progress: number
  documentId?: string
  error?: string
}

const DOC_TYPES = [
  { value: 'court_order', label: 'Court Order' },
  { value: 'witness_statement', label: 'Witness Statement' },
  { value: 'expert_report', label: 'Expert Report' },
  { value: 'police_bundle', label: 'Police Bundle' },
  { value: 'social_work_assessment', label: 'Social Work Assessment' },
  { value: 'transcript', label: 'Transcript' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'disclosure', label: 'Disclosure' },
  { value: 'threshold_document', label: 'Threshold Document' },
  { value: 'other', label: 'Other' },
]

export function DocumentUpload({ caseId, onUploadComplete }: DocumentUploadProps) {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [docType, setDocType] = useState('other')

  const uploadMutation = useUploadDocument()
  const processMutation = useProcessDocument()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      status: 'idle' as UploadStatus,
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.mov'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  const uploadFile = async (index: number) => {
    const fileUpload = files[index]
    if (!fileUpload || fileUpload.status !== 'idle') return

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, status: 'uploading', progress: 0 } : f
      )
    )

    try {
      // Upload
      const result = await uploadMutation.mutateAsync({
        file: fileUpload.file,
        caseId,
        docType: docType as import('@/CONTRACT').DocType,
      })

      // Update to processing
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'processing', progress: 50, documentId: result.id }
            : f
        )
      )

      // Trigger processing
      await processMutation.mutateAsync(result.id)

      // Complete
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'complete', progress: 100 } : f
        )
      )

      toast.success(`${fileUpload.file.name} uploaded and processed`)
      onUploadComplete?.()
    } catch (_error) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        )
      )
      toast.error(`Failed to upload ${fileUpload.file.name}`)
    }
  }

  const uploadAll = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'idle') {
        await uploadFile(i)
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== 'complete'))
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-medium text-charcoal-100">Upload Documents</h3>

      {/* Document Type Selector */}
      <div className="mb-4">
        <label className="mb-2 block text-sm text-charcoal-400">
          Document Type
        </label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full rounded-lg border border-charcoal-600 bg-bg-tertiary px-3 py-2 text-sm text-charcoal-100 focus:border-bronze-500 focus:outline-none"
        >
          {DOC_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${isDragActive
          ? 'border-bronze-500 bg-bronze-500/10'
          : 'border-charcoal-600 hover:border-charcoal-500'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-charcoal-500" />
        <p className="mt-2 text-sm text-charcoal-400">
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files, or click to select'}
        </p>
        <p className="mt-1 text-xs text-charcoal-500">
          PDF, DOCX, TXT, Audio, Video (max 100MB)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((fileUpload, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3"
            >
              <File className="h-5 w-5 text-charcoal-500" />
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm text-charcoal-200">
                  {fileUpload.file.name}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-charcoal-700">
                    <div
                      className={`h-full transition-all ${fileUpload.status === 'complete'
                        ? 'bg-status-success'
                        : fileUpload.status === 'error'
                          ? 'bg-status-critical'
                          : 'bg-bronze-500'
                        }`}
                      style={{ width: `${fileUpload.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-charcoal-500">
                    {fileUpload.status === 'idle' && 'Ready'}
                    {fileUpload.status === 'uploading' && 'Uploading...'}
                    {fileUpload.status === 'processing' && 'Processing...'}
                    {fileUpload.status === 'complete' && 'Complete'}
                    {fileUpload.status === 'error' && fileUpload.error}
                  </span>
                </div>
              </div>
              {fileUpload.status === 'idle' && (
                <button
                  onClick={() => removeFile(index)}
                  className="text-charcoal-500 hover:text-charcoal-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {fileUpload.status === 'complete' && (
                <CheckCircle className="h-5 w-5 text-status-success" />
              )}
              {(fileUpload.status === 'uploading' ||
                fileUpload.status === 'processing') && (
                  <Loader2 className="h-5 w-5 animate-spin text-bronze-500" />
                )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={uploadAll}
              disabled={files.every((f) => f.status !== 'idle')}
              className="flex-1 rounded-lg bg-bronze-600 px-4 py-2 text-sm font-medium text-charcoal-900 transition hover:bg-bronze-500 disabled:opacity-50"
            >
              Upload All
            </button>
            {files.some((f) => f.status === 'complete') && (
              <button
                onClick={clearCompleted}
                className="rounded-lg border border-charcoal-600 px-4 py-2 text-sm text-charcoal-300 transition hover:bg-charcoal-700"
              >
                Clear Completed
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
