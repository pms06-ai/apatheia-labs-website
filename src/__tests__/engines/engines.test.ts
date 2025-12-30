/**
 * ENGINE TESTS
 * 
 * Tests for FCIP analysis engines registry and utilities.
 */

import { describe, it, expect } from '@jest/globals'
import { createMockDocument, createMockCase } from '../setup'

describe('Engine Registry', () => {
  it('should export ENGINE_REGISTRY with all engines', async () => {
    const { ENGINE_REGISTRY } = await import('@/lib/engines')

    expect(ENGINE_REGISTRY).toBeDefined()
    expect(Object.keys(ENGINE_REGISTRY)).toContain('omission')
    expect(Object.keys(ENGINE_REGISTRY)).toContain('contradiction')
    expect(Object.keys(ENGINE_REGISTRY)).toContain('narrative')
    expect(Object.keys(ENGINE_REGISTRY)).toContain('expert_witness')
    expect(Object.keys(ENGINE_REGISTRY)).toContain('coordination')
  })

  it('should have metadata for each engine', async () => {
    const { ENGINE_REGISTRY } = await import('@/lib/engines')

    const omission = ENGINE_REGISTRY.omission
    expect(omission.id).toBe('omission')
    expect(omission.name).toBe('Omission Detection')
    expect(omission.greek).toBe('Ο')
    expect(omission.tagline).toBe('What Was Left Out')
    expect(omission.description).toBeDefined()
    expect(omission.status).toBe('active')
  })

  it('should return active engines', async () => {
    const { getActiveEngines } = await import('@/lib/engines')

    const active = getActiveEngines()
    expect(active.length).toBeGreaterThan(0)
    expect(active.every(e => e.status === 'active')).toBe(true)
  })

  it('should return new v6.0 engines', async () => {
    const { getNewEngines } = await import('@/lib/engines')

    const newEngines = getNewEngines()
    expect(newEngines.length).toBeGreaterThan(0)
    expect(newEngines.every(e => e.priority !== null)).toBe(true)
  })
})

describe('Engine Utilities', () => {
  it('should define runEngine function', async () => {
    const { runEngine } = await import('@/lib/engines')
    expect(typeof runEngine).toBe('function')
  })

  it('should define runEngines function', async () => {
    const { runEngines } = await import('@/lib/engines')
    expect(typeof runEngines).toBe('function')
  })

  it('should define getEngine function', async () => {
    const { getEngine } = await import('@/lib/engines')
    expect(typeof getEngine).toBe('function')

    const omission = getEngine('omission')
    expect(omission).toBeDefined()
    expect(omission.id).toBe('omission')
  })
})

describe('Mock Utilities', () => {
  it('should create mock documents', () => {
    const doc = createMockDocument({ id: 'custom-id' })
    expect(doc.id).toBe('custom-id')
    expect(doc.filename).toBeDefined()
    expect(doc.case_id).toBeDefined()
  })

  it('should create mock cases', () => {
    const caseData = createMockCase({ reference: 'TEST-001' })
    expect(caseData.reference).toBe('TEST-001')
    expect(caseData.id).toBeDefined()
    expect(caseData.name).toBeDefined()
  })
})
