import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';

interface OverviewProps {
  documentCount: number;
  conflictCount: number;
  onNavigate: (tab: string) => void;
  onRunSample: (q: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  documentCount,
  conflictCount,
  onNavigate,
  onRunSample
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* SaaS Product Header Banner */}
      <div className="bg-white border border-slate-200 rounded p-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-medium">
            <span>Multi-Agent Document Verification System</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Verify policy contradictions and precedence before answering.
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard RAG systems synthesize confident answers even when policy documents directly conflict. TruthGuard audits document evolution across versions, identifies conflicting rules, enforces non-retroactive effective dates, and flags unverified claims.
          </p>
          <div className="pt-1 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('qa')}
              className="px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Open Verification Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('testbench')}
              className="px-3.5 py-2 rounded border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
            >
              <span>View Benchmark Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Indexed Documents</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-semibold text-slate-900 font-mono">{documentCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">HR, IT Security & Travel corpus</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Contradictions</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-semibold text-slate-900 font-mono">{conflictCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Detected rule discrepancies</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Adversarial Bench</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-semibold text-emerald-700 font-mono">8 / 8 Pass</div>
          <p className="text-[11px] text-slate-400 mt-0.5">100% Deterministic Pass Rate</p>
        </div>

        <div className="p-3.5 rounded bg-white border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Logical Pipeline</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-semibold text-slate-900 font-mono">4 Agents</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Independent agent modules</p>
        </div>
      </div>

      {/* Logical Pipeline Division */}
      <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Multi-Agent Architecture & Pipeline Stages
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Inputs and outputs are partitioned across four specialized roles rather than a single black-box prompt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-1">
          <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-mono text-[10px] text-slate-500 font-semibold block">1. RETRIEVER</span>
            <h4 className="font-semibold text-slate-900 text-xs">Passage Provenance</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              BM25 tokenized keyword search with document metadata, version tracking, and effective dates.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-mono text-[10px] text-slate-500 font-semibold block">2. SYNTHESIZER</span>
            <h4 className="font-semibold text-slate-900 text-xs">Claim Decomposition</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Generates candidate answers based exclusively on passages and maps each claim to source IDs.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-mono text-[10px] text-slate-500 font-semibold block">3. CRITIC / ADVERSARY</span>
            <h4 className="font-semibold text-slate-900 text-xs">Contradiction Audit</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Cross-checks values (₹800 vs ₹1,200), detects outdated documents, and isolates prompt injection.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-mono text-[10px] text-slate-500 font-semibold block">4. RESOLVER</span>
            <h4 className="font-semibold text-slate-900 text-xs">Precedence Verification</h4>
            <p className="text-[11px] text-slate-600 leading-snug">
              Applies explicit supersession clauses and effective date boundaries; flags irresolvable ties.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Audit Scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 block">
          Preset Verification Benchmarks
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => onRunSample('What is the current casual leave entitlement after April 1, 2025?')}
            className="p-3.5 rounded bg-white border border-slate-200 hover:border-slate-400 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] font-semibold text-emerald-700">SCENARIO 1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-semibold text-slate-900 text-xs">Leave Policy Supersession</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Verifies that Amendment 2025-A1 (18 days) explicitly invalidates earlier 12 & 15 day policies.
            </p>
          </div>

          <div 
            onClick={() => onRunSample('What is the daily meal reimbursement limit?')}
            className="p-3.5 rounded bg-white border border-slate-200 hover:border-slate-400 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] font-semibold text-rose-700">SCENARIO 2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-semibold text-slate-900 text-xs">Unresolved Contradiction</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Manual A states ₹800; Manual B states ₹1,200. TruthGuard surfaces both and flags as UNRESOLVED.
            </p>
          </div>

          <div 
            onClick={() => onRunSample('Does the policy require passwords to be changed every 30 days and require uppercase letters?')}
            className="p-3.5 rounded bg-white border border-slate-200 hover:border-slate-400 cursor-pointer transition-colors space-y-1"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] font-semibold text-amber-700">SCENARIO 3</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <h4 className="font-semibold text-slate-900 text-xs">Unsupported Query Claims</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Contradicts the 30-day rotation claim (90 days required) and notes uppercase is non-mandatory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
