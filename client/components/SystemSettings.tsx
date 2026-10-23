import React, { useState } from 'react';
import { Cpu, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SystemSettingsProps {
  mode: string;
  provider: string;
  model: string;
  onRefresh: () => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({
  mode,
  provider,
  model,
  onRefresh
}) => {
  return (
    <div className="tg-page-narrow">
      <div className="tg-page-header">
        <div>
        <h2 className="tg-title">Engine Configuration & Settings</h2>
        <p className="tg-subtitle">
          Execution parameters, model integrations, and verification rule engine properties.
        </p>
        </div>
        <button onClick={onRefresh} className="tg-secondary-btn px-4 py-2">
          Refresh state
        </button>
      </div>

      <div className="tg-panel p-5 space-y-5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Active Runtime State
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100">
              <span className="text-slate-500 block text-[10px] uppercase">Execution Mode</span>
              <span className="text-sm font-semibold text-slate-900">{mode}</span>
            </div>
            <div className="p-4 rounded-2xl bg-fuchsia-50 border border-fuchsia-100">
              <span className="text-slate-500 block text-[10px] uppercase">Inference Provider</span>
              <span className="text-sm font-semibold text-slate-900">{provider}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-slate-500 block text-[10px] uppercase">Engine Identifier</span>
              <span className="text-sm font-semibold text-slate-900">{model}</span>
            </div>
          </div>
        </div>

        {/* Configuration Guide */}
        <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Key className="w-3.5 h-3.5 text-slate-600" />
            <span>Backend Environment Variables</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            TruthGuard can run with the local deterministic rules engine without external services. If your deployment uses an external backend provider, configure credentials on the server only.
          </p>
          <div className="p-3 rounded-2xl bg-white border border-white text-[11px] font-mono text-slate-700 space-y-0.5 shadow-sm">
            <div>PROVIDER_API_KEY=...</div>
            <div>PROVIDER_MODEL=...</div>
          </div>
          <p className="text-[11px] text-slate-500">
            API keys are never transmitted to the browser or stored client-side.
          </p>
        </div>

        {/* Safety Guarantees */}
        <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 text-xs space-y-1.5 text-slate-700">
          <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Core Verification Guarantees</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
            <li><strong>Zero Hallucination:</strong> Missing knowledge returns an honest <code>INSUFFICIENT_EVIDENCE</code> refusal.</li>
            <li><strong>Adversarial Neutralization:</strong> Documents are treated strictly as untrusted data, isolating injection attempts.</li>
            <li><strong>Chronological Accuracy:</strong> Policy amendments respect explicit effective dates without retroactive application.</li>
            <li><strong>Precedence Honesty:</strong> Competing documents without hierarchy metadata are classified as <code>UNRESOLVED</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
