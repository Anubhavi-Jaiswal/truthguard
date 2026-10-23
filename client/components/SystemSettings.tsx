import React, { useState } from 'react';
import { Cpu, Key, ShieldCheck, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-electric-blue" />
          Engine Status & API Integration
        </h2>
        <p className="text-sm text-slate-400">
          Inspect execution parameters, LLM backend connectivity, and deterministic verification rules.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-navy-900 border border-slate-800 space-y-6">
        <div className="space-y-4">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-400">
            Active Verification Engine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-4 rounded-lg bg-navy-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Execution Mode</span>
              <span className="text-base font-bold text-electric-blue">{mode}</span>
            </div>
            <div className="p-4 rounded-lg bg-navy-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Provider</span>
              <span className="text-base font-bold text-slate-200">{provider}</span>
            </div>
            <div className="p-4 rounded-lg bg-navy-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Active Model / Engine</span>
              <span className="text-base font-bold text-electric-violet">{model}</span>
            </div>
          </div>
        </div>

        {/* Live AI Configuration Guide */}
        <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Key className="w-4 h-4 text-amber-400" />
            <span>LLM Provider Configuration</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            TruthGuard is engineered to run seamlessly out of the box in <strong>Demo Engine Mode</strong> without requiring external API keys. To enable live external LLM inference, configure your environment variable in your production server environment or <code>.env</code> file:
          </p>
          <div className="p-3 rounded bg-navy-900 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
            <div># OpenAI</div>
            <div>OPENAI_API_KEY=sk-...</div>
            <div className="pt-1"># Or Google Gemini / Anthropic</div>
            <div>GEMINI_API_KEY=AIza...</div>
          </div>
          <p className="text-[11px] text-slate-400">
            TruthGuard never exposes API keys to client browsers. All token generation occurs strictly inside the backend pipeline.
          </p>
        </div>

        {/* Safe Operational Principles */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2 text-emerald-200">
          <div className="font-bold flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>TruthGuard AI Safety & Provenance Commitments</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>Zero-Hallucination Policy: Missing evidence triggers an honest <code>INSUFFICIENT_EVIDENCE</code> refusal.</li>
            <li>Adversarial Content Quarantine: Document text is parsed as untrusted evidence, neutralizing prompt injections.</li>
            <li>Chronological Integrity: Effective-date amendments are strictly enforced without retroactive leakage.</li>
            <li>Precedence Transparency: Contradictory documents without clear authority are flagged as <code>UNRESOLVED</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
