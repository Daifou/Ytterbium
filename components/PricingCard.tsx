import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

// Extend Window interface for Gumroad
declare global {
    interface Window {
        GumroadOverlay?: {
            init: () => void;
        };
    }
}

interface PricingCardProps {
    className?: string;
    showCloseButton?: boolean;
    onClose?: () => void;
    currentUser?: User | null;
    onAuthRequired?: () => void;
    isCompact?: boolean;
    isAuthMode?: boolean;
    onAuth?: (isAnnual: boolean) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
    className = '',
    showCloseButton = false,
    onClose,
    currentUser,
    onAuthRequired,
    isCompact = false,
    isAuthMode = false,
    onAuth
}) => {
    const [isAnnual, setIsAnnual] = useState(true); // Default to annual
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        if (window.GumroadOverlay) {
            window.GumroadOverlay.init();
        }
    }, [currentUser]);

    const handleCheckout = (e: React.MouseEvent) => {
        if (isAuthMode && onAuth) {
            e.preventDefault();
            onAuth(isAnnual);
            return;
        }

        if (!currentUser) {
            e.preventDefault();
            setIsLoading(true);
            localStorage.setItem('pending_plan', isAnnual ? 'annual' : 'monthly');
            setTimeout(() => {
                setIsLoading(false);
                if (onAuthRequired) {
                    onAuthRequired();
                }
            }, 600);
            return;
        }

        e.preventDefault();
        setIsCheckingOut(true);
    };

    if (isCheckingOut && currentUser) {
        const productId = isAnnual ? 'annual_id_placeholder' : 'ccmqg';
        return (
            <div className={`relative w-full max-w-xl mx-auto animate-in fade-in zoom-in duration-300 ${className}`}>
                <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 min-h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Secure Checkout</h3>
                        <button onClick={() => setIsCheckingOut(false)} className="text-zinc-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div key={productId} className="gumroad-product-embed flex-1" data-gumroad-product-id={productId} data-gumroad-single-product="true">
                        <a href={`https://gumroad.com/l/${productId}`}>Loading Checkout...</a>
                    </div>
                </div>
            </div>
        );
    }

    const features = [
        'Zero Eye Strain Protcol',
        'Biological Posture Calibration',
        'Cortisol & Hormone Protection',
        'AI Fatigue Detection Alerts',
        'Guided Neuro-Rest Sessions',
        'Deep Work Momentum Tracking',
        'Unlimited Bio-Tech Sessions'
    ];

    const currentPrice = isAnnual ? '50' : '5';
    const period = isAnnual ? '/ year' : '/ month';

    return (
        <div className={`relative w-full max-w-xl mx-auto ${className}`}>
            {/* Toggle Switch */}
            <div className="flex justify-center mb-10">
                <div className="p-1.5 bg-zinc-900/50 backdrop-blur-md rounded-full border border-white/5 flex items-center shadow-xl">
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${!isAnnual ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Pay Monthly
                    </button>
                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${isAnnual ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Pay Yearly
                    </button>
                </div>
            </div>

            {/* Classic Pricing Card */}
            <div className="relative bg-[#09090b] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-indigo-500/30 group">
                <div className="p-10 md:p-14 flex flex-col items-center">

                    {/* Badge */}
                    {isAnnual && (
                        <div className="mb-6 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Save 15% Yearly</span>
                        </div>
                    )}

                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Pro Access</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">${currentPrice}</span>
                        <span className="text-zinc-500 text-sm font-medium">{period}</span>
                    </div>

                    <p className="text-zinc-400 text-sm text-center mb-10 leading-relaxed max-w-[280px]">
                        The complete biological calibration system for elite performers.
                    </p>

                    {/* CTA Button */}
                    <motion.a
                        href={isAuthMode ? '#' : `https://ytterbiumlife.gumroad.com/l/${isAnnual ? 'annual_id_placeholder' : 'ccmqg'}?email=${encodeURIComponent(currentUser?.email || '')}&user_id=${currentUser?.id}`}
                        onClick={handleCheckout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-5 rounded-2xl font-bold text-[14px] tracking-[0.05em] transition-all duration-300 flex items-center justify-center gap-3 mb-10 shadow-xl ${isAuthMode
                            ? 'bg-white text-black hover:bg-zinc-100'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : isAuthMode ? (
                            <>
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                CONTINUE WITH GOOGLE
                            </>
                        ) : (
                            'UPGRADE TO PRO'
                        )}
                    </motion.a>
                    {!isCompact && (
                        <div className="w-full space-y-4">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Calibration Features</p>
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-0.5 bg-emerald-500/10 rounded-full">
                                        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-medium text-zinc-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                    )}



                    {/* Trial Box */}
                    <div className="mt-12 w-full p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Trial Protocol</span>
                        </div>
                        <p className="text-[12px] text-zinc-500 leading-relaxed italic">
                            Experiment with full access. 7-day risk-free trial included with all plans.
                        </p>
                    </div>

                    <p className="mt-8 text-[11px] text-zinc-600 font-medium uppercase tracking-[0.1em]">
                        Secure checkout powered by Gumroad
                    </p>
                </div>
            </div>
        </div >
    );
};
