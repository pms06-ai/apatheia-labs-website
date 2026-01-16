/**
 * NETWORK ANALYSIS ENGINE (Ν)
 * "Relationship Mapping"
 *
 * Analyzes relationships and connections between entities across documents.
 * Builds network graphs showing communication patterns, power dynamics,
 * and hidden relationships that may indicate coordination or influence.
 *
 * Core Question: Who is connected to whom and how?
 *
 * Status: PLANNED - Stub implementation
 */

import type { Document } from '@/CONTRACT'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A relationship between two entities
 */
export interface NetworkRelationship {
  /** Source entity ID */
  sourceId: string
  /** Source entity name */
  sourceName: string
  /** Target entity ID */
  targetId: string
  /** Target entity name */
  targetName: string
  /** Type of relationship */
  relationshipType:
    | 'communication'
    | 'supervision'
    | 'collaboration'
    | 'referral'
    | 'family'
    | 'professional'
    | 'unknown'
  /** Strength of relationship (0-1) */
  strength: number
  /** Direction of relationship */
  direction: 'unidirectional' | 'bidirectional'
  /** Evidence supporting this relationship */
  evidence: {
    documentId: string
    excerpt: string
    pageNumber?: number
  }[]
}

/**
 * A cluster of connected entities
 */
export interface NetworkCluster {
  /** Cluster ID */
  id: string
  /** Cluster name/label */
  name: string
  /** Entity IDs in this cluster */
  entityIds: string[]
  /** Central entity (most connected) */
  centralEntity: string
  /** Density of connections (0-1) */
  density: number
  /** Type of cluster */
  clusterType: 'institutional' | 'family' | 'professional' | 'mixed'
}

/**
 * Power/influence metrics for an entity
 */
export interface NetworkInfluence {
  /** Entity ID */
  entityId: string
  /** Entity name */
  entityName: string
  /** Centrality score (0-1) */
  centrality: number
  /** Number of direct connections */
  degree: number
  /** Betweenness (how often on shortest paths) */
  betweenness: number
  /** Whether this entity bridges clusters */
  isBridge: boolean
}

/**
 * Network analysis result
 */
export interface NetworkAnalysisResult {
  /** Case ID */
  caseId: string
  /** All relationships found */
  relationships: NetworkRelationship[]
  /** Identified clusters */
  clusters: NetworkCluster[]
  /** Influence metrics per entity */
  influences: NetworkInfluence[]
  /** Graph statistics */
  statistics: {
    totalEntities: number
    totalRelationships: number
    avgDegree: number
    density: number
    clusterCount: number
  }
  /** Anomalies detected */
  anomalies: {
    type: 'isolated_entity' | 'unexpected_connection' | 'hidden_bridge'
    description: string
    entityIds: string[]
    severity: 'low' | 'medium' | 'high'
  }[]
  /** Timestamp */
  analyzedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/** Relationship indicator patterns */
const RELATIONSHIP_PATTERNS: Record<NetworkRelationship['relationshipType'], string[]> = {
  communication: [
    'contacted',
    'emailed',
    'called',
    'spoke with',
    'met with',
    'discussed',
    'informed',
    'notified',
    'wrote to',
    'replied',
    'responded',
  ],
  supervision: [
    'supervised',
    'managed',
    'overseen by',
    'reports to',
    'line manager',
    'team leader',
    'senior',
    'junior',
    'under',
    'directed by',
  ],
  collaboration: [
    'worked with',
    'collaborated',
    'partnered',
    'joint',
    'together',
    'alongside',
    'cooperation',
    'shared',
    'co-authored',
  ],
  referral: [
    'referred',
    'referred to',
    'referred by',
    'recommended',
    'sent to',
    'directed to',
    'forwarded',
    'passed to',
  ],
  family: [
    'mother',
    'father',
    'parent',
    'child',
    'sibling',
    'brother',
    'sister',
    'grandmother',
    'grandfather',
    'aunt',
    'uncle',
    'cousin',
    'spouse',
    'husband',
    'wife',
    'partner',
    'relative',
  ],
  professional: [
    'colleague',
    'client',
    'patient',
    'solicitor',
    'barrister',
    'expert',
    'witness',
    'assessor',
    'officer',
    'worker',
    'therapist',
  ],
  unknown: [],
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function generateId(): string {
  return `net-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function extractEntities(text: string): Array<{ name: string; type: 'person' | 'organization' }> {
  const entities: Array<{ name: string; type: 'person' | 'organization' }> = []

  // Extract person names (two+ capitalized words)
  const personNames = text.match(/\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g) || []
  personNames.forEach(name => {
    if (!entities.some(e => e.name === name)) {
      entities.push({ name, type: 'person' })
    }
  })

  // Extract organizations (capitalized words with common suffixes or patterns)
  const orgPatterns = [
    /\b[A-Z][a-zA-Z]+\s+(?:Council|Authority|Service|Services|Trust|NHS|Police|Court)\b/g,
    /\b(?:CAFCASS|NHS|DWP|LA|CPS)\b/g,
  ]
  for (const pattern of orgPatterns) {
    const orgs = text.match(pattern) || []
    orgs.forEach(org => {
      if (!entities.some(e => e.name === org)) {
        entities.push({ name: org, type: 'organization' })
      }
    })
  }

  return entities
}

function detectRelationshipType(context: string): NetworkRelationship['relationshipType'] {
  const lower = context.toLowerCase()

  for (const [type, patterns] of Object.entries(RELATIONSHIP_PATTERNS) as Array<
    [NetworkRelationship['relationshipType'], string[]]
  >) {
    if (patterns.some(p => lower.includes(p))) {
      return type
    }
  }

  return 'unknown'
}

function findCoOccurrences(
  text: string,
  entities: Array<{ name: string; type: 'person' | 'organization' }>
): Array<{ entity1: string; entity2: string; context: string }> {
  const coOccurrences: Array<{ entity1: string; entity2: string; context: string }> = []
  const sentences = text.split(/[.!?]+/)

  for (const sentence of sentences) {
    const presentEntities = entities.filter(e => sentence.includes(e.name))

    // Create pairs from entities in same sentence
    for (let i = 0; i < presentEntities.length; i++) {
      for (let j = i + 1; j < presentEntities.length; j++) {
        coOccurrences.push({
          entity1: presentEntities[i].name,
          entity2: presentEntities[j].name,
          context: sentence.trim().slice(0, 150),
        })
      }
    }
  }

  return coOccurrences
}

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

export const networkEngine = {
  /**
   * Analyze network relationships across documents
   * Builds relationship graphs and identifies clusters and influence
   * @param documents - Documents to analyze
   * @param caseId - Case ID
   * @returns Network analysis result
   */
  async analyzeNetwork(documents: Document[], caseId: string): Promise<NetworkAnalysisResult> {
    if (documents.length === 0) {
      return {
        caseId,
        relationships: [],
        clusters: [],
        influences: [],
        statistics: {
          totalEntities: 0,
          totalRelationships: 0,
          avgDegree: 0,
          density: 0,
          clusterCount: 0,
        },
        anomalies: [],
        analyzedAt: new Date().toISOString(),
      }
    }

    // Extract all entities from documents
    const allEntities: Array<{ name: string; type: 'person' | 'organization' }> = []
    for (const doc of documents) {
      const entities = extractEntities(doc.extracted_text || '')
      entities.forEach(e => {
        if (!allEntities.some(ae => ae.name === e.name)) {
          allEntities.push(e)
        }
      })
    }

    // Build relationship graph
    const relationships = await this.buildRelationshipGraph(
      documents,
      allEntities.map(e => e.name)
    )

    // Detect clusters
    const clusters = await this.detectClusters(relationships)

    // Calculate influence metrics
    const influences = await this.calculateInfluence(relationships)

    // Detect anomalies
    const anomalies = this.detectAnomalies(allEntities, relationships, clusters)

    // Calculate statistics
    const totalEntities = allEntities.length
    const totalRelationships = relationships.length
    const avgDegree = totalEntities > 0 ? (totalRelationships * 2) / totalEntities : 0
    const maxPossibleEdges = (totalEntities * (totalEntities - 1)) / 2
    const density = maxPossibleEdges > 0 ? totalRelationships / maxPossibleEdges : 0

    return {
      caseId,
      relationships,
      clusters,
      influences,
      statistics: {
        totalEntities,
        totalRelationships,
        avgDegree,
        density,
        clusterCount: clusters.length,
      },
      anomalies,
      analyzedAt: new Date().toISOString(),
    }
  },

  /**
   * Build relationship graph from document text
   */
  async buildRelationshipGraph(
    documents: Document[],
    entityNames: string[]
  ): Promise<NetworkRelationship[]> {
    const relationshipMap = new Map<string, NetworkRelationship>()

    // Create entity lookup
    const entities: Array<{ name: string; type: 'person' | 'organization' }> = entityNames.map(
      name => ({
        name,
        type: (name.match(/Council|Authority|Service|NHS|Police|Court/i)
          ? 'organization'
          : 'person') as 'person' | 'organization',
      })
    )

    for (const doc of documents) {
      const text = doc.extracted_text || ''
      const coOccurrences = findCoOccurrences(text, entities)

      for (const { entity1, entity2, context } of coOccurrences) {
        const key = [entity1, entity2].sort().join('|||')
        const relationshipType = detectRelationshipType(context)

        if (relationshipMap.has(key)) {
          // Update existing relationship
          const existing = relationshipMap.get(key)!
          existing.strength = Math.min(1, existing.strength + 0.1)
          existing.evidence.push({
            documentId: doc.id,
            excerpt: context,
            pageNumber: undefined,
          })
        } else {
          // Create new relationship
          const newRelationship: NetworkRelationship = {
            sourceId: entity1.toLowerCase().replace(/\s+/g, '-'),
            sourceName: entity1,
            targetId: entity2.toLowerCase().replace(/\s+/g, '-'),
            targetName: entity2,
            relationshipType,
            strength: 0.5,
            direction: 'bidirectional',
            evidence: [
              {
                documentId: doc.id,
                excerpt: context,
                pageNumber: undefined,
              },
            ],
          }
          relationshipMap.set(key, newRelationship)
        }
      }
    }

    return Array.from(relationshipMap.values())
  },

  /**
   * Detect clusters using simple connected component analysis
   */
  async detectClusters(relationships: NetworkRelationship[]): Promise<NetworkCluster[]> {
    const clusters: NetworkCluster[] = []

    // Build adjacency map
    const adjacency = new Map<string, Set<string>>()
    for (const rel of relationships) {
      if (!adjacency.has(rel.sourceId)) adjacency.set(rel.sourceId, new Set())
      if (!adjacency.has(rel.targetId)) adjacency.set(rel.targetId, new Set())
      adjacency.get(rel.sourceId)!.add(rel.targetId)
      adjacency.get(rel.targetId)!.add(rel.sourceId)
    }

    // Find connected components
    const visited = new Set<string>()
    const entityNames = new Map<string, string>()
    relationships.forEach(r => {
      entityNames.set(r.sourceId, r.sourceName)
      entityNames.set(r.targetId, r.targetName)
    })

    for (const entityId of adjacency.keys()) {
      if (visited.has(entityId)) continue

      // BFS to find connected component
      const component: string[] = []
      const queue = [entityId]

      while (queue.length > 0) {
        const current = queue.shift()!
        if (visited.has(current)) continue
        visited.add(current)
        component.push(current)

        const neighbors = adjacency.get(current) || new Set()
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            queue.push(neighbor)
          }
        }
      }

      if (component.length >= 2) {
        // Find central entity (most connections)
        let centralEntity = component[0]
        let maxConnections = 0
        for (const id of component) {
          const connections = (adjacency.get(id) || new Set()).size
          if (connections > maxConnections) {
            maxConnections = connections
            centralEntity = id
          }
        }

        // Calculate density
        const possibleEdges = (component.length * (component.length - 1)) / 2
        const actualEdges = relationships.filter(
          r => component.includes(r.sourceId) && component.includes(r.targetId)
        ).length
        const density = possibleEdges > 0 ? actualEdges / possibleEdges : 0

        // Determine cluster type
        const hasFamily = relationships.some(
          r =>
            component.includes(r.sourceId) &&
            component.includes(r.targetId) &&
            r.relationshipType === 'family'
        )
        const hasInstitutional = relationships.some(
          r =>
            component.includes(r.sourceId) &&
            component.includes(r.targetId) &&
            (r.relationshipType === 'supervision' || r.relationshipType === 'professional')
        )

        const clusterType = hasFamily ? 'family' : hasInstitutional ? 'institutional' : 'mixed'

        clusters.push({
          id: generateId(),
          name: `${entityNames.get(centralEntity) || centralEntity} cluster`,
          entityIds: component,
          centralEntity,
          density,
          clusterType,
        })
      }
    }

    return clusters
  },

  /**
   * Calculate influence metrics for each entity
   */
  async calculateInfluence(relationships: NetworkRelationship[]): Promise<NetworkInfluence[]> {
    const influences: NetworkInfluence[] = []

    // Build degree counts
    const degrees = new Map<string, number>()
    const names = new Map<string, string>()

    for (const rel of relationships) {
      degrees.set(rel.sourceId, (degrees.get(rel.sourceId) || 0) + 1)
      degrees.set(rel.targetId, (degrees.get(rel.targetId) || 0) + 1)
      names.set(rel.sourceId, rel.sourceName)
      names.set(rel.targetId, rel.targetName)
    }

    const maxDegree = Math.max(...Array.from(degrees.values()), 1)

    // Calculate betweenness (simplified - based on unique connections)
    const uniquePartners = new Map<string, Set<string>>()
    for (const rel of relationships) {
      if (!uniquePartners.has(rel.sourceId)) uniquePartners.set(rel.sourceId, new Set())
      if (!uniquePartners.has(rel.targetId)) uniquePartners.set(rel.targetId, new Set())
      uniquePartners.get(rel.sourceId)!.add(rel.targetId)
      uniquePartners.get(rel.targetId)!.add(rel.sourceId)
    }

    // Identify bridges (entities connecting otherwise separate groups)
    const bridges = new Set<string>()
    for (const [entityId, partners] of uniquePartners) {
      const partnersArray = Array.from(partners)
      // Check if partners are connected to each other
      let disconnectedPairs = 0
      for (let i = 0; i < partnersArray.length; i++) {
        for (let j = i + 1; j < partnersArray.length; j++) {
          const p1Partners = uniquePartners.get(partnersArray[i]) || new Set()
          if (!p1Partners.has(partnersArray[j])) {
            disconnectedPairs++
          }
        }
      }
      if (disconnectedPairs > partners.size / 2) {
        bridges.add(entityId)
      }
    }

    for (const [entityId, degree] of degrees) {
      const centrality = degree / maxDegree
      const betweenness = bridges.has(entityId) ? 0.8 : centrality * 0.5

      influences.push({
        entityId,
        entityName: names.get(entityId) || entityId,
        centrality,
        degree,
        betweenness,
        isBridge: bridges.has(entityId),
      })
    }

    // Sort by centrality
    return influences.sort((a, b) => b.centrality - a.centrality)
  },

  /**
   * Detect network anomalies
   */
  detectAnomalies(
    entities: Array<{ name: string; type: 'person' | 'organization' }>,
    relationships: NetworkRelationship[],
    clusters: NetworkCluster[]
  ): NetworkAnalysisResult['anomalies'] {
    const anomalies: NetworkAnalysisResult['anomalies'] = []

    // Find isolated entities (mentioned but no relationships)
    const connectedIds = new Set(relationships.flatMap(r => [r.sourceId, r.targetId]))
    const isolatedEntities = entities.filter(
      e => !connectedIds.has(e.name.toLowerCase().replace(/\s+/g, '-'))
    )

    if (isolatedEntities.length > 0) {
      anomalies.push({
        type: 'isolated_entity',
        description: `${isolatedEntities.length} entities mentioned but not connected to others`,
        entityIds: isolatedEntities.map(e => e.name.toLowerCase().replace(/\s+/g, '-')),
        severity: isolatedEntities.length > 3 ? 'medium' : 'low',
      })
    }

    // Find unexpected connections (cross-cluster relationships)
    for (const rel of relationships) {
      const sourceCluster = clusters.find(c => c.entityIds.includes(rel.sourceId))
      const targetCluster = clusters.find(c => c.entityIds.includes(rel.targetId))

      if (sourceCluster && targetCluster && sourceCluster.id !== targetCluster.id) {
        // Cross-cluster connection
        if (sourceCluster.clusterType !== targetCluster.clusterType) {
          anomalies.push({
            type: 'unexpected_connection',
            description: `Connection between ${sourceCluster.clusterType} and ${targetCluster.clusterType} clusters: ${rel.sourceName} - ${rel.targetName}`,
            entityIds: [rel.sourceId, rel.targetId],
            severity: 'medium',
          })
        }
      }
    }

    // Find hidden bridges (high betweenness, low degree)
    const influences = relationships.length > 0 ? this.calculateInfluenceSync(relationships) : []
    const hiddenBridges = influences.filter(i => i.isBridge && i.degree <= 3)
    if (hiddenBridges.length > 0) {
      anomalies.push({
        type: 'hidden_bridge',
        description: `${hiddenBridges.length} entities serve as hidden bridges between groups`,
        entityIds: hiddenBridges.map(i => i.entityId),
        severity: 'high',
      })
    }

    return anomalies
  },

  /**
   * Synchronous influence calculation for anomaly detection
   */
  calculateInfluenceSync(relationships: NetworkRelationship[]): NetworkInfluence[] {
    const degrees = new Map<string, number>()
    const names = new Map<string, string>()

    for (const rel of relationships) {
      degrees.set(rel.sourceId, (degrees.get(rel.sourceId) || 0) + 1)
      degrees.set(rel.targetId, (degrees.get(rel.targetId) || 0) + 1)
      names.set(rel.sourceId, rel.sourceName)
      names.set(rel.targetId, rel.targetName)
    }

    const maxDegree = Math.max(...Array.from(degrees.values()), 1)
    const uniquePartners = new Map<string, Set<string>>()

    for (const rel of relationships) {
      if (!uniquePartners.has(rel.sourceId)) uniquePartners.set(rel.sourceId, new Set())
      if (!uniquePartners.has(rel.targetId)) uniquePartners.set(rel.targetId, new Set())
      uniquePartners.get(rel.sourceId)!.add(rel.targetId)
      uniquePartners.get(rel.targetId)!.add(rel.sourceId)
    }

    const bridges = new Set<string>()
    for (const [entityId, partners] of uniquePartners) {
      const partnersArray = Array.from(partners)
      let disconnectedPairs = 0
      for (let i = 0; i < partnersArray.length; i++) {
        for (let j = i + 1; j < partnersArray.length; j++) {
          const p1Partners = uniquePartners.get(partnersArray[i]) || new Set()
          if (!p1Partners.has(partnersArray[j])) {
            disconnectedPairs++
          }
        }
      }
      if (disconnectedPairs > partners.size / 2) {
        bridges.add(entityId)
      }
    }

    const influences: NetworkInfluence[] = []
    for (const [entityId, degree] of degrees) {
      const centrality = degree / maxDegree
      influences.push({
        entityId,
        entityName: names.get(entityId) || entityId,
        centrality,
        degree,
        betweenness: bridges.has(entityId) ? 0.8 : centrality * 0.5,
        isBridge: bridges.has(entityId),
      })
    }

    return influences
  },
}

export default networkEngine
