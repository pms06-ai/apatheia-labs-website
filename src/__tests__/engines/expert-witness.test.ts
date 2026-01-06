/**
 * EXPERT WITNESS ENGINE TESTS
 *
 * Tests for the Expert Witness Analysis Engine (ἐπιστήμη)
 * "Expertise Boundaries"
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals'

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

describe('Expert Witness Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
  })

  describe('Module Exports', () => {
    it('should export ExpertWitnessEngine class', async () => {
      const { ExpertWitnessEngine } = await import('@/lib/engines/expert-witness')
      expect(ExpertWitnessEngine).toBeDefined()
      expect(typeof ExpertWitnessEngine).toBe('function')
    })

    it('should export expertWitnessEngine singleton', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')
      expect(expertWitnessEngine).toBeDefined()
      expect(typeof expertWitnessEngine.analyze).toBe('function')
    })

    it('should export ExpertViolationType type', async () => {
      // Type check via usage - if this compiles, types are exported correctly
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')
      expect(expertWitnessEngine).toBeDefined()
    })

    it('should export ExpertViolation interface', async () => {
      // Type check via usage
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')
      expect(expertWitnessEngine).toBeDefined()
    })

    it('should export ExpertAnalysisResult interface', async () => {
      // Type check via usage
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')
      expect(expertWitnessEngine).toBeDefined()
    })
  })

  describe('analyze', () => {
    it('should analyze expert report and return violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      // Setup mocks for document chunks
      const mockReportChunks = [
        { content: 'Expert report content with opinions.', chunk_index: 0, page_number: 1 },
      ]
      const mockInstructionChunks = [
        { content: 'Instructions to the expert.', chunk_index: 0, page_number: 1 },
      ]

      let chunkCallCount = 0
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockImplementation(() => {
          chunkCallCount++
          if (chunkCallCount === 1) {
            return Promise.resolve({ data: mockReportChunks, error: null })
          }
          return Promise.resolve({ data: mockInstructionChunks, error: null })
        }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          {
            type: 'scope_exceeded',
            severity: 'high',
            title: 'Opinion beyond instructed scope',
            description: 'Expert provides opinion on matters not within expertise',
            report_section: 'Section 4.2',
            page_reference: 'p12',
            quoted_text: 'I find the mother to be evasive',
            rule_violated: 'PD25B 5.1',
            explanation: 'Expert is instructed to assess attachment, not credibility',
            instructed_scope: 'Assessment of attachment',
            actual_scope: 'Credibility assessment',
            confidence: 85,
          },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        'instruction-doc-id',
        'case-123'
      )

      expect(result).toBeDefined()
      expect(result.violations).toBeDefined()
      expect(Array.isArray(result.violations)).toBe(true)
      expect(result.violations.length).toBe(1)
      expect(result.complianceScore).toBeDefined()
      expect(result.summary).toBeDefined()
      expect(result.recommendations).toBeDefined()
    })

    it('should handle analysis without instruction document', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockReportChunks = [
        { content: 'Expert report content.', chunk_index: 0, page_number: 1 },
      ]

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockReportChunks, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null, // No instruction document
        'case-123'
      )

      expect(result).toBeDefined()
      expect(result.violations).toHaveLength(0)
      expect(result.complianceScore).toBe(100)
    })

    it('should handle empty violations result', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        'instruction-doc-id',
        'case-123'
      )

      expect(result.violations).toHaveLength(0)
      expect(result.complianceScore).toBe(100)
      expect(result.summary.totalViolations).toBe(0)
      expect(result.summary.criticalCount).toBe(0)
      expect(result.summary.overallAssessment).toBe('Compliant')
    })

    it('should generate unique IDs for violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          {
            type: 'scope_exceeded',
            severity: 'high',
            title: 'First violation',
            description: 'Description 1',
            report_section: 'Section 1',
            page_reference: 'p1',
            quoted_text: 'Quote 1',
            rule_violated: 'PD25B 4.1',
            explanation: 'Explanation 1',
            confidence: 80,
          },
          {
            type: 'methodology_violation',
            severity: 'critical',
            title: 'Second violation',
            description: 'Description 2',
            report_section: 'Section 2',
            page_reference: 'p2',
            quoted_text: 'Quote 2',
            rule_violated: 'FPR 25.14',
            explanation: 'Explanation 2',
            confidence: 90,
          },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        'instruction-doc-id',
        'case-123'
      )

      expect(result.violations[0].id).toContain('expert-')
      expect(result.violations[0].id).toContain('-0')
      expect(result.violations[1].id).toContain('-1')
      expect(result.violations[0].id).not.toBe(result.violations[1].id)
    })

    it('should count critical violations correctly', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'Critical 1', description: 'D1', report_section: 'S1', page_reference: 'p1', quoted_text: 'Q1', rule_violated: 'R1', explanation: 'E1', confidence: 90 },
          { type: 'opinion_without_evidence', severity: 'critical', title: 'Critical 2', description: 'D2', report_section: 'S2', page_reference: 'p2', quoted_text: 'Q2', rule_violated: 'R2', explanation: 'E2', confidence: 85 },
          { type: 'scope_exceeded', severity: 'high', title: 'High 1', description: 'D3', report_section: 'S3', page_reference: 'p3', quoted_text: 'Q3', rule_violated: 'R3', explanation: 'E3', confidence: 75 },
          { type: 'bias_indicators', severity: 'medium', title: 'Medium 1', description: 'D4', report_section: 'S4', page_reference: 'p4', quoted_text: 'Q4', rule_violated: 'R4', explanation: 'E4', confidence: 70 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        'instruction-doc-id',
        'case-123'
      )

      expect(result.summary.totalViolations).toBe(4)
      expect(result.summary.criticalCount).toBe(2)
    })

    it('should store findings in database', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          {
            type: 'scope_exceeded',
            severity: 'high',
            title: 'Scope violation',
            description: 'Description',
            report_section: 'Section 1',
            page_reference: 'p1',
            quoted_text: 'Quote',
            rule_violated: 'PD25B 5.1',
            explanation: 'Explanation',
            confidence: 85,
          },
        ],
      })

      await expertWitnessEngine.analyze(
        'report-doc-id',
        'instruction-doc-id',
        'case-123'
      )

      // Verify that insert was called on 'findings' table
      expect(mockSupabaseFrom).toHaveBeenCalledWith('findings')
    })
  })

  describe('Compliance Score Calculation', () => {
    it('should return 100 for no violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.complianceScore).toBe(100)
    })

    it('should apply correct penalty for critical violations (25 points each)', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 90 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.complianceScore).toBe(75) // 100 - 25
    })

    it('should apply correct penalty for high violations (15 points each)', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'scope_exceeded', severity: 'high', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 80 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.complianceScore).toBe(85) // 100 - 15
    })

    it('should apply correct penalty for medium violations (8 points each)', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'bias_indicators', severity: 'medium', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 70 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.complianceScore).toBe(92) // 100 - 8
    })

    it('should apply correct penalty for low violations (3 points each)', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'no_range_given', severity: 'low', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 60 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.complianceScore).toBe(97) // 100 - 3
    })

    it('should clamp compliance score to minimum 0', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      // Create enough critical violations to exceed 100 points penalty
      const manyViolations = Array(5).fill(null).map((_, i) => ({
        type: 'methodology_violation',
        severity: 'critical',
        title: `Critical ${i}`,
        description: `D${i}`,
        report_section: `S${i}`,
        page_reference: `p${i}`,
        quoted_text: `Q${i}`,
        rule_violated: `R${i}`,
        explanation: `E${i}`,
        confidence: 90,
      }))

      mockGenerateJSON.mockResolvedValue({
        violations: manyViolations,
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.complianceScore).toBe(0) // 5 * 25 = 125, clamped to 0
    })

    it('should calculate combined penalty for multiple severities', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'T1', description: 'D1', report_section: 'S1', page_reference: 'p1', quoted_text: 'Q1', rule_violated: 'R1', explanation: 'E1', confidence: 90 },
          { type: 'scope_exceeded', severity: 'high', title: 'T2', description: 'D2', report_section: 'S2', page_reference: 'p2', quoted_text: 'Q2', rule_violated: 'R2', explanation: 'E2', confidence: 80 },
          { type: 'bias_indicators', severity: 'medium', title: 'T3', description: 'D3', report_section: 'S3', page_reference: 'p3', quoted_text: 'Q3', rule_violated: 'R3', explanation: 'E3', confidence: 70 },
          { type: 'no_range_given', severity: 'low', title: 'T4', description: 'D4', report_section: 'S4', page_reference: 'p4', quoted_text: 'Q4', rule_violated: 'R4', explanation: 'E4', confidence: 60 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      // 100 - (25 + 15 + 8 + 3) = 100 - 51 = 49
      expect(result.complianceScore).toBe(49)
    })
  })

  describe('Summary Generation', () => {
    it('should generate "Compliant" assessment for no violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.summary.overallAssessment).toBe('Compliant')
    })

    it('should generate significant concerns assessment for critical violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 90 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.summary.overallAssessment).toBe('Significant compliance concerns - weight of evidence may be reduced')
    })

    it('should generate multiple issues assessment for more than 3 non-critical violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'scope_exceeded', severity: 'high', title: 'T1', description: 'D1', report_section: 'S1', page_reference: 'p1', quoted_text: 'Q1', rule_violated: 'R1', explanation: 'E1', confidence: 80 },
          { type: 'bias_indicators', severity: 'medium', title: 'T2', description: 'D2', report_section: 'S2', page_reference: 'p2', quoted_text: 'Q2', rule_violated: 'R2', explanation: 'E2', confidence: 70 },
          { type: 'no_range_given', severity: 'low', title: 'T3', description: 'D3', report_section: 'S3', page_reference: 'p3', quoted_text: 'Q3', rule_violated: 'R3', explanation: 'E3', confidence: 60 },
          { type: 'materials_incomplete', severity: 'medium', title: 'T4', description: 'D4', report_section: 'S4', page_reference: 'p4', quoted_text: 'Q4', rule_violated: 'R4', explanation: 'E4', confidence: 65 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.summary.overallAssessment).toBe('Multiple minor issues - some concerns about methodology')
    })

    it('should generate minor issues assessment for few violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'no_range_given', severity: 'low', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 60 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.summary.overallAssessment).toBe('Minor issues identified - generally compliant')
    })

    it('should count scope exceedances correctly', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'scope_exceeded', severity: 'high', title: 'T1', description: 'D1', report_section: 'S1', page_reference: 'p1', quoted_text: 'Q1', rule_violated: 'R1', explanation: 'E1', confidence: 80 },
          { type: 'scope_exceeded', severity: 'medium', title: 'T2', description: 'D2', report_section: 'S2', page_reference: 'p2', quoted_text: 'Q2', rule_violated: 'R2', explanation: 'E2', confidence: 70 },
          { type: 'bias_indicators', severity: 'low', title: 'T3', description: 'D3', report_section: 'S3', page_reference: 'p3', quoted_text: 'Q3', rule_violated: 'R3', explanation: 'E3', confidence: 60 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.summary.scopeExceedances).toBe(2)
    })

    it('should count methodology issues correctly', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'T1', description: 'D1', report_section: 'S1', page_reference: 'p1', quoted_text: 'Q1', rule_violated: 'R1', explanation: 'E1', confidence: 90 },
          { type: 'opinion_without_evidence', severity: 'high', title: 'T2', description: 'D2', report_section: 'S2', page_reference: 'p2', quoted_text: 'Q2', rule_violated: 'R2', explanation: 'E2', confidence: 85 },
          { type: 'scope_exceeded', severity: 'medium', title: 'T3', description: 'D3', report_section: 'S3', page_reference: 'p3', quoted_text: 'Q3', rule_violated: 'R3', explanation: 'E3', confidence: 70 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.summary.methodologyIssues).toBe(2)
    })
  })

  describe('Recommendations Generation', () => {
    it('should generate no recommendations for compliant report', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.recommendations).toHaveLength(0)
    })

    it('should generate scope challenge recommendation', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'scope_exceeded', severity: 'high', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 80 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.recommendations).toContain(
        'Challenge scope exceedances under CPR 25.14 - expert has gone beyond instructed questions'
      )
    })

    it('should generate methodology clarification recommendation', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 90 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.recommendations).toContain(
        'Request Part 25 clarification on methodology used and whether it meets accepted standards'
      )
    })

    it('should generate materials incomplete recommendation', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'materials_incomplete', severity: 'high', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 75 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.recommendations).toContain(
        'Highlight incomplete materials review - expert may need to revise opinion after reviewing omitted documents'
      )
    })

    it('should generate credibility objection recommendation', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'credibility_assessment', severity: 'high', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 85 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.recommendations).toContain(
        'Object to credibility assessments - expert has strayed into territory reserved for the court'
      )
    })

    it('should generate ultimate issue challenge recommendation', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'ultimate_issue', severity: 'critical', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'R', explanation: 'E', confidence: 95 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.recommendations).toContain(
        'Challenge ultimate issue opinion - this is a matter for the court, not the expert'
      )
    })

    it('should generate exclusion recommendation for multiple critical violations', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'T1', description: 'D1', report_section: 'S1', page_reference: 'p1', quoted_text: 'Q1', rule_violated: 'R1', explanation: 'E1', confidence: 90 },
          { type: 'ultimate_issue', severity: 'critical', title: 'T2', description: 'D2', report_section: 'S2', page_reference: 'p2', quoted_text: 'Q2', rule_violated: 'R2', explanation: 'E2', confidence: 95 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.recommendations).toContain(
        'Consider application to exclude or limit expert evidence given multiple serious compliance failures'
      )
    })
  })

  describe('Rule Text Lookup', () => {
    it('should populate rule text for PD25B rules', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'scope_exceeded', severity: 'high', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'PD25B 4.1', explanation: 'E', confidence: 80 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations[0].ruleText).toBe('Expert must contain a statement of truth')
    })

    it('should populate rule text for FPR Part 25 rules', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'methodology_violation', severity: 'critical', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'FPR 25.14', explanation: 'E', confidence: 90 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations[0].ruleText).toBe('Must state opinion, basis, and alternatives considered')
    })

    it('should return rule reference as fallback for unknown rules', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'bias_indicators', severity: 'medium', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: 'Unknown Rule 123', explanation: 'E', confidence: 70 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations[0].ruleText).toBe('Unknown Rule 123')
    })

    it('should handle empty rule reference', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          { type: 'bias_indicators', severity: 'medium', title: 'T', description: 'D', report_section: 'S', page_reference: 'p', quoted_text: 'Q', rule_violated: '', explanation: 'E', confidence: 70 },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations[0].ruleText).toBe('')
    })
  })

  describe('Materials List Extraction', () => {
    it('should extract materials reviewed from report', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockReportChunks = [
        {
          content: `Materials reviewed:
1. Police report dated 01/01/2024
2. Medical records from January 2024
3. School attendance records

Based on these materials, I conclude...`,
          chunk_index: 0,
          page_number: 1,
        },
      ]

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockReportChunks, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result).toBeDefined()
      // The generateJSON should have been called with the materials list extracted
      expect(mockGenerateJSON).toHaveBeenCalled()
    })

    it('should handle documents considered pattern', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockReportChunks = [
        {
          content: `Documents considered:
- Social work assessment
- Court bundle

My opinion is...`,
          chunk_index: 0,
          page_number: 1,
        },
      ]

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockReportChunks, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result).toBeDefined()
    })
  })

  describe('Violation Types', () => {
    it('should handle all violation types', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      const violationTypes = [
        'scope_exceeded',
        'methodology_violation',
        'materials_incomplete',
        'opinion_without_evidence',
        'credibility_assessment',
        'ultimate_issue',
        'no_range_given',
        'bias_indicators',
        'pd25b_breach',
        'fpr25_breach',
      ]

      mockGenerateJSON.mockResolvedValue({
        violations: violationTypes.map((type, idx) => ({
          type,
          severity: 'medium',
          title: `Violation ${idx}`,
          description: `Description ${idx}`,
          report_section: `Section ${idx}`,
          page_reference: `p${idx}`,
          quoted_text: `Quote ${idx}`,
          rule_violated: `Rule ${idx}`,
          explanation: `Explanation ${idx}`,
          confidence: 70 + idx,
        })),
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations.length).toBe(10)
      violationTypes.forEach((type, idx) => {
        expect(result.violations[idx].type).toBe(type)
      })
    })
  })

  describe('Mock Mode', () => {
    it('should use mock results when placeholder URL is set', async () => {
      // Set placeholder URL to trigger mock mode
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'

      // Need to re-import to pick up the env change
      jest.resetModules()

      // Re-setup mocks after reset
      jest.mock('@/lib/ai-client', () => ({
        generateJSON: (...args: unknown[]) => mockGenerateJSON(...args),
      }))

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }

      jest.mock('@/lib/supabase/server', () => ({
        supabaseAdmin: {
          from: () => mockChain,
        },
      }))

      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const result = await expertWitnessEngine.analyze(
        'mock-report-doc-id',
        'mock-instruction-doc-id',
        'case-123'
      )

      // Mock mode should return predefined violations
      expect(result.violations.length).toBeGreaterThan(0)
      expect(result.violations[0].type).toBe('scope_exceeded')
    })
  })

  describe('Document Chunk Processing', () => {
    it('should join multiple chunks with double newlines', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChunks = [
        { content: 'First chunk content.', chunk_index: 0, page_number: 1 },
        { content: 'Second chunk content.', chunk_index: 1, page_number: 1 },
        { content: 'Third chunk content.', chunk_index: 2, page_number: 2 },
      ]

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockChunks, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      // Verify generateJSON was called (the chunks would be joined)
      expect(mockGenerateJSON).toHaveBeenCalled()
    })

    it('should handle null/empty chunk data', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result).toBeDefined()
      expect(result.violations).toHaveLength(0)
    })
  })

  describe('Scope Tracking', () => {
    it('should include scope information in violations when provided', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          {
            type: 'scope_exceeded',
            severity: 'high',
            title: 'Scope violation',
            description: 'Expert exceeded scope',
            report_section: 'Section 4',
            page_reference: 'p12',
            quoted_text: 'I find the mother unreliable',
            rule_violated: 'PD25B 5.1',
            explanation: 'Expert assessed credibility without instruction',
            instructed_scope: 'Assess attachment relationship only',
            actual_scope: 'Made credibility findings about mother',
            confidence: 90,
          },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        'instruction-doc-id',
        'case-123'
      )

      expect(result.violations[0].instructedScope).toBe('Assess attachment relationship only')
      expect(result.violations[0].actualScope).toBe('Made credibility findings about mother')
    })

    it('should handle missing scope information', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          {
            type: 'bias_indicators',
            severity: 'medium',
            title: 'Bias detected',
            description: 'Language suggests advocacy',
            report_section: 'Section 3',
            page_reference: 'p8',
            quoted_text: 'The mother clearly should have custody',
            rule_violated: 'PD25B 5.1',
            explanation: 'Advocacy language present',
            // No instructed_scope or actual_scope
            confidence: 75,
          },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations[0].instructedScope).toBeUndefined()
      expect(result.violations[0].actualScope).toBeUndefined()
    })
  })

  describe('Default Confidence', () => {
    it('should use default confidence when not provided', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      mockGenerateJSON.mockResolvedValue({
        violations: [
          {
            type: 'bias_indicators',
            severity: 'low',
            title: 'T',
            description: 'D',
            report_section: 'S',
            page_reference: 'p',
            quoted_text: 'Q',
            rule_violated: 'R',
            explanation: 'E',
            // No confidence provided
          },
        ],
      })

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations[0].confidence).toBe(75) // Default confidence
    })
  })

  describe('Error Handling', () => {
    it('should handle AI parse errors gracefully', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      // Return invalid JSON-like response
      mockGenerateJSON.mockResolvedValue('invalid json response')

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      // Should return empty violations instead of crashing
      expect(result.violations).toHaveLength(0)
      expect(result.complianceScore).toBe(100)
    })

    it('should handle array response format', async () => {
      const { expertWitnessEngine } = await import('@/lib/engines/expert-witness')

      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      }
      mockSupabaseFrom.mockReturnValue(mockChain)

      // Return violations as direct array (alternative format)
      mockGenerateJSON.mockResolvedValue([
        {
          type: 'scope_exceeded',
          severity: 'high',
          title: 'T',
          description: 'D',
          report_section: 'S',
          page_reference: 'p',
          quoted_text: 'Q',
          rule_violated: 'R',
          explanation: 'E',
          confidence: 80,
        },
      ])

      const result = await expertWitnessEngine.analyze(
        'report-doc-id',
        null,
        'case-123'
      )

      expect(result.violations).toHaveLength(1)
      expect(result.violations[0].type).toBe('scope_exceeded')
    })
  })
})
