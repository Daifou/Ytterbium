import React, { useMemo } from 'react';
import { AppMode } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

import { Search, Sparkles, Check, X, ArrowRight } from 'lucide-react';

interface SystemReadoutProps {
    mode: AppMode;
    intensity: number;
    completedCount: number;
    sessionStatus: any;
    sidebarAIState: 'idle' | 'analyzing' | 'confirming';
    sidebarAnalysis: any;
    onSidebarAISubmit: (task: string) => void;
    onConfirmSession: (action: 'start_new' | 'resume') => void;
    onCancelAI: () => void;
}

interface ProfileConfig {
    name: string;
    description: string;
}

export const SystemReadout: React.FC<SystemReadoutProps> = ({
    mode, intensity, completedCount,
    sessionStatus, sidebarAIState, sidebarAnalysis, onSidebarAISubmit, onConfirmSession, onCancelAI
}) => {
    const [taskInput, setTaskInput] = React.useState('');

    const readoutData = useMemo<ProfileConfig>(() => {
        // 1. RELAX MODE
        if (mode === AppMode.RELAX) {
            return {
                name: 'SYSTEM REST',
                description: 'Rapid parasympathetic recovery. Restores dopamine baseline for next block.',
            };
        }
        // 2. STATS 
        if (mode === AppMode.STATS) {
            return {
                name: 'AUDIT',
                description: 'Review of long-term cognitive patterning and fatigue markers.',
            };
        }

        // 3. FOCUS MODES
        if (intensity >= 8) {
            return {
                name: 'DEEP LASER FOCUS',
                description: 'High-intensity neural isolation. Optimized for complex problem solving.',
            };
        } else if (intensity >= 4) {
            return {
                name: 'BALANCED FOCUS',
                description: 'State-stable cognitive endurance. Ideal for long-form execution.',
            };
        } else {
            return {
                name: 'CREATIVE FOCUS',
                description: 'Low-inhibition neural state. Optimized for ideation and design.',
            };
        }
    }, [mode, intensity]);

    const sessionTarget = 4;
    const currentSessionIndex = completedCount;

    return (
        <div className="w-full font-sans select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={readoutData.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex flex-col gap-6"
                >
                    {/* PREMIUM DIAGNOSTIC CARD */}
                    <div className="relative bg-neutral-950/50 rounded-lg p-3.5 border border-neutral-700/30 overflow-hidden flex flex-col justify-center">
                        <div className="space-y-4">
                            {/* STATE */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] text-primary tracking-[0.05em] font-bold uppercase">
                                    {readoutData.name}
                                </span>
                                <span className="text-[12px] text-neutral-400 font-normal leading-relaxed">
                                    {readoutData.description}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* SESSION ARCHITECTURE TRACKER CARD */}
                    <div className="relative bg-neutral-950/50 rounded-lg p-3.5 border border-neutral-700/30 overflow-hidden flex flex-col justify-center">
                        <div className="flex flex-col gap-4">
                            {/* Header Logic: Zero-Wrap Single Line Lockdown */}
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] text-neutral-600 tracking-[0.1em] font-medium uppercase whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                                    Sessions
                                </span>
                                {/* Numeric Counter - Forced horizontal alignment - ZERO WRAP */}
                                <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase whitespace-nowrap flex-shrink-0">
                                    {completedCount} / {sessionTarget}
                                </span>
                            </div>

                            <div className="flex items-center justify-start">
                                {/* Visual Stepper - Surgical Blades */}
                                <div className="flex gap-1.5">
                                    {Array.from({ length: sessionTarget }).map((_, i) => {
                                        const isComplete = i < completedCount;
                                        const isActive = i === completedCount && mode === AppMode.FOCUS;

                                        return (
                                            <div
                                                key={i}
                                                className={`
                                                    w-4 h-[3px] rounded-full transition-all duration-300
                                                    ${isComplete ? 'bg-primary' : ''}
                                                    ${isActive ? 'bg-primary animate-pulse' : ''}
                                                    ${!isComplete && !isActive ? 'bg-neutral-800' : ''}
                                                `}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI INTERFACE - INTEGRATED BELOW SESSIONS */}
                    <div className="flex flex-col gap-3">
                        {sidebarAIState === 'idle' && (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (taskInput.trim()) onSidebarAISubmit(taskInput);
                                }}
                                className="relative group"
                            >
                                <input
                                    type="text"
                                    value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    placeholder="Enter your task..."
                                    className="w-full bg-neutral-950/40 border border-neutral-800 rounded-full pl-4 pr-10 py-2.5 text-[11px] text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-primary/50 focus:bg-neutral-900/40 transition-all font-sans"
                                />
                                {taskInput.trim() && (
                                    <button
                                        type="submit"
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-all"
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </form>
                        )}

                        {sidebarAIState === 'analyzing' && (
                            <div className="bg-neutral-950/60 border border-neutral-800 rounded-lg p-3 flex flex-col gap-2.5 animate-pulse">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Analyzing Load...</span>
                                </div>
                                <div className="h-2 bg-neutral-800 rounded-full w-4/5" />
                            </div>
                        )}

                        {sidebarAIState === 'confirming' && sidebarAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-neutral-900/80 border border-primary/20 rounded-lg p-3.5 flex flex-col gap-4 shadow-xl shadow-primary/5"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] text-primary/60 uppercase tracking-[0.2em] font-bold">Recommendation</span>
                                    <span className="text-[11px] text-neutral-200 font-medium leading-relaxed">{sidebarAnalysis.focusMode} optimized.</span>
                                </div>

                                <div className="flex flex-col gap-2 pt-1">
                                    <span className="text-[10px] text-neutral-400 font-medium leading-relaxed">
                                        {sessionStatus === 'RUNNING' || sessionStatus === 'PAUSED'
                                            ? "Complete old session and start new?"
                                            : "Initialize focus environment?"}
                                    </span>
                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => {
                                                onConfirmSession('start_new');
                                                setTaskInput('');
                                            }}
                                            className="flex-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-md py-1.5 text-[10px] text-primary font-bold transition-all uppercase tracking-wider"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={onCancelAI}
                                            className="px-3 bg-neutral-800 hover:bg-neutral-700 rounded-md py-1.5 text-[10px] text-neutral-400 font-bold transition-all uppercase tracking-wider"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
};
