/**
 * NAME NORMALIZER TESTS
 *
 * Tests for name normalization utility used in entity matching.
 */

import { describe, it, expect } from '@jest/globals'
import {
  normalizeName,
  removeTitles,
  removePunctuation,
  removeMiddleNames,
  extractFirstName,
  extractLastName,
  extractInitials,
  detectRoleReference,
  generateNameVariants,
  namesCouldMatch,
  DEFAULT_OPTIONS,
  TITLES,
} from '@/lib/nlp/name-normalizer'

describe('Name Normalizer', () => {
  describe('normalizeName', () => {
    it('should normalize basic names to lowercase', () => {
      expect(normalizeName('John Smith')).toBe('john smith')
      expect(normalizeName('JANE DOE')).toBe('jane doe')
      expect(normalizeName('MiXeD CaSe')).toBe('mixed case')
    })

    it('should remove common titles', () => {
      expect(normalizeName('Dr. John Smith')).toBe('john smith')
      expect(normalizeName('Mr. James Brown')).toBe('james brown')
      expect(normalizeName('Mrs. Sarah Jones')).toBe('sarah jones')
      expect(normalizeName('Ms. Emily Davis')).toBe('emily davis')
      expect(normalizeName('Professor Smith')).toBe('smith')
      expect(normalizeName('Judge Williams')).toBe('williams')
    })

    it('should remove professional suffixes', () => {
      expect(normalizeName('John Smith, PhD')).toBe('john smith')
      expect(normalizeName('Jane Doe, MD')).toBe('jane doe')
      expect(normalizeName('Robert Brown, Esq.')).toBe('robert brown')
      expect(normalizeName('Sarah Jones, QC')).toBe('sarah jones')
    })

    it('should handle punctuation correctly', () => {
      expect(normalizeName('Smith, John')).toBe('smith john')
      expect(normalizeName('J. Smith')).toBe('j smith')
      expect(normalizeName('John K. Smith')).toBe('john k smith')
    })

    it('should preserve apostrophes in names', () => {
      expect(normalizeName("O'Brien")).toBe("o'brien")
      expect(normalizeName("McDonald")).toBe('mcdonald')
      expect(normalizeName("D'Angelo")).toBe("d'angelo")
    })

    it('should handle empty and invalid input', () => {
      expect(normalizeName('')).toBe('')
      expect(normalizeName(null as unknown as string)).toBe('')
      expect(normalizeName(undefined as unknown as string)).toBe('')
    })

    it('should collapse multiple spaces', () => {
      expect(normalizeName('John    Smith')).toBe('john smith')
      expect(normalizeName('  Jane  Doe  ')).toBe('jane doe')
    })

    it('should respect custom options', () => {
      expect(normalizeName('Dr. John Smith', { removeTitles: false })).toBe('dr john smith')
      expect(normalizeName('John Smith', { lowercase: false })).toBe('John Smith')
      expect(normalizeName('J.K. Smith', { removePunctuation: false })).toBe('j.k. smith')
    })
  })

  describe('removeTitles', () => {
    it('should remove leading titles', () => {
      expect(removeTitles('Dr. Smith')).toBe('Smith')
      expect(removeTitles('Mr Smith')).toBe('Smith')
      expect(removeTitles('Professor John Smith')).toBe('John Smith')
    })

    it('should remove trailing suffixes', () => {
      expect(removeTitles('John Smith, PhD')).toBe('John Smith')
      expect(removeTitles('Jane Doe MD')).toBe('Jane Doe')
    })

    it('should remove social work titles', () => {
      expect(removeTitles('SW Jones')).toBe('Jones')
      expect(removeTitles('John Smith, LCSW')).toBe('John Smith')
      expect(removeTitles('MSW Davis')).toBe('Davis')
    })

    it('should handle names without titles', () => {
      expect(removeTitles('John Smith')).toBe('John Smith')
    })
  })

  describe('removePunctuation', () => {
    it('should remove periods', () => {
      expect(removePunctuation('J. K. Smith')).toBe('J K Smith')
    })

    it('should replace commas with spaces', () => {
      expect(removePunctuation('Smith, John')).toBe('Smith  John')
    })

    it('should preserve apostrophes', () => {
      expect(removePunctuation("O'Brien")).toBe("O'Brien")
    })

    it('should preserve hyphens', () => {
      expect(removePunctuation('Mary-Jane')).toBe('Mary-Jane')
    })
  })

  describe('removeMiddleNames', () => {
    it('should remove middle names', () => {
      expect(removeMiddleNames('John Kenneth Smith')).toBe('John Smith')
      expect(removeMiddleNames('Mary Elizabeth Jane Doe')).toBe('Mary Doe')
    })

    it('should handle two-part names', () => {
      expect(removeMiddleNames('John Smith')).toBe('John Smith')
    })

    it('should handle single names', () => {
      expect(removeMiddleNames('John')).toBe('John')
    })
  })

  describe('extractFirstName', () => {
    it('should extract first name', () => {
      expect(extractFirstName('John Smith')).toBe('john')
      expect(extractFirstName('Dr. Jane Doe')).toBe('jane')
      expect(extractFirstName('Mary Elizabeth Smith')).toBe('mary')
    })

    it('should handle single names', () => {
      expect(extractFirstName('John')).toBe('john')
    })
  })

  describe('extractLastName', () => {
    it('should extract last name', () => {
      expect(extractLastName('John Smith')).toBe('smith')
      expect(extractLastName('Dr. Jane Elizabeth Doe')).toBe('doe')
    })

    it('should return empty for single names', () => {
      expect(extractLastName('John')).toBe('')
    })
  })

  describe('extractInitials', () => {
    it('should extract initials', () => {
      expect(extractInitials('John Smith')).toBe('JS')
      expect(extractInitials('John Kenneth Smith')).toBe('JKS')
      expect(extractInitials('Dr. Jane Doe')).toBe('JD')
    })

    it('should handle single names', () => {
      expect(extractInitials('John')).toBe('J')
    })
  })

  describe('detectRoleReference', () => {
    it('should detect evaluator references', () => {
      expect(detectRoleReference('the evaluator')).toBe('evaluator')
      expect(detectRoleReference('an evaluator')).toBe('evaluator')
    })

    it('should detect expert references', () => {
      expect(detectRoleReference('the expert')).toBe('expert')
      expect(detectRoleReference('the expert witness')).toBe('expert')
      expect(detectRoleReference('expert witness')).toBe('expert')
    })

    it('should detect social worker references', () => {
      expect(detectRoleReference('the social worker')).toBe('social_worker')
      expect(detectRoleReference('a social worker')).toBe('social_worker')
    })

    it('should detect judge references', () => {
      expect(detectRoleReference('the judge')).toBe('judge')
      expect(detectRoleReference('his honour')).toBe('judge')
      expect(detectRoleReference('her honor')).toBe('judge')
    })

    it('should return null for non-role text', () => {
      expect(detectRoleReference('John Smith')).toBe(null)
      expect(detectRoleReference('random text')).toBe(null)
    })

    it('should be case insensitive', () => {
      expect(detectRoleReference('THE EVALUATOR')).toBe('evaluator')
      expect(detectRoleReference('The Expert Witness')).toBe('expert')
    })
  })

  describe('generateNameVariants', () => {
    it('should generate common variants', () => {
      const variants = generateNameVariants('Dr. John K. Smith')

      expect(variants).toContain('john k smith')
      expect(variants).toContain('john smith')
      expect(variants).toContain('j smith')
      expect(variants).toContain('smith')
    })

    it('should include reversed name format', () => {
      const variants = generateNameVariants('John Smith')

      expect(variants).toContain('john smith')
      expect(variants).toContain('smith john')
    })

    it('should include initials', () => {
      const variants = generateNameVariants('John Kenneth Smith')

      expect(variants).toContain('jks')
    })

    it('should not duplicate variants', () => {
      const variants = generateNameVariants('John Smith')
      const uniqueVariants = [...new Set(variants)]

      expect(variants.length).toBe(uniqueVariants.length)
    })
  })

  describe('namesCouldMatch', () => {
    it('should match same names with different cases', () => {
      expect(namesCouldMatch('John Smith', 'JOHN SMITH')).toBe(true)
      expect(namesCouldMatch('jane doe', 'Jane Doe')).toBe(true)
    })

    it('should match names with and without titles', () => {
      expect(namesCouldMatch('Dr. John Smith', 'John Smith')).toBe(true)
      expect(namesCouldMatch('Mr. Jones', 'Jones')).toBe(true)
      expect(namesCouldMatch('Professor Williams', 'Williams')).toBe(true)
    })

    it('should match initial variants', () => {
      expect(namesCouldMatch('J. Smith', 'John Smith')).toBe(true)
      expect(namesCouldMatch('J Smith', 'John Smith')).toBe(true)
    })

    it('should match reversed name formats', () => {
      expect(namesCouldMatch('Smith, John', 'John Smith')).toBe(true)
    })

    it('should match last name only', () => {
      expect(namesCouldMatch('Smith', 'John Smith')).toBe(true)
      expect(namesCouldMatch('John Smith', 'Smith')).toBe(true)
    })

    it('should not match completely different names', () => {
      expect(namesCouldMatch('John Smith', 'Jane Doe')).toBe(false)
      expect(namesCouldMatch('Robert Brown', 'Michael Johnson')).toBe(false)
    })

    it('should handle the spec example variants', () => {
      // From spec: "Dr. Smith" = "John Smith" = "J. Smith"
      expect(namesCouldMatch('Dr. Smith', 'Smith')).toBe(true)
      expect(namesCouldMatch('John Smith', 'Smith')).toBe(true)
      expect(namesCouldMatch('J. Smith', 'Smith')).toBe(true)
      expect(namesCouldMatch('Dr. Smith', 'J. Smith')).toBe(true)
    })
  })

  describe('Constants', () => {
    it('should have reasonable default options', () => {
      expect(DEFAULT_OPTIONS.lowercase).toBe(true)
      expect(DEFAULT_OPTIONS.removeTitles).toBe(true)
      expect(DEFAULT_OPTIONS.removeMiddleNames).toBe(false)
      expect(DEFAULT_OPTIONS.removePunctuation).toBe(true)
      expect(DEFAULT_OPTIONS.trimWhitespace).toBe(true)
    })

    it('should include common titles', () => {
      expect(TITLES).toContain('dr')
      expect(TITLES).toContain('mr')
      expect(TITLES).toContain('mrs')
      expect(TITLES).toContain('professor')
      expect(TITLES).toContain('judge')
      expect(TITLES).toContain('sw')
    })
  })
})
