'use client'

import { AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { Finding } from '@/types'
import { PremiumFindingCard } from './premium-finding-card'

interface FindingsListProps {
  findings: Finding[]
  onSelect?: (finding: Finding) => void
}

export function FindingsList({ findings, onSelect }: FindingsListProps) {
  if (findings.length === 0) {
    return (
      <Card className="p-8 text-center bg-charcoal-800/50 border-charcoal-700">
        <AlertTriangle className="mx-auto h-10 w-10 text-bronze-500/50" />
        <p className="mt-4 text-sm text-charcoal-300 font-display">No findings detected yet</p>
        <p className="mt-1 text-xs text-charcoal-500 font-mono">
          Run an analysis engine to generate forensic reports
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-1 pl-4 md:pl-6 border-l border-dashed border-charcoal-700/30 ml-2">
      <div className="absolute top-0 bottom-0 left-[27px] w-px bg-transparent" /> {/* Spacer */}
      {findings.map((finding) => (
        <PremiumFindingCard
          key={finding.id}
          finding={finding}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

