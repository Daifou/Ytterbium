import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    const [isAnnual, setIsAnnual] = useState(false);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-lg relative bg-[#09090b] border border-zinc-800 md:rounded-3xl rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header Image / Gradient */}
                    <div className="h-32 bg-gradient-to-br from-zinc-800/50 via-zinc-900/30 to-black relative">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                        <div className="absolute bottom-6 left-8">
                            <div className="px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-md text-xs font-medium text-zinc-50 inline-block mb-2">
                                Limit Reached
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-50">Unlock Ytterbium</h2>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                            You've completed your 3 free focus sessions. To continue optimizing your cognitive performance with AI, upgrade to Pro.
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <span className={`text-sm font-medium ${!isAnnual ? 'text-zinc-50' : 'text-zinc-500'}`}>Monthly</span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="w-12 h-6 rounded-full bg-zinc-900 border border-zinc-800 relative transition-colors duration-200"
                            >
                                <motion.div
                                    className="w-4 h-4 rounded-full bg-zinc-50 absolute top-1 left-1"
                                    animate={{ x: isAnnual ? 24 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                            <span className={`text-sm font-medium ${isAnnual ? 'text-zinc-50' : 'text-zinc-500'}`}>Yearly</span>
                            {isAnnual && (
                                <span className="text-xs text-emerald-400 font-medium bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                    Save 33%
                                </span>
                            )}
                        </div>

                        {/* Price Display */}
                        <div className="text-center mb-8">
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl font-black text-zinc-50">
                                    ${isAnnual ? '120' : '15'}
                                </span>
                                <span className="text-zinc-500 text-lg">
                                    / {isAnnual ? 'year' : 'month'}
                                </span>
                            </div>
                            <p className="text-zinc-500 text-xs mt-2">
                                First 3 sessions included. Cancel anytime.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 mb-8">
                            {['Unlimited AI Focus Sessions', 'Advanced Cognitive Analytics', 'Cloud Sync & History'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
                                        <svg className="w-3 h-3 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-zinc-400 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            className="w-full py-4 rounded-xl bg-zinc-50 text-zinc-950 font-bold text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl"
                        >
                            Subscribe Now
                        </button>
                        <p className="text-center text-zinc-600 text-xs mt-4">
                            Secure payment via Stripe.
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
