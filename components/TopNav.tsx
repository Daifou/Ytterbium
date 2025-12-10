
import React from 'react';
import { motion } from 'framer-motion';
import { AppMode } from '../types';
import { BrainCircuit, Coffee, Activity, User, Moon, Sun } from 'lucide-react';

const MotionDiv = motion.div as any;

interface TopNavProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  fatigueScore: number;
}

export const TopNav: React.FC<TopNavProps> = ({ currentMode, setMode, fatigueScore }) => {
  
  // Determine AI Dot Color based on Fatigue/Status
  const getDotColor = () => {
    if (fatigueScore > 70) return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]';
    if (fatigueScore > 40) return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]';
    return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]';
  };

  const navItems = [
    { mode: AppMode.FOCUS, label: 'Focus' },
    { mode: AppMode.RELAX, label: 'Relax' },
    { mode: AppMode.STATS, label: 'Insights' },
  ];

  return (
    <MotionDiv 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl"
    >
      <div className="relative px-6 py-3 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/5 shadow-2xl flex items-center justify-between">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="hidden sm:block text-gray-200 font-medium tracking-tight">Ytterbium</span>
        </div>

        {/* Center: Navigation */}
        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => setMode(item.mode)}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-300 outline-none ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <MotionDiv
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white/10 rounded-lg shadow-inner"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          
          {/* AI Activity Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5" title={`AI Load: ${fatigueScore}%`}>
            <div className={`w-2 h-2 rounded-full ${getDotColor()} animate-pulse`} />
            <span className="text-[10px] font-mono text-gray-500 hidden sm:block">AI ACTIVE</span>
          </div>

          {/* Theme Toggle (Visual Only) */}
          <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <Moon className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 border border-white/10 flex items-center justify-center cursor-pointer hover:ring-2 ring-white/20 transition-all">
             <User className="w-4 h-4 text-gray-300" />
          </div>

        </div>
      </div>
    </MotionDiv>
  );
};