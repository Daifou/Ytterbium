import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';
import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { authService } from '../services/authService';

interface PricingCardProps {
    className?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    currentUser?: User | null;
    onAuthRequired?: () => void;
    isCompact?: boolean;
    isAuthMode?: boolean;
    onAuth?: (isLifetime: boolean) => void;
    onCheckoutStateChange?: (isCheckingOut: boolean) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
    className = '',
    currentUser,
    isCompact = false,
    isAuthMode = false,
    onAuth,
    onCheckoutStateChange
}) => {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('monthly');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(() => {
        if (typeof window !== 'undefined' && currentUser) {
            return !!localStorage.getItem('pending_plan');
        }
        return false;
    });

    const PLAN_IDS = {
        monthly: 'plan_8CWnEKzsQpVQh',
        lifetime: 'plan_HuVT1w8USQWAY'
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const pendingPlan = localStorage.getItem('pending_plan');
        if (currentUser && pendingPlan) {
            setSelectedPlan(pendingPlan as any);
            setIsCheckingOut(true);
            localStorage.removeItem('pending_plan');
        }
    }, [currentUser]);

    const handleCheckout = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (isAuthMode && onAuth && !currentUser) {
            onAuth(selectedPlan === 'lifetime');
            return;
        }

        if (!currentUser) {
            setIsLoading(true);
            localStorage.setItem('pending_plan', selectedPlan);
            const { error } = await authService.signInWithGoogle();
            if (error) {
                console.error("Auth failed", error);
                setIsLoading(false);
            }
            return;
        }

        setIsCheckingOut(true);
        onCheckoutStateChange?.(true);
    };

    const handleBackFromCheckout = () => {
        setIsCheckingOut(false);
        onCheckoutStateChange?.(false);
    };

    if (isCheckingOut && currentUser) {
        return (
            <div className={`relative w-full h-[520px] md:h-[580px] animate-in fade-in zoom-in duration-500 ease-out ${className}`}>
                <div className="relative w-full h-full bg-[#0a0a0a] border border-zinc-800/50 rounded-[20px] flex flex-col shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 p-5 z-50 flex justify-end pointer-events-none">
                        <button
                            onClick={handleBackFromCheckout}
                            className="pointer-events-auto text-zinc-500 hover:text-zinc-200 text-[11px] font-medium px-4 py-2 bg-zinc-900/80 rounded-full backdrop-blur-md border border-zinc-800 transition-all hover:bg-zinc-800/80"
                        >
                            ← Back
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto pt-14 pb-4 scrollbar-hide">
                        <div className="px-4">
                            <WhopCheckoutEmbed
                                planId={PLAN_IDS[selectedPlan]}
                                returnUrl={window.location.origin + '/dashboard?checkout=success'}
                                email={currentUser?.email || undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isCompact) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-[420px] mx-auto ${className}`}
            >
                <div className="relative rounded-[24px] bg-[#0a0a0a] border border-zinc-800/60 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00]/[0.02] via-transparent to-transparent pointer-events-none" />

                    <div className="relative p-8 pb-9 flex flex-col">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h2 className="text-[22px] font-semibold text-white tracking-tight mb-2">Unlock Full Access</h2>
                            <p className="text-[13px] text-zinc-500 leading-relaxed font-normal">
                                Professional cognitive optimization
                            </p>
                        </div>

                        {/* Plan Options */}
                        <div className="space-y-2.5 mb-8">
                            <button
                                onClick={() => setSelectedPlan('monthly')}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${selectedPlan === 'monthly'
                                        ? 'bg-zinc-900/60 border-[#FF4D00]/30 shadow-[0_0_0_1px_#FF4D00/10_inset]'
                                        : 'bg-transparent border-zinc-800/50 hover:border-zinc-700/60 hover:bg-zinc-900/20'
                                    }`}
                            >
                                <div>
                                    <span className={`block text-[14px] font-medium mb-0.5 ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                        Monthly
                                    </span>
                                    <span className="text-[11px] text-zinc-600 font-normal">Billed monthly</span>
                                </div>
                                <div className="text-right">
                                    <span className={`block text-[20px] font-semibold tracking-tight ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                        $5
                                    </span>
                                </div>
                            </button>

                            <button
                                onClick={() => setSelectedPlan('lifetime')}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${selectedPlan === 'lifetime'
                                        ? 'bg-zinc-900/60 border-[#FF4D00]/30 shadow-[0_0_0_1px_#FF4D00/10_inset]'
                                        : 'bg-transparent border-zinc-800/50 hover:border-zinc-700/60 hover:bg-zinc-900/20'
                                    }`}
                            >
                                {/* Best Value badge */}
                                <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-[#FF4D00] rounded-bl-lg rounded-tr-[10px]">
                                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Best Value</span>
                                </div>
                                <div>
                                    <span className={`block text-[14px] font-medium mb-0.5 ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                        Lifetime
                                    </span>
                                    <span className="text-[11px] text-zinc-600 font-normal">One-time payment</span>
                                </div>
                                <div className="text-right">
                                    <span className={`block text-[20px] font-semibold tracking-tight ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                        $30
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            onClick={handleCheckout}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full h-[56px] rounded-xl bg-[#FF4D00] text-white font-semibold text-[15px] shadow-[0_0_0_1px_rgba(255,77,0,0.3)_inset,0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(255,77,0,0.3),0_0_0_1px_rgba(255,77,0,0.5)_inset] transition-all mb-5 flex items-center justify-center gap-2 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="relative z-10">Continue to Checkout</span>
                            )}
                        </motion.button>

                        {/* Trust badge */}
                        <div className="text-center">
                            <p className="text-[11px] text-zinc-600 font-medium">
                                Secure checkout powered by Whop
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-5xl mx-auto ${className}`}
        >
            <div className="relative group rounded-[28px] bg-[#0a0a0a] border border-zinc-800/60 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] overflow-hidden grid md:grid-cols-2 gap-0 divide-x divide-zinc-800/50 transition-all duration-700 hover:border-zinc-700/60">

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00]/[0.015] via-transparent to-transparent pointer-events-none" />

                {/* Left Panel - Plan Selection */}
                <div className="relative p-10 md:p-12 flex flex-col h-full justify-between min-h-[580px]">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
                            <span className="text-zinc-500 text-[11px] font-medium tracking-[0.15em] uppercase">Pro Access</span>
                        </div>
                        <h3 className="text-[42px] font-semibold text-white tracking-tighter leading-none mb-5">Pro Environment</h3>
                        <p className="text-zinc-500 text-[15px] leading-relaxed max-w-[340px] font-normal">
                            AI-powered cognitive optimization. <br />Join 1,200+ high-performers.
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-col gap-2.5 mb-7">
                            <button
                                onClick={() => setSelectedPlan('monthly')}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group ${selectedPlan === 'monthly'
                                        ? 'bg-zinc-900/60 border-[#FF4D00]/30 shadow-[0_0_0_1px_#FF4D00/10_inset]'
                                        : 'border-zinc-800/50 hover:border-zinc-700/60 hover:bg-zinc-900/20'
                                    }`}
                            >
                                <div className="flex flex-col items-start">
                                    <span className={`font-medium text-[15px] mb-0.5 ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>Monthly Access</span>
                                    <span className="text-zinc-600 text-[11px]">Billed monthly</span>
                                </div>
                                <span className={`font-semibold text-[22px] tracking-tight ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>$5</span>
                            </button>

                            <button
                                onClick={() => setSelectedPlan('lifetime')}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${selectedPlan === 'lifetime'
                                        ? 'bg-zinc-900/60 border-[#FF4D00]/30 shadow-[0_0_0_1px_#FF4D00/10_inset]'
                                        : 'border-zinc-800/50 hover:border-zinc-700/60 hover:bg-zinc-900/20'
                                    }`}
                            >
                                <div className="absolute -top-1 -right-1 px-2.5 py-0.5 bg-[#FF4D00] rounded-bl-lg rounded-tr-[10px]">
                                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Best Value</span>
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className={`font-medium text-[15px] mb-0.5 ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>Lifetime Access</span>
                                    <span className="text-zinc-600 text-[11px]">One-time payment</span>
                                </div>
                                <span className={`font-semibold text-[22px] tracking-tight ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>$30</span>
                            </button>
                        </div>

                        <motion.button
                            onClick={handleCheckout}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full h-[62px] rounded-xl bg-[#FF4D00] text-white font-semibold text-[16px] tracking-tight shadow-[0_0_0_1px_rgba(255,77,0,0.3)_inset,0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,77,0,0.35),0_0_0_1px_rgba(255,77,0,0.5)_inset] transition-all flex items-center justify-center relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </span>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Right Panel - Features */}
                <div className="relative p-10 md:p-12 bg-zinc-900/10 flex flex-col justify-center">
                    <div className="space-y-8">
                        {[
                            { title: "Zero Eye Strain", desc: "Eliminate dryness and end-of-day fatigue" },
                            { title: "Posture Optimization", desc: "Real-time AI-driven corrections" },
                            { title: "Cortisol Management", desc: "Protect biological health while working" },
                            { title: "Deep Restoration", desc: "Guided breaks that actually refuel" }
                        ].map((item, i) => (
                            <div key={i} className="group flex gap-5 items-start">
                                <div className="mt-0.5 w-5 h-5 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/50 text-zinc-600 transition-all duration-300 group-hover:text-[#FF4D00] group-hover:border-[#FF4D00]/30">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-white text-[15px] font-semibold leading-none mb-2">{item.title}</h4>
                                    <p className="text-zinc-500 text-[13px] leading-relaxed max-w-[280px] font-normal">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-zinc-800/50 flex items-center gap-4">
                        <div className="flex -space-x-2.5">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-[#0a0a0a]" />
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-zinc-300 text-[12px] font-semibold">1,200+ Performers</span>
                            <span className="text-zinc-600 text-[11px] font-normal">Optimizing daily</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 text-center opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[11px] text-zinc-600 tracking-tight">Secure checkout powered by Whop</p>
            </div>
        </motion.div>
    );
};
