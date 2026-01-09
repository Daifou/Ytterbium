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
    const [isAnnual, setIsAnnual] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        // Run Gumroad overlay initializer when component mounts
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

        // 1. If not logged in, prevent the link from opening and show auth
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

        // 2. If logged in, we trigger the INLINE EMBED inside the card
        e.preventDefault();
        setIsCheckingOut(true);
    };

    // Render the Gumroad Embed Inline
    if (isCheckingOut && currentUser) {
        const productId = isAnnual ? 'annual_id_placeholder' : 'ccmqg'; // Replace with real annual ID
        return (
            <div className={`relative w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-300 ${className}`}>
                {/* Card Container */}
                <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col p-4 min-h-[500px]">
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
        {
            title: 'Zero Eye Strain',
            benefit: 'End your day without dryness or fatigue.',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            active: true
        },
        {
            title: 'No Gamer Posture',
            benefit: 'Sit long without slouching or pain.',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            active: true
        },
        {
            title: 'Hormone Protection',
            benefit: 'Balance your cortisol, protect your performance',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
                </svg>
            ),
            active: true
        },
        {
            title: 'Real Rest',
            benefit: 'Guided breaks that truly refresh you.',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ),
            active: true
        },
        {
            title: 'Prevent Mental Fog',
            benefit: 'Get alerted before focus drops.',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            active: true
        },
        {
            title: 'True Finish',
            benefit: 'End the "worked all day, did nothing" cycle.',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            active: true
        },
        {
            title: 'Laser Productivity',
            benefit: 'Focus when it matters; stop when it doesn\'t.',
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            active: true
        },
    ];

    const annualId = 'annual_id_placeholder'; // Placeholder for annual ID
    const monthlyId = 'ccmqg';
    const currentProductId = isAnnual ? annualId : monthlyId;
    const checkoutUrl = currentUser
        ? `https://ytterbiumlife.gumroad.com/l/${currentProductId}?email=${encodeURIComponent(currentUser.email || '')}&user_id=${currentUser.id}`
        : '#';

    return (
        <div className={`relative w-full mx-auto ${className}`}>
            <div className={`relative w-full bg-[#050505] border border-white/[0.15] overflow-hidden flex flex-col ${isCompact ? '' : 'md:flex-row'} min-h-[600px] font-sans`}>

                {/* LEFT COLUMN: Features (45%) */}
                <div className={`w-full ${isCompact ? 'hidden' : 'md:w-[45%]'} bg-[#09090b] border-b md:border-b-0 md:border-r border-white/[0.15] flex flex-col relative z-10`}>
                    <div className="p-8 md:p-12 border-b border-white/[0.15]">
                        <h3 className="text-white text-[13px] font-semibold tracking-[-0.015em] uppercase">Everything You Get</h3>
                    </div>

                    <div className="flex-1 py-4">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.05 * i }}
                                className={`flex items-start gap-4 px-8 md:px-12 py-8 border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02] transition-all`}
                            >
                                <div className={`mt-[3px] flex items-center justify-center w-5 h-5 shrink-0 opacity-90 ${feature.active ? 'text-white' : 'text-zinc-600'}`}>
                                    {feature.icon}
                                </div>
                                <div className="space-y-3 text-left">
                                    <span className={`text-[15px] font-semibold tracking-tight block ${feature.active ? 'text-white' : 'text-zinc-500'}`}>
                                        {feature.title}
                                    </span>
                                    <span className={`text-[14px] font-normal leading-[1.6] block ${feature.active ? 'text-white/60' : 'text-zinc-800'}`}>
                                        {feature.benefit}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Meta Status */}
                    <div className="p-8 border-t border-white/[0.15] bg-black/40">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[11px] text-white/40 font-medium tracking-tight uppercase">Calibration Active</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Action (55%) */}
                <div className="flex-1 bg-[#050505] flex flex-col relative z-10">
                    <div className="p-8 md:p-12 border-b border-white/[0.15] bg-[#09090b]">
                        <h3 className="text-white text-[13px] font-semibold tracking-[-0.015em] uppercase">Choose Your Plan</h3>
                    </div>

                    <div className="p-8 md:p-12 flex-1 flex flex-col">
                        <div className="flex-1 flex flex-col justify-center">
                            {/* Radio Button Options (Table Look) */}
                            <div className="border border-white/[0.15] divide-y divide-white/[0.15] overflow-hidden rounded-xl bg-[#09090b]/50">
                                {/* Monthly Option */}
                                <div
                                    onClick={() => setIsAnnual(false)}
                                    className={`p-8 transition-all duration-300 cursor-pointer group flex items-center justify-between ${!isAnnual ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-5 h-5 border rounded-full flex items-center justify-center transition-all ${!isAnnual ? 'border-white bg-white' : 'border-white/20'}`}>
                                            {!isAnnual && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                        <div className="text-left">
                                            <h4 className={`text-base font-semibold tracking-tight ${!isAnnual ? 'text-white' : 'text-white/40'}`}>Monthly Access</h4>
                                            <p className="text-[13px] text-white/60 font-normal mt-1 leading-[1.6]">Flexible subscription</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-semibold text-white tracking-tight">$5</span>
                                        <span className="text-white/40 text-[12px] font-normal block">Per month</span>
                                    </div>
                                </div>

                                {/* Annual Option */}
                                <div
                                    onClick={() => setIsAnnual(true)}
                                    className={`p-8 transition-all duration-300 cursor-pointer group flex items-center justify-between ${isAnnual ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`w-5 h-5 border rounded-full flex items-center justify-center transition-all ${isAnnual ? 'border-white bg-white' : 'border-white/20'}`}>
                                            {isAnnual && <div className="w-2 h-2 bg-black rounded-full" />}
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-3">
                                                <h4 className={`text-base font-semibold tracking-tight ${isAnnual ? 'text-white' : 'text-white/40'}`}>Annual Access</h4>
                                                {isAnnual && (
                                                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-white text-black rounded-full">Save 15%</span>
                                                )}
                                            </div>
                                            <p className="text-[13px] text-white/60 font-normal mt-1 leading-[1.6]">Full year calibration</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-semibold text-white tracking-tight">$50</span>
                                        <span className="text-white/40 text-[12px] font-normal block">Per year</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-auto pt-12">
                            <motion.a
                                href={checkoutUrl}
                                data-gumroad-overlay="true"
                                data-gumroad-product-id={currentProductId}
                                onClick={handleCheckout}
                                whileHover={{ scale: 1.005 }}
                                whileTap={{ scale: 0.995 }}
                                className={`w-full relative overflow-hidden group py-5 rounded-[8px] ${isAuthMode ? 'bg-white text-black' : 'bg-white text-black'} font-semibold text-[15px] shadow-lg block text-center flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-[#F2F2F7]`}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? 'Processing...' : isAuthMode ? (
                                        <>
                                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            CONTINUE WITH GOOGLE
                                        </>
                                    ) : (
                                        <>
                                            INITIATE 7-DAY PROTOCOL
                                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </div>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    </div>
                                )}
                            </motion.a>

                            {/* Minimal Trust Grid */}
                            <div className="mt-12 grid grid-cols-2 border border-white/[0.15] divide-x divide-white/[0.15] rounded-sm overflow-hidden">
                                <div className="p-6 flex flex-col items-center justify-center gap-1.5 bg-[#09090b]">
                                    <span className="text-[11px] text-white/40 font-medium tracking-tight uppercase">Trial Mode</span>
                                    <span className="text-[12px] text-white font-semibold">7 Days Free</span>
                                </div>
                                <div className="p-6 flex flex-col items-center justify-center gap-1.5 bg-[#09090b]">
                                    <span className="text-[11px] text-white/40 font-medium tracking-tight uppercase">Gateway</span>
                                    <span className="text-[12px] text-white font-semibold">SSL Encrypted</span>
                                </div>
                            </div>

                            <p className="mt-8 text-center text-[12px] text-white/40 font-normal leading-relaxed uppercase tracking-widest">
                                No initial charge • Secure checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

