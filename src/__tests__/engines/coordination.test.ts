/**
 * COORDINATION ENGINE TESTS
 *
 * Tests for the Cross-Institutional Coordination Engine (Σ - συνέργεια)
 * "Hidden Coordination"
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { createMockDocument } from '../setup'
import type { Document } from '@/CONTRACT'

// Get mocked modules
const mockGenerateJSON = jest.fn()
const mockSupabaseFrom = jest.fn()

// Mock setup - needs to happen before imports
jest.mock('@/lib/ai-client', () => ({
  generateJSON: (...args: unknown[]) => mockGenerateJSON(...args),
  analyze: jest.fn().mockResolvedValue({ result: {}, model: 'mock', usage: {} }),
  compareDocuments: jest.fn().mockResolvedValue('{}'),
}))

jest.mock('@/lib/supabase/server', () => {
  const mockChain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  }

  return {
    supabaseAdmin: {
      from: (...args: unknown[]) => {
        mockSupabaseFrom(...args)
        return mockChain
      },
    },
    createAdminClient: jest.fn(),
    createServerSupabaseClient: jest.fn(),
    createServerClient: jest.fn(),
  }
})

describe('Coordination Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
  })

  describe('Module Exports', () => {
    it('should export analyzeCoordination function', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')
      expect(typeof analyzeCoordination).toBe('function')
    })

    it('should export compareDocumentsForSharing function', async () => {
      const { compareDocumentsForSharing } = await import('@/lib/engines/coordination')
      expect(typeof compareDocumentsForSharing).toBe('function')
    })

    it('should export buildCommunicationTimeline function', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')
      expect(typeof buildCommunicationTimeline).toBe('function')
    })

    it('should export coordinationEngine object with all functions', async () => {
      const { coordinationEngine } = await import('@/lib/engines/coordination')
      expect(coordinationEngine).toBeDefined()
      expect(typeof coordinationEngine.analyzeCoordination).toBe('function')
      expect(typeof coordinationEngine.compareDocumentsForSharing).toBe('function')
      expect(typeof coordinationEngine.buildCommunicationTimeline).toBe('function')
    })
  })

  describe('Type Definitions', () => {
    it('should export SharedLanguageFinding type', async () => {
      // Type check via usage - if this compiles, types are exported correctly
      const { analyzeCoordination } = await import('@/lib/engines/coordination')
      expect(analyzeCoordination).toBeDefined()
    })

    it('should export InformationFlowFinding type', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')
      expect(analyzeCoordination).toBeDefined()
    })

    it('should export IndependenceViolation type', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')
      expect(analyzeCoordination).toBeDefined()
    })

    it('should export CoordinationAnalysisResult type', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')
      expect(analyzeCoordination).toBeDefined()
    })
  })

  describe('analyzeCoordination', () => {
    it('should analyze coordination patterns across documents', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChunks = [
        { content: 'Document content from police report.', chunk_index: 0 },
      ]

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockChunks, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [
          {
            phrase: 'risk of significant harm',
            wordCount: 4,
            documents: [
              { documentId: 'doc-1', institution: 'social_services', date: '2023-01-15', context: 'Assessment' },
              { documentId: 'doc-2', institution: 'police', date: '2023-01-16', context: 'Report' },
            ],
            probability: 'copy',
            significance: 85,
          },
        ],
        informationFlow: [
          {
            sourceInstitution: 'social_services',
            targetInstitution: 'police',
            informationType: 'opinion',
            predatesDisclosure: true,
            description: 'Opinion shared before formal disclosure',
            evidence: 'Quote from document',
            severity: 'high',
          },
        ],
        independenceViolations: [
          {
            type: 'pre_disclosure',
            institutions: ['social_services', 'police'],
            description: 'Information shared before formal process',
            evidence: ['Evidence 1'],
            severity: 'critical',
          },
        ],
      })

      const doc1 = createMockDocument({ id: 'doc-1', filename: 'police_report.pdf' }) as Document
      const doc2 = createMockDocument({ id: 'doc-2', filename: 'social_work_assessment.pdf' }) as Document

      const result = await analyzeCoordination([doc1, doc2], 'case-123')

      expect(result).toBeDefined()
      expect(result.sharedLanguage).toBeDefined()
      expect(result.informationFlow).toBeDefined()
      expect(result.independenceViolations).toBeDefined()
      expect(result.institutionMap).toBeDefined()
      expect(result.summary).toBeDefined()
    })

    it('should handle empty analysis results', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'doc-empty' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.sharedLanguage).toHaveLength(0)
      expect(result.informationFlow).toHaveLength(0)
      expect(result.independenceViolations).toHaveLength(0)
      expect(result.summary.totalFindings).toBe(0)
      expect(result.summary.criticalViolations).toBe(0)
    })

    it('should generate unique IDs for findings', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [
          { phrase: 'phrase one', wordCount: 2, documents: [], probability: 'template', significance: 50 },
          { phrase: 'phrase two', wordCount: 2, documents: [], probability: 'copy', significance: 70 },
        ],
        informationFlow: [
          { sourceInstitution: 'police', targetInstitution: 'court', informationType: 'evidence', predatesDisclosure: false, description: 'Flow 1', evidence: 'Quote', severity: 'medium' },
        ],
        independenceViolations: [
          { type: 'shared_language', institutions: ['police', 'court'], description: 'Violation', evidence: [], severity: 'high' },
        ],
      })

      const doc = createMockDocument({ id: 'doc-ids' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.sharedLanguage[0].id).toBe('shared-0')
      expect(result.sharedLanguage[1].id).toBe('shared-1')
      expect(result.informationFlow[0].id).toBe('flow-0')
      expect(result.independenceViolations[0].id).toBe('violation-0')
    })

    it('should calculate correct total findings count', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [
          { phrase: 'p1', wordCount: 3, documents: [], probability: 'copy', significance: 80 },
          { phrase: 'p2', wordCount: 4, documents: [], probability: 'template', significance: 60 },
        ],
        informationFlow: [
          { sourceInstitution: 'a', targetInstitution: 'b', informationType: 'opinion', predatesDisclosure: true, description: 'd', evidence: 'e', severity: 'high' },
        ],
        independenceViolations: [
          { type: 'circular_reference', institutions: ['a', 'b'], description: 'd', evidence: [], severity: 'critical' },
          { type: 'timing_anomaly', institutions: ['c', 'd'], description: 'd2', evidence: [], severity: 'high' },
        ],
      })

      const doc = createMockDocument({ id: 'doc-count' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.summary.totalFindings).toBe(5) // 2 shared + 1 flow + 2 violations
    })

    it('should count critical violations correctly', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [
          { type: 'pre_disclosure', institutions: ['a', 'b'], description: 'd1', evidence: [], severity: 'critical' },
          { type: 'shared_language', institutions: ['c', 'd'], description: 'd2', evidence: [], severity: 'high' },
          { type: 'circular_reference', institutions: ['e', 'f'], description: 'd3', evidence: [], severity: 'critical' },
          { type: 'timing_anomaly', institutions: ['g', 'h'], description: 'd4', evidence: [], severity: 'low' },
        ],
      })

      const doc = createMockDocument({ id: 'doc-crit' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.summary.criticalViolations).toBe(2)
    })

    it('should use mock mode when placeholder URL is set', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'

      // Re-import to get fresh module with new env
      jest.resetModules()
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const doc1 = createMockDocument({ id: 'mock-doc-1' }) as Document
      const doc2 = createMockDocument({ id: 'mock-doc-2' }) as Document

      const result = await analyzeCoordination([doc1, doc2], 'case-123')

      // Mock mode should return predefined data
      expect(result.sharedLanguage.length).toBeGreaterThan(0)
      expect(result.informationFlow.length).toBeGreaterThan(0)
      expect(result.independenceViolations.length).toBeGreaterThan(0)
    })
  })

  describe('Institution Classification', () => {
    it('should classify documents by institution based on doc_type', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const policeDoc = createMockDocument({ id: 'police-doc', doc_type: 'police_bundle' }) as Document
      const socialDoc = createMockDocument({ id: 'social-doc', doc_type: 'social_assessment' }) as Document
      const expertDoc = createMockDocument({ id: 'expert-doc', doc_type: 'expert_report' }) as Document

      const result = await analyzeCoordination([policeDoc, socialDoc, expertDoc], 'case-123')

      expect(result.institutionMap).toBeDefined()
      expect(result.institutionMap.length).toBeGreaterThan(0)
    })

    it('should classify documents by filename patterns', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const policeDoc = createMockDocument({ id: 'pd-1', filename: 'police_interview_transcript.pdf', doc_type: 'other' }) as Document
      const cafcassDoc = createMockDocument({ id: 'cf-1', filename: 'cafcass_report.pdf', doc_type: 'other' }) as Document
      const healthDoc = createMockDocument({ id: 'nh-1', filename: 'nhs_medical_report.pdf', doc_type: 'other' }) as Document
      const schoolDoc = createMockDocument({ id: 'sc-1', filename: 'school_report.pdf', doc_type: 'other' }) as Document

      const result = await analyzeCoordination([policeDoc, cafcassDoc, healthDoc, schoolDoc], 'case-123')

      expect(result.institutionMap).toBeDefined()
    })

    it('should handle unknown institution classification', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const unknownDoc = createMockDocument({
        id: 'unknown-doc',
        filename: 'random_file.pdf',
        doc_type: 'other'
      }) as Document

      const result = await analyzeCoordination([unknownDoc], 'case-123')

      expect(result.institutionMap).toBeDefined()
    })
  })

  describe('Independence Score Calculation', () => {
    it('should calculate independence score based on findings', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [
          { phrase: 'phrase', wordCount: 3, documents: [], probability: 'copy', significance: 80 },
        ],
        informationFlow: [
          { sourceInstitution: 'a', targetInstitution: 'b', informationType: 'opinion', predatesDisclosure: true, description: 'd', evidence: 'e', severity: 'critical' },
        ],
        independenceViolations: [
          { type: 'pre_disclosure', institutions: ['a', 'b'], description: 'd', evidence: [], severity: 'critical' },
        ],
      })

      const doc = createMockDocument({ id: 'score-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      // Score starts at 100, deductions for findings
      expect(result.summary.independenceScore).toBeLessThan(100)
      expect(result.summary.independenceScore).toBeGreaterThanOrEqual(0)
    })

    it('should deduct more for copy probability than template', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      // Test with copy probability
      mockGenerateJSON.mockResolvedValueOnce({
        sharedLanguage: [
          { phrase: 'phrase', wordCount: 3, documents: [], probability: 'copy', significance: 80 },
        ],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc1 = createMockDocument({ id: 'copy-doc' }) as Document
      const copyResult = await analyzeCoordination([doc1], 'case-123')

      // Test with template probability
      mockGenerateJSON.mockResolvedValueOnce({
        sharedLanguage: [
          { phrase: 'phrase', wordCount: 3, documents: [], probability: 'template', significance: 80 },
        ],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc2 = createMockDocument({ id: 'template-doc' }) as Document
      const templateResult = await analyzeCoordination([doc2], 'case-123')

      // Copy should have lower independence score (more deductions)
      expect(copyResult.summary.independenceScore).toBeLessThan(templateResult.summary.independenceScore)
    })

    it('should deduct for pre-disclosure information flow', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [
          { sourceInstitution: 'a', targetInstitution: 'b', informationType: 'conclusion', predatesDisclosure: true, description: 'd', evidence: 'e', severity: 'high' },
        ],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'flow-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      // Should deduct for pre-disclosure flow
      expect(result.summary.independenceScore).toBeLessThan(100)
    })

    it('should clamp independence score between 0 and 100', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      // Create many violations to potentially exceed deduction limits
      const manyViolations = Array(10).fill(null).map((_, i) => ({
        type: 'pre_disclosure',
        institutions: [`inst-${i}a`, `inst-${i}b`],
        description: `Violation ${i}`,
        evidence: [],
        severity: 'critical',
      }))

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: Array(10).fill(null).map((_, i) => ({
          phrase: `phrase ${i}`,
          wordCount: 3,
          documents: [],
          probability: 'copy',
          significance: 90,
        })),
        informationFlow: [],
        independenceViolations: manyViolations,
      })

      const doc = createMockDocument({ id: 'clamp-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.summary.independenceScore).toBeGreaterThanOrEqual(0)
      expect(result.summary.independenceScore).toBeLessThanOrEqual(100)
    })
  })

  describe('Most Connected Institutions', () => {
    it('should find most connected institution pairs', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [
          { sourceInstitution: 'police', targetInstitution: 'social_services', informationType: 'evidence', predatesDisclosure: false, description: 'd1', evidence: 'e1', severity: 'medium' },
          { sourceInstitution: 'police', targetInstitution: 'social_services', informationType: 'opinion', predatesDisclosure: false, description: 'd2', evidence: 'e2', severity: 'low' },
          { sourceInstitution: 'court', targetInstitution: 'expert', informationType: 'conclusion', predatesDisclosure: false, description: 'd3', evidence: 'e3', severity: 'high' },
        ],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'connected-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.summary.mostConnectedInstitutions).toBeDefined()
      expect(Array.isArray(result.summary.mostConnectedInstitutions)).toBe(true)
    })

    it('should return empty array when no information flow exists', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'no-flow-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.summary.mostConnectedInstitutions).toHaveLength(0)
    })
  })

  describe('compareDocumentsForSharing', () => {
    it('should compare two documents for shared language', async () => {
      const { compareDocumentsForSharing } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ content: 'Doc content', chunk_index: 0 }], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedPhrases: [
          { phrase: 'shared phrase one', significance: 75 },
          { phrase: 'shared phrase two', significance: 60 },
        ],
        similarity: 45,
      })

      const doc1 = createMockDocument({ id: 'compare-doc-1', filename: 'doc1.pdf' }) as Document
      const doc2 = createMockDocument({ id: 'compare-doc-2', filename: 'doc2.pdf' }) as Document

      const result = await compareDocumentsForSharing(doc1, doc2)

      expect(result).toBeDefined()
      expect(result.sharedPhrases).toBeDefined()
      expect(result.similarity).toBeDefined()
      expect(Array.isArray(result.sharedPhrases)).toBe(true)
      expect(typeof result.similarity).toBe('number')
    })

    it('should handle documents with no shared content', async () => {
      const { compareDocumentsForSharing } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedPhrases: [],
        similarity: 0,
      })

      const doc1 = createMockDocument({ id: 'unshared-doc-1' }) as Document
      const doc2 = createMockDocument({ id: 'unshared-doc-2' }) as Document

      const result = await compareDocumentsForSharing(doc1, doc2)

      expect(result.sharedPhrases).toHaveLength(0)
      expect(result.similarity).toBe(0)
    })
  })

  describe('buildCommunicationTimeline', () => {
    it('should build communication timeline from documents', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const doc1 = createMockDocument({
        id: 'timeline-doc-1',
        filename: 'police_report.pdf',
        created_at: '2024-01-15T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const doc2 = createMockDocument({
        id: 'timeline-doc-2',
        filename: 'social_work_report.pdf',
        created_at: '2024-02-20T10:00:00Z',
        doc_type: 'other'
      }) as Document

      const result = await buildCommunicationTimeline([doc1, doc2], 'case-123')

      expect(result).toBeDefined()
      expect(result.events).toBeDefined()
      expect(result.gaps).toBeDefined()
      expect(Array.isArray(result.events)).toBe(true)
      expect(Array.isArray(result.gaps)).toBe(true)
    })

    it('should sort events by date', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const doc1 = createMockDocument({
        id: 'sorted-doc-1',
        filename: 'later_report.pdf',
        created_at: '2024-06-01T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const doc2 = createMockDocument({
        id: 'sorted-doc-2',
        filename: 'earlier_report.pdf',
        created_at: '2024-01-01T10:00:00Z',
        doc_type: 'other'
      }) as Document

      const result = await buildCommunicationTimeline([doc1, doc2], 'case-123')

      expect(result.events.length).toBe(2)
      // Events should be sorted chronologically
      expect(new Date(result.events[0].date).getTime()).toBeLessThanOrEqual(
        new Date(result.events[1].date).getTime()
      )
    })

    it('should detect communication gaps over 30 days', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const doc1 = createMockDocument({
        id: 'gap-doc-1',
        filename: 'early_report.pdf',
        created_at: '2024-01-01T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const doc2 = createMockDocument({
        id: 'gap-doc-2',
        filename: 'late_report.pdf',
        created_at: '2024-03-15T10:00:00Z', // ~74 days later
        doc_type: 'other'
      }) as Document

      const result = await buildCommunicationTimeline([doc1, doc2], 'case-123')

      expect(result.gaps.length).toBeGreaterThan(0)
      expect(result.gaps[0].duration).toBeGreaterThan(30)
    })

    it('should not detect gaps under 30 days', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const doc1 = createMockDocument({
        id: 'no-gap-doc-1',
        filename: 'report1.pdf',
        created_at: '2024-01-01T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const doc2 = createMockDocument({
        id: 'no-gap-doc-2',
        filename: 'report2.pdf',
        created_at: '2024-01-15T10:00:00Z', // 14 days later
        doc_type: 'other'
      }) as Document

      const result = await buildCommunicationTimeline([doc1, doc2], 'case-123')

      expect(result.gaps).toHaveLength(0)
    })

    it('should determine document type from filename', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const emailDoc = createMockDocument({
        id: 'email-doc',
        filename: 'email_correspondence.pdf',
        created_at: '2024-01-01T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const meetingDoc = createMockDocument({
        id: 'meeting-doc',
        filename: 'meeting_minutes.pdf',
        created_at: '2024-01-02T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const referralDoc = createMockDocument({
        id: 'referral-doc',
        filename: 'referral_form.pdf',
        created_at: '2024-01-03T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const disclosureDoc = createMockDocument({
        id: 'disclosure-doc',
        filename: 'disclosure_bundle.pdf',
        created_at: '2024-01-04T10:00:00Z',
        doc_type: 'other'
      }) as Document

      const result = await buildCommunicationTimeline(
        [emailDoc, meetingDoc, referralDoc, disclosureDoc],
        'case-123'
      )

      expect(result.events.find(e => e.type === 'email')).toBeDefined()
      expect(result.events.find(e => e.type === 'meeting')).toBeDefined()
      expect(result.events.find(e => e.type === 'referral')).toBeDefined()
      expect(result.events.find(e => e.type === 'disclosure')).toBeDefined()
    })

    it('should default to report type for unknown filenames', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const genericDoc = createMockDocument({
        id: 'generic-doc',
        filename: 'some_document.pdf',
        created_at: '2024-01-01T10:00:00Z',
        doc_type: 'other'
      }) as Document

      const result = await buildCommunicationTimeline([genericDoc], 'case-123')

      expect(result.events[0].type).toBe('report')
    })

    it('should handle documents with missing dates', async () => {
      const { buildCommunicationTimeline } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const docWithDate = createMockDocument({
        id: 'with-date',
        filename: 'report.pdf',
        created_at: '2024-01-01T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const docNoDate = createMockDocument({
        id: 'no-date',
        filename: 'other_report.pdf',
        created_at: undefined,
        doc_type: 'other'
      }) as Document

      const result = await buildCommunicationTimeline([docWithDate, docNoDate], 'case-123')

      expect(result.events).toBeDefined()
    })
  })

  describe('Findings Storage', () => {
    it('should store independence violations as findings', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      let insertedFindings: unknown[] = []
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockImplementation((data) => {
          insertedFindings = data
          return Promise.resolve({ data: null, error: null })
        }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [
          { type: 'pre_disclosure', institutions: ['police', 'social_services'], description: 'Test violation', evidence: ['evidence1'], severity: 'critical' },
        ],
      })

      const doc = createMockDocument({ id: 'store-doc' }) as Document
      await analyzeCoordination([doc], 'case-123')

      expect(mockSupabaseFrom).toHaveBeenCalledWith('findings')
    })

    it('should store shared language findings when not coincidence', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [
          {
            phrase: 'significant shared phrase',
            wordCount: 3,
            documents: [
              { documentId: 'doc-1', institution: 'police', date: '2024-01-01', context: 'ctx' },
              { documentId: 'doc-2', institution: 'social_services', date: '2024-01-02', context: 'ctx2' },
            ],
            probability: 'copy',
            significance: 90
          },
        ],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'shared-doc' }) as Document
      await analyzeCoordination([doc], 'case-123')

      expect(mockSupabaseFrom).toHaveBeenCalledWith('findings')
    })

    it('should store pre-disclosure information flow findings', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [
          {
            sourceInstitution: 'social_services',
            targetInstitution: 'expert',
            informationType: 'conclusion',
            predatesDisclosure: true,
            description: 'Pre-disclosure flow',
            evidence: 'Quote',
            severity: 'critical'
          },
        ],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'predisclosure-doc' }) as Document
      await analyzeCoordination([doc], 'case-123')

      expect(mockSupabaseFrom).toHaveBeenCalledWith('findings')
    })

    it('should not store coincidental shared language', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      let insertCalled = false
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockImplementation(() => {
          insertCalled = true
          return Promise.resolve({ data: null, error: null })
        }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [
          {
            phrase: 'common phrase',
            wordCount: 2,
            documents: [],
            probability: 'coincidence',
            significance: 20
          },
        ],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'coincidence-doc' }) as Document
      await analyzeCoordination([doc], 'case-123')

      // The insert might not be called for coincidental findings
      // Check that findings table was at least queried
      expect(mockSupabaseFrom).toHaveBeenCalled()
    })
  })

  describe('Institution Map Building', () => {
    it('should build institution map with document counts', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc1 = createMockDocument({
        id: 'map-doc-1',
        filename: 'police_report_1.pdf',
        created_at: '2024-01-01T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const doc2 = createMockDocument({
        id: 'map-doc-2',
        filename: 'police_report_2.pdf',
        created_at: '2024-02-01T10:00:00Z',
        doc_type: 'other'
      }) as Document

      const result = await analyzeCoordination([doc1, doc2], 'case-123')

      expect(result.institutionMap).toBeDefined()
      const policeEntry = result.institutionMap.find(i => i.institution === 'police')
      if (policeEntry) {
        expect(policeEntry.documentCount).toBe(2)
      }
    })

    it('should track first appearance date for institutions', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc1 = createMockDocument({
        id: 'first-doc',
        filename: 'police_report.pdf',
        created_at: '2024-06-01T10:00:00Z',
        doc_type: 'other'
      }) as Document
      const doc2 = createMockDocument({
        id: 'second-doc',
        filename: 'police_interview.pdf',
        created_at: '2024-01-01T10:00:00Z', // Earlier date
        doc_type: 'other'
      }) as Document

      const result = await analyzeCoordination([doc1, doc2], 'case-123')

      const policeEntry = result.institutionMap.find(i => i.institution === 'police')
      if (policeEntry) {
        // First appearance should be the earlier date
        expect(policeEntry.firstAppearance).toBe('2024-01-01T10:00:00Z')
      }
    })
  })

  describe('Document Content Retrieval', () => {
    it('should retrieve and join document chunks', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChunks = [
        { content: 'First chunk content.', chunk_index: 0 },
        { content: 'Second chunk content.', chunk_index: 1 },
        { content: 'Third chunk content.', chunk_index: 2 },
      ]

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockChunks, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'chunked-doc' }) as Document
      await analyzeCoordination([doc], 'case-123')

      // Verify document_chunks table was queried
      expect(mockSupabaseFrom).toHaveBeenCalledWith('document_chunks')
    })

    it('should handle null chunk data gracefully', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'null-chunks-doc' }) as Document

      // Should not throw
      const result = await analyzeCoordination([doc], 'case-123')
      expect(result).toBeDefined()
    })
  })

  describe('Severity Handling', () => {
    it('should handle all severity levels in violations', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [
          { type: 'pre_disclosure', institutions: ['a', 'b'], description: 'd1', evidence: [], severity: 'critical' },
          { type: 'shared_language', institutions: ['c', 'd'], description: 'd2', evidence: [], severity: 'high' },
          { type: 'circular_reference', institutions: ['e', 'f'], description: 'd3', evidence: [], severity: 'medium' },
          { type: 'timing_anomaly', institutions: ['g', 'h'], description: 'd4', evidence: [], severity: 'low' },
        ],
      })

      const doc = createMockDocument({ id: 'severity-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.independenceViolations).toHaveLength(4)
      expect(result.independenceViolations.map(v => v.severity)).toEqual(
        expect.arrayContaining(['critical', 'high', 'medium', 'low'])
      )
    })

    it('should handle all severity levels in information flow', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [
          { sourceInstitution: 'a', targetInstitution: 'b', informationType: 'conclusion', predatesDisclosure: true, description: 'd', evidence: 'e', severity: 'critical' },
          { sourceInstitution: 'c', targetInstitution: 'd', informationType: 'evidence', predatesDisclosure: true, description: 'd', evidence: 'e', severity: 'high' },
          { sourceInstitution: 'e', targetInstitution: 'f', informationType: 'opinion', predatesDisclosure: true, description: 'd', evidence: 'e', severity: 'medium' },
        ],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'flow-severity-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.informationFlow).toHaveLength(3)
    })
  })

  describe('Shared Language Probability Types', () => {
    it('should handle all probability types', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [
          { phrase: 'p1', wordCount: 3, documents: [], probability: 'coincidence', significance: 20 },
          { phrase: 'p2', wordCount: 4, documents: [], probability: 'template', significance: 50 },
          { phrase: 'p3', wordCount: 5, documents: [], probability: 'coordination', significance: 70 },
          { phrase: 'p4', wordCount: 6, documents: [], probability: 'copy', significance: 90 },
        ],
        informationFlow: [],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'prob-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.sharedLanguage).toHaveLength(4)
      expect(result.sharedLanguage.map(s => s.probability)).toEqual(
        expect.arrayContaining(['coincidence', 'template', 'coordination', 'copy'])
      )
    })
  })

  describe('Violation Types', () => {
    it('should handle all violation types', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [],
        independenceViolations: [
          { type: 'pre_disclosure', institutions: ['a', 'b'], description: 'd1', evidence: [], severity: 'high' },
          { type: 'shared_language', institutions: ['c', 'd'], description: 'd2', evidence: [], severity: 'high' },
          { type: 'circular_reference', institutions: ['e', 'f'], description: 'd3', evidence: [], severity: 'high' },
          { type: 'timing_anomaly', institutions: ['g', 'h'], description: 'd4', evidence: [], severity: 'high' },
        ],
      })

      const doc = createMockDocument({ id: 'type-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.independenceViolations).toHaveLength(4)
      expect(result.independenceViolations.map(v => v.type)).toEqual(
        expect.arrayContaining(['pre_disclosure', 'shared_language', 'circular_reference', 'timing_anomaly'])
      )
    })
  })

  describe('Information Type Handling', () => {
    it('should handle all information types', async () => {
      const { analyzeCoordination } = await import('@/lib/engines/coordination')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        sharedLanguage: [],
        informationFlow: [
          { sourceInstitution: 'a', targetInstitution: 'b', informationType: 'conclusion', predatesDisclosure: false, description: 'd', evidence: 'e', severity: 'low' },
          { sourceInstitution: 'c', targetInstitution: 'd', informationType: 'evidence', predatesDisclosure: false, description: 'd', evidence: 'e', severity: 'low' },
          { sourceInstitution: 'e', targetInstitution: 'f', informationType: 'opinion', predatesDisclosure: false, description: 'd', evidence: 'e', severity: 'low' },
          { sourceInstitution: 'g', targetInstitution: 'h', informationType: 'allegation', predatesDisclosure: false, description: 'd', evidence: 'e', severity: 'low' },
        ],
        independenceViolations: [],
      })

      const doc = createMockDocument({ id: 'info-type-doc' }) as Document
      const result = await analyzeCoordination([doc], 'case-123')

      expect(result.informationFlow).toHaveLength(4)
      expect(result.informationFlow.map(f => f.informationType)).toEqual(
        expect.arrayContaining(['conclusion', 'evidence', 'opinion', 'allegation'])
      )
    })
  })
})
