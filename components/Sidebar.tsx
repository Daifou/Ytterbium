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
      <aside className="fixed left-0 top-0 h-full w-[260px] hidden md:flex flex-col z-50 bg-[#080808] border-r border-[#EAEAEA]/[0.02] font-sans select-none antialiased">

        {/* 1. TOP SECTION: Logo + Toggle - Pushed Higher */}
        <div className="flex flex-col px-6 pt-8 gap-12">
          {/* Header */}
          <a
            href="/"
            className="flex items-center gap-3 group/logo transition-all duration-300 hover:opacity-70 hover:translate-y-[-1px]"
          >
            <Logo className="w-8 h-8 opacity-90" />
            <span className="text-[11px] font-semibold text-[#EAEAEA] tracking-[0.25em] uppercase opacity-80">
              Ytterbium
            </span>
          </a>

          {/* Minimalist Toggle Pill - GLASS HARDWARE */}
          <div className="relative flex w-full h-10 p-[2px] rounded-full bg-[#0A0A0A] border border-white/10 shadow-inner">
            {/* Active Indicator - Subtle Glass Glow */}
            <motion.div
              initial={false}
              animate={{
                x: isFocus ? 0 : '100%',
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-[2px] left-[2px] w-[calc(50%-2px)] h-[calc(100%-4px)] rounded-full bg-white/[0.03] shadow-[inset_0_1px_4px_rgba(0,0,0,0.5),inset_0_0_8px_rgba(255,255,255,0.03)] border border-white/[0.05] z-0"
            />

            {/* Focus Button */}
            <button
              onClick={() => setMode(AppMode.FOCUS)}
              className={`flex-1 relative z-10 flex items-center justify-center text-[12px] uppercase tracking-[0.05em] font-semibold transition-all duration-300 ${isFocus ? 'text-white' : 'text-white/40 font-medium'}`}
            >
              Focus
            </button>

            {/* Relax Button */}
            <button
              onClick={() => setMode(AppMode.RELAX)}
              className={`flex-1 relative z-10 flex items-center justify-center text-[12px] uppercase tracking-[0.05em] font-semibold transition-all duration-300 ${isRelax ? 'text-white' : 'text-white/40 font-medium'}`}
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
          <div className="group flex items-center gap-4 cursor-pointer pt-6 border-t border-white/[0.05]" onClick={onSignOut}>
            {/* Avatar - Perfect Circle with 1px Border */}
            <div className="relative w-8 h-8 rounded-full bg-transparent border border-white/15 flex items-center justify-center group-hover:border-white/25 transition-colors overflow-hidden">
              <span className="text-[12px] text-white font-sans font-medium leading-none flex items-center justify-center w-full h-full pb-[0.5px] uppercase">{userInitials}</span>
              {/* Online Dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#00FF85] rounded-full border-[2px] border-[#080808]" />
            </div>

            {/* Profile Text - Signature Style */}
            <div className="flex flex-col">
              <span className="text-[12px] text-white/90 font-medium tracking-wide group-hover:text-white transition-colors">
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