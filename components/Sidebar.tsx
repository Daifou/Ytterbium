import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  alienMode: boolean;
  toggleAlienMode: () => void;
  onSignOut: () => void;
  user: any; // Type from Supabase User
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, alienMode, onSignOut, user }) => {
  const items = [
    { mode: AppMode.FOCUS, label: 'Focus' },
    { mode: AppMode.STATS, label: 'Insights' },
    { mode: AppMode.RELAX, label: 'Relax' },
  ];

  // Animation variants for the whole panel (subtle entrance)
  const panelVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } },
  };

  // Base button styles for clean separation
  const baseButtonStyle = `
    relative w-full py-2 px-2 transition-all duration-300
    rounded-full flex items-center justify-center border
  `;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed left-0 top-0 w-72 h-screen hidden md:flex flex-col justify-center z-50 pointer-events-none">

        {/* 1. TITLE SECTION */}
        <div className="px-5 pt-8 pb-4 pointer-events-auto">
          <motion.h1
            className={`
              text-6xl font-bold tracking-tight leading-none transition-all duration-500 
              drop-shadow-lg cursor-default
              ${alienMode
                ? 'font-alien tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:text-white'
                : 'text-white hover:text-gray-100'
              }
            `}
            style={!alienMode ? { fontFamily: "'Playfair Display', serif", fontWeight: 700 } : {}}
          >
            Ytterbium
          </motion.h1>
        </div>

        <nav className="flex-grow flex flex-col justify-center items-start w-full pl-10 pointer-events-auto -mt-48">
          <motion.div
            className="w-32 p-3 bg-zinc-900/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex flex-col gap-3 transition-all duration-500 group/panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => {
              const isActive = currentMode === item.mode;
              const activeStyles = `bg-white/10 text-white border-white/30 shadow-[inset_0_0_8px_rgba(255,255,255,0.2),_0_0_10px_rgba(255,255,255,0.1)] hover:bg-white/15`;
              const inactiveStyles = `bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30 shadow-inner shadow-black/30`;
              const fontStyles = alienMode
                ? 'font-alien text-[11px] tracking-[0.3em] uppercase font-light'
                : 'text-sm font-medium font-sans';

              return (
                <motion.button
                  key={item.mode}
                  onClick={() => setMode(item.mode)}
                  className={`${baseButtonStyle} ${isActive ? activeStyles : inactiveStyles} ${fontStyles}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </nav>

        {/* Sign Out Section */}
        <div className="px-5 pl-10 pb-8 pointer-events-auto flex flex-col items-start gap-4">
          {user && (
            <div className="text-[10px] text-white/40 font-bold tracking-widest uppercase text-center w-full truncate px-2">
              {user.email}
            </div>
          )}
          <motion.button
            onClick={onSignOut}
            className="text-[10px] text-white/60 hover:text-white font-bold tracking-[0.3em] uppercase transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Out
          </motion.button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 md:hidden z-[100] flex items-center justify-around bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] px-2">
        {items.map((item) => {
          const isActive = currentMode === item.mode;
          return (
            <motion.button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-xl transition-all ${isActive ? 'text-white' : 'text-gray-500'
                }`}
            >
              <div className={`w-1 h-1 rounded-full mb-1 transition-all ${isActive ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-transparent'}`} />
              <span className={`text-[10px] tracking-widest uppercase ${alienMode ? 'font-alien' : 'font-bold'}`}>
                {item.label}
              </span>
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