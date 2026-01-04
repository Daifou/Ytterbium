import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PricingCard } from './PricingCard';
import type { User } from '@supabase/supabase-js';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser?: User | null;
    onAuthRequired?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentUser, onAuthRequired }) => {
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
                    className="w-full max-w-sm"
                >
                    <PricingCard
                        showCloseButton={true}
                        onClose={onClose}
                        currentUser={currentUser}
                        onAuthRequired={onAuthRequired}
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

