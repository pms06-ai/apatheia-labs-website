'use client'

import { FileText, Download, Eye } from 'lucide-react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useDocuments } from '@/hooks/use-api'
import { useCaseStore } from '@/hooks/use-case-store'

const DOC_TYPE_COLORS: Record<string, string> = {
    police_bundle: 'bg-status-critical/20 text-status-critical',
    social_work_assessment: 'bg-status-high/20 text-status-high',
    expert_report: 'bg-status-medium/20 text-status-medium',
    court_order: 'bg-bronze-500/20 text-bronze-500',
    witness_statement: 'bg-status-low/20 text-status-low',
    disclosure: 'bg-charcoal-500/20 text-charcoal-300',
    other: 'bg-charcoal-600/20 text-charcoal-400',
}

export function DocumentsList() {
    const { activeCase } = useCaseStore()
    const caseId = activeCase?.id || ''
    const { data: documents, isLoading, error } = useDocuments(caseId)

    if (!caseId) {
        return (
            <Card className="p-12 text-center bg-charcoal-800/50 border-charcoal-700">
                <p className="text-charcoal-400 font-display">Select a case to view document corpus</p>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 animate-pulse rounded-lg bg-charcoal-800/50 border border-charcoal-700/50" />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <Card className="p-8 text-center border-status-critical/30 bg-status-critical/5">
                <p className="text-status-critical font-medium">Failed to retrieve document corpus</p>
            </Card>
        )
    }

    if (!documents || documents.length === 0) {
        return (
            <Card className="p-12 text-center bg-charcoal-800/30 border-charcoal-700 border-dashed">
                <FileText className="h-12 w-12 mx-auto mb-4 text-charcoal-600" />
                <p className="text-charcoal-400 font-medium">No documents ingested</p>
                <p className="text-sm text-charcoal-500 mt-1">
                    Upload PDF or text files to begin the breakdown
                </p>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="font-display text-sm text-charcoal-400 uppercase tracking-widest">
                    Corpus Inventory ({documents.length})
                </h2>
            </div>

            <div className="grid gap-3">
                {documents.map((doc) => (
                    <Link href={`/documents/${doc.id}`} key={doc.id} className="block group">
                        <Card className="flex items-center gap-4 p-4 border-charcoal-700 bg-charcoal-800/40 hover:bg-charcoal-800/80 hover:border-bronze-500/50 hover:shadow-[0_0_15px_rgba(184,134,11,0.1)] transition-all duration-300">
                            <div className="h-12 w-12 rounded-lg bg-charcoal-900 flex items-center justify-center border border-charcoal-700 group-hover:border-bronze-500/30 transition-colors">
                                <FileText className="h-6 w-6 text-charcoal-400 group-hover:text-bronze-500 transition-colors" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-charcoal-100 truncate group-hover:text-white transition-colors">
                                        {doc.filename}
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className={`border-0 uppercase tracking-wider font-bold text-[10px] px-1.5 py-0.5 ${DOC_TYPE_COLORS[doc.doc_type || 'other'] || DOC_TYPE_COLORS.other}`}
                                    >
                                        {(doc.doc_type || 'other').replace(/_/g, ' ')}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1.5 text-xs text-charcoal-500 font-mono">
                                    <span>{formatFileSize(doc.file_size || 0)}</span>
                                    <span className="w-px h-3 bg-charcoal-700" />
                                    {doc.page_count && (
                                        <>
                                            <span>{doc.page_count} PAGES</span>
                                            <span className="w-px h-3 bg-charcoal-700" />
                                        </>
                                    )}
                                    <span>{formatDate(doc.created_at)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                <div
                                    className="p-2 rounded-lg bg-charcoal-900 border border-charcoal-700 text-bronze-500"
                                >
                                    <Eye className="h-4 w-4" />
                                </div>
                                <div
                                    className="p-2 rounded-lg bg-charcoal-900 border border-charcoal-700 text-charcoal-400 hover:text-white transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // TODO: Implement download
                                    }}
                                >
                                    <Download className="h-4 w-4" />
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'Unknown date'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}
