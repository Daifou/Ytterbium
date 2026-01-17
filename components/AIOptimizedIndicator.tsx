import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AIOptimizedIndicatorProps {
    currentInsight: string;
}

export const AIOptimizedIndicator: React.FC<AIOptimizedIndicatorProps> = ({ currentInsight }) => {
    return (
        <MotionDiv
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.5 }}
            className="absolute top-8 right-8 z-[60] pointer-events-auto"
        >
            <div
                className="px-3 py-1.5 bg-[#050505]/80 backdrop-blur-md border border-white/[0.05] rounded-full shadow-lg flex items-center gap-2 cursor-default transition-all duration-300 hover:border-white/[0.1]"
                title={currentInsight}
            >
                {/* SIGNAL BEACON */}
                <div className="relative flex items-center justify-center h-2 w-2">
                    <motion.div
                        animate={{
                            scale: [1, 2, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute h-full w-full rounded-full bg-[#00FF85]/50"
                    />
                    <div className="relative h-1 w-1 rounded-full bg-[#00FF85] shadow-[0_0_4px_#00FF85]"></div>
                </div>

                <span className="text-[9px] font-medium text-white/60 uppercase tracking-[0.2em] leading-none">
                    AI Active
                </span>
            </div>
        </MotionDiv>
    );
};