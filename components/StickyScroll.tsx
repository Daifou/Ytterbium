"use client";
import React, { useRef, useState, useMemo } from "react";
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
        description: "Each amino acid is then sequentially added and uniformly spaced along the linker in its original order, constructing a ProSE Molecule.",
    },
    {
        number: "3",
        title: "Amino Acid Sequencing",
        description: "Finally, the assembled ProSE Molecule passes through a nanopore, where distinct electrical signatures from each amino acid reveal the protein's sequence.",
    },
];

export const StickyScroll = () => {
    const [activeCard, setActiveCard] = useState(0);
    const containerRef = useRef<any>(null);

    // We use a tall container for the scroll progress, but the content remains sticky
    const { scrollYProgress } = useScroll({
        target: containerRef,
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
        <div ref={containerRef} className="relative h-[300vh] bg-white font-sans">
            {/* STICKY VIEWPORT: Everything stays in this window */}
            <div className="sticky top-0 h-screen w-full flex overflow-hidden border-t border-gray-200">

                {/* TOP LABELS */}
                <div className="absolute top-4 left-6 flex items-center gap-2 z-50">
                    <span className="text-[11px] font-semibold text-gray-400">1</span>
                    <div className="w-2 h-2 rounded-full bg-gray-800" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-800">Technology</span>
                </div>
                <div className="absolute top-4 right-10 z-50">
                    <span className="text-[11px] font-semibold text-gray-400">2026</span>
                </div>

                {/* LEFT COLUMN: Moving Visual */}
                <div className="w-1/2 h-full border-r border-gray-100 relative flex items-center justify-center">
                    {/* Visual Level Tracking: Moves up/down to stay level with active step */}
                    <motion.div
                        className="w-full max-w-md aspect-square relative"
                        animate={{
                            // Maps visual Y position to the vertical center of the right-side steps
                            y: activeCard === 0 ? -80 : activeCard === 1 ? 0 : 80
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full"
                            >
                                {activeCard === 0 && <Step1Visual />}
                                {activeCard === 1 && <Step2Visual />}
                                {activeCard === 2 && <Step3Visual />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    {/* Step Markers inside the visual area */}
                    <AnimatePresence>
                        <motion.div
                            key={`marker-${activeCard}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute z-10 w-7 h-7 bg-gray-600 rounded flex items-center justify-center text-white text-[11px] font-bold shadow-lg"
                            style={{
                                top: activeCard === 0 ? "20%" : activeCard === 1 ? "45%" : "75%",
                                right: activeCard === 0 ? "20%" : activeCard === 1 ? "10%" : "25%"
                            }}
                        >
                            {activeCard + 1}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: Steps List */}
                <div className="w-1/2 h-full flex flex-col justify-center px-12 relative">
                    <div className="mb-12 max-w-sm">
                        <p className="text-[14px] text-gray-500 leading-snug">
                            ProSE™ will revolutionize proteomics by delivering unprecedented precision, scalability, and accessibility.
                        </p>
                    </div>

                    <div className="flex flex-col border-t border-gray-100">
                        {content.map((item, index) => {
                            const isActive = activeCard === index;
                            return (
                                <div key={index} className="relative border-b border-gray-100 py-8 flex flex-col transition-all duration-500">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-6">
                                            {/* Number Box */}
                                            <div className={cn(
                                                "w-8 h-8 rounded border flex items-center justify-center text-[12px] font-bold transition-all duration-300",
                                                isActive ? "bg-gray-800 border-gray-800 text-white" : "bg-white border-gray-200 text-gray-300"
                                            )}>
                                                {item.number}
                                            </div>
                                            {/* Title */}
                                            <h2 className={cn(
                                                "text-[40px] font-medium tracking-tight transition-colors duration-500",
                                                isActive ? "text-gray-900" : "text-gray-200"
                                            )}>
                                                {item.title}
                                            </h2>
                                        </div>
                                        {/* Sticky Dot */}
                                        <div className={cn(
                                            "w-2 h-2 rounded-full transition-all duration-500",
                                            isActive ? "bg-gray-800 scale-125" : "bg-gray-200"
                                        )} />
                                    </div>

                                    {/* Expandable Description */}
                                    <motion.div
                                        initial={false}
                                        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="mt-4 text-[15px] text-gray-600 leading-relaxed max-w-md ml-14">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- ACCURATE PROSE VISUALS --- */

const Step1Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full opacity-90">
        <defs>
            <radialGradient id="greenBead" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="60%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#166534" />
            </radialGradient>
        </defs>
        {/* Main curved chain */}
        {[...Array(12)].map((_, i) => {
            const angle = (i / 11) * Math.PI * 1.2 + 0.5;
            const r = 120;
            return (
                <circle key={i} cx={200 + Math.cos(angle) * r} cy={200 + Math.sin(angle) * r} r={16} fill="url(#greenBead)" />
            );
        })}
        {/* Small square tail */}
        {[...Array(8)].map((_, i) => (
            <rect key={i} x={150 + i * 15} y={120 - i * 5} width="10" height="10" rx="2" fill="#e5e7eb" />
        ))}
    </svg>
);

const Step2Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        <defs>
            <radialGradient id="whiteBead" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d1d5db" />
            </radialGradient>
        </defs>
        {/* Long spiral expansion */}
        {[...Array(20)].map((_, i) => {
            const angle = (i / 19) * Math.PI * 2.5;
            const r = 30 + i * 7;
            return (
                <circle key={i} cx={200 + Math.cos(angle) * r} cy={200 + Math.sin(angle) * r} r={10} fill={i % 3 === 0 ? "url(#greenBead)" : "url(#whiteBead)"} />
            );
        })}
    </svg>
);

const Step3Visual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Translucent Plate */}
        <motion.rect
            x="80" y="140" width="240" height="120" rx="20"
            fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.1)" strokeWidth="1"
            initial={{ rotateX: 60 }}
        />
        {/* Vertical Sequencing Chains */}
        {[...Array(4)].map((_, col) => (
            <g key={col}>
                {[...Array(5)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={130 + col * 50}
                        cy={100 + i * 40}
                        r={12}
                        fill={i === 2 ? "url(#greenBead)" : "#f3f4f6"}
                        animate={{ y: [0, 40] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: col * 0.2 }}
                    />
                ))}
            </g>
        ))}
    </svg>
);