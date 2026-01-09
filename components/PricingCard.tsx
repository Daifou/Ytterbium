import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

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
    currentUser,
    onAuthRequired,
    isCompact = false,
    isAuthMode = false,
    onAuth
}) => {
    const [isAnnual, setIsAnnual] = useState(false);
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
            <div className={`relative w-full h-full min-h-[500px] animate-in fade-in zoom-in duration-500 ease-out ${className}`}>
                <div className="relative w-full h-full bg-[#0a0a0b] border border-white/5 rounded-3xl overflow-hidden flex flex-col p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-zinc-400 font-medium text-xs tracking-wide uppercase">Secure Checkout</h3>
                        <button onClick={() => setIsCheckingOut(false)} className="text-zinc-500 hover:text-white transition-colors">
                            <span className="sr-only">Close</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div key={productId} className="gumroad-product-embed w-full" data-gumroad-product-id={productId} data-gumroad-single-product="true">
                            <a href={`https://gumroad.com/l/${productId}`} className="text-zinc-500 hover:text-white transition-colors">Loading Gumroad Checkout...</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentPrice = isAnnual ? '50' : '5';
    // Removed "per" to be cleaner
    const period = isAnnual ? '/year' : '/mo';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full ${isCompact ? 'max-w-md' : 'max-w-5xl'} mx-auto ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Container: Effortless, Minimal, "Void" Black */}
            <div className={`relative group rounded-[32px] bg-[#050505] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] overflow-hidden grid ${isCompact ? 'grid-cols-1' : 'md:grid-cols-2'} gap-0 ${!isCompact && 'md:divide-x'} divide-white/5 transition-all duration-700 hover:border-white/20`}>

                {/* Decoration: Subtle warm glow, no "orbital sci-fi" */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.03] to-orange-500/[0.02] pointer-events-none" />

                {/* LEFT PANEL: The "Confident Offer" */}
                <div className={`relative p-8 md:p-14 flex flex-col h-full justify-between ${isCompact ? 'min-h-[420px] items-center text-center' : 'min-h-[500px]'}`}>

                    {/* Header: Clean hierarchy */}
                    <div>
                        <div className={`flex items-center gap-3 mb-8 ${isCompact ? 'justify-center' : ''}`}>
                            <span className="text-zinc-400 text-[11px] font-semibold tracking-[0.2em] uppercase">Membership</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-semibold text-white tracking-tighter mb-4">Pro Access</h3>
                        <p className="text-zinc-500 text-[15px] leading-relaxed max-w-[300px] font-normal">
                            The cost of a coffee for a month of peak performance.
                        </p>
                    </div>

                    <div className="mt-12 md:mt-0 w-full">
                        {/* Price: Huge, undeniable confidence */}
                        <div className={`flex items-baseline gap-1 mb-8 ${isCompact ? 'justify-center' : ''}`}>
                            <span className="text-7xl font-semibold text-white tracking-tighter">${currentPrice}</span>
                            <span className="text-zinc-500 text-xl tracking-tight">{period}</span>
                        </div>

                        {/* Toggle: Tactile, clean, "obvious" */}
                        <div className={`flex items-center gap-4 mb-10 ${isCompact ? 'justify-center' : ''}`}>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className={`group relative w-12 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${isAnnual ? 'bg-zinc-800' : 'bg-zinc-900 border border-zinc-800'}`}
                            >
                                <motion.div
                                    animate={{ x: isAnnual ? 20 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="w-5 h-5 bg-white rounded-full shadow-sm group-hover:scale-90 transition-transform"
                                />
                            </button>
                            <span className={`text-sm font-medium transition-colors duration-300 ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>
                                Billed Annually
                            </span>
                            {isAnnual && (
                                <span className="text-[10px] font-bold text-orange-900 bg-orange-100/90 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                    Save 15%
                                </span>
                            )}
                        </div>

                        {/* Action Button: Warm, high-contrast, simple */}
                        <motion.button
                            onClick={handleCheckout}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-4 rounded-xl bg-white text-black font-semibold text-[15px] tracking-tight hover:bg-zinc-100 transition-colors shadow-xl shadow-white/5 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                            ) : isAuthMode ? (
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </>
                            ) : (
                                <>
                                    Upgrade Now
                                    <svg className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </>
                            )}
                        </motion.button>
                        <p className="mt-5 text-center text-[10px] text-zinc-600 font-medium tracking-wide">
                            Secure billing via Gumroad
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL: The "Value" - Warm, Clean, Human - Only show if not compact */}
                {!isCompact && (
                    <div className="relative p-10 md:p-14 bg-zinc-900/10 flex flex-col justify-center">
                        <div className="space-y-8">
                            {[
                                { title: "Biological Calibration", desc: "Zero eye strain protocol & posture correction." },
                                { title: "Hormone Protection", desc: "Cortisol regulation & fatigue detection alerts." },
                                { title: "Neuro-Rest Sessions", desc: "Guided NSDR protocols for rapid recovery." },
                                { title: "Deep Work Metrics", desc: "Momentum tracking & flow state analytics." },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="group flex gap-5 items-start"
                                >
                                    {/* Icon: Minimal, "quiet" circle */}
                                    <div className="mt-0.5 w-6 h-6 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-900/50 text-zinc-400 group-hover:text-white group-hover:border-zinc-600 transition-all duration-500">
                                        <svg className="w-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white text-[15px] font-medium leading-none mb-2 transition-colors group-hover:text-white/90">{item.title}</h4>
                                        <p className="text-zinc-500 text-[13px] leading-relaxed max-w-[280px] group-hover:text-zinc-400 transition-colors">{item.desc}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Last item standalone for emphasis */}
                            <div className="flex gap-5 items-center pt-2">
                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10">
                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                                <span className="text-white text-[15px] font-medium">Unlimited Access Forever</span>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-white/5 opacity-80">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#09090b]" /> // Fakes avatars
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-xs font-semibold">Join 1,200+ Performers</span>
                                    <span className="text-zinc-600 text-[10px]">Optimizing daily</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
