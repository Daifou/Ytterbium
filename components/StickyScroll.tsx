"use client";
import React, { useRef, useState } from "react";
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
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end end"],
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
            {/* The "Box" Container - Full Width */}
            <motion.div
                className="h-[45rem] overflow-y-auto border-t border-b border-white/10 bg-[#09090b] relative grid grid-cols-1 md:grid-cols-2"
                ref={ref}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <style>
                    {`div::-webkit-scrollbar { display: none; }`}
                </style>

                {/* LEFT COLUMN: Visual (Sticky) */}
                <div className="hidden md:flex flex-col sticky top-0 h-full border-r border-white/10">
                    <div className="relative h-full flex items-center justify-center p-12 min-h-[45rem]">
                        {/* Technical Meta Headers */}
                        <div className="absolute top-8 left-8 text-[11px] font-medium text-zinc-500">1</div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-zinc-400" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Technology</span>
                        </div>

                        <StickyVisual activeIndex={activeCard} />

                        {/* Corner Accents */}
                        <div className="absolute bottom-12 left-12 p-1.5 bg-zinc-900 border border-white/5 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                        <div className="absolute bottom-12 right-12 p-1.5 bg-zinc-900 border border-white/5 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Table Hierarchy */}
                <div className="flex flex-col divide-y divide-white/10">
                    {/* Top Right Metadata Header */}
                    <div className="p-8 pb-12 grid grid-cols-12 gap-4">
                        <div className="col-span-10">
                            <p className="text-[13px] text-zinc-400 leading-relaxed max-w-sm">
                                Ytterbium™ will revolutionize focus by delivering unprecedented precision, scalability, and accessibility.
                            </p>
                        </div>
                        <div className="col-span-2 text-right text-[11px] font-medium text-zinc-600">
                            2026
                        </div>
                    </div>

                    {content.map((item, index) => {
                        const isActive = activeCard === index;
                        return (
                            <motion.div
                                key={item.number}
                                className="relative p-10 flex flex-col justify-center min-h-[10rem] group"
                                animate={{
                                    backgroundColor: isActive ? 'rgba(255,255,255,0.01)' : 'transparent'
                                }}
                            >
                                <div className="flex items-start gap-8">
                                    {/* ProSE Style Number Box */}
                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-[3px] text-[12px] font-bold transition-all duration-500",
                                        isActive
                                            ? "bg-white text-black"
                                            : "border border-zinc-800 text-zinc-700"
                                    )}>
                                        {item.number}
                                    </div>

                                    <div className="flex-1">
                                        <h2 className={cn(
                                            "text-3xl md:text-[42px] font-medium tracking-tight mb-4 transition-all duration-500",
                                            isActive ? "text-white" : "text-zinc-800"
                                        )}>
                                            {item.title}
                                        </h2>

                                        <motion.div
                                            initial={false}
                                            animate={{
                                                height: isActive ? "auto" : 0,
                                                opacity: isActive ? 1 : 0,
                                                marginBottom: isActive ? "1rem" : "0rem"
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                ease: [0.4, 0, 0.2, 1]
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[15px] text-zinc-500 leading-relaxed max-w-lg">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </div>

                                    {/* Right Side Dot Indicator */}
                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full mt-4 transition-all duration-500",
                                        isActive
                                            ? "bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                            : "bg-zinc-800 opacity-20"
                                    )} />
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Bottom Padding Spacer - crucial for scrolling to the last item */}
                    <div className="h-[30rem]" />
                </div>
            </motion.div>
        </div>
    );
};

const StickyVisual = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-[24rem] aspect-square flex items-center justify-center"
                >
                    {activeIndex === 0 && <InputVisual />}
                    {activeIndex === 1 && <AnalyzeVisual />}
                    {activeIndex === 2 && <FocusVisual />}
                    {activeIndex === 3 && <CompleteVisual />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

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