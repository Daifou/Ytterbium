import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';
import { Focus, BarChart2, Coffee, LogOut, User as UserIcon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  alienMode: boolean;
  toggleAlienMode: () => void;
  onSignOut: () => void;
  user: User | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, alienMode, onSignOut, user }) => {
  const items = [
    { mode: AppMode.FOCUS, label: 'Focus', icon: <Focus className="w-5 h-5" /> },
    { mode: AppMode.STATS, label: 'Insights', icon: <BarChart2 className="w-5 h-5" /> },
    { mode: AppMode.RELAX, label: 'Relax', icon: <Coffee className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR - HYBRID GLASS RAIL */}
      <aside className="fixed left-0 top-0 h-full w-[72px] hidden md:flex flex-col items-center justify-between z-50 bg-[#050507]/60 backdrop-blur-2xl border-r border-white/5 pb-6 pt-8">

        {/* 1. TOP: LOGO */}
        <div className="flex flex-col items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer ${alienMode ? 'animate-pulse' : ''}`}
          >
            <div className="w-5 h-5 bg-white/90 rounded-full shadow-[0_0_10px_white]" />
          </motion.div>
        </div>

        {/* 2. CENTER: NAV ITEMS */}
        <nav className="flex flex-col items-center gap-6 w-full">
          {items.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <div key={item.mode} className="relative group w-full flex justify-center px-2">
                <motion.button
                  onClick={() => setMode(item.mode)}
                  className={`
                    relative p-3 rounded-xl transition-all duration-300
                    ${isActive
                      ? 'bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] border border-white/10'
                      : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
                    }
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Icon Placeholder until we import icons - using generic shapes if no icons, but I added lucide imports above */}
                  {item.icon}

                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeRailIndicator"
                      className="absolute -right-[1px] top-1/2 -translate-y-1/2 w-[3px] h-8 bg-white/80 rounded-l-full shadow-[0_0_8px_white]"
                    />
                  )}
                </motion.button>

                {/* Tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-xs font-medium text-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[60]">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45 border-l border-b border-white/10" />
                </div>
              </div>
            );
          })}
        </nav>

        {/* 3. BOTTOM: USER & SIGN OUT */}
        <div className="flex flex-col items-center gap-4 w-full">
          {user && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 border border-white/10 flex items-center justify-center text-[10px] text-white font-bold tracking-tight shadow-inner cursor-default" title={user.email || 'User'}>
              {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={12} />}
            </div>
          )}

          <motion.button
            onClick={onSignOut}
            className="p-2 text-white/20 hover:text-red-400 Transition-colors"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            title="Sign Out"
          >
            <LogOut size={18} />
          </motion.button>
        </div>

      </aside>

      {/* MOBILE NAV (Preserved) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 md:hidden z-[100] flex items-center justify-around bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] px-2">
        {items.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <motion.button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-xl transition-all ${isActive ? 'text-white' : 'text-gray-500'}`}
            >
              <div className={`w-1 h-1 rounded-full mb-1 transition-all ${isActive ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-transparent'}`} />
              {item.icon}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-2 inset-y-2 bg-white/5 border border-white/10 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </>
  );
};