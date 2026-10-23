import React, { useState } from 'react';
import {
  FileCheck2,
  HelpCircle,
  Loader2,
  RotateCcw,
  Search,
  Send,
  ShieldAlert
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
    { label: 'Current leave entitlement', q: 'What is the current casual leave entitlement after April 1, 2025?' },
    { label: 'Leave before April 2025', q: 'What was the casual leave entitlement before April 2025?' },
    { label: 'Meal reimbursement limit', q: 'What is the daily meal reimbursement limit?' },
    { label: 'Password rotation rule', q: 'Does the policy require passwords to be changed every 30 days and require uppercase letters?' },
    { label: 'Laptop encryption policy', q: 'Which policy governs laptop encryption?' },
    { label: 'Sabbatical evidence check', q: 'What is the company sabbatical policy for employees with 10 years of service?' }
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
      setError(err.message || 'Failed to verify this question.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResult(null);
    setError(null);
  };

  const handleSelectExample = (queryText: string) => {
    setQuestion(queryText);
    setResult(null);
    setError(null);
  };

  return (
    <div className="tg-page">
      <div className="tg-page-header">
        <div>
          <h2 className="tg-title">Ask about a policy</h2>
          <p className="tg-subtitle">
            Get a clear answer from the documents, with the details available when you need them.
          </p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-full bg-violet-600 text-white items-center justify-center shadow-lg shadow-violet-200">
          <HelpCircle className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_20rem] gap-5 items-start">
        <section className="tg-panel p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Your question</h3>
            <p className="text-xs text-slate-400 mt-1">
              Type it naturally. The answer will only use the uploaded documents.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunQuery(question);
            }}
            className="space-y-3"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-violet-400 absolute left-4 top-4" />
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: What is the daily meal reimbursement limit?"
                className="w-full min-h-28 resize-none rounded-2xl border border-violet-100 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="tg-secondary-btn px-4 py-2.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-violet-500" />
                <span>Clear</span>
              </button>
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="tg-primary-btn px-5 py-2.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Get answer</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3 rounded-2xl border border-rose-100 bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </section>

        <aside className="tg-panel p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Common questions</h3>
            <p className="text-xs text-slate-400 mt-1">Pick one to fill the question box.</p>
          </div>

          <div className="space-y-2">
            {exampleQuestions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectExample(item.q)}
                className="w-full rounded-2xl border border-violet-100 bg-white px-3 py-3 text-left text-xs font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {result ? (
        <VerificationDisplay
          result={result}
          loading={loading}
          onSelectDocument={onSelectDocument}
        />
      ) : (
        <div className="tg-panel p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900">No question checked yet</h3>
          <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-slate-400">
            Enter a question or choose an example, then click Get answer. The answer will appear first, with details below it.
          </p>
        </div>
      )}
    </div>
  );
};
