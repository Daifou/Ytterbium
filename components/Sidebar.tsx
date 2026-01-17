import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppMode } from '../types';
import {
  Hexagon,
  Wind,
  BarChart2,
  LogOut,
  Circle
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

import { SystemReadout } from './SystemReadout';
import { Logo } from './Logo';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  alienMode: boolean;
  toggleAlienMode: () => void;
  onSignOut: () => void;
  user: User | null;
  focusIntensity: number;
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
      {/* DESKTOP SIDEBAR - LUXURY INSTRUMENT PANEL */}
      <aside className="fixed left-0 top-0 h-full w-[260px] hidden md:flex flex-col z-50 bg-[#050505] border-r border-white/[0.05] font-sans antialiased">

        {/* 1. TOP SECTION: Branding */}
        <header className="px-8 py-10">
          <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity duration-500">
            <Logo className="w-8 h-8 opacity-90" />
            <span className="text-[10px] uppercase font-bold text-white tracking-[0.25em] opacity-40">
              Ytterbium
            </span>
          </div>
        </header>

        {/* 2. CENTERPIECE: Navigation */}
        <div className="flex-1 px-6 flex flex-col gap-8">

          {/* Mode Selector - Minimalist Pill */}
          <div className="flex flex-col gap-3">
             <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-medium pl-2">
                Core Engine
             </div>
             
             <div className="flex flex-col gap-1">
                {/* FOCUS BUTTON */}
                <button
                    onClick={() => setMode(AppMode.FOCUS)}
                    className={`
                        group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-500
                        ${isFocus ? 'bg-white/[0.03]' : 'bg-transparent hover:bg-white/[0.01]'}
                    `}
                >
                    <div className={`relative flex items-center justify-center w-4 h-4 transition-all duration-500 ${isFocus ? 'text-[#00FF85]' : 'text-white/20 group-hover:text-white/40'}`}>
                        <Hexagon className="w-full h-full stroke-[1.5px]" />
                        {isFocus && <motion.div layoutId="active-dot" className="absolute w-1 h-1 bg-[#00FF85] rounded-full shadow-[0_0_8px_#00FF85]" />}
                    </div>
                    <span className={`text-[11px] uppercase tracking-[0.1em] font-medium transition-all duration-500 ${isFocus ? 'text-white opacity-100' : 'text-white opacity-40 group-hover:opacity-70'}`}>
                        Focus
                    </span>
                </button>

                {/* RELAX BUTTON */}
                <button
                    onClick={() => setMode(AppMode.RELAX)}
                    className={`
                        group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-500
                        ${isRelax ? 'bg-white/[0.03]' : 'bg-transparent hover:bg-white/[0.01]'}
                    `}
                >
                    <div className={`relative flex items-center justify-center w-4 h-4 transition-all duration-500 ${isRelax ? 'text-[#00FF85]' : 'text-white/20 group-hover:text-white/40'}`}>
                         <Wind className="w-full h-full stroke-[1.5px]" />
                         {isRelax && <motion.div layoutId="active-dot" className="absolute w-1 h-1 bg-[#00FF85] rounded-full shadow-[0_0_8px_#00FF85]" />}
                    </div>
                    <span className={`text-[11px] uppercase tracking-[0.1em] font-medium transition-all duration-500 ${isRelax ? 'text-white opacity-100' : 'text-white opacity-40 group-hover:opacity-70'}`}>
                        Relax
                    </span>
                </button>
             </div>
          </div>


          {/* Insights Section */}
          <div className="flex flex-col gap-3">
             <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-medium pl-2">
                Analytics
             </div>
             
            <button
              onClick={() => setMode(AppMode.STATS)}
              className={`
                    group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-500
                    ${isStats ? 'bg-white/[0.03]' : 'bg-transparent hover:bg-white/[0.01]'}
              `}
            >
               <div className={`relative flex items-center justify-center w-4 h-4 transition-all duration-500 ${isStats ? 'text-[#00FF85]' : 'text-white/20 group-hover:text-white/40'}`}>
                    <BarChart2 className="w-full h-full stroke-[1.5px]" />
                     {isStats && <motion.div layoutId="active-dot" className="absolute w-1 h-1 bg-[#00FF85] rounded-full shadow-[0_0_8px_#00FF85]" />}
               </div>
               <span className={`text-[11px] uppercase tracking-[0.1em] font-medium transition-all duration-500 ${isStats ? 'text-white opacity-100' : 'text-white opacity-40 group-hover:opacity-70'}`}>
                  Insights
              </span>
            </button>
          </div>

          {/* System Readout - Pushed to bottom of flex area */}
          <div className="mt-auto pb-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <SystemReadout mode={currentMode} intensity={focusIntensity} />
          </div>

        </div>

        {/* 3. FOOTER: Account */}
        <footer className="p-6 border-t border-white/[0.05]">
          <button
            onClick={onSignOut}
            className="flex items-center gap-4 w-full group"
          >
            {/* Minimal Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/[0.1] flex items-center justify-center group-hover:border-white/[0.3] transition-colors relative">
              <span className="text-[9px] font-bold text-white/40 group-hover:text-white transition-colors">{userInitials}</span>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#00FF85] rounded-full border border-[#050505]" />
            </div>

            {/* Profile Info - Invisible Hierarchy */}
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[10px] font-medium text-white/80 group-hover:text-white transition-colors tracking-wide truncate max-w-[140px]">
                {displayEmail.split('@')[0]}
              </span>
              <span className="text-[9px] uppercase tracking-[0.1em] text-white/30 group-hover:text-white/50 transition-colors">
                Online
              </span>
            </div>
            
            <LogOut className="ml-auto w-3 h-3 text-white/20 group-hover:text-white/60 transition-colors" />
          </button>
        </footer>

      </aside>

      {/* MOBILE NAV (Refined) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-14 md:hidden z-[100] flex items-center justify-around bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] px-2">
        <button onClick={() => setMode(AppMode.FOCUS)} className={`flex flex-col items-center gap-1 transition-colors ${currentMode === AppMode.FOCUS ? 'text-[#00FF85]' : 'text-zinc-600'}`}>
          <Hexagon className="w-5 h-5 stroke-[1.5px]" />
        </button>
        <button onClick={() => setMode(AppMode.STATS)} className={`flex flex-col items-center gap-1 transition-colors ${currentMode === AppMode.STATS ? 'text-[#00FF85]' : 'text-zinc-600'}`}>
          <BarChart2 className="w-5 h-5 stroke-[1.5px]" />
        </button>
        <button onClick={() => setMode(AppMode.RELAX)} className={`flex flex-col items-center gap-1 transition-colors ${currentMode === AppMode.RELAX ? 'text-[#00FF85]' : 'text-zinc-600'}`}>
          <Wind className="w-5 h-5 stroke-[1.5px]" />
        </button>
      </nav>
    </>
  );
};