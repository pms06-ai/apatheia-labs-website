/**
 * Shared Constants
 *
 * Centralized location for constants used across the application.
 */

import type { EngineSelection, Severity } from '@/CONTRACT'

// ============================================
// Engine Selection Defaults
// ============================================

/**
 * Default engine selection with all engines enabled
 */
export const DEFAULT_ENGINE_SELECTION: EngineSelection = {
  sam: true,
  contradiction: true,
  omission: true,
  temporal: true,
  entity: true,
  bias: true,
  professional: true,
  expert: true,
  accountability: true,
  narrative: true,
  documentary: true,
}

/**
 * Quick scan engine selection (core findings only)
 */
export const QUICK_ENGINE_SELECTION: EngineSelection = {
  sam: false,
  contradiction: true,
  omission: true,
  temporal: true,
  entity: true,
  bias: false,
  professional: false,
  expert: false,
  accountability: false,
  narrative: false,
  documentary: false,
}

// ============================================
// Engine Labels
// ============================================

/**
 * Human-readable labels for engines
 */
export const ENGINE_LABELS: Record<keyof EngineSelection, string> = {
  sam: 'S.A.M.',
  contradiction: 'Contradictions',
  omission: 'Omissions',
  temporal: 'Timeline',
  entity: 'Entities',
  bias: 'Bias',
  professional: 'Professional',
  expert: 'Expert',
  accountability: 'Accountability',
  narrative: 'Narrative',
  documentary: 'Documentary',
}

// ============================================
// Severity Configuration
// ============================================

/**
 * Severity color mappings for charts and UI
 */
export const SEVERITY_COLORS: Record<Severity | 'info', string> = {
  critical: '#dc2626', // red-600
  high: '#ea580c', // orange-600
  medium: '#ca8a04', // yellow-600
  low: '#16a34a', // green-600
  info: '#6b7280', // gray-500
}

/**
 * Severity order for sorting (highest to lowest)
 */
export const SEVERITY_ORDER: (Severity | 'info')[] = ['critical', 'high', 'medium', 'low', 'info']

// ============================================
// Category Configuration
// ============================================

/**
 * Category metadata for investigation results
 */
export const CATEGORY_CONFIG: Record<
  string,
  { label: string; color: string; icon: string }
> = {
  temporal_parser: { label: 'Timeline Anomalies', color: '#8b5cf6', icon: 'Clock' },
  entity_resolution: { label: 'Entity Issues', color: '#06b6d4', icon: 'Users' },
  contradiction: { label: 'Contradictions', color: '#ef4444', icon: 'XCircle' },
  omission: { label: 'Omissions', color: '#f97316', icon: 'EyeOff' },
  bias: { label: 'Bias Patterns', color: '#eab308', icon: 'Scale' },
  professional: { label: 'Professional Conduct', color: '#22c55e', icon: 'Briefcase' },
  expert: { label: 'Expert Issues', color: '#3b82f6', icon: 'Award' },
  accountability: { label: 'Accountability', color: '#ec4899', icon: 'Shield' },
  narrative: { label: 'Narrative Evolution', color: '#a855f7', icon: 'GitBranch' },
  documentary: { label: 'Media Analysis', color: '#14b8a6', icon: 'FileText' },
  sam: { label: 'S.A.M. Findings', color: '#b8860b', icon: 'Target' },
}

// ============================================
// Chart Colors
// ============================================

/**
 * Bronze-themed color palette for charts
 */
export const BRONZE_PALETTE = [
  '#b8860b', // bronze primary
  '#d4a574', // bronze light
  '#8b6914', // bronze dark
  '#c9a227', // gold
  '#a67c52', // copper
  '#cd853f', // peru
  '#daa520', // goldenrod
  '#b87333', // copper dark
]

/**
 * Chart colors for categories (consistent with CATEGORY_CONFIG)
 */
export const CHART_COLORS = [
  '#ef4444', // contradiction
  '#f97316', // omission
  '#eab308', // bias
  '#22c55e', // professional
  '#3b82f6', // expert
  '#8b5cf6', // temporal
  '#06b6d4', // entity
  '#ec4899', // accountability
  '#a855f7', // narrative
  '#14b8a6', // documentary
  '#b8860b', // sam
]
