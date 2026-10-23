import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  HelpCircle,
  ListChecks
} from 'lucide-react';
import { VerificationResult, VerificationStatus } from '../../shared/types';

interface VerificationDisplayProps {
  result: VerificationResult;
  loading: boolean;
  onSelectDocument?: (docId: string) => void;
}

const getStatusBadge = (status: VerificationStatus) => {
  switch (status) {
    case 'VERIFIED':
      return {
        label: 'Verified',
        helper: 'The documents support this answer.',
        icon: CheckCircle2,
        className: 'bg-emerald-50 text-emerald-800 border-emerald-100'
      };
    case 'CONFLICT_DETECTED':
      return {
        label: 'Conflict found',
        helper: 'The documents disagree on something important.',
        icon: AlertOctagon,
        className: 'bg-rose-50 text-rose-800 border-rose-100'
      };
    case 'PARTIALLY_VERIFIED':
      return {
        label: 'Partially verified',
        helper: 'Some parts are supported, but one or more need a closer look.',
        icon: AlertTriangle,
        className: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-100'
      };
    case 'INSUFFICIENT_EVIDENCE':
    default:
      return {
        label: 'Not enough evidence',
        helper: 'The documents do not give enough support for a confident answer.',
        icon: HelpCircle,
        className: 'bg-slate-100 text-slate-800 border-slate-200'
      };
  }
};

const getClaimLabel = (status: string) => {
  if (status === 'SUPPORTED') return 'Supported';
  if (status === 'CONTRADICTED') return 'Contradicted';
  if (status === 'PARTIALLY_SUPPORTED') return 'Partly supported';
  return 'Unsupported';
};

const getClaimStyle = (status: string) => {
  if (status === 'SUPPORTED') return 'bg-emerald-50 text-emerald-800 border-emerald-100';
  if (status === 'CONTRADICTED') return 'bg-rose-50 text-rose-800 border-rose-100';
  return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-100';
};

export const VerificationDisplay: React.FC<VerificationDisplayProps> = ({
  result,
  onSelectDocument
}) => {
  const status = getStatusBadge(result.overallStatus);
  const StatusIcon = status.icon;
  const supportedCount = result.claims.filter((claim) => claim.status === 'SUPPORTED').length;
  const attentionCount = result.claims.length - supportedCount;

  return (
    <div className="space-y-4">
      <section className="tg-panel p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold leading-tight text-slate-950">Here's the answer</h2>
            <p className="mt-1 text-sm text-slate-500">{status.helper}</p>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.className}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="whitespace-pre-wrap text-base font-medium leading-7 text-slate-900">
            {result.answer}
          </p>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold text-slate-400">Question</p>
          <p className="mt-1 text-sm font-bold leading-relaxed text-slate-800">{result.question}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-slate-50 px-3 py-1.5">{result.claims.length} points checked</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">{supportedCount} supported</span>
          {attentionCount > 0 && (
            <span className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-fuchsia-700">{attentionCount} need review</span>
          )}
          <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">{result.citedSources.length} sources</span>
        </div>

        {result.resolutionExplanation && (
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="mb-1 text-sm font-bold text-slate-900">Why</p>
            <p className="text-sm leading-relaxed text-slate-700">{result.resolutionExplanation}</p>
          </div>
        )}
      </section>

      {result.conflicts.length > 0 && (
        <section className="tg-panel border-rose-100 bg-rose-50/40 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Needs review</h3>
              <p className="text-xs text-slate-500">The documents disagree on the items below.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.conflicts.map((conflict) => (
              <article key={conflict.id} className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{conflict.description}</h4>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-800">
                    {conflict.resolutionStatus}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{conflict.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <details className="tg-panel group p-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-violet-600" />
            <span>
              <span className="block text-sm font-bold text-slate-900">How this was checked</span>
              <span className="block text-xs text-slate-400">Open this to see each point behind the answer.</span>
            </span>
          </span>
          <ChevronRight className="w-4 h-4 text-slate-400 transition group-open:rotate-90" />
        </summary>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.claims.map((claim, index) => (
            <article key={claim.id} className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Point {index + 1}</p>
                  <h4 className="mt-1 text-sm font-bold leading-snug text-slate-900">{claim.text}</h4>
                </div>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getClaimStyle(claim.status)}`}>
                  {getClaimLabel(claim.status)}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600">{claim.explanation}</p>
            </article>
          ))}
        </div>
      </details>

      {result.citedSources.length > 0 && (
        <details className="tg-panel group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-600" />
              <span>
                <span className="block text-sm font-bold text-slate-900">Documents used</span>
                <span className="block text-xs text-slate-400">Open this if you want to read the supporting text.</span>
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 transition group-open:rotate-90" />
          </summary>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.citedSources.map((citation, idx) => (
              <article
                key={`${citation.passageId}-${idx}`}
                className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4 text-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3 border-b border-violet-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-2">
                      {citation.documentTitle}
                    </h4>
                    <p className="mt-1 font-mono text-[10px] text-slate-400">
                      v{citation.version} | Effective {citation.effectiveFrom}
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed text-slate-700">"{citation.quote}"</p>

                {onSelectDocument && (
                  <button
                    onClick={() => onSelectDocument(citation.documentId)}
                    className="font-bold text-violet-700 hover:text-violet-800 flex items-center gap-1"
                  >
                    View in library <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </article>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};
