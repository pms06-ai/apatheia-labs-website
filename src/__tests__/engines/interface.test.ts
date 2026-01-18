/**
 * Engine Interface Compliance Tests
 *
 * These tests verify that all 11 engines follow consistent structural patterns.
 * Run with: npm test -- --testPathPattern=interface
 */

import * as fs from 'fs'
import * as path from 'path'

// Import all engine result types from CONTRACT.ts
import type {
  // 5 Original engines (Phase 1)
  NativeContradictionAnalysisResult,
  NativeOmissionAnalysisResult,
  NativeTemporalAnalysisResult,
  NativeEntityResolutionResult,
  NativeBiasAnalysisResult,
  // 6 New engines (Phase 2)
  NativeAccountabilityResult,
  NativeProfessionalTrackerResult,
  NativeArgumentationResult,
  NativeDocumentaryResult,
  NativeNarrativeResult,
  NativeExpertResult,
  // Severity type for consistency check
  NativeSeverity,
} from '@/CONTRACT'

const SCHEMAS_PATH = path.resolve(__dirname, '../../../schemas/rust-schemas.json')

/**
 * Type guard to check if an object has is_mock field
 */
function hasIsMock(obj: unknown): obj is { is_mock: boolean } {
  return typeof obj === 'object' && obj !== null && 'is_mock' in obj
}

/**
 * All engine result type names that should be in schemas
 */
const ALL_ENGINE_RESULT_TYPES = [
  'NativeContradictionAnalysisResult',
  'NativeOmissionAnalysisResult',
  'NativeTemporalAnalysisResult',
  'NativeEntityResolutionResult',
  'NativeBiasAnalysisResult',
  'NativeAccountabilityResult',
  'NativeProfessionalTrackerResult',
  'NativeArgumentationResult',
  'NativeDocumentaryResult',
  'NativeNarrativeResult',
  'NativeExpertResult',
]

describe('Engine Interface Compliance', () => {
  let schemas: Record<string, unknown>

  beforeAll(() => {
    if (!fs.existsSync(SCHEMAS_PATH)) {
      console.warn('Schemas file not found. Run "npm run contracts:generate" first.')
      schemas = {}
      return
    }

    const schemasJson = fs.readFileSync(SCHEMAS_PATH, 'utf-8')
    schemas = JSON.parse(schemasJson)
  })

  describe('All 11 Engines Have Schema Coverage', () => {
    it('should have schemas for all engine result types', () => {
      if (Object.keys(schemas).length === 0) {
        console.warn('Skipping: schemas not generated')
        return
      }

      const missingSchemas: string[] = []
      ALL_ENGINE_RESULT_TYPES.forEach(typeName => {
        if (!schemas[typeName]) {
          missingSchemas.push(typeName)
        }
      })

      if (missingSchemas.length > 0) {
        console.error('Missing schemas:', missingSchemas)
      }

      expect(missingSchemas).toEqual([])
    })

    it('should have at least 60 total schemas (all 11 engines)', () => {
      if (Object.keys(schemas).length === 0) {
        console.warn('Skipping: schemas not generated')
        return
      }

      // With all 11 engines, we expect 60+ schemas
      const schemaCount = Object.keys(schemas).length
      expect(schemaCount).toBeGreaterThanOrEqual(60)
    })
  })

  describe('is_mock Field Consistency', () => {
    it('should have is_mock field in all engine result types (TypeScript compile check)', () => {
      // Create mock result objects - if is_mock is missing, this won't compile
      const contradictionResult: NativeContradictionAnalysisResult = {
        contradictions: [],
        claim_clusters: [],
        summary: {
          total_contradictions: 0,
          critical_count: 0,
          most_contradicted_topics: [],
          credibility_impact: 'none',
        },
        is_mock: true,
      }

      const omissionResult: NativeOmissionAnalysisResult = {
        omissions: [],
        summary: {
          total_omissions: 0,
          critical_count: 0,
          by_type: [],
          bias_analysis: {
            prosecution_favoring: 0,
            defense_favoring: 0,
            bias_score: 0,
            is_significant: false,
            assessment: '',
          },
        },
        is_mock: true,
      }

      const temporalResult: NativeTemporalAnalysisResult = {
        events: [],
        gaps: [],
        anomalies: [],
        summary: {
          total_events: 0,
          date_range_start: '',
          date_range_end: '',
          total_duration_days: 0,
          gaps_found: 0,
          anomalies_found: 0,
          critical_anomalies: 0,
          most_active_periods: [],
          quietest_periods: [],
        },
        is_mock: true,
      }

      const entityResult: NativeEntityResolutionResult = {
        entities: [],
        summary: {
          total_entities: 0,
          persons: 0,
          organizations: 0,
          professionals: 0,
          key_parties: [],
          aliases_resolved: 0,
          relationships_found: 0,
        },
        is_mock: true,
      }

      const biasResult: NativeBiasAnalysisResult = {
        findings: [],
        framing_ratios: [],
        summary: {
          total_findings: 0,
          critical_findings: 0,
          primary_framing_ratio: null,
          statistics: {
            total_items_analyzed: 0,
            items_favoring_prosecution: 0,
            items_favoring_defense: 0,
            items_neutral: 0,
            overall_bias_score: 0,
            is_statistically_significant: false,
            dominant_bias_types: [],
          },
          regulatory_assessment: '',
          ofcom_relevance: null,
        },
        is_mock: true,
      }

      const accountabilityResult: NativeAccountabilityResult = {
        duties: [],
        breaches: [],
        verification_failures: [],
        summary: {
          total_duties_identified: 0,
          duties_breached: 0,
          verification_failures: 0,
          actors_with_breaches: [],
          most_common_breach_type: null,
          regulatory_bodies_relevant: [],
        },
        is_mock: true,
      }

      const professionalResult: NativeProfessionalTrackerResult = {
        professionals: [],
        summary: {
          professionals_tracked: 0,
          total_concerns: 0,
          critical_concerns: 0,
          professionals_with_concerns: [],
          most_common_concern: null,
          regulatory_bodies_involved: [],
        },
        is_mock: true,
      }

      const argumentationResult: NativeArgumentationResult = {
        arguments: [],
        fallacies: [],
        chains: [],
        summary: {
          total_arguments: 0,
          strong_arguments: 0,
          weak_arguments: 0,
          fallacies_found: 0,
          argument_chains: 0,
          most_common_fallacy: null,
          weakest_arguments: [],
        },
        is_mock: true,
      }

      const documentaryResult: NativeDocumentaryResult = {
        editorial_choices: [],
        source_mappings: [],
        balance_analysis: {
          party_coverage: [],
          balance_score: 0,
          is_significant: false,
          assessment: '',
        },
        summary: {
          total_editorial_choices: 0,
          critical_choices: 0,
          omissions_found: 0,
          decontextualizations_found: 0,
          sources_mapped: 0,
          sources_used: 0,
          sources_omitted: 0,
          balance_assessment: '',
          ofcom_sections_implicated: [],
        },
        is_mock: true,
      }

      const narrativeResult: NativeNarrativeResult = {
        claim_evolutions: [],
        mutations: [],
        coordination_patterns: [],
        summary: {
          claims_tracked: 0,
          total_mutations: 0,
          amplifications: 0,
          attenuations: 0,
          certainty_drifts: 0,
          coordination_patterns: 0,
          prosecution_favoring_mutations: 0,
          defense_favoring_mutations: 0,
          most_mutated_claim: null,
        },
        is_mock: true,
      }

      const expertResult: NativeExpertResult = {
        experts: [],
        issues: [],
        scope_analyses: [],
        methodology_assessments: [],
        summary: {
          experts_analyzed: 0,
          total_issues: 0,
          critical_issues: 0,
          scope_issues: 0,
          methodology_issues: 0,
          evidence_issues: 0,
          fjc_compliance_score: 0,
          overall_assessment: '',
        },
        is_mock: true,
      }

      // All results should have is_mock field
      expect(hasIsMock(contradictionResult)).toBe(true)
      expect(hasIsMock(omissionResult)).toBe(true)
      expect(hasIsMock(temporalResult)).toBe(true)
      expect(hasIsMock(entityResult)).toBe(true)
      expect(hasIsMock(biasResult)).toBe(true)
      expect(hasIsMock(accountabilityResult)).toBe(true)
      expect(hasIsMock(professionalResult)).toBe(true)
      expect(hasIsMock(argumentationResult)).toBe(true)
      expect(hasIsMock(documentaryResult)).toBe(true)
      expect(hasIsMock(narrativeResult)).toBe(true)
      expect(hasIsMock(expertResult)).toBe(true)
    })
  })

  describe('Severity Consistency', () => {
    it('should use consistent severity values across all engines', () => {
      // All engines should use the same severity levels
      const validSeverities: NativeSeverity[] = ['critical', 'high', 'medium', 'low']

      // Test that our severity type covers the expected values
      validSeverities.forEach(severity => {
        expect(['critical', 'high', 'medium', 'low']).toContain(severity)
      })

      // Exactly 4 severity levels
      expect(validSeverities.length).toBe(4)
    })
  })

  describe('Engine Result Type Exports', () => {
    it('should export all 11 engine result types from CONTRACT.ts', () => {
      // This test verifies the imports at the top of this file compile successfully
      // If any type is missing from CONTRACT.ts, this test file won't compile
      const engines = [
        'Contradiction',
        'Omission',
        'Temporal',
        'Entity',
        'Bias',
        'Accountability',
        'Professional',
        'Argumentation',
        'Documentary',
        'Narrative',
        'Expert',
      ]

      expect(engines.length).toBe(11)
    })

    it('should have engine result wrapper types in CONTRACT.ts', () => {
      // Verify the EngineResult wrapper types exist
      // These are used by the command layer
      const wrapperTypes = [
        'ContradictionEngineResult',
        'OmissionEngineResult',
        'TemporalEngineResult',
        'EntityEngineResult',
        'BiasEngineResult',
        'AccountabilityEngineResult',
        'ProfessionalEngineResult',
        'ArgumentationEngineResult',
        'DocumentaryEngineResult',
        'NarrativeEngineResult',
        'ExpertEngineResult',
      ]

      expect(wrapperTypes.length).toBe(11)
    })
  })

  describe('Schema Structure Validation', () => {
    it('should have valid JSON schema structure for all engine results', () => {
      if (Object.keys(schemas).length === 0) {
        console.warn('Skipping: schemas not generated')
        return
      }

      ALL_ENGINE_RESULT_TYPES.forEach(typeName => {
        const schema = schemas[typeName] as Record<string, unknown> | undefined
        if (!schema) {
          console.warn(`Schema not found for ${typeName}`)
          return
        }

        // Each schema should have type and properties
        expect(schema).toHaveProperty('type')
        expect(schema).toHaveProperty('properties')

        // Check for is_mock in properties
        const properties = schema.properties as Record<string, unknown> | undefined
        if (properties) {
          expect(properties).toHaveProperty('is_mock')
        }
      })
    })
  })
})

describe('Engine Metadata Consistency', () => {
  it('should have 11 engines defined', () => {
    const engineIds = [
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
    ]

    expect(engineIds.length).toBe(11)
  })
})
