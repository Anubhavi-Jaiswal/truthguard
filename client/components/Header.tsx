import React from 'react';
import { Database, ShieldCheck, Cpu } from 'lucide-react';
import { ExecutionMode } from '../../shared/types';

interface HeaderProps {
  mode: ExecutionMode;
  systemProvider: string;
  systemModel: string;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  systemProvider,
  systemModel
}) => {
  return (
    <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span>Workspace:</span>
          <span className="font-semibold text-slate-900">Policy Corpus</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono border border-slate-200">
            HR • Security • Finance
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-[11px] font-mono text-slate-700">
          <Cpu className="w-3 h-3 text-slate-500" />
          <span>Engine:</span>
          <strong className="text-slate-900">{mode === 'LIVE_AI' ? systemModel : 'Deterministic Rules'}</strong>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-200 bg-emerald-50 text-[11px] font-medium text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Audit-Verified</span>
        </div>
      </div>
    </header>
  );
};
