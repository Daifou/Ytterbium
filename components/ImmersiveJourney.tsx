import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ImmersiveJourneyProps {
    onComplete: () => void;
}

// Helper for drawn borders
const BorderDraw = ({ className, delay = 0, duration = 1.5 }: { className?: string, delay?: number, duration?: number }) => (
    <motion.div
        initial={{ scaleX: 0, scaleY: 0, originX: 0, originY: 0 }}
        whileInView={{ scaleX: 1, scaleY: 1 }}
        transition={{ duration, delay, ease: "easeInOut" }}
        className={`absolute bg-[#D1CDC0] ${className}`}
    />
);

export const ImmersiveJourney: React.FC<ImmersiveJourneyProps> = ({ onComplete }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Smooth Scroll Setup (Lenis) ---
    useEffect(() => {
        const lenis = new Lenis({
            duration: 2.0, // Heavy, luxurious feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-full min-h-screen bg-[#F9F7F2] text-[#1a1a1a] overflow-hidden selection:bg-[#2F4F4F] selection:text-[#F9F7F2] font-sans">
            {/* --- Global Grain Overlay --- */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* --- Section 1: The Emotional Mirror --- */}
            <section className="relative w-full min-h-screen flex items-center justify-center p-6 md:p-12">
                <div className="relative w-full max-w-[1400px] h-[80vh] grid grid-cols-12">
                    {/* Drawn Borders */}
                    <BorderDraw className="top-0 left-0 w-full h-[1px]" delay={0.2} />
                    <BorderDraw className="bottom-0 left-0 w-full h-[1px]" delay={0.4} />
                    <BorderDraw className="top-0 left-0 w-[1px] h-full" delay={0.3} />
                    <BorderDraw className="top-0 right-0 w-[1px] h-full" delay={0.5} />

                    {/* Content */}
                    <div className="col-span-12 flex flex-col items-center justify-center p-12 text-center relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="font-instrument text-7xl md:text-9xl tracking-tighter text-[#1a1a1a] mb-12 leading-[0.9]"
                        >
                            The Quiet Exhaustion.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                            className="font-sans text-xl md:text-2xl max-w-2xl leading-relaxed text-[#4a4a4a] tracking-tight"
                        >
                            You aren’t lazy. You’re overstimulated. Modern work is an assault on your biology—a constant state of emergency that leaves your brain frayed and your best ideas buried under noise.
                        </motion.p>
                    </div>

                    {/* Visual Element: Distorted Shape */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                        className="absolute right-12 bottom-12 w-32 h-32 border border-[#1a1a1a] rounded-full opacity-20"
                        animate={{
                            d: ["M10 10 L90 90", "M10 90 L90 10"],
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 0.95, 1]
                        }}
                        style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
                    />
                </div>
            </section>

            {/* --- Section 2: The Shift (Bento Grid) --- */}
            <section className="relative w-full min-h-screen flex items-center justify-center p-6 md:p-12 box-border">
                <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 relative">

                    {/* Cell 1: Biology */}
                    <div className="relative p-12 h-[600px] flex flex-col justify-between group">
                        {/* Cell Borders */}
                        <BorderDraw className="top-0 left-0 w-full h-[1px]" delay={0.1} />
                        <BorderDraw className="bottom-0 left-0 w-full h-[1px]" delay={0.1} />
                        <BorderDraw className="top-0 left-0 w-[1px] h-full" delay={0.1} />
                        <BorderDraw className="top-0 right-0 w-[1px] h-full self-border" delay={0.3} />

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            <span className="block font-mono text-xs tracking-[0.2em] text-[#8a8a8a] mb-6">01 / BIOLOGY</span>
                            <h2 className="font-instrument text-6xl mb-8">Neural Synchronization.</h2>
                            <p className="font-sans text-xl text-[#5a5a5a] leading-relaxed max-w-sm">We align your task complexity with your natural ultradian rhythms. No more forcing. Just flowing.</p>
                        </motion.div>
                    </div>

                    {/* Cell 2: Focus */}
                    <div className="relative p-12 h-[600px] flex flex-col justify-between group">
                        {/* Cell Borders */}
                        <BorderDraw className="top-0 left-0 w-full h-[1px]" delay={0.1} />
                        <BorderDraw className="bottom-0 left-0 w-full h-[1px]" delay={0.1} />
                        <BorderDraw className="top-0 right-0 w-[1px] h-full" delay={0.1} />

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                        >
                            <span className="block font-mono text-xs tracking-[0.2em] text-[#8a8a8a] mb-6">02 / FOCUS</span>
                            <h2 className="font-instrument text-6xl mb-8">Deep Architecture.</h2>
                            <p className="font-sans text-xl text-[#5a5a5a] leading-relaxed max-w-sm">A digital environment designed to protect your prefrontal cortex from the 'switch-cost' of notifications.</p>
                        </motion.div>

                        {/* Visual: Perfect Circle */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.8 }}
                            className="w-24 h-24 border border-[#2F4F4F] rounded-full self-end"
                        />
                    </div>
                </div>
            </section>

            {/* --- Section 3 & 4: Invitation & Entry --- */}
            <section className="relative w-full min-h-[90vh] flex items-center justify-center p-6 md:p-12 pb-32">
                <div className="relative w-full max-w-[1400px] grid grid-cols-1 p-12 md:p-24 text-center">
                    <BorderDraw className="top-0 left-0 w-full h-[1px]" />
                    <BorderDraw className="bottom-0 left-0 w-full h-[1px]" />
                    <BorderDraw className="top-0 left-0 w-[1px] h-full" />
                    <BorderDraw className="top-0 right-0 w-[1px] h-full" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="mb-20"
                    >
                        <span className="block font-mono text-xs tracking-[0.3em] text-[#8a8a8a] mb-8">INVESTMENT</span>
                        <h2 className="font-instrument text-[8rem] md:text-[12rem] leading-[0.8] mb-8 text-[#1a1a1a]">$12</h2>
                        <p className="font-sans text-2xl text-[#4a4a4a] mt-4 font-light">One plan. Full access to your focused self.</p>
                    </motion.div>

                    {/* Sign Up Form */}
                    <div className="w-full max-w-2xl mx-auto flex flex-col gap-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="relative group">
                                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-[#D1CDC0] py-4 text-xl outline-none focus:border-[#2F4F4F] transition-all duration-500 placeholder:text-[#b0ada0] text-[#2F4F4F]" />
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#2F4F4F] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left" />
                            </div>
                            <div className="relative group">
                                <input type="password" placeholder="Password" className="w-full bg-transparent border-b border-[#D1CDC0] py-4 text-xl outline-none focus:border-[#2F4F4F] transition-all duration-500 placeholder:text-[#b0ada0] text-[#2F4F4F]" />
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#2F4F4F] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left" />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={onComplete}
                            className="mt-8 w-full bg-[#1A2E2E] text-[#F9F7F2] py-8 text-xl tracking-[0.1em] uppercase hover:bg-[#142424] transition-all duration-500 font-medium relative overflow-hidden group"
                        >
                            <span className="relative z-10">Claim your focus</span>
                            <div className="absolute inset-0 bg-[#2F4F4F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
};

