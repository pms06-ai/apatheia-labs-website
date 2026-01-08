/**
 * FCIP Engine Registry - Metadata Only
 *
 * This file must be safe to import in Client Components.
 * DO NOT import any server-side logic or execution code here.
 *
 * Status as of 2026-01-07: 12 OPERATIONAL, 4 PLANNED
 */

export const ENGINE_REGISTRY = {
  // Core Engines (Operational)
  entity_resolution: {
    id: 'entity_resolution',
    name: 'Entity Resolution',
    greek: 'Ε',
    greekFull: 'ἔργον',
    tagline: 'Name/alias/pronoun → canonical ID',
    description: 'Resolves entity references across documents to canonical identities',
    keyQuestion: 'Who is actually being referred to?',
    priority: null,
    status: 'active',
  },
  temporal_parser: {
    id: 'temporal_parser',
    name: 'Temporal Parser',
    greek: 'Τ',
    greekFull: 'χρόνος',
    tagline: 'Deadlines, court calendars, working days',
    description: 'Parses and validates dates, deadlines, and temporal references',
    keyQuestion: 'Do the events align with the stated timeline?',
    priority: null,
    status: 'active',
  },
  argumentation: {
    id: 'argumentation',
    name: 'Argumentation',
    greek: 'Α',
    greekFull: 'ἐπιχείρημα',
    tagline: 'Toulmin structures + UK legal rules',
    description:
      'Analyzes argument structures using Toulmin model with UK legal framework integration',
    keyQuestion: 'Is the argument logically sound and supported?',
    priority: null,
    status: 'active',
  },
  bias_detection: {
    id: 'bias_detection',
    name: 'Bias Detection',
    greek: 'Β',
    greekFull: 'προκατάληψη',
    tagline: 'Statistical z-score analysis',
    description:
      'Detects systematic bias patterns using binomial tests, Fisher combined probability, and effect sizes',
    keyQuestion: 'Is there systematic bias against a party?',
    priority: null,
    status: 'active',
  },
  contradiction: {
    id: 'contradiction',
    name: 'Contradiction',
    greek: 'Κ',
    greekFull: 'ἀντίφασις',
    tagline: 'Claim comparison across documents',
    description: 'Identifies contradictory claims across document corpus',
    keyQuestion: 'Do statements contradict each other across documents?',
    priority: null,
    status: 'active',
  },
  accountability_audit: {
    id: 'accountability_audit',
    name: 'Accountability Audit',
    greek: 'Λ',
    greekFull: 'λογοδοσία',
    tagline: 'Statutory duty violations',
    description:
      'Audits compliance with statutory duties (Children Act, FPR, GDPR, Ofcom, HCPC) and maps breaches to remedies',
    keyQuestion: 'Did the authority follow statutory procedures?',
    priority: null,
    status: 'active',
  },
  professional_tracker: {
    id: 'professional_tracker',
    name: 'Professional Tracker',
    greek: 'Π',
    greekFull: 'πρόσωπον',
    tagline: 'Per-professional behavior patterns',
    description:
      'Tracks individual professional conduct across case history for HCPC/GMC referral support',
    keyQuestion: 'Is this professional behaving consistently?',
    priority: null,
    status: 'active',
  },

  // V6.0 Priority Engines (Operational)
  omission: {
    id: 'omission',
    name: 'Omission Detection',
    greek: 'Ο',
    greekFull: 'παράλειψις',
    tagline: 'What Was Left Out',
    description:
      'Identifies systematic gaps in professional reports by comparing source documents against reports',
    keyQuestion: 'Did omissions systematically favor one narrative?',
    priority: 1,
    status: 'active',
  },
  expert_witness: {
    id: 'expert_witness',
    name: 'Expert Witness',
    greek: 'Ξ',
    greekFull: 'ἐπιστήμη',
    tagline: 'Expertise Boundaries',
    description:
      'Evaluates expert reports for PD25B/CPR Part 35 compliance (UK) and scope exceedances',
    keyQuestion: 'Did the expert stay within their expertise boundaries?',
    priority: 2,
    status: 'active',
  },
  documentary: {
    id: 'documentary',
    name: 'Documentary Analysis',
    greek: 'Δ',
    greekFull: 'κριτική',
    tagline: 'Editorial Scrutiny',
    description:
      'Analyzes documentary evidence for editorial manipulation and Ofcom Broadcasting Code compliance',
    keyQuestion: 'Was evidence edited to support a particular narrative?',
    priority: 3,
    status: 'active',
  },
  narrative: {
    id: 'narrative',
    name: 'Narrative Evolution',
    greek: 'Μ',
    greekFull: 'μεταμόρφωσις',
    tagline: 'Story Drift',
    description: 'Tracks how claims mutate across documents over time',
    keyQuestion: 'Did the story drift consistently toward one conclusion?',
    priority: 4,
    status: 'active',
  },
  coordination: {
    id: 'coordination',
    name: 'Cross-Institutional',
    greek: 'Σ',
    greekFull: 'σύμπλεξις',
    tagline: 'Hidden Coordination',
    description:
      'Detects improper coordination between institutions that should operate independently',
    keyQuestion: 'Were "independent" sources actually independent?',
    priority: 5,
    status: 'active',
  },

  // Future Engines (Planned)
  network: {
    id: 'network',
    name: 'Network Analysis',
    greek: 'Ν',
    greekFull: 'δίκτυον',
    tagline: 'Relationship Mapping',
    description:
      'Analyzes relationships and connections between entities, identifying power dynamics and hidden influences',
    keyQuestion: 'Who is connected to whom and how?',
    priority: 6,
    status: 'planned',
  },
  memory: {
    id: 'memory',
    name: 'Institutional Memory',
    greek: 'Μν',
    greekFull: 'μνήμη',
    tagline: 'Record Gaps',
    description:
      'Tracks how information persists or disappears across institutional records, identifying selective memory',
    keyQuestion: 'What should have been recorded but was not?',
    priority: 7,
    status: 'planned',
  },
  linguistic: {
    id: 'linguistic',
    name: 'Linguistic Analysis',
    greek: 'Λγ',
    greekFull: 'λόγος',
    tagline: 'Language Patterns',
    description:
      'Analyzes hedging language, certainty markers, modal verbs, and sentiment to detect subtle bias',
    keyQuestion: 'How does language choice reveal bias or uncertainty?',
    priority: 8,
    status: 'planned',
  },
  bias_cascade: {
    id: 'bias_cascade',
    name: 'Bias Cascade',
    greek: 'Βκ',
    greekFull: 'καταρράκτης',
    tagline: 'Compounding Bias',
    description:
      'Tracks how initial biases compound through subsequent documents via anchor bias and confirmation bias',
    keyQuestion: 'How did early bias compound into systemic failure?',
    priority: 9,
    status: 'planned',
  },
} as const

export type EngineId = keyof typeof ENGINE_REGISTRY

/**
 * Get engine metadata
 */
export function getEngine(engineId: EngineId) {
  return ENGINE_REGISTRY[engineId]
}

/**
 * Get all active engines
 */
export function getActiveEngines() {
  return Object.values(ENGINE_REGISTRY).filter(e => e.status === 'active')
}

/**
 * Get new v6.0 engines (priority engines)
 */
export function getNewEngines() {
  return Object.values(ENGINE_REGISTRY).filter(e => e.priority !== null)
}

/**
 * Get engine count summary
 */
export function getEngineSummary() {
  const all = Object.values(ENGINE_REGISTRY)
  return {
    total: all.length,
    active: all.filter(e => e.status === 'active').length,
    v6Priority: all.filter(e => e.priority !== null).length,
    core: all.filter(e => e.priority === null).length,
  }
}
