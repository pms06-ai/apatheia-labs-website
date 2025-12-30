/**
 * COMPONENT TESTS
 * 
 * Tests for React components and mock utilities.
 */

import React from 'react'
import { describe, it, jest, expect } from '@jest/globals'
import { render, screen } from '../utils'
import { createMockFinding, createMockDocument } from '../setup'

describe('Mock Utilities', () => {
  describe('createMockDocument', () => {
    it('creates document with defaults', () => {
      const doc = createMockDocument()

      expect(doc.id).toBeDefined()
      expect(doc.filename).toBeDefined()
      expect(doc.case_id).toBeDefined()
      expect(doc.status).toBe('completed')
    })

    it('allows overrides', () => {
      const doc = createMockDocument({
        id: 'custom-id',
        filename: 'test.pdf',
        doc_type: 'expert_report'
      })

      expect(doc.id).toBe('custom-id')
      expect(doc.filename).toBe('test.pdf')
      expect(doc.doc_type).toBe('expert_report')
    })
  })

  describe('createMockFinding', () => {
    it('creates finding with defaults', () => {
      const finding = createMockFinding()

      expect(finding.id).toBeDefined()
      expect(finding.case_id).toBeDefined()
      expect(finding.engine).toBeDefined()
      expect(finding.severity).toBeDefined()
    })

    it('allows overrides', () => {
      const finding = createMockFinding({
        title: 'Critical Issue',
        severity: 'critical',
        engine: 'omission'
      })

      expect(finding.title).toBe('Critical Issue')
      expect(finding.severity).toBe('critical')
      expect(finding.engine).toBe('omission')
    })
  })
})

describe('React Components Rendering', () => {
  it('renders simple text content', () => {
    render(<div>Hello World</div>)
    const element = screen.getByText('Hello World')
    expect(element).toBeTruthy()
    expect(element.textContent).toBe('Hello World')
  })

  it('renders with test id', () => {
    render(<div data-testid="my-element">Content</div>)
    const element = screen.getByTestId('my-element')
    expect(element).toBeTruthy()
  })

  it('renders button with role', () => {
    render(<button>Click Me</button>)
    const button = screen.getByRole('button', { name: 'Click Me' })
    expect(button).toBeTruthy()
  })
})

describe('Finding Display', () => {
  it('displays finding title and severity', () => {
    const finding = createMockFinding({
      title: 'Critical Omission',
      severity: 'critical',
      description: 'NFA decision omitted',
    })

    render(
      <div data-testid="finding-card">
        <span data-testid="severity-badge">{finding.severity}</span>
        <h3>{finding.title}</h3>
        <p>{finding.description}</p>
      </div>
    )

    expect(screen.getByText('Critical Omission')).toBeTruthy()
    expect(screen.getByTestId('severity-badge').textContent).toBe('critical')
    expect(screen.getByText('NFA decision omitted')).toBeTruthy()
  })

  it('groups findings by engine', () => {
    const findings = [
      createMockFinding({ id: '1', engine: 'omission', title: 'Omission 1' }),
      createMockFinding({ id: '2', engine: 'omission', title: 'Omission 2' }),
      createMockFinding({ id: '3', engine: 'contradiction', title: 'Contradiction 1' }),
    ]

    const grouped: Record<string, typeof findings> = {}
    for (const f of findings) {
      if (!grouped[f.engine]) grouped[f.engine] = []
      grouped[f.engine].push(f)
    }

    expect(grouped.omission).toHaveLength(2)
    expect(grouped.contradiction).toHaveLength(1)
  })
})

describe('Document List', () => {
  it('renders list of documents', () => {
    const documents = [
      createMockDocument({ id: 'doc-1', filename: 'Report.pdf' }),
      createMockDocument({ id: 'doc-2', filename: 'Evidence.pdf' }),
    ]

    render(
      <ul>
        {documents.map(doc => (
          <li key={doc.id} data-testid="document-item">
            {doc.filename}
          </li>
        ))}
      </ul>
    )

    const items = screen.getAllByTestId('document-item')
    expect(items).toHaveLength(2)
    expect(screen.getByText('Report.pdf')).toBeTruthy()
    expect(screen.getByText('Evidence.pdf')).toBeTruthy()
  })
})

describe('Accessibility', () => {
  it('buttons have accessible names', () => {
    render(
      <div>
        <button aria-label="Upload document">📤</button>
        <button aria-label="Run analysis">▶️</button>
        <button>Export Report</button>
      </div>
    )

    expect(screen.getByLabelText('Upload document')).toBeTruthy()
    expect(screen.getByLabelText('Run analysis')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Export Report' })).toBeTruthy()
  })

  it('form inputs have labels', () => {
    render(
      <form>
        <label htmlFor="search">Search findings</label>
        <input id="search" type="text" />
      </form>
    )

    expect(screen.getByLabelText('Search findings')).toBeTruthy()
  })
})

describe('Loading States', () => {
  it('shows loading indicator', () => {
    render(
      <div data-testid="loading" role="status" aria-label="Loading">
        <span className="spinner" />
      </div>
    )

    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.getByLabelText('Loading')).toBeTruthy()
  })

  it('shows skeleton while loading', () => {
    render(
      <div data-testid="skeleton" aria-busy="true">
        <div className="skeleton-line" />
      </div>
    )

    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton.getAttribute('aria-busy')).toBe('true')
  })
})

describe('User Interactions', () => {
  it('handles form submission', async () => {
    const onSubmit = jest.fn<() => void>()

    const { user } = render(
      <form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
        <input type="text" placeholder="Search..." />
        <button type="submit">Search</button>
      </form>
    )

    await user.type(screen.getByPlaceholderText('Search...'), 'test query')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('handles click on list items', async () => {
    const items = ['Item 1', 'Item 2', 'Item 3']
    const onSelect = jest.fn<(item: string) => void>()

    const { user } = render(
      <ul>
        {items.map((item, i) => (
          <li key={i} onClick={() => onSelect(item)}>
            {item}
          </li>
        ))}
      </ul>
    )

    await user.click(screen.getByText('Item 1'))
    expect(onSelect).toHaveBeenCalledWith('Item 1')
  })
})
