import { TEST_CASES } from '../data/testCases';
import { pipelineService } from './pipeline';
import { TestResult } from '../../shared/types';

export class TestRunnerService {
  public async runAllTests(): Promise<{
    results: TestResult[];
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  }> {
    const results: TestResult[] = [];

    for (const test of TEST_CASES) {
      const startTime = Date.now();
      const verification = await pipelineService.executeVerification(test.question);
      const executionTimeMs = Date.now() - startTime;

      let passed = true;
      const reasons: string[] = [];

      // Check status matching
      if (verification.overallStatus !== test.expectedStatus) {
        passed = false;
        reasons.push(`Expected overallStatus ${test.expectedStatus}, got ${verification.overallStatus}`);
      }

      // Check resolutionStatus if expected
      if (test.expectedResolutionStatus && verification.conflicts.length > 0) {
        const matchingConflict = verification.conflicts[0];
        if (matchingConflict && matchingConflict.resolutionStatus !== test.expectedResolutionStatus) {
          passed = false;
          reasons.push(`Expected conflict resolutionStatus ${test.expectedResolutionStatus}, got ${matchingConflict.resolutionStatus}`);
        }
      }

      // Check key terms in answer
      if (test.expectedKeyTerms) {
        const lowerAnswer = verification.answer.toLowerCase();
        for (const term of test.expectedKeyTerms) {
          if (!lowerAnswer.includes(term.toLowerCase())) {
            passed = false;
            reasons.push(`Expected key term "${term}" missing in generated answer.`);
          }
        }
      }

      const explanation = passed 
        ? 'All deterministic verification criteria satisfied.'
        : reasons.join('; ');

      results.push({
        testId: test.id,
        title: test.title,
        passed,
        actualStatus: verification.overallStatus,
        expectedStatus: test.expectedStatus,
        actualResolutionStatus: verification.conflicts[0]?.resolutionStatus,
        expectedResolutionStatus: test.expectedResolutionStatus,
        explanation,
        verificationResult: verification,
        executionTimeMs
      });
    }

    const passedCount = results.filter(r => r.passed).length;
    return {
      results,
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      passRate: Math.round((passedCount / results.length) * 100)
    };
  }
}

export const testRunnerService = new TestRunnerService();
