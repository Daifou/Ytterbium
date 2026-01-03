import React from 'react';
import { motion } from 'framer-motion';

interface CountdownNotificationProps {
    countdown: number;
}

export const CountdownNotification: React.FC<CountdownNotificationProps> = ({ countdown }) => {
    console.log("[CountdownNotification] rendering with countdown:", countdown);
    return (
        <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.9 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                mass: 0.8
            }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]"
        >
            {/* Mac-style Notification Card */}
            <div className="relative group">
                {/* Subtle outer glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Main notification container */}
                <div className="relative bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

                    {/* Content */}
                    <div className="relative px-6 py-4 flex items-center gap-4">
                        {/* Left: Pulsing indicator */}
                        <div className="relative flex-shrink-0">
                            {/* Outer pulse ring */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.4, 1],
                                    opacity: [0.4, 0, 0.4]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                                className="absolute inset-0 rounded-full bg-indigo-400/40 blur-md"
                            />

                            {/* Icon container */}
                            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                {/* Inner glow */}
                                <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-indigo-400/10 to-transparent" />

                                {/* Animated dot */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                    className="relative w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-300 shadow-[0_0_12px_rgba(129,140,248,0.6)]"
                                />
                            </div>
                        </div>

                        {/* Center: Text content */}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-semibold text-white/95 tracking-wide mb-0.5 leading-tight">
                                Prepare yourself
                            </h4>
                            <p className="text-[10px] text-white/50 font-medium tracking-wide leading-tight">
                                Focus session starting soon
                            </p>
                        </div>

                        {/* Right: Countdown number */}
                        <div className="flex-shrink-0">
                            <motion.div
                                key={countdown}
                                initial={{ scale: 1.3, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 20
                                }}
                                className="relative"
                            >
                                {/* Number glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/40 to-purple-400/40 blur-xl rounded-full" />

                                {/* Number */}
                                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-3xl font-bold bg-gradient-to-br from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent tabular-nums">
                                        {countdown}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom progress bar */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, ease: 'linear' }}
                        className="h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left"
                    />
                </div>
            </div>
        </motion.div>
    );
};
