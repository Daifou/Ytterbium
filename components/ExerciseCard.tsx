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

// Map exercises to soft, pastel-like colors (Tailwind classes)
const colorMap: { [key: string]: string } = {
    '👁️': 'bg-blue-300/20 hover:bg-blue-300/30 border-blue-400/30',      // Blue for Eye Refresh
    '🧍': 'bg-green-300/20 hover:bg-green-300/30 border-green-400/30',    // Green for Posture Reset
    '💨': 'bg-teal-300/20 hover:bg-teal-300/30 border-teal-400/30',      // Teal for Breathing
    '🧘': 'bg-purple-300/20 hover:bg-purple-300/30 border-purple-400/30',  // Purple for Stretch Pulse
    '🌞': 'bg-orange-300/20 hover:bg-orange-300/30 border-orange-400/30',  // Orange for Sunlight
    '🌀': 'bg-pink-300/20 hover:bg-pink-300/30 border-pink-400/30',      // Pink for Neck Rotation
    '🎧': 'bg-gray-300/20 hover:bg-gray-300/30 border-gray-400/30',      // Gray for Silence Mode
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
    const pastelColor = colorMap[emoji] || 'bg-white/20 hover:bg-white/30 border-white/20';

    return (
        <motion.div
            animate={{
                scale: isHighlighted ? 1.05 : scale, // Increased scale on highlight for playful pulse
                boxShadow: isHighlighted
                    ? '0 8px 24px rgba(129, 140, 248, 0.4)' // Soft blue glow
                    : '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
            whileHover={{ scale: 1.05 }} // Playful hover pulse
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25
            }}
            className={`
                relative flex flex-col items-center justify-center
                ${pastelColor} /* Pastel Background & Hover */
                backdrop-blur-sm
                border
                rounded-xl
                p-3.5 /* Slightly adjusted padding for compact look */
                transition-all duration-300
                text-white/80
                shadow-md
                ${isHighlighted ? 'ring-2 ring-indigo-400/70' : ''}
            `}
            style={{
                minHeight: '96px', /* Kept compact size */
            }}
        >
            {/* Emoji Icon */}
            <div className="text-2xl mb-1 select-none">
                {emoji}
            </div>

            {/* Label */}
            <div className="text-xs text-white/90 font-medium text-center leading-tight">
                {label}
            </div>

            {/* Subtle Timer Cue (Stove Clock Look) */}
            {duration !== undefined && (
                <div className="absolute top-1 right-2 flex items-center space-x-0.5 text-[10px] font-semibold text-white/50">
                    <Clock size={10} strokeWidth={2.5} />
                    <span>{formatTime(duration)}</span>
                </div>
            )}


            {/* Highlight Glow Effect */}
            {isHighlighted && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-indigo-500/10 rounded-xl pointer-events-none"
                />
            )}
        </motion.div>
    );
};