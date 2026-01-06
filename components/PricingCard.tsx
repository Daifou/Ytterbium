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

    useEffect(() => {
        // Run Gumroad overlay initializer when component mounts
        if (window.GumroadOverlay) {
            window.GumroadOverlay.init();
        }
    }, [currentUser]);

    const handleCheckout = () => {
        setIsLoading(true);

        // Gumroad Product URL (Monthly)
        const gumroadUrl = "https://ytterbiumlife.gumroad.com/l/ccmqg";

        // 1. If user is logged in, append their ID to the URL for tracking
        if (currentUser) {
            // We use 'window.location.href' approach but for Gumroad Overlay, 
            // the script intercepts clicks on <a> tags. 
            // So ideally we render an <a> tag. 
            // However, since we are in a button handler, we can programmatically open it 
            // or better yet, just update the button to be an <a> tag in the JSX.
            // But to keep structure, we can manually trigger or redirect if overlay fails.

            // Construct URL with custom fields (passed as URL params)
            // Gumroad allows passing params like ?email=... and custom fields
            const targetUrl = `${gumroadUrl}?email=${encodeURIComponent(currentUser.email || '')}&user_id=${currentUser.id}`;

            // Programmatic click equivalent or just setting location (Gumroad script intercepts specific class/attr if present)
            // Actually, for the Overlay to work reliably with the script, it's best to use an <a> tag.
            // We will modify the button in the JSX below to be an <a> tag if possible, 
            // or just window.open which Gumroad might catch if configured, 
            // but standard behavior is <a href="..." data-gumroad-overlay>

            // Fallback for now: redirect to the link. 
            // If the script is loaded, it might intercept this navigation if it was a link click, 
            // but navigation change via JS might NOT be intercepted as an overlay.
            // WE NEED TO CHANGE THE BUTTON TO AN ANCHOR TAG in the JSX.
            window.location.href = targetUrl;
            return;
        }

        // 2. If not logged in, suggest logging in first
        localStorage.setItem('pending_plan', 'monthly');
        setTimeout(() => {
            setIsLoading(false);
            if (onAuthRequired) {
                onAuthRequired();
            }
        }, 600);
    };

    return (
        <div className={`relative w-full max-w-sm mx-auto ${className}`}>
            {/* Glow Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-b from-indigo-500/20 to-transparent rounded-2xl md:rounded-3xl blur-sm -z-10" />

            <div className="relative w-full bg-[#09090b] border border-zinc-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col">

                {/* Header / Banner */}
                <div className="relative h-32 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

                    {/* Dark Mode Aesthetic Highlight */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full" />

                    <div className="absolute bottom-6 left-6 md:left-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                All-Access
                            </span>
                            {isAnnual && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                >
                                    Best Value
                                </motion.span>
                            )}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Pro Plan</h2>
                    </div>

                    {showCloseButton && onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">

                    {/* Toggle Switch */}
                    <div className="self-center flex items-center justify-center p-1 bg-zinc-900 rounded-full border border-zinc-800 mb-8">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${!isAnnual ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${isAnnual ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Annual
                        </button>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8">
                        <div className="flex items-end justify-center gap-1.5">
                            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                {isAnnual ? '$50' : '$5'}
                            </span>
                            <span className="text-zinc-500 font-medium mb-2">
                                /{isAnnual ? 'year' : 'month'}
                            </span>
                        </div>
                        <AnimatePresence mode="wait">
                            {isAnnual ? (
                                <motion.p
                                    key="annual-sub"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-emerald-400 text-xs font-medium mt-2"
                                >
                                    2 months free included
                                </motion.p>
                            ) : (
                                <motion.p
                                    key="monthly-sub"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-zinc-600 text-xs font-medium mt-2"
                                >
                                    Flexible. Cancel anytime.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Features (Power Verbs) */}
                    <div className="space-y-4 mb-10">
                        {[
                            { text: 'Unlock unlimited AI Focus sessions', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                            { text: 'Automate cognitive load fatigue detection', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { text: 'Access deep-dive focus analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
                            { text: 'Sync context across all devices', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' },
                            { text: 'Priority support & feature access', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="flex items-start gap-3"
                            >
                                <div className="mt-0.5 min-w-[20px] h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-zinc-300 text-sm font-light leading-snug">
                                    {feature.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                        <motion.a
                            href={currentUser ? `https://ytterbiumlife.gumroad.com/l/ccmqg?email=${encodeURIComponent(currentUser.email || '')}&user_id=${currentUser.id}` : '#'}
                            data-gumroad-overlay="true"
                            onClick={handleCheckout}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            className="gumroad-button w-full relative overflow-hidden group py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold uppercase tracking-widest text-xs shadow-lg border border-indigo-400/20 block text-center flex items-center justify-center cursor-pointer"
                        >
                            <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                {isAnnual ? 'Start Scaling Now' : 'Get Instant Access'}
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                            {/* Loading Spinner */}
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </motion.a>

                        <div className="mt-4 flex items-center justify-center gap-4 opacity-50">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                </svg>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">30-Day Guarantee</span>
                            </div>
                            <div className="w-px h-3 bg-zinc-700" />
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Secure Payment</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
