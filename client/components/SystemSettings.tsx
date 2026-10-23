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
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-base font-semibold text-slate-900">Engine Configuration & Settings</h2>
        <p className="text-xs text-slate-500">
          Execution parameters, model integrations, and verification rule engine properties.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Active Runtime State
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase">Execution Mode</span>
              <span className="text-sm font-semibold text-slate-900">{mode}</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase">Inference Provider</span>
              <span className="text-sm font-semibold text-slate-900">{provider}</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase">Engine Identifier</span>
              <span className="text-sm font-semibold text-slate-900">{model}</span>
            </div>
          </div>
        </div>

        {/* Configuration Guide */}
        <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Key className="w-3.5 h-3.5 text-slate-600" />
            <span>LLM Backend Environment Variables</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            TruthGuard operates fully in <strong>Deterministic Demo Engine Mode</strong> without external dependencies. To enable live LLM inference, configure one of the following in your environment:
          </p>
          <div className="p-2.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-700 space-y-0.5">
            <div>OPENAI_API_KEY=sk-...</div>
            <div>GEMINI_API_KEY=AIza...</div>
          </div>
          <p className="text-[11px] text-slate-500">
            API keys are never transmitted to the browser or stored client-side.
          </p>
        </div>

        {/* Safety Guarantees */}
        <div className="p-3.5 rounded border border-emerald-200 bg-emerald-50/50 text-xs space-y-1.5 text-slate-700">
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
