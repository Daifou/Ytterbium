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
        <motion.div
            className="h-[45rem] overflow-y-auto bg-[#09090b] relative"
            ref={ref}
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <style>
                {`div::-webkit-scrollbar { display: none; }`}
            </style>

            {/* The "Locked" Viewport - Centered perfectly */}
            <div className="sticky top-0 h-full w-full flex items-center justify-center py-10">
                <div className="max-w-6xl w-full mx-auto px-4">

                    {/* Unified Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border border-white/10 bg-[#09090b] rounded-sm shadow-2xl overflow-hidden">

                        {/* LEFT COLUMN: Visual (Sticky Context) */}
                        <div className="hidden md:flex flex-col items-center justify-center border-r border-white/10 p-12 bg-[#0d0d0e] relative min-h-[400px]">
                            {/* Technical Header inside Grid */}
                            <div className="absolute top-6 left-6 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">System Calibration</span>
                            </div>

                            <StickyVisual activeIndex={activeCard} />
                        </div>

                        {/* RIGHT COLUMN: Steps "Table" */}
                        <div className="flex flex-col divide-y divide-white/10 bg-[#09090b]">
                            {/* Header Row (Optional "ProSE" style header) */}
                            <div className="p-6 flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-widest font-medium border-b border-white/10 bg-zinc-900/20">
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
                                        className="relative p-8 flex flex-col justify-center transition-all duration-500"
                                    >
                                        <div className="flex items-start gap-6">
                                            {/* Step Number Box */}
                                            <div className={cn(
                                                "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded border text-sm font-semibold transition-all duration-500",
                                                isActive
                                                    ? "bg-white text-black border-white"
                                                    : "bg-transparent text-zinc-600 border-zinc-800"
                                            )}>
                                                {item.number}
                                            </div>

                                            <div className="flex-1 pt-1">
                                                {/* Title */}
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
                                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                                                        {item.description}
                                                    </p>
                                                </motion.div>
                                            </div>

                                            {/* Active Indicator Dot */}
                                            <div className={cn(
                                                "w-2 h-2 rounded-full mt-2 transition-all duration-300",
                                                isActive ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-zinc-800"
                                            )} />
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Filler row to maintain grid balance if needed */}
                            <div className="flex-grow bg-[#09090b]" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Adapted StickyVisual that accepts an integer index and uses layout animations/springs
const StickyVisual = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#09090b]">
            <div className="relative w-full max-w-[20rem] aspect-square flex items-center justify-center">

                {/* Background Glow */}
                <motion.div
                    animate={{
                        scale: activeIndex % 2 === 0 ? 1 : 1.1,
                        opacity: 0.5
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent blur-3xl"
                />

                {/* 3D Ring Structure */}
                <motion.svg
                    viewBox="0 0 400 400"
                    className="w-full h-full"
                    animate={{ rotate: activeIndex * 90 }} // Rotate 90deg per step
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    {/* Outer Ring */}
                    <ellipse
                        cx="200"
                        cy="200"
                        rx="150"
                        ry="60"
                        fill="none"
                        stroke="url(#gradient1)"
                        strokeWidth="1"
                        opacity="0.5"
                    />

                    {/* Inner Rotating Spheres Group */}
                    <motion.g
                        animate={{ rotate: -(activeIndex * 90) * 2 }} // Counter-rotate
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        style={{ originX: "200px", originY: "200px" }}
                    >
                        <circle cx="200" cy="140" r="12" fill="url(#sphereGradient1)" />
                        <circle cx="260" cy="200" r="16" fill="url(#sphereGradient2)" />
                        <circle cx="200" cy="260" r="14" fill="url(#sphereGradient3)" />
                        <circle cx="140" cy="200" r="12" fill="url(#sphereGradient4)" />
                    </motion.g>

                    {/* Center Core */}
                    <motion.circle
                        cx="200"
                        cy="200"
                        r="20"
                        fill="url(#coreGradient)"
                        animate={{ scale: activeIndex % 2 === 0 ? 1 : 1.2 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        </linearGradient>
                        <radialGradient id="sphereGradient1">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </radialGradient>
                        <radialGradient id="sphereGradient2">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </radialGradient>
                        <radialGradient id="sphereGradient3">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </radialGradient>
                        <radialGradient id="sphereGradient4">
                            <stop offset="0%" stopColor="#c4b5fd" />
                            <stop offset="100%" stopColor="#a78bfa" />
                        </radialGradient>
                        <radialGradient id="coreGradient">
                            <stop offset="0%" stopColor="#e0e7ff" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </radialGradient>
                    </defs>
                </motion.svg>
            </div>
        </div>
    );
};
