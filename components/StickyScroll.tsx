"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { cn } from "../lib/utils";

const content = [
    {
        title: "Input",
        description: "Describe your task and Ytterbium instantly calibrates the optimal focus environment",
    },
    {
        title: "Analyze",
        description: "AI classifies cognitive load and recommends the perfect intensity level for peak performance",
    },
    {
        title: "Focus",
        description: "Enter your personalized environment with adaptive timers and biometric rest prompts",
    },
    {
        title: "Complete",
        description: "Track progress through sessions and unlock deeper focus states over time",
    },
];

export const StickyScroll = () => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<any>(null);
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end end"], // Adjusted for fuller scroll coverage
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
        <motion.div
            className="h-[40rem] overflow-y-auto flex justify-center relative space-x-10 rounded-md p-10 bg-[#09090b]"
            ref={ref}
            style={{
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none', /* IE/Edge */
            }}
        >
            <style>
                {`
                /* Hide scrollbar for Chrome, Safari and Opera */
                div::-webkit-scrollbar {
                    display: none;
                }
                `}
            </style>

            {/* Visual Column (Sticky) - Placed First for Left Alignment */}
            <div
                className={cn(
                    "hidden lg:block h-[30rem] w-[30rem] sticky top-10 overflow-hidden rounded-md",
                )}
            >
                {/* Persistent Visual Component that morphs based on activeCard */}
                <StickyVisual activeIndex={activeCard} />
            </div>

            {/* Text Column (Scrollable) */}
            <div className="div relative flex items-start px-4">
                <div className="max-w-2xl">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-20 flex flex-col justify-center min-h-[15rem]">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                                className="text-3xl font-bold text-slate-100 mb-4"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                                className="text-lg text-slate-300 max-w-sm leading-relaxed"
                            >
                                {item.description}
                            </motion.p>
                        </div>
                    ))}
                    <div className="h-40" />
                </div>
            </div>
        </motion.div>
    );
};

// Adapted StickyVisual that accepts an integer index and uses layout animations/springs
const StickyVisual = ({ activeIndex }: { activeIndex: number }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-[#09090b]">
            <div className="relative w-full max-w-[20rem] aspect-square flex items-center justify-center">

                {/* Background Glow */}
                <motion.div
                    animate={{
                        scale: activeIndex % 2 === 0 ? 1 : 1.1,
                        opacity: 0.5
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent blur-3xl"
                />

                {/* 3D Ring Structure */}
                <motion.svg
                    viewBox="0 0 400 400"
                    className="w-full h-full"
                    animate={{ rotate: activeIndex * 90 }} // Rotate 90deg per step
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    {/* Outer Ring */}
                    <ellipse
                        cx="200"
                        cy="200"
                        rx="150"
                        ry="60"
                        fill="none"
                        stroke="url(#gradient1)"
                        strokeWidth="1"
                        opacity="0.5"
                    />

                    {/* Inner Rotating Spheres Group */}
                    <motion.g
                        animate={{ rotate: -(activeIndex * 90) * 2 }} // Counter-rotate
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        style={{ originX: "200px", originY: "200px" }}
                    >
                        <circle cx="200" cy="140" r="12" fill="url(#sphereGradient1)" />
                        <circle cx="260" cy="200" r="16" fill="url(#sphereGradient2)" />
                        <circle cx="200" cy="260" r="14" fill="url(#sphereGradient3)" />
                        <circle cx="140" cy="200" r="12" fill="url(#sphereGradient4)" />
                    </motion.g>

                    {/* Center Core */}
                    <motion.circle
                        cx="200"
                        cy="200"
                        r="20"
                        fill="url(#coreGradient)"
                        animate={{ scale: activeIndex % 2 === 0 ? 1 : 1.2 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        </linearGradient>
                        <radialGradient id="sphereGradient1">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </radialGradient>
                        <radialGradient id="sphereGradient2">
                            <stop offset="0%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </radialGradient>
                        <radialGradient id="sphereGradient3">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </radialGradient>
                        <radialGradient id="sphereGradient4">
                            <stop offset="0%" stopColor="#c4b5fd" />
                            <stop offset="100%" stopColor="#a78bfa" />
                        </radialGradient>
                        <radialGradient id="coreGradient">
                            <stop offset="0%" stopColor="#e0e7ff" />
                            <stop offset="100%" stopColor="#818cf8" />
                        </radialGradient>
                    </defs>
                </motion.svg>
            </div>
        </div>
    );
};
