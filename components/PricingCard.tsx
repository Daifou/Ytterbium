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
            <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-none overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                {/* LEFT COLUMN: Features (40%) */}
                <div className="w-full md:w-[40%] bg-zinc-900/10 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col relative z-10">
                    <div className="p-8 md:p-10 border-b border-zinc-800">
                        <h3 className="text-white text-lg font-bold mb-1 uppercase tracking-tighter">Features</h3>
                        <p className="text-zinc-500 text-[11px] uppercase tracking-widest font-medium">Core Capabilities</p>
                    </div>

                    <div className="flex-1">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.05 * i }}
                                className={`flex items-center justify-between px-8 py-5 border-b border-zinc-800/60 last:border-b-0 ${feature.active ? 'bg-transparent' : 'bg-black/20'}`}
                            >
                                <span className={`text-[13px] font-medium tracking-tight ${feature.active ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    {feature.text}
                                </span>
                                <div className={`flex items-center justify-center w-5 h-5 ${feature.active ? 'text-indigo-400' : 'text-zinc-800'}`}>
                                    {feature.active ? (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <div className="w-1.5 h-1.5 bg-current" />
                                    )}
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

