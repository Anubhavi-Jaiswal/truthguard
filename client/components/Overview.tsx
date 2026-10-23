import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  HelpCircle,
  ScanSearch,
  Shield,
  UploadCloud,
  Zap
} from 'lucide-react';

interface OverviewProps {
  documentCount: number;
  conflictCount: number;
  onNavigate: (tab: string) => void;
  onRunSample: (q: string) => void;
}

const outcomeStats = [
  { label: 'Supported answers', value: 72, icon: CheckCircle2, color: 'violet' },
  { label: 'Conflict warnings', value: 31, icon: AlertTriangle, color: 'fuchsia' },
  { label: 'Source coverage', value: 88, icon: ScanSearch, color: 'indigo' }
];

const scenarioCards = [
  {
    title: 'Leave policy',
    subtitle: 'Supersession check',
    question: 'What is the current casual leave entitlement after April 1, 2025?',
    color: 'from-violet-600 to-purple-700'
  },
  {
    title: 'Meal limits',
    subtitle: 'Allowance comparison',
    question: 'What is the daily meal reimbursement limit?',
    color: 'from-fuchsia-500 to-violet-700'
  },
  {
    title: 'Password rules',
    subtitle: 'Unsupported claims',
    question: 'Does the policy require passwords to be changed every 30 days and require uppercase letters?',
    color: 'from-indigo-500 to-violet-600'
  }
];

export const Overview: React.FC<OverviewProps> = ({
  documentCount,
  conflictCount,
  onNavigate,
  onRunSample
}) => {
  return (
    <div className="space-y-7">
      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="rounded-[1.5rem] bg-white border border-white shadow-[0_18px_50px_rgba(109,40,217,0.08)] p-4 sm:p-6">
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-6 items-center">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-700">Weekly review</h2>
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
                    <span className="text-[11px] font-semibold bg-white/15 px-2 py-1 rounded-full">POLICY REVIEW</span>
                  </div>
                  <div className="mt-9 text-2xl font-black leading-tight max-w-sm">Review policy changes before teams rely on them</div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-2">
                  <span>Weekly verification limit</span>
                  <span>{Math.min(documentCount * 8, 96)} / 100 scans</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[68%] rounded-full bg-violet-600" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">Verified coverage</p>
                    <p className="text-3xl font-black text-slate-900">98.7%</p>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-slate-100 p-1 flex justify-end">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('qa')}
                  className="w-full rounded-full bg-slate-950 hover:bg-slate-800 text-white py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Open verification console</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {scenarioCards.map((card) => (
              <button
                key={card.title}
                onClick={() => onRunSample(card.question)}
                className="group rounded-2xl bg-white border border-white shadow-[0_14px_36px_rgba(15,23,42,0.08)] p-4 text-left transition-all hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md mb-4`}>
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">{card.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1">{card.subtitle}</p>
                <ArrowRight className="w-4 h-4 text-slate-300 mt-4 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          <div className="rounded-[1.5rem] bg-white border border-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-slate-700">Outcome Statistics</h2>
              <CheckCircle2 className="w-4 h-4 text-violet-500" />
            </div>
            <div className="space-y-4">
              {outcomeStats.map((item) => {
                const Icon = item.icon;
                const bar = item.color === 'violet'
                  ? 'bg-violet-500'
                  : item.color === 'fuchsia'
                    ? 'bg-fuchsia-500'
                    : 'bg-indigo-500';
                const tile = item.color === 'violet'
                  ? 'bg-violet-50 text-violet-600'
                  : item.color === 'fuchsia'
                    ? 'bg-fuchsia-50 text-fuchsia-600'
                    : 'bg-indigo-50 text-indigo-600';
                return (
                  <div key={item.label} className="grid grid-cols-[2rem_1fr_2.5rem] gap-3 items-center">
                    <div className={`w-8 h-8 rounded-xl ${tile} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${bar}`} style={{ width: `${item.value}%` }} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{item.label}</p>
                    </div>
                    <span className="text-sm font-black text-slate-700">{item.value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_0.68fr] gap-6">
        <div className="rounded-[1.5rem] bg-white border border-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-700">Recent activity</h2>
              <p className="text-[11px] text-slate-400">Recent policy verification events</p>
            </div>
            <button
              onClick={() => onNavigate('conflicts')}
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
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

        <div className="rounded-[1.5rem] bg-white border border-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] p-5">
          <h2 className="text-sm font-bold text-slate-700">Quick actions</h2>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {['A', 'M', 'J', 'R', 'S'].map((item, idx) => (
                <div
                  key={item}
                  className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-black text-white ${
                    ['bg-violet-600', 'bg-fuchsia-500', 'bg-indigo-500', 'bg-slate-500', 'bg-purple-400'][idx]
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <button
              onClick={() => onNavigate('documents')}
              className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 flex items-center justify-center transition-colors"
              title="Add document"
            >
              <UploadCloud className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <button
              onClick={() => onNavigate('qa')}
              className="rounded-full border border-violet-100 bg-violet-50 text-violet-700 px-4 py-3 text-left text-xs font-bold hover:bg-violet-100 transition-colors"
            >
              Ask a policy question
            </button>
            <button
              onClick={() => onNavigate('qa')}
              className="rounded-full bg-violet-600 hover:bg-violet-700 text-white px-5 text-xs font-black transition-colors shadow-lg shadow-violet-200"
            >
              Send
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-gradient-to-br from-violet-700 to-fuchsia-600 text-white p-5 min-h-28 flex flex-col justify-between overflow-hidden relative">
            <CalendarDays className="absolute right-4 top-4 w-14 h-14 text-white/15" />
            <div className="relative text-[11px] font-semibold text-white/75">Next audit cycle</div>
            <button
              onClick={() => onNavigate('testbench')}
              className="relative text-left text-lg font-black flex items-center gap-2"
            >
              <span>Run benchmark suite</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
