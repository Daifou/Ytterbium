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

    // Monitor scroll progress through the 600vh parent (increased for "locked" feel time)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // Plateau mapping for "Locked" feel:
    // 0% - 20%: Locked on Step 1 (0)
    // 20% - 25%: TRANSITION (0 -> 1)
    // 25% - 45%: Locked on Step 2 (1)
    // 45% - 50%: TRANSITION (1 -> 2)
    // 50% - 70%: Locked on Step 3 (2)
    // 70% - 75%: TRANSITION (2 -> 3)
    // 75% - 100%: Locked on Step 4 (3)
    const activeStepIndex = useTransform(
        scrollYProgress,
        [0, 0.20, 0.25, 0.45, 0.50, 0.70, 0.75, 1],
        [0, 0, 1, 1, 2, 2, 3, 3]
    );

    return (
        // 600vh parent for ample scroll room to feel the "locks"
        <section ref={containerRef} className="relative bg-[#09090b] h-[600vh]">
            {/* Sticky h-screen wrapper - stays locked */}
            <div className="sticky top-0 h-screen">
                <div className="max-w-7xl mx-auto px-6 h-full">
                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 h-full">
                        {/* Left Column - Centered Visual */}
                        <div className="hidden md:flex items-center justify-center">
                            <StickyVisual activeStepIndex={activeStepIndex} />
                        </div>

                        {/* Right Column - All 4 Steps (Sequential Reveal) */}
                        <div className="flex flex-col justify-center space-y-1">
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

// Individual Step Component - Natural Height (No flex-1)
interface StepProps {
    step: typeof steps[0];
    index: number;
    activeStepIndex: any;
}

const Step: React.FC<StepProps> = ({ step, index, activeStepIndex }) => {
    // Range +/- 1.0 ensures that as Step N fades out (0 -> 1), Step N+1 fades in (0 -> 1).
    // They cross at 0.5 where both are at 50% opacity/height.
    const activeRange = [index - 1, index, index + 1];

    return (
        <motion.div
            className="py-4 border-b border-white/10 last:border-b-0"
        >
            <div className="flex items-start gap-5">
                {/* Number Box */}
                <motion.div
                    className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-base font-bold transition-colors duration-200"
                    style={{
                        backgroundColor: useTransform(
                            activeStepIndex,
                            activeRange,
                            ['transparent', '#ffffff', 'transparent']
                        ),
                        color: useTransform(
                            activeStepIndex,
                            activeRange,
                            ['#71717a', '#000000', '#71717a']
                        ),
                        borderWidth: useTransform(
                            activeStepIndex,
                            activeRange,
                            ['2px', '0px', '2px']
                        ),
                        borderColor: useTransform(
                            activeStepIndex,
                            activeRange,
                            ['#3f3f46', '#ffffff', '#3f3f46']
                        )
                    }}
                >
                    {step.number}
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-h-0">
                    {/* Title - Always Visible */}
                    <motion.h3
                        className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2"
                        style={{
                            opacity: useTransform(
                                activeStepIndex,
                                activeRange,
                                [0.3, 1, 0.3]
                            )
                        }}
                    >
                        {step.title}
                    </motion.h3>

                    {/* Description - Accordion Effect */}
                    {/* Note: 'auto' is not interpolatable by useTransform. We use a fixed max-height approx. */}
                    <motion.div
                        className="overflow-hidden"
                        style={{
                            height: useTransform(
                                activeStepIndex,
                                activeRange,
                                ['0px', '100px', '0px'] // Sufficient height for the description
                            ),
                            opacity: useTransform(
                                activeStepIndex,
                                activeRange,
                                [0, 1, 0]
                            )
                        }}
                    >
                        <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md pb-4">
                            {step.description}
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

// Sticky Visual Component
interface StickyVisualProps {
    activeStepIndex: any;
}

const StickyVisual: React.FC<StickyVisualProps> = ({ activeStepIndex }) => {
    const rotation = useTransform(activeStepIndex, [0, 3], [0, 360]);
    const scale = useTransform(activeStepIndex,
        [0, 1, 2, 3],
        [1, 1.05, 1, 1.05]
    );

    return (
        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* Background glow */}
            <motion.div
                className="absolute inset-0 bg-gradient-radial from-indigo-500/5 via-transparent to-transparent blur-3xl"
                style={{ scale }}
            />

            {/* 3D Ring Structure */}
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
                    strokeWidth="2"
                    opacity={0.4}
                />

                {/* Inner rotating spheres */}
                <motion.g style={{
                    rotate: useTransform(rotation, (r) => -r * 0.5),
                    originX: '200px',
                    originY: '200px'
                }}>
                    {/* Sphere 1 - Top */}
                    <motion.circle
                        cx="200"
                        cy="140"
                        r="15"
                        fill="url(#sphereGradient1)"
                        style={{
                            scale: useTransform(activeStepIndex, [0, 1, 2, 3], [1.3, 1, 1, 1])
                        }}
                    />

                    {/* Sphere 2 - Right */}
                    <motion.circle
                        cx="260"
                        cy="200"
                        r="20"
                        fill="url(#sphereGradient2)"
                        style={{
                            scale: useTransform(activeStepIndex, [0, 1, 2, 3], [1, 1.3, 1, 1])
                        }}
                    />

                    {/* Sphere 3 - Bottom */}
                    <motion.circle
                        cx="200"
                        cy="260"
                        r="18"
                        fill="url(#sphereGradient3)"
                        style={{
                            scale: useTransform(activeStepIndex, [0, 1, 2, 3], [1, 1, 1.3, 1])
                        }}
                    />

                    {/* Sphere 4 - Left */}
                    <motion.circle
                        cx="140"
                        cy="200"
                        r="16"
                        fill="url(#sphereGradient4)"
                        style={{
                            scale: useTransform(activeStepIndex, [0, 1, 2, 3], [1, 1, 1, 1.3])
                        }}
                    />
                </motion.g>

                {/* Center core */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="25"
                    fill="url(#coreGradient)"
                    style={{ scale }}
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

            {/* Decorative dots */}
            <div className="absolute top-1/4 left-0 w-2 h-2 rounded-full bg-indigo-500/20" />
            <div className="absolute bottom-1/4 right-0 w-2 h-2 rounded-full bg-purple-500/20" />
        </div>
    );
};
