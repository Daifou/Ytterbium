"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const content = [
    {
        number: "1",
        title: "Input Phase",
        description: "Describe your cognitive task. Ytterbium's neural engine immediately begins calibrating the optimal resonance for your specific project requirements.",
    },
    {
        number: "2",
        title: "Cognitive Analysis",
        description: "AI classifies complexity and load. By mapping your current state against historical peak states, we recommend a precision-matched intensity level.",
    },
    {
        number: "3",
        title: "Deep Focus State",
        description: "Initiate the environment. Adaptive timers and biometric rest intervals ensure you stay in the flow state without the risk of biological burnout.",
    },
    {
        number: "4",
        title: "Sequence Completion",
        description: "Review metadata and performance logs. Each completed cycle strengthens your focus architecture, unlocking deeper states for future sessions.",
    },
];

export const StickyScroll = () => {
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef<any>(null);

    // Using the exact container-based scroll logic from the library
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end start"],
    });

    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0
        );
        setActiveCard(closestBreakpointIndex);
    });

    return (
        <div className="w-full bg-[#09090b] font-['SF_Pro_Display','-apple-system',sans-serif] tracking-tight py-20">
            {/* SCROLL CONTAINER */}
            <motion.div
                ref={ref}
                className="relative flex h-[45rem] overflow-y-auto border-t border-b border-white/10 bg-[#09090b]"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                {/* LEFT SIDE: Sticky Visual */}
                <div className="sticky top-0 hidden h-full w-1/2 items-center justify-center border-r border-white/5 lg:flex">
                    {/* Top Decorative Labels */}
                    <div className="absolute top-8 left-12 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-zinc-500">01</span>
                        <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Biological Engine</span>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCard}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="relative w-full max-w-[24rem] aspect-square flex items-center justify-center"
                            >
                                {activeCard === 0 && <InputVisual />}
                                {activeCard === 1 && <AnalyzeVisual />}
                                {activeCard === 2 && <FocusVisual />}
                                {activeCard === 3 && <CompleteVisual />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Corner Decor */}
                    <div className="absolute bottom-12 left-12 flex items-center gap-3">
                        <div className="p-1 px-2 border border-white/10 rounded-sm bg-zinc-900/50">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Calibration: Active</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: Expanding Steps */}
                <div className="relative flex flex-1 flex-col px-12 py-20 divide-y divide-white/5">
                    {/* Top Metadata */}
                    <div className="pb-12 grid grid-cols-12 gap-4">
                        <div className="col-span-12">
                            <p className="text-[13px] text-zinc-400 leading-relaxed max-w-sm font-light">
                                <span className="text-white font-medium">Ytterbium™</span> optimized environment protocol. Synchronizing neural architecture for sustained cognitive peak.
                            </p>
                        </div>
                    </div>

                    {content.map((item, index) => {
                        const isActive = activeCard === index;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "flex flex-col py-12 transition-all duration-700 ease-in-out",
                                    isActive ? "bg-white/[0.01]" : "bg-transparent opacity-30"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-8">
                                        {/* Number Icon Box */}
                                        <div className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-[3px] border text-[12px] font-bold transition-all duration-500",
                                            isActive
                                                ? "bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                : "bg-transparent border-zinc-800 text-zinc-600"
                                        )}>
                                            {item.number}
                                        </div>
                                        {/* Title */}
                                        <h2 className={cn(
                                            "text-3xl md:text-[42px] font-medium tracking-tight transition-all duration-500",
                                            isActive ? "text-white" : "text-zinc-800"
                                        )}>
                                            {item.title}
                                        </h2>
                                    </div>
                                    {/* Status Indicator Dot */}
                                    <div className={cn(
                                        "h-2 w-2 rounded-full transition-all duration-500",
                                        isActive ? "bg-indigo-500 scale-125 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-zinc-800"
                                    )} />
                                </div>

                                {/* Expandable Description */}
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: isActive ? "auto" : 0,
                                        opacity: isActive ? 1 : 0,
                                        marginTop: isActive ? "1.5rem" : "0rem"
                                    }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <p className="ml-16 max-w-lg text-[15px] leading-relaxed text-zinc-500 font-light">
                                        {item.description}
                                    </p>
                                </motion.div>
                            </div>
                        );
                    })}

                    {/* Spacer to allow the final item to trigger scroll expansion */}
                    <div className="h-[30rem]" />
                </div>
            </motion.div>
        </div>
    );
};

/* --- YTTERBIUM VISUALS --- */

const InputVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <linearGradient id="inputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            {[...Array(5)].map((_, i) => (
                <motion.circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={20 + i * 35}
                    fill="none"
                    stroke="url(#inputGrad)"
                    strokeWidth="0.5"
                    animate={{
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}
                />
            ))}
            <motion.circle
                cx="200"
                cy="200"
                r="40"
                fill="url(#inputGrad)"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </svg>
    </div>
);

const AnalyzeVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[120px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <linearGradient id="analyzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
            </defs>
            <g opacity="0.4">
                {[...Array(12)].map((_, i) => (
                    <motion.rect
                        key={i}
                        x={100 + i * 18}
                        y="100"
                        width="8"
                        height="200"
                        fill="white"
                        rx="1"
                        animate={{ height: [40, 200, 40] }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                    />
                ))}
            </g>
            <motion.line
                x1="80" y1="100" x2="320" y2="100"
                stroke="white"
                strokeWidth="1"
                animate={{ y: [0, 200, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
        </svg>
    </div>
);

const FocusVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <motion.circle
                cx="200"
                cy="200"
                r="80"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                strokeDasharray="4 8"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
                cx="200"
                cy="200"
                r="40"
                fill="white"
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
        </svg>
    </div>
);

const CompleteVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <motion.path
                d="M100 200 L180 280 L300 120"
                fill="none"
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
            />
            {[...Array(3)].map((_, i) => (
                <motion.circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={100 + i * 40}
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="0.2"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0, 0.2, 0] }}
                    transition={{ duration: 3, delay: i * 1, repeat: Infinity }}
                />
            ))}
        </svg>
    </div>
);