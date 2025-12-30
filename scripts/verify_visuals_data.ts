
// Mock environment variables MUST be set before any imports that use them
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-key'

import type { Document } from '../src/CONTRACT'

const mockDocs: Document[] = [
    {
        id: 'doc-1', filename: 'Police Report.pdf', doc_type: 'police_bundle',
        created_at: '2023-01-10', status: 'completed', case_id: 'case-1',
        file_type: 'application/pdf', file_size: 1000, storage_path: '', hash_sha256: '', source_entity: null, page_count: 5,
        acquisition_date: '2023-01-10', extracted_text: 'sample text', metadata: {}, updated_at: '2023-01-10'
    },
    {
        id: 'doc-2', filename: 'Social Work Assessment.pdf', doc_type: 'social_work_assessment',
        created_at: '2023-02-15', status: 'completed', case_id: 'case-1',
        file_type: 'application/pdf', file_size: 1000, storage_path: '', hash_sha256: '', source_entity: null, page_count: 10,
        acquisition_date: '2023-02-15', extracted_text: 'sample text', metadata: {}, updated_at: '2023-02-15'
    }
]

async function verifyVisualsData() {
    // Dynamic imports to prevent hoisting issues
    const { narrativeEngine } = await import('../src/lib/engines/narrative')
    const { coordinationEngine } = await import('../src/lib/engines/coordination')

    console.log('📊 Verifying Visualization Data Structures...\n')

    // 1. Narrative Timeline
    console.log('Checking Narrative Engine (Timeline Data)...')
    const narrativeResult = await narrativeEngine.analyzeNarrativeEvolution(mockDocs, 'case-1')

    if (narrativeResult.lineages.length > 0) {
        const lineage = narrativeResult.lineages[0]
        const { timeline, visualData } = await narrativeEngine.generateClaimTimeline(lineage)

        console.log(`✅ Lineage: "${lineage.rootClaim}"`)
        console.log(`   Visual Points: ${visualData.length}`)
        console.log(`   Timeline Events: ${timeline.length}`)
        console.log(`   Sample Event: ${timeline[0].date} - ${timeline[0].strength} (${timeline[0].change})`)
    } else {
        console.error('❌ No narrative lineages found')
    }

    console.log('\n--------------------------------\n')

    // 2. Coordination Network
    console.log('Checking Coordination Engine (Network Data)...')
    const coordinationResult = await coordinationEngine.analyzeCoordination(mockDocs, 'case-1')

    if (coordinationResult.informationFlow.length > 0 || coordinationResult.sharedLanguage.length > 0) {
        console.log(`✅ Information Flows: ${coordinationResult.informationFlow.length}`)
        console.log(`✅ Shared Language Instances: ${coordinationResult.sharedLanguage.length}`)
        console.log(`✅ Independence Violations: ${coordinationResult.independenceViolations.length}`)
        if (coordinationResult.independenceViolations.length > 0) {
            console.log(`   Sample Violation: ${coordinationResult.independenceViolations[0].type}`)
        }
    } else {
        console.error('❌ No coordination findings found')
    }
}

verifyVisualsData()
