import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';

const MotionDiv = motion.div as any;

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  alienMode: boolean;
  toggleAlienMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, alienMode, toggleAlienMode }) => {
  const items = [
    { mode: AppMode.FOCUS, label: 'Focus' },
    { mode: AppMode.STATS, label: 'Insights' },
    { mode: AppMode.RELAX, label: 'Relax' },
  ];

  return (
    <aside className="fixed left-0 top-0 w-52 h-screen flex flex-col justify-center z-50 pointer-events-auto">
      <div className="px-5 pt-8 pb-4 pointer-events-auto">
        <h1 className={`text-6xl font-bold text-gray-100 tracking-tight leading-none drop-shadow-2xl transition-all duration-700 ${alienMode ? 'font-alien tracking-widest text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'font-serif'}`}>
          Ytterbium
        </h1>
      </div>

      <nav className="flex-grow flex flex-col justify-center items-center w-full px-5 gap-2 pointer-events-auto -mt-48">
        {/* Narrower container with bigger text */}
        <div className="w-24 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden shadow-2xl relative group/panel">
          {items.map((item, index) => (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`
                relative w-full py-3 px-1.5 transition-all duration-300
                flex items-center justify-center gap-1 border-l-2
                ${currentMode === item.mode
                  ? 'bg-white/8 text-white font-medium border-white/20'
                  : 'border-transparent text-gray-300/80 font-medium hover:text-white hover:bg-white/4 hover:border-white/10'
                }
                ${index !== items.length - 1 ? 'border-b border-white/5' : ''}
                ${alienMode ? 'font-alien text-sm tracking-[0.1em] uppercase' : 'text-sm font-sans'}
                group
              `}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Empty div to maintain layout - no typography/alien mode toggle */}
      <div className="px-5 pb-8 pointer-events-auto"></div>
    </aside>
  );
};