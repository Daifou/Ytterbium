"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const content = [
    {
        number: "01",
        title: "Sample Preparation",
        description: "To prepare samples for Ytterbium™, proteins and peptides are first functionalized by attaching an initiating linker to one terminus of each peptide chain.",
    },
    {
        number: "02",
        title: "Molecular Expansion",
        description: "Each amino acid is then sequentially added and uniformly spaced along the linker in its original order, constructing a stable molecular sequence.",
    },
    {
        number: "03",
        title: "Vertical Transport",
        description: "Assembled molecules pass through the neural plate, where distinct electrical signatures from each unit reveal the protein's complete sequence.",
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

    // Create a large scrollable area to drive the transitions
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Divide the [0, 1] scroll range into 4 chunks
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
            className="relative h-[450vh] bg-[#050505] z-10"
        >
            {/* STICKY WRAPPER: This stays fixed in the viewport while scrolling the 450vh container */}
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center border-t border-b border-white/10 overflow-hidden z-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">

                        {/* LEFT SIDE: Visuals - Perfectly Locked */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center pt-8 lg:pt-0">
                            <div className="w-full mb-6 flex items-center gap-3">
                                <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest">
                                    Biological Sync: Phase {content[activeCard].number}
                                </span>
                                <div className="h-[1px] flex-1 bg-white/10" />
                            </div>

                            <div className="relative w-full aspect-square max-w-[400px] xl:max-w-[480px] flex items-center justify-center bg-[#09090b]/40 rounded-[48px] border border-white/5 shadow-2xl overflow-hidden">
                                {/* Technical Grid Overlay */}
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCard}
                                        initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full h-full p-10"
                                    >
                                        {activeCard === 0 && <Step1Visual />}
                                        {activeCard === 1 && <Step2Visual />}
                                        {activeCard === 2 && <Step3Visual />}
                                        {activeCard === 3 && <Step4Visual />}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Badge from user image */}
                                <div className="absolute top-10 right-10 w-8 h-8 rounded-lg bg-zinc-900/90 border border-white/5 flex items-center justify-center shadow-lg">
                                    <span className="text-[12px] font-bold text-white/40">{activeCard + 1}</span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Text Content - Perfectly Synchronized */}
                        <div className="w-full lg:w-1/2 flex flex-col items-start pb-12 lg:pb-0">
                            <div className="relative w-full h-[320px] lg:h-[400px] flex flex-col justify-center">
                                {content.map((item, index) => {
                                    const isActive = activeCard === index;
                                    return (
                                        <div
                                            key={index}
                                            className={cn(
                                                "absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-in-out",
                                                isActive
                                                    ? "opacity-100 scale-100 translate-y-0"
                                                    : "opacity-0 scale-95 translate-y-10 pointer-events-none"
                                            )}
                                        >
                                            <div className="flex items-center gap-6 mb-8">
                                                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-orange-500 text-white text-[12px] font-bold shadow-[0_0_20px_rgba(255,77,0,0.4)]">
                                                    {item.number}
                                                </div>
                                                <h2 className="text-4xl lg:text-[56px] font-medium tracking-tighter text-white leading-none">
                                                    {item.title}
                                                </h2>
                                            </div>

                                            <p className="text-lg lg:text-xl text-zinc-400 leading-relaxed font-light max-w-lg">
                                                {item.description}
                                            </p>

                                            <div className="mt-8 flex items-center gap-4">
                                                <div className="h-[2px] w-12 bg-orange-500/50" />
                                                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Resonance Locked</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Indicators */}
                            <div className="flex gap-2 mt-8 lg:mt-12">
                                {content.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1 transition-all duration-500 rounded-full",
                                            activeCard === i ? "w-8 bg-orange-500" : "w-4 bg-zinc-800"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- MOLECULAR SVG COMPONENTS (Orange Theme) --- */

const Step1Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_25px_rgba(255,77,0,0.2)]">
        <defs>
            <radialGradient id="beadGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ff9a66" />
                <stop offset="60%" stopColor="#FF4D00" />
                <stop offset="100%" stopColor="#992e00" />
            </radialGradient>
        </defs>
        {/* "C" Shape Molecular String */}
        {[...Array(15)].map((_, i) => {
            const angle = (i / 14) * Math.PI * 1.4 - 0.3;
            const r = 115;
            return (
                <motion.circle
                    key={i}
                    cx={200 + Math.cos(angle) * r}
                    cy={200 + Math.sin(angle) * r}
                    r={20}
                    fill="url(#beadGrad)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                />
            );
        })}
        {/* Floating Components */}
        <motion.circle cx="100" cy="100" r="4" fill="white" fillOpacity="0.2" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        <motion.circle cx="280" cy="320" r="3" fill="white" fillOpacity="0.2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} />
    </svg>
);

const Step2Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_25px_rgba(255,77,0,0.2)]">
        {/* Spiral Expansion */}
        {[...Array(30)].map((_, i) => {
            const angle = (i / 29) * Math.PI * 5;
            const r = 25 + i * 5.5;
            const isBead = i % 4 === 0;
            return (
                <motion.circle
                    key={i}
                    cx={200 + Math.cos(angle) * r}
                    cy={200 + Math.sin(angle) * r}
                    r={isBead ? 14 : 6}
                    fill={isBead ? "url(#beadGrad)" : "rgba(255,255,255,0.08)"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                />
            );
        })}
    </svg>
);

const Step3Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_25px_rgba(255,77,0,0.2)]">
        {/* Neural Plate - High Def */}
        <motion.rect
            x="80" y="140" width="240" height="120"
            rx="32"
            fill="rgba(255,255,255,0.02)"
            stroke="white"
            strokeOpacity="0.1"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
        />
        {/* Transport Strings */}
        {[...Array(4)].map((_, col) => (
            <g key={col}>
                {[...Array(8)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={140 + col * 40}
                        cy={60 + i * 40}
                        r={12}
                        fill={i === 3 ? "url(#beadGrad)" : "rgba(255,255,255,0.04)"}
                        animate={{ y: [0, 40] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: col * 0.3 }}
                    />
                ))}
            </g>
        ))}
    </svg>
);

const Step4Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_25px_rgba(255,77,0,0.2)]">
        {/* Neural Network Completion */}
        <motion.circle
            cx="200" cy="200" r="120"
            fill="none" stroke="white" strokeOpacity="0.05"
            strokeDasharray="4 12"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
            cx="200" cy="200" r="80"
            fill="none" stroke="#FF4D00" strokeOpacity="0.2"
            strokeDasharray="1 10"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            return (
                <motion.g key={i}>
                    <line
                        x1="200" y1="200"
                        x2={200 + Math.cos(angle) * 100}
                        y2={200 + Math.sin(angle) * 100}
                        stroke="white" strokeOpacity="0.1"
                    />
                    <motion.circle
                        cx={200 + Math.cos(angle) * 100}
                        cy={200 + Math.sin(angle) * 100}
                        r="18"
                        fill="url(#beadGrad)"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    />
                </motion.g>
            );
        })}
        <motion.circle
            cx="200" cy="200" r="30"
            fill="white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
        />
    </svg>
);