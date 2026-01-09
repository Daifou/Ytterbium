import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
    const [isHovered, setIsHovered] = useState(false);

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
        {
            text: 'Zero Eye Strain Protocol',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )
        },
        {
            text: 'Biological Posture Calibration',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            text: 'Cortisol & Hormone Protection',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
                </svg>
            )
        },
        {
            text: 'AI Fatigue Detection Alerts',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            text: 'Guided Neuro-Rest Sessions',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )
        },
        {
            text: 'Deep Work Momentum Tracking',
            icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        }
    ];

    const currentPrice = isAnnual ? '50' : '5';
    const period = isAnnual ? '/ year' : '/ month';

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={isHovered ? { y: 0, scale: 1.02 } : { y: [0, -12, 0] }}
            transition={isHovered ? { duration: 0.4, ease: "easeOut" } : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative w-full max-w-sm mx-auto group ${className}`}
        >
            {/* Animated Glow Backdrop */}
            <motion.div
                animate={isHovered ? { opacity: 0.4, scale: 1.1 } : { opacity: [0.1, 0.25, 0.1], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full -z-10"
            />

            {/* Professional Pricing Card (Vercel Aesthetic) */}
            <div className="relative bg-black border border-white/10 rounded-[24px] overflow-hidden transition-all duration-700 hover:border-white/30 text-left px-8 py-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">

                {/* Orbital Border Beam (Mind Blowing Part) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[24px]">
                    <motion.div
                        animate={isHovered ? { opacity: 0 } : { rotate: [0, 360], opacity: [0, 1, 0] }}
                        transition={{
                            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_60%,rgba(99,102,241,0.6)_80%,transparent_100%)]"
                        style={{ maskImage: 'radial-gradient(circle at center, transparent 65%, black 67%)', WebkitMaskImage: 'radial-gradient(circle at center, transparent 65%, black 67%)' }}
                    />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                    {/* Compact Mode/Toggle */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Pro Access</h3>
                            <p className="text-zinc-500 text-[13px] leading-relaxed mt-1">
                                For elite individual performance.
                            </p>
                        </div>
                        {isAnnual && (
                            <div className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                                <span className="text-[9px] font-bold text-white uppercase tracking-tight">-15%</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-bold text-white tracking-tighter">${currentPrice}</span>
                        <span className="text-zinc-500 text-[13px]">{period}</span>
                    </div>

                    {/* Features Section */}
                    {!isCompact && (
                        <div className="flex-1 space-y-4 mb-10">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0.8 }}
                                    whileHover={{ opacity: 1, x: 2 }}
                                    className="flex items-center gap-3.5 group/item transition-all duration-300"
                                >
                                    <div className="flex items-center justify-center w-5 h-5 text-zinc-500 group-hover/item:text-white shrink-0 transition-colors">
                                        {feature.icon}
                                    </div>
                                    <span className="text-[14px] font-medium text-zinc-400 group-hover/item:text-zinc-200 transition-colors">
                                        {feature.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Primary Action Button (Pill style) */}
                    <motion.a
                        href={isAuthMode ? '#' : `https://ytterbiumlife.gumroad.com/l/${isAnnual ? 'annual_id_placeholder' : 'ccmqg'}?email=${encodeURIComponent(currentUser?.email || '')}&user_id=${currentUser?.id}`}
                        onClick={handleCheckout}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(99, 102, 241, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3.5 rounded-full font-bold text-[13px] tracking-tight transition-all duration-300 flex items-center justify-center gap-3 mb-6 ${isAuthMode
                            ? 'bg-white text-black hover:bg-zinc-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/10'
                            }`}
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                        ) : isAuthMode ? (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Upgrade Now
                            </>
                        ) : (
                            <>
                                Get Started
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </motion.a>

                    {/* Minimal Toggle Switch (Pill) */}
                    <div className="flex justify-center">
                        <div className="p-1 bg-zinc-900 border border-white/5 rounded-full flex items-center shadow-inner">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-all duration-300 ${!isAnnual ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-all duration-300 ${isAnnual ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
