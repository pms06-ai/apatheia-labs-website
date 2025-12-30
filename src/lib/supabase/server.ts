import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function createServerSupabaseClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch {
                        // Handle cookies in middleware
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch {
                        // Handle cookies in middleware
                    }
                },
            },
        }
    )
}

// Alias for createServerSupabaseClient
export { createServerSupabaseClient as createServerClient }

// Mock DB for local dev
const MOCK_DB = {
    documents: new Map([
        ['mock-police', {
            id: 'mock-police',
            case_id: 'PE23C50095',
            filename: 'Police_Report_Jan23.pdf',
            doc_type: 'police_report',
            extracted_text: 'Police report contents: Incident on 12/01/2023. Officers attended. Mother appeared intoxicated. Child was distressed.',
            status: 'completed'
        }],
        ['mock-sw', {
            id: 'mock-sw',
            case_id: 'PE23C50095',
            filename: 'SW_Assessment_Feb23.pdf',
            doc_type: 'social_work_assessment',
            extracted_text: 'Social Work Assessment. Concerns raised regarding alcohol use. Mother denies issues. Child placement recommended.',
            status: 'completed'
        }],
        ['mock-expert', {
            id: 'mock-expert',
            case_id: 'PE23C50095',
            filename: 'Dr_Smith_Psych_Report.pdf',
            doc_type: 'expert_report',
            extracted_text: 'Psychological Assessment. I have read the police report. I find the mother avoids the truth. I recommend therapy.',
            status: 'completed'
        }],
    ]),
    cases: new Map([
        ['PE23C50095', { id: 'PE23C50095', name: 'Smith vs Jones', status: 'active' }]
    ]),
    findings: new Map()
}

export function createAdminClient() {
    const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')

    if (isMock) {
        console.log('[MOCK DB] Using Mock Supabase Admin Client')
        return {
            from: (table: string) => ({
                insert: (data: any) => {
                    const record = Array.isArray(data) ? data[0] : data
                    const id = crypto.randomUUID()
                    const newRecord = { id, created_at: new Date().toISOString(), ...record }

                    if (table === 'documents') {
                        MOCK_DB.documents.set(id, newRecord)
                    } else if (table === 'findings') {
                        MOCK_DB.findings.set(id, newRecord)
                    }
                    console.log(`[MOCK DB] Inserted into ${table}:`, newRecord)

                    // Return builder pattern
                    return {
                        select: () => ({
                            single: () => Promise.resolve({ data: newRecord, error: null })
                        }),
                        then: (resolve: Function) => resolve({ data: null, error: null })
                    }
                },
                select: (columns: string) => ({
                    eq: (col: string, val: any) => ({
                        single: () => {
                            // Handle cases table
                            if (table === 'cases' && col === 'id') {
                                const c = MOCK_DB.cases.get(val)
                                return Promise.resolve({ data: c, error: c ? null : 'Not found' })
                            }
                            // Handle documents table (by id)
                            if (table === 'documents' && col === 'id') {
                                const d = MOCK_DB.documents.get(val)
                                return Promise.resolve({ data: d, error: d ? null : 'Not found' })
                            }
                            // Default single
                            return Promise.resolve({ data: null, error: null })
                        },
                        order: (sortCol: string) => {
                            // Handle by case_id for list
                            if (table === 'documents' && col === 'case_id') {
                                const docs = Array.from(MOCK_DB.documents.values()).filter(d => d.case_id === val)
                                return Promise.resolve({ data: docs, error: null })
                            }
                            return Promise.resolve({ data: [], error: null })
                        }
                    }),
                    in: (col: string, vals: any[]) => {
                        if (table === 'documents' && col === 'id') {
                            const docs = Array.from(MOCK_DB.documents.values()).filter(d => vals.includes(d.id))
                            return Promise.resolve({ data: docs, error: null })
                        }
                        return Promise.resolve({ data: [], error: null })
                    }
                })
            })
        } as any
    }

    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}

// Backward-compatible alias
export const supabaseAdmin = createAdminClient()
