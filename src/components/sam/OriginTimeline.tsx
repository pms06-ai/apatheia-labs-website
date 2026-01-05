'use client'

/**
 * OriginTimeline Component
 *
 * Visualizes ANCHOR phase results as a chronological timeline
 * showing claim origins with false premise highlighting.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, FileText, AlertTriangle, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ClaimOrigin, OriginType, FalsePremiseType } from '@/CONTRACT'

// ============================================
// Types
// ============================================

interface OriginTimelineProps {
  origins: ClaimOrigin[]
  onOriginClick?: (origin: ClaimOrigin) => void
  showFalsePremisesOnly?: boolean
  className?: string
}

// ============================================
// Constants
// ============================================

const ORIGIN_TYPE_CONFIG: Record<OriginType, { color: string; label: string }> = {
  primary_source: { color: 'status-success', label: 'Primary Source' },
  professional_opinion: { color: 'bronze-500', label: 'Professional Opinion' },
  hearsay: { color: 'charcoal-400', label: 'Hearsay' },
  speculation: { color: 'status-high', label: 'Speculation' },
  misattribution: { color: 'status-critical', label: 'Misattribution' },
  fabrication: { color: 'status-critical', label: 'Fabrication' },
}

const FALSE_PREMISE_LABELS: Record<FalsePremiseType, string> = {
  factual_error: 'Factual Error',
  misattribution: 'Misattribution',
  speculation_as_fact: 'Spec as Fact',
  context_stripping: 'Context Loss',
  selective_quotation: 'Cherry-picked',
  temporal_distortion: 'Timeline Error',
}

// ============================================
// Helper Functions
// ============================================

function getOriginTypeStyle(type: OriginType | null): { borderClass: string; dotClass: string } {
  if (!type) {
    return { borderClass: 'border-charcoal-600', dotClass: 'bg-charcoal-400' }
  }

  const config = ORIGIN_TYPE_CONFIG[type]
  return {
    borderClass: `border-${config.color}`,
    dotClass: `bg-${config.color}`,
  }
}

function getConfidenceRingWidth(score: number | null): string {
  if (!score) return 'ring-1'
  if (score >= 0.9) return 'ring-4'
  if (score >= 0.7) return 'ring-3'
  if (score >= 0.5) return 'ring-2'
  return 'ring-1'
}

// ============================================
// Sub-Components
// ============================================

interface OriginNodeProps {
  origin: ClaimOrigin
  index: number
  isExpanded: boolean
  onToggle: () => void
  onClick?: (origin: ClaimOrigin) => void
}

function OriginNode({ origin, index, isExpanded, onToggle, onClick }: OriginNodeProps) {
  const isFalsePremise = origin.is_false_premise
  const typeConfig = origin.origin_type ? ORIGIN_TYPE_CONFIG[origin.origin_type] : null
  const confidenceRing = getConfidenceRingWidth(origin.confidence_score)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative"
    >
      {/* Connector Node */}
      <div
        className={cn(
          'absolute -left-[29px] top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-bg-tertiary z-10',
          isFalsePremise
            ? 'border-status-critical shadow-[0_0_15px_rgba(201,74,74,0.4)]'
            : typeConfig
              ? `border-${typeConfig.color}`
              : 'border-charcoal-600',
          origin.confidence_score && origin.confidence_score >= 0.8 && !isFalsePremise
            ? `ring-${typeConfig?.color || 'charcoal-500'}/30 ${confidenceRing}`
            : ''
        )}
      >
        {/* Inner Dot */}
        <div
          className={cn(
            'h-2 w-2 rounded-full',
            isFalsePremise
              ? 'bg-status-critical animate-pulse'
              : typeConfig
                ? `bg-${typeConfig.color}`
                : 'bg-charcoal-400'
          )}
        />
      </div>

      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-300 border-charcoal-700',
          'hover:border-bronze-500/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]',
          isFalsePremise ? 'bg-status-critical-bg/5 border-status-critical/30' : 'bg-bg-elevated/40',
          onClick && 'cursor-pointer'
        )}
        onClick={() => onClick?.(origin)}
      >
        {/* Hover Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-bronze-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative p-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              {/* Date & Document */}
              <div className="flex items-center gap-3 flex-wrap">
                {origin.origin_date && (
                  <div className="flex items-center gap-2 text-xs font-mono text-bronze-500 bg-bronze-500/10 px-2 py-1 rounded">
                    <Calendar className="h-3 w-3" />
                    <time>
                      {new Date(origin.origin_date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                )}
                {origin.origin_page && (
                  <span className="text-xs text-charcoal-400 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Page {origin.origin_page}
                  </span>
                )}
              </div>

              {/* Origin Context */}
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  isFalsePremise ? 'text-charcoal-200' : 'text-charcoal-300'
                )}
              >
                {origin.origin_context}
              </p>
            </div>

            {/* Badges Column */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              {/* False Premise Badge */}
              {isFalsePremise && (
                <Badge variant="critical" className="shadow-lg flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  False Premise
                </Badge>
              )}

              {/* False Premise Type */}
              {origin.false_premise_type && (
                <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-status-critical/10 text-status-critical">
                  {FALSE_PREMISE_LABELS[origin.false_premise_type]}
                </span>
              )}

              {/* Origin Type */}
              {typeConfig && !isFalsePremise && (
                <span
                  className={cn(
                    'text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full',
                    `bg-${typeConfig.color}/10 text-${typeConfig.color}`
                  )}
                >
                  {typeConfig.label}
                </span>
              )}

              {/* Confidence Score */}
              {origin.confidence_score !== null && (
                <span className="text-xs text-charcoal-500">
                  {Math.round(origin.confidence_score * 100)}% conf
                </span>
              )}
            </div>
          </div>

          {/* Expandable Contradicting Evidence */}
          {origin.contradicting_evidence && (
            <div className="mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle()
                }}
                className="flex items-center gap-1 text-xs text-bronze-400 hover:text-bronze-300 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                Contradicting Evidence
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 p-3 rounded bg-charcoal-800/50 border border-charcoal-700 text-xs text-charcoal-300">
                      {origin.contradicting_evidence}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

// ============================================
// Main Component
// ============================================

export function OriginTimeline({
  origins,
  onOriginClick,
  showFalsePremisesOnly: initialFilter = false,
  className,
}: OriginTimelineProps) {
  const [filterFalsePremises, setFilterFalsePremises] = useState(initialFilter)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Filter and sort
  const filteredOrigins = origins
    .filter((o) => !filterFalsePremises || o.is_false_premise)
    .sort((a, b) => {
      if (!a.origin_date && !b.origin_date) return 0
      if (!a.origin_date) return 1
      if (!b.origin_date) return -1
      return new Date(a.origin_date).getTime() - new Date(b.origin_date).getTime()
    })

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const falsePremiseCount = origins.filter((o) => o.is_false_premise).length

  return (
    <div className={cn('', className)}>
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-ivory-100">Claim Origins</h3>
          <span className="text-xs text-charcoal-500">
            {filteredOrigins.length} of {origins.length}
          </span>
        </div>

        <button
          onClick={() => setFilterFalsePremises(!filterFalsePremises)}
          className={cn(
            'flex items-center gap-2 text-xs px-3 py-1.5 rounded transition-colors',
            filterFalsePremises
              ? 'bg-status-critical/20 text-status-critical'
              : 'bg-charcoal-800 text-charcoal-400 hover:text-charcoal-300'
          )}
        >
          <Filter className="h-3 w-3" />
          False Premises ({falsePremiseCount})
        </button>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6 pl-8 py-4">
        {/* Gradient Line */}
        <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-charcoal-700 via-bronze-500/50 to-charcoal-700" />

        {filteredOrigins.map((origin, index) => (
          <OriginNode
            key={origin.id}
            origin={origin}
            index={index}
            isExpanded={expandedIds.has(origin.id)}
            onToggle={() => toggleExpanded(origin.id)}
            onClick={onOriginClick}
          />
        ))}

        {filteredOrigins.length === 0 && (
          <div className="text-center text-charcoal-500 py-12 italic border-2 border-dashed border-charcoal-800 rounded-lg ml-4">
            {filterFalsePremises
              ? 'No false premises identified in ANCHOR analysis.'
              : 'No origins found. Run ANCHOR phase to populate this view.'}
          </div>
        )}
      </div>
    </div>
  )
}
