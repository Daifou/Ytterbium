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
        { text: 'Unlock unlimited AI Focus sessions', active: true },
        { text: 'Automate cognitive load fatigue detection', active: true },
        { text: 'Access deep-dive focus analytics', active: true },
        { text: 'Sync context across all devices', active: true },
        { text: 'Priority support & feature access', active: true },
        { text: 'Custom Focus presets', active: false },
        { text: 'Team collaboration tools', active: false },
    ];

    const annualId = 'annual_id_placeholder'; // Placeholder for annual ID
    const monthlyId = 'ccmqg';
    const currentProductId = isAnnual ? annualId : monthlyId;
    const checkoutUrl = currentUser
        ? `https://ytterbiumlife.gumroad.com/l/${currentProductId}?email=${encodeURIComponent(currentUser.email || '')}&user_id=${currentUser.id}`
        : '#';

    return (
        <div className={`relative w-full max-w-5xl mx-auto ${className}`}>
            {/* Glow Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-indigo-500/10 to-transparent rounded-2xl md:rounded-3xl blur-sm -z-10" />

            <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">

                {/* LEFT COLUMN: Features (40%) */}
                <div className="w-full md:w-[40%] bg-zinc-900/30 border-b md:border-b-0 md:border-r border-zinc-800/80 p-8 md:p-10 flex flex-col">
                    <div className="mb-10">
                        <h3 className="text-white text-lg font-bold mb-2">Features</h3>
                        <p className="text-zinc-500 text-sm font-light">This pricing plan includes the following features</p>
                    </div>

                    <div className="flex-1 space-y-5">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="flex items-start gap-3"
                            >
                                <div className={`mt-0.5 min-w-[20px] h-5 rounded-full flex items-center justify-center ${feature.active ? 'bg-indigo-500/10' : 'bg-zinc-800/50'}`}>
                                    <svg className={`w-3.2 h-3.2 ${feature.active ? 'text-indigo-400' : 'text-zinc-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className={`text-sm font-light leading-snug ${feature.active ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    {feature.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Meta Status */}
                    <div className="mt-8 pt-8 border-t border-zinc-800/50">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">System Ready for Calibration</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Action (60%) */}
                <div className="flex-1 p-8 md:p-12 bg-black/40 flex flex-col">
                    <div className="mb-10">
                        <h3 className="text-white text-lg font-bold mb-2">Pricing Plan</h3>
                        <p className="text-zinc-500 text-sm font-light">Choose the plan that best suits your needs</p>
                    </div>

                    {/* Radio Button Cards */}
                    <div className="space-y-4 mb-8">
                        {/* Monthly Option */}
                        <div
                            onClick={() => setIsAnnual(false)}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group relative ${!isAnnual ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${!isAnnual ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-zinc-700'}`}>
                                    {!isAnnual && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium text-base">Monthly</h4>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-2xl font-bold text-white">$5</span>
                                        <span className="text-zinc-500 text-xs">/month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Annual Option */}
                        <div
                            onClick={() => setIsAnnual(true)}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group relative ${isAnnual ? 'bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.05)]' : 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isAnnual ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-zinc-700'}`}>
                                    {isAnnual && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-white font-medium text-base">Yearly</h4>
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Best value</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-white">$50</span>
                                        <span className="text-zinc-500 text-xs">/year</span>
                                        <span className="ml-2 text-[10px] text-emerald-500/80 font-medium">Save $10 yearly</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Micro-copy */}
                    <p className="text-center text-[12px] text-zinc-500 mb-6 font-light">
                        No charge today. Credit card required to start your 7-day bio-calibration.
                    </p>

                    {/* CTA Button */}
                    <div className="mt-auto">
                        <motion.a
                            href={checkoutUrl}
                            data-gumroad-overlay="true"
                            data-gumroad-product-id={currentProductId}
                            onClick={handleCheckout}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="gumroad-button w-full relative overflow-hidden group py-4.5 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-[11px] shadow-lg block text-center flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-zinc-100"
                        >
                            <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                Start 7-Day Free Trial
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                </div>
                            )}
                        </motion.a>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-6 border-t border-zinc-800/50 flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622l-.382-3.016z" />
                                    </svg>
                                    Secure checkout via Gumroad
                                </span>
                            </div>
                            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                                7-day free trial • Cancel anytime
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

