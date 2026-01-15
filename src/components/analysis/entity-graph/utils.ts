import type { EntityGraphNode } from './types'
import type { NativeEntityType } from '@/CONTRACT'

/**
 * Color mapping for entity types
 * Works with both TypeScript engine types and native backend types
 */
export const NODE_COLORS: Record<string, string> = {
  // TypeScript engine types
  professional: '#D4A017',
  person: '#4A90E2',
  organization: '#8B6B5A',
  court: '#6B5A8B',
  // Native backend types (additional)
  police: '#5B7A9A',
  agency: '#8B6B5A',
  expert: '#5A8B7A',
  media: '#7A5B9A',
  location: '#6B7280',
  document_ref: '#6B7280',
  other: '#6B7280',
}

export function getNodeColor(type: EntityGraphNode['type'] | NativeEntityType): string {
  return NODE_COLORS[type] || '#6B7280'
}

export function getNodeTypeAbbr(type: EntityGraphNode['type'] | NativeEntityType): string {
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

export function getEdgeColor(confidence: number): { stroke: string; opacity: number } {
  if (confidence >= 0.8) {
    return { stroke: '#D4A017', opacity: 0.7 }
  }
  if (confidence >= 0.5) {
    return { stroke: '#F59E0B', opacity: 0.5 }
  }
  return { stroke: '#6B7280', opacity: 0.3 }
}

export function getEntityTypeBadgeVariant(
  type: EntityGraphNode['type']
): 'info' | 'high' | 'medium' | 'critical' {
  switch (type) {
    case 'professional':
      return 'high'
    case 'person':
      return 'info'
    case 'organization':
      return 'medium'
    case 'court':
      return 'critical'
    default:
      return 'info'
  }
}

export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}
