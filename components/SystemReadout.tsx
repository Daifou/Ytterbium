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
                name: 'DEEP LASER FOCUS',
                description: 'High-intensity neural isolation. Optimized for complex problem solving.',
            };
        } else if (intensity >= 4) {
            return {
                name: 'BALANCED FOCUS',
                description: 'State-stable cognitive endurance. Ideal for long-form execution.',
            };
        } else {
            return {
                name: 'CREATIVE FOCUS',
                description: 'Low-inhibition neural state. Optimized for ideation and design.',
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
                    transition={{ duration: 0.1 }}
                    className="flex flex-col gap-6"
                >
                    {/* PREMIUM DIAGNOSTIC CARD */}
                    <div className="relative bg-neutral-950/50 rounded-lg p-3.5 border border-neutral-700/30 overflow-hidden flex flex-col justify-center">
                        {/* Corner Detail */}
                        <div className="absolute top-3 right-3 text-[8px] font-mono text-white/20 whitespace-nowrap">
                            REF_ID: 04-B
                        </div>

                        <div className="space-y-4">
                            {/* STATE */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] text-primary tracking-[0.05em] font-bold uppercase">
                                    {readoutData.name}
                                </span>
                                <span className="text-[12px] text-neutral-400 font-normal leading-relaxed">
                                    {readoutData.description}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SESSION ARCHITECTURE TRACKER CARD */}
                    <div className="relative bg-neutral-950/50 rounded-lg p-3.5 border border-neutral-700/30 overflow-hidden flex flex-col justify-center">
                        <div className="flex flex-col gap-4">
                            {/* Header Logic: Zero-Wrap Single Line Lockdown */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] text-neutral-600 tracking-[0.1em] font-medium uppercase whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                                    Sessions
                                </span>
                                {/* Numeric Counter - Forced horizontal alignment - ZERO WRAP */}
                                <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase whitespace-nowrap flex-shrink-0">
                                    {completedCount} / {sessionTarget}
                                </span>
                            </div>

                            <div className="flex items-center justify-start">
                                {/* Visual Stepper - Surgical Blades */}
                                <div className="flex gap-1.5">
                                    {Array.from({ length: sessionTarget }).map((_, i) => {
                                        const isComplete = i < completedCount;
                                        const isActive = i === completedCount && mode === AppMode.FOCUS;

                                        return (
                                            <div
                                                key={i}
                                                className={`
                                                    w-4 h-[3px] rounded-full transition-all duration-300
                                                    ${isComplete ? 'bg-primary' : ''}
                                                    ${isActive ? 'bg-primary animate-pulse' : ''}
                                                    ${!isComplete && !isActive ? 'bg-neutral-800' : ''}
                                                `}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};
