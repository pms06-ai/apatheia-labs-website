/**
 * Phronesis FCIP - Tauri Desktop Client
 * 
 * Provides IPC communication with the Rust backend when running in Tauri.
 * Falls back to mock data in browser mode.
 */

import type {
  Case,
  Document,
  Entity,
  Finding,
  Contradiction,
  Omission,
  CaseType,
  DocType,
  ProcessingStatus,
} from '@/CONTRACT'

// ============================================
// Environment Detection
// ============================================

/**
 * Check if running in Tauri desktop environment
 */
export const isDesktop = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI__' in window
}

/**
 * Check if running in browser/web mode
 */
export const isWeb = (): boolean => !isDesktop()

// ============================================
// Tauri API Types
// ============================================

interface TauriInvokeOptions {
  [key: string]: unknown
}

interface TauriAPI {
  invoke<T>(cmd: string, args?: TauriInvokeOptions): Promise<T>
}

/**
 * Get Tauri invoke function if available
 */
async function getTauriInvoke(): Promise<TauriAPI['invoke'] | null> {
  if (!isDesktop()) return null
  
  try {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke
  } catch {
    console.warn('Failed to load Tauri API')
    return null
  }
}

// ============================================
// Response Types (matching Rust structs)
// ============================================

interface ApiResult<T> {
  success: boolean
  data?: T
  error?: string
}

interface CasesListResult {
  success: boolean
  data: Case[]
  error?: string
}

interface DocumentsListResult {
  success: boolean
  data: Document[]
  error?: string
}

interface FindingsResult {
  success: boolean
  data: Finding[]
  error?: string
}

interface AnalysisResult {
  success: boolean
  findings: Finding[]
  contradictions: Contradiction[]
  omissions: Omission[]
  error?: string
}

interface EngineResult {
  success: boolean
  engine_id: string
  findings: Finding[]
  duration_ms: number
  error?: string
}

// ============================================
// Tauri Client Class
// ============================================

/**
 * Tauri client for desktop IPC operations
 */
export class TauriClient {
  private invoke: TauriAPI['invoke'] | null = null
  private initialized = false

  async init(): Promise<void> {
    if (this.initialized) return
    this.invoke = await getTauriInvoke()
    this.initialized = true
  }

  private async call<T>(cmd: string, args?: TauriInvokeOptions): Promise<T> {
    await this.init()
    
    if (!this.invoke) {
      throw new Error('Tauri API not available - running in browser mode')
    }
    
    return this.invoke<T>(cmd, args)
  }

  // ==========================================
  // Case Operations
  // ==========================================

  async getCases(): Promise<Case[]> {
    const result = await this.call<CasesListResult>('get_cases')
    if (!result.success) throw new Error(result.error || 'Failed to get cases')
    return result.data
  }

  async getCase(caseId: string): Promise<Case | null> {
    const result = await this.call<ApiResult<Case>>('get_case', { caseId })
    return result.data ?? null
  }

  async createCase(input: {
    reference: string
    name: string
    case_type: CaseType
    description?: string
  }): Promise<Case> {
    const result = await this.call<ApiResult<Case>>('create_case', { input })
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create case')
    }
    return result.data
  }

  async deleteCase(caseId: string): Promise<void> {
    const result = await this.call<ApiResult<null>>('delete_case', { caseId })
    if (!result.success) throw new Error(result.error || 'Failed to delete case')
  }

  // ==========================================
  // Document Operations
  // ==========================================

  async getDocuments(caseId: string): Promise<Document[]> {
    const result = await this.call<DocumentsListResult>('get_documents', { caseId })
    if (!result.success) throw new Error(result.error || 'Failed to get documents')
    return result.data
  }

  async getDocument(documentId: string): Promise<Document | null> {
    const result = await this.call<ApiResult<Document>>('get_document', { documentId })
    return result.data ?? null
  }

  async uploadDocument(input: {
    case_id: string
    filename: string
    file_type: string
    doc_type?: DocType
    data: number[] // Uint8Array as number array for IPC
  }): Promise<Document> {
    const result = await this.call<ApiResult<Document>>('upload_document', { input })
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to upload document')
    }
    return result.data
  }

  async updateDocumentStatus(
    documentId: string,
    status: ProcessingStatus,
    extractedText?: string
  ): Promise<Document> {
    const result = await this.call<ApiResult<Document>>('update_document_status', {
      documentId,
      status,
      extractedText,
    })
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to update document status')
    }
    return result.data
  }

  async deleteDocument(documentId: string): Promise<void> {
    const result = await this.call<ApiResult<null>>('delete_document', { documentId })
    if (!result.success) throw new Error(result.error || 'Failed to delete document')
  }

  // ==========================================
  // Analysis Operations
  // ==========================================

  async getFindings(caseId: string): Promise<Finding[]> {
    const result = await this.call<FindingsResult>('get_findings', { caseId })
    if (!result.success) throw new Error(result.error || 'Failed to get findings')
    return result.data
  }

  async getAnalysis(caseId: string): Promise<{
    findings: Finding[]
    contradictions: Contradiction[]
    omissions: Omission[]
  }> {
    const result = await this.call<AnalysisResult>('get_analysis', { caseId })
    if (!result.success) throw new Error(result.error || 'Failed to get analysis')
    return {
      findings: result.findings,
      contradictions: result.contradictions,
      omissions: result.omissions,
    }
  }

  async runEngine(input: {
    case_id: string
    engine_id: string
    document_ids: string[]
    options?: Record<string, unknown>
  }): Promise<EngineResult> {
    const result = await this.call<EngineResult>('run_engine', { input })
    if (!result.success) throw new Error(result.error || 'Failed to run engine')
    return result
  }

  async saveFinding(finding: Finding): Promise<void> {
    const result = await this.call<FindingsResult>('save_finding', { finding })
    if (!result.success) throw new Error(result.error || 'Failed to save finding')
  }

  // ==========================================
  // File Picker Operations
  // ==========================================

  async pickDocuments(): Promise<{ path: string; filename: string }[]> {
    const result = await this.call<{
      success: boolean
      files: { path: string; filename: string }[]
      error?: string
    }>('pick_documents')
    if (!result.success) throw new Error(result.error || 'Failed to pick documents')
    return result.files
  }

  async uploadFromPath(
    caseId: string,
    filePath: string,
    docType?: string
  ): Promise<Document> {
    const result = await this.call<ApiResult<Document>>('upload_from_path', {
      caseId,
      filePath,
      docType,
    })
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to upload document')
    }
    return result.data
  }
}

// ============================================
// Singleton Instance
// ============================================

let _tauriClient: TauriClient | null = null

/**
 * Get the Tauri client singleton
 */
export function getTauriClient(): TauriClient {
  if (!_tauriClient) {
    _tauriClient = new TauriClient()
  }
  return _tauriClient
}

// ============================================
// Helper for File Upload
// ============================================

/**
 * Convert File to array of bytes for Tauri IPC
 */
export async function fileToBytes(file: File): Promise<number[]> {
  const buffer = await file.arrayBuffer()
  return Array.from(new Uint8Array(buffer))
}

