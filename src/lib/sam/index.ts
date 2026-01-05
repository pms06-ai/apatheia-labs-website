/**
 * S.A.M. (Systematic Adversarial Methodology) Module
 *
 * Forensic analysis framework for tracing how false premises
 * propagate through institutional documents and lead to
 * catastrophic outcomes.
 *
 * Four-phase methodology:
 * 1. ANCHOR - Identify false premise origin points
 * 2. INHERIT - Track claim propagation without verification
 * 3. COMPOUND - Document authority accumulation
 * 4. ARRIVE - Map catastrophic outcomes to false premises
 */

// Orchestrator
export {
  SAMOrchestrator,
  runSAMAnalysis,
  resumeSAMAnalysis,
  PHASES,
  PHASE_TRANSITIONS,
  PHASE_STATUS_MAP
} from './orchestrator'

// Phase implementations
export { executeANCHOR } from './phases/anchor'
export { executeINHERIT } from './phases/inherit'
export { executeCOMPOUND } from './phases/compound'
export { executeARRIVE } from './phases/arrive'

// Types
export type {
  SAMPhase,
  SAMStatus,
  SAMAnalysis,
  PhaseContext,
  PhaseResults,
  SAMOrchestratorConfig,
  ClaimOrigin,
  ClaimPropagation,
  AuthorityMarker,
  SAMOutcome,
  ANCHORResult,
  INHERITResult,
  COMPOUNDResult,
  ARRIVEResult
} from './types'
