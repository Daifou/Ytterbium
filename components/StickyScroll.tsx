"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const content = [
    {
        number: "1",
        title: "Sample Preparation",
        description: "To prepare samples for ProSE, proteins and peptides are first functionalized by attaching an initiating linker to one terminus of each peptide chain.",
    },
    {
        number: "2",
        title: "Molecular Expansion",
        description: "Each amino acid is then sequentially added and uniformly spaced along the linker in its original order, constructing a stable molecular sequence.",
    },
    {
        number: "3",
        title: "Amino Acid Sequencing",
        description: "Assembled molecules pass through the neural plate, where distinct electrical signatures from each unit reveal the protein's complete sequence.",
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
            className="relative h-[300vh] lg:h-[350vh] bg-[#09090b] z-10 font-sans"
        >
            {/* STICKY WRAPPER: Instrument Panel Frame */}
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden z-20 px-4 lg:px-6">
                <div className="max-w-[1400px] mx-auto w-full h-[90vh] lg:h-[85vh] border border-white/10 bg-[#09090b] flex flex-col shadow-2xl relative">

                    {/* INSTRUMENT HEADER ROW - Adaptive Visibility */}
                    <div className="h-12 lg:h-16 border-b border-white/10 flex divide-x divide-white/10 text-[10px] lg:text-[11px] font-medium tracking-tighter uppercase text-white/50">
                        <div className="w-10 lg:w-16 flex items-center justify-center text-white">1</div>
                        <div className="flex-1 flex items-center justify-center gap-2">
                            <span className="text-white">●</span> Tech<span className="hidden sm:inline">nology</span>
                        </div>
                        <div className="hidden lg:flex lg:flex-[2] items-center px-8 normal-case tracking-normal text-white/40">
                            ProSE™ will revolutionize proteomics by delivering unprecedented precision, scalability, and accessibility.
                        </div>
                        <div className="w-16 lg:w-24 flex items-center justify-center">2026</div>
                    </div>

                    {/* MAIN CONTENT GRID - Stacks on Mobile */}
                    <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/10 overflow-hidden">

                        {/* LEFT COLUMN: Visuals */}
                        <div className="h-[40%] lg:h-full lg:flex-1 relative flex items-center justify-center bg-[#09090b] p-6 lg:p-12 overflow-hidden">
                            {/* Decorative Dots */}
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "absolute w-1.5 h-1.5 rounded-full border border-white/20",
                                        i === 0 && "top-6 left-6 lg:top-10 lg:left-10",
                                        i === 1 && "top-6 right-6 lg:top-10 lg:right-10",
                                        i === 2 && "bottom-6 left-6 lg:bottom-10 lg:left-10",
                                        i === 3 && "bottom-6 right-6 lg:bottom-10 lg:right-10"
                                    )}
                                />
                            ))}

                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Technical Badge Indicator */}
                                <div className="absolute top-0 right-0 lg:top-10 lg:right-10 w-7 h-7 lg:w-9 lg:h-9 rounded-lg bg-zinc-800/80 border border-white/10 flex items-center justify-center z-30">
                                    <span className="text-[12px] lg:text-[14px] font-bold text-white">{activeCard + 1}</span>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCard}
                                        initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full h-full max-w-[320px] lg:max-w-[500px]"
                                    >
                                        <BeadVisual step={activeCard} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Steps (List Expansion) */}
                        <div className="h-[60%] lg:h-full lg:flex-1 flex flex-col items-start bg-[#09090b] overflow-y-auto lg:overflow-hidden scrollbar-hide">
                            {content.map((item, index) => {
                                const isActive = activeCard === index;
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "w-full border-b border-white/10 transition-all duration-700 ease-in-out p-6 lg:p-12",
                                            isActive ? "bg-white/[0.02]" : "opacity-30 grayscale hover:opacity-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 lg:gap-6">
                                            <div className={cn(
                                                "w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-[12px] lg:text-[14px] font-bold transition-colors duration-500",
                                                isActive ? "bg-white text-black" : "border border-white/20 text-white"
                                            )}>
                                                {item.number}
                                            </div>
                                            <h2 className="text-xl sm:text-2xl lg:text-4xl font-medium tracking-tighter text-white">
                                                {item.title}
                                            </h2>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-white ml-auto"
                                                />
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.5, ease: "circOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-sm lg:text-lg text-white/50 leading-relaxed font-light max-w-xl tracking-tight">
                                                        {item.description}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Info Row - Solid border on mobile */}
                    <div className="h-4 border-t border-white/5 bg-white/[0.01]" />
                </div>
            </div>
        </div>
    );
};

/* --- UNIFIED MOLECULAR BEAD VISUALS --- */

const BeadVisual = ({ step }: { step: number }) => {
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_50px_rgba(255,77,0,0.15)]">
            <defs>
                <radialGradient id="pearl" cx="35%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="#FF9966" />
                    <stop offset="100%" stopColor="#FF4D00" />
                </radialGradient>
                <radialGradient id="pearlLight" cx="35%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="#FFB280" />
                    <stop offset="100%" stopColor="#FF6622" />
                </radialGradient>
                <radialGradient id="pearlDeep" cx="35%" cy="35%" r="50%">
                    <stop offset="0%" stopColor="#FF4D00" />
                    <stop offset="100%" stopColor="#B33600" />
                </radialGradient>
            </defs>

            {step === 0 && <Step1Beads />}
            {step === 1 && <Step2Beads />}
            {step === 2 && <Step3Beads />}
        </svg>
    );
};

// Step 1: C-Curve (Mobile Optimized scaling)
const Step1Beads = () => {
    const beads = [...Array(14)];
    return (
        <g>
            {[...Array(8)].map((_, i) => (
                <motion.rect
                    key={`cube-${i}`}
                    x={200 + i * 20}
                    y={120 - i * 5}
                    width={18} height={18} rx={4}
                    fill="#FF4D00" fillOpacity={0.2}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: 180 + i * 20 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ rotate: "-15deg" }}
                />
            ))}
            {beads.map((_, i) => {
                const angle = (i / beads.length) * Math.PI * 1.5 + 0.5;
                const r = 110; // Slightly smaller radius for mobile
                const colors = ["url(#pearl)", "url(#pearlLight)", "url(#pearlDeep)"];
                return (
                    <motion.circle
                        key={i}
                        cx={200 + Math.cos(angle) * r}
                        cy={200 + Math.sin(angle) * r}
                        r={24 - i * 0.4}
                        fill={colors[i % 3]}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                    />
                );
            })}
        </g>
    );
};

// Step 2: Linear String (Mobile Optimized)
const Step2Beads = () => {
    return (
        <g>
            {[...Array(10)].map((_, i) => (
                <motion.circle
                    key={i}
                    cx={75 + i * 28}
                    cy={200 + Math.sin(i * 0.5) * 20}
                    r={20}
                    fill={i % 2 === 0 ? "url(#pearlLight)" : "url(#pearl)"}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                />
            ))}
            {[...Array(4)].map((_, i) => (
                <motion.rect
                    key={`c-${i}`}
                    x={100 + i * 50} y={160} width={12} height={12} rx={3}
                    fill="#FF4D00" fillOpacity={0.4}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                />
            ))}
        </g>
    );
};

// Step 3: Transport Cluster (Mobile Optimized)
const Step3Beads = () => {
    return (
        <g>
            <motion.rect
                x="195" y="120" width="10" height="160" rx="5"
                fill="#FF4D00" fillOpacity="0.1"
            />
            {[...Array(12)].map((_, i) => {
                const angle = (i / 11) * Math.PI * 2;
                const x = 200 + Math.sin(angle) * 90;
                const y = 100 + i * 18;
                return (
                    <motion.circle
                        key={i}
                        cx={x} cy={y}
                        r={18}
                        fill={i > 6 ? "url(#pearlLight)" : "url(#pearlDeep)"}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                    />
                );
            })}
        </g>
    );
};