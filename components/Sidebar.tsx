import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';
import { Focus, BarChart2, Coffee, Settings, Twitter, Github, BookOpen, Layers, Zap, Moon, Sun, ArrowUpRight } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  alienMode: boolean;
  toggleAlienMode: () => void;
  onSignOut: () => void;
  user: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, alienMode, toggleAlienMode, onSignOut, user }) => {

  // "Robin Pattern" Navigation Data
  const groupedItems = [
    {
      header: 'WHAT I CREATE',
      items: [
        { mode: AppMode.FOCUS, label: 'Projects', icon: <Focus className="w-4 h-4" /> }, // Mapped Focus -> Projects
        { mode: 'PHOTOGRAPHY' as any, label: 'Photography', icon: <Zap className="w-4 h-4" />, count: 2 }, // Dummy
      ]
    },
    {
      header: 'WHAT I CONSUME',
      items: [
        { mode: 'BOOKS' as any, label: 'Books', icon: <BookOpen className="w-4 h-4" />, count: 3 }, // Dummy
        { mode: AppMode.RELAX, label: 'Music', icon: <Coffee className="w-4 h-4" />, count: 4 },     // Mapped Relax -> Music
        { mode: AppMode.STATS, label: 'Bookmarks', icon: <BarChart2 className="w-4 h-4" />, count: 5 } // Mapped Stats -> Bookmarks
      ]
    },
    {
      header: 'WHERE TO FIND ME',
      items: [
        { mode: 'SOCIAL_MASTODON' as any, label: 'Mastodon', icon: <Twitter className="w-4 h-4" />, external: true },
        { mode: 'SOCIAL_GITHUB' as any, label: 'Github', icon: <Github className="w-4 h-4" />, external: true },
      ]
    }
  ];

  /* Helper to check activation - allows mapping dummy items to real modes for functional continuity */
  const checkActive = (itemMode: any) => {
    // Direct match
    if (itemMode === currentMode) return true;
    // Mappings
    if (itemMode === 'PHOTOGRAPHY' && currentMode === AppMode.FOCUS) return false; // Differentiate? No, let's just stick to the functional ones being active.

    // For this visual refactor, we are mapping the functional specific modes to these labels.
    // Projects -> Focus
    // Music -> Relax
    // Bookmarks -> Stats
    return false;
  };

  return (
    <>
      {/* DESKTOP SIDEBAR - EXACT ROBIN LAYOUT */}
      {/* Width 280px to allow safe spacing. Background is transparent/minimal to sit on canvas. */}
      <aside className="fixed left-0 top-0 h-full w-[280px] hidden md:flex flex-col z-50 pl-8 pr-4 py-8">

        {/* 1. TOP PROFILE (User Info) */}
        <div className="flex flex-col gap-1 mb-12">
          <div className="flex items-center gap-3 mb-2">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-serif italic text-lg shadow-lg relative overflow-hidden">
              {user?.email?.charAt(0).toUpperCase() || 'Y'}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
            </div>

            {/* Name & Role */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white tracking-wide">
                {user?.email?.split('@')[0] || 'Design Engineer'}
              </span>
              <span className="text-[11px] text-[#9CA3AF] font-medium tracking-wide">
                Design Engineer
              </span>
            </div>
          </div>
          {/* Optional Bio Blurb or Status could go here if needed, keeping it clean for now */}
        </div>

        {/* 2. NAVIGATION LISTS */}
        <div className="flex-1 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
          {groupedItems.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-3">
              <h4 className="text-[10px] font-bold text-[#6B7280] tracking-[0.15em] uppercase pl-2">
                {group.header}
              </h4>
              <div className="flex flex-col">
                {group.items.map((item, iIdx) => {
                  // Logic determining if this item is the "Active" one visually
                  const isActuallyActive =
                    (item.label === 'Projects' && currentMode === AppMode.FOCUS) ||
                    (item.label === 'Music' && currentMode === AppMode.RELAX) ||
                    (item.label === 'Bookmarks' && currentMode === AppMode.STATS);

                  const clickHandler = () => {
                    if (item.label === 'Projects') setMode(AppMode.FOCUS);
                    else if (item.label === 'Music') setMode(AppMode.RELAX);
                    else if (item.label === 'Bookmarks') setMode(AppMode.STATS);
                  };

                  return (
                    <motion.button
                      key={iIdx}
                      onClick={clickHandler}
                      className={`
                                        group flex items-center justify-between px-3 py-2 text-[13px] font-medium transition-all duration-200 rounded-lg
                                        ${isActuallyActive ? 'text-blue-400' : 'text-[#9CA3AF] hover:text-white'}
                                    `}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`opacity-80 group-hover:opacity-100 transition-opacity ${isActuallyActive ? 'text-blue-400' : ''}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>

                      {/* Right Side Indicator (Count or Arrow) */}
                      {item.external ? (
                        <ArrowUpRight className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        item.count && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActuallyActive ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-gray-500'}`}>
                            {item.count}
                          </span>
                        )
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. BOTTOM UTILITIES (Footer) */}
        <div className="flex flex-col gap-4 mt-auto pt-6">

          {/* Links */}
          <div className="flex items-center gap-4 px-2">
            <button className="text-[11px] text-[#6B7280] hover:text-white transition-colors">Legals</button>
            <button className="text-[11px] text-[#6B7280] hover:text-white transition-colors">Changelog</button>
          </div>

          {/* Theme Toggle Pill */}
          <div className="flex items-center gap-3 bg-[#0A0A0C] border border-white/10 rounded-full p-1 w-fit">
            <button
              onClick={!alienMode ? undefined : toggleAlienMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-[11px] font-medium ${!alienMode ? 'bg-blue-600 text-white shadow-lg' : 'text-[#6B7280] hover:text-white'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${!alienMode ? 'bg-white' : 'bg-[#6B7280]'}`} />
              Blue
            </button>
            <button
              onClick={alienMode ? undefined : toggleAlienMode}
              className={`p-1.5 rounded-full hover:bg-white/5 transition-all ${alienMode ? 'text-white' : 'text-[#6B7280]'}`}
            >
              {alienMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

        </div>

      </aside>

      {/* MOBILE NAV (Preserved) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 md:hidden z-[100] flex items-center justify-around bg-[#0A0A0C]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] px-2">
        {/* Simple items for mobile */}
        <button onClick={() => setMode(AppMode.FOCUS)} className={`flex flex-col items-center gap-1 ${currentMode === AppMode.FOCUS ? 'text-blue-400' : 'text-gray-500'}`}>
          <Focus className="w-5 h-5" />
        </button>
        <button onClick={() => setMode(AppMode.STATS)} className={`flex flex-col items-center gap-1 ${currentMode === AppMode.STATS ? 'text-blue-400' : 'text-gray-500'}`}>
          <BarChart2 className="w-5 h-5" />
        </button>
        <button onClick={() => setMode(AppMode.RELAX)} className={`flex flex-col items-center gap-1 ${currentMode === AppMode.RELAX ? 'text-blue-400' : 'text-gray-500'}`}>
          <Coffee className="w-5 h-5" />
        </button>
      </nav>
    </>
  );
};