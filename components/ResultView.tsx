import React from 'react';
import { motion } from 'framer-motion';

interface ResultViewProps {
    task: string;
    result: any;
    onStartSession: () => void;
    showLock?: boolean;
    isSyncing?: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
    task,
    result,
    onStartSession,
    showLock,
    isSyncing
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#09090b] px-6"
        >
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">

                {/* 1. SESSION COUNT (Subtle, Top) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mb-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                        {result.suggestedSessions} Sessions Recommended
                    </span>
                </motion.div>

                {/* 2. THE TASK (Primary Focus) */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-medium text-white tracking-tight text-balance leading-tight mb-8"
                >
                    {task}
                </motion.h1>

                {/* 3. FOCUS MODE (Subtle Indicator) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="flex flex-col items-center gap-2 mb-16"
                >
                    <div className="text-[13px] text-zinc-500 font-medium tracking-wide">
                        Mode: <span className="text-zinc-300">{result.focusMode}</span>
                        <span className="mx-2 text-zinc-800">•</span>
                        Intensity: <span className="text-zinc-300">{result.intensity}/10</span>
                    </div>
                </motion.div>

                {/* 4. ACTION (Enter) */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onStartSession}
                    disabled={isSyncing}
                    className="group relative px-8 py-4 rounded-full bg-white text-black font-medium text-sm tracking-wide transition-all hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSyncing ? (
                        <span className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />
                            Syncing...
                        </span>
                    ) : (
                        <span>
                            {showLock ? "Unlock Environment" : "Enter Focus Environment"}
                        </span>
                    )}

                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 -z-10 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                </motion.button>

                {/* 5. MINIMAL REASONING (Optional/Deep Calm) */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-12 text-zinc-600 text-sm font-light max-w-lg leading-relaxed"
                >
                    {result.insight.replace(/^"|"$/g, '')}
                </motion.p>

            </div>
        </motion.div>
    );
};
