import { testRunnerService } from '../server/services/testRunner';

async function main() {
  console.log('====================================================');
  console.log('   TRUTHGUARD ADVERSARIAL TEST BENCH SUITE');
  console.log('====================================================\n');

  const { results, total, passed, failed, passRate } = await testRunnerService.runAllTests();

  for (const r of results) {
    const statusSymbol = r.passed ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`${statusSymbol} ${r.title}`);
    console.log(`   Question: "${r.verificationResult.question}"`);
    console.log(`   Status: ${r.actualStatus} (Expected: ${r.expectedStatus})`);
    if (r.verificationResult.conflicts.length > 0) {
      console.log(`   Conflict: ${r.verificationResult.conflicts[0].description}`);
      console.log(`   Resolution: ${r.verificationResult.conflicts[0].resolutionStatus}`);
    }
    console.log(`   Time: ${r.executionTimeMs}ms`);
    console.log(`   Details: ${r.explanation}\n`);
  }

  console.log('----------------------------------------------------');
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed} | Pass Rate: ${passRate}%`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test suite error:', err);
  process.exit(1);
});
