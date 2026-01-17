import React, { useMemo } from 'react';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemReadoutProps {
    mode: AppMode;
    intensity: number; // 1-10
}

interface ProfileConfig {
    name: string;
    stateSummary: string;
    characteristics: string[];
    recommendation: string;
    accentColor: string; // Tailwind class partial or hex
}

export const SystemReadout: React.FC<SystemReadoutProps> = ({ mode, intensity }) => {

    const readoutData = useMemo<ProfileConfig>(() => {
        // 1. RELAX MODE
        if (mode === AppMode.RELAX) {
            return {
                name: 'DEEP REST',
                stateSummary: 'Recovery Active',
                characteristics: [
                    'Parasympathetic',
                    'Dopamine Reset'
                ],
                recommendation: 'Disengage Visuals',
                accentColor: 'text-[#00FF85]'
            };
        }

        // 2. STATS MODE
        if (mode === AppMode.STATS) {
            return {
                name: 'AUDIT',
                stateSummary: 'Meta-Review',
                characteristics: [
                    'Pattern Match',
                    'Perf. Audit'
                ],
                recommendation: 'Review Metrics',
                accentColor: 'text-white'
            };
        }

        // 3. FOCUS MODES - Monochromatic Hierarchy
        if (intensity >= 8) {
            return {
                name: 'LASER',
                stateSummary: 'Maximal Load',
                characteristics: [
                    'High Beta',
                    'Zero Tolerance'
                ],
                recommendation: 'Single Thread',
                accentColor: 'text-[#00FF85]'
            };
        } else if (intensity >= 4) {
            return {
                name: 'FLOW',
                stateSummary: 'Steady State',
                characteristics: [
                    'Alpha-Theta',
                    'Adaptive Gate'
                ],
                recommendation: 'Standard Block',
                accentColor: 'text-white'
            };
        } else {
            return {
                name: 'IDEATION',
                stateSummary: 'Associative',
                characteristics: [
                    'Low Inhibition',
                    'Divergent'
                ],
                recommendation: 'Capture Ideas',
                accentColor: 'text-gray-400'
            };
        }
    }, [mode, intensity]);

    return (
        <div className="w-full px-1">
            {/* Precision Geometry: minimal border, no background fill to keep it airy */}
            <div className="w-full font-mono text-[9px] leading-relaxed text-[#444] select-none">

                {/* Tech Header Line */}
                <div className="flex items-center gap-2 mb-3 opacity-50">
                    <div className="w-1 h-1 bg-[#00FF85] rounded-full animate-pulse" />
                    <div className="h-[1px] flex-1 bg-white/[0.1]" />
                    <div className="text-[8px] tracking-[0.2em] font-medium">SYS_RD_01</div>
                </div>

                <div className="px-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={readoutData.name}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                        >
                            {/* HEADER */}
                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="uppercase tracking-[0.15em] text-[#666]">Profile</span>
                                    <span className={`font-bold tracking-[0.1em] ${readoutData.accentColor} drop-shadow-[0_0_8px_rgba(0,255,133,0.1)]`}>{readoutData.name}</span>
                                </div>
                            </div>

                            {/* STATE */}
                            <div className="mb-4 space-y-1">
                                <div className="flex items-center justify-between border-l border-white/[0.1] pl-2">
                                    <span className="text-[#555] tracking-wide">STATE</span>
                                    <span className="text-[#EAEAEA] tracking-wide">{readoutData.stateSummary}</span>
                                </div>
                                <div className="flex flex-col gap-1 pl-2 pt-1">
                                    {readoutData.characteristics.map((char, i) => (
                                        <div key={i} className="flex items-center justify-between text-[#666]">
                                            <span className="tracking-wide text-[8px] opacity-70">VAR_0{i + 1}</span>
                                            <span>{char}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
