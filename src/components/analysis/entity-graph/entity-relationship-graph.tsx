'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import type {
  NativeResolvedEntity,
  NativeEntityType,
  NativeEntityRelationship,
  EntityEngineResult,
} from '@/CONTRACT'

// ============================================
// TYPES
// ============================================

interface GraphNode {
  id: string
  name: string
  type: NativeEntityType
  role: string
  mentionCount: number
  aliases: string[]
  documentIds: string[]
  relationships: NativeEntityRelationship[]
  // Force simulation properties
  x: number
  y: number
  vx: number
  vy: number
  fx?: number // Fixed x position (when dragging)
  fy?: number // Fixed y position (when dragging)
}

interface GraphEdge {
  id: string
  source: string
  target: string
  type: string
  confidence: string
  evidence: string
}

interface EntityRelationshipGraphProps {
  result: EntityEngineResult
  width?: number
  height?: number
  selectedNodeId?: string | null
  onNodeSelect?: (entity: NativeResolvedEntity | null) => void
  filterTypes?: NativeEntityType[]
}

// ============================================
// COLOR UTILITIES
// ============================================

const NODE_COLORS: Record<NativeEntityType, string> = {
  person: '#4A90E2',
  organization: '#8B6B5A',
  professional: '#D4A017',
  court: '#6B5A8B',
  police: '#5B7A9A',
  agency: '#8B6B5A',
  expert: '#5A8B7A',
  media: '#7A5B9A',
  location: '#6B7280',
  document_ref: '#6B7280',
  other: '#6B7280',
}

const getNodeColor = (type: NativeEntityType): string => {
  return NODE_COLORS[type] || '#6B7280'
}

const getEdgeColor = (confidence: string): { stroke: string; opacity: number } => {
  switch (confidence) {
    case 'definite':
      return { stroke: '#D4A017', opacity: 0.9 }
    case 'high':
      return { stroke: '#D4A017', opacity: 0.7 }
    case 'medium':
      return { stroke: '#F59E0B', opacity: 0.5 }
    case 'low':
      return { stroke: '#6B7280', opacity: 0.4 }
    case 'speculative':
      return { stroke: '#6B7280', opacity: 0.25 }
    default:
      return { stroke: '#6B7280', opacity: 0.3 }
  }
}

const getNodeTypeAbbr = (type: NativeEntityType): string => {
  switch (type) {
    case 'professional':
      return 'PR'
    case 'person':
      return 'PE'
    case 'organization':
      return 'OR'
    case 'court':
      return 'CT'
    case 'police':
      return 'PO'
    case 'agency':
      return 'AG'
    case 'expert':
      return 'EX'
    case 'media':
      return 'MD'
    case 'location':
      return 'LC'
    case 'document_ref':
      return 'DC'
    default:
      return '??'
  }
}

// ============================================
// FORCE SIMULATION
// ============================================

const SIMULATION_CONFIG = {
  centerForce: 0.03,
  repelForce: 2000,
  linkForce: 0.02,
  linkDistance: 120,
  friction: 0.9,
  maxVelocity: 8,
  iterations: 100,
}

function initializeNodes(
  entities: NativeResolvedEntity[],
  width: number,
  height: number
): GraphNode[] {
  const centerX = width / 2
  const centerY = height / 2

  return entities.map((entity, i) => {
    // Distribute nodes in a circular pattern initially
    const angle = (i / entities.length) * 2 * Math.PI
    const radius = Math.min(width, height) * 0.3

    return {
      id: entity.id,
      name: entity.canonical_name,
      type: entity.entity_type,
      role: entity.role,
      mentionCount: entity.mention_count,
      aliases: entity.aliases.map(a => a.name),
      documentIds: entity.documents_mentioned,
      relationships: entity.relationships,
      x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
      y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
      vx: 0,
      vy: 0,
    }
  })
}

function buildEdges(entities: NativeResolvedEntity[]): GraphEdge[] {
  const edges: GraphEdge[] = []
  const seenEdges = new Set<string>()

  for (const entity of entities) {
    for (const rel of entity.relationships) {
      // Create unique edge key (bidirectional)
      const edgeKey = [entity.id, rel.target_entity_id].sort().join('-')

      if (!seenEdges.has(edgeKey)) {
        seenEdges.add(edgeKey)
        edges.push({
          id: rel.id,
          source: entity.id,
          target: rel.target_entity_id,
          type: rel.relationship_type,
          confidence: rel.confidence,
          evidence: rel.evidence,
        })
      }
    }
  }

  return edges
}

function runSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  width: number,
  height: number
): GraphNode[] {
  const nodeMap = new Map(nodes.map(n => [n.id, { ...n }]))
  const centerX = width / 2
  const centerY = height / 2

  for (let iter = 0; iter < SIMULATION_CONFIG.iterations; iter++) {
    // Apply forces
    for (const node of nodeMap.values()) {
      if (node.fx !== undefined && node.fy !== undefined) continue

      let fx = 0
      let fy = 0

      // Center gravity
      fx += (centerX - node.x) * SIMULATION_CONFIG.centerForce
      fy += (centerY - node.y) * SIMULATION_CONFIG.centerForce

      // Node repulsion
      for (const other of nodeMap.values()) {
        if (other.id === node.id) continue

        const dx = node.x - other.x
        const dy = node.y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = SIMULATION_CONFIG.repelForce / (dist * dist)

        fx += (dx / dist) * force
        fy += (dy / dist) * force
      }

      // Link attraction
      for (const edge of edges) {
        let other: GraphNode | undefined

        if (edge.source === node.id) {
          other = nodeMap.get(edge.target)
        } else if (edge.target === node.id) {
          other = nodeMap.get(edge.source)
        }

        if (other) {
          const dx = other.x - node.x
          const dy = other.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (dist - SIMULATION_CONFIG.linkDistance) * SIMULATION_CONFIG.linkForce

          fx += (dx / dist) * force
          fy += (dy / dist) * force
        }
      }

      // Update velocity
      node.vx = (node.vx + fx) * SIMULATION_CONFIG.friction
      node.vy = (node.vy + fy) * SIMULATION_CONFIG.friction

      // Clamp velocity
      const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy)
      if (speed > SIMULATION_CONFIG.maxVelocity) {
        node.vx = (node.vx / speed) * SIMULATION_CONFIG.maxVelocity
        node.vy = (node.vy / speed) * SIMULATION_CONFIG.maxVelocity
      }

      // Update position
      node.x += node.vx
      node.y += node.vy

      // Keep within bounds
      const padding = 60
      node.x = Math.max(padding, Math.min(width - padding, node.x))
      node.y = Math.max(padding, Math.min(height - padding, node.y))
    }
  }

  return Array.from(nodeMap.values())
}

// ============================================
// COMPONENT
// ============================================

export function EntityRelationshipGraph({
  result,
  width = 800,
  height = 600,
  selectedNodeId,
  onNodeSelect,
  filterTypes,
}: EntityRelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [nodeOverrides, setNodeOverrides] = useState<{
    graphKey: string
    positions: Map<string, { x: number; y: number; fx?: number; fy?: number }>
  }>({ graphKey: '', positions: new Map() })

  // Filter entities based on filterTypes
  const filteredEntities = useMemo(() => {
    if (!result.success || !result.analysis) return []

    let entities = result.analysis.entities

    if (filterTypes && filterTypes.length > 0) {
      entities = entities.filter(e => filterTypes.includes(e.entity_type))
    }

    return entities
  }, [result, filterTypes])

  const graphKey = useMemo(
    () => filteredEntities.map(entity => entity.id).join('|'),
    [filteredEntities]
  )

  const baseGraph = useMemo(() => {
    if (filteredEntities.length === 0) {
      return { nodes: [], edges: [] }
    }

    const initialNodes = initializeNodes(filteredEntities, width, height)
    const graphEdges = buildEdges(filteredEntities)

    // Run force simulation
    const simulatedNodes = runSimulation(initialNodes, graphEdges, width, height)

    return { nodes: simulatedNodes, edges: graphEdges }
  }, [filteredEntities, width, height])

  const activeOverrides = nodeOverrides.graphKey === graphKey ? nodeOverrides.positions : null

  const nodes = useMemo(() => {
    if (!activeOverrides || activeOverrides.size === 0) {
      return baseGraph.nodes
    }
    return baseGraph.nodes.map(node => {
      const override = activeOverrides.get(node.id)
      return override ? { ...node, ...override } : node
    })
  }, [baseGraph.nodes, activeOverrides])

  const edges = baseGraph.edges

  const updateNodeOverride = useCallback(
    (nodeId: string, update: { x?: number; y?: number; fx?: number; fy?: number }) => {
      setNodeOverrides(prev => {
        const positions = prev.graphKey === graphKey ? new Map(prev.positions) : new Map()
        const existing = positions.get(nodeId) ?? {}
        positions.set(nodeId, { ...existing, ...update })
        return { graphKey, positions }
      })
    },
    [graphKey]
  )

  // Handle node click
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (!onNodeSelect || !result.analysis) return

      const entity = result.analysis.entities.find(e => e.id === nodeId)
      if (selectedNodeId === nodeId) {
        onNodeSelect(null)
      } else {
        onNodeSelect(entity || null)
      }
    },
    [onNodeSelect, result, selectedNodeId]
  )

  // Handle dragging
  const handleMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(nodeId)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !svgRef.current) return

      const rect = svgRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - transform.x) / transform.scale
      const y = (e.clientY - rect.top - transform.y) / transform.scale

      updateNodeOverride(dragging, { x, y, fx: x, fy: y })
    },
    [dragging, transform, updateNodeOverride]
  )

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      updateNodeOverride(dragging, { fx: undefined, fy: undefined })
    }
    setDragging(null)
  }, [dragging, updateNodeOverride])

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale * delta)),
    }))
  }, [])

  // Handle pan
  const [panning, setPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as Element).closest('g.node')) return
    setPanning(true)
    setPanStart({ x: e.clientX, y: e.clientY })
  }, [])

  const handlePanMove = useCallback(
    (e: React.MouseEvent) => {
      if (!panning) return
      setTransform(prev => ({
        ...prev,
        x: prev.x + (e.clientX - panStart.x),
        y: prev.y + (e.clientY - panStart.y),
      }))
      setPanStart({ x: e.clientX, y: e.clientY })
    },
    [panning, panStart]
  )

  const handlePanEnd = useCallback(() => {
    setPanning(false)
  }, [])

  // Combined mouse handlers
  const handleMouseMoveWrapper = useCallback(
    (e: React.MouseEvent) => {
      if (dragging) {
        handleMouseMove(e)
      } else if (panning) {
        handlePanMove(e)
      }
    },
    [dragging, panning, handleMouseMove, handlePanMove]
  )

  const handleMouseUpWrapper = useCallback(() => {
    handleMouseUp()
    handlePanEnd()
  }, [handleMouseUp, handlePanEnd])

  // Reset view
  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [])

  // Build node map for edge rendering
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])

  if (!result.success || !result.analysis) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-charcoal-400">
          <p>{result.error || 'No entity data available'}</p>
        </div>
      </div>
    )
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-charcoal-400">
          <p>No entities match current filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-charcoal-700 bg-charcoal-900">
      {/* Controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(2, prev.scale * 1.2) }))}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal-600 bg-charcoal-800 text-charcoal-300 transition-colors hover:bg-charcoal-700 hover:text-charcoal-100"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() =>
            setTransform(prev => ({ ...prev, scale: Math.max(0.5, prev.scale * 0.8) }))
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal-600 bg-charcoal-800 text-charcoal-300 transition-colors hover:bg-charcoal-700 hover:text-charcoal-100"
          title="Zoom out"
        >
          -
        </button>
        <button
          onClick={resetView}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal-600 bg-charcoal-800 text-charcoal-300 transition-colors hover:bg-charcoal-700 hover:text-charcoal-100"
          title="Reset view"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="absolute left-4 top-4 z-10 flex gap-4 font-mono text-[10px] text-charcoal-500">
        <span>{nodes.length} entities</span>
        <span>{edges.length} relationships</span>
      </div>

      {/* SVG Graph */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handlePanStart}
        onMouseMove={handleMouseMoveWrapper}
        onMouseUp={handleMouseUpWrapper}
        onMouseLeave={handleMouseUpWrapper}
        onWheel={handleWheel}
      >
        <defs>
          {/* Edge gradients */}
          <linearGradient id="edgeGradientHigh" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B5563" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D4A017" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="edgeGradientMedium" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B5563" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="edgeGradientLow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4B5563" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#6B7280" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow filters */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="selectedGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="edgeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Edges */}
          <g className="edges">
            {edges.map(edge => {
              const sourceNode = nodeMap.get(edge.source)
              const targetNode = nodeMap.get(edge.target)

              if (!sourceNode || !targetNode) return null

              const edgeStyle = getEdgeColor(edge.confidence)
              const isHighConfidence = edge.confidence === 'high' || edge.confidence === 'definite'
              const isConnectedToSelected =
                selectedNodeId === edge.source || selectedNodeId === edge.target

              const gradientId = isHighConfidence
                ? 'url(#edgeGradientHigh)'
                : edge.confidence === 'low' || edge.confidence === 'speculative'
                  ? 'url(#edgeGradientLow)'
                  : 'url(#edgeGradientMedium)'

              const strokeWidth = isHighConfidence ? 3 : edge.confidence === 'medium' ? 2 : 1

              // Calculate label position
              const midX = (sourceNode.x + targetNode.x) / 2
              const midY = (sourceNode.y + targetNode.y) / 2

              return (
                <g key={edge.id} className="edge">
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={gradientId}
                    strokeWidth={isConnectedToSelected ? strokeWidth + 1 : strokeWidth}
                    strokeLinecap="round"
                    opacity={isConnectedToSelected ? 1 : edgeStyle.opacity}
                    filter={isHighConfidence ? 'url(#edgeGlow)' : undefined}
                  />

                  {/* Relationship type label */}
                  <g
                    className="pointer-events-none"
                    opacity={hoveredNode === edge.source || hoveredNode === edge.target ? 1 : 0.6}
                  >
                    <rect
                      x={midX - 30}
                      y={midY - 8}
                      width={60}
                      height={16}
                      rx={4}
                      fill="#1C1C1E"
                      stroke={edgeStyle.stroke}
                      strokeWidth={0.5}
                      opacity={0.9}
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fill={edgeStyle.stroke}
                      fontSize={8}
                      fontFamily="monospace"
                      className="uppercase"
                    >
                      {edge.type.replace(/_/g, ' ').slice(0, 12)}
                    </text>
                  </g>
                </g>
              )
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map(node => {
              const nodeColor = getNodeColor(node.type)
              const isSelected = selectedNodeId === node.id
              const isHovered = hoveredNode === node.id
              const isProfessional = node.type === 'professional'
              const isExpert = node.type === 'expert'
              const baseSize = 20
              const sizeBoost = Math.min(node.mentionCount * 1.5, 10)
              const nodeRadius = baseSize + sizeBoost

              return (
                <motion.g
                  key={node.id}
                  className="node cursor-pointer"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  onMouseDown={e => handleMouseDown(node.id, e)}
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer glow ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius + 6}
                    fill="transparent"
                    stroke={nodeColor}
                    strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
                    opacity={isSelected ? 0.7 : isHovered ? 0.5 : 0.25}
                    filter={
                      isSelected
                        ? 'url(#selectedGlow)'
                        : isProfessional || isExpert
                          ? 'url(#nodeGlow)'
                          : undefined
                    }
                  >
                    {(isSelected || isProfessional || isExpert) && (
                      <>
                        <animate
                          attributeName="r"
                          values={`${nodeRadius + 6};${nodeRadius + 10};${nodeRadius + 6}`}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values={isSelected ? '0.7;0.4;0.7' : '0.25;0.1;0.25'}
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </>
                    )}
                  </circle>

                  {/* Main node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={isSelected ? nodeColor : '#1C1C1E'}
                    stroke={nodeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-colors duration-200"
                  />

                  {/* Type abbreviation */}
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill={isSelected ? '#1C1C1E' : nodeColor}
                    fontSize={11}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="pointer-events-none uppercase"
                  >
                    {getNodeTypeAbbr(node.type)}
                  </text>

                  {/* Entity name */}
                  <text
                    x={node.x}
                    y={node.y + nodeRadius + 16}
                    textAnchor="middle"
                    fill="#E5E5E5"
                    fontSize={11}
                    fontWeight={500}
                    className="pointer-events-none"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    {node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name}
                  </text>

                  {/* Role badge */}
                  {node.role && node.role !== 'unknown' && (
                    <g>
                      <rect
                        x={node.x - 25}
                        y={node.y + nodeRadius + 22}
                        width={50}
                        height={14}
                        rx={3}
                        fill="#1C1C1E"
                        stroke={nodeColor}
                        strokeWidth={0.5}
                        opacity={0.85}
                      />
                      <text
                        x={node.x}
                        y={node.y + nodeRadius + 32}
                        textAnchor="middle"
                        fill={nodeColor}
                        fontSize={8}
                        fontWeight={500}
                        fontFamily="monospace"
                        className="pointer-events-none uppercase"
                      >
                        {node.role.replace(/_/g, ' ').slice(0, 10)}
                      </text>
                    </g>
                  )}

                  {/* Mention count badge */}
                  {node.mentionCount > 1 && (
                    <g>
                      <circle
                        cx={node.x + nodeRadius - 4}
                        cy={node.y - nodeRadius + 4}
                        r={9}
                        fill={nodeColor}
                        stroke="#1C1C1E"
                        strokeWidth={1.5}
                      />
                      <text
                        x={node.x + nodeRadius - 4}
                        y={node.y - nodeRadius + 7}
                        textAnchor="middle"
                        fill="#1C1C1E"
                        fontSize={8}
                        fontWeight={700}
                        fontFamily="monospace"
                        className="pointer-events-none"
                      >
                        {node.mentionCount}
                      </text>
                    </g>
                  )}
                </motion.g>
              )
            })}
          </g>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 px-4">
        {/* Confidence Legend */}
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-charcoal-400">
          <span className="text-charcoal-500">Confidence:</span>
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
            <div className="h-[3px] w-6 rounded-full bg-bronze-500 shadow-[0_0_6px_rgba(212,160,23,0.6)]" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
            <div className="h-[2px] w-6 rounded-full bg-status-high opacity-60" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
            <div className="h-[1px] w-6 rounded-full bg-charcoal-500 opacity-40" />
            <span>Low</span>
          </div>
        </div>

        {/* Entity Type Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-wider text-charcoal-400">
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-3 py-1 backdrop-blur-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: NODE_COLORS.professional }}
            />
            Professional
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-3 py-1 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NODE_COLORS.person }} />
            Person
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-3 py-1 backdrop-blur-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: NODE_COLORS.organization }}
            />
            Organization
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-3 py-1 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NODE_COLORS.court }} />
            Court
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-charcoal-700/50 bg-black/40 px-3 py-1 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: NODE_COLORS.expert }} />
            Expert
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntityRelationshipGraph
