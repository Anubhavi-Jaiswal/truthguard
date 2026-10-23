import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, RefreshCw, ShieldAlert } from 'lucide-react';
import { Conflict } from '../../shared/types';

interface ConflictExplorerProps {
  conflicts: Conflict[];
  onRefresh: () => void;
  onNavigateToQA?: (q: string) => void;
}

const getStatusLabel = (status: Conflict['resolutionStatus']) => {
  if (status === 'RESOLVED') return 'Resolved';
  if (status === 'CONDITIONAL') return 'Needs context';
  return 'Needs review';
};

const getStatusStyle = (status: Conflict['resolutionStatus']) => {
  if (status === 'RESOLVED') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (status === 'CONDITIONAL') return 'bg-amber-50 text-amber-700 border-amber-100';
  return 'bg-rose-50 text-rose-700 border-rose-100';
};

const getSuggestedQuestion = (conflict: Conflict) => {
  return conflict.id.includes('meal')
    ? 'What is the daily meal reimbursement limit?'
    : 'What is the current casual leave entitlement after April 1, 2025?';
};

const getShortTitle = (title: string) => {
  return title.replace(/\s+/g, ' ').replace(/(.{42}).+/, '$1...');
};

export const ConflictExplorer: React.FC<ConflictExplorerProps> = ({
  conflicts,
  onRefresh,
  onNavigateToQA
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(conflicts[0]?.id || null);

  useEffect(() => {
    if (!selectedId && conflicts.length > 0) {
      setSelectedId(conflicts[0].id);
      return;
    }

    if (selectedId && !conflicts.some((conflict) => conflict.id === selectedId)) {
      setSelectedId(conflicts[0]?.id || null);
    }
  }, [conflicts, selectedId]);

  const selectedConflict = useMemo(() => {
    return conflicts.find((conflict) => conflict.id === selectedId) || conflicts[0] || null;
  }, [conflicts, selectedId]);

  return (
    <div className="tg-page">
      <div className="tg-page-header">
        <div>
          <h2 className="tg-title">Conflict History</h2>
          <p className="tg-subtitle">
            Review earlier policy conflicts and open any item for details.
          </p>
        </div>

        <button onClick={onRefresh} className="tg-secondary-btn px-4 py-2">
          <RefreshCw className="w-3.5 h-3.5 text-violet-500" />
          <span>Refresh</span>
        </button>
      </div>

      {conflicts.length === 0 ? (
        <div className="tg-panel p-8 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-900">No previous conflicts found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            The current document set does not have any stored conflicts to review.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[22rem_1fr] gap-5 items-start">
          <aside className="tg-panel p-4">
            <div className="mb-4">
              <h3 className="text-sm font-black text-slate-900">Previous conflicts</h3>
            </div>

            <div className="space-y-2">
              {conflicts.map((conflict, index) => {
                const isSelected = selectedConflict?.id === conflict.id;
                return (
                  <button
                    key={conflict.id}
                    type="button"
                    onClick={() => setSelectedId(conflict.id)}
                    className={`w-full rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-violet-200 bg-violet-50 shadow-sm'
                        : 'border-slate-100 bg-white hover:border-violet-100 hover:bg-violet-50/50'
                    }`}
                  >
                    <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                      <div className="min-w-0">
                        <span className="text-[11px] font-black text-slate-400">
                          Conflict {index + 1}
                        </span>
                        <div className="mt-1 text-sm font-bold leading-snug text-slate-900 line-clamp-3">
                          {conflict.description}
                        </div>
                      </div>

                      <div className="flex w-24 shrink-0 flex-col items-stretch gap-2">
                        <span className={`text-center rounded-full border px-2 py-1 text-[10px] font-black ${getStatusStyle(conflict.resolutionStatus)}`}>
                          {getStatusLabel(conflict.resolutionStatus)}
                        </span>
                        <span className={`text-center rounded-full px-2 py-1 text-[11px] font-black ${
                          isSelected
                            ? 'bg-violet-600 text-white'
                            : 'bg-violet-50 text-violet-700'
                        }`}>
                          View
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {selectedConflict && (
            <section className="tg-panel overflow-hidden">
              <div className="border-b border-violet-100 p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${getStatusStyle(selectedConflict.resolutionStatus)}`}>
                    {getStatusLabel(selectedConflict.resolutionStatus)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500">
                    {selectedConflict.severity.toLowerCase()} priority
                  </span>
                </div>

                <h3 className="text-xl font-black leading-snug text-slate-950">
                  {selectedConflict.description}
                </h3>

                {onNavigateToQA && (
                  <button
                    onClick={() => onNavigateToQA(getSuggestedQuestion(selectedConflict))}
                    className="tg-primary-btn mt-4 px-5 py-3"
                  >
                    <span>Ask about this conflict</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <h4 className="mb-2 text-sm font-black text-slate-900">What happened</h4>
                  <p className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4 text-sm leading-relaxed text-slate-700">
                    {selectedConflict.explanation}
                  </p>
                </div>

                {selectedConflict.conflictingStatements && selectedConflict.conflictingStatements.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-black text-slate-900">What each document says</h4>
                    <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-violet-50/70 text-slate-500">
                          <tr>
                            <th className="px-4 py-3 font-black">Document</th>
                            <th className="px-4 py-3 font-black">Rule</th>
                            <th className="px-4 py-3 font-black">Quote</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedConflict.conflictingStatements.map((statement, index) => (
                            <tr key={`${statement.passageId}-${index}`} className="align-top">
                              <td className="px-4 py-4">
                                <div className="font-black text-slate-900">
                                  {getShortTitle(statement.documentTitle)}
                                </div>
                                <div className="mt-1 text-[11px] font-mono text-slate-400">
                                  v{statement.version} | Effective {statement.effectiveFrom}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 font-black text-violet-800">
                                  {statement.ruleValue !== undefined ? statement.ruleValue : 'Not stated'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-slate-700 leading-relaxed">
                                "{statement.quote}"
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedConflict.resolutionJustification && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-black text-emerald-800">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolution note
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {selectedConflict.resolutionJustification}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-3 border-t border-violet-100 pt-5">
                  <button
                    onClick={onRefresh}
                    className="tg-secondary-btn px-5 py-3"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-violet-500" />
                    <span>Refresh list</span>
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
