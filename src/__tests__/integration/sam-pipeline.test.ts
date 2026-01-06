/**
 * S.A.M. PIPELINE INTEGRATION TESTS
 *
 * End-to-end tests for the Source Analysis Module (S.A.M.) pipeline.
 * Tests the runEngine() and runEngines() orchestration functions.
 *
 * These tests verify:
 * - Each engine can be invoked through the unified interface
 * - Multiple engines can run in parallel without interference
 * - Error handling and partial results work correctly
 * - Document flow through the complete pipeline
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { createMockDocument, createMockCase } from '../setup'
import type { Document } from '@/CONTRACT'

// ============================================
// MOCK SETUP
// ============================================

const mockGenerateJSON = jest.fn()
const mockSupabaseFrom = jest.fn()

// Mock chain for Supabase query builder
const createMockChain = (resolvedData: unknown = []) => ({
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
  then: jest.fn((resolve) => resolve({ data: resolvedData, error: null })),
})

// Mock AI client
jest.mock('@/lib/ai-client', () => ({
  generateJSON: (...args: unknown[]) => mockGenerateJSON(...args),
  analyze: jest.fn().mockResolvedValue({ result: {}, model: 'mock', usage: {} }),
  compareDocuments: jest.fn().mockResolvedValue('{}'),
}))

// Mock Supabase
jest.mock('@/lib/supabase/server', () => {
  const defaultMockChain = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    then: jest.fn((resolve) => resolve({ data: [], error: null })),
  }

  return {
    supabaseAdmin: {
      from: (...args: unknown[]) => {
        mockSupabaseFrom(...args)
        return defaultMockChain
      },
    },
    createAdminClient: jest.fn(),
    createServerSupabaseClient: jest.fn(),
    createServerClient: jest.fn(),
  }
})

// ============================================
// TEST SUITES
// ============================================

describe('S.A.M. Pipeline Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment for mock mode
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
  })

  describe('Module Exports', () => {
    it('should export runEngine function', async () => {
      const { runEngine } = await import('@/lib/engines')
      expect(typeof runEngine).toBe('function')
    })

    it('should export runEngines function', async () => {
      const { runEngines } = await import('@/lib/engines')
      expect(typeof runEngines).toBe('function')
    })

    it('should export EngineRunParams and EngineRunResult types', async () => {
      // Type exports are verified by successful import and usage
      const engines = await import('@/lib/engines')
      expect(engines.runEngine).toBeDefined()
      expect(engines.runEngines).toBeDefined()
    })

    it('should export ENGINE_REGISTRY', async () => {
      const { ENGINE_REGISTRY } = await import('@/lib/engines')
      expect(ENGINE_REGISTRY).toBeDefined()
      expect(Object.keys(ENGINE_REGISTRY)).toContain('omission')
      expect(Object.keys(ENGINE_REGISTRY)).toContain('contradiction')
      expect(Object.keys(ENGINE_REGISTRY)).toContain('narrative')
      expect(Object.keys(ENGINE_REGISTRY)).toContain('coordination')
      expect(Object.keys(ENGINE_REGISTRY)).toContain('expert_witness')
    })
  })

  describe('runEngine()', () => {
    describe('Contradiction Engine', () => {
      it('should run contradiction engine successfully', async () => {
        const { runEngine } = await import('@/lib/engines')

        const mockDocs = [
          createMockDocument({ id: 'doc-1', extracted_text: 'Statement A' }),
          createMockDocument({ id: 'doc-2', extracted_text: 'Statement B' }),
        ]

        // Mock fetchDocs to return documents
        const mockDocsChain = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
        }

        // Mock document_chunks query
        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [{ content: 'Chunk content', chunk_index: 0 }], error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockImplementation((table) => {
          if (table === 'documents') return mockDocsChain
          if (table === 'document_chunks') return mockChunksChain
          if (table === 'findings') return mockChunksChain
          return mockChunksChain
        })

        mockGenerateJSON.mockResolvedValue({
          contradictions: [{
            type: 'direct',
            severity: 'high',
            claim1: { documentId: 'doc-1', text: 'Claim A' },
            claim2: { documentId: 'doc-2', text: 'Claim B' },
            explanation: 'Test contradiction',
            implication: 'Test implication',
          }],
          claimClusters: [],
        })

        const result = await runEngine({
          engineId: 'contradiction',
          caseId: 'case-123',
          documentIds: ['doc-1', 'doc-2'],
        })

        expect(result.engineId).toBe('contradiction')
        expect(result.success).toBe(true)
        expect(result.duration).toBeGreaterThanOrEqual(0)
        expect(result.result).toBeDefined()
      })
    })

    describe('Narrative Engine', () => {
      it('should run narrative engine successfully', async () => {
        const { runEngine } = await import('@/lib/engines')

        const mockDocs = [
          createMockDocument({ id: 'doc-1', created_at: '2024-01-01T00:00:00Z' }),
          createMockDocument({ id: 'doc-2', created_at: '2024-02-01T00:00:00Z' }),
        ]

        const mockDocsChain = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
        }

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [{ content: 'Chunk content', chunk_index: 0 }], error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockImplementation((table) => {
          if (table === 'documents') return mockDocsChain
          return mockChunksChain
        })

        mockGenerateJSON.mockResolvedValue({
          claims: [{
            claim: 'Test claim',
            firstMention: { docId: 'doc-1', date: '2024-01-01', text: 'Initial claim' },
            mutations: [],
            driftScore: 0,
          }],
          circularCitations: [],
        })

        const result = await runEngine({
          engineId: 'narrative',
          caseId: 'case-123',
          documentIds: ['doc-1', 'doc-2'],
        })

        expect(result.engineId).toBe('narrative')
        expect(result.success).toBe(true)
        expect(result.result).toBeDefined()
      })
    })

    describe('Coordination Engine', () => {
      it('should run coordination engine successfully', async () => {
        const { runEngine } = await import('@/lib/engines')

        const mockDocs = [
          createMockDocument({ id: 'doc-1', doc_type: 'social_work_assessment' }),
          createMockDocument({ id: 'doc-2', doc_type: 'expert_report' }),
        ]

        const mockDocsChain = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
        }

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [{ content: 'Chunk content', chunk_index: 0 }], error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockImplementation((table) => {
          if (table === 'documents') return mockDocsChain
          return mockChunksChain
        })

        mockGenerateJSON.mockResolvedValue({
          sharedFindings: [],
          communicationPatterns: [],
          independenceScore: 85,
        })

        const result = await runEngine({
          engineId: 'coordination',
          caseId: 'case-123',
          documentIds: ['doc-1', 'doc-2'],
        })

        expect(result.engineId).toBe('coordination')
        expect(result.success).toBe(true)
        expect(result.result).toBeDefined()
      })
    })

    describe('Expert Witness Engine', () => {
      it('should run expert witness engine successfully', async () => {
        const { runEngine } = await import('@/lib/engines')

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [{
              content: 'EXPERT REPORT\nPrepared by Dr. Jones\nMethodology: Clinical interview',
              chunk_index: 0
            }],
            error: null
          }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockReturnValue(mockChunksChain)

        mockGenerateJSON.mockResolvedValue({
          violations: [{
            type: 'methodology_gap',
            description: 'No standardized tests used',
            severity: 'medium',
            quote: 'Based on clinical observation',
            ruleRef: 'FPR 25.3',
          }],
          compliance: {
            overallScore: 70,
            ruleBreakdown: { 'PD25B': 75, 'FPR Part 25': 65 },
          },
          expertProfile: {
            name: 'Dr. Jones',
            credentials: 'PhD Psychology',
            instructionSource: null,
          },
        })

        const result = await runEngine({
          engineId: 'expert_witness',
          caseId: 'case-123',
          documentIds: ['doc-expert-001'],
        })

        expect(result.engineId).toBe('expert_witness')
        expect(result.success).toBe(true)
        expect(result.result).toBeDefined()
      })

      it('should handle expert witness with instruction document', async () => {
        const { runEngine } = await import('@/lib/engines')

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [{ content: 'Expert report content', chunk_index: 0 }],
            error: null
          }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockReturnValue(mockChunksChain)

        mockGenerateJSON.mockResolvedValue({
          violations: [],
          compliance: { overallScore: 90, ruleBreakdown: {} },
          expertProfile: { name: 'Dr. Smith' },
        })

        const result = await runEngine({
          engineId: 'expert_witness',
          caseId: 'case-123',
          documentIds: ['doc-report', 'doc-instructions'],
        })

        expect(result.success).toBe(true)
      })
    })

    describe('Omission Engine', () => {
      it('should run omission engine successfully with valid documents', async () => {
        const { runEngine } = await import('@/lib/engines')

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [{
              content: 'Source document with detailed facts about the case.',
              chunk_index: 0
            }],
            error: null
          }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockReturnValue(mockChunksChain)

        mockGenerateJSON.mockResolvedValue({
          omissions: [{
            type: 'complete_omission',
            severity: 'high',
            sourceContent: 'Father attended all sessions',
            reportContent: 'Father had contact',
            omittedContent: 'attended all sessions',
            biasDirection: 'pro_respondent',
            significance: 80,
            explanation: 'Minimized attendance record',
          }],
          systematicPattern: false,
          overallBiasDirection: 'neutral',
        })

        const result = await runEngine({
          engineId: 'omission',
          caseId: 'case-123',
          documentIds: ['doc-source', 'doc-target'],
        })

        expect(result.engineId).toBe('omission')
        expect(result.success).toBe(true)
        expect(result.result).toBeDefined()
      })

      it('should fail omission engine with insufficient documents', async () => {
        const { runEngine } = await import('@/lib/engines')

        const result = await runEngine({
          engineId: 'omission',
          caseId: 'case-123',
          documentIds: ['doc-source'], // Only 1 document
        })

        expect(result.engineId).toBe('omission')
        expect(result.success).toBe(false)
        expect(result.error).toContain('at least 2 documents')
      })
    })

    describe('Error Handling', () => {
      it('should handle unknown engine gracefully', async () => {
        const { runEngine } = await import('@/lib/engines')

        const result = await runEngine({
          engineId: 'unknown_engine' as any,
          caseId: 'case-123',
          documentIds: ['doc-1'],
        })

        expect(result.success).toBe(false)
        expect(result.error).toContain('Unknown engine')
      })

      it('should handle AI service errors gracefully', async () => {
        const { runEngine } = await import('@/lib/engines')

        const mockDocs = [
          createMockDocument({ id: 'doc-1' }),
          createMockDocument({ id: 'doc-2' }),
        ]

        const mockDocsChain = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
        }

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [{ content: 'Content', chunk_index: 0 }], error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockImplementation((table) => {
          if (table === 'documents') return mockDocsChain
          return mockChunksChain
        })

        mockGenerateJSON.mockRejectedValue(new Error('AI service unavailable'))

        const result = await runEngine({
          engineId: 'contradiction',
          caseId: 'case-123',
          documentIds: ['doc-1', 'doc-2'],
        })

        expect(result.success).toBe(false)
        expect(result.error).toBeDefined()
      })

      it('should capture duration even on failure', async () => {
        const { runEngine } = await import('@/lib/engines')

        const result = await runEngine({
          engineId: 'omission',
          caseId: 'case-123',
          documentIds: ['single-doc'], // Invalid for omission
        })

        expect(result.success).toBe(false)
        expect(result.duration).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('runEngines()', () => {
    describe('Parallel Execution', () => {
      it('should run multiple engines in parallel', async () => {
        const { runEngines } = await import('@/lib/engines')

        const mockDocs = [
          createMockDocument({ id: 'doc-1' }),
          createMockDocument({ id: 'doc-2' }),
        ]

        const mockDocsChain = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
        }

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [{ content: 'Content', chunk_index: 0 }], error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockImplementation((table) => {
          if (table === 'documents') return mockDocsChain
          return mockChunksChain
        })

        // Different mock responses for different engines
        mockGenerateJSON.mockResolvedValue({
          contradictions: [],
          claimClusters: [],
          claims: [],
          circularCitations: [],
          sharedFindings: [],
          communicationPatterns: [],
          independenceScore: 90,
        })

        const results = await runEngines([
          { engineId: 'contradiction', caseId: 'case-123', documentIds: ['doc-1', 'doc-2'] },
          { engineId: 'narrative', caseId: 'case-123', documentIds: ['doc-1', 'doc-2'] },
          { engineId: 'coordination', caseId: 'case-123', documentIds: ['doc-1', 'doc-2'] },
        ])

        expect(results).toHaveLength(3)
        expect(results.map(r => r.engineId)).toEqual(['contradiction', 'narrative', 'coordination'])
        results.forEach(result => {
          expect(result.success).toBe(true)
          expect(result.duration).toBeGreaterThanOrEqual(0)
        })
      })

      it('should handle mixed success and failure results', async () => {
        const { runEngines } = await import('@/lib/engines')

        const mockDocs = [
          createMockDocument({ id: 'doc-1' }),
          createMockDocument({ id: 'doc-2' }),
        ]

        const mockDocsChain = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
        }

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: [{ content: 'Content', chunk_index: 0 }], error: null }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockImplementation((table) => {
          if (table === 'documents') return mockDocsChain
          return mockChunksChain
        })

        mockGenerateJSON.mockResolvedValue({
          contradictions: [],
          claimClusters: [],
        })

        const results = await runEngines([
          { engineId: 'contradiction', caseId: 'case-123', documentIds: ['doc-1', 'doc-2'] },
          { engineId: 'omission', caseId: 'case-123', documentIds: ['single-doc'] }, // Will fail
        ])

        expect(results).toHaveLength(2)
        expect(results[0].success).toBe(true) // contradiction succeeds
        expect(results[1].success).toBe(false) // omission fails
        expect(results[1].error).toContain('at least 2 documents')
      })

      it('should return empty array for empty input', async () => {
        const { runEngines } = await import('@/lib/engines')

        const results = await runEngines([])

        expect(results).toEqual([])
      })
    })

    describe('Same Documents Multiple Engines', () => {
      it('should analyze same documents with different engines without interference', async () => {
        const { runEngines } = await import('@/lib/engines')

        const sharedDocs = [
          createMockDocument({
            id: 'shared-doc-1',
            filename: 'witness-statement.pdf',
            extracted_text: 'Subject was present at the location.',
            created_at: '2024-01-15T10:00:00Z',
          }),
          createMockDocument({
            id: 'shared-doc-2',
            filename: 'police-report.pdf',
            extracted_text: 'Investigation found no evidence.',
            created_at: '2024-01-20T10:00:00Z',
          }),
        ]

        const mockDocsChain = {
          select: jest.fn().mockReturnThis(),
          in: jest.fn().mockReturnThis(),
          then: jest.fn((resolve) => resolve({ data: sharedDocs, error: null })),
        }

        const mockChunksChain = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({
            data: [{ content: 'Shared document content for testing.', chunk_index: 0 }],
            error: null
          }),
          insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        }

        mockSupabaseFrom.mockImplementation((table) => {
          if (table === 'documents') return mockDocsChain
          return mockChunksChain
        })

        // Mock returns different results based on call order
        mockGenerateJSON
          .mockResolvedValueOnce({ // contradiction
            contradictions: [{ type: 'direct', severity: 'medium', claim1: { documentId: 'shared-doc-1', text: 'A' }, claim2: { documentId: 'shared-doc-2', text: 'B' }, explanation: 'Test', implication: 'Test' }],
            claimClusters: [],
          })
          .mockResolvedValueOnce({ // narrative
            claims: [{ claim: 'Test claim', firstMention: {}, mutations: [], driftScore: 0 }],
            circularCitations: [],
          })
          .mockResolvedValueOnce({ // coordination
            sharedFindings: [],
            communicationPatterns: [],
            independenceScore: 80,
          })

        const results = await runEngines([
          { engineId: 'contradiction', caseId: 'case-123', documentIds: ['shared-doc-1', 'shared-doc-2'] },
          { engineId: 'narrative', caseId: 'case-123', documentIds: ['shared-doc-1', 'shared-doc-2'] },
          { engineId: 'coordination', caseId: 'case-123', documentIds: ['shared-doc-1', 'shared-doc-2'] },
        ])

        // All engines should succeed with their own results
        expect(results).toHaveLength(3)
        expect(results.every(r => r.success)).toBe(true)

        // Each engine should have its specific result type
        const contradictionResult = results.find(r => r.engineId === 'contradiction')
        const narrativeResult = results.find(r => r.engineId === 'narrative')
        const coordinationResult = results.find(r => r.engineId === 'coordination')

        expect(contradictionResult?.result).toBeDefined()
        expect(narrativeResult?.result).toBeDefined()
        expect(coordinationResult?.result).toBeDefined()
      })
    })
  })

  describe('Document Flow', () => {
    it('should pass documents through fetchDocs for non-omission engines', async () => {
      const { runEngine } = await import('@/lib/engines')

      const mockDocs = [
        createMockDocument({ id: 'fetched-doc-1' }),
        createMockDocument({ id: 'fetched-doc-2' }),
      ]

      const mockDocsChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
      }

      const mockChunksChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ content: 'Content', chunk_index: 0 }], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'documents') return mockDocsChain
        return mockChunksChain
      })

      mockGenerateJSON.mockResolvedValue({
        contradictions: [],
        claimClusters: [],
      })

      await runEngine({
        engineId: 'contradiction',
        caseId: 'case-123',
        documentIds: ['fetched-doc-1', 'fetched-doc-2'],
      })

      // Verify documents were fetched
      expect(mockSupabaseFrom).toHaveBeenCalledWith('documents')
    })

    it('should handle empty document results gracefully', async () => {
      const { runEngine } = await import('@/lib/engines')

      const mockDocsChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: [], error: null })),
      }

      const mockChunksChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'documents') return mockDocsChain
        return mockChunksChain
      })

      mockGenerateJSON.mockResolvedValue({
        contradictions: [],
        claimClusters: [],
      })

      const result = await runEngine({
        engineId: 'contradiction',
        caseId: 'case-123',
        documentIds: ['non-existent-doc'],
      })

      // Should complete without error
      expect(result.success).toBe(true)
    })
  })

  describe('Result Structure', () => {
    it('should return consistent result structure for all engines', async () => {
      const { runEngine } = await import('@/lib/engines')

      const mockDocs = [createMockDocument({ id: 'doc-1' }), createMockDocument({ id: 'doc-2' })]

      const mockDocsChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
      }

      const mockChunksChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ content: 'Content', chunk_index: 0 }], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'documents') return mockDocsChain
        return mockChunksChain
      })

      mockGenerateJSON.mockResolvedValue({
        contradictions: [],
        claimClusters: [],
      })

      const result = await runEngine({
        engineId: 'contradiction',
        caseId: 'case-123',
        documentIds: ['doc-1', 'doc-2'],
      })

      // Verify EngineRunResult structure
      expect(result).toHaveProperty('engineId')
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('duration')
      expect(typeof result.engineId).toBe('string')
      expect(typeof result.success).toBe('boolean')
      expect(typeof result.duration).toBe('number')

      if (result.success) {
        expect(result).toHaveProperty('result')
        expect(result.error).toBeUndefined()
      }
    })

    it('should return error structure on failure', async () => {
      const { runEngine } = await import('@/lib/engines')

      const result = await runEngine({
        engineId: 'omission',
        caseId: 'case-123',
        documentIds: ['single-doc'],
      })

      expect(result.success).toBe(false)
      expect(result).toHaveProperty('error')
      expect(typeof result.error).toBe('string')
      expect(result.result).toBeUndefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large document sets', async () => {
      const { runEngine } = await import('@/lib/engines')

      // Create 50 mock documents
      const largeDocs = Array.from({ length: 50 }, (_, i) =>
        createMockDocument({ id: `doc-${i}` })
      )

      const mockDocsChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: largeDocs, error: null })),
      }

      const mockChunksChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ content: 'Large content batch', chunk_index: 0 }], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'documents') return mockDocsChain
        return mockChunksChain
      })

      mockGenerateJSON.mockResolvedValue({
        contradictions: [],
        claimClusters: [],
      })

      const result = await runEngine({
        engineId: 'contradiction',
        caseId: 'case-123',
        documentIds: largeDocs.map(d => d.id),
      })

      expect(result.success).toBe(true)
    })

    it('should handle concurrent calls to same engine', async () => {
      const { runEngines } = await import('@/lib/engines')

      const mockDocs = [
        createMockDocument({ id: 'doc-1' }),
        createMockDocument({ id: 'doc-2' }),
      ]

      const mockDocsChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
      }

      const mockChunksChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ content: 'Content', chunk_index: 0 }], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'documents') return mockDocsChain
        return mockChunksChain
      })

      mockGenerateJSON.mockResolvedValue({
        contradictions: [],
        claimClusters: [],
      })

      // Run same engine type for different cases concurrently
      const results = await runEngines([
        { engineId: 'contradiction', caseId: 'case-1', documentIds: ['doc-1', 'doc-2'] },
        { engineId: 'contradiction', caseId: 'case-2', documentIds: ['doc-1', 'doc-2'] },
        { engineId: 'contradiction', caseId: 'case-3', documentIds: ['doc-1', 'doc-2'] },
      ])

      expect(results).toHaveLength(3)
      expect(results.every(r => r.engineId === 'contradiction')).toBe(true)
      expect(results.every(r => r.success === true)).toBe(true)
    })

    it('should handle database errors gracefully', async () => {
      const { runEngine } = await import('@/lib/engines')

      const mockErrorChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: null, error: { message: 'Database error' } })),
      }

      mockSupabaseFrom.mockReturnValue(mockErrorChain)

      const result = await runEngine({
        engineId: 'contradiction',
        caseId: 'case-123',
        documentIds: ['doc-1', 'doc-2'],
      })

      // Should handle the error without crashing
      expect(result.engineId).toBe('contradiction')
      // May succeed with empty docs or fail gracefully
      expect(result.duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Mock Mode', () => {
    it('should use mock results when placeholder URL is set', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'

      // Reset modules to pick up env change
      jest.resetModules()

      // Re-setup mocks
      jest.mock('@/lib/ai-client', () => ({
        generateJSON: (...args: unknown[]) => mockGenerateJSON(...args),
        analyze: jest.fn().mockResolvedValue({ result: {}, model: 'mock', usage: {} }),
        compareDocuments: jest.fn().mockResolvedValue('{}'),
      }))

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: [], error: null })),
      }

      jest.mock('@/lib/supabase/server', () => ({
        supabaseAdmin: { from: () => mockChain },
      }))

      const { runEngine } = await import('@/lib/engines')

      // Create mock docs for mock mode
      const result = await runEngine({
        engineId: 'contradiction',
        caseId: 'mock-case',
        documentIds: ['mock-doc-1', 'mock-doc-2', 'mock-doc-3'],
      })

      // Mock mode should produce results
      expect(result.engineId).toBe('contradiction')
    })
  })
})

describe('Engine Orchestration Patterns', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
  })

  describe('Full Pipeline Simulation', () => {
    it('should simulate complete document analysis pipeline', async () => {
      const { runEngines } = await import('@/lib/engines')

      // Simulate a realistic case with multiple documents
      const caseDocuments = [
        createMockDocument({
          id: 'doc-witness-1',
          doc_type: 'witness_statement',
          filename: 'witness-statement-smith.pdf',
          extracted_text: 'I observed the subject at the location at 9 PM.',
          created_at: '2024-01-15T10:00:00Z',
        }),
        createMockDocument({
          id: 'doc-police-1',
          doc_type: 'police_bundle',
          filename: 'police-investigation-report.pdf',
          extracted_text: 'Investigation concluded with NFA. No evidence found.',
          created_at: '2024-01-20T14:00:00Z',
        }),
        createMockDocument({
          id: 'doc-sw-1',
          doc_type: 'social_work_assessment',
          filename: 'social-work-assessment.pdf',
          extracted_text: 'Assessment conducted. Concerns noted regarding...',
          created_at: '2024-01-25T09:00:00Z',
        }),
        createMockDocument({
          id: 'doc-expert-1',
          doc_type: 'expert_report',
          filename: 'expert-psychological-report.pdf',
          extracted_text: 'Expert opinion based on clinical assessment...',
          created_at: '2024-02-01T11:00:00Z',
        }),
      ]

      const mockDocsChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: caseDocuments, error: null })),
      }

      const mockChunksChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: [{ content: 'Document chunk content for analysis', chunk_index: 0 }],
          error: null,
        }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'documents') return mockDocsChain
        return mockChunksChain
      })

      // Mock different responses for each engine
      mockGenerateJSON
        .mockResolvedValueOnce({ // contradiction
          contradictions: [{
            type: 'temporal',
            severity: 'high',
            claim1: { documentId: 'doc-witness-1', text: 'At location at 9 PM' },
            claim2: { documentId: 'doc-police-1', text: 'No evidence found' },
            explanation: 'Witness account conflicts with investigation findings',
            implication: 'Credibility concern',
          }],
          claimClusters: [
            { topic: 'Subject Location', claims: [], consensus: false },
          ],
        })
        .mockResolvedValueOnce({ // narrative
          claims: [{
            claim: 'Subject behavior assessment',
            firstMention: { docId: 'doc-witness-1' },
            mutations: [{ docId: 'doc-sw-1', type: 'amplification' }],
            driftScore: 45,
          }],
          circularCitations: [],
        })
        .mockResolvedValueOnce({ // coordination
          sharedFindings: [{
            phrase: 'concerns noted',
            documents: ['doc-sw-1', 'doc-expert-1'],
            probability: 'unlikely_independent',
          }],
          communicationPatterns: [],
          independenceScore: 65,
        })

      const caseId = 'full-pipeline-case-001'
      const documentIds = caseDocuments.map(d => d.id)

      // Run all S.A.M. engines that work with multiple documents
      const results = await runEngines([
        { engineId: 'contradiction', caseId, documentIds },
        { engineId: 'narrative', caseId, documentIds },
        { engineId: 'coordination', caseId, documentIds },
      ])

      // Verify all engines completed
      expect(results).toHaveLength(3)
      expect(results.every(r => r.success)).toBe(true)

      // Verify each engine produced expected result types
      const contradictionResult = results.find(r => r.engineId === 'contradiction')
      const narrativeResult = results.find(r => r.engineId === 'narrative')
      const coordinationResult = results.find(r => r.engineId === 'coordination')

      expect(contradictionResult?.result).toBeDefined()
      expect(narrativeResult?.result).toBeDefined()
      expect(coordinationResult?.result).toBeDefined()

      // Verify timing metrics
      results.forEach(result => {
        expect(result.duration).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Error Recovery', () => {
    it('should allow partial success when some engines fail', async () => {
      const { runEngines } = await import('@/lib/engines')

      const mockDocs = [
        createMockDocument({ id: 'doc-1' }),
        createMockDocument({ id: 'doc-2' }),
      ]

      const mockDocsChain = {
        select: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: mockDocs, error: null })),
      }

      const mockChunksChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [{ content: 'Content', chunk_index: 0 }], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      mockSupabaseFrom.mockImplementation((table) => {
        if (table === 'documents') return mockDocsChain
        return mockChunksChain
      })

      // First engine succeeds, second fails
      mockGenerateJSON
        .mockResolvedValueOnce({ contradictions: [], claimClusters: [] })
        .mockRejectedValueOnce(new Error('Narrative engine failed'))

      const results = await runEngines([
        { engineId: 'contradiction', caseId: 'case-123', documentIds: ['doc-1', 'doc-2'] },
        { engineId: 'narrative', caseId: 'case-123', documentIds: ['doc-1', 'doc-2'] },
      ])

      expect(results).toHaveLength(2)
      expect(results[0].success).toBe(true)
      expect(results[1].success).toBe(false)

      // Verify successful result has data
      expect(results[0].result).toBeDefined()

      // Verify failed result has error
      expect(results[1].error).toBeDefined()
    })
  })
})
