import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

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
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    // Transform scroll progress to visual states (0-3 for 4 steps)
    const visualState = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 3]);

    return (
        <section ref={containerRef} className="relative bg-[#09090b] py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
                {/* Mobile: Stacked Layout */}
                <div className="block md:hidden space-y-16">
                    {steps.map((step) => (
                        <MobileStep key={step.number} step={step} />
                    ))}
                </div>

                {/* Desktop: 2-Column Grid */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-16 lg:gap-24">
                    {/* Left Column - Sticky Visual */}
                    <div className="sticky top-0 h-screen flex items-center justify-center">
                        <StickyVisual visualState={visualState} />
                    </div>

                    {/* Right Column - Scrolling Steps */}
                    <div className="space-y-0">
                        {steps.map((step, index) => (
                            <DesktopStep
                                key={step.number}
                                step={step}
                                index={index}
                                isLast={index === steps.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Desktop Step Component
interface DesktopStepProps {
    step: typeof steps[0];
    index: number;
    isLast: boolean;
}

const DesktopStep: React.FC<DesktopStepProps> = ({ step, index, isLast }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, {
        margin: '-50% 0px -50% 0px' // Triggers when step is centered
    });

    return (
        <motion.div
            ref={ref}
            className={`min-h-screen flex items-center ${!isLast ? 'border-b border-zinc-800/30' : ''}`}
            initial={{ opacity: 0.2 }}
            animate={{
                opacity: isInView ? 1 : 0.2,
                transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 30
                }
            }}
        >
            <div className="py-16 w-full">
                <div className="flex items-start gap-6">
                    {/* Number Box */}
                    <motion.div
                        className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-300 ${isInView
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                                : 'border-2 border-zinc-800 text-zinc-700'
                            }`}
                        animate={{
                            scale: isInView ? 1 : 0.95,
                            transition: {
                                type: 'spring',
                                stiffness: 120,
                                damping: 40
                            }
                        }}
                    >
                        {step.number}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                        <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-md">
                            {step.description}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Mobile Step Component
interface MobileStepProps {
    step: typeof steps[0];
}

const MobileStep: React.FC<MobileStepProps> = ({ step }) => {
    return (
        <div className="space-y-6">
            {/* Visual for this step */}
            <div className="flex items-center justify-center py-8">
                <div className="w-64 h-64">
                    <SimplifiedVisual stepNumber={step.number} />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center text-base font-bold">
                        {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                        {step.title}
                    </h3>
                </div>
                <p className="text-base text-zinc-400 leading-relaxed">
                    {step.description}
                </p>
            </div>
        </div>
    );
};

// Sticky Visual with animated 3D effect
interface StickyVisualProps {
    visualState: any;
}

const StickyVisual: React.FC<StickyVisualProps> = ({ visualState }) => {
    // Transform visual state to rotation and colors
    const rotation = useTransform(visualState, [0, 3], [0, 360]);
    const scale = useTransform(visualState,
        [0, 0.5, 1, 1.5, 2, 2.5, 3],
        [1, 1.1, 1, 1.1, 1, 1.1, 1]
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
                    {/* Sphere 1 */}
                    <motion.circle
                        cx="200"
                        cy="140"
                        r="15"
                        fill="url(#sphereGradient1)"
                        style={{
                            scale: useTransform(visualState, [0, 1, 2, 3], [1, 1.3, 1, 1.3])
                        }}
                    />

                    {/* Sphere 2 */}
                    <motion.circle
                        cx="260"
                        cy="200"
                        r="20"
                        fill="url(#sphereGradient2)"
                        style={{
                            scale: useTransform(visualState, [0, 1, 2, 3], [1, 1, 1.3, 1])
                        }}
                    />

                    {/* Sphere 3 */}
                    <motion.circle
                        cx="200"
                        cy="260"
                        r="18"
                        fill="url(#sphereGradient3)"
                        style={{
                            scale: useTransform(visualState, [0, 1, 2, 3], [1.3, 1, 1, 1.3])
                        }}
                    />

                    {/* Sphere 4 */}
                    <motion.circle
                        cx="140"
                        cy="200"
                        r="16"
                        fill="url(#sphereGradient4)"
                        style={{
                            scale: useTransform(visualState, [0, 1, 2, 3], [1, 1.3, 1.3, 1])
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

// Simplified Visual for Mobile
interface SimplifiedVisualProps {
    stepNumber: number;
}

const SimplifiedVisual: React.FC<SimplifiedVisualProps> = ({ stepNumber }) => {
    const colors = [
        ['#60a5fa', '#3b82f6'],
        ['#818cf8', '#6366f1'],
        ['#a78bfa', '#8b5cf6'],
        ['#c4b5fd', '#a78bfa']
    ];

    const [color1, color2] = colors[stepNumber - 1];

    return (
        <svg viewBox="0 0 400 400" className="w-full h-full">
            <ellipse
                cx="200"
                cy="200"
                rx="150"
                ry="60"
                fill="none"
                stroke={color1}
                strokeWidth="2"
                opacity={0.4}
            />
            <circle cx="200" cy="200" r="25" fill={color2} />
            <circle cx="200" cy="140" r="15" fill={color1} />
            <circle cx="260" cy="200" r="20" fill={color2} opacity={0.7} />
            <circle cx="200" cy="260" r="18" fill={color1} opacity={0.6} />
            <circle cx="140" cy="200" r="16" fill={color2} opacity={0.8} />
        </svg>
    );
};
