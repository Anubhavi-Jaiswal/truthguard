import React from 'react';
import { Search } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="min-h-20 px-4 sm:px-8 py-4 grid grid-cols-1 xl:grid-cols-[1fr_1.35fr] gap-4 items-center sticky top-0 z-10 bg-white/75 backdrop-blur-xl border-b border-white/70">
      <div>
        <div className="flex items-center gap-2 text-[11px] text-violet-400 font-bold">
          <span>Workspace</span>
          <span className="w-1 h-1 rounded-full bg-violet-500" />
          <span>HR / Security / Finance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
          Dashboard
        </h1>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-300" />
        <input
          className="w-full rounded-full border border-violet-100 bg-white px-11 py-3 text-xs text-slate-700 outline-none shadow-sm placeholder:text-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          placeholder="Search policies, documents, and findings..."
        />
      </div>
    </header>
  );
};
