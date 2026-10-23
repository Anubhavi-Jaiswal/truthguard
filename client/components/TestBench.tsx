import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { TestCase, TestResult, VerificationStatus } from '../../shared/types';

interface TestBenchProps {
  onNavigateToQA?: (q: string) => void;
}

export const TestBench: React.FC<TestBenchProps> = ({ onNavigateToQA }) => {
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [stats, setStats] = useState<{ total: number; passed: number; failed: number; passRate: number } | null>(null);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  const handleRunAll = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/demo/run-all-tests', { method: 'POST' });
      const data = await res.json();
      setTestResults(data.results);
      setStats({
        total: data.total,
        passed: data.passed,
        failed: data.failed,
        passRate: data.passRate
      });
      if (data.results.length > 0) {
        setSelectedResult(data.results[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="tg-page">
      <div className="tg-page-header">
        <div>
          <h2 className="tg-title">Adversarial Test Suite</h2>
          <p className="tg-subtitle">
            Automated compliance fixtures testing supersession, effective date boundaries, numeric contradictions, and prompt injections.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={running}
          className="tg-accent-btn px-4 py-2"
        >
          {running ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Running Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Execute All Benchmarks</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-white shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Total Fixtures</span>
            <span className="text-xl font-semibold text-slate-900 font-mono">{stats.total}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Passing</span>
            <span className="text-xl font-semibold text-emerald-700 font-mono">{stats.passed}</span>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Failing</span>
            <span className="text-xl font-semibold text-rose-700 font-mono">{stats.failed}</span>
          </div>
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 shadow-sm">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Pass Rate</span>
            <span className="text-xl font-semibold text-slate-900 font-mono">{stats.passRate}%</span>
          </div>
        </div>
      )}

      {/* Results View */}
      {testResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Test list */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Test Fixtures
            </span>
            <div className="space-y-1">
              {testResults.map((r) => {
                const isSelected = selectedResult?.testId === r.testId;
                return (
                  <div
                    key={r.testId}
                    onClick={() => setSelectedResult(r)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-violet-50 border-violet-200 shadow-sm'
                        : 'bg-white border-white hover:border-violet-100 hover:bg-violet-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        {r.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span className={`font-mono font-semibold text-[10px] ${
                          r.passed ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {r.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{r.executionTimeMs}ms</span>
                    </div>
                    <div className="font-medium text-xs text-slate-900 line-clamp-1">{r.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Inspector */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <div className="tg-panel p-5 space-y-4">
                <div className="flex items-start justify-between border-b border-violet-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Case ID: {selectedResult.testId}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">{selectedResult.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    selectedResult.passed 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedResult.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100">
                    <span className="text-slate-500 text-[10px] block">Expected Status</span>
                    <span className="text-slate-900 font-semibold">{selectedResult.expectedStatus}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="text-slate-500 text-[10px] block">Actual Status Produced</span>
                    <span className={`font-semibold ${
                      selectedResult.actualStatus === selectedResult.expectedStatus ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {selectedResult.actualStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Evaluated Query</span>
                  <div className="p-3 rounded-2xl bg-violet-50/70 border border-violet-100 text-xs text-slate-900">
                    "{selectedResult.verificationResult.question}"
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Synthesized Answer</span>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-violet-100 text-xs text-slate-800 leading-relaxed">
                    {selectedResult.verificationResult.answer}
                  </div>
                </div>

                <div className="p-3 rounded-2xl border border-fuchsia-100 bg-fuchsia-50/60 text-xs text-slate-600">
                  <strong className="text-slate-900 font-semibold">Audit Verdict: </strong>
                  {selectedResult.explanation}
                </div>

                {onNavigateToQA && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => onNavigateToQA(selectedResult.verificationResult.question)}
                      className="tg-secondary-btn px-4 py-2"
                    >
                      <span>Open in Console</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="tg-panel p-8 text-center text-slate-400 text-xs">
                Select a fixture to view verification assertions.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="tg-panel p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-violet-200">
            <FlaskConical className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">Adversarial Test Suite Ready</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click below to execute the 8 benchmark scenarios testing explicit supersession, numeric contradictions, prompt-injection quarantine, and effective-date boundaries.
          </p>
          <button
            onClick={handleRunAll}
            disabled={running}
            className="tg-primary-btn px-5 py-3 mx-auto"
          >
            Execute Benchmark Tests
          </button>
        </div>
      )}
    </div>
  );
};
