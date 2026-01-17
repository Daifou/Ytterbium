import React, { useMemo } from 'react';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemReadoutProps {
    mode: AppMode;
    intensity: number;
}

interface ProfileConfig {
    name: string;
    stateSummary: string;
    characteristics: string[];
    accentColor: string;
}

export const SystemReadout: React.FC<SystemReadoutProps> = ({ mode, intensity }) => {

    const readoutData = useMemo<ProfileConfig>(() => {
        if (mode === AppMode.RELAX) {
            return {
                name: 'DEEP REST',
                stateSummary: 'Recovery Active',
                characteristics: ['Parasympathetic', 'Dopamine Reset'],
                accentColor: 'text-[#00FF85]'
            };
        }
        if (mode === AppMode.STATS) {
            return {
                name: 'ANALYTICS',
                stateSummary: 'Review Mode',
                characteristics: ['Pattern Audit', 'Metric Sync'],
                accentColor: 'text-[#00FF85]'
            };
        }
        // FOCUS MODES
        if (intensity >= 8) {
            return {
                name: 'DEEP LASER',
                stateSummary: 'High Cognitive Load',
                characteristics: ['Beta Dominance', 'Zero Tolerance'],
                accentColor: 'text-[#00FF85]'
            };
        } else if (intensity >= 4) {
            return {
                name: 'BALANCED',
                stateSummary: 'Sustainable Flow',
                characteristics: ['Alpha-Theta', 'Adaptive Gate'],
                accentColor: 'text-[#00FF85]'
            };
        } else {
            return {
                name: 'CREATIVE',
                stateSummary: 'Associative Link',
                characteristics: ['Low Inhibition', 'Divergent'],
                accentColor: 'text-[#00FF85]'
            };
        }
    }, [mode, intensity]);

    return (
        // NO CONTAINER - PURE TEXT
        <div className="w-full font-sans select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={readoutData.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-6"
                >
                    {/* 1. STATE INDICATOR */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[#666] tracking-[0.1em] font-medium uppercase">
                            State
                        </span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#00FF85] rounded-full shadow-[0_0_8px_rgba(0,255,133,0.5)]" />
                            <span className="text-[13px] text-white font-normal tracking-wide">
                                {readoutData.name}
                            </span>
                        </div>
                    </div>

                    {/* 2. PROFILE DATA */}
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-[#666] tracking-[0.1em] font-medium uppercase">
                            Profile
                        </span>
                        <span className="text-[13px] text-white/90 font-normal tracking-wide">
                            {readoutData.stateSummary}
                        </span>
                    </div>

                    {/* 3. ACTIVE GATES (Characteristics) */}
                    <div className="flex flex-col gap-2 pt-2">
                        {readoutData.characteristics.map((char, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <span className="text-[10px] text-[#444] uppercase tracking-[0.1em]">
                                    Gate 0{i + 1}
                                </span>
                                <span className="text-[11px] text-[#888] font-mono tracking-tight">
                                    {char}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* DIVIDER LINE (Subtle) */}
                    <div className="w-full h-[1px] bg-white/[0.03] mt-2 mb-2" />

                    {/* SYSTEM STATUS (Dummy Data for "Tech" feel) */}
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#444] uppercase tracking-[0.1em]">Sys.Load</span>
                        <span className="text-[10px] text-[#00FF85] font-mono">NOMINAL</span>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};
