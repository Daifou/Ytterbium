import React, { useMemo } from 'react';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemReadoutProps {
    mode: AppMode;
    intensity: number;
    completedCount: number;
}

interface ProfileConfig {
    name: string;
    description: string;
}

export const SystemReadout: React.FC<SystemReadoutProps> = ({ mode, intensity, completedCount }) => {

    const readoutData = useMemo<ProfileConfig>(() => {
        // 1. RELAX MODE
        if (mode === AppMode.RELAX) {
            return {
                name: 'SYSTEM REST',
                description: 'Rapid parasympathetic recovery. Restores dopamine baseline for next block.',
            };
        }
        // 2. STATS 
        if (mode === AppMode.STATS) {
            return {
                name: 'AUDIT',
                description: 'Review of long-term cognitive patterning and fatigue markers.',
            };
        }

        // 3. FOCUS MODES
        if (intensity >= 8) {
            return {
                name: 'DEEP ISO.',
                description: 'High-intensity focus block. Isolate for complex problem solving.',
            };
        } else if (intensity >= 4) {
            return {
                name: 'FLOW STATE',
                description: 'Maintaining cognitive endurance for long-form execution.',
            };
        } else {
            return {
                name: 'DIVERGENT',
                description: 'Low-inhibition state. Ideal for brainstorming and pattern recognition.',
            };
        }
    }, [mode, intensity]);

    const sessionTarget = 4;
    const currentSessionIndex = completedCount;

    return (
        <div className="w-full font-sans select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={readoutData.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-10" // Generous gap
                >
                    {/* KEY VALUE PAIRS - CLEAN & BENEFIT DRIVEN */}
                    <div className="space-y-3">
                        {/* STATE ROW */}
                        <div className="flex items-baseline relative h-4">
                            <span className="absolute left-0 text-[10px] text-[#666] tracking-[0.08em] font-medium uppercase w-[60px]">
                                State
                            </span>
                            <span className="absolute left-[80px] text-[12px] text-white font-normal leading-none uppercase tracking-wider">
                                {readoutData.name}
                            </span>
                        </div>

                        {/* PROFILE ROW - BENEFITS */}
                        <div className="flex items-baseline relative min-h-[4rem]">
                            <span className="absolute left-0 top-0 text-[10px] text-[#666] tracking-[0.08em] font-medium uppercase w-[60px]">
                                Benefit
                            </span>
                            <span className="absolute left-[80px] top-0 text-[11px] text-[#888] font-normal leading-[1.6]">
                                {readoutData.description}
                            </span>
                        </div>
                    </div>

                    {/* SESSION ARCHITECTURE TRACKER */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] text-white/50 tracking-[0.15em] font-medium uppercase">
                            Session Architecture
                        </span>

                        <div className="flex items-center justify-start gap-4">
                            {/* Visual Stepper */}
                            <div className="flex gap-1.5">
                                {Array.from({ length: sessionTarget }).map((_, i) => {
                                    const isComplete = i < completedCount;
                                    const isActive = i === completedCount && mode === AppMode.FOCUS;

                                    return (
                                        <div
                                            key={i}
                                            className={`
                                                w-8 h-2 rounded-[1px] transition-all duration-500
                                                ${isComplete ? 'bg-[#333] border border-[#333]' : ''}
                                                ${isActive ? 'bg-[#00FF85] border border-[#00FF85] shadow-[0_0_10px_rgba(0,255,133,0.4)] animate-pulse' : ''}
                                                ${!isComplete && !isActive ? 'bg-transparent border border-white/[0.1]' : ''}
                                            `}
                                        />
                                    );
                                })}
                            </div>

                            {/* Numeric Counter */}
                            <span className="text-[10px] font-mono text-[#666] tracking-widest">
                                0{Math.min(completedCount, sessionTarget)} / 0{sessionTarget}
                            </span>
                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};
