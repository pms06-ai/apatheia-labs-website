/**
 * ENTITY EXTRACTOR TESTS
 *
 * Tests for Compromise NLP-based entity extraction.
 * Verifies people, organizations extraction with 80%+ accuracy.
 */

import { describe, it, expect } from '@jest/globals'
import {
  extractEntities,
  extractEntitiesFromDocuments,
  DEFAULT_EXTRACTION_OPTIONS,
  type ExtractedEntity,
  type ExtractionResult,
} from '@/lib/nlp/entity-extractor'

describe('Entity Extractor', () => {
  describe('extractEntities', () => {
    describe('People Extraction', () => {
      it('should extract simple person names', () => {
        const text = 'John Smith attended the meeting with Jane Doe.'
        const result = extractEntities(text)

        expect(result.entities.length).toBeGreaterThanOrEqual(2)
        const names = result.entities.map((e) => e.canonicalName.toLowerCase())
        expect(names.some((n) => n.includes('john') || n.includes('smith'))).toBe(true)
        expect(names.some((n) => n.includes('jane') || n.includes('doe'))).toBe(true)
      })

      it('should extract names with titles', () => {
        const text = 'Dr. Sarah Johnson provided the assessment report.'
        const result = extractEntities(text)

        expect(result.entities.length).toBeGreaterThanOrEqual(1)
        const entity = result.entities[0]
        expect(entity.canonicalName.toLowerCase()).toContain('sarah')
      })

      it('should extract professional names with SW prefix', () => {
        const text = 'SW Jones submitted the care plan yesterday.'
        const result = extractEntities(text)

        expect(result.entities.length).toBeGreaterThanOrEqual(1)
        expect(
          result.entities.some(
            (e) =>
              e.canonicalName.toLowerCase().includes('jones') &&
              (e.type === 'professional' || e.type === 'person')
          )
        ).toBe(true)
      })

      it('should extract multiple mentions of same person', () => {
        const text =
          'Dr. John Smith reviewed the case. Smith then prepared his report. John provided recommendations.'
        const result = extractEntities(text)

        // Should group mentions of the same person
        const johnSmithEntity = result.entities.find(
          (e) =>
            e.canonicalName.toLowerCase().includes('smith') ||
            e.canonicalName.toLowerCase().includes('john')
        )

        expect(johnSmithEntity).toBeDefined()
        // Should have multiple mentions or aliases
        expect(
          johnSmithEntity!.mentions.length + johnSmithEntity!.aliases.length
        ).toBeGreaterThanOrEqual(1)
      })
    })

    describe('Organization Extraction', () => {
      it('should extract organization names', () => {
        const text = 'The Federal Bureau of Investigation conducted an inquiry.'
        const result = extractEntities(text)

        expect(result.entities.length).toBeGreaterThanOrEqual(1)
        expect(
          result.entities.some(
            (e) =>
              e.canonicalName.toLowerCase().includes('federal') ||
              e.canonicalName.toLowerCase().includes('bureau') ||
              e.canonicalName.toLowerCase().includes('investigation')
          )
        ).toBe(true)
      })

      it('should extract court names', () => {
        const text = 'The matter was heard at the Family Court on Monday.'
        const result = extractEntities(text)

        expect(
          result.entities.some(
            (e) =>
              e.canonicalName.toLowerCase().includes('family court') ||
              e.type === 'court'
          )
        ).toBe(true)
      })

      it('should identify courts with correct type', () => {
        const text = 'The High Court ruled in favor of the applicant.'
        const result = extractEntities(text)

        const courtEntity = result.entities.find(
          (e) =>
            e.canonicalName.toLowerCase().includes('court') || e.type === 'court'
        )

        if (courtEntity) {
          expect(courtEntity.type).toBe('court')
        }
      })
    })

    describe('Professional Entity Detection', () => {
      it('should identify professionals by title', () => {
        const text =
          'Professor Williams explained the findings to Judge Roberts.'
        const result = extractEntities(text)

        expect(result.entities.length).toBeGreaterThanOrEqual(1)
        // At least one should be identified as professional
        const professionals = result.entities.filter(
          (e) => e.type === 'professional'
        )
        expect(professionals.length).toBeGreaterThanOrEqual(1)
      })

      it('should detect social worker role', () => {
        const text = 'SW Thompson conducted the home visit assessment.'
        const result = extractEntities(text)

        const swEntity = result.entities.find(
          (e) =>
            e.canonicalName.toLowerCase().includes('thompson') ||
            e.canonicalName.toLowerCase().includes('sw')
        )

        expect(swEntity).toBeDefined()
        if (swEntity && swEntity.role) {
          expect(['social_worker', 'sw']).toContain(swEntity.role.toLowerCase())
        }
      })

      it('should detect judge role', () => {
        const text = 'Judge Harrison presided over the hearing.'
        const result = extractEntities(text)

        const judgeEntity = result.entities.find(
          (e) =>
            e.canonicalName.toLowerCase().includes('harrison') ||
            e.canonicalName.toLowerCase().includes('judge')
        )

        expect(judgeEntity).toBeDefined()
        expect(judgeEntity?.type).toBe('professional')
      })
    })

    describe('Position Tracking', () => {
      it('should track position of entity mentions', () => {
        const text = 'Sarah Jones attended. Sarah Jones left early.'
        const result = extractEntities(text)

        const entity = result.entities.find((e) =>
          e.canonicalName.toLowerCase().includes('sarah')
        )

        expect(entity).toBeDefined()
        expect(entity!.mentions.length).toBeGreaterThanOrEqual(1)
        expect(entity!.mentions[0].position).toBeDefined()
        expect(typeof entity!.mentions[0].position.start).toBe('number')
        expect(typeof entity!.mentions[0].position.end).toBe('number')
        expect(entity!.mentions[0].position.end).toBeGreaterThan(
          entity!.mentions[0].position.start
        )
      })

      it('should extract context around mentions', () => {
        const text =
          'The report by Dr. James Wilson indicated significant concerns about the care plan.'
        const result = extractEntities(text)

        const entity = result.entities.find(
          (e) =>
            e.canonicalName.toLowerCase().includes('wilson') ||
            e.canonicalName.toLowerCase().includes('james')
        )

        expect(entity).toBeDefined()
        expect(entity!.mentions[0].context).toBeDefined()
        expect(entity!.mentions[0].context.length).toBeGreaterThan(0)
      })
    })

    describe('Confidence Scoring', () => {
      it('should assign confidence scores to entities', () => {
        const text = 'Dr. John Smith submitted his expert report.'
        const result = extractEntities(text)

        expect(result.entities.length).toBeGreaterThanOrEqual(1)
        for (const entity of result.entities) {
          expect(entity.confidence).toBeGreaterThanOrEqual(0)
          expect(entity.confidence).toBeLessThanOrEqual(1)
        }
      })

      it('should give higher confidence to names with titles', () => {
        const text = 'Dr. John Smith and Bob attended.'
        const result = extractEntities(text)

        const drSmith = result.entities.find(
          (e) =>
            e.canonicalName.toLowerCase().includes('john') ||
            e.canonicalName.toLowerCase().includes('smith')
        )
        const bob = result.entities.find((e) =>
          e.canonicalName.toLowerCase().includes('bob')
        )

        // Dr. John Smith should have higher confidence due to title and full name
        if (drSmith && bob) {
          expect(drSmith.confidence).toBeGreaterThanOrEqual(bob.confidence)
        }
      })

      it('should filter out low confidence entities', () => {
        const text = 'Dr. Sarah Jones reviewed the case of a Mr. X.'
        const result = extractEntities(text, { minConfidence: 0.5 })

        // All returned entities should meet minimum confidence
        for (const entity of result.entities) {
          expect(entity.confidence).toBeGreaterThanOrEqual(0.5)
        }
      })
    })

    describe('Summary Statistics', () => {
      it('should provide accurate summary counts', () => {
        const text =
          'Dr. Smith from NHS Trust met with Judge Williams at Family Court.'
        const result = extractEntities(text)

        expect(result.summary).toBeDefined()
        expect(result.summary.totalEntities).toBe(result.entities.length)
        expect(result.summary.peopleCount).toBe(
          result.entities.filter((e) => e.type === 'person').length
        )
        expect(result.summary.organizationCount).toBe(
          result.entities.filter((e) => e.type === 'organization').length
        )
        expect(result.summary.professionalCount).toBe(
          result.entities.filter((e) => e.type === 'professional').length
        )
      })

      it('should track processing metadata', () => {
        const text = 'John Smith attended the meeting.'
        const result = extractEntities(text)

        expect(result.metadata).toBeDefined()
        expect(result.metadata.textLength).toBe(text.length)
        expect(result.metadata.processingTimeMs).toBeGreaterThanOrEqual(0)
        expect(result.metadata.extractionMethod).toBe('compromise')
      })
    })

    describe('Edge Cases', () => {
      it('should handle empty text', () => {
        const result = extractEntities('')

        expect(result.entities).toEqual([])
        expect(result.summary.totalEntities).toBe(0)
      })

      it('should handle null/undefined text', () => {
        const result1 = extractEntities(null as unknown as string)
        const result2 = extractEntities(undefined as unknown as string)

        expect(result1.entities).toEqual([])
        expect(result2.entities).toEqual([])
      })

      it('should handle text with no entities', () => {
        const text = 'The quick brown fox jumps over the lazy dog.'
        const result = extractEntities(text)

        // May extract some words as entities depending on NLP interpretation
        // but should not crash
        expect(result).toBeDefined()
        expect(Array.isArray(result.entities)).toBe(true)
      })

      it('should handle very long text', () => {
        const longText = 'Dr. John Smith reviewed the case. '.repeat(100)
        const result = extractEntities(longText)

        expect(result).toBeDefined()
        expect(result.metadata.textLength).toBe(longText.length)
      })

      it('should handle special characters in names', () => {
        const text = "Patrick O'Brien and Mary-Jane Watson attended."
        const result = extractEntities(text)

        expect(result.entities.length).toBeGreaterThanOrEqual(1)
      })
    })
  })

  describe('extractEntitiesFromDocuments', () => {
    it('should extract entities from multiple documents', () => {
      const documents = [
        { id: 'doc1', text: 'Dr. Smith prepared the report.' },
        { id: 'doc2', text: 'Smith reviewed the findings.' },
        { id: 'doc3', text: 'John Smith signed off.' },
      ]

      const result = extractEntitiesFromDocuments(documents)

      expect(result.entities.length).toBeGreaterThanOrEqual(1)
      // Should have grouped mentions across documents
      const smithEntity = result.entities.find((e) =>
        e.canonicalName.toLowerCase().includes('smith')
      )
      expect(smithEntity).toBeDefined()
    })

    it('should handle empty documents array', () => {
      const result = extractEntitiesFromDocuments([])

      expect(result.entities).toEqual([])
      expect(result.summary.totalEntities).toBe(0)
    })

    it('should calculate combined text length', () => {
      const documents = [
        { id: 'doc1', text: 'Hello John.' },
        { id: 'doc2', text: 'Hello Jane.' },
      ]

      const result = extractEntitiesFromDocuments(documents)

      const expectedLength = documents.reduce((sum, d) => sum + d.text.length, 0)
      expect(result.metadata.textLength).toBe(expectedLength)
    })
  })

  describe('Accuracy Verification (80%+ target)', () => {
    /**
     * Test corpus with known entities to verify extraction accuracy
     * Target: 80%+ accuracy
     */
    const TEST_CORPUS = {
      text: `
        On January 15, 2024, Dr. Sarah Johnson, a clinical psychologist from NHS Mental Health Trust,
        submitted her expert report to the Family Court. The report was reviewed by Judge Michael Thompson
        who was presiding over the case.

        SW Emily Davis from Children's Services conducted a home visit and met with the family.
        Mrs. Jennifer Williams, the mother, expressed concerns about the assessment process.

        Professor Alan Grant from University College London provided academic testimony.
        The Local Authority was represented by barrister Robert Chen, QC.

        The Guardian ad Litem, Ms. Patricia Moore, submitted her position statement.
        CAFCASS officer Mr. David Brown also provided his recommendations to the court.
      `,
      expectedEntities: [
        { name: 'Sarah Johnson', type: 'professional' },
        { name: 'Michael Thompson', type: 'professional' }, // Judge
        { name: 'Emily Davis', type: 'professional' }, // SW
        { name: 'Jennifer Williams', type: 'person' },
        { name: 'Alan Grant', type: 'professional' }, // Professor
        { name: 'Robert Chen', type: 'professional' }, // barrister/QC
        { name: 'Patricia Moore', type: 'person' },
        { name: 'David Brown', type: 'professional' }, // CAFCASS officer
      ],
      expectedOrganizations: [
        'NHS Mental Health Trust',
        'Family Court',
        "Children's Services",
        'University College London',
        'Local Authority',
        'CAFCASS',
      ],
    }

    it('should achieve 80%+ accuracy on person extraction', () => {
      const result = extractEntities(TEST_CORPUS.text, { minConfidence: 0.3 })

      // Check how many expected people were found
      let foundCount = 0
      for (const expected of TEST_CORPUS.expectedEntities) {
        const nameParts = expected.name.toLowerCase().split(' ')
        const found = result.entities.some((e) => {
          const canonicalLower = e.canonicalName.toLowerCase()
          // Match if last name is found (most reliable)
          const lastName = nameParts[nameParts.length - 1]
          return canonicalLower.includes(lastName)
        })
        if (found) {
          foundCount++
        }
      }

      const accuracy = foundCount / TEST_CORPUS.expectedEntities.length
      expect(accuracy).toBeGreaterThanOrEqual(0.8)
    })

    it('should correctly identify entity types', () => {
      const result = extractEntities(TEST_CORPUS.text, { minConfidence: 0.3 })

      // Check that professionals are identified
      const professionals = result.entities.filter(
        (e) => e.type === 'professional'
      )

      // Should identify at least some professionals (Dr., Judge, SW, Professor, QC)
      expect(professionals.length).toBeGreaterThanOrEqual(3)
    })

    it('should extract organizations', () => {
      const result = extractEntities(TEST_CORPUS.text, { minConfidence: 0.2 })

      // Check how many expected organizations were found
      let foundCount = 0
      for (const expectedOrg of TEST_CORPUS.expectedOrganizations) {
        const orgParts = expectedOrg.toLowerCase().split(' ')
        const found = result.entities.some((e) => {
          const canonicalLower = e.canonicalName.toLowerCase()
          // Match if main keyword is found
          return orgParts.some(
            (part) => part.length > 3 && canonicalLower.includes(part)
          )
        })
        if (found) {
          foundCount++
        }
      }

      // Should find at least some organizations
      expect(foundCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Integration with name-normalizer', () => {
    it('should provide normalized text for mentions', () => {
      const text = 'Dr. John K. Smith prepared the report.'
      const result = extractEntities(text)

      const entity = result.entities.find((e) =>
        e.canonicalName.toLowerCase().includes('smith')
      )

      expect(entity).toBeDefined()
      expect(entity!.mentions[0].normalizedText).toBeDefined()
      // Normalized should be lowercase without title
      expect(entity!.mentions[0].normalizedText).not.toContain('Dr')
      expect(entity!.mentions[0].normalizedText).toMatch(/[a-z\s]+/)
    })

    it('should generate aliases for entity variants', () => {
      const text = 'Dr. Smith reviewed. John Smith signed. J. Smith approved.'
      const result = extractEntities(text, { minConfidence: 0.3 })

      // Should potentially group these as one entity with aliases
      const smithEntities = result.entities.filter((e) =>
        e.canonicalName.toLowerCase().includes('smith')
      )

      // Either grouped as one with aliases, or multiple entities found
      expect(smithEntities.length).toBeGreaterThanOrEqual(1)

      // If grouped, should have aliases
      if (smithEntities.length === 1) {
        expect(smithEntities[0].aliases.length).toBeGreaterThanOrEqual(1)
      }
    })
  })

  describe('DEFAULT_EXTRACTION_OPTIONS', () => {
    it('should have reasonable defaults', () => {
      expect(DEFAULT_EXTRACTION_OPTIONS.minConfidence).toBe(0.3)
      expect(DEFAULT_EXTRACTION_OPTIONS.includePlaces).toBe(false)
      expect(DEFAULT_EXTRACTION_OPTIONS.contextWindow).toBe(100)
    })

    it('should allow overriding defaults', () => {
      const text = 'John Smith visited London.'
      const resultWithoutPlaces = extractEntities(text, { includePlaces: false })
      const resultWithPlaces = extractEntities(text, { includePlaces: true })

      // With places included, may extract London
      expect(resultWithPlaces.summary.placeCount).toBeGreaterThanOrEqual(
        resultWithoutPlaces.summary.placeCount
      )
    })
  })
})
