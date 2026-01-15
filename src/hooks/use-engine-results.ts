/**
 * Hooks for fetching engine-specific analysis results
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isDesktop } from '@/lib/tauri'
import {
  runContradictionEngine,
  runBiasEngine,
  runTemporalEngine,
  runOmissionEngine,
  runEntityEngine,
  runAccountabilityEngine,
  runProfessionalEngine,
  runArgumentationEngine,
  runDocumentaryEngine,
  runNarrativeEngine,
  runExpertEngine,
} from '@/lib/tauri/commands'
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
} from '@/CONTRACT'
import type { EngineResultData } from '@/components/analysis/engine-results'

// Type map for engine results
type EngineResultMap = {
  contradiction: ContradictionEngineResult
  bias_detection: BiasEngineResult
  temporal_parser: TemporalEngineResult
  omission: OmissionEngineResult
  entity_resolution: EntityEngineResult
  accountability: AccountabilityEngineResult
  professional_tracker: ProfessionalEngineResult
  argumentation: ArgumentationEngineResult
  documentary: DocumentaryEngineResult
  narrative: NarrativeEngineResult
  expert_witness: ExpertEngineResult
}

type SupportedEngine = keyof EngineResultMap

/**
 * Hook to run a specific native engine and get typed results
 */
export function useRunNativeEngine<T extends SupportedEngine>(engineType: T) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      caseId,
      documentIds,
    }: {
      caseId: string
      documentIds: string[]
    }): Promise<EngineResultMap[T]> => {
      if (!isDesktop()) {
        throw new Error('Native engines only available in desktop mode')
      }

      switch (engineType) {
        case 'contradiction':
          return runContradictionEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'bias_detection':
          return runBiasEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'temporal_parser':
          return runTemporalEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'omission':
          return runOmissionEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'entity_resolution':
          return runEntityEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'accountability':
          return runAccountabilityEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'professional_tracker':
          return runProfessionalEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'argumentation':
          return runArgumentationEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'documentary':
          return runDocumentaryEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'narrative':
          return runNarrativeEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        case 'expert_witness':
          return runExpertEngine(caseId, documentIds) as Promise<EngineResultMap[T]>
        default:
          throw new Error(`Unsupported engine type: ${engineType}`)
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate findings to refresh list view
      queryClient.invalidateQueries({ queryKey: ['findings', variables.caseId] })
      queryClient.invalidateQueries({ queryKey: ['engineResult', engineType, variables.caseId] })
    },
  })
}

/**
 * Convert engine result to unified EngineResultData type for the router
 */
export function toEngineResultData(
  engine: Engine,
  result: unknown
): EngineResultData | undefined {
  switch (engine) {
    case 'contradiction':
      return { type: 'contradiction', result: result as ContradictionEngineResult }
    case 'bias_detection':
      return { type: 'bias_detection', result: result as BiasEngineResult }
    case 'temporal_parser':
      return { type: 'temporal_parser', result: result as TemporalEngineResult }
    case 'omission':
      return { type: 'omission', result: result as OmissionEngineResult }
    case 'entity_resolution':
      return { type: 'entity_resolution', result: result as EntityEngineResult }
    case 'accountability':
      return { type: 'accountability', result: result as AccountabilityEngineResult }
    case 'professional_tracker':
      return { type: 'professional_tracker', result: result as ProfessionalEngineResult }
    case 'argumentation':
      return { type: 'argumentation', result: result as ArgumentationEngineResult }
    case 'documentary':
      return { type: 'documentary', result: result as DocumentaryEngineResult }
    case 'narrative':
      return { type: 'narrative', result: result as NarrativeEngineResult }
    case 'expert_witness':
      return { type: 'expert_witness', result: result as ExpertEngineResult }
    default:
      return undefined
  }
}

/**
 * Check if an engine has native support for specialized results
 */
export function isNativeEngine(engine: Engine): engine is SupportedEngine {
  return [
    'contradiction',
    'bias_detection',
    'temporal_parser',
    'omission',
    'entity_resolution',
    'accountability',
    'professional_tracker',
    'argumentation',
    'documentary',
    'narrative',
    'expert_witness',
  ].includes(engine)
}

/**
 * Get the native engine runner function for an engine type
 */
export function getNativeEngineRunner(engine: Engine) {
  const runners: Partial<Record<Engine, (caseId: string, documentIds: string[]) => Promise<unknown>>> = {
    contradiction: runContradictionEngine,
    bias_detection: runBiasEngine,
    temporal_parser: runTemporalEngine,
    omission: runOmissionEngine,
    entity_resolution: runEntityEngine,
    accountability: runAccountabilityEngine,
    professional_tracker: runProfessionalEngine,
    argumentation: runArgumentationEngine,
    documentary: runDocumentaryEngine,
    narrative: runNarrativeEngine,
    expert_witness: runExpertEngine,
  }
  return runners[engine]
}
