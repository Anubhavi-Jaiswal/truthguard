import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Sparkles, 
  Compass, 
  RotateCcw, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { VerificationResult } from '../../shared/types';
import { VerificationDisplay } from './VerificationDisplay';

interface AskTruthGuardProps {
  onSelectDocument: (docId: string) => void;
}

export const AskTruthGuard: React.FC<AskTruthGuardProps> = ({ onSelectDocument }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const exampleQuestions = [
    { label: 'Leave Entitlement (Explicit Supersession)', q: 'What is the current casual leave entitlement after April 1, 2025?' },
    { label: 'Leave Entitlement (Effective-Date Boundary)', q: 'What was the casual leave entitlement before April 2025?' },
    { label: 'Meal Reimbursement (Unresolved Contradiction)', q: 'What is the daily meal reimbursement limit?' },
    { label: 'Password Policy (Unsupported Claim & Contradiction)', q: 'Does the policy require passwords to be changed every 30 days and require uppercase letters?' },
    { label: 'Laptop Encryption (Irrelevant Newer Document Isolation)', q: 'Which policy governs laptop encryption?' },
    { label: 'Missing Evidence (Negative Knowledge Check)', q: 'What is the company sabbatical policy for employees with 10 years of service?' }
  ];

  const handleRunQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);
    setQuestion(queryText);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText.trim() })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to execute query verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-electric-blue" />
          Multi-Agent Policy Verification Workspace
        </h2>
        <p className="text-sm text-slate-400">
          Submit any policy query. TruthGuard activates four agents (Retriever, Synthesizer, Critic, Resolver) to detect cross-document contradictions and verify provenance before providing an answer.
        </p>
      </div>

      {/* Query Input Box */}
      <div className="p-4 rounded-xl bg-navy-900 border border-slate-800 shadow-xl space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery(question);
          }}
          className="relative"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a policy question (e.g. What is the daily meal reimbursement limit?)..."
            className="w-full bg-navy-950 border border-slate-700/80 rounded-xl px-4 py-3.5 pr-28 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-electric-blue focus:ring-1 focus:ring-electric-blue transition-all"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-gradient-to-r from-electric-blue to-electric-violet hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Example Chips */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Compass className="w-3.5 h-3.5 text-electric-violet" />
            <span>Preloaded Demonstration Scenarios (Click to test):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {exampleQuestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunQuery(item.q)}
                className="text-xs text-left px-3 py-1.5 rounded-lg bg-navy-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <VerificationDisplay
          result={result}
          loading={loading}
          onSelectDocument={onSelectDocument}
        />
      )}

      {/* Synthetic Corpus Notice */}
      <div className="p-3.5 rounded-lg bg-navy-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>
          🛡️ <strong>Demo Workspace Note:</strong> TruthGuard operates on a bundled synthetic enterprise policy corpus. Verification quality depends strictly on available documented provenance.
        </span>
        <button
          onClick={() => handleRunQuery('What is the current casual leave entitlement after April 1, 2025?')}
          className="text-electric-blue hover:underline whitespace-nowrap text-[11px]"
        >
          Quick Run Scenario 1 →
        </button>
      </div>
    </div>
  );
};
