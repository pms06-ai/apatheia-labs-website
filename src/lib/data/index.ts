/**
 * Unified Data Layer
 * 
 * Environment-aware data access layer that routes to Tauri IPC (desktop)
 * or Supabase (web) based on runtime environment.
 */

import { isDesktop } from '@/lib/tauri'
import type {
  Case,
  Document,
  Entity,
  Finding,
  Claim,
  Contradiction,
  Omission,
  CaseType,
  DocType,
  ProcessingStatus,
} from '@/CONTRACT'

// ============================================
// Types
// ============================================

export interface CreateCaseInput {
  reference: string
  name: string
  case_type: CaseType
  description?: string
}

export interface UploadDocumentInput {
  caseId: string
  file: File
  docType?: DocType
}

export interface RunEngineInput {
  caseId: string
  engineId: string
  documentIds: string[]
  options?: Record<string, unknown>
}

export interface AnalysisResult {
  findings: Finding[]
  contradictions: Contradiction[]
  omissions: Omission[]
}

export interface EngineResult {
  success: boolean
  engineId: string
  findings: Finding[]
  durationMs: number
  error?: string
}

// ============================================
// Data Layer Interface
// ============================================

export interface DataLayer {
  // Cases
  getCases(): Promise<Case[]>
  getCase(caseId: string): Promise<Case | null>
  createCase(input: CreateCaseInput): Promise<Case>
  deleteCase(caseId: string): Promise<void>

  // Documents
  getDocuments(caseId: string): Promise<Document[]>
  getDocument(documentId: string): Promise<Document | null>
  uploadDocument(input: UploadDocumentInput): Promise<Document>
  deleteDocument(documentId: string): Promise<void>

  // Entities
  getEntities(caseId: string): Promise<Entity[]>

  // Findings
  getFindings(caseId: string, engine?: string): Promise<Finding[]>

  // Claims
  getClaims(caseId: string): Promise<Claim[]>

  // Contradictions
  getContradictions(caseId: string): Promise<Contradiction[]>

  // Analysis
  getAnalysis(caseId: string): Promise<AnalysisResult>
  runEngine(input: RunEngineInput): Promise<EngineResult>
}

// ============================================
// Tauri Implementation
// ============================================

async function createTauriDataLayer(): Promise<DataLayer> {
  const tauri = await import('@/lib/tauri/commands')
  
  return {
    // Cases
    async getCases() {
      return tauri.getCases()
    },
    async getCase(caseId: string) {
      return tauri.getCase(caseId)
    },
    async createCase(input: CreateCaseInput) {
      return tauri.createCase(input)
    },
    async deleteCase(caseId: string) {
      return tauri.deleteCase(caseId)
    },

    // Documents
    async getDocuments(caseId: string) {
      return tauri.getDocuments(caseId)
    },
    async getDocument(documentId: string) {
      return tauri.getDocument(documentId)
    },
    async uploadDocument(input: UploadDocumentInput) {
      return tauri.uploadDocument(input.caseId, input.file, input.docType)
    },
    async deleteDocument(documentId: string) {
      return tauri.deleteDocument(documentId)
    },

    // Entities
    async getEntities(caseId: string) {
      // TODO: Implement in Tauri backend
      console.log('[Tauri] getEntities not yet implemented', caseId)
      return []
    },

    // Findings
    async getFindings(caseId: string, _engine?: string) {
      return tauri.getFindings(caseId)
    },

    // Claims
    async getClaims(caseId: string) {
      // TODO: Implement in Tauri backend
      console.log('[Tauri] getClaims not yet implemented', caseId)
      return []
    },

    // Contradictions
    async getContradictions(caseId: string) {
      const analysis = await tauri.getAnalysis(caseId)
      return analysis.contradictions
    },

    // Analysis
    async getAnalysis(caseId: string) {
      return tauri.getAnalysis(caseId)
    },
    async runEngine(input: RunEngineInput) {
      const result = await tauri.runEngine({
        case_id: input.caseId,
        engine_id: input.engineId,
        document_ids: input.documentIds,
        options: input.options,
      })
      return {
        success: result.success,
        engineId: result.engine_id,
        findings: result.findings,
        durationMs: result.duration_ms,
        error: result.error,
      }
    },
  }
}

// ============================================
// Supabase/Web Implementation
// ============================================

async function createWebDataLayer(): Promise<DataLayer> {
  const { createClient } = await import('@/lib/supabase/client')
  const supabase = createClient()

  return {
    // Cases
    async getCases() {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Case[]
    },
    async getCase(caseId: string) {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single()
      if (error) return null
      return data as Case
    },
    async createCase(input: CreateCaseInput) {
      const { data, error } = await supabase
        .from('cases')
        .insert({
          reference: input.reference,
          name: input.name,
          case_type: input.case_type,
          description: input.description,
          status: 'active',
        })
        .select()
        .single()
      if (error) throw error
      return data as Case
    },
    async deleteCase(caseId: string) {
      const { error } = await supabase.from('cases').delete().eq('id', caseId)
      if (error) throw error
    },

    // Documents
    async getDocuments(caseId: string) {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Document[]
    },
    async getDocument(documentId: string) {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single()
      if (error) return null
      return data as Document
    },
    async uploadDocument(input: UploadDocumentInput) {
      const formData = new FormData()
      formData.append('file', input.file)
      formData.append('caseId', input.caseId)
      if (input.docType) formData.append('docType', input.docType)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Upload failed')
      return response.json()
    },
    async deleteDocument(documentId: string) {
      const { error } = await supabase.from('documents').delete().eq('id', documentId)
      if (error) throw error
    },

    // Entities
    async getEntities(caseId: string) {
      const { data, error } = await supabase
        .from('entities')
        .select('*')
        .eq('case_id', caseId)
        .order('canonical_name')
      if (error) throw error
      return data as Entity[]
    },

    // Findings
    async getFindings(caseId: string, engine?: string) {
      let query = supabase
        .from('findings')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      if (engine) query = query.eq('engine', engine)
      const { data, error } = await query
      if (error) throw error
      return data as Finding[]
    },

    // Claims
    async getClaims(caseId: string) {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Claim[]
    },

    // Contradictions
    async getContradictions(caseId: string) {
      const { data, error } = await supabase
        .from('contradictions')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Contradiction[]
    },

    // Analysis
    async getAnalysis(caseId: string) {
      // Inline queries instead of using this to avoid binding issues
      const findingsQuery = supabase
        .from('findings')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      
      const contradictionsQuery = supabase
        .from('contradictions')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
      
      const [findingsResult, contradictionsResult] = await Promise.all([
        findingsQuery,
        contradictionsQuery,
      ])
      
      return { 
        findings: (findingsResult.data || []) as Finding[], 
        contradictions: (contradictionsResult.data || []) as Contradiction[], 
        omissions: [] 
      }
    },
    async runEngine(input: RunEngineInput) {
      const response = await fetch(`/api/engines/${input.engineId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: input.caseId,
          documentIds: input.documentIds,
          options: input.options,
        }),
      })
      if (!response.ok) throw new Error('Engine execution failed')
      return response.json()
    },
  }
}

// ============================================
// Data Layer Singleton
// ============================================

let _dataLayer: DataLayer | null = null

/**
 * Get the data layer singleton
 * Automatically routes to Tauri (desktop) or Supabase (web)
 */
export async function getDataLayer(): Promise<DataLayer> {
  if (_dataLayer) return _dataLayer

  if (isDesktop()) {
    console.log('[DataLayer] Using Tauri backend')
    _dataLayer = await createTauriDataLayer()
  } else {
    console.log('[DataLayer] Using Supabase backend')
    _dataLayer = await createWebDataLayer()
  }

  return _dataLayer
}

/**
 * Synchronous check if we're in desktop mode
 */
export { isDesktop } from '@/lib/tauri'

