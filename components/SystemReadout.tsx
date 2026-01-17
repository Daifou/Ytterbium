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
                    transition={{ duration: 0.02 }} // 20ms fade-in as requested
                    className="flex flex-col gap-12" // Enforce strict spacing (48px = gap-12)
                >
                    {/* PREMIUM DIAGNOSTIC CARD */}
                    <div className="relative bg-white/[0.02] rounded-xl p-4 border-t border-white/[0.05] overflow-hidden shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.05)]">
                        {/* Corner Detail */}
                        <div className="absolute top-3 right-3 text-[8px] font-mono text-white/20 whitespace-nowrap">
                            REF_ID: 04-B
                        </div>

                        <div className="space-y-4">
                            {/* STATE */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-[#00FF85] tracking-[0.08em] font-bold uppercase">
                                    {readoutData.name}
                                </span>
                                <span className="text-[11px] text-[#A0A0A0] font-normal leading-[1.6]">
                                    {readoutData.description}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SESSION ARCHITECTURE TRACKER */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-start gap-2">
                            <span className="text-[10px] text-white/50 tracking-[0.1em] font-medium uppercase min-w-fit">
                                Session Architecture
                            </span>
                            {/* Numeric Counter - Exactly 8px from title */}
                            <span className="text-[10px] font-mono text-[#666] tracking-widest uppercase ml-[8px]">
                                0{Math.min(completedCount, sessionTarget)} / 0{sessionTarget}
                            </span>
                        </div>

                        <div className="flex items-center justify-start pt-1">
                            {/* Visual Stepper - God-Tier Blades */}
                            <div className="flex gap-2">
                                {Array.from({ length: sessionTarget }).map((_, i) => {
                                    const isComplete = i < completedCount;
                                    const isActive = i === completedCount && mode === AppMode.FOCUS;

                                    return (
                                        <div
                                            key={i}
                                            className={`
                                                w-[2px] h-[16px] rounded-[0.5px] transition-all duration-500
                                                ${isComplete ? 'bg-[#2A332E]' : ''}
                                                ${isActive ? 'bg-[#00FF85] shadow-[0_0_12px_#00FF85] animate-pulse' : ''}
                                                ${!isComplete && !isActive ? 'bg-transparent border border-white/10' : ''}
                                            `}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};
