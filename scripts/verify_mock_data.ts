
// scripts/verify_mock_data.ts
import { createClient } from '../src/lib/supabase/client';

// Mock environment
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder';

async function verifyMocks() {
    console.log('🧪 Starting Rigorous Mock Verification...\n');

    // 1. Initialize Mock Client
    const supabase = createClient();
    console.log('✅ Client Initialized');

    // 2. Fetch Findings
    console.log('\n📥 Fetching Findings from Mock DB...');
    const result = await supabase.from('findings').select('*');
    const { data: findings, error } = result as any;

    if (error) {
        console.error('❌ Error fetching findings:', error);
        process.exit(1);
    }

    console.log(`✅ Fetched ${findings.length} findings`);

    // 3. Verify Engine Coverage
    const engines = new Set(findings.map((f: any) => f.engine));
    const expectedEngines = ['omission', 'contradiction', 'narrative', 'expert_witness', 'coordination'];

    console.log('\n🔍 Verifying Engine Coverage:');
    let allPassed = true;

    expectedEngines.forEach(engine => {
        if (engines.has(engine)) {
            const count = findings.filter((f: any) => f.engine === engine).length;
            console.log(`   ✅ [PASS] ${engine}: Found ${count} findings`);
        } else {
            console.error(`   ❌ [FAIL] ${engine}: Missing!`);
            allPassed = false;
        }
    });

    // 4. Verify Data Structure Integrity
    console.log('\n🔍 Verifying Data Integrity:');
    findings.forEach((f: any, idx: number) => {
        const issues = [];
        if (!f.id) issues.push('Missing ID');
        if (!f.title) issues.push('Missing Title');
        if (!f.case_id) issues.push('Missing Case ID');
        if (!f.evidence) issues.push('Missing Evidence Body');

        if (issues.length > 0) {
            console.error(`   ❌ [FAIL] Finding #${idx} (${f.engine}): ${issues.join(', ')}`);
            allPassed = false;
        }
    });

    if (allPassed) {
        console.log('\n🎉 ALL CHECKS PASSED: Mock Data is Valid and Complete.');
    } else {
        console.error('\n⚠️ VERIFICATION FAILED: Missing engines or invalid data.');
        process.exit(1);
    }
}

verifyMocks().catch(console.error);
