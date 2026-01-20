import React from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from './PricingCard';
import type { User } from '@supabase/supabase-js';

interface PricingSectionProps {
    currentUser?: User | null;
    onAuthRequired?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ currentUser, onAuthRequired }) => {
    return (
        <section id="pricing" className="relative py-24 md:py-32 w-full overflow-hidden bg-[#09090b] text-white">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Pricing Card Container */}
                <div className="flex justify-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-5xl overflow-visible"
                    >
                        {/* Section Header */}
                        <div className="relative z-10 text-center py-16 overflow-hidden">
                            {/* Subtle gradient backdrop */}
                            <div className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to right, rgba(255,77,0,0.02) 1px, transparent 1px),
                                        linear-gradient(to bottom, rgba(255,77,0,0.02) 1px, transparent 1px)
                                    `,
                                    backgroundSize: '50px 50px',
                                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
                                    WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
                                }}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="max-w-2xl mx-auto px-6"
                            >
                                <h2 className="text-4xl md:text-[48px] font-semibold text-white tracking-tight leading-tight mb-3">
                                    Invest in your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] via-[#FF6B2C] to-[#FF4D00]">
                                        Cognitive Capital
                                    </span>
                                </h2>
                                <p className="text-zinc-500 text-[14px] leading-relaxed">
                                    Professional optimization. No compromises.
                                </p>
                            </motion.div>
                        </div>

                        {/* Pricing Card Section */}
                        <div className="relative z-10 w-full pb-20 flex justify-center">
                            <PricingCard currentUser={currentUser} onAuthRequired={onAuthRequired} />
                        </div>
                    </motion.div>
                </div>

                {/* Testimonials / Social Proof Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-zinc-900/50 pt-20">
                    {[
                        {
                            quote: "My deep work blocks doubled. It pays for itself in one morning.",
                            author: "Alex D.",
                            role: "Senior Engineer"
                        },
                        {
                            quote: "The fatigue detection stops me before I crash. Saves my entire afternoon.",
                            author: "Sarah K.",
                            role: "Product Designer"
                        },
                        {
                            quote: "Simple, beautiful, effective. The clean UI keeps me in flow.",
                            author: "James M.",
                            role: "Writer"
                        }
                    ].map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                            className="group relative p-6 rounded-2xl border border-zinc-900/50 bg-zinc-950/30 hover:border-zinc-800/60 hover:bg-zinc-900/20 transition-all duration-300"
                        >
                            {/* Subtle gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00]/[0.01] to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="relative space-y-4">
                                {/* Star Rating */}
                                <div className="flex text-[#FF4D00] gap-0.5">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-zinc-300 text-[14px] leading-relaxed font-normal">
                                    "{t.quote}"
                                </p>

                                {/* Author */}
                                <div className="pt-2 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-zinc-800/50 border border-zinc-800" />
                                    <div>
                                        <div className="text-white text-[13px] font-semibold">{t.author}</div>
                                        <div className="text-zinc-600 text-[11px] font-normal">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
