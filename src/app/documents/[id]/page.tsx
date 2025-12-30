/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { useDocument } from '@/hooks/use-api'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, HardDrive, Hash, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function DocumentPage() {
    const params = useParams()
    const id = params?.id as string
    const { data: document, isLoading } = useDocument(id)

    if (isLoading) {
        return (
            <div className="flex h-screen flex-col bg-bg-primary">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-bronze-500 border-t-transparent" />
                            <div className="text-charcoal-400 font-mono text-sm animate-pulse">
                                Retrieving Document Metadata...
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!document) {
        return (
            <div className="flex h-screen flex-col bg-bg-primary">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        <Link href="/documents" className="flex items-center gap-2 text-charcoal-400 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Corpus
                        </Link>
                        <Card className="p-12 text-center bg-charcoal-800/50 border-charcoal-700">
                            <h2 className="text-xl font-display text-charcoal-200">Document Not Found</h2>
                            <p className="mt-2 text-charcoal-400">The requested document identifier references a null pointer.</p>
                        </Card>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen flex-col bg-bg-primary">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-hidden flex flex-col min-w-0">
                    {/* Top Bar */}
                    <header className="shrink-0 border-b border-charcoal-700 bg-bg-secondary/50 px-6 py-4 backdrop-blur-md">
                        <div className="mb-4">
                            <Link href="/documents" className="flex items-center gap-2 text-xs font-medium text-bronze-500 hover:text-bronze-400 transition-colors w-fit">
                                <ArrowLeft className="h-3 w-3" />
                                RETURN TO CORPUS
                            </Link>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="font-display text-2xl text-charcoal-100 dark:shadow-none tracking-tight">
                                        {document.filename}
                                    </h1>
                                    <Badge variant="outline" className="border-bronze-500/30 text-bronze-500 bg-bronze-500/5 uppercase tracking-wider font-mono text-[10px]">
                                        {(document.doc_type || 'unknown').replace(/_/g, ' ')}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-6 text-xs text-charcoal-400 font-mono">
                                    <div className="flex items-center gap-1.5">
                                        <Hash className="h-3 w-3" />
                                        {document.id.slice(0, 8)}...
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <HardDrive className="h-3 w-3" />
                                        {formatFileSize(document.file_size || 0)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(document.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-12 gap-6 h-full">
                            {/* Main Document View - Left/Center */}
                            <div className="col-span-8 flex flex-col gap-6">
                                <Card className="flex-1 bg-charcoal-800/20 border-charcoal-700 p-0 overflow-hidden flex flex-col shadow-inner">
                                    <div className="border-b border-charcoal-700/50 bg-charcoal-900/50 px-4 py-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-charcoal-400 uppercase tracking-widest font-bold">
                                            <FileText className="h-3 w-3" />
                                            Text Content
                                        </div>
                                        <div className="text-[10px] text-charcoal-500 font-mono">
                                            EXTRACTED TEXT
                                        </div>
                                    </div>
                                    <div className="flex-1 p-8 overflow-y-auto font-serif text-charcoal-200 leading-relaxed whitespace-pre-wrap selection:bg-bronze-500/30">
                                        {document.extracted_text || (
                                            <span className="text-charcoal-500 italic">No text content extracted available. Run OCR analysis.</span>
                                        )}
                                    </div>
                                </Card>
                            </div>

                            {/* Sidebar Metadata Analysis - Right */}
                            <div className="col-span-4 flex flex-col gap-6">
                                <Card className="p-0 border-charcoal-700 bg-charcoal-800/40">
                                    <div className="border-b border-charcoal-700/50 px-4 py-3">
                                        <h3 className="font-display text-sm text-charcoal-100">Analysis Metadata</h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-charcoal-500 uppercase tracking-wider font-bold">SHA-256 Checksum</label>
                                            <div className="font-mono text-xs text-bronze-500 break-all bg-black/20 p-2 rounded border border-charcoal-700/50">
                                                {document.hash_sha256 || 'PENDING CALCULATION'}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-charcoal-500 uppercase tracking-wider font-bold">Page Count</label>
                                                <div className="text-sm text-charcoal-200">{document.page_count || 0}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-charcoal-500 uppercase tracking-wider font-bold">Processing Status</label>
                                                <div className="text-sm text-charcoal-200 capitalize">{document.status || 'Received'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-0 border-charcoal-700 bg-charcoal-800/40 flex-1">
                                    <div className="border-b border-charcoal-700/50 px-4 py-3">
                                        <h3 className="font-display text-sm text-charcoal-100">Related Findings</h3>
                                    </div>
                                    <div className="p-8 text-center text-charcoal-500 text-sm">
                                        {/* Placeholder for findings linked to this doc */}
                                        No findings linked specifically to this document.
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
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
