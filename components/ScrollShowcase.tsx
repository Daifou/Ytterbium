import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { motion } from 'framer-motion';
import { Brain, Command, Cpu, Moon, Activity, Layout, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export const ScrollShowcase: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rightSideRef = useRef<HTMLDivElement>(null);
    const stepsRef = useRef<HTMLDivElement>(null);

    // UI Refs for specific steps
    const inputRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const restRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const typingTextRef = useRef<HTMLSpanElement>(null);

    const steps = [
        {
            title: "Phase 01: Preparation",
            description: "Write your task and AI will organize the session, with focus mode and number of sessions, to prepare the neural environment.",
            id: "step-1"
        },
        {
            title: "Phase 02: Tracking",
            description: "Initiate work with an active biological monitoring system. When burnout is detected, Ytterbium intervenes immediately.",
            id: "step-2"
        },
        {
            title: "Phase 03: Recovery",
            description: "Seamless move into recovery. Perform guided neuro-rest exercises to clear the cache and restore dopamine levels.",
            id: "step-3"
        },
        {
            title: "Phase 04: Momentum",
            description: "Repeat the cycle with renewed clarity until your prime objective is achieved. Consistent flow, no friction.",
            id: "step-4"
        }
    ];

    useEffect(() => {
        if (!containerRef.current || !rightSideRef.current) return;

        // --- TYPING ANIMATION (Step 1) ---
        const text = "Plan my 3-hour deep work session for the backend refactor...";
        if (typingTextRef.current) {
            typingTextRef.current.innerText = "";
            gsap.to(typingTextRef.current, {
                text: text,
                duration: 2,
                scrollTrigger: {
                    trigger: "#step-1",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                }
            });
        }

        // --- MAIN SCROLL TIMELINE ---
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=400%", // 4 steps
                scrub: 1.2,
                pin: true,
                onUpdate: (self) => {
                    // Reactive feel based on scroll speed
                    const speed = Math.abs(self.getVelocity());
                    const scale = 1 + (speed / 10000);
                    gsap.to(rightSideRef.current, { scale: scale, duration: 0.1, overwrite: "auto" });
                }
            }
        });

        // Step 1 -> 2
        tl.to(inputRef.current, { opacity: 0, scale: 0.8, y: -50, filter: 'blur(10px)', duration: 1 })
            .fromTo(dashboardRef.current,
                { opacity: 0, scale: 1.2, y: 50, filter: 'blur(10px)' },
                { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1 }, "-=0.5");

        // Step 2 Burnout Animation (Shake + Red)
        tl.to(dashboardRef.current, {
            x: "random(-5, 5)",
            y: "random(-5, 5)",
            filter: "drop-shadow(0 0 30px rgba(255,0,0,0.3))",
            border: "1px solid rgba(255,0,0,0.5)",
            backgroundColor: "rgba(255,0,0,0.05)",
            duration: 0.1,
            repeat: 5,
            yoyo: true
        });

        // Step 2 -> 3
        tl.to(dashboardRef.current, { opacity: 0, scale: 0.9, y: -30, filter: 'blur(10px)', duration: 1 })
            .fromTo(restRef.current,
                { opacity: 0, scale: 1.1, y: 30, filter: 'blur(10px)' },
                { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1 }, "-=0.5");

        // Step 3 -> 4
        tl.to(restRef.current, { opacity: 0, scale: 0.95, filter: 'blur(10px)', duration: 1 })
            .fromTo(progressRef.current,
                { opacity: 0, scale: 0.8, rotate: -15 },
                { opacity: 1, scale: 1, rotate: 0, duration: 1 }, "-=0.5");

        // --- STAGGER STEPS TEXT ---
        steps.forEach((_, i) => {
            gsap.from(`#step-${i + 1} h3, #step-${i + 1} p`, {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: `#step-${i + 1}`,
                    start: "top 70%",
                    end: "top 30%",
                    scrub: true,
                }
            });
        });

        // Floating Animation
        gsap.to(".floating-element", {
            y: "-=20",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            stagger: 0.2
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={containerRef} className="relative w-full min-h-screen bg-black overflow-hidden border-t border-white/5 py-40">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-start">

                {/* Left Side: Steps Content */}
                <div ref={stepsRef} className="relative space-y-[60vh] pb-[60vh]">
                    {steps.map((step, i) => (
                        <div key={i} id={step.id} className="min-h-[40vh] py-20 flex flex-col justify-center">
                            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">0{i + 1} // system</span>
                            <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tighter mb-6 font-sans leading-tight">
                                {step.title}
                            </h3>
                            <p className="text-zinc-500 text-lg leading-relaxed max-w-sm font-light">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Right Side: Visual Morphing Container */}
                <div className="sticky top-[20vh] h-[60vh] flex items-center justify-center">
                    <div ref={rightSideRef} className="relative w-full max-w-[450px] aspect-square rounded-[40px] bg-[#09090b] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">

                        {/* Technical Grid Overlay */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(zinc-800 1px, transparent 1px), linear-gradient(90deg, zinc-800 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                        {/* STEP 1: AI Input */}
                        <div ref={inputRef} className="absolute inset-0 p-12 flex flex-col items-center justify-center space-y-8 z-10 transition-all">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center floating-element">
                                <Cpu className="w-8 h-8 text-indigo-400" />
                            </div>
                            <div className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
                                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2 opacity-50">Task Input</span>
                                <span ref={typingTextRef} className="text-zinc-200 text-sm font-sans leading-relaxed min-h-[1.5em] block">
                                    {/* Typed text appears here */}
                                </span>
                            </div>
                            <div className="w-full h-px bg-white/5" />
                            <div className="flex gap-2 w-full">
                                <div className="h-2 flex-1 bg-zinc-800/50 rounded-full" />
                                <div className="h-2 w-1/4 bg-indigo-500/30 rounded-full" />
                            </div>
                            {/* Inner soft glow for preparing */}
                            <div className="absolute inset-0 bg-indigo-500/[0.02] blur-3xl rounded-full" />
                        </div>

                        {/* STEP 2: Focus Dashboard */}
                        <div ref={dashboardRef} className="absolute inset-0 p-10 opacity-0 scale-90 flex flex-col items-center justify-center space-y-6 z-20">
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-4 animate-pulse">
                                <Activity className="w-3 h-3 text-red-500" />
                                <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest">Tracking Active</span>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-4">
                                <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 space-y-2">
                                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest">Efficiency</div>
                                    <div className="text-xl font-bold text-white tracking-tight">94.2%</div>
                                </div>
                                <div className="bg-zinc-900 border border-white/5 rounded-xl p-4 space-y-2">
                                    <div className="text-[8px] text-zinc-600 uppercase tracking-widest">Cognitive Load</div>
                                    <div className="text-xl font-bold text-zinc-400 tracking-tight">Critical</div>
                                </div>
                            </div>
                            <div className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-6 relative">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Neural Balance</span>
                                    <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
                                </div>
                                <div className="h-12 w-full bg-zinc-800 rounded-lg overflow-hidden flex items-end p-2 gap-1">
                                    {[20, 45, 30, 80, 50, 95, 70, 85].map((h, i) => (
                                        <div key={i} className="flex-1 bg-zinc-700 rounded-sm" style={{ height: `${h}%`, opacity: h > 80 ? 1 : 0.3 }} />
                                    ))}
                                </div>
                            </div>
                            <div className="text-[10px] text-red-500/80 font-bold uppercase tracking-[0.2em] animate-pulse">
                                Intervention Required
                            </div>
                        </div>

                        {/* STEP 3: Rest Mode */}
                        <div ref={restRef} className="absolute inset-0 p-12 opacity-0 flex flex-col items-center justify-center space-y-10 z-30">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-2 border-indigo-500/20 flex items-center justify-center">
                                    {/* Breathing Circle */}
                                    <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-500/40 animate-[ping_4s_ease-in-out_infinite]" />
                                    <Moon className="absolute w-8 h-8 text-indigo-400 floating-element" />
                                </div>
                                {/* Zen Orbits */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-indigo-500/5 rounded-full rotate-45" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full -rotate-12" />
                            </div>
                            <div className="text-center space-y-3">
                                <h4 className="text-xl font-medium text-white tracking-tight">Adaptive Neural Rest</h4>
                                <p className="text-zinc-500 text-xs tracking-wider uppercase leading-loose">
                                    Inhale // Hold // Exhale
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-1 w-12 bg-indigo-500/40 rounded-full" />
                                <div className="h-1 w-12 bg-zinc-800 rounded-full" />
                                <div className="h-1 w-12 bg-zinc-800 rounded-full" />
                            </div>
                        </div>

                        {/* STEP 4: Progress Circle */}
                        <div ref={progressRef} className="absolute inset-0 p-12 opacity-0 flex flex-col items-center justify-center space-y-8 z-40">
                            <div className="relative flex items-center justify-center">
                                <svg className="w-48 h-48 -rotate-90">
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-zinc-800" />
                                    <motion.circle
                                        cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="3" fill="transparent"
                                        className="text-indigo-500"
                                        strokeDasharray="552"
                                        initial={{ strokeDashoffset: 552 }}
                                        animate={{ strokeDashoffset: 0 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Zap className="w-10 h-10 text-indigo-400 mb-2" />
                                    <span className="text-2xl font-bold text-white tracking-tight">100%</span>
                                </div>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">Objective Reached</span>
                                </div>
                                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-medium leading-loose">
                                    Cognitive optimization complete. <br /> ready for phase 02.
                                </p>
                            </div>
                            {/* Reset Glow */}
                            <div className="absolute inset-0 bg-white/[0.01] animate-pulse" />
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};
