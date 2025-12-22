import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react'; // Icon for the duration cue

interface ExerciseCardProps {
    emoji: string;
    label: string;
    isHighlighted?: boolean;
    scale?: number;
    duration?: number; // Added duration property (in seconds)
}

// NOTE: colorMap is now ONLY used to determine the passive border/background on hover, 
// ensuring a clean, dark-glass aesthetic in the default state.
const colorMap: { [key: string]: { passiveBg: string, passiveBorder: string } } = {
    '👁️': { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' }, // Pure glass-dark
    '🧍': { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' }, // Pure glass-dark
    '💨': { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' }, // Pure glass-dark
    '🧘': { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' }, // Pure glass-dark
    '🌞': { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' }, // Pure glass-dark
    '🌀': { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' }, // Pure glass-dark
    '🎧': { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' }, // Pure glass-dark
};

const formatTime = (seconds: number | undefined) => {
    if (typeof seconds !== 'number' || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};


export const ExerciseCard: React.FC<ExerciseCardProps> = ({
    emoji,
    label,
    isHighlighted = false,
    scale = 1,
    duration
}) => {
    const neutralStyles = colorMap[emoji] || { passiveBg: 'bg-white/5 hover:bg-white/10', passiveBorder: 'border-white/10' };

    // Conditional styling for the TaskList look: solid Indigo on highlight, pure glass otherwise.
    const finalClasses = isHighlighted
        ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/50 text-white' // Solid Indigo Accent
        : `${neutralStyles.passiveBg} ${neutralStyles.passiveBorder} text-white/80`; // Minimalist Dark Glass

    return (
        <motion.div
            animate={{
                scale: isHighlighted ? 1.05 : scale,
                boxShadow: isHighlighted
                    ? '0 8px 24px rgba(99, 102, 241, 0.4)' // Indigo Glow
                    : '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
            whileHover={{ scale: 1.05 }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25
            }}
            className={`
                relative flex flex-col items-center justify-center
                ${finalClasses} /* Dynamic colors based on TaskList style */
                backdrop-blur-sm
                border
                rounded-xl
                p-2.5 /* TIGHTER PADDING for maximum compactness */
                transition-all duration-300
                shadow-md
            `}
            style={{
                minHeight: '80px', /* MAX COMPACT HEIGHT */
            }}
        >
            {/* Emoji Icon */}
            <div className={`text-2xl mb-0.5 select-none`}>
                {emoji}
            </div>

            {/* Label */}
            <div className={`text-xs font-medium text-center leading-tight ${isHighlighted ? '' : 'text-white/90'}`}>
                {label}
            </div>

            {/* Subtle Timer Cue (Stove Clock Look) */}
            {duration !== undefined && (
                <div className={`absolute top-1 right-2 flex items-center space-x-0.5 text-[10px] font-semibold ${isHighlighted ? 'text-white/80' : 'text-white/50'}`}>
                    <Clock size={10} strokeWidth={2.5} />
                    <span>{formatTime(duration)}</span>
                </div>
            )}
        </motion.div>
    );
};