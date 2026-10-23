import React from 'react';
import { 
  Shield, 
  HelpCircle, 
  Files, 
  AlertTriangle, 
  FlaskConical, 
  Settings, 
  LayoutDashboard
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
    { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
    { id: 'qa', label: 'Verification Console', icon: HelpCircle },
    { id: 'documents', label: 'Document Library', icon: Files, badge: documentCount },
    { id: 'conflicts', label: 'Conflict Registry', icon: AlertTriangle, badge: conflictCount, badgeAlert: conflictCount > 0 },
    { id: 'testbench', label: 'Adversarial Bench', icon: FlaskConical },
    { id: 'system', label: 'Engine & Settings', icon: Settings }
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-slate-900 block leading-none">
                TruthGuard
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Policy Verification</span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            v1.0
          </span>
        </div>

        {/* Navigation */}
        <div className="p-3">
          <span className="px-2 text-[10px] font-semibold tracking-wider uppercase text-slate-400 block mb-1.5">
            Workspace
          </span>
          <nav className="space-y-0.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      item.badgeAlert 
                        ? 'bg-amber-100 text-amber-800 font-bold' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-medium text-slate-700">Logical Agents</span>
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            4 Active
          </span>
        </div>
        <div className="space-y-1 font-mono text-[10px] text-slate-600">
          <div className="flex justify-between py-0.5 border-b border-slate-200/60">
            <span>1. Retriever</span>
            <span className="text-slate-400">BM25</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-slate-200/60">
            <span>2. Synthesizer</span>
            <span className="text-slate-400">Claims</span>
          </div>
          <div className="flex justify-between py-0.5 border-b border-slate-200/60">
            <span>3. Critic</span>
            <span className="text-slate-400">Adversary</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>4. Resolver</span>
            <span className="text-slate-400">Precedence</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
