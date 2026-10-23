import React from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Files, 
  AlertTriangle, 
  FlaskConical, 
  Cpu, 
  Activity
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  documentCount: number;
  conflictCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  documentCount,
  conflictCount
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'qa', label: 'Ask TruthGuard', icon: HelpCircle },
    { id: 'documents', label: 'Document Library', icon: Files, badge: documentCount },
    { id: 'conflicts', label: 'Conflict Explorer', icon: AlertTriangle, badge: conflictCount, badgeAlert: conflictCount > 0 },
    { id: 'testbench', label: 'Test Bench', icon: FlaskConical },
    { id: 'system', label: 'Engine & Settings', icon: Cpu }
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-blue to-electric-violet flex items-center justify-center shadow-lg shadow-electric-blue/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              TruthGuard
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-electric-violet/20 text-electric-violet border border-electric-violet/30">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Multi-Agent Verification</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-electric-violet/15 text-white border border-electric-violet/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-electric-blue' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    item.badgeAlert 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-navy-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Active Architecture</span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            4 Agents Active
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400 font-mono">
          <div className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">1. Retriever</div>
          <div className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">2. Synthesizer</div>
          <div className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">3. Critic</div>
          <div className="px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50">4. Resolver</div>
        </div>
      </div>
    </aside>
  );
};
