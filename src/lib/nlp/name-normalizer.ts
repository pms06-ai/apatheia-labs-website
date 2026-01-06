/**
 * NAME NORMALIZER
 *
 * Utility for normalizing entity names for consistent matching.
 * Handles title removal, punctuation cleanup, and case normalization.
 */

/**
 * Configuration options for name normalization
 */
export interface NormalizationOptions {
  /** Convert to lowercase (default: true) */
  lowercase?: boolean
  /** Remove titles like Dr., Mr., Mrs., etc. (default: true) */
  removeTitles?: boolean
  /** Remove middle names/initials (default: false) */
  removeMiddleNames?: boolean
  /** Remove punctuation (default: true) */
  removePunctuation?: boolean
  /** Trim whitespace (default: true) */
  trimWhitespace?: boolean
}

/**
 * Default normalization options
 */
export const DEFAULT_OPTIONS: NormalizationOptions = {
  lowercase: true,
  removeTitles: true,
  removeMiddleNames: false,
  removePunctuation: true,
  trimWhitespace: true,
}

/**
 * Common titles to remove during normalization
 * Includes professional, academic, and honorific titles
 */
export const TITLES: string[] = [
  // Professional titles
  'dr',
  'doctor',
  'prof',
  'professor',
  'judge',
  'hon',
  'honorable',
  'honourable',
  'rev',
  'reverend',
  'father',
  'sister',
  'brother',
  // Academic titles
  'phd',
  'md',
  'esq',
  'esquire',
  'mba',
  'ma',
  'msc',
  'ba',
  'bsc',
  'llb',
  'qc',
  // Honorific titles
  'mr',
  'mrs',
  'ms',
  'miss',
  'mx',
  'sir',
  'dame',
  'lord',
  'lady',
  // Social work / professional
  'sw',
  'lcsw',
  'msw',
  'rn',
  'lpn',
  'cps',
]

/**
 * Pattern to match titles at the beginning of a name
 * Handles optional periods and whitespace
 */
const TITLE_PATTERN = new RegExp(
  `^(${TITLES.join('|')})\\.?\\s+`,
  'gi'
)

/**
 * Pattern to match titles at the end of a name (suffixes)
 * Common for academic/professional credentials
 */
const SUFFIX_PATTERN = new RegExp(
  `\\s*,?\\s*(${TITLES.join('|')})\\.?$`,
  'gi'
)

/**
 * Pattern to match descriptive role references like "the evaluator", "the expert"
 */
const ROLE_REFERENCES: Record<string, string[]> = {
  evaluator: ['the evaluator', 'an evaluator'],
  expert: ['the expert', 'an expert', 'the expert witness', 'expert witness'],
  witness: ['the witness', 'a witness'],
  social_worker: ['the social worker', 'a social worker', 'the sw'],
  judge: ['the judge', 'his honour', 'her honour', 'his honor', 'her honor'],
  officer: ['the officer', 'the case officer'],
  guardian: ['the guardian', 'the guardian ad litem'],
  counsel: ['counsel', 'the counsel', 'legal counsel'],
}

/**
 * Normalize a name for consistent entity matching
 *
 * @param name - The name to normalize
 * @param options - Normalization options (optional)
 * @returns The normalized name
 *
 * @example
 * normalizeName('Dr. John Smith')  // 'john smith'
 * normalizeName('SMITH, JOHN')     // 'smith john'
 * normalizeName('J. Smith')        // 'j smith'
 */
export function normalizeName(
  name: string,
  options: NormalizationOptions = DEFAULT_OPTIONS
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  if (!name || typeof name !== 'string') {
    return ''
  }

  let normalized = name

  // Remove titles if enabled
  if (opts.removeTitles) {
    normalized = removeTitles(normalized)
  }

  // Remove punctuation if enabled (except apostrophes in names like O'Brien)
  if (opts.removePunctuation) {
    normalized = removePunctuation(normalized)
  }

  // Convert to lowercase if enabled
  if (opts.lowercase) {
    normalized = normalized.toLowerCase()
  }

  // Remove middle names/initials if enabled
  if (opts.removeMiddleNames) {
    normalized = removeMiddleNames(normalized)
  }

  // Trim whitespace if enabled
  if (opts.trimWhitespace) {
    normalized = normalized.trim().replace(/\s+/g, ' ')
  }

  return normalized
}

/**
 * Remove titles from a name string
 *
 * @param name - Name with potential titles
 * @returns Name without titles
 */
export function removeTitles(name: string): string {
  let result = name

  // Remove leading titles (Dr., Mr., etc.)
  result = result.replace(TITLE_PATTERN, '')

  // Remove trailing suffixes (PhD, Esq., etc.)
  result = result.replace(SUFFIX_PATTERN, '')

  return result
}

/**
 * Remove punctuation from a name string
 * Preserves apostrophes for names like O'Brien
 *
 * @param name - Name with potential punctuation
 * @returns Name with punctuation removed
 */
export function removePunctuation(name: string): string {
  // Replace commas with spaces (for "Last, First" format)
  let result = name.replace(/,/g, ' ')

  // Remove periods
  result = result.replace(/\./g, '')

  // Remove other punctuation but preserve apostrophes
  result = result.replace(/[^\w\s'-]/g, '')

  return result
}

/**
 * Remove middle names and initials from a name string
 * Keeps first and last name only
 *
 * @param name - Full name with potential middle names
 * @returns Name with only first and last name
 */
export function removeMiddleNames(name: string): string {
  const parts = name.trim().split(/\s+/)

  if (parts.length <= 2) {
    return name
  }

  // Keep first and last parts
  return `${parts[0]} ${parts[parts.length - 1]}`
}

/**
 * Extract first name from a full name
 *
 * @param name - Full name string
 * @returns First name or empty string
 */
export function extractFirstName(name: string): string {
  const normalized = normalizeName(name, { removeMiddleNames: false })
  const parts = normalized.split(/\s+/)
  return parts[0] || ''
}

/**
 * Extract last name from a full name
 *
 * @param name - Full name string
 * @returns Last name or empty string
 */
export function extractLastName(name: string): string {
  const normalized = normalizeName(name, { removeMiddleNames: false })
  const parts = normalized.split(/\s+/)
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

/**
 * Extract initials from a name
 *
 * @param name - Full name string
 * @returns Initials (e.g., "JKS" for "John Kenneth Smith")
 */
export function extractInitials(name: string): string {
  const normalized = normalizeName(name, {
    removeMiddleNames: false,
    lowercase: false,
  })
  const parts = normalized.split(/\s+/)

  return parts
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

/**
 * Check if a string is a descriptive role reference
 *
 * @param text - Text to check
 * @returns Role type if matched, null otherwise
 */
export function detectRoleReference(text: string): string | null {
  const normalized = text.toLowerCase().trim()

  for (const [role, references] of Object.entries(ROLE_REFERENCES)) {
    if (references.some((ref) => normalized === ref || normalized.includes(ref))) {
      return role
    }
  }

  return null
}

/**
 * Generate name variants for fuzzy matching
 * Creates common variations of a name for comparison
 *
 * @param name - Original name
 * @returns Array of name variants
 *
 * @example
 * generateNameVariants('Dr. John K. Smith')
 * // Returns: ['john smith', 'j smith', 'john k smith', 'jks', 'smith john', 'smith, john']
 */
export function generateNameVariants(name: string): string[] {
  const variants = new Set<string>()

  // Base normalized form
  const normalized = normalizeName(name)
  if (normalized) {
    variants.add(normalized)
  }

  // Without middle names
  const noMiddle = normalizeName(name, { removeMiddleNames: true })
  if (noMiddle && noMiddle !== normalized) {
    variants.add(noMiddle)
  }

  // Just initials + last name
  const parts = normalized.split(/\s+/)
  if (parts.length >= 2) {
    const lastName = parts[parts.length - 1]
    const firstInitial = parts[0].charAt(0)

    // "J Smith" format
    variants.add(`${firstInitial} ${lastName}`)

    // "Smith, John" format (reversed)
    if (parts.length === 2) {
      variants.add(`${parts[1]} ${parts[0]}`)
    }
  }

  // Full initials
  const initials = extractInitials(name).toLowerCase()
  if (initials.length >= 2) {
    variants.add(initials)
  }

  // Last name only
  const lastName = extractLastName(name)
  if (lastName) {
    variants.add(lastName)
  }

  return Array.from(variants)
}

/**
 * Compare two names for potential match
 * Returns true if names could refer to the same person
 *
 * @param name1 - First name
 * @param name2 - Second name
 * @returns Boolean indicating potential match
 */
export function namesCouldMatch(name1: string, name2: string): boolean {
  const norm1 = normalizeName(name1)
  const norm2 = normalizeName(name2)

  // Exact match after normalization
  if (norm1 === norm2) {
    return true
  }

  // Generate variants and check for overlap
  const variants1 = generateNameVariants(name1)
  const variants2 = generateNameVariants(name2)

  for (const v1 of variants1) {
    if (variants2.includes(v1)) {
      return true
    }
  }

  // Check if one is a substring of the other (e.g., "Smith" in "John Smith")
  if (norm1.length >= 3 && norm2.length >= 3) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      return true
    }
  }

  return false
}
