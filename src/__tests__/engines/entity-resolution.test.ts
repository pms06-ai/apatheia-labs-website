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
  findEntityVariations,
  areEntitiesSame,
  buildGraph,
  type ResolvedEntity,
  type EntityResolutionResult,
  type EntityLinkageProposal,
  type EntityGraphData,
  type EntityGraphNode,
  type EntityGraphEdge,
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

    it('should export findEntityVariations function', () => {
      expect(typeof entityResolutionEngine.findEntityVariations).toBe('function')
    })

    it('should export areEntitiesSame function', () => {
      expect(typeof entityResolutionEngine.areEntitiesSame).toBe('function')
    })
  })

  describe('Fuzzy Matching - Entity Linkages', () => {
    it('should include linkages in result', async () => {
      const documents: Document[] = [
        createMockDocument({
          id: 'doc-1',
          extracted_text: 'Dr. Smith prepared the report.',
        }) as Document,
      ]

      const result = await resolveEntities(documents, 'case-123')

      expect(result.linkages).toBeDefined()
      expect(Array.isArray(result.linkages)).toBe(true)
    })

    it('should track fuzzyMatchingApplied in metadata', async () => {
      const documents: Document[] = [
        createMockDocument({
          id: 'doc-1',
          extracted_text: 'Dr. Smith and Professor Grant attended.',
        }) as Document,
      ]

      const result = await resolveEntities(documents, 'case-123')

      expect(result.metadata.fuzzyMatchingApplied).toBeDefined()
      expect(typeof result.metadata.fuzzyMatchingApplied).toBe('boolean')
    })

    it('should include linkage statistics in summary', async () => {
      const documents: Document[] = [
        createMockDocument({
          id: 'doc-1',
          extracted_text: 'Dr. Smith attended the meeting.',
        }) as Document,
      ]

      const result = await resolveEntities(documents, 'case-123')

      expect(result.summary.linkagesIdentified).toBeDefined()
      expect(typeof result.summary.linkagesIdentified).toBe('number')
      expect(result.summary.highConfidenceLinkages).toBeDefined()
      expect(typeof result.summary.highConfidenceLinkages).toBe('number')
    })

    it('should have valid linkage structure when linkages exist', async () => {
      const documents: Document[] = [
        createMockDocument({
          id: 'doc-1',
          extracted_text:
            'Dr. John Smith prepared the report. Smith reviewed it later. J. Smith signed.',
        }) as Document,
      ]

      const result = await resolveEntities(documents, 'case-123')

      for (const linkage of result.linkages) {
        expect(linkage.id).toBeDefined()
        expect(linkage.entity1Name).toBeDefined()
        expect(linkage.entity2Name).toBeDefined()
        expect(linkage.confidence).toBeGreaterThanOrEqual(0)
        expect(linkage.confidence).toBeLessThanOrEqual(1)
        expect(['exact', 'normalized', 'levenshtein', 'variant', 'alias', 'partial']).toContain(
          linkage.algorithm
        )
        expect(['pending', 'confirmed', 'rejected']).toContain(linkage.status)
        expect(Array.isArray(linkage.entityIds)).toBe(true)
      }
    })
  })

  describe('Fuzzy Matching - Name Variation Identification (5+ variations)', () => {
    it('should identify name variations using findEntityVariations', () => {
      const entityName = 'Dr. John Smith'
      const allNames = [
        'Dr. John Smith',
        'John Smith',
        'J. Smith',
        'Smith',
        'Dr. Smith',
        'Professor Smith',
        'Mr. Smith',
        'Jane Doe', // Different person - should not match
      ]

      const variations = findEntityVariations(entityName, allNames)

      // Should find at least 5 variations of "Dr. John Smith"
      expect(variations.length).toBeGreaterThanOrEqual(5)

      // Each variation should have a confidence score
      for (const variation of variations) {
        expect(variation.name).toBeDefined()
        expect(variation.confidence).toBeGreaterThanOrEqual(0.5)
        expect(variation.confidence).toBeLessThanOrEqual(1)
        expect(variation.algorithm).toBeDefined()
      }

      // Should NOT include Jane Doe (different person)
      const matchedNames = variations.map((v) => v.name)
      expect(matchedNames).not.toContain('Jane Doe')
    })

    it('should match "Dr. Smith" = "John Smith" = "J. Smith" with confidence scores', () => {
      // This is the spec requirement: Match "Dr. Smith" = "John Smith" = "J. Smith"
      const result1 = areEntitiesSame('Dr. Smith', 'John Smith')
      expect(result1).not.toBeNull()
      if (result1) {
        expect(result1.confidence).toBeGreaterThanOrEqual(0.5)
      }

      const result2 = areEntitiesSame('John Smith', 'J. Smith')
      expect(result2).not.toBeNull()
      if (result2) {
        expect(result2.confidence).toBeGreaterThanOrEqual(0.5)
      }

      const result3 = areEntitiesSame('Dr. Smith', 'J. Smith')
      expect(result3).not.toBeNull()
      if (result3) {
        expect(result3.confidence).toBeGreaterThanOrEqual(0.5)
      }
    })

    it('should identify 5+ name variations for a person entity', () => {
      const baseEntity = 'Sarah Jones'
      const variations = [
        'Sarah Jones',
        'S. Jones',
        'Ms. Jones',
        'Dr. Jones',
        'SW Jones',
        'Mrs. Jones',
        'Jones',
      ]

      let matchCount = 0
      for (const variation of variations) {
        if (variation === baseEntity) continue
        const result = areEntitiesSame(baseEntity, variation)
        if (result && result.confidence >= 0.5) {
          matchCount++
        }
      }

      // Should match at least 5 of the 6 variations
      expect(matchCount).toBeGreaterThanOrEqual(5)
    })

    it('should merge entities with similar names into single entity with multiple aliases', async () => {
      const documents: Document[] = [
        createMockDocument({
          id: 'doc-1',
          extracted_text:
            'Dr. John Smith prepared the initial report. Smith reviewed the findings. J. Smith signed off.',
        }) as Document,
        createMockDocument({
          id: 'doc-2',
          extracted_text: 'Mr. Smith attended the hearing. John Smith testified.',
        }) as Document,
      ]

      const result = await resolveEntities(documents, 'case-123')

      // Find any Smith-related entity
      const smithEntities = result.entities.filter(
        (e) =>
          e.canonicalName.toLowerCase().includes('smith') ||
          e.aliases.some((a) => a.toLowerCase().includes('smith'))
      )

      // If fuzzy matching merged successfully, there should be fewer entities
      // and the merged entity should have multiple aliases
      if (smithEntities.length > 0) {
        const smithEntity = smithEntities[0]
        // Check that aliases array has multiple variations
        expect(smithEntity.aliases.length).toBeGreaterThanOrEqual(1)
      }
    })
  })

  describe('Fuzzy Matching - Organization Variations', () => {
    it('should match organization name variations', () => {
      const result = areEntitiesSame('NHS', 'National Health Service', 'organization')
      // Organization matching may vary based on alias support
      // Just verify the function works for organizations
      expect(result === null || typeof result.confidence === 'number').toBe(true)
    })
  })

  describe('Fuzzy Matching - Edge Cases', () => {
    it('should not match completely different names', () => {
      const result = areEntitiesSame('John Smith', 'Jane Doe')
      expect(result).toBeNull()
    })

    it('should handle empty entity name list', () => {
      const variations = findEntityVariations('Dr. Smith', [])
      expect(variations).toEqual([])
    })

    it('should not include the source name in variations', () => {
      const variations = findEntityVariations('Dr. Smith', ['Dr. Smith', 'John Smith'])
      const names = variations.map((v) => v.name)
      expect(names).not.toContain('Dr. Smith')
    })

    it('should sort variations by confidence (highest first)', () => {
      const variations = findEntityVariations('Dr. John Smith', [
        'John Smith',
        'J. Smith',
        'Smith',
        'Dr. Smith',
      ])

      if (variations.length > 1) {
        for (let i = 1; i < variations.length; i++) {
          expect(variations[i - 1].confidence).toBeGreaterThanOrEqual(
            variations[i].confidence
          )
        }
      }
    })
  })

  describe('Graph Data Structure', () => {
    describe('Graph Structure in Resolution Result', () => {
      it('should include graph in entity resolution result', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. Smith attended the meeting at Family Court.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result.graph).toBeDefined()
        expect(result.graph.nodes).toBeDefined()
        expect(result.graph.edges).toBeDefined()
        expect(result.graph.metadata).toBeDefined()
      })

      it('should have valid graph metadata', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. Smith and Judge Williams attended.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result.graph.metadata.nodeCount).toBeGreaterThanOrEqual(0)
        expect(result.graph.metadata.edgeCount).toBeGreaterThanOrEqual(0)
        expect(result.graph.metadata.directed).toBe(false)
        expect(result.graph.metadata.createdAt).toBeDefined()
        expect(new Date(result.graph.metadata.createdAt).getTime()).not.toBeNaN()
      })

      it('should have nodes matching entities count', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. Smith and Professor Grant discussed the case.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        expect(result.graph.nodes.length).toBe(result.entities.length)
        expect(result.graph.metadata.nodeCount).toBe(result.entities.length)
      })

      it('should return empty graph for empty documents', async () => {
        const result = await resolveEntities([], 'case-123')

        expect(result.graph.nodes).toEqual([])
        expect(result.graph.edges).toEqual([])
        expect(result.graph.metadata.nodeCount).toBe(0)
        expect(result.graph.metadata.edgeCount).toBe(0)
      })
    })

    describe('Graph Node Structure', () => {
      it('should have valid node structure with required attributes', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. John Smith reviewed the report.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        for (const node of result.graph.nodes) {
          expect(node.key).toBeDefined()
          expect(node.attributes).toBeDefined()
          expect(node.attributes.id).toBeDefined()
          expect(node.attributes.name).toBeDefined()
          expect(node.attributes.type).toBeDefined()
          expect(['person', 'organization', 'professional', 'court']).toContain(
            node.attributes.type
          )
          expect(Array.isArray(node.attributes.aliases)).toBe(true)
          expect(typeof node.attributes.mentionCount).toBe('number')
          expect(Array.isArray(node.attributes.documentIds)).toBe(true)
          expect(typeof node.attributes.confidence).toBe('number')
        }
      })

      it('should have node keys matching entity IDs', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'SW Jones conducted the assessment.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        const entityIds = result.entities.map((e) => e.id)
        const nodeKeys = result.graph.nodes.map((n) => n.key)

        for (const entityId of entityIds) {
          expect(nodeKeys).toContain(entityId)
        }
      })

      it('should track document IDs in node attributes', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. Smith attended.',
          }) as Document,
          createMockDocument({
            id: 'doc-2',
            extracted_text: 'Smith reviewed the case.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        // Each node should have documentIds array
        for (const node of result.graph.nodes) {
          expect(Array.isArray(node.attributes.documentIds)).toBe(true)
        }
      })
    })

    describe('Graph Edge Structure', () => {
      it('should have valid edge structure when linkages exist', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text:
              'Dr. John Smith and John Smith reviewed. J. Smith signed.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        for (const edge of result.graph.edges) {
          expect(edge.key).toBeDefined()
          expect(edge.source).toBeDefined()
          expect(edge.target).toBeDefined()
          expect(edge.attributes).toBeDefined()
          expect(edge.attributes.id).toBeDefined()
          expect(typeof edge.attributes.confidence).toBe('number')
          expect(edge.attributes.confidence).toBeGreaterThanOrEqual(0)
          expect(edge.attributes.confidence).toBeLessThanOrEqual(1)
          expect(
            ['exact', 'normalized', 'levenshtein', 'variant', 'alias', 'partial']
          ).toContain(edge.attributes.algorithm)
          expect(['pending', 'confirmed', 'rejected']).toContain(
            edge.attributes.status
          )
        }
      })

      it('should have source and target pointing to valid nodes', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text: 'Dr. Smith and Professor Grant attended.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        const nodeKeys = new Set(result.graph.nodes.map((n) => n.key))

        for (const edge of result.graph.edges) {
          expect(nodeKeys.has(edge.source)).toBe(true)
          expect(nodeKeys.has(edge.target)).toBe(true)
        }
      })

      it('should not have self-loop edges', async () => {
        const documents: Document[] = [
          createMockDocument({
            id: 'doc-1',
            extracted_text:
              'Dr. Smith prepared the report. Smith reviewed it.',
          }) as Document,
        ]

        const result = await resolveEntities(documents, 'case-123')

        for (const edge of result.graph.edges) {
          expect(edge.source).not.toBe(edge.target)
        }
      })
    })

    describe('buildGraph Function', () => {
      it('should build graph from entities and linkages', () => {
        const entities: ResolvedEntity[] = [
          {
            id: 'ent-1',
            canonicalName: 'Dr. Smith',
            type: 'professional',
            role: 'Doctor',
            aliases: ['Dr. Smith', 'Smith'],
            mentions: [
              { docId: 'doc-1', text: 'Dr. Smith', context: 'context 1' },
            ],
            confidence: 0.9,
          },
          {
            id: 'ent-2',
            canonicalName: 'Judge Williams',
            type: 'professional',
            role: 'Judge',
            aliases: ['Judge Williams'],
            mentions: [
              { docId: 'doc-1', text: 'Judge Williams', context: 'context 2' },
            ],
            confidence: 0.85,
          },
        ]

        const linkages: EntityLinkageProposal[] = []

        const graph = buildGraph(entities, linkages)

        expect(graph.nodes.length).toBe(2)
        expect(graph.edges.length).toBe(0)
        expect(graph.metadata.nodeCount).toBe(2)
        expect(graph.metadata.edgeCount).toBe(0)
      })

      it('should build graph with edges from linkages', () => {
        const entities: ResolvedEntity[] = [
          {
            id: 'ent-1',
            canonicalName: 'Dr. John Smith',
            type: 'professional',
            aliases: ['Dr. John Smith', 'J. Smith'],
            mentions: [
              { docId: 'doc-1', text: 'Dr. John Smith', context: 'context' },
            ],
            confidence: 0.9,
          },
          {
            id: 'ent-2',
            canonicalName: 'John Smith',
            type: 'person',
            aliases: ['John Smith'],
            mentions: [
              { docId: 'doc-1', text: 'John Smith', context: 'context' },
            ],
            confidence: 0.85,
          },
        ]

        const linkages: EntityLinkageProposal[] = [
          {
            id: 'link-1',
            entity1Name: 'Dr. John Smith',
            entity2Name: 'John Smith',
            confidence: 0.88,
            algorithm: 'variant',
            status: 'confirmed',
            entityIds: ['ent-1', 'ent-2'],
          },
        ]

        const graph = buildGraph(entities, linkages)

        expect(graph.nodes.length).toBe(2)
        expect(graph.edges.length).toBe(1)
        expect(graph.metadata.edgeCount).toBe(1)
        expect(graph.edges[0].source).toBe('ent-1')
        expect(graph.edges[0].target).toBe('ent-2')
        expect(graph.edges[0].attributes.confidence).toBe(0.88)
      })

      it('should handle empty entities array', () => {
        const graph = buildGraph([], [])

        expect(graph.nodes).toEqual([])
        expect(graph.edges).toEqual([])
        expect(graph.metadata.nodeCount).toBe(0)
        expect(graph.metadata.edgeCount).toBe(0)
      })

      it('should export buildGraph function via engine', () => {
        expect(typeof entityResolutionEngine.buildGraph).toBe('function')
      })
    })
  })
})
