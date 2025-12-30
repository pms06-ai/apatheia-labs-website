import { createBrowserClient } from '@supabase/ssr'

const MOCK_DATA = {
    cases: [
        {
            id: 'PE23C50095',
            reference: 'PE23C50095',
            case_reference: 'PE23C50095',
            name: 'Smith vs Jones',
            case_name: 'Smith vs Jones',
            case_type: 'family_court',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: {}
        },
        {
            id: 'FC24D01021',
            reference: 'FC24D01021',
            case_reference: 'FC24D01021',
            name: 'Re: Child X',
            case_name: 'Re: Child X',
            case_type: 'family_court',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: {}
        }
    ],
    documents: [
        {
            id: 'mock-police',
            case_id: 'PE23C50095',
            filename: 'Police_Report_Jan23.pdf',
            doc_type: 'police_report',
            extracted_text: 'Police report contents...',
            status: 'completed',
            created_at: new Date().toISOString()
        },
        {
            id: 'mock-sw',
            case_id: 'PE23C50095',
            filename: 'SW_Assessment_Feb23.pdf',
            doc_type: 'social_work_assessment',
            extracted_text: 'Social Work Assessment...',
            status: 'completed',
            created_at: new Date().toISOString()
        },
        {
            id: 'mock-expert',
            case_id: 'PE23C50095',
            filename: 'Dr_Smith_Psych_Report.pdf',
            doc_type: 'expert_report',
            extracted_text: 'Psychological Assessment...',
            status: 'completed',
            created_at: new Date().toISOString()
        }
    ],
    findings: [
        // Omission Findings
        {
            id: 'mock-f1',
            case_id: 'PE23C50095',
            engine: 'omission',
            title: 'Complete Omission detected',
            description: 'The report minimizes the consistency of contact, omitting the specific confirmation of full attendance.',
            severity: 'critical',
            document_ids: ['mock-police', 'mock-sw'],
            evidence: {
                type: 'complete_omission',
                sourceContent: 'The father has correctly attended all scheduled contact sessions since January.',
                reportContent: 'Father has had some contact.'
            },
            regulatory_targets: [],
            created_at: new Date().toISOString()
        },
        {
            id: 'mock-f2',
            case_id: 'PE23C50095',
            engine: 'omission',
            title: 'Context Removal detected',
            description: 'Removes the qualifying context that the issue was resolved.',
            severity: 'high',
            document_ids: ['mock-police', 'mock-sw'],
            evidence: {
                type: 'context_removal',
                sourceContent: 'While there were initial concerns about hygiene, these have been largely addressed...',
                omittedContent: 'these have been largely addressed...'
            },
            regulatory_targets: [],
            created_at: new Date().toISOString()
        },
        // Contradiction Findings
        {
            id: 'mock-f3',
            case_id: 'PE23C50095',
            engine: 'contradiction',
            title: 'Direct contradiction: Subject Location',
            description: 'Direct contradiction regarding the subject\'s location on the night of the incident.',
            severity: 'critical',
            document_ids: ['mock-police', 'mock-sw'],
            evidence: {
                type: 'direct',
                claim1: { text: 'Subject was at home all night', author: 'Officer A' },
                claim2: { text: 'Subject was seen at the pub at 9pm', author: 'Social Worker B' }
            },
            regulatory_targets: [],
            created_at: new Date().toISOString()
        },
        // Narrative Findings
        {
            id: 'mock-f4',
            case_id: 'PE23C50095',
            engine: 'narrative',
            title: 'Narrative Amplification: Child was neglected',
            description: 'Claim evolved from initial concern to established fact through sequential citations.',
            severity: 'high',
            document_ids: ['mock-police', 'mock-sw', 'mock-expert'],
            evidence: {
                mutationType: 'amplification',
                driftDirection: 'toward_finding'
            },
            regulatory_targets: [],
            created_at: new Date().toISOString()
        },
        // Expert Witness Findings
        {
            id: 'mock-f5',
            case_id: 'PE23C50095',
            engine: 'expert_witness',
            title: 'Scope Exceedance Detected',
            description: 'Expert ventured beyond the instructed area of expertise (Psychology) into Fact Finding.',
            severity: 'high',
            document_ids: ['mock-expert'],
            evidence: {
                violationType: 'scope_exceedance',
                details: 'Expert made definitive statements about factual events witnesses did not observe.'
            },
            regulatory_targets: ['FPR Part 25', 'PD25B'],
            created_at: new Date().toISOString()
        },
        // Coordination Findings
        {
            id: 'mock-f6',
            case_id: 'PE23C50095',
            engine: 'coordination',
            title: 'Linguistic Collusion Detected',
            description: 'High degree of linguistic similarity between purportedly independent reports, suggesting copying.',
            severity: 'critical',
            document_ids: ['mock-police', 'mock-sw'],
            evidence: {
                similarityScore: 0.92,
                sharedPhrases: ['mother presented as hostile and uncooperative', 'continuing risk of significant harm']
            },
            regulatory_targets: [],
            created_at: new Date().toISOString()
        }
    ]
}

export function createClient() {
    const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')

    if (isMock) {
        console.log('[MOCK CLIENT] Using Mock Supabase Browser Client')

        // Return a Proxy that intercepts all calls to simulate a Supabase client
        return new Proxy({}, {
            get: (target, prop) => {
                if (prop === 'from') {
                    return (table: string) => ({
                        select: (columns: string = '*') => {
                            // Return a chainable object that eventually returns data
                            const chain = {
                                eq: (col: string, val: any) => chain,
                                order: (col: string, opts: any) => chain,
                                limit: (n: number) => chain,
                                single: () => Promise.resolve({ data: (MOCK_DATA as any)[table]?.[0] || null, error: null }),
                                then: (resolve: Function) => {
                                    // Default promise resolution for .select()
                                    const data = (MOCK_DATA as any)[table] || []
                                    resolve({ data, error: null })
                                }
                            }
                            return chain
                        },
                        insert: (data: any) => Promise.resolve({ data, error: null }),
                        update: (data: any) => Promise.resolve({ data, error: null }),
                        delete: () => Promise.resolve({ data: null, error: null }),
                        on: () => ({ subscribe: () => { } }) // Realtime subscription mock
                    })
                }
                if (prop === 'auth') {
                    return {
                        getSession: () => Promise.resolve({ data: { session: { user: { id: 'mock-user', email: 'mock@example.com' } } }, error: null }),
                        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } })
                    }
                }
                return Reflect.get(target, prop)
            }
        }) as any
    }

    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
