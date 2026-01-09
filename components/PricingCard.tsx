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
            <div className={`relative w-full h-full min-h-[500px] animate-in fade-in zoom-in duration-300 ${className}`}>
                <div className="relative w-full h-full bg-[#050505] border border-white/10 rounded-3xl overflow-hidden flex flex-col p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-white font-medium text-sm tracking-wide">Secure Checkout</h3>
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
    const period = isAnnual ? 'per year' : 'per month';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-5xl mx-auto ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative group rounded-[32px] bg-[#050505] border border-white/10 p-1">

                {/* Orbital Border Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[32px]">
                    <motion.div
                        animate={isHovered ? { opacity: 0 } : { rotate: [0, 360], opacity: [0, 0.5, 0] }}
                        transition={{
                            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_60%,rgba(255,255,255,0.15)_85%,transparent_100%)]"
                        style={{ maskImage: 'radial-gradient(circle at center, transparent 68%, black 69%)', WebkitMaskImage: 'radial-gradient(circle at center, transparent 68%, black 69%)' }}
                    />
                </div>

                <div className="relative z-10 bg-[#050505] rounded-[28px] overflow-hidden grid md:grid-cols-2 gap-0 md:divide-x divide-white/5">

                    {/* LEFT PANEL: IDENTITY & ACTION */}
                    <div className="p-8 md:p-12 flex flex-col h-full justify-between min-h-[480px]">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-zinc-400 text-xs font-medium tracking-widest uppercase">Membership Pass</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-2">Pro Access</h3>
                            <p className="text-zinc-500 text-base leading-relaxed max-w-xs">
                                The complete biological calibration system for elite individual performance.
                            </p>
                        </div>

                        <div className="mt-12 md:mt-0">
                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="text-6xl md:text-7xl font-semibold text-white tracking-tighter">${currentPrice}</span>
                                <span className="text-zinc-500 text-lg font-medium">{period}</span>
                            </div>

                            {/* Toggle Switch */}
                            <div className="flex items-center gap-4 mb-10">
                                <button
                                    onClick={() => setIsAnnual(!isAnnual)}
                                    className={`relative w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${isAnnual ? 'bg-zinc-800' : 'bg-zinc-900 border border-zinc-800'}`}
                                >
                                    <motion.div
                                        animate={{ x: isAnnual ? 20 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="w-5 h-5 bg-white rounded-full shadow-sm"
                                    />
                                </button>
                                <span className={`text-sm font-medium transition-colors duration-300 ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>
                                    Billed Annually
                                </span>
                                {isAnnual && (
                                    <span className="text-[10px] font-bold text-black bg-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                                        Save 15%
                                    </span>
                                )}
                            </div>

                            {/* Action Button */}
                            <motion.button
                                onClick={handleCheckout}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl bg-white text-black font-semibold text-sm tracking-wide hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                ) : isAuthMode ? (
                                    <>
                                        Get Started
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        Upgrade Now
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                            <p className="mt-4 text-center text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                                Secured via Stripe & Gumroad
                            </p>
                        </div>
                    </div>

                    {/* RIGHT PANEL: VALUE & FEATURES */}
                    <div className="p-8 md:p-12 bg-zinc-900/20 flex flex-col justify-center">
                        <div className="space-y-6">
                            {[
                                { title: "Biological Calibration", desc: "Zero eye strain protocol & posture correction." },
                                { title: "Hormone Protection", desc: "Cortisol regulation & fatigue detection alerts." },
                                { title: "Neuro-Rest Sessions", desc: "Guided NSDR protocols for rapid recovery." },
                                { title: "Deep Work Metrics", desc: "Momentum tracking & flow state analytics." },
                                { title: "Unlimited Usage", desc: "Full access to all bio-tech modules forever." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex gap-4 items-start"
                                >
                                    <div className="mt-1 w-5 h-5 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-white/30 transition-colors">
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white text-sm font-medium leading-none mb-1.5">{item.title}</h4>
                                        <p className="text-zinc-500 text-xs leading-relaxed max-w-[260px]">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-[#050505]" />
                                    ))}
                                </div>
                                <span className="text-zinc-500 text-xs font-medium">Used by 1,200+ elite performers</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
