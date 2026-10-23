import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Cpu,
  Layers,
  Sparkles
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-electric-violet/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/30 text-electric-blue text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trustworthy AI & Multi-Agent Document Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Don't Just Trust the Answer. <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-electric-violet">Verify It.</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Standard RAG systems confidently answer queries even when source documents materially contradict each other. TruthGuard actively audits policy evolution, detects conflicting rules, enforces non-retroactive effective dates, and flags unsupported claims.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('qa')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-electric-violet hover:opacity-90 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-electric-blue/20 transition-all"
            >
              <span>Try Interactive Q&A</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('testbench')}
              className="px-5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-xs flex items-center gap-2 transition-all"
            >
              <span>View Test Bench Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Indexed Documents</span>
            <FileText className="w-4 h-4 text-electric-blue" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{documentCount}</div>
          <p className="text-[11px] text-slate-400">Synthetic corpus across HR, IT & Expenses</p>
        </div>

        <div className="p-5 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Contradictions</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400 font-mono">{conflictCount}</div>
          <p className="text-[11px] text-slate-400">Detected discrepancies across policy versions</p>
        </div>

        <div className="p-5 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Automated Tests</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">8 / 8 Pass</div>
          <p className="text-[11px] text-slate-400">100% Pass rate on adversarial benchmarks</p>
        </div>

        <div className="p-5 rounded-xl bg-navy-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Logical Agents</span>
            <Layers className="w-4 h-4 text-electric-violet" />
          </div>
          <div className="text-2xl font-bold text-electric-violet font-mono">4 Pipeline</div>
          <p className="text-[11px] text-slate-400">Retriever, Synthesizer, Critic, Resolver</p>
        </div>
      </div>

      {/* The 4-Agent Architecture Breakdown */}
      <div className="p-6 rounded-xl bg-navy-900 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-electric-blue" />
              Multi-Agent Architecture & Division of Responsibility
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              TruthGuard separates knowledge retrieval, synthesis, adversarial criticism, and resolution into independent agents.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-electric-blue font-bold px-2 py-0.5 rounded bg-electric-blue/10">AGENT 1</span>
              <span className="text-[10px] text-slate-400">BM25 Retrieval</span>
            </div>
            <h4 className="font-bold text-white text-sm">Retriever Agent</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tokenizes queries, filters stop words, searches indexed passages, and preserves exact provenance metadata (version, dates, titles).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-electric-violet font-bold px-2 py-0.5 rounded bg-electric-violet/10">AGENT 2</span>
              <span className="text-[10px] text-slate-400">Claim Extraction</span>
            </div>
            <h4 className="font-bold text-white text-sm">Synthesizer Agent</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formulates answers grounded solely in retrieved passages, deconstructs responses into atomic claims, and marks unsubstantiated items.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-red-400 font-bold px-2 py-0.5 rounded bg-red-400/10">AGENT 3</span>
              <span className="text-[10px] text-slate-400">Adversary Check</span>
            </div>
            <h4 className="font-bold text-white text-sm">Critic Agent</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compares passages across versions to detect numeric discrepancies, identifies unsupported query claims, and quarantines prompt injection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-400/10">AGENT 4</span>
              <span className="text-[10px] text-slate-400">Precedence Proof</span>
            </div>
            <h4 className="font-bold text-white text-sm">Resolver Agent</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies explicit supersession clauses and effective-date boundaries. If no governing precedence exists, surfaces both sides honestly.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Demonstration Scenarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Interactive Demonstration Highlights</h3>
          <span className="text-xs text-slate-400">Click any scenario to verify instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => onRunSample('What is the current casual leave entitlement after April 1, 2025?')}
            className="p-5 rounded-xl bg-navy-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                SCENARIO 1: EXPLICIT SUPERSESSION
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <h4 className="font-bold text-white text-sm">Leave Entitlement Revision</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resolves 12 vs 15 vs 18 leave days by inspecting the 2025 Amendment's explicit clause invalidating earlier provisions.
            </p>
          </div>

          <div 
            onClick={() => onRunSample('What is the daily meal reimbursement limit?')}
            className="p-5 rounded-xl bg-navy-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-mono text-[10px] font-bold">
                SCENARIO 2: UNRESOLVED CONTRADICTION
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <h4 className="font-bold text-white text-sm">Meal Reimbursement Capping</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manual A states ₹800; Manual B states ₹1,200. TruthGuard refuses to pick a random winner and transparently flags the conflict.
            </p>
          </div>

          <div 
            onClick={() => onRunSample('Does the policy require passwords to be changed every 30 days and require uppercase letters?')}
            className="p-5 rounded-xl bg-navy-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 cursor-pointer transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                SCENARIO 3: UNSUPPORTED CLAIMS
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <h4 className="font-bold text-white text-sm">Password Security Assumptions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contradicts the 30-day rotation claim (policy mandates 90) and warns that uppercase enforcement is unsupported.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
