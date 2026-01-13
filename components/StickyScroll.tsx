"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const content = [
    {
        number: "01",
        title: "Input",
        description: "Describe your task and Ytterbium instantly calibrates the optimal focus environment.",
    },
    {
        number: "02",
        title: "Analyze",
        description: "AI classifies cognitive load and recommends the perfect intensity level for peak performance.",
    },
    {
        number: "03",
        title: "Focus",
        description: "Enter your personalized environment with adaptive timers and biometric rest prompts.",
    },
    {
        number: "04",
        title: "Complete",
        description: "Track progress through sessions and unlock deeper focus states over time.",
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
        <div className="flex justify-center pt-40 pb-10 bg-[#09090b] font-['Helvetica_World','Helvetica_Neue',sans-serif] tracking-tight">
            <div className="max-w-6xl w-full mx-auto px-4">
                {/* 
                  The "Box" Container 
                  This is the scrollable viewport.
                */}
                <motion.div
                    className="h-[40rem] overflow-y-auto border border-white/10 bg-[#09090b] rounded-sm shadow-2xl relative grid grid-cols-1 md:grid-cols-2"
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
                    {/* sticky top-0 keeps it pinned to the top of the SCROLL CONTAINER */}
                    <div className="hidden md:flex flex-col sticky top-0 h-full border-r border-white/10 bg-[#0d0d0e]">
                        <div className="relative h-full flex items-center justify-center p-12 min-h-[40rem]">
                            {/* Technical Header */}
                            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">System Calibration</span>
                            </div>

                            <StickyVisual activeIndex={activeCard} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Steps "Table" (Scrollable Content) */}
                    <div className="flex flex-col divide-y divide-white/10 bg-[#09090b]">
                        {/* Header Row */}
                        <div className="p-6 flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-widest font-medium border-b border-white/10 bg-zinc-900/20 sticky top-0 z-20 backdrop-blur-md">
                            <span>Sequence Protocol</span>
                            <span>Rev 2.0</span>
                        </div>

                        {content.map((item, index) => {
                            const isActive = activeCard === index;
                            return (
                                <motion.div
                                    key={item.title + index}
                                    initial={{ opacity: 0.3 }}
                                    animate={{
                                        opacity: isActive ? 1 : 0.3,
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.02)' : 'transparent'
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="relative p-10 flex flex-col justify-center min-h-[20rem] transition-all duration-500"
                                >
                                    <div className="flex items-start gap-6">
                                        {/* Step Number */}
                                        <div className={cn(
                                            "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded border text-sm font-semibold transition-all duration-500",
                                            isActive
                                                ? "bg-white text-black border-white"
                                                : "bg-transparent text-zinc-600 border-zinc-800"
                                        )}>
                                            {item.number}
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <h2 className={cn(
                                                "text-xl font-medium tracking-tight mb-2 transition-colors duration-300",
                                                isActive ? "text-white" : "text-zinc-500"
                                            )}>
                                                {item.title}
                                            </h2>

                                            {/* Accordion Description */}
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    height: isActive ? "auto" : 0,
                                                    opacity: isActive ? 1 : 0,
                                                    marginTop: isActive ? 8 : 0
                                                }}
                                                transition={{ duration: 0.4 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                                                    {item.description}
                                                </p>
                                            </motion.div>
                                        </div>

                                        {/* Indicator */}
                                        <div className={cn(
                                            "w-2 h-2 rounded-full mt-2 transition-all duration-300",
                                            isActive ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-zinc-800"
                                        )} />
                                    </div>
                                </motion.div>
                            );
                        })}
                        {/* Spacer at the bottom - Reduced to h-24 as requested */}
                        <div className="h-24" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Adapted StickyVisual - Now features 4 distinct visual states
const StickyVisual = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-[20rem] aspect-square flex items-center justify-center"
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
        {/* Background Glow */}
        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <linearGradient id="inputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            {/* Pulsing signal lines */}
            {[0, 1, 2].map((i) => (
                <motion.circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={50 + i * 40}
                    fill="none"
                    stroke="url(#inputGrad)"
                    strokeWidth="1"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0.5, 1.5],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeOut"
                    }}
                />
            ))}
            {/* Core input node */}
            <motion.circle
                cx="200"
                cy="200"
                r="30"
                fill="url(#inputGrad)"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </svg>
    </div>
);

const AnalyzeVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <linearGradient id="analyzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.2" />
                </linearGradient>
            </defs>
            {/* Moving grid/bars representing analysis */}
            <g transform="translate(100, 100)">
                {[...Array(6)].map((_, i) => (
                    <motion.rect
                        key={i}
                        x={i * 35}
                        y="0"
                        width="20"
                        height="200"
                        fill="url(#analyzeGrad)"
                        rx="4"
                        initial={{ opacity: 0.1, height: 20 }}
                        animate={{
                            opacity: [0.1, 0.8, 0.1],
                            height: [40, 180, 60, 200, 40]
                        }}
                        transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </g>
            {/* Scanning line */}
            <motion.line
                x1="80" y1="100" x2="320" y2="100"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="4 4"
                animate={{ y: [0, 200, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
        </svg>
    </div>
);

const FocusVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-purple-500/5 blur-[100px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <radialGradient id="focusGrad">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
                </radialGradient>
            </defs>
            {/* Concentrated core */}
            <motion.circle
                cx="200"
                cy="200"
                r="60"
                fill="url(#focusGrad)"
                animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: "0 0 40px rgba(167, 139, 250, 0.5)"
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            {/* Orbiting particles */}
            {[...Array(8)].map((_, i) => (
                <motion.g
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "200px", originY: "200px" }}
                >
                    <circle
                        cx={200 + Math.cos(i * 45) * 120}
                        cy={200 + Math.sin(i * 45) * 120}
                        r="4"
                        fill="#a78bfa"
                    />
                </motion.g>
            ))}
            {/* Steady ring */}
            <circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="0.5"
                strokeDasharray="10 20"
                opacity="0.3"
            />
        </svg>
    </div>
);

const CompleteVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full" />
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
                <linearGradient id="completeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
            </defs>
            {/* Expanding success star/flower */}
            <g transform="translate(200, 200)">
                {[...Array(6)].map((_, i) => (
                    <motion.rect
                        key={i}
                        x="-10"
                        y="-100"
                        width="20"
                        height="100"
                        fill="url(#completeGrad)"
                        rx="10"
                        initial={{ rotate: i * 60, scaleY: 0 }}
                        animate={{ scaleY: [0, 1.2, 1] }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "backOut" }}
                        style={{ originY: "bottom" }}
                    />
                ))}
            </g>
            {/* Center checkmark */}
            <motion.path
                d="M160 200 L190 230 L240 170"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
            />
        </svg>
    </div>
);
