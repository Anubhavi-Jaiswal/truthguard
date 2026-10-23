import React, { useState } from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Loader2
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-electric-blue" />
            TruthGuard Adversarial Test Bench
          </h2>
          <p className="text-sm text-slate-400">
            Execute 8 automated verification scenarios against deterministic test fixtures to rigorously assess contradiction detection, effective dates, and injection resistance.
          </p>
        </div>

        <button
          onClick={handleRunAll}
          disabled={running}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-electric-violet hover:opacity-90 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-electric-blue/20 transition-all"
        >
          {running ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Executing Test Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run All Adversarial Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Stats Summary Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Scenarios</span>
            <span className="text-2xl font-bold text-white font-mono">{stats.total}</span>
          </div>
          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Passed Criteria</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{stats.passed}</span>
          </div>
          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Failed Criteria</span>
            <span className="text-2xl font-bold text-red-400 font-mono">{stats.failed}</span>
          </div>
          <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Pass Rate</span>
            <span className="text-2xl font-bold text-electric-blue font-mono">{stats.passRate}%</span>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {testResults ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test list */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Executed Scenarios
            </span>
            <div className="space-y-2">
              {testResults.map((r) => {
                const isSelected = selectedResult?.testId === r.testId;
                return (
                  <div
                    key={r.testId}
                    onClick={() => setSelectedResult(r)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-navy-900 border-electric-blue shadow-md'
                        : 'bg-navy-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        {r.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span className={`font-mono font-bold text-[10px] ${
                          r.passed ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {r.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{r.executionTimeMs}ms</span>
                    </div>
                    <div className="font-medium text-xs text-white line-clamp-1">{r.title}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Test Inspector */}
          <div className="lg:col-span-2">
            {selectedResult ? (
              <div className="p-6 rounded-xl bg-navy-900 border border-slate-800 space-y-5">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Test Case • {selectedResult.testId}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedResult.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    selectedResult.passed 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedResult.passed ? 'VERIFICATION PASSED' : 'VERIFICATION FAILED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-navy-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Expected Status</span>
                    <span className="text-slate-200 font-bold">{selectedResult.expectedStatus}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-navy-950 border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Actual Status Produced</span>
                    <span className={`font-bold ${
                      selectedResult.actualStatus === selectedResult.expectedStatus ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {selectedResult.actualStatus}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Query Evaluated
                  </span>
                  <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-200 font-sans">
                    "{selectedResult.verificationResult.question}"
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Generated Verified Response
                  </span>
                  <div className="p-3.5 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedResult.verificationResult.answer}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300">
                  <span className="font-semibold text-slate-200 block mb-1">Evaluation Details:</span>
                  <p className="text-slate-400">{selectedResult.explanation}</p>
                </div>

                {onNavigateToQA && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => onNavigateToQA(selectedResult.verificationResult.question)}
                      className="px-3.5 py-1.5 rounded-lg bg-electric-blue/10 hover:bg-electric-blue/20 border border-electric-blue/30 text-electric-blue text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open in Q&A Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Select a scenario to view detailed evaluation metrics.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-navy-900 border border-slate-800 space-y-4">
          <FlaskConical className="w-12 h-12 text-electric-blue mx-auto opacity-70" />
          <h3 className="text-base font-bold text-white">Adversarial Test Suite Ready</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Run the automated suite to verify explicit supersession, numeric contradictions, prompt injection quarantining, and effective-date boundary adherence.
          </p>
          <button
            onClick={handleRunAll}
            disabled={running}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-electric-violet text-white text-xs font-semibold shadow-lg shadow-electric-blue/20"
          >
            Run Test Bench Now
          </button>
        </div>
      )}
    </div>
  );
};
