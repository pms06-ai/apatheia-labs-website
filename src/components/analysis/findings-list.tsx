'use client'

import { useCallback } from 'react'
import { Search } from 'lucide-react'
import { VirtualList, VIRTUALIZATION_THRESHOLD } from '@/components/ui/virtual-list'
import { EmptyState } from '@/components/ui/empty-state'
import type { Finding } from '@/CONTRACT'
import { PremiumFindingCard } from './premium-finding-card'

interface FindingsListProps {
  findings: Finding[]
  onSelect?: (finding: Finding) => void
}

// Estimated height of a collapsed finding card (header + padding + margins)
const FINDING_CARD_ESTIMATED_HEIGHT = 150

export function FindingsList({ findings, onSelect }: FindingsListProps) {
  const renderFinding = useCallback(
    (finding: Finding) => <PremiumFindingCard finding={finding} onSelect={onSelect} />,
    [onSelect]
  )

  const getItemKey = useCallback((finding: Finding) => finding.id, [])

  if (findings.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-10 w-10" />}
        title="No findings detected yet"
        description="Run an analysis engine to generate forensic reports"
        className="rounded-lg border border-charcoal-700 bg-charcoal-800/50"
      />
    )
  }

  // Use virtualization for large lists to improve performance
  if (findings.length > VIRTUALIZATION_THRESHOLD) {
    return (
      <div className="relative pl-4 md:pl-6 border-l border-dashed border-charcoal-700/30 ml-2">
        <div className="absolute top-0 bottom-0 left-[27px] w-px bg-transparent" />
        <VirtualList
          items={findings}
          estimateSize={FINDING_CARD_ESTIMATED_HEIGHT}
          renderItem={renderFinding}
          getItemKey={getItemKey}
          className="h-[600px]"
          overscan={3}
        />
      </div>
    )
  }

  // Standard rendering for smaller lists
  return (
    <div className="space-y-1 pl-4 md:pl-6 border-l border-dashed border-charcoal-700/30 ml-2">
      <div className="absolute top-0 bottom-0 left-[27px] w-px bg-transparent" />
      {findings.map(finding => (
        <PremiumFindingCard key={finding.id} finding={finding} onSelect={onSelect} />
      ))}
    </div>
  )
}

