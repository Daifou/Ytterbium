import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    currentUser?: User | null;
    onAuthRequired?: () => void;
    isAnnualProp?: boolean;
    isCompact?: boolean;
    isAuthMode?: boolean;
    onAuth?: (isAnnual: boolean) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
    className = '',
    currentUser,
    onAuthRequired,
    isAnnualProp = true, // Defaulting to true for Paywall/Landing
    isCompact = false,
    isAuthMode = false,
    onAuth
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [internalIsAnnual, setInternalIsAnnual] = useState(isAnnualProp);

    useEffect(() => {
        setInternalIsAnnual(isAnnualProp);
    }, [isAnnualProp]);

    useEffect(() => {
        if (window.GumroadOverlay) {
            window.GumroadOverlay.init();
        }
    }, [currentUser]);

    const handleCheckout = (e: React.MouseEvent) => {
        if (isAuthMode && onAuth) {
            e.preventDefault();
            onAuth(internalIsAnnual);
            return;
        }

        if (!currentUser) {
            e.preventDefault();
            setIsLoading(true);
            localStorage.setItem('pending_plan', internalIsAnnual ? 'annual' : 'monthly');
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
        const productId = internalIsAnnual ? 'annual_id_placeholder' : 'ccmqg';
        return (
            <div className={`relative w-full max-w-xl mx-auto animate-in fade-in zoom-in duration-300 ${className}`}>
                <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col p-4 min-h-[500px]">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Secure Checkout</h3>
                        <button
                            onClick={() => setIsCheckingOut(false)}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div
                        key={productId}
                        className="gumroad-product-embed flex-1"
                        data-gumroad-product-id={productId}
                        data-gumroad-single-product="true"
                    >
                        <a href={`https://gumroad.com/l/${productId}`}>Loading Checkout...</a>
                    </div>
                </div>
            </div>
        );
    }

    const features = [
        "Personalized Cognitive Calibration",
        "Fatigue Prediction Engine",
        "Eye Strain Protection System",
        "Biological Rhythm Optimization",
        "Contextual Deep Work Environment",
        "Unlimited Focus Sessions"
    ];

    const annualId = 'annual_id_placeholder';
    const monthlyId = 'ccmqg';
    const currentProductId = internalIsAnnual ? annualId : monthlyId;
    const checkoutUrl = currentUser
        ? `https://ytterbiumlife.gumroad.com/l/${currentProductId}?email=${encodeURIComponent(currentUser.email || '')}&user_id=${currentUser.id}`
        : '#';

    return (
        <div className={`relative w-full ${isCompact ? 'max-w-[400px]' : 'max-w-[440px]'} mx-auto ${className} font-sans`}>
            {/* Main Card */}
            <div className={`relative bg-[#09090b] border border-white/10 rounded-[32px] ${isCompact ? 'p-6 md:p-8' : 'p-10'} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden`}>
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[100px] -z-10" />

                {/* Plan Info */}
                <div className={`text-center ${isCompact ? 'mb-6 md:mb-8' : 'mb-10'}`}>
                    <span className="text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
                        Professional
                    </span>
                    <h3 className={`${isCompact ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-6 uppercase tracking-tight`}>Pro Plan</h3>

                    {/* Toggle Switch (Moved inside card for compact view if needed, but keeping design consistent) */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <button
                            onClick={() => setInternalIsAnnual(false)}
                            className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${!internalIsAnnual ? 'text-white' : 'text-zinc-600'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setInternalIsAnnual(!internalIsAnnual)}
                            className="relative w-10 h-5 rounded-full bg-zinc-800 p-1 transition-colors hover:bg-zinc-700"
                        >
                            <motion.div
                                animate={{ x: internalIsAnnual ? 20 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-3 h-3 rounded-full bg-white"
                            />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setInternalIsAnnual(true)}
                                className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${internalIsAnnual ? 'text-white' : 'text-zinc-600'}`}
                            >
                                Annual
                            </button>
                            <span className="px-1.5 py-0.5 text-[8px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full uppercase">
                                -20%
                            </span>
                        </div>
                    </div>

                    <div className="flex items-baseline justify-center gap-1">
                        <span className={`${isCompact ? 'text-4xl' : 'text-5xl'} font-bold text-white tracking-tight`}>
                            ${internalIsAnnual ? '40' : '5'}
                        </span>
                        <span className="text-zinc-500 text-lg">
                            /{internalIsAnnual ? 'year' : 'month'}
                        </span>
                    </div>
                </div>

                {/* Features List */}
                <div className={`space-y-3 ${isCompact ? 'mb-8 md:mb-10' : 'mb-12'}`}>
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-zinc-300 text-[14px] font-medium tracking-tight">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <motion.a
                    href={checkoutUrl}
                    data-gumroad-overlay="true"
                    data-gumroad-product-id={currentProductId}
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-14 ${isAuthMode ? 'bg-white text-black border border-zinc-200' : 'bg-zinc-50 text-black'} rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 shadow-lg transition-all duration-300 cursor-pointer`}
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : isAuthMode ? (
                        <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </>
                    ) : (
                        'Get Started'
                    )}
                </motion.a>

                {/* Footnote */}
                <p className="mt-6 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
                    7-day free protocol included
                </p>
            </div>
        </div>
    );
};

