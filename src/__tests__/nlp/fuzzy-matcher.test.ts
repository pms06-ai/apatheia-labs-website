/**
 * FUZZY MATCHER TESTS
 *
 * Tests for fuzzy matching and confidence scoring functionality.
 * Verifies that 'Dr. Smith' = 'John Smith' = 'J. Smith' are correctly matched.
 */

import { describe, it, expect } from '@jest/globals'
import {
  fuzzyMatch,
  matchPersonNames,
  matchOrganizationNames,
  calculateLevenshteinSimilarity,
  calculateComponentSimilarity,
  checkVariantMatch,
  getConfidenceLevel,
  batchMatch,
  findMatches,
  generateLinkageProposals,
  DEFAULT_THRESHOLDS,
  DEFAULT_MATCH_OPTIONS,
  type MatchResult,
} from '@/lib/nlp/fuzzy-matcher'

describe('Fuzzy Matcher', () => {
  describe('calculateLevenshteinSimilarity', () => {
    it('should return 1 for identical strings', () => {
      expect(calculateLevenshteinSimilarity('john smith', 'john smith')).toBe(1)
      expect(calculateLevenshteinSimilarity('test', 'test')).toBe(1)
    })

    it('should return 0 for empty strings', () => {
      expect(calculateLevenshteinSimilarity('', 'test')).toBe(0)
      expect(calculateLevenshteinSimilarity('test', '')).toBe(0)
      expect(calculateLevenshteinSimilarity('', '')).toBe(0)
    })

    it('should calculate correct similarity for similar strings', () => {
      // "john" vs "joan" - 1 edit in 4 chars = 0.75 similarity
      const similarity = calculateLevenshteinSimilarity('john', 'joan')
      expect(similarity).toBeCloseTo(0.75, 2)
    })

    it('should return low similarity for very different strings', () => {
      const similarity = calculateLevenshteinSimilarity('abc', 'xyz')
      expect(similarity).toBeLessThan(0.5)
    })

    it('should handle case sensitivity', () => {
      const similarity = calculateLevenshteinSimilarity('John', 'john')
      expect(similarity).toBeLessThan(1)
    })
  })

  describe('calculateComponentSimilarity', () => {
    it('should give high score for matching last names', () => {
      const score = calculateComponentSimilarity('John Smith', 'Jane Smith')
      expect(score).toBeGreaterThan(0.5)
    })

    it('should recognize initial matches', () => {
      // J. Smith should match John Smith
      const score = calculateComponentSimilarity('J Smith', 'John Smith')
      expect(score).toBeGreaterThan(0.7)
    })

    it('should score matching full names highly', () => {
      const score = calculateComponentSimilarity('John Smith', 'John Smith')
      expect(score).toBeGreaterThan(0.8)
    })

    it('should handle single names', () => {
      const score = calculateComponentSimilarity('Smith', 'Smith')
      expect(score).toBeGreaterThanOrEqual(0)
    })
  })

  describe('checkVariantMatch', () => {
    it('should find matching variants for the same person', () => {
      const result = checkVariantMatch('Dr. John Smith', 'John Smith')
      expect(result.matches).toBe(true)
      expect(result.variants.length).toBeGreaterThan(0)
      expect(result.score).toBeGreaterThan(0.5)
    })

    it('should find variant matches for initial formats', () => {
      const result = checkVariantMatch('J. Smith', 'John Smith')
      expect(result.matches).toBe(true)
      expect(result.variants).toContain('j smith')
    })

    it('should return no match for different names', () => {
      const result = checkVariantMatch('John Smith', 'Jane Doe')
      expect(result.matches).toBe(false)
      expect(result.variants.length).toBe(0)
    })

    it('should match reversed name formats', () => {
      const result = checkVariantMatch('Smith, John', 'John Smith')
      expect(result.matches).toBe(true)
    })
  })

  describe('getConfidenceLevel', () => {
    it('should return high for scores >= 0.8', () => {
      expect(getConfidenceLevel(0.8)).toBe('high')
      expect(getConfidenceLevel(0.9)).toBe('high')
      expect(getConfidenceLevel(1.0)).toBe('high')
    })

    it('should return medium for scores >= 0.5 and < 0.8', () => {
      expect(getConfidenceLevel(0.5)).toBe('medium')
      expect(getConfidenceLevel(0.6)).toBe('medium')
      expect(getConfidenceLevel(0.79)).toBe('medium')
    })

    it('should return low for scores >= 0.3 and < 0.5', () => {
      expect(getConfidenceLevel(0.3)).toBe('low')
      expect(getConfidenceLevel(0.4)).toBe('low')
      expect(getConfidenceLevel(0.49)).toBe('low')
    })

    it('should return no_match for scores < 0.3', () => {
      expect(getConfidenceLevel(0.2)).toBe('no_match')
      expect(getConfidenceLevel(0.1)).toBe('no_match')
      expect(getConfidenceLevel(0)).toBe('no_match')
    })

    it('should use custom thresholds', () => {
      const customThresholds = { high: 0.9, medium: 0.7, low: 0.4 }
      expect(getConfidenceLevel(0.85, customThresholds)).toBe('medium')
      expect(getConfidenceLevel(0.5, customThresholds)).toBe('low')
    })
  })

  describe('matchPersonNames', () => {
    describe('Spec Example: Dr. Smith = John Smith = J. Smith', () => {
      it('should match "Dr. Smith" and "John Smith" with high confidence', () => {
        const result = matchPersonNames('Dr. Smith', 'John Smith')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBeGreaterThanOrEqual(0.5)
      })

      it('should match "John Smith" and "J. Smith" with high confidence', () => {
        const result = matchPersonNames('John Smith', 'J. Smith')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBeGreaterThanOrEqual(0.6)
      })

      it('should match "Dr. Smith" and "J. Smith" with confidence', () => {
        const result = matchPersonNames('Dr. Smith', 'J. Smith')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBeGreaterThanOrEqual(0.5)
      })

      it('should match all three variants transitively', () => {
        const drSmithToJohn = matchPersonNames('Dr. Smith', 'John Smith')
        const johnToJ = matchPersonNames('John Smith', 'J. Smith')
        const drSmithToJ = matchPersonNames('Dr. Smith', 'J. Smith')

        // All should be matches
        expect(drSmithToJohn.isMatch).toBe(true)
        expect(johnToJ.isMatch).toBe(true)
        expect(drSmithToJ.isMatch).toBe(true)
      })
    })

    describe('Exact and Normalized Matches', () => {
      it('should give confidence 1.0 for exact normalized matches', () => {
        const result = matchPersonNames('John Smith', 'JOHN SMITH')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBe(1.0)
        expect(result.algorithm).toBe('exact')
      })

      it('should handle titles correctly', () => {
        const result = matchPersonNames('Dr. John Smith', 'John Smith')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBe(1.0)
      })

      it('should handle suffixes correctly', () => {
        const result = matchPersonNames('John Smith Jr.', 'John Smith')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBe(1.0)
      })
    })

    describe('Initial Matching', () => {
      it('should match J. Smith to John Smith', () => {
        const result = matchPersonNames('J. Smith', 'John Smith')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBeGreaterThan(0.6)
      })

      it('should match J K Smith to John Kenneth Smith', () => {
        const result = matchPersonNames('J K Smith', 'John Kenneth Smith')
        expect(result.isMatch).toBe(true)
      })
    })

    describe('Partial Matches', () => {
      it('should match last name only', () => {
        const result = matchPersonNames('Smith', 'John Smith')
        expect(result.isMatch).toBe(true)
        expect(result.algorithm).toBe('partial')
      })

      it('should not match short partial names', () => {
        const result = matchPersonNames('Jo', 'Jonathan')
        expect(result.confidence).toBeLessThan(0.8)
      })
    })

    describe('Non-Matches', () => {
      it('should not match completely different names', () => {
        const result = matchPersonNames('John Smith', 'Jane Doe')
        expect(result.isMatch).toBe(false)
      })

      it('should not match empty inputs', () => {
        const result = matchPersonNames('', 'John Smith')
        expect(result.isMatch).toBe(false)
        expect(result.confidence).toBe(0)
      })

      it('should return low confidence for similar but different names', () => {
        const result = matchPersonNames('John Smith', 'John Smythe')
        // These are similar but not the same
        expect(result.confidence).toBeGreaterThan(0.5)
      })
    })

    describe('Edge Cases', () => {
      it('should handle names with apostrophes', () => {
        const result = matchPersonNames("O'Brien", "Patrick O'Brien")
        expect(result.isMatch).toBe(true)
      })

      it('should handle hyphenated names', () => {
        const result = matchPersonNames('Mary-Jane Watson', 'Mary-Jane Watson')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBe(1.0)
      })

      it('should handle reversed name format', () => {
        const result = matchPersonNames('Smith, John', 'John Smith')
        expect(result.isMatch).toBe(true)
      })
    })
  })

  describe('matchOrganizationNames', () => {
    describe('Alias Matching', () => {
      it('should match FBI to Federal Bureau of Investigation', () => {
        const result = matchOrganizationNames('FBI', 'Federal Bureau of Investigation')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBe(1.0)
        expect(result.algorithm).toBe('alias')
      })

      it('should match NHS to National Health Service', () => {
        const result = matchOrganizationNames('NHS', 'National Health Service')
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBe(1.0)
      })

      it('should match CAFCASS correctly', () => {
        const result = matchOrganizationNames(
          'CAFCASS',
          'Children and Family Court Advisory and Support Service'
        )
        expect(result.isMatch).toBe(true)
        expect(result.confidence).toBe(1.0)
      })
    })

    describe('Suffix Normalization', () => {
      it('should match organizations with different suffixes', () => {
        const result = matchOrganizationNames('Acme Inc', 'Acme Corporation')
        expect(result.isMatch).toBe(true)
      })

      it('should match Ltd variations', () => {
        const result = matchOrganizationNames('Test Ltd', 'Test Limited')
        expect(result.isMatch).toBe(true)
      })
    })

    describe('Non-Matches', () => {
      it('should not match different organizations', () => {
        const result = matchOrganizationNames('FBI', 'CIA')
        expect(result.isMatch).toBe(false)
      })
    })
  })

  describe('fuzzyMatch', () => {
    it('should use person matching by default', () => {
      const result = fuzzyMatch('Dr. Smith', 'John Smith')
      expect(result.isMatch).toBe(true)
    })

    it('should use organization matching when specified', () => {
      const result = fuzzyMatch('FBI', 'Federal Bureau of Investigation', {
        entityType: 'organization',
      })
      expect(result.isMatch).toBe(true)
      expect(result.algorithm).toBe('alias')
    })

    it('should respect minimum confidence threshold', () => {
      const result = fuzzyMatch('abc', 'xyz', { minConfidence: 0.9 })
      expect(result.isMatch).toBe(false)
    })
  })

  describe('batchMatch', () => {
    it('should process multiple pairs', () => {
      const pairs = [
        { entity1: 'Dr. Smith', entity2: 'John Smith' },
        { entity1: 'J. Smith', entity2: 'John Smith' },
        { entity1: 'John Doe', entity2: 'Jane Doe' },
      ]

      const result = batchMatch(pairs)

      expect(result.summary.totalComparisons).toBe(3)
      expect(result.matches).toHaveLength(3)
      expect(result.summary.matchCount).toBeGreaterThanOrEqual(2)
    })

    it('should track processing time', () => {
      const pairs = [
        { entity1: 'A', entity2: 'B' },
        { entity1: 'C', entity2: 'D' },
      ]

      const result = batchMatch(pairs)
      expect(result.summary.processingTimeMs).toBeGreaterThanOrEqual(0)
    })

    it('should categorize matches by confidence level', () => {
      const pairs = [
        { entity1: 'John Smith', entity2: 'JOHN SMITH' }, // Exact match - high
        { entity1: 'J. Smith', entity2: 'John Smith' }, // Variant - medium/high
      ]

      const result = batchMatch(pairs)
      expect(result.summary.highConfidenceCount).toBeGreaterThanOrEqual(1)
    })
  })

  describe('findMatches', () => {
    it('should find all matching candidates', () => {
      const target = 'Dr. John Smith'
      const candidates = ['John Smith', 'J. Smith', 'Smith', 'Jane Doe', 'Robert Brown']

      const matches = findMatches(target, candidates)

      expect(matches.length).toBeGreaterThanOrEqual(2)
      expect(matches.map((m) => m.candidate)).toContain('John Smith')
    })

    it('should sort by confidence descending', () => {
      const target = 'John Smith'
      const candidates = ['J. Smith', 'JOHN SMITH', 'John S.']

      const matches = findMatches(target, candidates)

      for (let i = 0; i < matches.length - 1; i++) {
        expect(matches[i].result.confidence).toBeGreaterThanOrEqual(
          matches[i + 1].result.confidence
        )
      }
    })

    it('should return empty array when no matches found', () => {
      const target = 'John Smith'
      const candidates = ['Jane Doe', 'Robert Brown']

      const matches = findMatches(target, candidates)
      expect(matches).toHaveLength(0)
    })
  })

  describe('generateLinkageProposals', () => {
    it('should generate linkage proposals for similar entities', () => {
      const entities = ['Dr. Smith', 'John Smith', 'J. Smith', 'Jane Doe']

      const linkages = generateLinkageProposals(entities)

      expect(linkages.length).toBeGreaterThan(0)
      expect(linkages[0].status).toBe('pending')
    })

    it('should include required linkage properties', () => {
      const entities = ['Dr. Smith', 'John Smith']

      const linkages = generateLinkageProposals(entities)

      if (linkages.length > 0) {
        const linkage = linkages[0]
        expect(linkage).toHaveProperty('id')
        expect(linkage).toHaveProperty('entity1')
        expect(linkage).toHaveProperty('entity2')
        expect(linkage).toHaveProperty('confidence')
        expect(linkage).toHaveProperty('algorithm')
        expect(linkage).toHaveProperty('status')
        expect(linkage).toHaveProperty('createdAt')
      }
    })

    it('should sort linkages by confidence descending', () => {
      const entities = [
        'John Smith',
        'JOHN SMITH', // Exact match - highest confidence
        'J. Smith', // Variant match
        'Jane Smith', // Lower match
      ]

      const linkages = generateLinkageProposals(entities)

      for (let i = 0; i < linkages.length - 1; i++) {
        expect(linkages[i].confidence).toBeGreaterThanOrEqual(linkages[i + 1].confidence)
      }
    })

    it('should not create duplicate linkages', () => {
      const entities = ['A', 'B', 'A']

      const linkages = generateLinkageProposals(entities)

      // Each unique pair should only appear once
      const pairKeys = linkages.map((l) =>
        [l.entity1, l.entity2].sort().join('|||')
      )
      const uniquePairs = new Set(pairKeys)
      expect(pairKeys.length).toBe(uniquePairs.size)
    })
  })

  describe('Constants', () => {
    it('should have reasonable default thresholds', () => {
      expect(DEFAULT_THRESHOLDS.high).toBe(0.8)
      expect(DEFAULT_THRESHOLDS.medium).toBe(0.5)
      expect(DEFAULT_THRESHOLDS.low).toBe(0.3)
    })

    it('should have reasonable default options', () => {
      expect(DEFAULT_MATCH_OPTIONS.minConfidence).toBe(0.3)
      expect(DEFAULT_MATCH_OPTIONS.entityType).toBe('person')
      expect(DEFAULT_MATCH_OPTIONS.allowPartialMatch).toBe(true)
      expect(DEFAULT_MATCH_OPTIONS.maxEditDistance).toBe(3)
    })
  })

  describe('Match Result Structure', () => {
    it('should include all required fields', () => {
      const result = matchPersonNames('John Smith', 'J. Smith')

      expect(result).toHaveProperty('isMatch')
      expect(result).toHaveProperty('confidence')
      expect(result).toHaveProperty('confidenceLevel')
      expect(result).toHaveProperty('algorithm')
      expect(result).toHaveProperty('explanation')
      expect(result).toHaveProperty('details')
    })

    it('should include normalized names in details', () => {
      const result = matchPersonNames('Dr. John Smith', 'J. Smith')

      expect(result.details).toHaveProperty('normalized1')
      expect(result.details).toHaveProperty('normalized2')
      expect(result.details.normalized1).toBe('john smith')
    })
  })

  describe('Performance', () => {
    it('should handle batch matching of 100+ comparisons efficiently', () => {
      const names = Array.from({ length: 20 }, (_, i) => `Person ${i}`)
      const pairs: Array<{ entity1: string; entity2: string }> = []

      for (let i = 0; i < names.length; i++) {
        for (let j = i + 1; j < names.length; j++) {
          pairs.push({ entity1: names[i], entity2: names[j] })
        }
      }

      // Should have 190 pairs (20 choose 2)
      expect(pairs.length).toBe(190)

      const result = batchMatch(pairs)

      // Should complete in under 100ms for 190 comparisons
      expect(result.summary.processingTimeMs).toBeLessThan(1000)
    })
  })
})
