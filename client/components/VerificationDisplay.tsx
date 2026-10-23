import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  AlertOctagon,
  Clock,
  Sparkles,
  Layers,
  ArrowRight
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>VERIFIED CLAIM</span>
          </div>
        );
      case 'CONFLICT_DETECTED':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 font-semibold text-sm">
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
            <span>IRRESOLVABLE CONFLICT DETECTED</span>
          </div>
        );
      case 'PARTIALLY_VERIFIED':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>PARTIALLY VERIFIED</span>
          </div>
        );
      case 'INSUFFICIENT_EVIDENCE':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/40 border border-slate-600/50 text-slate-300 font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>INSUFFICIENT EVIDENCE</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Stages Progress Card */}
      <div className="p-4 rounded-xl bg-navy-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-electric-blue" />
            <span>Multi-Agent Verification Pipeline Execution</span>
          </div>
          {result.metadata && (
            <span className="font-mono text-slate-400">
              Total Duration: {result.metadata.processingTimeMs}ms
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {result.verificationStages.map((stage, idx) => (
            <div
              key={stage.id}
              className={`p-3 rounded-lg border text-xs transition-all ${
                stage.status === 'completed'
                  ? 'bg-slate-800/40 border-slate-700/80 text-slate-200'
                  : stage.status === 'running'
                  ? 'bg-electric-violet/10 border-electric-violet/50 text-white animate-pulse'
                  : 'bg-navy-950/40 border-slate-800/50 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] text-slate-400">Agent {idx + 1}</span>
                <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                  stage.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {stage.status}
                </span>
              </div>
              <div className="font-medium text-slate-200">{stage.agent}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{stage.summary || stage.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer & Overall Verdict */}
      <div className="p-6 rounded-xl bg-navy-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Question</span>
            <h2 className="text-lg font-bold text-white">{result.question}</h2>
          </div>
          {getStatusBadge(result.overallStatus)}
        </div>

        {/* Formulated Verified Answer */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
            Synthesized Answer
          </span>
          <div className="p-4 rounded-lg bg-navy-950/70 border border-slate-800 text-slate-200 leading-relaxed text-sm whitespace-pre-wrap font-normal">
            {result.answer}
          </div>
        </div>

        {/* Resolution Justification / Explanation */}
        {result.resolutionExplanation && (
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/60 space-y-1 text-xs">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span>TruthGuard Governance Justification</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              {result.resolutionExplanation}
            </p>
          </div>
        )}
      </div>

      {/* Conflicts & Contradiction Details if any */}
      {result.conflicts.length > 0 && (
        <div className="p-6 rounded-xl bg-red-950/20 border border-red-500/30 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertOctagon className="w-5 h-5" />
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Material Contradictions Detected ({result.conflicts.length})
            </h3>
          </div>

          <div className="space-y-4">
            {result.conflicts.map((conflict) => (
              <div key={conflict.id} className="p-4 rounded-lg bg-navy-900/90 border border-red-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{conflict.description}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                    conflict.resolutionStatus === 'RESOLVED' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {conflict.resolutionStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {conflict.explanation}
                </p>

                {/* Conflicting Statements Side-by-Side */}
                {conflict.conflictingStatements && conflict.conflictingStatements.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {conflict.conflictingStatements.map((stmt, sIdx) => (
                      <div key={sIdx} className="p-3 rounded bg-navy-950 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/60 pb-1">
                          <span className="font-semibold text-electric-blue truncate max-w-[200px]">
                            {stmt.documentTitle}
                          </span>
                          <span className="font-mono">v{stmt.version}</span>
                        </div>
                        <div className="text-slate-200 italic font-serif">
                          "{stmt.quote}"
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                          <span>Effective: {stmt.effectiveFrom}</span>
                          {stmt.ruleValue !== undefined && (
                            <span className="text-amber-400 font-bold">Rule: {stmt.ruleValue}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {conflict.resolutionJustification && (
                  <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                    <strong>Precedence Resolution:</strong> {conflict.resolutionJustification}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim-by-Claim Verification Inspection */}
      <div className="p-6 rounded-xl bg-navy-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
          Atomic Claim Verification Audit
        </h3>

        <div className="space-y-2.5">
          {result.claims.map((claim) => (
            <div 
              key={claim.id} 
              className={`p-3.5 rounded-lg border text-xs flex flex-col gap-1.5 ${
                claim.status === 'SUPPORTED'
                  ? 'bg-slate-800/30 border-slate-700/60'
                  : claim.status === 'CONTRADICTED'
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-100 text-sm">{claim.text}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded font-mono ${
                  claim.status === 'SUPPORTED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : claim.status === 'CONTRADICTED'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {claim.status}
                </span>
              </div>
              <div className="text-slate-400 text-xs">{claim.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Provenance / Cited Sources */}
      {result.citedSources.length > 0 && (
        <div className="p-6 rounded-xl bg-navy-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
            Retrieved Passages & Provenance Citations ({result.citedSources.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.citedSources.map((citation, idx) => (
              <div 
                key={idx} 
                className="p-3.5 rounded-lg bg-navy-950 border border-slate-800 hover:border-slate-700 transition-colors text-xs space-y-2"
              >
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                  <span className="font-semibold text-slate-200 truncate max-w-[240px]">
                    {citation.documentTitle}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    v{citation.version}
                  </span>
                </div>
                <div className="text-slate-300 italic font-serif text-[11px] leading-relaxed">
                  "{citation.quote}"
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Effective: {citation.effectiveFrom}</span>
                  {onSelectDocument && (
                    <button
                      onClick={() => onSelectDocument(citation.documentId)}
                      className="text-electric-blue hover:underline flex items-center gap-1"
                    >
                      View Source <ArrowRight className="w-3 h-3" />
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
