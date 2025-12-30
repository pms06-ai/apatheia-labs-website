/**
 * JEST TEST SETUP
 * 
 * Configures the test environment with:
 * - Testing Library matchers
 * - Mock implementations
 * - Global test utilities
 */

import '@testing-library/jest-dom'

// ============================================
// ENVIRONMENT MOCKS
// ============================================

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.GROQ_API_KEY = 'test-groq-key'
process.env.GOOGLE_AI_API_KEY = 'test-gemini-key'
process.env.R2_ACCESS_KEY_ID = 'test-r2-key'
process.env.R2_SECRET_ACCESS_KEY = 'test-r2-secret'
process.env.R2_BUCKET_NAME = 'test-bucket'
process.env.R2_ENDPOINT = 'https://test.r2.cloudflarestorage.com'

// ============================================
// FETCH MOCK
// ============================================

global.fetch = jest.fn()

beforeEach(() => {
  (global.fetch as jest.Mock).mockReset()
})

// ============================================
// SUPABASE MOCK
// ============================================

const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    then: jest.fn().mockResolvedValue({ data: [], error: null }),
  })),
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
      download: jest.fn().mockResolvedValue({ data: new Blob(), error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://test.url' } }),
    })),
  },
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

jest.mock('@/lib/supabase/server', () => ({
  createAdminClient: jest.fn(() => mockSupabaseClient),
  createServerSupabaseClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
  createServerClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
  supabaseAdmin: mockSupabaseClient,
}))

// ============================================
// AI SERVICE MOCKS
// ============================================

jest.mock('@/lib/groq', () => ({
  groq: {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock AI response' } }],
        }),
      },
    },
  },
  analyzeWithGroq: jest.fn().mockResolvedValue({ result: 'mock analysis' }),
}))

jest.mock('@/lib/gemini', () => ({
  analyzeWithGemini: jest.fn().mockResolvedValue({ result: 'mock analysis' }),
  geminiModel: {
    generateContent: jest.fn().mockResolvedValue({
      response: { text: () => 'Mock Gemini response' },
    }),
  },
}))

// ============================================
// NEXT.JS MOCKS
// ============================================

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
  headers: jest.fn(() => new Headers()),
}))

// ============================================
// BROWSER API MOCKS
// ============================================

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn()
  disconnect = jest.fn()
  unobserve = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn()
  disconnect = jest.fn()
  unobserve = jest.fn()
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
})

// ============================================
// CONSOLE SUPPRESSION
// ============================================

// Suppress specific console messages in tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    // Suppress React act() warnings
    if (args[0]?.includes?.('Warning: ReactDOM.render is no longer supported')) return
    if (args[0]?.includes?.('Warning: An update to')) return
    originalError.apply(console, args)
  }

  console.warn = (...args) => {
    // Suppress specific warnings
    if (args[0]?.includes?.('componentWillReceiveProps')) return
    originalWarn.apply(console, args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// ============================================
// GLOBAL TEST UTILITIES
// ============================================

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper to create mock documents
export const createMockDocument = (overrides = {}) => ({
  id: 'doc-123',
  case_id: 'case-123',
  filename: 'test-document.pdf',
  file_type: 'application/pdf',
  file_size: 1024,
  storage_path: 'cases/case-123/test-document.pdf',
  hash_sha256: 'abc123',
  doc_type: 'other',
  status: 'completed',
  extracted_text: 'Test document content',
  page_count: 5,
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

// Helper to create mock cases
export const createMockCase = (overrides = {}) => ({
  id: 'case-123',
  reference: 'TEST-001',
  name: 'Test Case',
  case_type: 'family_court',
  status: 'active',
  description: 'A test case',
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

// Helper to create mock findings
export const createMockFinding = (overrides = {}) => ({
  id: 'finding-123',
  case_id: 'case-123',
  engine: 'omission',
  title: 'Test Finding',
  description: 'A test finding',
  finding_type: 'omission',
  severity: 'high',
  document_ids: ['doc-123'],
  entity_ids: [],
  regulatory_targets: ['hcpc'],
  evidence: {},
  metadata: {},
  created_at: new Date().toISOString(),
  ...overrides,
})
