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
                name: 'DEEP_REST',
                stateSummary: 'Neural recovery active',
                characteristics: [
                    'Parasympathetic activation',
                    'Dopamine resensitization'
                ],
                recommendation: 'Visual disengagement',
                accentColor: 'text-emerald-400'
            };
        }

        // 2. STATS MODE (Fallback/Specific)
        if (mode === AppMode.STATS) {
            return {
                name: 'ANALYTICS',
                stateSummary: 'Metacognitive review',
                characteristics: [
                    'Pattern recognition',
                    'Performance audit'
                ],
                recommendation: 'Evaluate fatigue metrics',
                accentColor: 'text-indigo-400'
            };
        }

        // 3. FOCUS MODES (Based on Intensity)
        if (intensity >= 8) {
            return {
                name: 'DEEP_LASER',
                stateSummary: 'Maximal cognitive load',
                characteristics: [
                    'High beta wave dominance',
                    'Zero external tolerance'
                ],
                recommendation: 'Maintain singular thread',
                accentColor: 'text-cyan-400'
            };
        } else if (intensity >= 4) {
            return {
                name: 'BALANCED',
                stateSummary: 'Sustainable flow state',
                characteristics: [
                    'Alpha-Theta oscillation',
                    'Adaptive focus gating'
                ],
                recommendation: 'Standard work blocks',
                accentColor: 'text-blue-400'
            };
        } else {
            return {
                name: 'CREATIVE',
                stateSummary: 'Associative thinking',
                characteristics: [
                    'Reduced latent inhibition',
                    'Divergent thought paths'
                ],
                recommendation: 'Capture tangential ideas',
                accentColor: 'text-purple-400'
            };
        }
    }, [mode, intensity]);

    return (
        <div className="w-full mt-auto px-1 pb-4">
            <div className="w-full rounded-md bg-[#0A0A0A] border border-white/[0.05] p-3 font-mono text-[10px] leading-relaxed text-[#666] select-none">

                <AnimatePresence mode="wait">
                    <motion.div
                        key={readoutData.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* HEADER */}
                        <div className="mb-3 border-b border-white/[0.05] pb-2">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="uppercase tracking-wider">SYSTEM MODE:</span>
                                <span className={`${readoutData.accentColor} font-bold`}>{mode}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="uppercase tracking-wider">PROFILE:</span>
                                <span className="text-[#EAEAEA] font-bold tracking-widest">{readoutData.name}</span>
                            </div>
                        </div>

                        {/* STATE */}
                        <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[#EAEAEA]">STATE:</span>
                                <span>{readoutData.stateSummary}</span>
                            </div>
                            <ul className="flex flex-col gap-0.5 pl-0">
                                {readoutData.characteristics.map((char, i) => (
                                    <li key={i} className="flex items-center gap-1.5">
                                        <span className={`w-1 h-1 rounded-full ${readoutData.accentColor.replace('text-', 'bg-')} opacity-50`} />
                                        <span>{char}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* RECOMMENDATION */}
                        <div>
                            <span className="block text-[#EAEAEA] mb-0.5 uppercase tracking-wider text-[9px]">RECOMMENDED:</span>
                            <div className="flex items-center gap-1.5 text-[#888]">
                                <span className="text-cyan-500">→</span>
                                <span>{readoutData.recommendation}</span>
                            </div>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
