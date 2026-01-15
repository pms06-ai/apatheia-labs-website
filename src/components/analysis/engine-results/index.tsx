'use client'

import { Search } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import type {
  Engine,
  ContradictionEngineResult,
  BiasEngineResult,
  TemporalEngineResult,
  OmissionEngineResult,
  EntityEngineResult,
  AccountabilityEngineResult,
  ProfessionalEngineResult,
  ArgumentationEngineResult,
  DocumentaryEngineResult,
  NarrativeEngineResult,
  ExpertEngineResult,
  Finding,
} from '@/CONTRACT'

// Export individual components
export { ContradictionResults } from './contradiction-results'
export { BiasResults } from './bias-results'
export { TemporalResults } from './temporal-results'
export { OmissionResults } from './omission-results'
export { EntityResults } from './entity-results'

// Import components for router
import { ContradictionResults } from './contradiction-results'
import { BiasResults } from './bias-results'
import { TemporalResults } from './temporal-results'
import { OmissionResults } from './omission-results'
import { EntityResults } from './entity-results'

/**
 * Union type for all engine results
 */
export type EngineResultData =
  | { type: 'contradiction'; result: ContradictionEngineResult }
  | { type: 'bias_detection'; result: BiasEngineResult }
  | { type: 'temporal_parser'; result: TemporalEngineResult }
  | { type: 'omission'; result: OmissionEngineResult }
  | { type: 'entity_resolution'; result: EntityEngineResult }
  | { type: 'accountability'; result: AccountabilityEngineResult }
  | { type: 'professional_tracker'; result: ProfessionalEngineResult }
  | { type: 'argumentation'; result: ArgumentationEngineResult }
  | { type: 'documentary'; result: DocumentaryEngineResult }
  | { type: 'narrative'; result: NarrativeEngineResult }
  | { type: 'expert_witness'; result: ExpertEngineResult }

interface EngineResultsRouterProps {
  /**
   * The engine type to render results for
   */
  engine: Engine
  /**
   * Engine-specific result data from the backend
   */
  engineResult?: EngineResultData
  /**
   * Generic findings to display if no specialized view is available
   */
  findings?: Finding[]
  /**
   * Optional className for the container
   */
  className?: string
}

/**
 * Router component that picks the appropriate engine-specific result view
 * based on the engine type. Falls back to generic findings list for engines
 * without specialized views.
 */
export function EngineResultsRouter({
  engine,
  engineResult,
  findings = [],
  className,
}: EngineResultsRouterProps) {
  // If we have typed engine result data, use specialized views
  if (engineResult) {
    switch (engineResult.type) {
      case 'contradiction':
        return <ContradictionResults result={engineResult.result} />

      case 'bias_detection':
        return <BiasResults result={engineResult.result} />

      case 'temporal_parser':
        return <TemporalResults result={engineResult.result} />

      case 'omission':
        return <OmissionResults result={engineResult.result} />

      case 'entity_resolution':
        return <EntityResults result={engineResult.result} />

      // TODO: Add specialized views for these engines
      case 'accountability':
      case 'professional_tracker':
      case 'argumentation':
      case 'documentary':
      case 'narrative':
      case 'expert_witness':
        // Fall through to generic view
        break
    }
  }

  // Fallback: use engine type to determine if we should show empty state
  // or a message about generic findings
  if (findings.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-12 w-12" />}
        title="No Results Available"
        description={`Run the ${engine.replace(/_/g, ' ')} engine on selected documents to generate analysis results.`}
        className={className}
      />
    )
  }

  // For engines without specialized views, show a message directing to list view
  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="rounded-lg border border-charcoal-700 bg-charcoal-800/50 p-6">
          <p className="text-sm text-charcoal-300">
            {findings.length} finding{findings.length === 1 ? '' : 's'} available.
          </p>
          <p className="mt-2 text-xs text-charcoal-500">
            Switch to the List view for detailed findings.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Helper to check if an engine has a specialized result view
 */
export function hasSpecializedView(engine: Engine): boolean {
  return [
    'contradiction',
    'bias_detection',
    'temporal_parser',
    'omission',
    'entity_resolution',
  ].includes(engine)
}

/**
 * Get the recommended view tab for an engine
 */
export function getRecommendedView(engine: Engine): 'list' | 'engine' | 'timeline' | 'network' | 'entities' {
  switch (engine) {
    case 'contradiction':
    case 'bias_detection':
    case 'omission':
      return 'engine'

    case 'temporal_parser':
    case 'narrative':
      return 'timeline'

    case 'coordination':
      return 'network'

    case 'entity_resolution':
      return 'entities'

    default:
      return 'list'
  }
}
