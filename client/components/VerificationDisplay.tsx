import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  AlertOctagon,
  FileText,
  Clock,
  Layers,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VerificationResult, VerificationStatus } from '../../shared/types';

interface VerificationDisplayProps {
  result: VerificationResult;
  loading: boolean;
  onSelectDocument?: (docId: string) => void;
}

export const VerificationDisplay: React.FC<VerificationDisplayProps> = ({
  result,
  loading,
  onSelectDocument
}) => {
  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified
          </span>
        );
      case 'CONFLICT_DETECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            Conflict Detected (Unresolved)
          </span>
        );
      case 'PARTIALLY_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Partially Verified
          </span>
        );
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            Insufficient Evidence
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* 4-Agent Pipeline Execution Strip */}
      <div className="bg-white border border-slate-200 rounded p-3">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Verification Pipeline Execution</span>
          </div>
          {result.metadata && (
            <span className="font-mono text-[11px] text-slate-400">
              Completed in {result.metadata.processingTimeMs}ms
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {result.verificationStages.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-2.5 rounded border border-slate-200 bg-slate-50 text-xs"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                <span>Agent {idx + 1}</span>
                <span className="font-semibold text-slate-600 uppercase">{stage.status}</span>
              </div>
              <div className="font-semibold text-slate-900 text-xs">{stage.agent}</div>
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{stage.summary || stage.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Answer & Resolution Box */}
      <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Evaluated Query</span>
            <h2 className="text-base font-semibold text-slate-900">{result.question}</h2>
          </div>
          <div>{getStatusBadge(result.overallStatus)}</div>
        </div>

        {/* Synthesized Response */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Formulated Answer</span>
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
            {result.answer}
          </div>
        </div>

        {/* Legal/Precedence Justification */}
        {result.resolutionExplanation && (
          <div className="p-3 rounded border border-slate-200 bg-white text-xs space-y-1">
            <span className="font-semibold text-slate-800 block">Governance & Precedence Justification</span>
            <p className="text-slate-600 leading-relaxed">
              {result.resolutionExplanation}
            </p>
          </div>
        )}
      </div>

      {/* Contradictions Breakdown (Side by Side) if detected */}
      {result.conflicts.length > 0 && (
        <div className="bg-white border border-rose-200 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 border-b border-rose-100 pb-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h3 className="font-semibold text-xs uppercase tracking-wider">
              Material Contradictions Detected ({result.conflicts.length})
            </h3>
          </div>

          <div className="space-y-3">
            {result.conflicts.map((conflict) => (
              <div key={conflict.id} className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 text-xs">{conflict.description}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    conflict.resolutionStatus === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {conflict.resolutionStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {conflict.explanation}
                </p>

                {/* Conflicting Statements */}
                {conflict.conflictingStatements && conflict.conflictingStatements.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {conflict.conflictingStatements.map((stmt, sIdx) => (
                      <div key={sIdx} className="p-3 rounded bg-white border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-1">
                          <span className="font-medium text-slate-900 truncate max-w-[200px]">
                            {stmt.documentTitle}
                          </span>
                          <span className="font-mono text-slate-600">v{stmt.version}</span>
                        </div>
                        <div className="text-slate-800 italic leading-snug">
                          "{stmt.quote}"
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                          <span>Effective: {stmt.effectiveFrom}</span>
                          {stmt.ruleValue !== undefined && (
                            <span className="text-slate-900 font-bold">Rule: {stmt.ruleValue}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {conflict.resolutionJustification && (
                  <div className="p-2.5 rounded bg-white border border-emerald-200 text-xs text-emerald-900">
                    <strong className="font-semibold text-emerald-800">Resolution: </strong>
                    {conflict.resolutionJustification}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atomic Claim Verification Audit Table */}
      <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-600">
          Atomic Claim Verification Audit
        </h3>

        <div className="border border-slate-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-2.5 px-3 w-1/2">Deconstructed Claim</th>
                <th className="py-2.5 px-3">Verification Status</th>
                <th className="py-2.5 px-3">Agent Audit Finding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {result.claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{claim.text}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      claim.status === 'SUPPORTED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : claim.status === 'CONTRADICTED'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{claim.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cited Document Passages */}
      {result.citedSources.length > 0 && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-600">
            Retrieved Passages & Provenance ({result.citedSources.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.citedSources.map((citation, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded border border-slate-200 bg-slate-50 hover:bg-white text-xs space-y-2 transition-colors"
              >
                <div className="flex items-center justify-between text-slate-500 border-b border-slate-200 pb-1.5">
                  <span className="font-medium text-slate-900 truncate max-w-[240px]">
                    {citation.documentTitle}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                    v{citation.version}
                  </span>
                </div>
                <div className="text-slate-700 italic text-[11px] leading-relaxed">
                  "{citation.quote}"
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Effective: {citation.effectiveFrom}</span>
                  {onSelectDocument && (
                    <button
                      onClick={() => onSelectDocument(citation.documentId)}
                      className="text-slate-900 font-medium hover:underline flex items-center gap-1"
                    >
                      View in Library <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
