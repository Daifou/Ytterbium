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
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="relative z-10 w-full max-w-md"
                    >
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
