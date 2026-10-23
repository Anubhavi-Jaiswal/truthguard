import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle,
  Shield,
  Zap
} from 'lucide-react';

interface OverviewProps {
  documentCount: number;
  conflictCount: number;
  onNavigate: (tab: string) => void;
  onRunSample: (q: string) => void;
}

const scenarioCards = [
  {
    title: 'Leave policy',
    subtitle: 'Current entitlement',
    question: 'What is the current casual leave entitlement after April 1, 2025?',
    color: 'from-violet-600 to-purple-700',
    iconBg: 'bg-violet-600'
  },
  {
    title: 'Meal limits',
    subtitle: 'Allowance comparison',
    question: 'What is the daily meal reimbursement limit?',
    color: 'from-violet-600 to-purple-700',
    iconBg: 'bg-violet-600'
  },
  {
    title: 'Password rules',
    subtitle: 'Requirement check',
    question: 'Does the policy require passwords to be changed every 30 days and require uppercase letters?',
    color: 'from-violet-600 to-purple-700',
    iconBg: 'bg-violet-600'
  }
];

const workflowItems = [
  'Ask a policy question',
  'Read the direct answer',
  'Open evidence only when needed'
];

export const Overview: React.FC<OverviewProps> = ({
  documentCount,
  conflictCount,
  onNavigate,
  onRunSample
}) => {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="rounded-[1.5rem] bg-white border border-white shadow-[0_18px_50px_rgba(109,40,217,0.08)] p-4 sm:p-5">
          <div className="grid lg:grid-cols-[1fr_0.8fr] gap-5 items-center">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-700">Workspace</h2>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-200 transition-transform hover:-translate-y-1">
                <div className="absolute -right-10 top-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute right-8 bottom-6 w-20 h-20 rounded-full bg-white/10" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <span className="text-sm font-bold">TruthGuard</span>
                    </div>
                    <span className="text-[11px] font-semibold bg-white/15 px-2 py-1 rounded-full">Policy review</span>
                  </div>
                  <div className="mt-9 text-2xl font-black leading-tight max-w-sm">
                    Review policy changes before teams rely on them
                  </div>
                  <button
                    onClick={() => onNavigate('qa')}
                    className="mt-5 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-violet-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-violet-50"
                  >
                    Ask a question
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('documents')}
                  className="rounded-2xl p-4 bg-violet-50 hover:bg-violet-100 text-left transition-all hover:-translate-y-1"
                >
                  <FileText className="w-5 h-5 text-violet-600 mb-3" />
                  <div className="text-3xl font-black text-violet-600">{documentCount}</div>
                  <p className="text-[11px] font-semibold text-slate-500">Indexed documents</p>
                </button>
                <button
                  onClick={() => onNavigate('conflicts')}
                  className="rounded-2xl p-4 bg-fuchsia-50 hover:bg-fuchsia-100 text-left transition-all hover:-translate-y-1"
                >
                  <AlertTriangle className="w-5 h-5 text-fuchsia-600 mb-3" />
                  <div className="text-3xl font-black text-fuchsia-600">{conflictCount}</div>
                  <p className="text-[11px] font-semibold text-slate-500">Open conflicts</p>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Ask from your documents</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Get a direct answer and open the document evidence when needed.
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white border border-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-700">Sample questions</h2>
              <p className="text-[11px] text-slate-400">Tap one to try it.</p>
            </div>
            <HelpCircle className="w-4 h-4 text-violet-500" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {scenarioCards.map((card) => (
              <button
                key={card.title}
                onClick={() => onRunSample(card.question)}
                className="group rounded-2xl bg-slate-50 border border-slate-100 p-3 text-left transition-all hover:-translate-y-1 hover:bg-white hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 shrink-0 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md shadow-violet-200`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold text-slate-800">{card.title}</h3>
                      <ArrowRight className="w-4 h-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{card.subtitle}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{card.question}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
            <h3 className="text-sm font-bold text-slate-800">How it works</h3>
            <div className="mt-3 space-y-2">
              {workflowItems.map((item, index) => (
                <div key={item} className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-black text-violet-600 shadow-sm">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-[1.5rem] bg-white border border-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-700">Recent activity</h2>
              <p className="text-[11px] text-slate-400">Recent policy verification events</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-5 pb-3 font-semibold">Item</th>
                  <th className="px-5 pb-3 font-semibold">Type</th>
                  <th className="px-5 pb-3 font-semibold">Date</th>
                  <th className="px-5 pb-3 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ['Leave policy amendment', 'Supersession', '23 Oct 2026', 'Resolved'],
                  ['Meal reimbursement manual', 'Conflict', '21 Oct 2026', 'Review'],
                  ['Password standard', 'Unsupported', '19 Oct 2026', 'Flagged'],
                  ['Laptop encryption rule', 'Evidence', '18 Oct 2026', 'Verified']
                ].map(([receiver, type, date, status]) => (
                  <tr key={receiver} className="hover:bg-violet-50/60 transition-colors">
                    <td className="px-5 py-3 font-semibold text-slate-700">{receiver}</td>
                    <td className="px-5 py-3 text-slate-400">{type}</td>
                    <td className="px-5 py-3 text-slate-400">{date}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
