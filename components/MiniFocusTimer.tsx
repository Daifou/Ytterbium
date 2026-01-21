import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionStatus } from '../types';
import { Clock, Pause } from 'lucide-react';

interface MiniFocusTimerProps {
    status: SessionStatus;
    elapsedSeconds: number;
    durationSeconds: number;
    isVisible?: boolean; // Optional for PiP
    onClick?: () => void;
    variant?: 'overlay' | 'pip';
}

export const MiniFocusTimer: React.FC<MiniFocusTimerProps> = ({
    status,
    elapsedSeconds,
    durationSeconds,
    isVisible = true,
    onClick,
    variant = 'overlay' // default to original behavior
}) => {
    const constraintsRef = useRef(null);

    // Calculate progress
    const progressPercent = durationSeconds > 0
        ? Math.min(100, (elapsedSeconds / durationSeconds) * 100)
        : 0;

    // Formatting Time
    const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

    // Status Colors
    const isRunning = status === SessionStatus.RUNNING;

    // ---------------------------------------------------------------------------
    // PiP VARIANT (Simpler, no animation wrapper, fills container)
    // ---------------------------------------------------------------------------
    if (variant === 'pip') {
        return (
            <div
                className="
          flex items-center gap-3
          px-4 py-3
          w-full h-full
          bg-[#0f0f12]
          text-white
        "
            >
                {/* Status Icon */}
                <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0">
                    {isRunning && (
                        <div className="absolute inset-0 rounded-lg animate-pulse bg-emerald-500/10" />
                    )}
                    {isRunning ? (
                        <Clock className="w-5 h-5 text-emerald-500" />
                    ) : (
                        <Pause className="w-5 h-5 text-amber-500" />
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 gap-1 min-w-0">
                    <div className="text-2xl font-mono font-bold tracking-tight text-neutral-100 leading-none">
                        {minutes}:{seconds}
                    </div>

                    {/* Progress */}
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
                        <div
                            className={`h-full ${isRunning ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${progressPercent}%`, transition: 'width 0.5s linear' }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------------------------
    // OVERLAY VARIANT (Original draggable implementation)
    // ---------------------------------------------------------------------------
    return (
        <>
            {/* Invisible constraints container for dragging */}
            <div
                ref={constraintsRef}
                className="fixed inset-0 pointer-events-none z-[9990]"
            />

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        drag
                        dragConstraints={constraintsRef}
                        dragElastic={0.1}
                        dragMomentum={false}
                        initial={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20, x: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        onClick={onClick}
                        className={`
              fixed top-6 right-6 z-[9999]
              flex items-center gap-3
              px-3 py-2
              bg-[#0f0f12]/80 backdrop-blur-xl
              border border-white/[0.08]
              rounded-xl
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              cursor-pointer
              group
              hover:border-white/[0.15]
              transition-colors duration-300
              w-[160px]
            `}
                    >
                        {/* Status Icon/Indicator */}
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900/50 border border-neutral-800 shrink-0">
                            {isRunning && (
                                <div className="absolute inset-0 rounded-lg animate-pulse bg-emerald-500/10" />
                            )}
                            {isRunning ? (
                                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                                <Pause className="w-3.5 h-3.5 text-amber-500" />
                            )}
                        </div>

                        {/* Time & Bar Container */}
                        <div className="flex flex-col flex-1 gap-1.5 min-w-0">

                            {/* Time Display */}
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-mono font-bold tracking-tight px-0.5 ${isRunning ? 'text-neutral-100' : 'text-neutral-400'}`}>
                                    {minutes}:{seconds}
                                </span>
                            </div>

                            {/* Minimal Progress Bar */}
                            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${isRunning ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.5, ease: "linear" }}
                                />
                            </div>
                        </div>

                        {/* Hover Hint (Optional) */}
                        <div className="absolute inset-0 rounded-xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
