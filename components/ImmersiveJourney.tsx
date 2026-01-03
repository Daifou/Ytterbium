import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { supabase, getRedirectUrl } from '../services/supabase';
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
        <div className={`relative w-full h-screen ${step === 7 ? 'bg-white' : 'bg-[#F9F7F2]'} text-[#1a1a1a] overflow-hidden selection:bg-[#2F4F4F] font-sans transition-colors duration-1000`}>
            {/* Grain Overlay */}
            <div className={`fixed inset-0 pointer-events-none z-50 mix-blend-multiply transition-opacity duration-1000 ${step === 7 ? 'opacity-0' : 'opacity-[0.05]'}`}
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
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        // If we have a user and they selected a plan previously (persisted), we might want to trigger checkout
        // But this is likely handled in App.tsx or we handle it here if they are still on this screen
        if (currentUser && selectedPlan) {
            const checkoutUrl = `/api/checkout?user_id=${encodeURIComponent(currentUser.id)}&plan=${selectedPlan}`;
            window.location.href = checkoutUrl;
        }
    }, [currentUser, selectedPlan]);

    const handlePlanSelect = (plan: 'monthly' | 'annual') => {
        console.log("Saving plan to localStorage:", plan);
        setSelectedPlan(plan);
        setShowError(false);
        localStorage.setItem('pending_plan', plan);

        // If already logged in, go to checkout immediately
        if (currentUser) {
            console.log("User already logged in, redirecting to checkout");
            const checkoutUrl = `/api/checkout?user_id=${encodeURIComponent(currentUser.id)}&plan=${plan}`;
            window.location.href = checkoutUrl;
        }
    };

    const handleGoogleSignUp = async () => {
        if (!selectedPlan) {
            setShowError(true);
            // Shake effect or toast could go here
            return;
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: getRedirectUrl() }
        });
        if (error) console.error("Google Auth Error:", error);
    };

    const handleLogin = async () => {
        // Login doesn't necessarily require a plan selection, but if they are here, maybe they want to sync?
        // Prompt says "new user... choose plan... sign up". 
        // Returning paid user shouldn't be here (Immersive Journey is skipped).
        // Returning free user might be here.
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: getRedirectUrl() }
        });
        if (error) console.error("Google Auth Error:", error);
    };

    if (loading) return <div className="flex items-center justify-center h-full font-mono text-black">CALIBRATING...</div>;

    if (isPremium) {
        return (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white text-black">
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
            className="absolute inset-0 flex flex-col md:flex-row bg-white text-black overflow-hidden"
        >
            {/* Left Side: Pricing */}
            <div className="flex-1 flex flex-col justify-center items-center p-12 lg:p-24 border-b md:border-b-0 md:border-r border-black/5 bg-[#FDFDFD]">
                <div className="w-full max-w-md space-y-12">
                    <div className="space-y-4">
                        <span className="font-mono text-[10px] tracking-[0.4em] text-black/40 uppercase">Economic selection</span>
                        <h3 className="font-instrument text-5xl md:text-6xl font-medium tracking-tight">Choose your <br /> resonance.</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Annual Plan */}
                        <button
                            onClick={() => handlePlanSelect('annual')}
                            className={`w-full p-8 border ${selectedPlan === 'annual' ? 'border-black bg-black text-white' : 'border-black/10 hover:bg-black hover:text-white'} rounded-[32px] flex flex-col gap-1 group transition-all duration-500 text-left relative overflow-hidden`}
                        >
                            <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${selectedPlan === 'annual' ? 'opacity-60' : 'opacity-40 group-hover:opacity-60'}`}>Elite / Annual</span>
                            <div className="flex items-baseline justify-between">
                                <span className="font-instrument text-4xl font-bold">$12</span>
                                <span className={`font-mono text-[11px] ${selectedPlan === 'annual' ? 'opacity-60' : 'opacity-40 group-hover:opacity-60'} italic`}>/ 12 MONTHS</span>
                            </div>
                            <div className={`mt-4 flex items-center gap-2 font-mono text-[10px] tracking-widest ${selectedPlan === 'annual' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`}>
                                <span>■ SECURE PROTOCOL</span>
                            </div>
                        </button>

                        {/* Monthly Plan */}
                        <button
                            onClick={() => handlePlanSelect('monthly')}
                            className={`w-full p-8 border ${selectedPlan === 'monthly' ? 'border-black bg-black text-white' : 'border-black/10 hover:bg-black hover:text-white'} rounded-[32px] flex flex-col gap-1 group transition-all duration-500 text-left`}
                        >
                            <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${selectedPlan === 'monthly' ? 'opacity-60' : 'opacity-40 group-hover:opacity-60'}`}>Base / Monthly</span>
                            <div className="flex items-baseline justify-between">
                                <span className="font-instrument text-4xl font-bold">$5</span>
                                <span className={`font-mono text-[11px] ${selectedPlan === 'monthly' ? 'opacity-60' : 'opacity-40 group-hover:opacity-60'} italic`}>/ MONTHLY</span>
                            </div>
                            <div className={`mt-4 flex items-center gap-2 font-mono text-[10px] tracking-widest ${selectedPlan === 'monthly' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`}>
                                <span>□ STANDARD GAIN</span>
                            </div>
                        </button>
                    </div>

                    <p className={`font-instrument text-sm ${showError ? 'text-red-500' : 'text-[#8a8a8a]'} italic transition-colors duration-300`}>
                        {showError ? "Choose the plan first." : "Select a plan to synchronize your neural architecture."}
                    </p>
                </div>
            </div>

            {/* Right Side: Auth (Matching Screenshot) */}
            <div className="flex-1 flex flex-col justify-center items-center p-12 lg:p-24 bg-white">
                <div className="w-full max-w-[360px] flex flex-col items-center text-center">
                    <h2 className="font-instrument text-5xl font-medium tracking-tight mb-2">Ytterbium</h2>
                    <p className="font-instrument text-lg text-[#8a8a8a] mb-16 italic">Automate your health.</p>

                    <div className="w-full space-y-4">
                        {/* Google Sign Up */}
                        <button
                            onClick={handleGoogleSignUp}
                            className="w-full h-[58px] bg-black text-white rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.545,11.071L12,11.071L12,12.929L15.636,12.929C15.111,15.111 13.555,16.555 12,16.555C9.485,16.555 7.445,14.515 7.445,12C7.445,9.485 9.485,7.445 12,7.445C13.2,7.445 14.155,7.889 14.777,8.555L16.222,7.111C15.155,6.111 13.666,5.555 12,5.555C8.445,5.555 8.445,8.445 12,12C5.555,15.555 8.445,18.445 12,18.445C16.889,18.445 20,15.111 20,12C20,11.111 19.889,10.222 19.666,9.445L12,9.445L12,11.071L12.545,11.071Z" />
                            </svg>
                            <span className="font-bold text-[15px]">Sign up</span>
                        </button>

                        <div className="flex items-center py-2">
                            <div className="flex-1 h-[1px] bg-black/5" />
                            <span className="px-4 font-mono text-[10px] text-black/40">or</span>
                            <div className="flex-1 h-[1px] bg-black/5" />
                        </div>

                        {/* Log In */}
                        <button
                            onClick={handleLogin}
                            className="w-full h-[58px] border border-black/10 text-black rounded-full flex items-center justify-center font-bold text-[15px] hover:bg-black/5 hover:border-black transition-all duration-300"
                        >
                            Log in
                        </button>
                    </div>

                    {/* Legal Footer */}
                    <div className="mt-12 text-[10px] text-black/40 leading-relaxed font-sans">
                        By signing up you agree to our<br />
                        <button className="underline hover:text-black">Privacy Policy</button> and <button className="underline hover:text-black">Terms of Service</button>.
                    </div>

                    <div className="mt-auto pt-24">
                        <p className="font-instrument text-sm text-black/40 italic">
                            by <span className="underline cursor-pointer hover:text-black transition-colors">The General Intelligence Company</span>
                        </p>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};
