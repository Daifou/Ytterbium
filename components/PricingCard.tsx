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
            <div className={`relative w-full max-w-sm mx-auto animate-in fade-in zoom-in duration-300 ${className}`}>
                <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 min-h-[480px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold text-[10px] uppercase tracking-widest opacity-60">Secure Checkout</h3>
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
    ];

    const currentPrice = isAnnual ? '50' : '5';
    const period = isAnnual ? '/ year' : '/ month';

    return (
        <div className={`relative w-full max-w-sm mx-auto ${className}`}>
            {/* Professional Pricing Card */}
            <div className="relative bg-[#09090b] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-indigo-500/40 group">
                <div className="p-8 md:p-10 flex flex-col items-center">

                    {/* Compact Toggle Switch */}
                    <div className="flex justify-center mb-10">
                        <div className="p-1 bg-zinc-900/40 backdrop-blur-md rounded-full border border-white/5 flex items-center shadow-inner">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase transition-all duration-300 ${!isAnnual ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.1em] uppercase transition-all duration-300 ${isAnnual ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>

                    {/* Small Badge */}
                    {isAnnual && (
                        <div className="mb-6 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Save 15%</span>
                        </div>
                    )}

                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight opacity-90">Pro Access</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-5xl font-black text-white tracking-tighter">${currentPrice}</span>
                        <span className="text-zinc-500 text-[11px] font-medium uppercase tracking-wider">{period}</span>
                    </div>

                    <p className="text-zinc-500 text-[13px] text-center mb-8 leading-relaxed max-w-[240px]">
                        The biological calibration system for elite performers.
                    </p>

                    {/* Primary Button */}
                    <motion.a
                        href={isAuthMode ? '#' : `https://ytterbiumlife.gumroad.com/l/${isAnnual ? 'annual_id_placeholder' : 'ccmqg'}?email=${encodeURIComponent(currentUser?.email || '')}&user_id=${currentUser?.id}`}
                        onClick={handleCheckout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-4 rounded-2xl font-black text-[12px] tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-3 mb-10 shadow-lg ${isAuthMode
                            ? 'bg-white text-black hover:bg-zinc-100'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : isAuthMode ? (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                CONTINUE
                            </>
                        ) : (
                            'UPGRADE NOW'
                        )}
                    </motion.a>

                    {/* Features Section */}
                    {!isCompact && (
                        <div className="w-full space-y-3 px-2">
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 text-center">Core Protocol</p>
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[12px] font-semibold text-zinc-400">{feature}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Compact Trial Box */}
                    <div className="mt-10 w-full p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                            <span className="text-[9px] font-bold text-white uppercase tracking-widest opacity-80">Trial Included</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed italic">
                            7-day risk-free calibration period.
                        </p>
                    </div>

                    <p className="mt-8 text-[9px] text-zinc-700 font-bold uppercase tracking-[0.1em]">
                        SSL Secured Checkout
                    </p>
                </div>
            </div>
        </div>
    );
};
