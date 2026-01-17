import React, { useMemo } from 'react';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemReadoutProps {
    mode: AppMode;
    intensity: number;
}

interface ProfileConfig {
    name: string;
    description: string;
    metrics: { label: string; value: string }[];
    statusFlavor: string;
}

export const SystemReadout: React.FC<SystemReadoutProps> = ({ mode, intensity }) => {

    const readoutData = useMemo<ProfileConfig>(() => {
        // 1. RELAX MODE
        if (mode === AppMode.RELAX) {
            return {
                name: 'RECOVERY START',
                description: 'Optimized for parasympathetic activation and default mode network (DMN) connectivity.',
                metrics: [
                    { label: 'THROUGHPUT', value: 'LOW' },
                    { label: 'DOPAMINE', value: 'RESET' },
                    { label: 'WAVEFORM', value: 'ALPHA' }
                ],
                statusFlavor: 'DISENGAGED'
            };
        }
        // 2. STATS (Fallback for now, treating as Analysis)
        if (mode === AppMode.STATS) {
            return {
                name: 'META-ANALYSIS',
                description: 'Review of long-term cognitive patterning and fatigue markers.',
                metrics: [
                    { label: 'SCOPE', value: 'GLOBAL' },
                    { label: 'SOURCE', value: 'LOCAL' },
                    { label: 'STATE', value: 'AUDIT' }
                ],
                statusFlavor: 'REVIEW'
            };
        }

        // 3. FOCUS MODES
        if (intensity >= 8) {
            return {
                name: 'HYPER-FOCUS',
                description: 'Maximal prefrontal cortex engagement. Zero external tolerance. High metabolic cost.',
                metrics: [
                    { label: 'LOAD', value: 'PEAK' },
                    { label: 'LATENCY', value: '0MS' },
                    { label: 'GATE', value: 'LOCKED' }
                ],
                statusFlavor: 'NOMINAL'
            };
        } else if (intensity >= 4) {
            return {
                name: 'BALANCED FLOW',
                description: 'Sustainable neural synchronization. Ideal for complex synthesis and routine execution.',
                metrics: [
                    { label: 'STABILITY', value: '98%' },
                    { label: 'WAVEFORM', value: 'BETA' },
                    { label: 'GATE', value: 'ADAPTIVE' }
                ],
                statusFlavor: 'NOMINAL'
            };
        } else {
            return {
                name: 'DIVERGENT',
                description: 'Lowered latent inhibition. Optimized for associative linking and creative capture.',
                metrics: [
                    { label: 'NOISE', value: 'ALLOWED' },
                    { label: 'SCOPE', value: 'BROAD' },
                    { label: 'GATE', value: 'OPEN' }
                ],
                statusFlavor: 'ACTIVE'
            };
        }
    }, [mode, intensity]);

    return (
        <div className="w-full font-sans select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={readoutData.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                >
                    {/* KEY VALUE PAIRS - THE GRID */}
                    <div className="space-y-3">
                        {/* STATE ROW */}
                        <div className="flex items-baseline relative h-4">
                            <span className="absolute left-0 text-[10px] text-[#666] tracking-[0.08em] font-medium uppercase w-[60px]">
                                State
                            </span>
                            <span className="absolute left-[80px] text-[12px] text-white font-normal leading-none">
                                {readoutData.name}
                            </span>
                        </div>

                        {/* PROFILE ROW */}
                        <div className="flex items-baseline relative min-h-[4rem]">
                            <span className="absolute left-0 top-0 text-[10px] text-[#666] tracking-[0.08em] font-medium uppercase w-[60px]">
                                Profile
                            </span>
                            <span className="absolute left-[80px] top-0 text-[11px] text-[#888] font-normal leading-[1.6]">
                                {readoutData.description}
                            </span>
                        </div>

                        {/* DYNAMIC METRICS */}
                        {readoutData.metrics.map((m, i) => (
                            <div key={i} className="flex items-baseline relative h-4">
                                <span className="absolute left-0 text-[10px] text-[#666] tracking-[0.08em] font-medium uppercase w-[60px]">
                                    {m.label}
                                </span>
                                <span className="absolute left-[80px] text-[10px] font-mono text-[#00FF85] tracking-wide">
                                    {m.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* DIVIDER */}
                    <div className="w-full h-[1px] bg-white/[0.03] mt-2 mb-2" />

                    {/* SYS.LOAD */}
                    <div className="flex items-baseline relative h-4">
                        <span className="absolute left-0 text-[10px] text-[#666] tracking-[0.08em] font-medium uppercase w-[60px]">
                            Sys.Load
                        </span>
                        <span className="absolute left-[80px] text-[10px] font-mono text-[#00FF85] tracking-wide">
                            {readoutData.statusFlavor}
                        </span>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};
