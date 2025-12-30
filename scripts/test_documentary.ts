
// Set env vars BEFORE imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key'

import type { Document } from '../src/types'

async function runTest() {
    // Dynamic import to ensure env vars are set
    const { documentaryEngine } = await import('../src/lib/engines/documentary')

    console.log('🧪 Testing Documentary Engine (Mock Mode)...')

    // Create mock documents
    const mockDocs: Document[] = [
        {
            id: 'doc-1',
            filename: 'Raw Footage 1.mp4',
            doc_type: 'media',
            extracted_text: 'Context: Confrontation with police. Subject is calm but firm.',
            status: 'completed',
            case_id: 'case-1',
            file_type: 'video/mp4',
            file_size: 1024,
            storage_path: '/tmp',
            hash_sha256: 'abc',
            source_entity: null,
            page_count: 0,
            metadata: {},
            acquisition_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
    ]

    try {
        const result = await documentaryEngine.analyzeDocumentaryBias(mockDocs, 'case-1')

        console.log('\n✅ Analysis Complete!')
        console.log('Bias Score:', result.biasScore)
        console.log('Findings:', result.findings.length)
        console.log('Findings Details:')
        result.findings.forEach(f => {
            console.log(` - [${f.severity}] ${f.technique}: ${f.description}`)
        })

        if (result.biasScore > 0 && result.findings.length > 0) {
            console.log('\n🎉 Test Passed: Engine returned valid findings.')
        } else {
            console.error('\n❌ Test Failed: No findings returned.')
            process.exit(1)
        }

    } catch (error) {
        console.error('\n❌ Test Failed with Error:', error)
        process.exit(1)
    }
}

runTest()
