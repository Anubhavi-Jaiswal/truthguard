import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import { Conflict } from '../../shared/types';

interface ConflictExplorerProps {
  conflicts: Conflict[];
  onRefresh: () => void;
  onNavigateToQA?: (q: string) => void;
}

export const ConflictExplorer: React.FC<ConflictExplorerProps> = ({
  conflicts,
  onRefresh,
  onNavigateToQA
}) => {
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(
    conflicts.length > 0 ? conflicts[0] : null
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            Contradiction Explorer & Side-by-Side Comparator
          </h2>
          <p className="text-sm text-slate-400">
            Audit conflicting rules detected between active enterprise documents. Inspect exact text comparisons and resolution justifications.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Scan Active Conflicts</span>
        </button>
      </div>

      {conflicts.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-navy-900 border border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Unchecked Contradictions in Current Workspace</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All loaded policies are either mutually consistent or have valid supersession clauses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of conflicts */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Detected Conflicts ({conflicts.length})
            </span>
            <div className="space-y-2">
              {conflicts.map((c) => {
                const isSelected = selectedConflict?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConflict(c)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-navy-900 border-red-500/80 shadow-lg shadow-red-500/10'
                        : 'bg-navy-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        c.resolutionStatus === 'RESOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {c.resolutionStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Severity: {c.severity}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white text-xs line-clamp-2">
                      {c.description}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conflict Inspection Detail Card */}
          <div className="lg:col-span-2 space-y-4">
            {selectedConflict ? (
              <div className="p-6 rounded-xl bg-navy-900 border border-slate-800 space-y-5">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold block mb-1">
                      Contradiction Breakdown • ID: {selectedConflict.id}
                    </span>
                    <h3 className="text-lg font-bold text-white">{selectedConflict.description}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    selectedConflict.resolutionStatus === 'RESOLVED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    {selectedConflict.resolutionStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Adversarial Critic Analysis
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-navy-950 p-3.5 rounded-lg border border-slate-800">
                    {selectedConflict.explanation}
                  </p>
                </div>

                {/* Side-by-side statements */}
                {selectedConflict.conflictingStatements && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Side-by-Side Passage Statements
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedConflict.conflictingStatements.map((stmt, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-2 text-xs flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1">
                              <span className="font-semibold text-electric-blue truncate max-w-[200px]">
                                {stmt.documentTitle}
                              </span>
                              <span className="font-mono text-slate-300">v{stmt.version}</span>
                            </div>
                            <div className="text-slate-200 italic font-serif leading-relaxed pt-1">
                              "{stmt.quote}"
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                            <span>Effective: {stmt.effectiveFrom}</span>
                            {stmt.ruleValue !== undefined && (
                              <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold">
                                Limit: {stmt.ruleValue}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Precedence Justification */}
                {selectedConflict.resolutionJustification && (
                  <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1 text-emerald-200">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolver Agent Verdict & Precedence Justification
                    </span>
                    <p className="leading-relaxed">
                      {selectedConflict.resolutionJustification}
                    </p>
                  </div>
                )}

                {/* Action button */}
                {onNavigateToQA && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onNavigateToQA(
                        selectedConflict.id.includes('meal') 
                          ? 'What is the daily meal reimbursement limit?' 
                          : 'What is the current casual leave entitlement after April 1, 2025?'
                      )}
                      className="px-4 py-2 rounded-lg bg-electric-violet/20 hover:bg-electric-violet/30 border border-electric-violet/40 text-electric-violet hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Query this Conflict in Verification Pipeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Select a conflict from the left column to inspect evidence.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
