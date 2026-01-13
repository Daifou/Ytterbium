"use client";
import React, { useEffect, useRef, useState } from "react";
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
    const ref = useRef<any>(null);

    // Using the exact container-based scroll logic from the library
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end start"],
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
        <div className="w-full bg-white py-12">
            {/* SCROLL CONTAINER: 
          Uses the 'overflow-y-auto' behavior from the library for smooth internal scrolling.
      */}
            <motion.div
                ref={ref}
                className="relative flex h-[42rem] overflow-y-auto border-t border-b border-gray-200 bg-white"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                {/* LEFT SIDE: Sticky & Level-Tracking Visual */}
                <div className="sticky top-0 hidden h-full w-1/2 items-center justify-center border-r border-gray-100 lg:flex">
                    {/* Top Decorative Labels */}
                    <div className="absolute top-8 left-8 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-400">1</span>
                        <div className="h-2 w-2 rounded-full bg-gray-900 shadow-sm" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Technology</span>
                    </div>

                    {/* DYNAMIC LEVELING: 
              This Y-translation ensures the visual stays centered with the 
              currently expanded step on the right.
          */}
                    <motion.div
                        className="relative flex h-80 w-80 items-center justify-center"
                        animate={{
                            y: activeCard === 0 ? -100 : activeCard === 1 ? 0 : 100,
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCard}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="h-full w-full"
                            >
                                {activeCard === 0 && <Step1Visual />}
                                {activeCard === 1 && <Step2Visual />}
                                {activeCard === 2 && <Step3Visual />}
                            </motion.div>
                        </AnimatePresence>

                        {/* Step Number Badge inside Visual Area */}
                        <AnimatePresence>
                            <motion.div
                                key={`badge-${activeCard}`}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute z-10 flex h-7 w-7 items-center justify-center rounded bg-gray-600 text-[11px] font-bold text-white shadow-lg"
                                style={{
                                    top: activeCard === 0 ? "10%" : activeCard === 1 ? "40%" : "80%",
                                    right: activeCard === 0 ? "15%" : activeCard === 1 ? "5%" : "20%"
                                }}
                            >
                                {activeCard + 1}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* RIGHT SIDE: Expanding Steps */}
                <div className="relative flex flex-1 flex-col px-12 py-20">
                    <div className="absolute top-8 right-12">
                        <span className="text-[11px] font-semibold text-gray-400">2026</span>
                    </div>

                    <div className="mb-16 max-w-sm">
                        <p className="text-[14px] leading-relaxed text-gray-500">
                            ProSE™ will revolutionize proteomics by delivering unprecedented precision, scalability, and accessibility.
                        </p>
                    </div>

                    <div className="flex flex-col border-t border-gray-100">
                        {content.map((item, index) => {
                            const isActive = activeCard === index;
                            return (
                                <div key={index} className="flex flex-col border-b border-gray-100 py-10 transition-all duration-500">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            {/* Number Icon */}
                                            <div className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded border text-[12px] font-bold transition-all duration-300",
                                                isActive ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-200 text-gray-300"
                                            )}>
                                                {item.number}
                                            </div>
                                            {/* Title */}
                                            <h2 className={cn(
                                                "text-[42px] font-medium tracking-tight transition-colors duration-500",
                                                isActive ? "text-gray-900" : "text-gray-200"
                                            )}>
                                                {item.title}
                                            </h2>
                                        </div>
                                        {/* Status Indicator Dot */}
                                        <div className={cn(
                                            "h-2 w-2 rounded-full transition-all duration-500",
                                            isActive ? "bg-gray-900 scale-125" : "bg-gray-100"
                                        )} />
                                    </div>

                                    {/* Expandable Description - Triggered by Scroll */}
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            height: isActive ? "auto" : 0,
                                            opacity: isActive ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="mt-6 ml-14 max-w-md text-[16px] leading-relaxed text-gray-600">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Spacer to allow the final item to trigger its scroll expansion */}
                    <div className="h-60" />
                </div>
            </motion.div>
        </div>
    );
};

/* --- PRECISE PROSE SVGS --- */

const Step1Visual = () => (
    <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
            <radialGradient id="greenBead" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#f0fdf4" />
                <stop offset="60%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#166534" />
            </radialGradient>
        </defs>
        {[...Array(12)].map((_, i) => {
            const angle = (i / 11) * Math.PI * 1.2 + 0.5;
            const r = 120;
            return <circle key={i} cx={200 + Math.cos(angle) * r} cy={200 + Math.sin(angle) * r} r={16} fill="url(#greenBead)" />;
        })}
        {[...Array(6)].map((_, i) => (
            <rect key={i} x={150 + i * 18} y={110 - i * 4} width="12" height="12" rx="2" fill="#f3f4f6" stroke="#e5e7eb" />
        ))}
    </svg>
);

const Step2Visual = () => (
    <svg viewBox="0 0 400 400" className="h-full w-full">
        {[...Array(22)].map((_, i) => {
            const angle = (i / 21) * Math.PI * 3;
            const r = 25 + i * 7.5;
            return (
                <circle key={i} cx={200 + Math.cos(angle) * r} cy={200 + Math.sin(angle) * r} r={10}
                    fill={i % 4 === 0 ? "url(#greenBead)" : "#f3f4f6"}
                />
            );
        })}
    </svg>
);

const Step3Visual = () => (
    <svg viewBox="0 0 400 400" className="h-full w-full">
        <rect x="80" y="140" width="240" height="120" rx="20" fill="rgba(0,0,0,0.02)" stroke="#f3f4f6" strokeWidth="1" />
        {[...Array(4)].map((_, col) => (
            <g key={col}>
                {[...Array(5)].map((_, i) => (
                    <motion.circle
                        key={i}
                        cx={130 + col * 50}
                        cy={80 + i * 50}
                        r={14}
                        fill={i === 2 ? "url(#greenBead)" : "#f9fafb"}
                        stroke="#f3f4f6"
                        animate={{ y: [0, 50] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: col * 0.3 }}
                    />
                ))}
            </g>
        ))}
    </svg>
);