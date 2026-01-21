import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionStatus } from '../types';
import { Clock, Pause, Activity, Zap } from 'lucide-react';

interface MiniFocusTimerProps {
    status: SessionStatus;
    elapsedSeconds: number;
    durationSeconds: number;
    fatigueScore: number;
    isVisible?: boolean;
    onClick?: () => void;
    variant?: 'overlay' | 'pip';
}

export const MiniFocusTimer: React.FC<MiniFocusTimerProps> = ({
    status,
    elapsedSeconds,
    durationSeconds,
    fatigueScore,
    isVisible = true,
    onClick,
    variant = 'overlay'
}) => {
    const constraintsRef = useRef(null);

    const progressPercent = durationSeconds > 0
        ? Math.min(100, (elapsedSeconds / durationSeconds) * 100)
        : 0;

    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

    const isRunning = status === SessionStatus.RUNNING;
    const isFinished = elapsedSeconds >= durationSeconds && durationSeconds > 0;

    // --- SHARED STYLES ---
    const primaryGlow = isRunning ? "rgba(52, 211, 153, 0.4)" : "rgba(251, 191, 36, 0.4)";
    const primaryColor = isRunning ? "text-emerald-500" : "text-amber-500";
    const primaryBg = isRunning ? "bg-emerald-500" : "bg-amber-500";

    // Spectral Edge Glow (Apple-inspired)
    const spectralGlowClasses = `
        relative
        before:content-['']
        before:absolute before:inset-0 before:rounded-2xl 
        before:p-[1px] 
        ${isRunning ? `
            before:bg-gradient-to-tr 
            before:from-emerald-400/20 before:via-white/5 before:to-emerald-400/20
            shadow-[0_0_25px_rgba(52,211,153,0.1)]
        ` : `
            before:bg-gradient-to-tr 
            before:from-amber-400/20 before:via-white/5 before:to-amber-400/20
            shadow-[0_0_25px_rgba(251,191,36,0.1)]
        `}
        before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:mask-composite-exclude
        before:pointer-events-none
        before:z-20
        ${isRunning ? 'before:animate-pulse' : ''}
    `;

    // ---------------------------------------------------------------------------
    // PiP VARIANT (The "Window Mode" player)
    // ---------------------------------------------------------------------------
    if (variant === 'pip') {
        return (
            <div className="w-full h-full bg-[#050507] text-white flex flex-col font-sans overflow-hidden p-4 relative border border-white/5">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.05),transparent)] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Main Content */}
                <div className="flex items-start justify-between gap-4 flex-1 z-10">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black italic text-emerald-500/80 tracking-tighter uppercase leading-none">YTTERBIUM</span>
                            <div className="h-2 w-[1px] bg-white/10" />
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
                                {isRunning ? "Deep Work" : "Recovery"}
                            </span>
                        </div>
                        <div className="text-5xl font-mono font-bold tracking-tighter text-white tabular-nums leading-tight drop-shadow-2xl">
                            {minutes}<span className="text-neutral-600 font-sans mx-[-2px] animate-pulse">:</span>{seconds}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 pt-2">
                        {/* Status Icon with Dynamic Glow */}
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 shadow-xl overflow-hidden group">
                            <div className={`absolute inset-0 ${isRunning ? 'bg-emerald-500/5' : 'bg-amber-500/5'}`} />
                            {isRunning ? (
                                <Zap className="w-6 h-6 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            ) : (
                                <Clock className="w-6 h-6 text-amber-500" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Metrics (Apple Style) */}
                <div className="mt-4 space-y-3 z-10">
                    {/* Session Progress */}
                    <div className="relative h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.05]">
                        <motion.div
                            className={`h-full ${primaryBg} shadow-[0_0_12px_${primaryGlow}]`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>

                    {/* Meta Info: Cognitive Load & Session State */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 text-neutral-600" />
                            <span className="text-[10px] font-bold text-neutral-500 tracking-wider flex items-center gap-2">
                                COGNITIVE LOAD
                                <span className={`text-[11px] font-mono font-black ${fatigueScore > 75 ? 'text-red-500' : 'text-neutral-400'}`}>
                                    {fatigueScore}%
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-1 h-3 items-end">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-500 ${fatigueScore / 20 >= i ? 'bg-emerald-500/40 h-full' : 'bg-white/5 h-1'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // OVERLAY VARIANT (The floating dashboard widget)
    // ---------------------------------------------------------------------------
    return (
        <>
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[9990]" />
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.1}
                        initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                        onClick={onClick}
                        className={`
                            fixed bottom-24 right-8 z-[9999]
                            w-[240px] 
                            bg-[#0a0a0c]/80 backdrop-blur-3xl
                            rounded-[24px]
                            p-4
                            cursor-grab active:cursor-grabbing
                            group
                            flex flex-col gap-4
                            ${spectralGlowClasses}
                        `}
                    >
                        {/* Status Bar */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                <span className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
                                    {isRunning ? "Focus Active" : "Paused"}
                                </span>
                            </div>
                            <Activity className={`w-3.5 h-3.5 ${fatigueScore > 75 ? 'text-red-500' : 'text-neutral-600'}`} />
                        </div>

                        {/* Visual Separation Line */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                        {/* Central Time Node */}
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-mono font-bold tracking-tighter text-white drop-shadow-xl flex-1 px-1">
                                {minutes}:{seconds}
                            </div>
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900/50 border border-white/10 shrink-0">
                                {isRunning ? (
                                    <Zap className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Clock className="w-5 h-5 text-amber-500" />
                                )}
                            </div>
                        </div>

                        {/* Progressive Metrics Layer */}
                        <div className="space-y-3">
                            {/* Main Progress Bar */}
                            <div className="relative h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    className={`h-full ${primaryBg} shadow-[0_0_10px_${primaryGlow}]`}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1 }}
                                />
                            </div>

                            {/* Fatigue Indicator Strip */}
                            <div className="flex flex-col gap-1.5 pt-1">
                                <div className="flex justify-between items-center text-[10px] font-bold tracking-tighter">
                                    <span className="text-neutral-500 uppercase">COGNITIVE LOAD</span>
                                    <span className={fatigueScore > 75 ? 'text-red-400' : 'text-neutral-400'}>{fatigueScore}%</span>
                                </div>
                                <div className="grid grid-cols-10 gap-0.5 h-[3px]">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-full transition-all duration-700 ${fatigueScore / 10 > i ? 'bg-emerald-500/30' : 'bg-white/5'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Hint */}
                        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px] pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
