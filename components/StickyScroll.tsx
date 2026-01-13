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

    // Use window scroll driven by the container's position
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"],
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
            className="relative w-full bg-[#050505] border-t border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20">

                    {/* LEFT SIDE: Sticky Visual */}
                    <div className="lg:w-1/2 h-fit lg:sticky lg:top-[20vh] flex flex-col items-center justify-center py-20 lg:py-0">
                        <div className="w-full mb-8 flex items-center gap-3">
                            <span className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest">
                                Processing Step {content[activeCard].number}
                            </span>
                            <div className="h-[1px] flex-1 bg-white/10" />
                        </div>

                        <div className="relative w-full aspect-square max-w-[450px] flex items-center justify-center bg-[#09090b]/50 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden group">
                            {/* Subtle Grid */}
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeCard}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-full h-full p-8"
                                >
                                    {activeCard === 0 && <Step1Visual />}
                                    {activeCard === 1 && <Step2Visual />}
                                    {activeCard === 2 && <Step3Visual />}
                                    {activeCard === 3 && <Step4Visual />}
                                </motion.div>
                            </AnimatePresence>

                            {/* Corner Badges matching user images style */}
                            <div className="absolute top-8 right-8 w-6 h-6 rounded-md bg-zinc-800/80 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white/50">{activeCard + 1}</span>
                            </div>
                            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 rounded-full bg-zinc-700" />
                        </div>
                    </div>

                    {/* RIGHT SIDE: Content Steps with Expansion Logic */}
                    <div className="lg:w-1/2 flex flex-col py-[15vh]">
                        {content.map((item, index) => {
                            const isActive = activeCard === index;
                            return (
                                <div
                                    key={index}
                                    className={cn(
                                        "transition-all duration-700 ease-in-out border-b border-white/5 py-12 first:border-t",
                                        isActive ? "opacity-100" : "opacity-20 translate-x-0"
                                    )}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className={cn(
                                            "w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border text-[12px] font-bold transition-all duration-500",
                                            isActive
                                                ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]"
                                                : "bg-transparent border-zinc-800 text-zinc-600"
                                        )}>
                                            {item.number}
                                        </div>

                                        <h2 className={cn(
                                            "text-3xl md:text-[42px] font-medium tracking-tighter transition-colors duration-500",
                                            isActive ? "text-white" : "text-zinc-800"
                                        )}>
                                            {item.title}
                                        </h2>
                                    </div>

                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: isActive ? "auto" : "0",
                                            opacity: isActive ? 1 : 0,
                                            marginTop: isActive ? "1.5rem" : "0rem"
                                        }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <p className="ml-14 max-w-lg text-[16px] leading-relaxed text-zinc-400 font-light">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>
                            );
                        })}
                        {/* Final spacer */}
                        <div className="h-[20vh]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- MOLECULAR SVG COMPONENTS (Orange Theme) --- */

const Step1Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,77,0,0.15)]">
        <defs>
            <radialGradient id="beadGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ff9a66" />
                <stop offset="60%" stopColor="#FF4D00" />
                <stop offset="100%" stopColor="#992e00" />
            </radialGradient>
            <linearGradient id="stringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
            </linearGradient>
        </defs>
        {/* "C" Shape Molecular String */}
        {[...Array(14)].map((_, i) => {
            const angle = (i / 13) * Math.PI * 1.3 - 0.2;
            const r = 110;
            return (
                <motion.circle
                    key={i}
                    cx={200 + Math.cos(angle) * r}
                    cy={200 + Math.sin(angle) * r}
                    r={18}
                    fill="url(#beadGrad)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                />
            );
        })}
        {/* Connection Cubelets */}
        {[...Array(8)].map((_, i) => (
            <motion.rect
                key={i}
                x={180 + i * 15}
                y={120 - i * 5}
                width="14"
                height="14"
                rx="3"
                fill="url(#stringGrad)"
                stroke="white"
                strokeOpacity="0.1"
                animate={{ y: [120 - i * 5, 115 - i * 5, 120 - i * 5] }}
                transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
            />
        ))}
    </svg>
);

const Step2Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,77,0,0.15)]">
        {/* Spiral Expansion */}
        {[...Array(24)].map((_, i) => {
            const angle = (i / 23) * Math.PI * 4;
            const r = 30 + i * 6;
            return (
                <motion.circle
                    key={i}
                    cx={200 + Math.cos(angle) * r}
                    cy={200 + Math.sin(angle) * r}
                    r={i % 3 === 0 ? 12 : 8}
                    fill={i % 3 === 0 ? "url(#beadGrad)" : "rgba(255,255,255,0.1)"}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                />
            );
        })}
    </svg>
);

const Step3Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,77,0,0.15)]">
        {/* Neural Plate - Perspective View */}
        <motion.path
            d="M80 200 L200 130 L320 200 L200 270 Z"
            fill="rgba(255,255,255,0.03)"
            stroke="white"
            strokeOpacity="0.1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        />
        {/* Vertical Beads Through Plate */}
        {[...Array(5)].map((_, col) => (
            <g key={col}>
                {[...Array(6)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={140 + col * 30}
                        cy={80 + i * 40}
                        r={12}
                        fill={i === 2 ? "url(#beadGrad)" : "rgba(255,255,255,0.05)"}
                        animate={{ y: [0, 40] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: col * 0.4 }}
                    />
                ))}
            </g>
        ))}
    </svg>
);

const Step4Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,77,0,0.15)]">
        {/* Complex Mesh / Completed Architecture */}
        <motion.circle
            cx="200" cy="200" r="100"
            fill="none"
            stroke="#FF4D00"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
                <motion.g key={i}>
                    <line
                        x1="200" y1="200"
                        x2={200 + Math.cos(angle) * 120}
                        y2={200 + Math.sin(angle) * 120}
                        stroke="#FF4D00" strokeOpacity="0.2"
                    />
                    <motion.circle
                        cx={200 + Math.cos(angle) * 120}
                        cy={200 + Math.sin(angle) * 120}
                        r="15"
                        fill="url(#beadGrad)"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    />
                </motion.g>
            );
        })}
        <circle cx="200" cy="200" r="40" fill="white" fillOpacity="0.05" />
    </svg>
);