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
    <aside className="fixed left-0 top-0 w-52 h-screen flex flex-col justify-center z-50 pointer-events-none">

      {/* 1. TITLE SECTION (Clear, high-contrast text) */}
      <div className="px-5 pt-8 pb-4 pointer-events-auto">
        <motion.h1
          className={`
            text-6xl font-bold tracking-tight leading-none transition-all duration-500 
            drop-shadow-lg cursor-default
            ${alienMode
              // Alien mode: Clean Cyan Glow
              ? 'font-alien tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:text-white'
              // Default mode: Crisp White
              : 'text-white hover:text-gray-100'
            }
          `}
          style={!alienMode ? { fontFamily: "'EB Garamond', serif" } : {}}
        >
          Ytterbium
        </motion.h1>
      </div>

      <nav className="flex-grow flex flex-col justify-center items-center w-full px-5 pointer-events-auto -mt-48">

        {/* 2. PANEL CONTAINER (FINAL ART: Increased Transparency) */}
        <motion.div
          className={`
            w-32 p-3 
            // Increased transparency: Changed from 40% to 30% opacity
            bg-zinc-900/30 backdrop-blur-2xl border border-white/20 rounded-3xl 
            shadow-2xl flex flex-col gap-3 
            transition-all duration-500 group/panel
            // Clearer outer shadow for depth, no complex color glows
            shadow-[0_0_20px_rgba(0,0,0,0.5)] 
            hover:shadow-[0_0_30px_rgba(0,0,0,0.8)]
          `}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item) => {
            const isActive = currentMode === item.mode;

            // 3. BUTTONS (Refined Pro, Light, and Smart Active State)
            const activeStyles = `
                // Background: Subtle translucent white/light gray
                bg-white/10 text-white border-white/30
                
                // Shadow: Pale, smart, internal glow (no aggressive solid white)
                shadow-[inset_0_0_8px_rgba(255,255,255,0.2),_0_0_10px_rgba(255,255,255,0.1)] 
                
                // Hover: Boost the soft glow
                hover:bg-white/15 hover:shadow-[inset_0_0_8px_rgba(255,255,255,0.3),_0_0_15px_rgba(255,255,255,0.2)]
            `;

            const inactiveStyles = `
                // Inactive: Transparent background, clear gray text, subtle border
                bg-white/5 text-gray-300 border-white/10 
                hover:bg-white/10 hover:text-white hover:border-white/30
                shadow-inner shadow-black/30 // Simple recess shadow
            `;

            const fontStyles = alienMode
              ? 'font-alien text-[11px] tracking-[0.3em] uppercase font-light'
              : 'text-sm font-medium font-sans';

            return (
              <motion.button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`${baseButtonStyle} ${isActive ? activeStyles : inactiveStyles} ${fontStyles}`}
                // Cute/Haptic Feedback: Maintained
                whileHover={{ scale: 1.05, rotate: alienMode ? 1 : 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </nav>

      {/* Sign Out Section */}
      <div className="px-5 pb-8 pointer-events-auto flex flex-col items-center gap-4">
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
  );
};