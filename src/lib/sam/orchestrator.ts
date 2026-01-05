/**
 * S.A.M. (Systematic Adversarial Methodology) Orchestrator
 *
 * Coordinates the four-phase analysis:
 * 1. ANCHOR - Identify false premise origin points
 * 2. INHERIT - Track claim propagation without verification
 * 3. COMPOUND - Document authority accumulation
 * 4. ARRIVE - Map catastrophic outcomes to false premises
 */

import { supabaseAdmin } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import {
  type SAMPhase,
  type SAMStatus,
  type SAMAnalysis,
  type PhaseContext,
  type PhaseResults,
  type SAMOrchestratorConfig,
  PHASE_TRANSITIONS,
  PHASE_STATUS_MAP,
  type ANCHORResult,
  type INHERITResult,
  type COMPOUNDResult,
  type ARRIVEResult
} from './types'

import { executeANCHOR } from './phases/anchor'
import { executeINHERIT } from './phases/inherit'
import { executeCOMPOUND } from './phases/compound'
import { executeARRIVE } from './phases/arrive'

const PHASES: SAMPhase[] = ['anchor', 'inherit', 'compound', 'arrive']

export class SAMOrchestrator {
  private config: SAMOrchestratorConfig
  private analysisId: string | null = null
  private results: PhaseResults = {}

  constructor(config: SAMOrchestratorConfig) {
    this.config = config
  }

  /**
   * Initialize a new S.A.M. analysis run
   */
  async initialize(): Promise<string> {
    const { data, error } = await supabaseAdmin
      .from('sam_analyses')
      .insert({
        case_id: this.config.caseId,
        status: 'pending' as SAMStatus,
        document_ids: this.config.documentIds,
        focus_claims: this.config.focusClaims || []
      })
      .select('id')
      .single()

    if (error || !data) {
      throw new Error(`Failed to create S.A.M. analysis: ${error?.message}`)
    }

    this.analysisId = data.id
    logger.info(`S.A.M. analysis initialized: ${this.analysisId}`)
    return data.id
  }

  /**
   * Execute the full S.A.M. analysis pipeline
   */
  async execute(): Promise<PhaseResults> {
    if (!this.analysisId) {
      await this.initialize()
    }

    const context = await this.buildContext()

    for (const phase of PHASES) {
      // Check if we should stop after a specific phase
      if (this.config.stopAfterPhase) {
        const stopIndex = PHASES.indexOf(this.config.stopAfterPhase)
        const currentIndex = PHASES.indexOf(phase)
        if (currentIndex > stopIndex) {
          logger.info(`Stopping after ${this.config.stopAfterPhase} phase`)
          break
        }
      }

      try {
        await this.executePhase(phase, context)
      } catch (error) {
        await this.handlePhaseError(phase, error as Error)
        throw error
      }
    }

    // Mark as completed if we finished all phases
    if (!this.config.stopAfterPhase) {
      await this.updateStatus('completed')
      await this.updateSummary()
    }

    return this.results
  }

  /**
   * Execute a single phase
   */
  private async executePhase(phase: SAMPhase, context: PhaseContext): Promise<void> {
    const statusMap = PHASE_STATUS_MAP[phase]

    // Update status to running
    await this.updateStatus(statusMap.running)
    await this.updatePhaseTimestamp(phase, 'started')
    this.config.onPhaseStart?.(phase)

    logger.info(`Starting ${phase.toUpperCase()} phase for analysis ${this.analysisId}`)

    let result: ANCHORResult | INHERITResult | COMPOUNDResult | ARRIVEResult

    switch (phase) {
      case 'anchor':
        result = await executeANCHOR(context)
        this.results.anchor = result
        break
      case 'inherit':
        result = await executeINHERIT(context, this.results)
        this.results.inherit = result
        break
      case 'compound':
        result = await executeCOMPOUND(context, this.results)
        this.results.compound = result
        break
      case 'arrive':
        result = await executeARRIVE(context, this.results)
        this.results.arrive = result
        break
    }

    // Update status to complete
    await this.updateStatus(statusMap.complete)
    await this.updatePhaseTimestamp(phase, 'completed')
    this.config.onPhaseComplete?.(phase, result)

    logger.info(`Completed ${phase.toUpperCase()} phase for analysis ${this.analysisId}`)
  }

  /**
   * Build execution context from database
   */
  private async buildContext(): Promise<PhaseContext> {
    const { caseId, documentIds, focusClaims } = this.config

    // Fetch documents
    const { data: documents } = await supabaseAdmin
      .from('documents')
      .select('*')
      .in('id', documentIds)

    // Fetch existing claims for the case
    const { data: claims } = await supabaseAdmin
      .from('claims')
      .select('*')
      .eq('case_id', caseId)

    // Fetch entities
    const { data: entities } = await supabaseAdmin
      .from('entities')
      .select('*')
      .eq('case_id', caseId)

    return {
      analysisId: this.analysisId!,
      caseId,
      documents: documents || [],
      claims: claims || [],
      entities: entities || [],
      focusClaims
    }
  }

  /**
   * Update analysis status
   */
  private async updateStatus(status: SAMStatus): Promise<void> {
    if (!this.analysisId) return

    await supabaseAdmin
      .from('sam_analyses')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', this.analysisId)
  }

  /**
   * Update phase timestamp
   */
  private async updatePhaseTimestamp(
    phase: SAMPhase,
    type: 'started' | 'completed'
  ): Promise<void> {
    if (!this.analysisId) return

    const field = `${phase}_${type}_at`
    await supabaseAdmin
      .from('sam_analyses')
      .update({ [field]: new Date().toISOString() })
      .eq('id', this.analysisId)
  }

  /**
   * Update summary statistics
   */
  private async updateSummary(): Promise<void> {
    if (!this.analysisId) return

    const summary = {
      false_premises_found: this.results.anchor?.false_premises.length || 0,
      propagation_chains_found: this.results.inherit?.chains_found || 0,
      authority_accumulations_found: this.results.compound?.authority_markers.length || 0,
      outcomes_linked: this.results.arrive?.outcomes.length || 0
    }

    await supabaseAdmin
      .from('sam_analyses')
      .update(summary)
      .eq('id', this.analysisId)
  }

  /**
   * Handle phase execution error
   */
  private async handlePhaseError(phase: SAMPhase, error: Error): Promise<void> {
    logger.error(`S.A.M. ${phase} phase failed: ${error.message}`)
    this.config.onError?.(phase, error)

    if (this.analysisId) {
      await supabaseAdmin
        .from('sam_analyses')
        .update({
          status: 'failed' as SAMStatus,
          error_message: error.message,
          error_phase: phase
        })
        .eq('id', this.analysisId)
    }
  }

  /**
   * Get current analysis status
   */
  async getStatus(): Promise<SAMAnalysis | null> {
    if (!this.analysisId) return null

    const { data } = await supabaseAdmin
      .from('sam_analyses')
      .select('*')
      .eq('id', this.analysisId)
      .single()

    return data
  }

  /**
   * Cancel the analysis
   */
  async cancel(): Promise<void> {
    if (!this.analysisId) return

    await supabaseAdmin
      .from('sam_analyses')
      .update({ status: 'cancelled' as SAMStatus })
      .eq('id', this.analysisId)

    logger.info(`S.A.M. analysis cancelled: ${this.analysisId}`)
  }
}

/**
 * Factory function to create and run a S.A.M. analysis
 */
export async function runSAMAnalysis(
  config: SAMOrchestratorConfig
): Promise<{ analysisId: string; results: PhaseResults }> {
  const orchestrator = new SAMOrchestrator(config)
  const analysisId = await orchestrator.initialize()
  const results = await orchestrator.execute()
  return { analysisId, results }
}

/**
 * Resume a failed or cancelled analysis
 */
export async function resumeSAMAnalysis(
  analysisId: string
): Promise<PhaseResults> {
  const { data: analysis } = await supabaseAdmin
    .from('sam_analyses')
    .select('*')
    .eq('id', analysisId)
    .single()

  if (!analysis) {
    throw new Error(`Analysis not found: ${analysisId}`)
  }

  // Determine which phase to resume from
  let resumeFromPhase: SAMPhase = 'anchor'
  if (analysis.anchor_completed_at && !analysis.inherit_completed_at) {
    resumeFromPhase = 'inherit'
  } else if (analysis.inherit_completed_at && !analysis.compound_completed_at) {
    resumeFromPhase = 'compound'
  } else if (analysis.compound_completed_at && !analysis.arrive_completed_at) {
    resumeFromPhase = 'arrive'
  }

  logger.info(`Resuming S.A.M. analysis ${analysisId} from ${resumeFromPhase} phase`)

  const orchestrator = new SAMOrchestrator({
    caseId: analysis.case_id,
    documentIds: analysis.document_ids,
    focusClaims: analysis.focus_claims
  })

  // Set the analysis ID to resume
  ;(orchestrator as any).analysisId = analysisId

  return orchestrator.execute()
}

export { PHASES, PHASE_TRANSITIONS, PHASE_STATUS_MAP }
