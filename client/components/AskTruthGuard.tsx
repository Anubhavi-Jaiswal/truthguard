import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  RotateCcw, 
  ShieldAlert,
  Loader2,
  FileCheck2,
  HelpCircle
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
    { label: 'Password Policy (Contradiction & Best Practice)', q: 'Does the policy require passwords to be changed every 30 days and require uppercase letters?' },
    { label: 'Laptop Encryption (Irrelevant Newer Policy)', q: 'Which policy governs laptop encryption?' },
    { label: 'Missing Evidence (Refusal to Hallucinate)', q: 'What is the company sabbatical policy for employees with 10 years of service?' }
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
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Document Verification Console</h2>
          <p className="text-xs text-slate-500">
            Query across enterprise policy records. TruthGuard retrieves exact passages, extracts claims, detects contradictions, and justifies resolutions.
          </p>
        </div>
      </div>

      {/* Query Bar Card */}
      <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery(question);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter a policy question to audit (e.g., What is the daily meal reimbursement limit?)..."
              className="w-full bg-slate-50 border border-slate-300 rounded pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Query</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Example Questions Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Preset Scenarios:</span>
          {exampleQuestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleRunQuery(item.q)}
              className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/60 font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 rounded border border-rose-200 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
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

      {/* Audit disclaimer */}
      <div className="p-3 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>
          Compliance Notice: Verification is deterministic and grounded strictly in the indexed corpus. TruthGuard reports irresolvable contradictions rather than selecting arbitrary winners.
        </span>
        <button
          onClick={() => handleRunQuery('What is the current casual leave entitlement after April 1, 2025?')}
          className="text-slate-900 font-semibold hover:underline whitespace-nowrap ml-4"
        >
          Run Leave Supersession Audit →
        </button>
      </div>
    </div>
  );
};
