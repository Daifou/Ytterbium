import React from 'react';
import { AppMode } from '../types';
import {
  Target,
  Wind,
  BarChart2,
  LogOut
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  alienMode: boolean;
  toggleAlienMode: () => void;
  onSignOut: () => void;
  user: User | null;
}

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-all duration-200 text-[13px] font-medium
        ${active ? 'bg-[#1E1E1E] text-[#EAEAEA]' : 'text-[#8A8A8A] hover:bg-[#1E1E1E]/50 hover:text-[#D4D4D4]'}
      `}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-[#EAEAEA]' : 'text-[#8A8A8A] group-hover:text-[#BFBFBF]'}`} />
      <span className="flex-1 text-left">{label}</span>
      {active && <div className="w-1 h-1 rounded-full bg-[#EAEAEA]" />}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, onSignOut, user }) => {

  const isFocus = currentMode === AppMode.FOCUS;
  const isRelax = currentMode === AppMode.RELAX;
  const isStats = currentMode === AppMode.STATS;

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'Y';
  const userName = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <>
      <aside className="fixed left-0 top-0 h-full w-[240px] hidden md:flex flex-col z-50 bg-[#050505] border-r border-white/5 font-sans select-none">

        {/* sidebarHeader */}
        <div className="px-4 h-14 flex items-center border-b border-transparent">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-5 h-5 rounded-[4px] bg-blue-600 flex items-center justify-center text-white">
              <Target className="w-3 h-3" />
            </div>
            <span className="text-[13px] font-semibold text-[#EAEAEA] tracking-tight">Ytterbium</span>
          </div>
        </div>

        {/* sidebarContent */}
        <div className="flex-1 px-2 pt-2">
          <div className="flex flex-col gap-0.5">
            <SidebarItem
              icon={Target}
              label="Focus"
              active={isFocus}
              onClick={() => setMode(AppMode.FOCUS)}
            />
            <SidebarItem
              icon={Wind}
              label="Relax"
              active={isRelax}
              onClick={() => setMode(AppMode.RELAX)}
            />
            <SidebarItem
              icon={BarChart2}
              label="Insights"
              active={isStats}
              onClick={() => setMode(AppMode.STATS)}
            />
          </div>
        </div>

        {/* sidebarFooter */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 hover:bg-[#1E1E1E] p-2 rounded-lg transition-colors w-full group text-left"
            title="Sign Out"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#333] to-[#111] border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-all">
              <span className="text-[9px] font-bold text-[#EAEAEA] tracking-widest">{userInitials}</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[13px] font-medium text-[#EAEAEA] group-hover:text-white transition-colors truncate">
                {userName}
              </span>
            </div>
            <LogOut className="w-3.5 h-3.5 text-[#8A8A8A] opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

      </aside>

      {/* MOBILE NAV (Preserved) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 md:hidden z-[100] flex items-center justify-around bg-[#0A0A0C]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] px-2">
        <button onClick={() => setMode(AppMode.FOCUS)} className={`flex flex-col items-center gap-1 ${currentMode === AppMode.FOCUS ? 'text-blue-400' : 'text-gray-500'}`}>
          <Target className="w-5 h-5" />
        </button>
        <button onClick={() => setMode(AppMode.STATS)} className={`flex flex-col items-center gap-1 ${currentMode === AppMode.STATS ? 'text-blue-400' : 'text-gray-500'}`}>
          <BarChart2 className="w-5 h-5" />
        </button>
        <button onClick={() => setMode(AppMode.RELAX)} className={`flex flex-col items-center gap-1 ${currentMode === AppMode.RELAX ? 'text-blue-400' : 'text-gray-500'}`}>
          <Wind className="w-5 h-5" />
        </button>
      </nav>
    </>
  );
};