/**
 * Phronesis FCIP - React Query Hooks
 *
 * Data fetching and mutation hooks using the unified data layer.
 * Automatically routes to Tauri (desktop) or Supabase (web).
 *
 * This file now re-exports from domain-specific modules for better organization.
 */

// Re-export all hooks from domain-specific modules
export * from './use-cases'
export * from './use-documents'
export * from './use-analysis'
export * from './use-search'
