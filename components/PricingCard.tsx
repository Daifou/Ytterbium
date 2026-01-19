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
}

export const PricingCard: React.FC<PricingCardProps> = ({
    className = '',
    currentUser,
    isCompact = false,
    isAuthMode = false,
    onAuth
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
    };

    if (isCheckingOut && currentUser) {
        return (
            <div className={`relative w-full h-[600px] md:h-[680px] animate-in fade-in zoom-in duration-500 ease-out ${className}`}>
                <div className="relative w-full h-full bg-[#161617] border border-white/5 rounded-[24px] flex flex-col shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 p-5 z-50 flex justify-end pointer-events-none">
                        <button
                            onClick={() => setIsCheckingOut(false)}
                            className="pointer-events-auto text-zinc-500 hover:text-zinc-200 text-[11px] font-medium px-4 py-2 bg-zinc-900/50 rounded-full backdrop-blur-md border border-white/5 transition-all"
                        >
                            Back to options
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
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-[380px] mx-auto ${className}`}
            >
                <div className="relative rounded-[32px] bg-[#161617] border border-white/5 shadow-2xl overflow-hidden">
                    <div className="p-8 pb-10 flex flex-col">
                        <div className="mb-10 text-center">
                            <h2 className="text-[24px] font-semibold text-zinc-100 tracking-tight mb-2">Pro Access</h2>
                            <p className="text-[14px] text-zinc-500 leading-relaxed font-normal">
                                Professional cognitive optimization.
                            </p>
                        </div>

                        <div className="space-y-3 mb-10">
                            <button
                                onClick={() => setSelectedPlan('monthly')}
                                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${selectedPlan === 'monthly'
                                    ? 'bg-zinc-800/40 border-zinc-700/50 ring-1 ring-white/5 shadow-inner'
                                    : 'bg-transparent border-white/5 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div>
                                    <span className={`block text-[14px] font-medium ${selectedPlan === 'monthly' ? 'text-zinc-100' : 'text-zinc-400'}`}>Monthly access</span>
                                    <span className="text-[11px] text-zinc-500 font-normal">Renewal every 30 days</span>
                                </div>
                                <div className="text-right">
                                    <span className={`block text-[18px] font-semibold ${selectedPlan === 'monthly' ? 'text-zinc-100' : 'text-zinc-400'}`}>$5</span>
                                    <span className="text-[11px] text-zinc-500 font-normal">per month</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setSelectedPlan('lifetime')}
                                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${selectedPlan === 'lifetime'
                                    ? 'bg-zinc-800/40 border-zinc-700/50 ring-1 ring-white/5 shadow-inner'
                                    : 'bg-transparent border-white/5 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-[14px] font-medium ${selectedPlan === 'lifetime' ? 'text-zinc-100' : 'text-zinc-400'}`}>Lifetime access</span>
                                        <span className="text-[9px] font-bold text-zinc-950 bg-zinc-200 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Better Value</span>
                                    </div>
                                    <span className="text-[11px] text-zinc-500 font-normal">Pay once, own forever</span>
                                </div>
                                <div className="text-right">
                                    <span className={`block text-[18px] font-semibold ${selectedPlan === 'lifetime' ? 'text-zinc-100' : 'text-zinc-400'}`}>$100</span>
                                </div>
                            </button>
                        </div>

                        <div className="space-y-4 mb-10 px-1">
                            {[
                                "Full access to focus environment",
                                "Zero Eye Strain & Fatigue metrics",
                                "Unlimited session history",
                                "Continuous neural optimization"
                            ].map((f, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                    <span className="text-[13px] text-zinc-400 font-medium tracking-tight leading-none">{f}</span>
                                </div>
                            ))}
                        </div>

                        <motion.button
                            onClick={handleCheckout}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-4.5 rounded-2xl bg-zinc-100 text-zinc-950 font-semibold text-[15px] shadow-sm hover:bg-white transition-all mb-5 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                            ) : (
                                <>Continue to {selectedPlan === 'lifetime' ? 'Lifetime' : 'Checkout'}</>
                            )}
                        </motion.button>

                        <div className="text-center opacity-40 hover:opacity-100 transition-opacity">
                            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">
                                Secured by Whop • Professional billing system
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
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-5xl mx-auto ${className}`}
        >
            <div className={`relative group rounded-[32px] bg-[#161617] border border-white/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden grid md:grid-cols-2 gap-0 divide-x divide-white/5 transition-all duration-700 hover:border-white/10`}>

                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.015] to-orange-500/[0.01] pointer-events-none" />

                {/* Left Panel */}
                <div className="relative p-10 md:p-14 flex flex-col h-full justify-between min-h-[550px]">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <span className="text-zinc-500 text-[11px] font-semibold tracking-[0.2em] uppercase">Professional Access</span>
                        </div>
                        <h3 className="text-5xl font-semibold text-zinc-100 tracking-tighter mb-6">Pro Environment</h3>
                        <p className="text-zinc-500 text-[16px] leading-relaxed max-w-[340px] font-normal">
                            Professional cognitive optimization, powered by AI. <br />Join 1,200+ high-performers.
                        </p>
                    </div>

                    <div className="w-full">
                        <div className="flex flex-col gap-3 mb-8">
                            <button
                                onClick={() => setSelectedPlan('monthly')}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${selectedPlan === 'monthly' ? 'bg-zinc-800/40 border-zinc-700 shadow-inner' : 'border-white/5 hover:bg-white/[0.02]'}`}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="text-zinc-100 font-medium text-[15px]">Monthly access</span>
                                    <span className="text-zinc-500 text-[11px]">Renewal every 30 days</span>
                                </div>
                                <span className="text-zinc-100 font-bold text-[22px] tracking-tight">$5</span>
                            </button>
                            <button
                                onClick={() => setSelectedPlan('lifetime')}
                                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${selectedPlan === 'lifetime' ? 'bg-zinc-800/40 border-zinc-700 shadow-inner' : 'border-white/5 hover:bg-white/[0.02]'}`}
                            >
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-zinc-100 font-medium text-[15px]">Lifetime access</span>
                                        <span className="text-[9px] font-bold text-zinc-950 bg-zinc-200 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Better Value</span>
                                    </div>
                                    <span className="text-zinc-500 text-[11px]">One-time payment</span>
                                </div>
                                <span className="text-zinc-100 font-bold text-[22px] tracking-tight">$100</span>
                            </button>
                        </div>

                        <motion.button
                            onClick={handleCheckout}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-5 rounded-2xl bg-zinc-100 text-zinc-950 font-semibold text-[16px] tracking-tight hover:bg-white transition-colors shadow-lg"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin mx-auto" />
                            ) : (
                                <>Get Started with Pro</>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="relative p-10 md:p-14 bg-zinc-900/5 flex flex-col justify-center">
                    <div className="space-y-10">
                        {[
                            { title: "Zero Eye Strain", desc: "No more dryness, blurs, or end-of-day fatigue." },
                            { title: "Gamer Posture Correction", desc: "AI-driven real-time posture optimization." },
                            { title: "Cortisol Management", desc: "Protect your biological health while you work." },
                            { title: "Deep Restoration", desc: "Guided cognitive breaks that actually refuel." }
                        ].map((item, i) => (
                            <div key={i} className="group flex gap-6 items-start">
                                <div className="mt-1 w-5 h-5 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/50 text-zinc-600 transition-colors group-hover:text-zinc-200 group-hover:border-zinc-700">
                                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-zinc-100 text-[15px] font-semibold leading-none mb-2.5">{item.title}</h4>
                                    <p className="text-zinc-500 text-[14px] leading-relaxed max-w-[300px] font-normal">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-14 pt-10 border-t border-white/5 flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-[#161617]" />
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-zinc-300 text-[12px] font-semibold">Join 1,200+ Performers</span>
                            <span className="text-zinc-600 text-[11px] font-normal">Optimizing cognitive capital</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center opacity-30 hover:opacity-100 transition-opacity">
                <p className="text-[11px] text-zinc-500 tracking-tight">Professional environment for professionals • Secure via Whop</p>
            </div>
        </motion.div>
    );
};
