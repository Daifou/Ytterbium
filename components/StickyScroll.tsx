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
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end end"],
    });

    const cardLength = content.length;

    // This handles the sticky scroll indicator on the vertical border
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
        <div className="w-full bg-[#09090b] py-24">
            <motion.div
                className="h-[40rem] overflow-y-auto border-t border-b border-white/10 bg-[#09090b] relative grid grid-cols-1 md:grid-cols-2"
                ref={ref}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                {/* LEFT COLUMN: Sticky Visual */}
                <div className="hidden md:flex flex-col sticky top-0 h-full border-r border-white/10 overflow-hidden">
                    <motion.div
                        className="absolute right-[-1px] top-0 w-[1px] h-32 bg-gradient-to-b from-transparent via-orange-500 to-transparent z-50 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                        style={{ y: borderY }}
                    />

                    <div className="relative h-full flex flex-col p-12 min-h-[40rem]">
                        <div className="absolute top-8 left-8 text-[11px] font-medium text-zinc-500">1</div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Technology</span>
                        </div>

                        {/* CLONE FIX: This Y translation ensures the visual stays level with the right-side active step */}
                        <motion.div
                            className="flex-1 flex items-center justify-center"
                            animate={{
                                y: activeCard === 0 ? -110 : activeCard === 1 ? -40 : activeCard === 2 ? 40 : 110
                            }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
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

                {/* RIGHT COLUMN: Scrolling Content */}
                <div className="flex flex-col divide-y divide-white/10">
                    <div className="p-8 pb-12 grid grid-cols-12 gap-4">
                        <div className="col-span-10">
                            <p className="text-[13px] text-zinc-400 leading-relaxed max-w-sm">
                                Ytterbium™ will revolutionize focus by delivering unprecedented precision, scalability, and accessibility.
                            </p>
                        </div>
                        <div className="col-span-2 text-right text-[11px] font-medium text-zinc-600">2026</div>
                    </div>

                    {content.map((item, index) => {
                        const isActive = activeCard === index;
                        return (
                            <motion.div
                                key={item.number}
                                className="relative p-10 flex flex-col justify-center min-h-[12rem] group"
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
                                                marginTop: isActive ? "0.5rem" : "0rem"
                                            }}
                                            transition={{ duration: 0.4, ease: "circOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[15px] text-zinc-500 leading-relaxed max-w-lg">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </div>

                                    <div className={cn(
                                        "w-2.5 h-2.5 rounded-full mt-4 transition-all duration-500",
                                        isActive ? "bg-white shadow-[0_0_10px_white]" : "bg-zinc-800 opacity-20"
                                    )} />
                                </div>
                            </motion.div>
                        );
                    })}
                    <div className="h-[10rem]" /> {/* Spacer for clean scroll exit */}
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
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-[20rem] aspect-square flex items-center justify-center"
                >
                    {activeIndex === 0 && <BeadSpiral />}
                    {activeIndex === 1 && <DoubleHelix />}
                    {activeIndex === 2 && <PerforatedPlate />}
                    {activeIndex === 3 && <ClusterVisual />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

/* --- UNIQUE ORANGE GRADIENT SHAPES (CLONED FROM VIDEO) --- */

const OrangeGradient = ({ id }: { id: string }) => (
    <defs>
        <radialGradient id={id} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#7c2d12" />
        </radialGradient>
    </defs>
);

const BeadSpiral = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <OrangeGradient id="grad1" />
        {[...Array(14)].map((_, i) => {
            const angle = (i / 13) * Math.PI * 1.5;
            const r = 120;
            return (
                <motion.circle
                    key={i}
                    cx={200 + Math.cos(angle) * r}
                    cy={200 + Math.sin(angle) * r}
                    r={i % 4 === 0 ? 20 : 12}
                    fill="url(#grad1)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                />
            );
        })}
    </svg>
);

const DoubleHelix = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <OrangeGradient id="grad2" />
        {[...Array(18)].map((_, i) => {
            const angle = (i / 17) * Math.PI * 4;
            const r = 40 + i * 8;
            return (
                <motion.circle
                    key={i}
                    cx={200 + Math.cos(angle) * r}
                    cy={200 + Math.sin(angle) * r}
                    r={10}
                    fill="url(#grad2)"
                />
            );
        })}
    </svg>
);

const PerforatedPlate = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <OrangeGradient id="grad3" />
        <rect x="100" y="150" width="200" height="100" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
        {[...Array(6)].map((_, i) => (
            <motion.circle
                key={i}
                cx={130 + i * 30}
                cy={200 + Math.sin(i) * 20}
                r={15}
                fill="url(#grad3)"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            />
        ))}
    </svg>
);

const ClusterVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <OrangeGradient id="grad4" />
        {[...Array(12)].map((_, i) => (
            <motion.circle
                key={i}
                cx={200 + (Math.random() - 0.5) * 150}
                cy={200 + (Math.random() - 0.5) * 150}
                r={14}
                fill="url(#grad4)"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
        ))}
    </svg>
);