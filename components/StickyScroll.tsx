"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const content = [
    {
        number: "01",
        title: "Input Phase",
        description: "Describe your cognitive task. Ytterbium's neural engine immediately begins calibrating the optimal resonance for your specific project requirements.",
    },
    {
        number: "02",
        title: "Cognitive Analysis",
        description: "AI classifies complexity and load. By mapping your current state against historical peak states, we recommend a precision-matched intensity level.",
    },
    {
        number: "03",
        title: "Deep Focus State",
        description: "Initiate the environment. Adaptive timers and biometric rest intervals ensure you stay in the flow state without the risk of biological burnout.",
    },
    {
        number: "04",
        title: "Sequence Completion",
        description: "Review metadata and performance logs. Each completed cycle strengthens your focus architecture, unlocking deeper states for future sessions.",
    },
];

export const StickyScroll = () => {
    const [activeCard, setActiveCard] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Use window scroll driven by the container's position
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
    });

    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Simple mapping: latest is 0 to 1
        // We divide the 0-1 range into segments for each card
        const index = Math.min(
            Math.floor(latest * cardLength),
            cardLength - 1
        );
        if (index >= 0 && index !== activeCard) {
            setActiveCard(index);
        }
    });

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-[#050505] py-20"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20">

                    {/* LEFT SIDE: Sticky Visual - Now fixed to viewport when scrolling through this section */}
                    <div className="lg:w-1/2 h-fit lg:sticky lg:top-[20vh] flex flex-col items-center justify-center">
                        <div className="w-full mb-8 flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
                                Phase {content[activeCard].number}
                            </span>
                            <div className="h-[1px] flex-1 bg-white/10" />
                        </div>

                        <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center bg-[#09090b] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden group">
                            {/* Technical Grid Background */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeCard}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full h-full p-12"
                                >
                                    {activeCard === 0 && <InputVisual />}
                                    {activeCard === 1 && <AnalyzeVisual />}
                                    {activeCard === 2 && <FocusVisual />}
                                    {activeCard === 3 && <CompleteVisual />}
                                </motion.div>
                            </AnimatePresence>

                            {/* Corner Decor */}
                            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        </div>

                        <div className="mt-8 text-center text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-mono">
                            Neural Calibration Engine v1.2
                        </div>
                    </div>

                    {/* RIGHT SIDE: Content Steps */}
                    <div className="lg:w-1/2 flex flex-col space-y-32 py-[10vh]">
                        {content.map((item, index) => {
                            const isActive = activeCard === index;
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "transition-all duration-700 ease-in-out flex items-start gap-8",
                                        isActive ? "opacity-100 translate-x-2" : "opacity-20 grayscale"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-500",
                                        isActive
                                            ? "bg-white border-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                            : "bg-transparent border-zinc-800 text-zinc-700"
                                    )}>
                                        {item.number}
                                    </div>

                                    <div className="flex-1">
                                        <h2 className={cn(
                                            "text-4xl md:text-5xl font-semibold tracking-tighter mb-6 transition-colors duration-500",
                                            isActive ? "text-white" : "text-zinc-800"
                                        )}>
                                            {item.title}
                                        </h2>

                                        <motion.div
                                            initial={false}
                                            animate={{
                                                height: isActive ? "auto" : "0",
                                                opacity: isActive ? 1 : 0
                                            }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-lg text-zinc-400 leading-relaxed font-light">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- VISUAL COMPONENTS --- */

const InputVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
            <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </radialGradient>
        </defs>
        {[...Array(3)].map((_, i) => (
            <motion.circle
                key={i}
                cx="200" cy="200" r={40 + i * 40}
                fill="none" stroke="#818cf8" strokeWidth="1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 0.8], rotate: 360 }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
            />
        ))}
        <motion.circle
            cx="200" cy="200" r="10"
            fill="#fff"
            animate={{ scale: [1, 1.5, 1], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    </svg>
);

const AnalyzeVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        {[...Array(15)].map((_, i) => (
            <motion.rect
                key={i}
                x={100 + i * 14}
                y={200 - (Math.random() * 60 + 20)}
                width="4"
                height={Math.random() * 120 + 40}
                fill="#818cf8"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0.2, 0.8, 0.2],
                    height: [40, 160, 40],
                    y: [180, 120, 180]
                }}
                transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            />
        ))}
        <motion.line
            x1="80" y1="200" x2="320" y2="200"
            stroke="#fff" strokeWidth="1" strokeDasharray="4 4"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
        />
    </svg>
);

const FocusVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <motion.circle
            cx="200" cy="200" r="80"
            fill="none" stroke="#818cf8" strokeWidth="2"
            strokeDasharray="10 20"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
            cx="200" cy="200" r="60"
            fill="none" stroke="#fff" strokeWidth="0.5"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.path
            d="M200 140 L200 260 M140 200 L260 200"
            stroke="#818cf8" strokeWidth="1"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
    </svg>
);

const CompleteVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <motion.path
            d="M120 200 L180 260 L280 140"
            fill="none" stroke="#fff" strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.circle
            cx="200" cy="200" r="100"
            fill="none" stroke="#818cf8" strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
        />
    </svg>
);