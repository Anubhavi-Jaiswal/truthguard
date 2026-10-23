import React from 'react';
import {
  Shield,
  HelpCircle, 
  Files, 
  AlertTriangle, 
  FlaskConical, 
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
  void documentCount;
  void conflictCount;

  const menuItems = [
    { id: 'overview', label: 'System Overview', icon: LayoutDashboard },
    { id: 'qa', label: 'Verification Console', icon: HelpCircle },
    { id: 'documents', label: 'Document Library', icon: Files },
    { id: 'conflicts', label: 'Conflict Registry', icon: AlertTriangle },
    { id: 'testbench', label: 'Adversarial Bench', icon: FlaskConical }
  ];

  return (
    <aside className="flex w-20 md:w-64 bg-white/95 border-r border-violet-100 flex-col justify-between shrink-0 h-full sticky top-0 select-none z-20">
      <div>
        <div className="h-20 px-3 md:px-5 flex items-center justify-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden md:block">
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-none">
                TRUTHGUARD
              </span>
            </div>
          </div>
        </div>

        <div className="px-4">
          <span className="hidden md:block px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-2">
            Workspace
          </span>
          <nav className="space-y-1.5">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`group w-full flex items-center justify-center md:justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 shadow-sm'
                      : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-violet-600' : 'text-slate-300'}`} />
                    <span className="hidden md:inline">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="hidden md:block h-4" />
    </aside>
  );
};
