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
                <div className="relative w-full h-full bg-white/[0.02] border border-white/[0.08] rounded-3xl flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 left-0 p-5 z-50 flex justify-end pointer-events-none">
                        <button
                            onClick={handleBackFromCheckout}
                            className="pointer-events-auto text-zinc-400 hover:text-white text-[11px] font-medium px-4 py-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10 transition-all hover:bg-white/10"
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
        // Calculate trial dates
        const today = new Date();
        const reminderDate = new Date(today);
        reminderDate.setDate(today.getDate() + 5);
        const trialEndDate = new Date(today);
        trialEndDate.setDate(today.getDate() + 7);

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full max-w-[800px] mx-auto ${className}`}
            >
                <div className="relative rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="grid md:grid-cols-[280px_1fr] gap-0">
                        {/* Left: Timeline */}
                        <div className="p-8 border-r border-white/[0.08] bg-white/[0.01]">
                            <div className="mb-8">
                                <h2 className="text-[19px] font-semibold text-white tracking-tight mb-2">
                                    Try Ytterbium Free
                                </h2>
                                <p className="text-[13px] text-zinc-400">
                                    Free 7-day trial • Cancel anytime
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-6 relative">
                                {/* Connecting line */}
                                <div className="absolute left-[11px] top-8 bottom-8 w-[2px] bg-white/10" />

                                {/* Step 1 */}
                                <div className="relative flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-semibold text-white mb-1">Today: Choose plan</div>
                                        <div className="text-[11px] text-zinc-500">Monthly or lifetime</div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="relative flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="text-[10px] font-bold text-white">2</div>
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-semibold text-zinc-300 mb-1">Payment info</div>
                                        <div className="text-[11px] text-zinc-500">$0 now • Charged {formatDate(trialEndDate)}</div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="relative flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="text-[10px] font-bold text-white">3</div>
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-semibold text-zinc-300 mb-1">{formatDate(reminderDate)}: Reminder</div>
                                        <div className="text-[11px] text-zinc-500">2 days before trial ends</div>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="relative flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10">
                                        <div className="text-[10px] font-bold text-white">4</div>
                                    </div>
                                    <div>
                                        <div className="text-[13px] font-semibold text-zinc-300 mb-1">{formatDate(trialEndDate)}: Starts</div>
                                        <div className="text-[11px] text-zinc-500">Card charged</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Plans */}
                        <div className="p-8">
                            {/* Plan Selection */}
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => setSelectedPlan('monthly')}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${selectedPlan === 'monthly'
                                        ? 'bg-white/[0.06] border-white/20 shadow-lg'
                                        : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-white bg-white' : 'border-zinc-600'
                                            }`}>
                                            {selectedPlan === 'monthly' && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                                            )}
                                        </div>
                                        <div>
                                            <span className={`block text-[14px] font-medium ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                                Monthly
                                            </span>
                                            <span className="text-[11px] text-zinc-500">$5/mo after trial</span>
                                        </div>
                                    </div>
                                    <span className={`text-[20px] font-semibold tracking-tight ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-400'}`}>
                                        $5
                                    </span>
                                </button>

                                <button
                                    onClick={() => setSelectedPlan('lifetime')}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group relative ${selectedPlan === 'lifetime'
                                        ? 'bg-white/[0.06] border-white/20 shadow-lg'
                                        : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12]'
                                        }`}
                                >
                                    <div className="absolute -top-2 -right-2 px-2.5 py-0.5 bg-white text-zinc-950 rounded-full text-[9px] font-bold uppercase tracking-wide shadow-lg">
                                        Best Value
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'lifetime' ? 'border-white bg-white' : 'border-zinc-600'
                                            }`}>
                                            {selectedPlan === 'lifetime' && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                                            )}
                                        </div>
                                        <div>
                                            <span className={`block text-[14px] font-medium ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                                Lifetime
                                            </span>
                                            <span className="text-[11px] text-zinc-500">One-time after trial</span>
                                        </div>
                                    </div>
                                    <span className={`text-[20px] font-semibold tracking-tight ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-400'}`}>
                                        $30
                                    </span>
                                </button>
                            </div>

                            {/* Features */}
                            <div className="mb-6 space-y-2.5 px-1">
                                {[
                                    "Full focus environment",
                                    "Eye strain tracking",
                                    "Unlimited session history",
                                    "AI posture optimization",
                                    "Cortisol management"
                                ].map((f, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <svg className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-[12px] text-zinc-400 font-normal">{f}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <motion.button
                                onClick={handleCheckout}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="w-full h-[50px] rounded-2xl bg-white text-zinc-950 font-semibold text-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)] transition-all mb-4 flex items-center justify-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin" />
                                ) : (
                                    <span className="relative z-10">Start Free Trial</span>
                                )}
                            </motion.button>

                            {/* Trust Badge */}
                            <div className="text-center">
                                <p className="text-[10px] text-zinc-500">7 days free • Then ${selectedPlan === 'monthly' ? '5/mo' : '30 once'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-4xl mx-auto ${className}`}
        >
            {/* Main Card */}
            <div className="relative rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Plan Selection Header */}
                <div className="grid md:grid-cols-2 gap-4 p-8 border-b border-white/[0.08]">
                    <button
                        onClick={() => setSelectedPlan('monthly')}
                        className={`p-6 rounded-2xl border transition-all duration-300 text-left group ${selectedPlan === 'monthly'
                            ? 'bg-white/[0.06] border-white/20 shadow-lg'
                            : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12]'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className={`text-[16px] font-semibold mb-1 ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                    Monthly
                                </h3>
                                <p className="text-[12px] text-zinc-500">Billed every 30 days</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-white bg-white' : 'border-zinc-600'
                                }`}>
                                {selectedPlan === 'monthly' && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                                )}
                            </div>
                        </div>
                        <div className={`text-[32px] font-bold tracking-tight ${selectedPlan === 'monthly' ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            $5<span className="text-[16px] font-normal text-zinc-500">/mo</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelectedPlan('lifetime')}
                        className={`p-6 rounded-2xl border transition-all duration-300 text-left group relative ${selectedPlan === 'lifetime'
                            ? 'bg-white/[0.06] border-white/20 shadow-lg'
                            : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12]'
                            }`}
                    >
                        <div className="absolute -top-3 -right-3 px-3 py-1 bg-white text-zinc-950 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg">
                            Best Value
                        </div>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className={`text-[16px] font-semibold mb-1 ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                                    Lifetime
                                </h3>
                                <p className="text-[12px] text-zinc-500">One-time payment</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'lifetime' ? 'border-white bg-white' : 'border-zinc-600'
                                }`}>
                                {selectedPlan === 'lifetime' && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-950" />
                                )}
                            </div>
                        </div>
                        <div className={`text-[32px] font-bold tracking-tight ${selectedPlan === 'lifetime' ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                            $30
                        </div>
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 p-8">
                    {[
                        { title: "Zero Eye Strain", desc: "No dryness, blurs, or fatigue" },
                        { title: "Posture Correction", desc: "Real-time AI optimization" },
                        { title: "Cortisol Management", desc: "Protect biological health" },
                        { title: "Deep Restoration", desc: "Guided cognitive breaks" },
                        { title: "Unlimited Sessions", desc: "Complete session history" },
                        { title: "Neural Optimization", desc: "Continuous performance tuning" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 group">
                            <div className="mt-0.5 w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-white text-[14px] font-semibold mb-0.5">{item.title}</h4>
                                <p className="text-zinc-400 text-[13px]">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="p-8 border-t border-white/[0.08] bg-white/[0.01]">
                    <motion.button
                        onClick={handleCheckout}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full h-[56px] rounded-2xl bg-white text-zinc-950 font-semibold text-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)] transition-all flex items-center justify-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-950 rounded-full animate-spin" />
                        ) : (
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        )}
                    </motion.button>
                    <p className="text-center text-[11px] text-zinc-500 mt-4">Secure checkout • Cancel anytime</p>
                </div>
            </div>
        </motion.div>
    );
};
