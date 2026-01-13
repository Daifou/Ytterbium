"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence, useTransform } from "framer-motion";
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

    const borderY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // SENIOR MATH FIX: Added a small offset to ensure the 'active' zone is centered
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
                <div className="hidden md:flex flex-col sticky top-0 h-full border-r border-white/10 overflow-hidden">
                    <motion.div
                        className="absolute right-[-1px] top-0 w-[1px] h-32 bg-gradient-to-b from-transparent via-orange-500 to-transparent z-50 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                        style={{ y: borderY }}
                    />

                    <div className="relative h-full flex flex-col p-12 min-h-[45rem]">
                        <div className="absolute top-8 left-8 text-[11px] font-medium text-zinc-500">1</div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Technology</span>
                        </div>

                        <motion.div
                            className="flex-1 flex items-center justify-center"
                            animate={{
                                // Precise vertical level tracking
                                y: activeCard === 0 ? -100 : activeCard === 1 ? -40 : activeCard === 2 ? 40 : 100
                            }}
                            transition={{ type: "spring", stiffness: 80, damping: 25 }}
                        >
                            <StickyVisual activeIndex={activeCard} />
                        </motion.div>

                        <div className="absolute bottom-12 left-12 p-1.5 bg-zinc-900 border border-white/5 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        </div>
                        <div className="absolute bottom-12 right-12 p-1.5 bg-zinc-900 border border-white/5 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col divide-y divide-white/10">
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
                                // SENIOR FIX: Increased min-h to 24rem to slow down scroll sensitivity
                                className="relative p-10 flex flex-col justify-center min-h-[24rem] group"
                                animate={{
                                    backgroundColor: isActive ? 'rgba(255,255,255,0.01)' : 'transparent'
                                }}
                            >
                                <div className="flex items-start gap-8">
                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-[3px] text-[12px] font-bold transition-all duration-500",
                                        isActive ? "bg-white text-black" : "border border-zinc-800 text-zinc-700"
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
                                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[15px] text-zinc-500 leading-relaxed max-w-lg">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </div>

                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full mt-4 transition-all duration-500",
                                        isActive ? "bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" : "bg-zinc-800 opacity-20"
                                    )} />
                                </div>
                            </motion.div>
                        );
                    })}

                    <div className="h-[2rem]" />
                </div>
            </motion.div>
        </div>
    );
};

const StickyVisual = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence>
                <motion.div
                    key={`marker-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-20 w-8 h-8 bg-zinc-800 border border-orange-500/30 rounded-md flex items-center justify-center text-orange-500 text-[12px] font-bold shadow-lg"
                    style={{
                        top: activeIndex === 0 ? "10%" : activeIndex === 1 ? "30%" : "60%",
                        right: activeIndex === 0 ? "10%" : activeIndex === 1 ? "70%" : "20%"
                    }}
                >
                    {activeIndex + 1}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.7, ease: "circOut" }}
                    className="relative w-full h-full flex items-center justify-center"
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

/* --- HIGH-END UNIQUE ORANGE VISUALS --- */

const InputVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-[80%] h-[80%]">
            <defs>
                <radialGradient id="orangeBall" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="100%" stopColor="#f97316" />
                </radialGradient>
            </defs>
            {/* Grid of entering spheres */}
            {[...Array(9)].map((_, i) => (
                <motion.circle
                    key={i}
                    cx={120 + (i % 3) * 80}
                    cy={120 + Math.floor(i / 3) * 80}
                    r="12"
                    fill="url(#orangeBall)"
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                        y: [0, -10, 0]
                    }}
                    transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
                />
            ))}
        </svg>
    </div>
);

const AnalyzeVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-[80%] h-[80%]">
            {/* Vertical DNA-style columns */}
            {[...Array(15)].map((_, i) => (
                <motion.rect
                    key={i}
                    x={80 + i * 18}
                    y="100"
                    width="6"
                    height="200"
                    rx="3"
                    fill="#f97316"
                    opacity="0.2"
                />
            ))}
            {[...Array(15)].map((_, i) => (
                <motion.circle
                    key={`c-${i}`}
                    cx={83 + i * 18}
                    cy="200"
                    r="6"
                    fill="#fbbf24"
                    animate={{
                        y: [80, -80, 80],
                        opacity: [0.2, 1, 0.2]
                    }}
                    transition={{ duration: 2.5, delay: i * 0.1, repeat: Infinity }}
                />
            ))}
        </svg>
    </div>
);

const FocusVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        {/* The Core Spiral */}
        <SpiralChain activeIndex={2} />
    </div>
);

const CompleteVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-[90%] h-[90%]">
            {/* Expanding outward network */}
            {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                return (
                    <motion.line
                        key={i}
                        x1="200" y1="200"
                        x2={200 + Math.cos(angle) * 140}
                        y2={200 + Math.sin(angle) * 140}
                        stroke="#f97316"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    />
                );
            })}
            <motion.circle
                cx="200" cy="200" r="40"
                fill="#f97316"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
        </svg>
    </div>
);

const SpiralChain = ({ activeIndex }: { activeIndex: number }) => {
    const points = Array.from({ length: 24 });
    return (
        <svg viewBox="0 0 400 400" className="w-[110%] h-[110%] drop-shadow-[0_20px_50px_rgba(249,115,22,0.15)]">
            <defs>
                <radialGradient id="sphereGradOrange" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#ffedd5" />
                    <stop offset="40%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#9a3412" />
                </radialGradient>
            </defs>
            {points.map((_, i) => {
                const angle = (i / points.length) * Math.PI * 2.5;
                const radius = 60 + i * 4.5;
                const x = 200 + Math.cos(angle) * radius;
                const y = 200 + Math.sin(angle) * radius;
                return (
                    <motion.circle
                        key={i}
                        cx={x} cy={y} r={i % 3 === 0 ? 14 : 10}
                        fill="url(#sphereGradOrange)"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ delay: i * 0.015, duration: 2, repeat: Infinity }}
                    />
                );
            })}
        </svg>
    );
};