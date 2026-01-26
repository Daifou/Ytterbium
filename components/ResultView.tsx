import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#09090b]/90 backdrop-blur-xl p-4 md:p-8"
        >
            <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-6xl h-[85vh] md:h-[80vh] flex flex-col md:flex-row bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* 1. LEFT COLUMN: CONTEXT (35%) */}
                <div className="w-full md:w-[35%] flex flex-col border-b md:border-b-0 md:border-r border-white/10 bg-[#0d0d0e] relative">
                    <div className="flex-1 p-8 md:p-10 flex flex-col gap-10 overflow-y-auto">

                        {/* Section 1: Input */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-white/40 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">01 Input Parameters</span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-medium text-white/90 leading-snug text-balance font-serif italic">
                                "{task}"
                            </h2>
                        </div>

                        {/* Section 2: Analysis */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-indigo-400/60 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">02 Neural Analysis</span>
                            </div>
                            <div className="space-y-6">
                                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                                    Cognitive load assessment complete.
                                </p>
                                <p className="text-zinc-300 text-sm leading-relaxed font-light border-l-2 border-indigo-500/20 pl-4 py-1">
                                    {result.insight.replace(/^"|"$/g, '')}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Footer / Brand */}
                    <div className="p-8 border-t border-white/5 opacity-50">
                        <div className="flex items-center gap-3">
                            <Logo className="w-6 h-6 text-zinc-600" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">Ytterbium OS</span>
                        </div>
                    </div>
                </div>

                {/* 2. RIGHT COLUMN: THE OBJECT (65%) */}
                <div className="flex-1 relative bg-[#09090b] flex flex-col items-center justify-center p-8 md:p-16">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* The Card Object */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="relative w-full max-w-[420px] bg-[#121214] border border-white/5 rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Card Header: Illustration */}
                        <div className="h-48 md:h-64 bg-gradient-to-b from-[#18181b] to-[#121214] relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.2),transparent_70%)]" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                                <div className="w-24 h-24 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out">
                                    {showLock ? (
                                        <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
                                            <svg className="w-10 h-10 text-white/90 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2 font-medium">Environment</div>
                                    <div className="text-3xl font-medium text-white tracking-tight">{result.focusMode}</div>
                                </div>
                            </div>
                        </div>

                        {/* Card Body: Stats */}
                        <div className="p-8 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Intensity</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-medium text-white">{result.intensity}</span>
                                        <span className="text-sm text-zinc-600 mb-1">/10</span>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.intensity * 10}%` }}
                                            transition={{ delay: 0.6, duration: 1 }}
                                            className="h-full bg-indigo-500/50"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Structure</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-xl font-medium text-white">{result.suggestedSessions}</span>
                                        <span className="text-[11px] text-zinc-600 mb-1 leading-none">SESSIONS</span>
                                    </div>
                                    <div className="flex gap-1 mt-3">
                                        {[...Array(result.suggestedSessions > 6 ? 6 : result.suggestedSessions)].map((_, i) => (
                                            <div key={i} className="flex-1 h-1 rounded-full bg-emerald-500/40" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Action */}
                            <motion.button
                                whileHover={!isSyncing ? { scale: 1.01 } : {}}
                                whileTap={!isSyncing ? { scale: 0.99 } : {}}
                                onClick={onStartSession}
                                disabled={isSyncing}
                                className={`w-full h-14 rounded-lg font-medium text-[13px] tracking-wide uppercase transition-all flex items-center justify-center gap-3 ${showLock
                                    ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                                    : isSyncing
                                        ? 'bg-zinc-800 text-zinc-500 cursor-wait border border-zinc-700'
                                        : 'bg-white text-black hover:bg-zinc-200 shadow-xl shadow-white/5'
                                    }`}
                            >
                                {showLock ? (
                                    <>Limit Reached</>
                                ) : isSyncing ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />
                                        Initializing...
                                    </>
                                ) : (
                                    <>
                                        Enter Environment
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </motion.div>
    );
};
