/**
 * ENTITY RESOLUTION ENGINE (Ε)
 * "Who's Who Across Documents"
 *
 * Extracts and resolves entities (people, organizations, professionals, courts)
 * across multiple documents using Compromise NLP library.
 *
 * Core Question: Who are all the people/entities mentioned across documents?
 */

import { extractEntitiesFromDocuments } from '@/lib/nlp/entity-extractor'
import type { ExtractedEntityType } from '@/lib/nlp/entity-extractor'
import type { Document } from '@/CONTRACT'

/**
 * A resolved entity with all its mentions across documents
 */
export interface ResolvedEntity {
  /** Unique identifier for this entity */
  id: string
  /** The canonical (most common/complete) form of the name */
  canonicalName: string
  /** Type of entity */
  type: 'person' | 'organization' | 'professional' | 'court'
  /** Role if detected (e.g., 'social_worker', 'judge') */
  role?: string
  /** All mentions of this entity across documents */
  mentions: {
    docId: string
    text: string
    context: string
  }[]
  /** All name variants found */
  aliases: string[]
  /** Confidence score (0-1) */
  confidence: number
}

/**
 * Result from entity resolution
 */
export interface EntityResolutionResult {
  /** All resolved entities */
  entities: ResolvedEntity[]
  /** Summary statistics */
  summary: {
    totalEntities: number
    peopleCount: number
    professionalCount: number
    organizationCount: number
    courtCount: number
  }
  /** Processing metadata */
  metadata: {
    textLength: number
    processingTimeMs: number
    extractionMethod: 'compromise'
  }
}

/**
 * Map extracted entity type to resolved entity type
 * Filters out 'place' type as it's not supported in ResolvedEntity
 */
function mapEntityType(type: ExtractedEntityType): ResolvedEntity['type'] | null {
  switch (type) {
    case 'person':
      return 'person'
    case 'organization':
      return 'organization'
    case 'professional':
      return 'professional'
    case 'court':
      return 'court'
    case 'place':
      // Places are not supported in ResolvedEntity
      return null
    default:
      return 'person'
  }
}

/**
 * Convert role format from extractor to human-readable form
 */
function formatRole(role: string | undefined): string | undefined {
  if (!role) return undefined

  const roleMap: Record<string, string> = {
    'social_worker': 'Social Worker',
    'judge': 'Judge',
    'doctor': 'Doctor',
    'professor': 'Professor',
    'psychologist': 'Psychologist',
    'psychiatrist': 'Psychiatrist',
    'barrister': 'Barrister',
    'solicitor': 'Solicitor',
    'guardian': 'Guardian',
  }

  return roleMap[role] || role
}

/**
 * Generate a unique entity ID
 */
function generateEntityId(index: number): string {
  return `ent-${Date.now().toString(36)}-${index}`
}

/**
 * Resolve entities across a set of documents using Compromise NLP
 *
 * @param documents - Array of documents to analyze
 * @param caseId - Case ID for tracking (used for future database storage)
 * @returns Entity resolution result with entities and statistics
 */
export async function resolveEntities(
  documents: Document[],
  caseId: string
): Promise<EntityResolutionResult> {
  const startTime = Date.now()

  // Mock Mode Check - return mock data for development
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      entities: [
        {
          id: generateEntityId(0),
          canonicalName: 'Sarah Jones',
          type: 'professional',
          role: 'Social Worker',
          aliases: ['Sarah Jones', 'S. Jones', 'SW Jones'],
          mentions: [
            {
              docId: documents[0]?.id || 'd1',
              text: 'SW Jones',
              context: '...SW Jones attended the meeting on behalf of the local authority...'
            }
          ],
          confidence: 0.85
        },
        {
          id: generateEntityId(1),
          canonicalName: 'Dr. Alan Grant',
          type: 'professional',
          role: 'Psychologist',
          aliases: ['Dr. Grant', 'Dr. Alan Grant'],
          mentions: [
            {
              docId: documents[0]?.id || 'd1',
              text: 'Dr. Grant',
              context: '...Dr. Grant provided a psychological assessment...'
            }
          ],
          confidence: 0.9
        },
        {
          id: generateEntityId(2),
          canonicalName: 'Family Court',
          type: 'court',
          aliases: ['Family Court'],
          mentions: [
            {
              docId: documents[0]?.id || 'd1',
              text: 'Family Court',
              context: '...the matter was heard at the Family Court...'
            }
          ],
          confidence: 0.95
        }
      ],
      summary: {
        totalEntities: 3,
        peopleCount: 0,
        professionalCount: 2,
        organizationCount: 0,
        courtCount: 1
      },
      metadata: {
        textLength: 0,
        processingTimeMs: Date.now() - startTime,
        extractionMethod: 'compromise'
      }
    }
  }

  // Prepare documents for extraction
  // Limit to first 5 documents and 10000 chars each for performance
  const docsForExtraction = documents.slice(0, 5).map(doc => ({
    id: doc.id,
    text: doc.extracted_text?.slice(0, 10000) || ''
  })).filter(doc => doc.text.length > 0)

  // Handle empty documents
  if (docsForExtraction.length === 0) {
    return {
      entities: [],
      summary: {
        totalEntities: 0,
        peopleCount: 0,
        professionalCount: 0,
        organizationCount: 0,
        courtCount: 0
      },
      metadata: {
        textLength: 0,
        processingTimeMs: Date.now() - startTime,
        extractionMethod: 'compromise'
      }
    }
  }

  // Extract entities using Compromise NLP
  const extractionResult = extractEntitiesFromDocuments(docsForExtraction, {
    minConfidence: 0.4,
    includePlaces: false,
    contextWindow: 100
  })

  // Map extracted entities to resolved entities
  const resolvedEntities: ResolvedEntity[] = []
  let entityIndex = 0

  for (const extracted of extractionResult.entities) {
    const mappedType = mapEntityType(extracted.type)

    // Skip unsupported types (like 'place')
    if (!mappedType) continue

    // Map mentions to include document ID
    // Since extractEntitiesFromDocuments groups across docs, we need to track doc IDs
    const mentions = extracted.mentions.map(mention => ({
      docId: findDocumentIdForMention(mention.text, docsForExtraction),
      text: mention.text,
      context: mention.context
    }))

    const resolvedEntity: ResolvedEntity = {
      id: generateEntityId(entityIndex++),
      canonicalName: extracted.canonicalName,
      type: mappedType,
      role: formatRole(extracted.role),
      mentions,
      aliases: extracted.aliases,
      confidence: extracted.confidence
    }

    resolvedEntities.push(resolvedEntity)
  }

  // Sort by confidence (highest first)
  resolvedEntities.sort((a, b) => b.confidence - a.confidence)

  return {
    entities: resolvedEntities,
    summary: {
      totalEntities: resolvedEntities.length,
      peopleCount: resolvedEntities.filter(e => e.type === 'person').length,
      professionalCount: resolvedEntities.filter(e => e.type === 'professional').length,
      organizationCount: resolvedEntities.filter(e => e.type === 'organization').length,
      courtCount: resolvedEntities.filter(e => e.type === 'court').length
    },
    metadata: {
      textLength: extractionResult.metadata.textLength,
      processingTimeMs: Date.now() - startTime,
      extractionMethod: 'compromise'
    }
  }
}

/**
 * Find which document contains a mention text
 * Returns the first document ID that contains the mention
 */
function findDocumentIdForMention(
  mentionText: string,
  documents: Array<{ id: string; text: string }>
): string {
  const lowerMention = mentionText.toLowerCase()

  for (const doc of documents) {
    if (doc.text.toLowerCase().includes(lowerMention)) {
      return doc.id
    }
  }

  // Fallback to first document if not found
  return documents[0]?.id || 'unknown'
}

/**
 * Entity resolution engine module export
 */
export const entityResolutionEngine = {
  resolveEntities
}
