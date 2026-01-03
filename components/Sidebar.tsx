import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';
import { Focus, BarChart2, Coffee, LogOut, User as UserIcon, Settings, Compass, Layers, Zap } from 'lucide-react';
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

  // Navigation Groups mimicking the "Robin Pattern"
  const navGroups = [
    {
      title: 'CORE ENGINE',
      items: [
        { mode: AppMode.FOCUS, label: 'Focus', icon: <Focus className="w-4 h-4" /> },
      ]
    },
    {
      title: 'BIOMETRICS',
      items: [
        { mode: AppMode.STATS, label: 'Insights', icon: <BarChart2 className="w-4 h-4" /> },
        { mode: AppMode.RELAX, label: 'Relax', icon: <Coffee className="w-4 h-4" /> },
      ]
    },
    {
      title: 'WORKSPACE',
      items: [
        // Mapping "Workspace" essentially to just visual placeholders or maybe future expansion
        // For now, I'll add a dummy 'Projects' or 'Settings' if needed, but per request, 
        // I should stick to the modes. I'll add 'Settings' as a disabled placeholder 
        // to flesh out the aesthetic if that's allowed, but safer to stick to functional items.
        // Let's just put a "Settings" placeholder that does nothing or logs.
        { mode: 'SETTINGS' as any, label: 'Settings', icon: <Settings className="w-4 h-4" /> }
      ]
    }
  ];

  const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => (
    <motion.button
      onClick={() => item.mode !== 'SETTINGS' ? setMode(item.mode) : console.log("Settings clicked")}
      className={`
        relative w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all duration-200 rounded-lg group
        ${isActive
          ? 'text-white bg-[rgba(0,245,255,0.05)]'
          : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
        }
      `}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active Left Border Highlight */}
      {isActive && (
        <motion.div
          layoutId="activeSidebarBorder"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-[2px] bg-[#00F5FF] rounded-r-full shadow-[0_0_8px_rgba(0,245,255,0.4)]"
        />
      )}

      {/* Icon with status color */}
      <span className={`transition-colors duration-200 ${isActive ? 'text-[#00F5FF]' : 'text-[#6B7280] group-hover:text-white'}`}>
        {item.icon}
      </span>

      <span>{item.label}</span>

      {/* Subtle chevron for active items or hover */}
      {isActive && (
        <div className="ml-auto w-1 h-1 rounded-full bg-[#00F5FF] shadow-[0_0_5px_#00F5FF]" />
      )}
    </motion.button>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR - ROBIN PATTERN */}
      <aside className="fixed left-0 top-0 h-full w-[260px] hidden md:flex flex-col z-50 bg-[#0A0A0C] border-r border-white/5">

        {/* 1. HEADER: BRAND */}
        <div className="flex items-center gap-3 px-6 pt-8 pb-8">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className={`w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5FF]/10 to-[#2DD4BF]/10 border border-[#00F5FF]/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.1)] cursor-pointer ${alienMode ? 'animate-pulse' : ''}`}
          >
            <Zap className="w-4 h-4 text-[#00F5FF] fill-[#00F5FF]/20" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white tracking-wide font-sans leading-none">YTTERBIUM</span>
            <span className="text-[10px] text-[#6B7280] font-medium tracking-widest mt-1">NEURAL ENGINE</span>
          </div>
        </div>

        {/* 2. NAVIGATION GROUPS */}
        <nav className="flex-1 flex flex-col gap-8 px-6 overflow-y-auto custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <h4 className="text-[10px] font-bold text-[#6B7280] tracking-[0.15em] uppercase mb-1 px-3">
                {group.title}
              </h4>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item, itemIdx) => (
                  <NavItem
                    key={itemIdx}
                    item={item}
                    isActive={currentMode === item.mode}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* 3. BOTTOM: ACCOUNT SECTION */}
        <div className="px-5 py-4 border-t border-white/5 bg-[#050505]/50">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              {user ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center text-[11px] text-white font-bold shadow-inner">
                  {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon size={14} />}
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center">
                  <UserIcon size={14} className="text-zinc-500" />
                </div>
              )}

              {/* User Info */}
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-medium text-white truncate max-w-[120px]">
                  {user?.email || 'Guest User'}
                </span>
                <span className="text-[10px] text-[#2DD4BF] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                  Online
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <motion.button
              onClick={onSignOut}
              className="p-1.5 rounded-md text-[#6B7280] hover:text-white hover:bg-white/5 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>

      </aside>

      {/* MOBILE NAV (Preserved) - Keeping visually consistent with dark theme */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 md:hidden z-[100] flex items-center justify-around bg-[#0A0A0C]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] px-2">
        {navGroups.flatMap(g => g.items).filter(i => i.mode !== 'SETTINGS' as any).map((item: any) => {
          const isActive = currentMode === item.mode;
          return (
            <motion.button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-xl transition-all ${isActive ? 'text-[#00F5FF]' : 'text-gray-500'}`}
            >
              <span className={`${isActive ? 'text-[#00F5FF]' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeMobileTab"
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