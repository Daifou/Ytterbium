import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
    {
        number: 1,
        title: 'Input',
        description: 'Describe your task and Ytterbium instantly calibrates the optimal focus environment'
    },
    {
        number: 2,
        title: 'Analyze',
        description: 'AI classifies cognitive load and recommends the perfect intensity level for peak performance'
    },
    {
        number: 3,
        title: 'Focus',
        description: 'Enter your personalized environment with adaptive timers and biometric rest prompts'
    },
    {
        number: 4,
        title: 'Complete',
        description: 'Track progress through sessions and unlock deeper focus states over time'
    }
];

export const StickyScroll: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 1. Create a tall scrollable container (300vh) to drive the animation
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // 2. Map scroll progress (0 to 1) to an active step index (0 to 3)
    // We use a slight "plateau" logic so the user "locks" onto a step for a moment before switching
    const activeStepIndex = useTransform(
        scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1], // Input range (scroll progress)
        [0, 1, 2, 3, 3]          // Output range (active index)
    );

    return (
        <section ref={containerRef} className="relative bg-[#09090b] h-[300vh]">
            {/* Sticky Wrapper: This locks the view to the screen while we scroll through the 300vh parent */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 w-full">

                    {/* The Grid Layout: Visual on Left, Compact List on Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left Column: Visual (Stays Fixed & Centered) */}
                        <div className="hidden md:flex items-center justify-center h-full">
                            <StickyVisual activeStepIndex={activeStepIndex} />
                        </div>

                        {/* Right Column: The "ProSE" Compact Accordion */}
                        <div className="flex flex-col justify-center relative">
                            {/* Top Border for the first item to complete the grid look */}
                            <div className="w-full h-px bg-white/10 mb-0" />

                            {steps.map((step, index) => (
                                <Step
                                    key={step.number}
                                    step={step}
                                    index={index}
                                    activeStepIndex={activeStepIndex}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ------------------------------------------------------------------
// Sub-Components (Preserved & Updated logic)
// ------------------------------------------------------------------

interface StepProps {
    step: typeof steps[0];
    index: number;
    activeStepIndex: any; // Using 'any' for the MotionValue to simplify types in this snippet
}

const Step: React.FC<StepProps> = ({ step, index, activeStepIndex }) => {
    // We create a custom "isActive" generic boolean transform for opacity/colors
    // This value is 1 when we are on this step, and 0 when we are not.
    // We use a small buffer (+/- 0.5) to decide when to switch.
    const isActiveValue = useTransform(activeStepIndex, (current: number) => {
        // Precise switching point
        return Math.round(current) === index ? 1 : 0;
    });

    const isInactiveOpacity = useTransform(isActiveValue, [0, 1], [0.3, 1]);
    const numberBg = useTransform(isActiveValue, [0, 1], ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']);
    const numberText = useTransform(isActiveValue, [0, 1], ['#71717a', '#000000']); // Zinc-500 to Black
    const contentHeight = useTransform(isActiveValue, [0, 1], [0, 100]); // Collapsed vs Expanded height (approx px)

    return (
        <motion.div
            className="w-full border-b border-white/10"
            style={{
                opacity: isInactiveOpacity,
            }}
        >
            <div className="py-6 group cursor-pointer transition-all duration-500">
                <div className="flex items-start gap-6">
                    {/* Number Box */}
                    <motion.div
                        className="flex-shrink-0 w-10 h-10 rounded flex items-center justify-center text-sm font-bold border border-white/10"
                        style={{
                            backgroundColor: numberBg,
                            color: numberText,
                            borderColor: useTransform(isActiveValue, [0, 1], ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)'])
                        }}
                    >
                        {step.number}
                    </motion.div>

                    <div className="flex-1">
                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                            {step.title}
                        </h3>

                        {/* Description (Accordion Expanding) */}
                        <motion.div
                            style={{
                                height: contentHeight,
                                opacity: isActiveValue
                            }}
                            className="overflow-hidden"
                        >
                            <p className="text-zinc-400 text-sm leading-relaxed pb-2 max-w-sm">
                                {step.description}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ------------------------------------------------------------------
// Visual Component (Preserved your exact SVG logic)
// ------------------------------------------------------------------

interface StickyVisualProps {
    activeStepIndex: any;
}

const StickyVisual: React.FC<StickyVisualProps> = ({ activeStepIndex }) => {
    // Smooth continuous rotation mapped to total scroll
    const rotation = useTransform(activeStepIndex, [0, 3], [0, 180]);
    // Subtle breathing scale effect
    const scale = useTransform(activeStepIndex, [0, 1.5, 3], [1, 1.1, 1]);

    return (
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* Background glow */}
            <motion.div
                className="absolute inset-0 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent blur-3xl"
                style={{ scale }}
            />

            {/* 3D Ring Structure - EXACTLY AS PROVIDED */}
            <motion.svg
                viewBox="0 0 400 400"
                className="w-full h-full"
                style={{ rotate: rotation }}
            >
                {/* Outer ring */}
                <motion.ellipse
                    cx="200"
                    cy="200"
                    rx="150"
                    ry="60"
                    fill="none"
                    stroke="url(#gradient1)"
                    strokeWidth="1"
                    opacity={0.5}
                />

                {/* Inner rotating spheres Group */}
                <motion.g style={{
                    rotate: useTransform(rotation, (r) => -r * 2), // Counter-rotate inner elements for 3D effect
                    originX: '200px',
                    originY: '200px'
                }}>
                    {/* Sphere 1 - Top */}
                    <motion.circle
                        cx="200"
                        cy="140"
                        r="12"
                        fill="url(#sphereGradient1)"
                    />
                    {/* Sphere 2 - Right */}
                    <motion.circle
                        cx="260"
                        cy="200"
                        r="16"
                        fill="url(#sphereGradient2)"
                    />
                    {/* Sphere 3 - Bottom */}
                    <motion.circle
                        cx="200"
                        cy="260"
                        r="14"
                        fill="url(#sphereGradient3)"
                    />
                    {/* Sphere 4 - Left */}
                    <motion.circle
                        cx="140"
                        cy="200"
                        r="12"
                        fill="url(#sphereGradient4)"
                    />
                </motion.g>

                {/* Center core */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="20"
                    fill="url(#coreGradient)"
                    style={{ scale }}
                />

                {/* Gradients Definitions */}
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
    );
};