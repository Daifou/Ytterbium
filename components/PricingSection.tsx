import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from './PricingCard';
import type { User } from '@supabase/supabase-js';

interface PricingSectionProps {
    currentUser?: User | null;
    onAuthRequired?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ currentUser, onAuthRequired }) => {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section id="pricing" className="relative py-24 md:py-32 w-full overflow-hidden bg-[#050505] text-white">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            Simple, transparent pricing
                        </h2>
                        <p className="text-lg text-zinc-400 font-light">
                            Invest in your focus. Cancel anytime.
                        </p>
                    </motion.div>

                    {/* Toggle Switch */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-10 flex items-center justify-center gap-4"
                    >
                        <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-12 h-6 rounded-full bg-zinc-800 p-1 transition-colors hover:bg-zinc-700"
                        >
                            <motion.div
                                animate={{ x: isAnnual ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="w-4 h-4 rounded-full bg-white shadow-sm"
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>Annual</span>
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                                Save 20%
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Pricing Card Container with Grid */}
                <div className="flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-[1000px] border border-white/5 bg-[#09090b] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Clipped Grid Background */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '40px 40px',
                                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
                                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
                                }}
                            />
                        </div>

                        {/* Pricing Card (Docked to the grid) */}
                        <div className="relative z-10 w-full py-12 md:py-20 px-6 flex justify-center">
                            <PricingCard 
                                currentUser={currentUser} 
                                onAuthRequired={onAuthRequired} 
                                isAnnualProp={isAnnual}
                                className="!border-0 !bg-transparent !shadow-none" 
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
