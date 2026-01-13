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
            className="relative h-[350vh] bg-[#09090b] z-10 font-sans"
        >
            {/* STICKY WRAPPER: Instrument Panel Frame */}
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden z-20">
                <div className="max-w-[1400px] mx-auto w-full h-[85vh] border border-white/10 bg-[#09090b] flex flex-col shadow-2xl relative">

                    {/* INSTRUMENT HEADER ROW */}
                    <div className="h-16 border-b border-white/10 flex divide-x divide-white/10 text-[11px] font-medium tracking-tighter uppercase text-white/50">
                        <div className="w-16 flex items-center justify-center text-white">1</div>
                        <div className="flex-1 flex items-center justify-center gap-2">
                            <span className="text-white">●</span> Technology
                        </div>
                        <div className="flex-[2] flex items-center px-8 normal-case tracking-normal text-white/40">
                            ProSE™ will revolutionize proteomics by delivering unprecedented precision, scalability, and accessibility.
                        </div>
                        <div className="w-24 flex items-center justify-center">2026</div>
                    </div>

                    {/* MAIN CONTENT GRID */}
                    <div className="flex-1 flex divide-x divide-white/10 overflow-hidden">

                        {/* LEFT COLUMN: Visuals (Locked) */}
                        <div className="flex-1 relative flex items-center justify-center bg-[#09090b] p-12">
                            {/* Decorative Dots */}
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "absolute w-2 h-2 rounded-full border border-white/20",
                                        i === 0 && "top-10 left-10",
                                        i === 1 && "top-10 right-10",
                                        i === 2 && "bottom-10 left-10",
                                        i === 3 && "bottom-10 right-10"
                                    )}
                                />
                            ))}

                            <div className="relative w-full aspect-square max-w-[500px] flex items-center justify-center">
                                {/* Technical Badge Indicator */}
                                <div className="absolute top-10 right-10 w-9 h-9 rounded-lg bg-zinc-800/80 border border-white/10 flex items-center justify-center z-30">
                                    <span className="text-[14px] font-bold text-white">{activeCard + 1}</span>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCard}
                                        initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full h-full"
                                    >
                                        <BeadVisual step={activeCard} />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Steps (List Expansion) */}
                        <div className="flex-1 flex flex-col items-start bg-[#09090b] overflow-hidden">
                            {content.map((item, index) => {
                                const isActive = activeCard === index;
                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            "w-full border-b border-white/10 transition-all duration-700 ease-in-out p-8 lg:p-12",
                                            isActive ? "bg-white/[0.02]" : "opacity-30 grayscale hover:opacity-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg text-[14px] font-bold transition-colors duration-500",
                                                isActive ? "bg-white text-black" : "border border-white/20 text-white"
                                            )}>
                                                {item.number}
                                            </div>
                                            <h2 className="text-3xl lg:text-4xl font-medium tracking-tighter text-white">
                                                {item.title}
                                            </h2>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-2 h-2 rounded-full bg-white ml-auto"
                                                />
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.5, ease: "circOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="text-lg text-white/50 leading-relaxed font-light max-w-xl tracking-tight">
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

                    {/* Footer Info Row */}
                    <div className="h-4 border-t border-white/5 bg-white/[0.01]" />
                </div>
            </div>
        </div>
    );
};

/* --- UNIFIED MOLECULAR BEAD VISUALS (Orange Branded) --- */

const BeadVisual = ({ step }: { step: number }) => {
    return (
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_50px_rgba(255,77,0,0.15)]">
            <defs>
                {/* 3D Orange style for the brand alignment */}
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

// Step 1: C-Curve Cluster (Orange)
const Step1Beads = () => {
    const beads = [...Array(14)];
    return (
        <g>
            {/* Cubelet Tail (Warm Contrast) */}
            {[...Array(8)].map((_, i) => (
                <motion.rect
                    key={`cube-${i}`}
                    x={200 + i * 20}
                    y={120 - i * 5}
                    width={18} height={18} rx={4}
                    fill="#FF4D00" fillOpacity={0.2}
                    initial={{ opacity: 0, x: 250 }}
                    animate={{ opacity: 1, x: 180 + i * 20 }}
                    transition={{ delay: i * 0.05 }}
                    style={{ rotate: "-15deg" }}
                />
            ))}
            {/* Main C-Curve */}
            {beads.map((_, i) => {
                const angle = (i / beads.length) * Math.PI * 1.5 + 0.5;
                const r = 130;
                const colors = ["url(#pearl)", "url(#pearlLight)", "url(#pearlDeep)"];
                return (
                    <motion.circle
                        key={i}
                        cx={200 + Math.cos(angle) * r}
                        cy={200 + Math.sin(angle) * r}
                        r={28 - i * 0.5}
                        fill={colors[i % 3]}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.03, type: "spring" }}
                    />
                );
            })}
        </g>
    );
};

// Step 2: Linear Cluster (Orange)
const Step2Beads = () => {
    return (
        <g>
            {[...Array(12)].map((_, i) => (
                <motion.circle
                    key={i}
                    cx={100 + i * 25}
                    cy={200 + Math.sin(i * 0.5) * 30}
                    r={24}
                    fill={i % 2 === 0 ? "url(#pearlLight)" : "url(#pearl)"}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                />
            ))}
            {[...Array(6)].map((_, i) => (
                <motion.rect
                    key={`c-${i}`}
                    x={120 + i * 40} y={150} width={14} height={14} rx={3}
                    fill="#FF4D00" fillOpacity={0.4}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                />
            ))}
        </g>
    );
};

// Step 3: Transport Cluster (Orange)
const Step3Beads = () => {
    return (
        <g>
            {/* The "Gate" */}
            <motion.rect
                x="195" y="100" width="10" height="200" rx="5"
                fill="#FF4D00" fillOpacity="0.1"
            />
            {[...Array(16)].map((_, i) => {
                const angle = (i / 15) * Math.PI * 2;
                const x = 200 + Math.sin(angle) * 120;
                const y = 80 + i * 18;
                return (
                    <motion.circle
                        key={i}
                        cx={x} cy={y}
                        r={22}
                        fill={i > 8 ? "url(#pearlLight)" : "url(#pearlDeep)"}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                    />
                );
            })}
        </g>
    );
};