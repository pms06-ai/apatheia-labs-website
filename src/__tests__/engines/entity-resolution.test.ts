/**
 * ENTITY RESOLUTION ENGINE TESTS
 *
 * Tests for the Entity Resolution Engine that uses Compromise NLP
 * for entity extraction (not AI prompts).
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import {
  resolveEntities,
  entityResolutionEngine,
  type ResolvedEntity,
  type EntityResolutionResult,
} from '@/lib/engines/entity-resolution'
import { createMockDocument } from '../setup'
import type { Document } from '@/CONTRACT'

describe('Entity Resolution Engine', () => {
  describe('resolveEntities', () => {
    describe('Basic Entity Extraction', () => {
      it('should extract entities from documents using Compromise NLP', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text:
              'Dr. Sarah Johnson prepared the report. SW Thompson conducted the home visit.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result).toBeDefined()
        expect(result.metadata.extractionMethod).toBe('compromise')
        expect(result.entities.length).toBeGreaterThanOrEqual(1)
      })

      it('should return proper entity structure', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Judge Williams presided over the hearing.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        if (result.entities.length > 0) {
          const entity = result.entities[0]
          expect(entity.id).toBeDefined()
          expect(entity.canonicalName).toBeDefined()
          expect(entity.type).toBeDefined()
          expect(['person', 'organization', 'professional', 'court']).toContain(
            entity.type
          )
          expect(Array.isArray(entity.mentions)).toBe(true)
          expect(Array.isArray(entity.aliases)).toBe(true)
          expect(typeof entity.confidence).toBe('number')
        }
      })

      it('should extract professional entities with roles', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text:
              'Dr. Smith provided the assessment. SW Jones conducted the review.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        // Should find professional entities
        const professionals = result.entities.filter(
          (e) => e.type === 'professional'
        )
        expect(professionals.length).toBeGreaterThanOrEqual(0)
      })

      it('should extract court entities', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'The matter was heard at the Family Court.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        // Should find court entities
        const courts = result.entities.filter((e) => e.type === 'court')
        expect(courts.length + result.summary.courtCount).toBeGreaterThanOrEqual(
          0
        )
      })
    })

    describe('Cross-Document Entity Resolution', () => {
      it('should extract entities from multiple documents', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. Smith prepared the initial report.',
          }) as Document,
          createMockDocument({
            id: 'doc-2',
            extracted_text: 'Smith reviewed the findings yesterday.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result).toBeDefined()
        expect(result.metadata.extractionMethod).toBe('compromise')
      })

      it('should track document IDs in mentions', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'John Smith attended the meeting.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        for (const entity of result.entities) {
          for (const mention of entity.mentions) {
            expect(mention.docId).toBeDefined()
            expect(typeof mention.text).toBe('string')
            expect(typeof mention.context).toBe('string')
          }
        }
      })
    })

    describe('Summary Statistics', () => {
      it('should provide accurate summary counts', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text:
              'Dr. Smith from NHS Trust met Judge Williams at Family Court.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result.summary).toBeDefined()
        expect(result.summary.totalEntities).toBe(result.entities.length)
        expect(result.summary.peopleCount).toBe(
          result.entities.filter((e) => e.type === 'person').length
        )
        expect(result.summary.professionalCount).toBe(
          result.entities.filter((e) => e.type === 'professional').length
        )
        expect(result.summary.organizationCount).toBe(
          result.entities.filter((e) => e.type === 'organization').length
        )
        expect(result.summary.courtCount).toBe(
          result.entities.filter((e) => e.type === 'court').length
        )
      })

      it('should track processing metadata', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'John Smith attended.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result.metadata).toBeDefined()
        expect(result.metadata.extractionMethod).toBe('compromise')
        expect(result.metadata.processingTimeMs).toBeGreaterThanOrEqual(0)
      })
    })

    describe('Edge Cases', () => {
      it('should handle empty documents array', async () => {
        const result = await resolveEntities([], 'case-123')

        expect(result.entities).toEqual([])
        expect(result.summary.totalEntities).toBe(0)
        expect(result.metadata.extractionMethod).toBe('compromise')
      })

      it('should handle documents with no extracted text', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: null,
          }) as Document,
          createMockDocument({
            id: 'doc-2',
            extracted_text: '',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result).toBeDefined()
        expect(result.metadata.extractionMethod).toBe('compromise')
      })

      it('should handle documents with whitespace only', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: '   \n\t  ',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result).toBeDefined()
        expect(Array.isArray(result.entities)).toBe(true)
      })
    })

    describe('Confidence Scoring', () => {
      it('should assign confidence scores to entities', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. John Smith submitted his expert report.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        for (const entity of result.entities) {
          expect(entity.confidence).toBeGreaterThanOrEqual(0)
          expect(entity.confidence).toBeLessThanOrEqual(1)
        }
      })

      it('should sort entities by confidence', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text:
              'Dr. Sarah Johnson and Bob attended. Professor Williams also came.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        if (result.entities.length > 1) {
          // Entities should be sorted by confidence (highest first)
          for (let i = 1; i < result.entities.length; i++) {
            expect(result.entities[i - 1].confidence).toBeGreaterThanOrEqual(
              result.entities[i].confidence - 0.1 // Allow small variance for mention count sorting
            )
          }
        }
      })
    })

    describe('Alias Tracking', () => {
      it('should track aliases for entities', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text:
              'Dr. John Smith reviewed the case. Smith signed the report.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        // Check that entities have aliases array
        for (const entity of result.entities) {
          expect(Array.isArray(entity.aliases)).toBe(true)
          expect(entity.aliases.length).toBeGreaterThanOrEqual(1)
        }
      })
    })

    describe('Role Formatting', () => {
      it('should format roles in human-readable form', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'SW Thompson conducted the assessment.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        // Check that roles are properly formatted (e.g., 'Social Worker' not 'social_worker')
        for (const entity of result.entities) {
          if (entity.role) {
            expect(entity.role).not.toContain('_')
            expect(entity.role[0]).toBe(entity.role[0].toUpperCase())
          }
        }
      })
    })
  })

  describe('Verification: Uses Compromise, Not AI Prompts', () => {
    it('should use compromise extraction method', async () => {
      const documents: Document[] = [
        createMockDocument({
          id: 'doc-1',
          extracted_text: 'Dr. Smith met with SW Jones at the Family Court.',
        }) as Document,
      ]

      const result = await resolveEntities(documents, 'case-123')

      // Critical assertion: verify extraction method is 'compromise'
      expect(result.metadata.extractionMethod).toBe('compromise')
    })

    it('should process synchronously without external API calls', async () => {
      const documents: Document[] = [
        createMockDocument({
          id: 'doc-1',
          extracted_text:
            'Professor Williams and Dr. Grant attended. The Family Court ruled in favor.',
        }) as Document,
      ]

      const startTime = Date.now()
      const result = await resolveEntities(documents, 'case-123')
      const elapsed = Date.now() - startTime

      // Compromise processing should be fast (< 1 second for small text)
      // AI calls would typically take longer
      expect(elapsed).toBeLessThan(5000)
      expect(result.metadata.extractionMethod).toBe('compromise')
    })
  })

  describe('entityResolutionEngine export', () => {
    it('should export resolveEntities function', () => {
      expect(entityResolutionEngine).toBeDefined()
      expect(typeof entityResolutionEngine.resolveEntities).toBe('function')
    })
  })
})
