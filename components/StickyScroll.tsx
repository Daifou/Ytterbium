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

    // BRANDED ORANGE BORDER LIGHT (Logic updated, structure preserved)
    const borderY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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
                <div className="hidden md:flex flex-col sticky top-0 h-full border-r border-white/10 overflow-hidden">
                    {/* ANIMATED ORANGE BORDER LIGHT (Senior Update) */}
                    <motion.div
                        className="absolute right-[-1px] top-0 w-[1px] h-32 bg-gradient-to-b from-transparent via-orange-500 to-transparent z-50 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                        style={{ y: borderY }}
                    />

                    <div className="relative h-full flex flex-col p-12 min-h-[45rem]">
                        {/* Technical Meta Headers */}
                        <div className="absolute top-8 left-8 text-[11px] font-medium text-zinc-500">1</div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Technology</span>
                        </div>

                        {/* Centered Visual Container tracking vertical level of the steps */}
                        <motion.div
                            className="flex-1 flex items-center justify-center"
                            animate={{
                                y: activeCard === 0 ? -80 : activeCard === 1 ? -30 : activeCard === 2 ? 30 : 80
                            }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                            <StickyVisual activeIndex={activeCard} />
                        </motion.div>

                        {/* Corner Accents */}
                        <div className="absolute bottom-12 left-12 p-1.5 bg-zinc-900 border border-white/5 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        </div>
                        <div className="absolute bottom-12 right-12 p-1.5 bg-zinc-900 border border-white/5 rounded-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Reverted to Original Design */}
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
                                className="relative p-10 flex flex-col justify-center min-h-[10rem] group"
                                animate={{
                                    backgroundColor: isActive ? 'rgba(255,255,255,0.01)' : 'transparent'
                                }}
                            >
                                <div className="flex items-start gap-8">
                                    {/* REVERTED: Original Number Box Styling */}
                                    <div className={cn(
                                        "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-[3px] text-[12px] font-bold transition-all duration-500",
                                        isActive
                                            ? "bg-white text-black"
                                            : "border border-zinc-800 text-zinc-700"
                                    )}>
                                        {item.number}
                                    </div>

                                    <div className="flex-1">
                                        {/* REVERTED: Original Typography */}
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

                                    {/* REVERTED: Original White Dot Indicator */}
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

                    {/* REDUCED: Minimal Spacer for Step 4 focus */}
                    <div className="h-[5rem]" />
                </div>
            </motion.div>
        </div>
    );
};

const StickyVisual = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* ORANGE BRANDED MARKER BADGE (Updated Colors) */}
            <AnimatePresence>
                <motion.div
                    key={`marker-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute z-20 w-8 h-8 bg-zinc-800 border border-orange-500/30 rounded-md flex items-center justify-center text-orange-500 text-[12px] font-bold shadow-lg"
                    style={{
                        top: activeIndex === 0 ? "15%" : activeIndex === 1 ? "35%" : "65%",
                        right: activeIndex === 0 ? "15%" : activeIndex === 1 ? "75%" : "25%"
                    }}
                >
                    {activeIndex + 1}
                </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    <SpiralChain activeIndex={activeIndex} />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

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
                <radialGradient id="sphereGradHighlight" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fff7ed" />
                    <stop offset="40%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#b45309" />
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
                        cx={x}
                        cy={y}
                        r={i % 3 === 0 ? 14 : 10}
                        fill={i % 5 === 0 ? "url(#sphereGradHighlight)" : "url(#sphereGradOrange)"}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            x: activeIndex === 1 ? Math.sin(i) * 15 : 0,
                            y: activeIndex === 2 ? Math.cos(i) * 20 : 0,
                            scale: activeIndex === i % 4 ? 1.15 : 1
                        }}
                        transition={{ delay: i * 0.015, duration: 0.8 }}
                    />
                );
            })}

            {points.map((_, i) => {
                if (i % 2 !== 0) return null;
                const angle = (i / points.length) * Math.PI * 2.5 + 0.1;
                const radius = 75 + i * 4.5;
                const x = 200 + Math.cos(angle) * radius;
                const y = 200 + Math.sin(angle) * radius;

                return (
                    <motion.rect
                        key={`sq-${i}`}
                        x={x}
                        y={y}
                        width="6"
                        height="6"
                        rx="1"
                        fill="#ea580c"
                        opacity="0.6"
                        animate={{ rotate: 45 + (activeIndex * 90) }}
                    />
                );
            })}
        </svg>
    );
};

// PRESERVED PLACEHOLDERS
const InputVisual = () => <div />;
const AnalyzeVisual = () => <div />;
const FocusVisual = () => <div />;
const CompleteVisual = () => <div />;