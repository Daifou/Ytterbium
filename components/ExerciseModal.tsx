import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Exercise {
    emoji: string;
    label: string;
    description: string;
    duration: number;
    animationType: 'breathing' | 'eye' | 'posture' | 'stretch' | 'sunlight' | 'neck' | 'silence';
}

interface ExerciseModalProps {
    exercise: Exercise;
    onClose: () => void;
}

const MotionDiv = motion.div as any;

export const ExerciseModal: React.FC<ExerciseModalProps> = ({ exercise, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(exercise.duration);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

    useEffect(() => {
        if (timeLeft <= 0) {
            onClose();
            return;
        }
        const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, onClose]);

    // Breathing cycle for breathing exercise
    useEffect(() => {
        if (exercise.animationType === 'breathing') {
            const cycle = setInterval(() => {
                setPhase(p => p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale');
            }, 4000);
            return () => clearInterval(cycle);
        }
    }, [exercise.animationType]);

    const renderAnimation = () => {
        switch (exercise.animationType) {
            case 'breathing':
                return (
                    <div className="relative mb-8 flex items-center justify-center">
                        <MotionDiv
                            className={`w-48 h-48 rounded-full border-2 border-indigo-500/30 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${phase === 'inhale' ? 'scale-110 bg-indigo-900/20' :
                                    phase === 'exhale' ? 'scale-90 bg-transparent' :
                                        'scale-100 bg-indigo-900/10'
                                }`}
                        >
                            <MotionDiv
                                className={`w-24 h-24 rounded-full bg-indigo-500/20 blur-xl transition-all duration-[4000ms] ${phase === 'inhale' ? 'scale-150 opacity-80' : 'scale-100 opacity-40'
                                    }`}
                            />
                            <span className="absolute text-indigo-200 font-medium text-lg tracking-widest uppercase">
                                {phase}
                            </span>
                        </MotionDiv>
                    </div>
                );

            case 'eye':
                return (
                    <div className="relative mb-8 w-64 h-64 mx-auto border-2 border-indigo-500/20 rounded-lg flex items-center justify-center">
                        <MotionDiv
                            className="w-4 h-4 bg-indigo-500 rounded-full"
                            animate={{
                                x: [0, 80, 80, -80, -80, 0],
                                y: [0, 0, 60, 60, -60, 0]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                );

            case 'posture':
                return (
                    <div className="relative mb-8 flex items-center justify-center">
                        <MotionDiv
                            className="w-32 h-48 border-2 border-indigo-500/30 rounded-full relative"
                            animate={{ rotate: [0, 2, -2, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-500/20 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-12 h-16 bg-indigo-500/10 rounded-lg" />
                        </MotionDiv>
                    </div>
                );

            case 'stretch':
                return (
                    <div className="relative mb-8 flex items-center justify-center h-48">
                        {[1, 2, 3].map((i) => (
                            <MotionDiv
                                key={i}
                                className="absolute w-32 h-32 border-2 border-indigo-500/30 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 0, 0.5]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 1
                                }}
                            />
                        ))}
                    </div>
                );

            case 'sunlight':
                return (
                    <div className="relative mb-8 flex items-center justify-center h-48">
                        <MotionDiv
                            className="w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity
                            }}
                        />
                        <div className="absolute text-6xl">☀️</div>
                    </div>
                );

            case 'neck':
                return (
                    <div className="relative mb-8 flex items-center justify-center h-48">
                        <MotionDiv
                            className="w-24 h-24 border-4 border-indigo-500/30 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full" />
                        </MotionDiv>
                    </div>
                );

            case 'silence':
                return (
                    <div className="relative mb-8 flex items-center justify-center h-48 gap-1">
                        {[1, 2, 3, 4, 5].map((bar) => (
                            <MotionDiv
                                key={bar}
                                className="w-2 bg-indigo-500/60 rounded-full"
                                animate={{
                                    height: [20, 60, 20],
                                    opacity: [0.4, 0.9, 0.4]
                                }}
                                transition={{
                                    duration: 1 + Math.random(),
                                    repeat: Infinity,
                                    delay: bar * 0.1
                                }}
                            />
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Modal Card */}
                <MotionDiv
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    className="relative max-w-2xl w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Emoji */}
                    <div className="text-6xl text-center mb-4">
                        {exercise.emoji}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-2">
                        {exercise.label}
                    </h2>

                    {/* Description */}
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        {exercise.description}
                    </p>

                    {/* Animation */}
                    {renderAnimation()}

                    {/* Timer */}
                    <div className="text-4xl font-light text-indigo-400 font-mono text-center mb-8">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>

                    {/* Resume Focus Button */}
                    <button
                        onClick={onClose}
                        className="w-full max-w-xs mx-auto block bg-gray-100 hover:bg-white dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Resume Focus
                    </button>
                </MotionDiv>
            </MotionDiv>
        </AnimatePresence>
    );
};
