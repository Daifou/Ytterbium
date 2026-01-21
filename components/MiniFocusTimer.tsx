import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionStatus } from '../types';
import { Clock, Pause, Activity } from 'lucide-react';

interface MiniFocusTimerProps {
    status: SessionStatus;
    elapsedSeconds: number;
    durationSeconds: number;
    fatigueScore: number; // Added
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

    // Premium Glow Classes (Matching main timer)
    const spectralGlowClasses = isRunning ? `
        before:content-['']
        before:absolute before:inset-0 before:rounded-xl 
        before:p-[0.5px] 
        before:bg-gradient-to-tr 
        before:from-emerald-400/20 before:via-white/5 before:to-emerald-400/20
        before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:mask-composite-exclude
        before:pointer-events-none
        before:z-20
        before:animate-pulse
        shadow-[0_0_20px_rgba(52,211,153,0.08)]
    ` : isFinished ? `
        before:content-['']
        before:absolute before:inset-0 before:rounded-xl 
        before:p-[1px] 
        before:bg-gradient-to-tr 
        before:from-amber-400/40 before:via-white/20 before:to-amber-400/40
        before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:mask-composite-exclude
        before:pointer-events-none
        before:z-20
        before:animate-pulse
        shadow-[0_0_30px_rgba(251,191,36,0.15)]
    ` : 'border border-white/[0.08]';

    // ---------------------------------------------------------------------------
    // PiP VARIANT (Minimalist but Premium)
    // ---------------------------------------------------------------------------
    if (variant === 'pip') {
        return (
            <div className="w-full h-full bg-[#050507] text-white flex flex-col font-sans overflow-hidden p-3 relative">
                {/* Background Texture */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.03),transparent)] pointer-events-none" />

                {/* Timer Area */}
                <div className="flex items-center gap-4 flex-1">
                    {/* Icon Block */}
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 border border-white/[0.05] shrink-0">
                        {isRunning && <div className="absolute inset-0 rounded-xl animate-pulse bg-emerald-500/5" />}
                        {isRunning ? (
                            <Clock className="w-6 h-6 text-emerald-500" />
                        ) : (
                            <Pause className="w-6 h-6 text-amber-500" />
                        )}
                    </div>

                    {/* Time Info */}
                    <div className="flex flex-col flex-1 gap-1.5 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                            <span className="text-3xl font-mono font-bold tracking-tight text-white leading-none">
                                {minutes}:{seconds}
                            </span>
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-none">
                                {isRunning ? "FOCUS" : "IDLE"}
                            </span>
                        </div>

                        {/* Focus Progress */}
                        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/[0.03]">
                            <motion.div
                                className={`h-full ${isRunning ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-amber-500'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Metrics Area: Cognitive Load */}
                <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-neutral-500" />
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Cognitive Load</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 max-w-[80px]">
                        <div className="flex-1 h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/[0.03]">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${fatigueScore}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 tabular-nums">{fatigueScore}</span>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // OVERLAY VARIANT (Premium Draggable)
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
                        initial={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, filter: 'blur(10px)' }}
                        onClick={onClick}
                        className={`
                            fixed bottom-24 right-8 z-[9999]
                            w-[220px] 
                            bg-[#0f0f12]/85 backdrop-blur-2xl
                            rounded-2xl
                            p-3
                            cursor-grab active:cursor-grabbing
                            group
                            flex flex-col gap-3
                            ${spectralGlowClasses}
                        `}
                    >
                        {/* Header: Status & Brand */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.05]">
                                <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                                    {isRunning ? "Running" : "Paused"}
                                </span>
                            </div>
                            <span className="text-[9px] font-black italic text-neutral-600 tracking-tighter group-hover:text-emerald-500/50 transition-colors">YTTERBIUM</span>
                        </div>

                        {/* Main Info */}
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-mono font-bold tracking-tight text-neutral-100 drop-shadow-sm">
                                {minutes}:{seconds}
                            </span>
                            <div className="flex-1 flex flex-col gap-1.5">
                                <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-white/[0.03]">
                                    <motion.div
                                        className={`h-full ${isRunning ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-amber-500'}`}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cognitive Load Metric */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Cognitive Load</span>
                                <span className="text-[10px] font-mono text-neutral-300">{fatigueScore}%</span>
                            </div>
                            <div className="w-full h-0.5 bg-neutral-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                                    animate={{ width: `${fatigueScore}%` }}
                                />
                            </div>
                        </div>

                        {/* Click to Expand Overlay */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
