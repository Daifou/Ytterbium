import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AIOptimizedIndicatorProps {
    currentInsight: string;
}

/**
 * A fixed, minimalist indicator for AI activity, placed in the top right.
 */
export const AIOptimizedIndicator: React.FC<AIOptimizedIndicatorProps> = ({ currentInsight }) => {
    return (
        <MotionDiv
            // Position fixed to the top-right corner.
            // Adjusted from top-6 to top-10 (40px) to align it visually lower, 
            // closer to the 'Ytterbium' logo's baseline.
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="absolute top-6 right-8 z-[60] pointer-events-auto"
        >
            <div
                className="px-4 py-2 bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-full shadow-lg flex items-center gap-2 cursor-default transition-all duration-300 hover:ring-2 ring-emerald-400/30"
                title={currentInsight}
            >

                {/* The Signaling Circle Component */}
                <div className="relative flex items-center justify-center h-3 w-3">
                    {/* Pulsing Ring (Subtle Signal) */}
                    <motion.div
                        animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.5, 0.2, 0.5]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute h-full w-full rounded-full bg-emerald-400/70"
                    />

                    {/* Inner Circle (solid light green) */}
                    <div className="relative h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                </div>

                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest leading-none">
                    AI-Enhanced
                </span>
            </div>
        </MotionDiv>
    );
};