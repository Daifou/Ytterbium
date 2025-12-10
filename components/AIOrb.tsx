import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Coffee, Activity, Sparkles, X, Zap } from 'lucide-react';
import { AppMode, SessionStatus } from '../types';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

interface AIOrbProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  status: SessionStatus;
  fatigueScore: number;
}

export const AIOrb: React.FC<AIOrbProps> = ({ currentMode, setMode, status, fatigueScore }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Determine Orb Color based on State & Fatigue
  const getOrbColor = () => {
    if (status === SessionStatus.RUNNING) {
      if (fatigueScore > 70) return 'bg-rose-500 shadow-rose-500/50';
      if (fatigueScore > 40) return 'bg-amber-400 shadow-amber-400/50';
      return 'bg-blue-500 shadow-blue-500/50';
    }
    if (currentMode === AppMode.RELAX) return 'bg-emerald-500 shadow-emerald-500/50';
    return 'bg-violet-600 shadow-violet-600/50';
  };

  const orbColorClass = getOrbColor();

  const menuItems = [
    { mode: AppMode.FOCUS, icon: BrainCircuit, label: 'Focus Mode', color: 'text-blue-400' },
    { mode: AppMode.RELAX, icon: Coffee, label: 'Relaxation', color: 'text-emerald-400' },
    { mode: AppMode.STATS, icon: Activity, label: 'Insights', color: 'text-rose-400' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      
      {/* Expandable Menu */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-6 flex flex-col items-end gap-3"
          >
            {menuItems.map((item) => (
              <MotionButton
                key={item.mode}
                whileHover={{ scale: 1.05, x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setMode(item.mode);
                  setIsOpen(false);
                }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl ${currentMode === item.mode ? 'bg-white/10' : 'bg-black/60 hover:bg-black/80'}`}
              >
                <span className="text-sm font-medium text-gray-200">{item.label}</span>
                <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
              </MotionButton>
            ))}
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
            
            {/* Status Indicator */}
            <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5 flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">Fatigue Level</span>
                    <span className={`text-xs font-bold ${fatigueScore > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{fatigueScore}%</span>
                </div>
                <Zap className={`w-4 h-4 ${fatigueScore > 50 ? 'text-amber-400' : 'text-emerald-400'}`} />
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Main Orb Button */}
      <MotionButton
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white ${orbColorClass} backdrop-blur-sm border border-white/20 transition-colors duration-500`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
            boxShadow: isOpen 
                ? "0 0 0 0 rgba(0,0,0,0)" 
                : [
                    "0 0 20px -5px currentColor",
                    "0 0 30px -2px currentColor",
                    "0 0 20px -5px currentColor"
                ]
        }}
        transition={{
            boxShadow: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }}
        style={{ boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
      >
        <AnimatePresence mode="wait">
            {isOpen ? (
                <MotionDiv
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                >
                    <X className="w-6 h-6" />
                </MotionDiv>
            ) : (
                <MotionDiv
                    key="open"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                >
                    <Sparkles className="w-6 h-6 fill-white/20" />
                </MotionDiv>
            )}
        </AnimatePresence>
        
        {/* Ambient Ring */}
        <div className="absolute inset-0 rounded-full border border-white/30 opacity-50 animate-ping-slow pointer-events-none" />
      </MotionButton>
    </div>
  );
};