import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabase';
import { User } from '@supabase/supabase-js';
import { useSubscription } from '../hooks/useSubscription';


interface ImmersiveJourneyProps {
    onComplete: () => void;
    onAuthRequired: () => void;
    currentUser: User | null;
}

export const ImmersiveJourney: React.FC<ImmersiveJourneyProps> = ({ onComplete, onAuthRequired, currentUser }) => {


    const [step, setStep] = useState(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const nextStep = () => setStep((prev) => prev + 1);

    const protocols = [
        { label: "SOLUTION 1", name: "Non-Invasive Vagus Nerve Stimulation Protocol", type: "NEURAL", color: "hover:bg-[#00FFFF] hover:text-black" },
        { label: "SOLUTION 2", name: "Deep Tissue Decalcification & Spinal Reset", type: "PHYSICAL", color: "hover:bg-[#FF00FF] hover:text-black" },
        { label: "SOLUTION 3", name: "Retinal Frequency Calibration & Blue Light Rejection", type: "OCULAR", color: "hover:bg-[#CCFF00] hover:text-black" },
        { label: "SOLUTION 4", name: "Dopamine Receptor Resensitization Framework", type: "COGNITIVE", color: "hover:bg-[#FF3300] hover:text-white" },
        { label: "SOLUTION 5", name: "Neural Plasticity Enhancement through Ultradian Rhythms", type: "SYSTEMS", color: "hover:bg-[#7000FF] hover:text-white" },
        { label: "SOLUTION 6", name: "Circadian Thermal Regulation & Sleep Architecture", type: "BIOLOGIC", color: "hover:bg-[#00FF66] hover:text-black" },
        { label: "SOLUTION 7", name: "Cortisol Management via Bio-Feedback AI Integration", type: "HORMONAL", color: "hover:bg-[#FF9900] hover:text-black" },
    ];

    const benefits = [
        { title: "Income Increase", category: "FINANCIAL", subCategory: "optimization", desc: "Monetary growth" },
        { title: "Stress Decrease", category: "NEURAL", subCategory: "CORTISOL", desc: "Stress suppression" },
        { title: "Sleep Better", category: "BIOLOGIC", subCategory: "REM CYCLE", desc: "Deep restoration" },
        { title: "Better Posture", category: "PHYSICAL", subCategory: "SPINAL", desc: "Alignment reset" },
        { title: "Healthy Eyes", category: "OCULAR", subCategory: "RETINAL", desc: "Vision clarity" },
        { title: "Work Smarter", category: "SYSTEMIC", subCategory: "EFFICIENCY", desc: "Weeks into hours" },
        { title: "Neural Silence", category: "COGNITIVE", subCategory: "ZENITH", desc: "Zero brain fog" },
        { title: "Age Reverse", category: "CELLULAR", subCategory: "TELOMERE", desc: "Biological youth" },
    ];

    return (
        <div className="relative w-full h-screen bg-[#F9F7F2] text-[#1a1a1a] overflow-hidden selection:bg-[#2F4F4F] font-sans">
            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-multiply"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            <AnimatePresence mode="wait">
                {/* Steps 0-5 remain identical */}
                {step === 0 && (
                    <motion.section key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 1.2 }} className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <h1 className="font-instrument text-[8rem] md:text-[13rem] lg:text-[16rem] tracking-[-0.06em] leading-[0.75]">
                            You are losing <br /> your sight.
                        </h1>
                    </motion.section>
                )}

                {step === 1 && (
                    <motion.section key="s1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 1.2 }} className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <div className="max-w-6xl">
                            <h2 className="font-instrument text-[4rem] md:text-[7rem] lg:text-[9rem] tracking-[-0.04em] leading-[0.85] mb-12">
                                Your posture is broken. <br /> Your hormones are dead.
                            </h2>
                            <h3 className="font-instrument text-4xl md:text-6xl text-[#8a8a8a] tracking-tight">
                                Your brain is no longer yours.
                            </h3>
                        </div>
                    </motion.section>
                )}

                {step === 2 && (
                    <motion.section key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0 flex items-center justify-center p-6">
                        <div className="flex items-center gap-8 md:gap-16">
                            <div className="border-2 border-black rounded-[40px] px-10 py-16 md:px-16 md:py-24 text-center">
                                <h2 className="font-instrument text-5xl md:text-7xl font-bold leading-tight">
                                    You sleep <br /> 8 hours
                                </h2>
                            </div>
                            <span className="font-instrument text-6xl md:text-8xl font-light">+</span>
                            <div className="border-2 border-black rounded-[40px] px-10 py-16 md:px-16 md:py-24 text-center">
                                <h2 className="font-instrument text-5xl md:text-7xl font-bold leading-tight">
                                    You work <br /> 12 hours
                                </h2>
                            </div>
                        </div>
                    </motion.section>
                )}

                {step === 3 && (
                    <motion.section key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 1.2 }} className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <div className="max-w-6xl">
                            <p className="font-instrument text-[2rem] md:text-[3.2rem] text-[#8a8a8a] tracking-tight italic font-light mb-4">
                                If you live to 70, you only spend
                            </p>
                            <p className="font-instrument text-[2.2rem] md:text-[3.8rem] tracking-tight">
                                <span className="text-[#1a1a1a] font-medium">14 years</span> <span className="text-[#8a8a8a] italic font-light">actually awake for yourself.</span>
                            </p>
                        </div>
                    </motion.section>
                )}

                {step === 4 && (
                    <motion.section key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 flex items-center justify-center p-6 text-center">
                        <div className="max-w-4xl">
                            <span className="block font-mono text-sm tracking-[0.5em] text-[#8a8a8a] mb-8 uppercase">The Protocol</span>
                            <h1 className="font-instrument text-7xl md:text-[10rem] tracking-[-0.04em] leading-[0.9]">
                                Ytterbium is <br /> the solution.
                            </h1>
                        </div>
                    </motion.section>
                )}

                {step === 5 && (
                    <motion.section key="s5" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 1 }} className="absolute inset-0 flex items-center justify-center p-6 md:p-12 overflow-hidden">
                        <div className="w-full max-w-[1300px] h-[85vh] flex flex-col">
                            <div className="grid grid-cols-12 py-3 border-b border-black font-mono text-[11px] tracking-widest text-black/60 uppercase">
                                <div className="col-span-2">/ SOLUTIONS WE OFFER</div>
                                <div className="col-span-8 px-4">/ PROTOCOL NAME</div>
                                <div className="col-span-2 text-right">/ CLASSIFICATION</div>
                            </div>
                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                {protocols.map((row, i) => (
                                    <div key={i} className={`grid grid - cols - 12 py - 7 border - b border - black items - center group transition - all duration - 300 cursor - crosshair ${row.color} `}>
                                        <div className="col-span-2 font-mono text-sm tracking-tighter pl-2 flex items-center gap-2">
                                            <span className="text-[8px]">■</span> {row.label}
                                        </div>
                                        <div className="col-span-8 px-4 font-instrument text-3xl md:text-5xl tracking-tight leading-none transition-transform duration-300 group-hover:translate-x-2 font-medium uppercase">
                                            {row.name}
                                        </div>
                                        <div className="col-span-2 text-right pr-2 flex justify-end items-center gap-8">
                                            <span className="font-mono text-[11px] border border-current px-3 py-1 bg-transparent transition-colors uppercase rounded-sm">
                                                {row.type}
                                            </span>
                                            <span className="text-xl font-light opacity-30 group-hover:opacity-100">+</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* Step 6 remains with 8 benefits and no grid */}
                {step === 6 && (
                    <motion.section key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <div className="relative z-10 w-full max-w-6xl">
                            <motion.h2
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="font-instrument text-2xl md:text-3xl italic text-[#8a8a8a] mb-16 text-center font-light tracking-tight"
                            >
                                In simple language
                            </motion.h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 w-full">
                                {benefits.map((b, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex flex-col text-left group cursor-default"
                                    >
                                        <h3 className="font-instrument text-3xl md:text-4xl font-bold tracking-tighter leading-none mb-1">
                                            {b.title}
                                        </h3>
                                        <div className="flex flex-col font-mono text-[11px] tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                                            <span>{b.category}</span>
                                            <span className="mt-[-2px]">{b.subCategory}</span>
                                            <span className="mt-1 normal-case tracking-normal font-sans italic opacity-80">{b.desc}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* STEP 7 - CLEAN PRICING ONLY */}
                {step === 7 && <PricingStep onComplete={onComplete} onAuthRequired={onAuthRequired} currentUser={currentUser} />}



            </AnimatePresence>

            {step < 7 && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[60]">
                    <motion.button onClick={nextStep} className="w-12 h-12 rounded-full bg-[#1a1a1a] text-[#F9F7F2] flex items-center justify-center hover:scale-110 active:scale-90 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    </motion.button>
                </div>
            )}
        </div>
    );
};

const PricingStep: React.FC<{ onComplete: () => void; onAuthRequired: () => void; currentUser: User | null }> = ({ onComplete, onAuthRequired, currentUser }) => {
    const { isPremium, loading } = useSubscription();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Watchdog: If user authenticates while we were in an "isAuthenticating" state,
    // trigger the checkout redirect automatically.
    useEffect(() => {
        if (currentUser && isAuthenticating) {
            console.log(`[JOURNEY] Auto - redirecting user ${currentUser.id} to checkout...`);
            setIsAuthenticating(false);
            const checkoutUrl = `/api/checkout?user_id=${encodeURIComponent(currentUser.id)}`;
            window.location.href = checkoutUrl;
        }
    }, [currentUser, isAuthenticating]);

    const handlePurchase = async () => {


        console.log("[JOURNEY] Initiating purchase check...");
        const { data: { user } } = await supabase.auth.getUser();

        if (!currentUser) {
            console.warn("[JOURNEY] No user found. Triggering auth requirement.");
            setIsAuthenticating(true);
            onAuthRequired(); // Trigger the global auth modal
            return;
        }

        console.log(`[JOURNEY] User found: ${currentUser.id}. Redirecting to checkout...`);
        const checkoutUrl = `/api/checkout?user_id=${encodeURIComponent(currentUser.id)}`;
        window.location.href = checkoutUrl;
    };




    if (loading) return <div className="flex items-center justify-center h-full font-mono">CALIBRATING...</div>;

    if (isPremium) {
        return (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="font-instrument text-6xl mb-8">Access Granted.</h3>
                <p className="font-instrument text-xl text-[#8a8a8a] mb-12">Your profile is already synced with the Ytterbium protocol.</p>
                <button onClick={onComplete} className="px-12 py-4 bg-black text-white rounded-full font-mono text-sm tracking-widest uppercase hover:scale-105 transition-transform">
                    Enter System
                </button>
            </motion.section>
        );
    }

    return (
        <motion.section
            key="s7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8"
        >
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: `
linear - gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear - gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `,
                    backgroundSize: '20px 20px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)'
                }}
            />

            <div className="text-center mb-10 relative z-10 uppercase">
                <h3 className="font-instrument text-6xl md:text-8xl font-medium tracking-tight mb-2">
                    Ytterbium sky
                </h3>
                <p className="font-instrument text-xl italic text-[#8a8a8a]">
                    Secure your architectural reset.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl border-[1.5px] border-black rounded-[60px] relative flex h-48 md:h-64 overflow-hidden mb-12 z-10 shadow-xl">
                <div className="absolute inset-0 flex justify-center pointer-events-none z-20">
                    <svg width="80" height="100%" viewBox="0 0 80 200" preserveAspectRatio="none" className="h-full stroke-black stroke-[1] fill-none">
                        <path d="M50 0 C30 60, 50 140, 30 200" />
                    </svg>
                </div>

                <button
                    onClick={handlePurchase}
                    className="flex-1 flex flex-col items-center justify-center group hover:bg-black transition-all duration-500 relative z-10"
                >
                    <span className="font-mono text-[10px] tracking-[0.4em] text-black/40 group-hover:text-white/60 mb-2 uppercase">Annual</span>
                    <div className="flex items-baseline group-hover:text-white">
                        <span className="font-instrument text-5xl md:text-7xl font-bold">$12</span>
                        <span className="font-instrument text-lg md:text-xl italic ml-1 opacity-60">/year</span>
                    </div>
                </button>

                <button
                    onClick={handlePurchase}
                    className="flex-1 flex flex-col items-center justify-center group hover:bg-black transition-all duration-500 relative z-10"
                >
                    <span className="font-mono text-[10px] tracking-[0.4em] text-black/40 group-hover:text-white/60 mb-2 uppercase">Monthly</span>
                    <div className="flex items-baseline group-hover:text-white">
                        <span className="font-instrument text-5xl md:text-7xl font-bold">$5</span>
                        <span className="font-instrument text-lg md:text-xl italic ml-1 opacity-60">/month</span>
                    </div>
                </button>
            </div>

            {isAuthenticating && (
                <div className="relative z-20 mt-4 flex flex-col items-center gap-4">
                    <div className="font-mono text-xs text-red-500 animate-pulse">
                        AUTHENTICATION REQUIRED TO SECURE PROTOCOL
                    </div>
                    <button
                        onClick={onAuthRequired}
                        className="px-6 py-2 border border-black rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                    >
                        Sign In / Create Account
                    </button>
                </div>
            )}
        </motion.section>
    );
};

