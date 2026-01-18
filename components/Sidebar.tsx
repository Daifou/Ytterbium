import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';
import { LogOut } from 'lucide-react';
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
  completedCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, onSignOut, user, focusIntensity, completedCount }) => {

  const isFocus = currentMode === AppMode.FOCUS;
  const isRelax = currentMode === AppMode.RELAX;

  const userInitials = user?.email ? user.email.substring(0, 1).toUpperCase() : 'Y';
  const displayEmail = 'daifalla.harkat2003';

  return (
    <>
      {/* DESKTOP SIDEBAR - SURGICAL PRECISION */}
      <aside className="fixed left-0 top-0 h-full w-[260px] hidden md:flex flex-col z-50 bg-neutral-900 border-r border-neutral-700/30 font-sans select-none antialiased">

        {/* 1. TOP SECTION: Logo + Toggle - Pushed Higher */}
        <div className="flex flex-col px-6 pt-8 gap-12">
          {/* Header */}
          <a
            href="/"
            className="flex items-center gap-3 group/logo transition-all duration-300 hover:opacity-70 hover:translate-y-[-1px]"
          >
            <Logo className="w-8 h-8 opacity-100" />
            <span className="text-[12px] font-bold text-neutral-100 tracking-[0.1em] lowercase py-2">
              ytterbium
            </span>
          </a>

          {/* Minimalist Toggle Pill - GLASS HARDWARE */}
          <div className="relative flex w-full h-9 p-[2px] rounded-lg bg-neutral-950 border border-neutral-700/50 shadow-inner">
            {/* Active Indicator - Subtle Neutral Fill */}
            <motion.div
              initial={false}
              animate={{
                x: isFocus ? 0 : '100%',
              }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="absolute top-[2px] left-[2px] w-[calc(50%-2px)] h-[calc(100%-4px)] rounded-[6px] bg-neutral-800 border border-neutral-700/50 z-0"
            />

            {/* Focus Button */}
            <button
              onClick={() => setMode(AppMode.FOCUS)}
              className={`flex-1 relative z-10 flex items-center justify-center text-[12px] tracking-tight font-medium transition-all duration-200 ${isFocus ? 'text-neutral-100' : 'text-neutral-600 hover:text-neutral-400'}`}
            >
              Focus
            </button>

            {/* Relax Button */}
            <button
              onClick={() => setMode(AppMode.RELAX)}
              className={`flex-1 relative z-10 flex items-center justify-center text-[12px] tracking-tight font-medium transition-all duration-200 ${isRelax ? 'text-neutral-100' : 'text-neutral-600 hover:text-neutral-400'}`}
            >
              Relax
            </button>
          </div>
        </div>

        {/* 2. MIDDLE SECTION: Session Architecture (Void Space) */}
        <div className="flex-1 flex flex-col justify-start px-6 pt-12">
          <SystemReadout mode={currentMode} intensity={focusIntensity} completedCount={completedCount} />
        </div>

        {/* 3. BOTTOM SECTION: Profile (Anchored to Absolute Bottom) */}
        <footer className="p-6 pb-8 mt-auto">
          <div className="group flex items-center gap-3 cursor-pointer pt-6 border-t border-neutral-800" onClick={onSignOut}>
            {/* Avatar - Simple Neutral Circle */}
            <div className="relative w-7 h-7 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center group-hover:border-neutral-600 transition-colors">
              <span className="text-[11px] text-neutral-400 font-medium pb-[0.5px] uppercase">{userInitials}</span>
              {/* Online Dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-[1.5px] border-neutral-900" />
            </div>

            {/* Profile Text - Minimalist */}
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] text-neutral-400 font-medium truncate group-hover:text-neutral-200 transition-colors">
                {displayEmail.split('@')[0]}
              </span>
            </div>
          </div>
        </footer>

      </aside>

      {/* MOBILE NAV (Preserved simple version) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-14 md:hidden z-[100] flex items-center justify-between bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 shadow-2xl">
        <span className="text-[10px] text-[#666] tracking-widest uppercase">Ytterbium System</span>
        <div className="flex gap-4">
          <button onClick={() => setMode(AppMode.FOCUS)} className={`w-2 h-2 rounded-full ${isFocus ? 'bg-[#00FF85]' : 'bg-[#333]'}`} />
          <button onClick={() => setMode(AppMode.RELAX)} className={`w-2 h-2 rounded-full ${isRelax ? 'bg-[#00FF85]' : 'bg-[#333]'}`} />
        </div>
      </nav>
    </>
  );
};