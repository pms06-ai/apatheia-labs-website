
// Mock env
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder';

async function testCoordination() {
    // Import after setting env vars
    const { runEngine } = await import('../src/lib/engines/index');
    console.log('🧪 Testing Coordination Engine Execution...');

    // Mock inputs
    const caseId = 'PE23C50095';
    // IDs must correspond to MOCK_DB in src/lib/supabase/server.ts
    const documentIds = ['mock-police', 'mock-sw'];

    try {
        const result = await runEngine({
            engineId: 'coordination',
            caseId,
            documentIds
        });

        if (result.success && result.result && 'sharedLanguage' in result.result) {
            console.log('✅ Coordination Engine ran successfully!');
            console.log(`   Shared Language Findings: ${result.result.sharedLanguage.length}`);
            console.log(`   Independence Violations: ${result.result.independenceViolations.length}`);
        } else {
            console.error('❌ Coordination Engine failed:', result.error || 'No result returned');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

testCoordination().catch(console.error);
