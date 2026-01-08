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
}

export const PricingCard: React.FC<PricingCardProps> = ({
    className = '',
    showCloseButton = false,
    onClose,
    currentUser,
    onAuthRequired
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
        // 1. If not logged in, prevent the link from opening and show auth
        if (!currentUser) {
            e.preventDefault();
            setIsLoading(true);
            localStorage.setItem('pending_plan', 'monthly');
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
            benefit: 'Work hard without burning out.',
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
        <div className={`relative w-full max-w-5xl mx-auto ${className}`}>
            <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                {/* LEFT COLUMN: Features (40%) */}
                <div className="w-full md:w-[45%] bg-zinc-900/10 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col relative z-10">
                    <div className="p-8 border-b border-zinc-800">
                        <h3 className="text-white text-lg font-bold mb-1 uppercase tracking-tighter">Features</h3>
                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Standard on All Plans</p>
                    </div>

                    <div className="flex-1">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.05 * i }}
                                className={`flex items-start gap-4 px-8 py-6 border-b border-zinc-800/60 last:border-b-0 hover:bg-white/[0.02] transition-colors`}
                            >
                                <div className={`mt-0.5 flex items-center justify-center w-6 h-6 shrink-0 ${feature.active ? 'text-indigo-400' : 'text-zinc-800'}`}>
                                    {feature.icon}
                                </div>
                                <div className="space-y-1">
                                    <span className={`text-[13px] font-bold tracking-tight block ${feature.active ? 'text-white' : 'text-zinc-600'}`}>
                                        {feature.title}
                                    </span>
                                    <span className={`text-[12px] font-medium leading-relaxed block ${feature.active ? 'text-zinc-500' : 'text-zinc-800'}`}>
                                        {feature.benefit}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Meta Status */}
                    <div className="p-6 border-t border-zinc-800 bg-black/40">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Calibration Active</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Action (60%) */}
                <div className="flex-1 bg-black/20 flex flex-col relative z-10">
                    <div className="p-8 md:p-10 border-b border-zinc-800 bg-zinc-900/5">
                        <h3 className="text-white text-lg font-bold mb-1 uppercase tracking-tighter">Configuration</h3>
                        <p className="text-zinc-500 text-[11px] uppercase tracking-widest font-medium">Select Deployment Mode</p>
                    </div>

                    <div className="p-8 md:p-12 flex-1 flex flex-col">
                        {/* Radio Button Options (Table Look) */}
                        <div className="border border-zinc-800 divide-y divide-zinc-800 mb-10 overflow-hidden">
                            {/* Monthly Option */}
                            <div
                                onClick={() => setIsAnnual(false)}
                                className={`p-8 transition-all duration-200 cursor-pointer group flex items-center justify-between ${!isAnnual ? 'bg-indigo-500/[0.03]' : 'hover:bg-zinc-900/40'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-4 h-4 border flex items-center justify-center ${!isAnnual ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-700'}`}>
                                        {!isAnnual && <div className="w-1.5 h-1.5 bg-white" />}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold uppercase tracking-widest ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly Access</h4>
                                        <p className="text-[10px] text-zinc-600 uppercase mt-1">Flexible subscription</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-white">$5</span>
                                    <span className="text-zinc-600 text-[10px] uppercase ml-1 block font-bold">Per month</span>
                                </div>
                            </div>

                            {/* Annual Option */}
                            <div
                                onClick={() => setIsAnnual(true)}
                                className={`p-8 transition-all duration-200 cursor-pointer group flex items-center justify-between ${isAnnual ? 'bg-indigo-500/[0.03]' : 'hover:bg-zinc-900/40'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-4 h-4 border flex items-center justify-center ${isAnnual ? 'border-indigo-500 bg-indigo-500' : 'border-zinc-700'}`}>
                                        {isAnnual && <div className="w-1.5 h-1.5 bg-white" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className={`text-sm font-bold uppercase tracking-widest ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>Annual Access</h4>
                                            {isAnnual && (
                                                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-emerald-500 text-black">Optimal</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-zinc-600 uppercase mt-1">Full year calibration</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-white">$50</span>
                                    <span className="text-zinc-600 text-[10px] uppercase ml-1 block font-bold">Per year</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="mt-auto">
                            <motion.a
                                href={checkoutUrl}
                                data-gumroad-overlay="true"
                                data-gumroad-product-id={currentProductId}
                                onClick={handleCheckout}
                                whileTap={{ scale: 0.995 }}
                                className="gumroad-button w-full relative overflow-hidden group py-6 border border-white bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] shadow-lg block text-center cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-white"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? 'Processing' : 'Initiate 7-Day Protocol'}
                                    {!isLoading && (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </div>
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-black/30 border-t-black animate-spin" />
                                    </div>
                                )}
                            </motion.a>

                            {/* Minimal Trust Grid */}
                            <div className="mt-10 grid grid-cols-2 border border-zinc-800/60 divide-x divide-zinc-800/60">
                                <div className="p-4 flex flex-col items-center justify-center gap-1 bg-black/10">
                                    <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Trial Mode</span>
                                    <span className="text-[10px] text-white font-medium">7 Days Free</span>
                                </div>
                                <div className="p-4 flex flex-col items-center justify-center gap-1 bg-black/10">
                                    <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Gateway</span>
                                    <span className="text-[10px] text-white font-medium">SSL Encrypted</span>
                                </div>
                            </div>

                            <p className="mt-6 text-center text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-bold">
                                No initial charge • Secure via Gumroad
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

