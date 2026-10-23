import React from 'react';
import { Database, ShieldAlert, Cpu } from 'lucide-react';
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
    <header className="h-16 border-b border-slate-800 bg-navy-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700/60">
          <Database className="w-3.5 h-3.5 text-electric-blue" />
          <span>Workspace: <strong className="text-slate-200">Enterprise Policy Demo</strong></span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="text-xs text-slate-400 hidden sm:block">
          Synthetic Corpus Active (HR, IT Security & Travel Reimbursement)
        </div>
      </div>

      <div className="flex items-center gap-3">
        {mode === 'LIVE_AI' ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE AI: {systemModel}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-electric-violet/10 border border-electric-violet/30 text-electric-violet text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>DEMO ENGINE (Deterministic Rule & Precedence Proof)</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-200">Audit Ready</span>
        </div>
      </div>
    </header>
  );
};
