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
            className="fixed inset-0 z-[300] flex items-center justify-center bg-[#09090b]/95 backdrop-blur-xl p-4 md:p-8"
        >
            <motion.div
                initial={{ scale: 0.98, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl h-auto md:h-[540px] flex flex-col md:flex-row bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* 1. LEFT COLUMN: CHAT STYLE (35%) */}
                <div className="w-full md:w-[40%] flex flex-col border-b md:border-b-0 md:border-r border-white/10 bg-[#0d0d0e] relative">
                    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-hidden">

                        <div className="mb-4">
                            <h2 className="text-xl md:text-2xl font-medium text-white/90 leading-snug text-balance">
                                "{task}"
                            </h2>
                        </div>

                        {/* User Bubble */}
                        <div className="flex flex-col items-end space-y-2">
                            <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-tr-sm max-w-[95%] border border-white/5">
                                <p className="text-zinc-200 text-sm leading-relaxed font-sans">{task}</p>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-medium px-1">You</span>
                        </div>

                        {/* AI Bubble */}
                        <div className="flex flex-col items-start space-y-2">
                            <div className="flex items-center gap-2 mb-1 px-1">
                                <div className="w-4 h-4 text-indigo-500">
                                    <Logo className="w-full h-full" />
                                </div>
                                <span className="text-[10px] text-zinc-500 font-medium">Ytterbium</span>
                            </div>
                            <div className="space-y-4 max-w-[95%]">
                                <p className="text-zinc-400 text-sm leading-relaxed font-light font-sans">
                                    Based on your request, I've calibrated a specialized environment.
                                </p>
                                <p className="text-zinc-300 text-sm leading-relaxed font-light font-sans bg-white/[0.03] p-3 rounded-lg border border-white/5">
                                    {result.insight.replace(/^"|"$/g, '')}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. RIGHT COLUMN: THE OBJECT (65%) */}
                <div className="flex-1 relative bg-[#09090b] flex flex-col items-center justify-center p-8">
                    {/* Minimal Background Grid (Top Only) */}
                    <div className="absolute inset-x-0 top-0 h-32 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                            maskImage: 'linear-gradient(to bottom, black, transparent)'
                        }}
                    />

                    {/* The Card Object - No Glow/Effects */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="relative w-full max-w-[380px] bg-[#121214] border border-white/5 rounded-xl shadow-xl overflow-hidden flex flex-col"
                    >
                        {/* Card Header: Simple Info */}
                        <div className="pt-8 pb-4 bg-[#121214] flex flex-col items-center justify-center border-b border-white/[0.03]">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-medium">Focus Mode</div>
                            <div className="text-2xl font-medium text-white tracking-tight">{result.focusMode}</div>
                        </div>

                        {/* Card Body: Stats */}
                        <div className="p-6 space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Intensity</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-lg font-medium text-white">{result.intensity}</span>
                                        <span className="text-xs text-zinc-600 mb-1">/10</span>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                        <div
                                            style={{ width: `${result.intensity * 10}%` }}
                                            className="h-full bg-zinc-400"
                                        />
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                    <div className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-2">Structure</div>
                                    <div className="flex items-end gap-2">
                                        <span className="text-lg font-medium text-white">{result.suggestedSessions}</span>
                                        <span className="text-[10px] text-zinc-600 mb-1 leading-none uppercase">SESSIONS</span>
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        {[...Array(result.suggestedSessions > 6 ? 6 : result.suggestedSessions)].map((_, i) => (
                                            <div key={i} className="flex-1 h-1 rounded-full bg-zinc-500/40" />
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
                                className={`w-full h-12 rounded-lg font-medium text-[13px] tracking-wide uppercase transition-all flex items-center justify-center gap-3 ${showLock
                                    ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                                    : isSyncing
                                        ? 'bg-zinc-800 text-zinc-500 cursor-wait border border-zinc-700'
                                        : 'bg-white text-black hover:bg-zinc-200'
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
