import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { PricingCard } from './PricingCard';
import { X } from 'lucide-react';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAuth: (isAnnual: boolean) => void;
    currentUser: User | null;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose, onAuth, currentUser }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop with heavy blur and darker tint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="relative z-10 w-full max-w-[380px]"
                    >
                        {/* Close button in top right area of the space, but within the card usually looks better for this 'cute' look */}
                        <div className="absolute -top-12 right-0 md:-right-12">
                            <button
                                onClick={onClose}
                                className="p-2 text-zinc-500 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <PricingCard
                            isCompact={true}
                            isAuthMode={true}
                            onAuth={onAuth}
                            currentUser={currentUser}
                            className="!shadow-2xl"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
