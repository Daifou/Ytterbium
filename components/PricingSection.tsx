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
        <section id="pricing" className="relative py-32 md:py-40 w-full overflow-hidden bg-[#09090b] text-white">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    {/* Background Grid */}
                    <div className="absolute inset-0 pointer-events-none -z-10"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
                            `,
                            backgroundSize: '60px 60px',
                            maskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 80%)'
                        }}
                    />

                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
                        Invest in your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300">
                            Cognitive Capital.
                        </span>
                    </h2>
                </motion.div>

                {/* Pricing Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-32"
                >
                    <PricingCard currentUser={currentUser} onAuthRequired={onAuthRequired} />
                </motion.div>

                {/* Testimonials */}
                <div className="border-t border-white/[0.08] pt-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                quote: "My deep work blocks doubled. Pays for itself in one morning.",
                                author: "Alex D.",
                                role: "Senior Engineer",
                                initials: "AD",
                                color: "bg-[#71717a]" // Zinc-500 neutral
                            },
                            {
                                quote: "Stops me before I crash. Saves my entire afternoon.",
                                author: "Sarah K.",
                                role: "Product Designer",
                                initials: "SK",
                                color: "bg-[#a1a1aa]" // Zinc-400 lighter
                            },
                            {
                                quote: "Clean UI keeps me in flow. Simple and effective.",
                                author: "James M.",
                                role: "Writer",
                                initials: "JM",
                                color: "bg-[#52525b]" // Zinc-600 darker
                            }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <svg key={j} className="w-4 h-4 text-white/60 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-zinc-200 text-[14px] leading-relaxed mb-5">
                                    "{t.quote}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.color} text-white text-xs font-medium tracking-wider shadow-inner`}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className="text-white text-[13px] font-semibold">{t.author}</div>
                                        <div className="text-zinc-500 text-[11px]">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
