/**
 * APATHEIA LABS - VALIDATION SCHEMAS
 * 
 * Zod schemas for validating all API inputs.
 * These ensure type safety and proper error messages.
 */

import { z } from 'zod'

// ============================================
// COMMON SCHEMAS
// ============================================

export const uuidSchema = z.string().uuid('Invalid UUID format')

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

// ============================================
// CASE SCHEMAS
// ============================================

export const caseTypeSchema = z.enum([
  'family_court',
  'regulatory',
  'criminal',
  'civil',
  'media',
])

export const caseStatusSchema = z.enum(['active', 'archived', 'closed'])

export const createCaseSchema = z.object({
  reference: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  case_type: caseTypeSchema,
  description: z.string().max(2000).optional(),
  metadata: z.record(z.unknown()).optional(),
})

export const updateCaseSchema = createCaseSchema.partial()

// ============================================
// DOCUMENT SCHEMAS
// ============================================

export const docTypeSchema = z.enum([
  'court_order',
  'witness_statement',
  'expert_report',
  'police_bundle',
  'social_work_assessment',
  'transcript',
  'correspondence',
  'media',
  'disclosure',
  'threshold_document',
  'position_statement',
  'other',
])

export const uploadDocumentSchema = z.object({
  caseId: uuidSchema,
  docType: docTypeSchema.optional(),
})

export const processDocumentSchema = z.object({
  documentId: uuidSchema,
  options: z.object({
    extractText: z.boolean().default(true),
    generateEmbeddings: z.boolean().default(true),
    extractEntities: z.boolean().default(false),
  }).optional(),
})

// ============================================
// ENGINE SCHEMAS
// ============================================

export const engineIdSchema = z.enum([
  'entity_resolution',
  'temporal_parser',
  'argumentation',
  'bias_detection',
  'contradiction',
  'accountability',
  'professional_tracker',
  'omission',
  'expert_witness',
  'documentary',
  'narrative',
  'coordination',
  'evidence_chain',
])

export const runEngineSchema = z.object({
  caseId: uuidSchema,
  documentIds: z.array(uuidSchema).min(1, 'At least one document required'),
  options: z.object({
    sourceDocIds: z.array(uuidSchema).optional(),
    reportDocIds: z.array(uuidSchema).optional(),
    specificClaim: z.string().max(1000).optional(),
  }).optional(),
})

// Engine-specific schemas
export const omissionEngineOptionsSchema = z.object({
  sourceDocIds: z.array(uuidSchema).min(1, 'Source documents required'),
  reportDocIds: z.array(uuidSchema).min(1, 'Report documents required'),
})

export const narrativeEngineOptionsSchema = z.object({
  specificClaim: z.string().min(1).max(1000).optional(),
  trackFrom: z.string().datetime().optional(),
  trackTo: z.string().datetime().optional(),
})

// ============================================
// SEARCH SCHEMAS
// ============================================

export const searchSchema = z.object({
  q: z.string().min(1).max(500),
  caseId: uuidSchema.optional(),
  docTypes: z.array(docTypeSchema).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export const semanticSearchSchema = z.object({
  query: z.string().min(1).max(1000),
  caseId: uuidSchema,
  threshold: z.coerce.number().min(0).max(1).default(0.7),
  limit: z.coerce.number().int().min(1).max(20).default(5),
})

// ============================================
// FINDING SCHEMAS
// ============================================

export const severitySchema = z.enum(['critical', 'high', 'medium', 'low', 'info'])

export const createFindingSchema = z.object({
  caseId: uuidSchema,
  engine: engineIdSchema,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  finding_type: z.string().max(50).optional(),
  severity: severitySchema.optional(),
  document_ids: z.array(uuidSchema).default([]),
  entity_ids: z.array(uuidSchema).default([]),
  regulatory_targets: z.array(z.string()).default([]),
  evidence: z.record(z.unknown()).default({}),
  metadata: z.record(z.unknown()).default({}),
})

// ============================================
// ANALYSIS SCHEMAS
// ============================================

export const analysisTypeSchema = z.enum([
  'full',
  'entities',
  'claims',
  'contradictions',
  'timeline',
  'omissions',
  'narrative',
])

export const runAnalysisSchema = z.object({
  caseId: uuidSchema,
  analysisType: analysisTypeSchema,
  documentIds: z.array(uuidSchema).optional(),
  options: z.record(z.unknown()).optional(),
})

// ============================================
// ENTITY SCHEMAS
// ============================================

export const entityTypeSchema = z.enum([
  'person',
  'organization',
  'professional',
  'institution',
  'court',
  'police',
  'social_services',
  'expert',
  'media',
  'other',
])

export const createEntitySchema = z.object({
  caseId: uuidSchema,
  canonical_name: z.string().min(1).max(200),
  entity_type: entityTypeSchema,
  aliases: z.array(z.string()).default([]),
  role: z.string().max(100).optional(),
  institution: z.string().max(200).optional(),
  professional_registration: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
})

// ============================================
// REGULATORY SUBMISSION SCHEMAS
// ============================================

export const regulatorSchema = z.enum([
  'ofcom',
  'iopc',
  'lgo',
  'ico',
  'hcpc',
  'bps',
  'ofsted',
  'sra',
  'gmc',
  'nmc',
])

export const submissionStatusSchema = z.enum([
  'draft',
  'in_preparation',
  'filed',
  'acknowledged',
  'investigating',
  'concluded',
])

export const createSubmissionSchema = z.object({
  caseId: uuidSchema,
  regulator: regulatorSchema,
  title: z.string().min(1).max(200),
  summary: z.string().max(5000).optional(),
  finding_ids: z.array(uuidSchema).default([]),
  supporting_document_ids: z.array(uuidSchema).default([]),
})

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate and parse request body
 */
export async function validateBody<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  const body = await request.json().catch(() => ({}))
  return schema.parse(body)
}

/**
 * Validate query parameters
 */
export function validateQuery<T extends z.ZodSchema>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const params = Object.fromEntries(searchParams.entries())
  return schema.parse(params)
}

/**
 * Safe validation that returns result object
 */
export function safeValidate<T extends z.ZodSchema>(
  data: unknown,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Format Zod errors for API response
 */
export function formatZodError(error: z.ZodError): {
  message: string
  errors: Array<{ path: string; message: string }>
} {
  return {
    message: 'Validation failed',
    errors: error.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    })),
  }
}
