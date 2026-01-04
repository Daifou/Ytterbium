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
        <section id="pricing" className="relative py-24 md:py-32 w-full overflow-hidden bg-black text-white">

            {/* Background Gradients */}
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6">
                            Invest in your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300">
                                Cognitive Capital.
                            </span>
                        </h2>
                        <p className="text-lg text-zinc-400 font-light leading-relaxed">
                            Stop burning out. Start working with biological precision.
                            The cost of a coffee for a month of peak performance.
                        </p>
                    </motion.div>
                </div>

                {/* Pricing Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mb-24"
                >
                    <PricingCard currentUser={currentUser} onAuthRequired={onAuthRequired} />
                </motion.div>

                {/* Testimonials / Social Proof */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-zinc-900 pt-16">
                    {[
                        {
                            quote: "Since using Ytterbium, my deep work blocks have doubled. It pays for itself in one morning.",
                            author: "Alex D.",
                            role: "Senior Engineer"
                        },
                        {
                            quote: "The fatigue detection is specific. It stops me before I crash, which saves my entire afternoon.",
                            author: "Sarah K.",
                            role: "Product Designer"
                        },
                        {
                            quote: "Simple, beautiful, and effective. It’s the cleanliness of the UI that keeps me in flow.",
                            author: "James M.",
                            role: "Writer"
                        }
                    ].map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                            className="space-y-4"
                        >
                            <div className="flex text-indigo-500 mb-2">
                                {[...Array(5)].map((_, j) => (
                                    <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-zinc-300 text-sm leading-relaxed italic">"{t.quote}"</p>
                            <div>
                                <div className="text-white text-xs font-bold uppercase tracking-wider">{t.author}</div>
                                <div className="text-zinc-600 text-[10px] uppercase tracking-wider">{t.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};
