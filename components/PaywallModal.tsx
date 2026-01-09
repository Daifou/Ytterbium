import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PricingCard } from './PricingCard';

interface PaywallModalProps {
    isOpen: boolean;
    onAuth: (isAnnual: boolean) => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onAuth }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    {/* Backdrop with heavy blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[12px]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative z-10 w-full max-w-lg"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                                Your AI Focus Plan is Ready.
                            </h2>
                            <p className="text-zinc-400 text-lg">
                                Sign in to save your result and unlock your sessions.
                            </p>
                        </div>

                        <PricingCard
                            isCompact={true}
                            isAuthMode={true}
                            onAuth={onAuth}
                            className="!shadow-2xl"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
