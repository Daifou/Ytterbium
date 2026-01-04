import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppMode } from '../types';
import {
  Target,
  Wind,
  BarChart2,
  LogOut
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

import { SystemReadout } from './SystemReadout';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  alienMode: boolean;
  toggleAlienMode: () => void;
  onSignOut: () => void;
  user: User | null;
  focusIntensity: number; // [NEW] Prop for Readout
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, onSignOut, user, focusIntensity }) => {

  const isFocus = currentMode === AppMode.FOCUS;
  const isRelax = currentMode === AppMode.RELAX;
  const isStats = currentMode === AppMode.STATS;

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'Y';
  // Use specific name requested if possible, or fallback to user email
  const displayEmail = 'daifalla.harkat2003';
  const displayRole = 'Design Engineer';

  return (
    <>
      {/* DESKTOP SIDEBAR - MINIMALIST UTILITY */}
      <aside className="fixed left-0 top-0 h-full w-[260px] hidden md:flex flex-col z-50 bg-[#080808] border-r border-white/[0.03] font-sans select-none antialiased">

        {/* 1. TOP SECTION: SidebarHeader */}
        <header className="px-6 py-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="text-[12px] font-semibold text-[#EAEAEA] tracking-[0.2em] uppercase opacity-90">
              Ytterbium
            </span>
          </div>
        </header>

        {/* 2. CENTERPIECE: SidebarContent */}
        <div className="flex-1 px-4 flex flex-col gap-6">

          {/* Segmented Toggle (Focus/Relax) */}
          <div className="bg-[#111] p-1 rounded-full border border-white/[0.05] relative flex h-10">
            <AnimatePresence mode="wait">
              <motion.div
                initial={false}
                animate={{ x: isFocus ? 0 : '100%' }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-[#1A1A1A] rounded-full border border-white/[0.08] shadow-lg"
              />
            </AnimatePresence>

            <button
              onClick={() => setMode(AppMode.FOCUS)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-[12px] font-medium transition-colors duration-200 ${isFocus ? 'text-blue-400' : 'text-[#8A8A8A] hover:text-[#EAEAEA]'}`}
            >
              <Target className={`w-3.5 h-3.5 ${isFocus ? 'opacity-100' : 'opacity-40'}`} />
              Focus
            </button>

            <button
              onClick={() => setMode(AppMode.RELAX)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-2 text-[12px] font-medium transition-colors duration-200 ${isRelax ? 'text-white' : 'text-[#8A8A8A] hover:text-[#EAEAEA]'}`}
            >
              <Wind className={`w-3.5 h-3.5 ${isRelax ? 'opacity-100' : 'opacity-40'}`} />
              Relax
            </button>
          </div>

          {/* Insights Menu Item */}
          <div className="flex flex-col">
            <button
              onClick={() => setMode(AppMode.STATS)}
              className={`
                        group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-[13px] font-medium
                        ${isStats ? 'bg-white/[0.03] text-[#EAEAEA] border border-white/[0.05]' : 'text-[#8A8A8A] hover:text-[#EAEAEA] border border-transparent'}
                    `}
            >
              <BarChart2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${isStats ? 'text-blue-500' : 'text-[#8A8A8A]'}`} />
              <span>Insights</span>
              {isStats && <div className="ml-auto w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />}
            </button>
          </div>

          {/* [NEW] SYSTEM READOUT INTERSTITIAL */}
          <div className="flex-1 flex flex-col justify-center">
            <SystemReadout mode={currentMode} intensity={focusIntensity} />
          </div>

        </div>

        {/* 3. BOTTOM SECTION: SidebarFooter */}
        <footer className="p-4 mb-2">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.02] active:scale-[0.98] transition-all w-full group text-left border border-transparent hover:border-white/[0.05]"
          >
            {/* Avatar Circle */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/[0.1] flex items-center justify-center group-hover:border-white/[0.2] transition-colors relative shadow-2xl">
              <span className="text-[10px] font-bold text-[#666] group-hover:text-blue-400 transition-colors uppercase tracking-widest">{userInitials}</span>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-[#080808]" />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[12px] font-semibold text-[#EAEAEA] truncate group-hover:text-blue-400 transition-colors">
                {displayEmail}
              </span>
              <span className="text-[11px] font-medium text-[#555] group-hover:text-[#888] transition-colors">
                {displayRole}
              </span>
            </div>

            <LogOut className="w-3.5 h-3.5 text-[#444] opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
          </button>
        </footer>

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