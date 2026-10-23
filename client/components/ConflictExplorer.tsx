import React, { useState } from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Conflict Registry & Comparison</h2>
          <p className="text-xs text-slate-500">
            Cross-document rule discrepancies identified across versions and categories.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-xs text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Scan Active Conflicts</span>
        </button>
      </div>

      {conflicts.length === 0 ? (
        <div className="p-8 text-center rounded border border-slate-200 bg-white space-y-2">
          <ShieldAlert className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No Unresolved Contradictions</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All active documents in the library are mutually consistent or have documented legal supersession clauses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Conflict list */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Discovered Discrepancies ({conflicts.length})
            </span>
            <div className="space-y-1.5">
              {conflicts.map((c) => {
                const isSelected = selectedConflict?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConflict(c)}
                    className={`p-3 rounded border cursor-pointer transition-colors space-y-1 ${
                      isSelected
                        ? 'bg-slate-50 border-slate-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-1.5 py-0.2 rounded font-mono font-semibold text-[10px] ${
                        c.resolutionStatus === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.resolutionStatus}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.severity} Severity
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-xs line-clamp-2">
                      {c.description}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector */}
          <div className="lg:col-span-2">
            {selectedConflict ? (
              <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                      Registry ID: {selectedConflict.id}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">{selectedConflict.description}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                    selectedConflict.resolutionStatus === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedConflict.resolutionStatus}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Critic Discrepancy Analysis</span>
                  <p className="text-xs text-slate-600 leading-relaxed p-3 rounded bg-slate-50 border border-slate-200">
                    {selectedConflict.explanation}
                  </p>
                </div>

                {/* Side-by-side statements */}
                {selectedConflict.conflictingStatements && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700">
                      Conflicting Document Passages
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedConflict.conflictingStatements.map((stmt, idx) => (
                        <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-2 text-xs flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-1">
                              <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                                {stmt.documentTitle}
                              </span>
                              <span className="font-mono text-slate-600">v{stmt.version}</span>
                            </div>
                            <div className="text-slate-800 italic pt-1 leading-snug">
                              "{stmt.quote}"
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                            <span>Effective: {stmt.effectiveFrom}</span>
                            {stmt.ruleValue !== undefined && (
                              <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-900 font-bold">
                                Cap: {stmt.ruleValue}
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
                  <div className="p-3 rounded bg-white border border-emerald-200 text-xs space-y-1 text-emerald-900">
                    <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolver Legal Precedence
                    </span>
                    <p className="leading-relaxed text-slate-700">
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
                      className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>Query in Verification Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs border border-slate-200 rounded bg-white">
                Select a conflict to inspect comparative passages.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
