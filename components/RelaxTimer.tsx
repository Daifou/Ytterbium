import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, PlusCircle, RotateCcw } from 'lucide-react';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseModal } from './ExerciseModal';

// Re-aliasing motion.div for cleaner use
const MotionDiv = motion.div;

interface Exercise {
  emoji: string;
  label: string;
  description: string;
  duration: number; // in seconds
  animationType: 'breathing' | 'eye' | 'posture' | 'stretch' | 'sunlight' | 'neck' | 'silence';
}

interface RelaxTimerProps {
  onComplete: () => void;
  fatigueScore: number;
}

// Re-ordered exercises to match the requested 3x3 layout organization
const exercises: Exercise[] = [
  // Top Row
  { emoji: '👁️', label: 'Eye Refresh', description: 'Relax eye muscles.', duration: 120, animationType: 'eye' },
  { emoji: '🧍', label: 'Posture Reset', description: 'Align spine and shoulders.', duration: 180, animationType: 'posture' },
  { emoji: '💨', label: 'Breathing', description: 'Deep breathing exercise.', duration: 240, animationType: 'breathing' },
  // Middle Row
  { emoji: '🧘', label: 'Stretch Pulse', description: 'Release muscle tension.', duration: 180, animationType: 'stretch' },
  { emoji: '🌞', label: 'Sunlight', description: 'Reset circadian rhythm.', duration: 60, animationType: 'sunlight' },
  { emoji: '🌀', label: 'Neck Rotation', description: 'Improve neck mobility.', duration: 120, animationType: 'neck' },
  // Bottom Row
  { emoji: '🎧', label: 'Silence Mode', description: 'A moment of stillness.', duration: 180, animationType: 'silence' },
];

// Helper function to format seconds to M:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// PRIMARY COLOR FOR SMALL ACTIONS: Single color for contrast on smaller buttons.
const PRIMARY_ACCENT = 'bg-sky-600 hover:bg-sky-500';

// 🎨 REFINED GLOW: Soft, integrated white/gray luminescence (Apple/Pro aesthetic)
const FUTURISTIC_GLOW = 'shadow-lg shadow-white/10';


export const RelaxTimer: React.FC<RelaxTimerProps> = ({ onComplete }) => {
  const [isRouletteActive, setIsRouletteActive] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [rouletteIndex, setRouletteIndex] = useState(-1);
  const [isGridShrunk, setIsGridShrunk] = useState(false);
  // State for the new control bar features
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerDuration, setTimerDuration] = useState(180); // Default 3 minutes

  const startRoulette = useCallback(() => {
    if (isRouletteActive) return;

    setIsRouletteActive(true);
    setIsGridShrunk(true);

    let currentIndex = 0;
    let speed = 80;
    const maxSpeed = 400;
    const acceleration = 1.12;
    let iterations = 0;
    const minIterations = 15;

    const animate = () => {
      setRouletteIndex(currentIndex);
      currentIndex = (currentIndex + 1) % exercises.length;
      speed = Math.min(speed * acceleration, maxSpeed);
      iterations++;

      if (speed < maxSpeed || iterations < minIterations) {
        setTimeout(animate, speed);
      } else {
        setTimeout(() => {
          const finalIndex = Math.floor(Math.random() * exercises.length);
          setRouletteIndex(finalIndex);
          setTimerDuration(exercises[finalIndex].duration); // Set duration based on selected exercise

          setTimeout(() => {
            setSelectedExercise(exercises[finalIndex]);
            setIsRouletteActive(false);
          }, 500);
        }, 300);
      }
    };

    animate();
  }, [isRouletteActive]);

  const handleCloseModal = () => {
    setSelectedExercise(null);
    setIsGridShrunk(false);
    setRouletteIndex(-1);
    setIsTimerRunning(false); // Ensure timer state is reset
    onComplete();
  };

  // New control bar handlers
  const toggleTimer = () => setIsTimerRunning(prev => !prev);
  const addOneMinute = () => setTimerDuration(prev => prev + 60);
  const resetTimer = () => setTimerDuration(selectedExercise?.duration || exercises[0].duration); // Reset to default or selected

  return (
    // Outer container: **REMOVED** the conflicting h-full and min-h-screen properties.
    // **REVERTED** justify-center to justify-start, relying on App.tsx for centering.
    <div className="flex flex-col items-center justify-start 
                    max-w-sm mx-auto 
                    bg-zinc-900/70 backdrop-blur-2xl 
                    rounded-[30px] shadow-2xl p-4 
                    border border-white/10 
                    text-white
                    // The centering is now handled by the App.tsx parent component, making the alignment perfect.
                    animate-in fade-in duration-700"
    >
      {/* Inner wrapper (This is the block being centered by the App component) */}
      <div className="flex flex-col items-center">
        {/* Exercise Grid Area */}
        <MotionDiv
          animate={{
            scale: isGridShrunk ? 0.95 : 1,
            opacity: isRouletteActive ? 0.8 : 1
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative z-20 w-full"
        >
          {/* 3x3 Grid: Tight layout (grid-cols-3, gap-3) */}
          <div className="grid grid-cols-3 gap-3 w-full">
            {exercises.map((exercise, index) => (
              // Kinetic Card Wrapper
              <MotionDiv
                key={index}
                onClick={startRoulette}
                className="cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ExerciseCard
                  // ExerciseCard should still maintain a clear, dark/glassy style internally
                  emoji={exercise.emoji}
                  label={exercise.label}
                  isHighlighted={rouletteIndex === index}
                  scale={selectedExercise?.label === exercise.label ? 1.1 : 1}
                  duration={exercise.duration}
                />
              </MotionDiv>
            ))}

            {/* Empty Slot 1 (Bottom Row, Middle) */}
            <div className="opacity-0 pointer-events-none">
              <div className='min-h-[96px]' />
            </div>

            {/* Status/Timer Card (Sharper Digital Display Screen) */}
            <div className="relative flex flex-col items-center justify-center min-h-[96px] 
              bg-white/5 backdrop-blur-md rounded-xl p-3 
              border border-white/10 text-white shadow-inner 
              shadow-black/20"
            >
              <span className="text-sm font-light mb-1 text-white/70">Total Time</span>
              <span className="text-2xl font-extrabold text-sky-400 drop-shadow-lg">
                {formatTime(timerDuration)}
              </span>
              <span className="text-xs mt-1 font-light text-white/50">Select above</span>
            </div>

          </div>
        </MotionDiv>

        {/* Control Bar (Sharper, Defined Glass Strip - iOS Tab Bar style) */}
        <div className="w-full mt-5 flex items-center justify-between 
          bg-white/5 rounded-2xl p-2.5 
          backdrop-blur-md border border-white/10"
        >

          {/* Left Controls: Play/Pause, Reset (Minimalist/Pro) */}
          <div className="flex space-x-2">
            <MotionDiv whileTap={{ scale: 0.85 }}>
              <button
                onClick={toggleTimer}
                // Single color accent for contrast
                className={`p-2 rounded-xl ${PRIMARY_ACCENT} text-white transition-colors disabled:opacity-50`}
                disabled={!selectedExercise}
                aria-label={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
              >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </MotionDiv>
            <MotionDiv whileTap={{ scale: 0.85 }}>
              <button
                onClick={resetTimer}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Reset Timer"
              >
                <RotateCcw size={18} />
              </button>
            </MotionDiv>
          </div>

          {/* Center Button: Select Exercise (LIGHT, FUTURISTIC, COMPACT BUTTON) */}
          <MotionDiv
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <button
              onClick={startRoulette}
              disabled={isRouletteActive}
              className={`
                // PADDING & FONT WEIGHT: Compact and Pro (Apple/ChatGPT style)
                px-5 py-2 
                text-sm font-semibold
                
                // NEW LIGHT GLASS AESTHETIC
                bg-white/15 backdrop-blur-sm // Light, high-opacity glass
                text-white
                
                rounded-3xl 
                
                // BORDER & SHADOW: Subtle inner shadow for depth, clean outer shadow for lift
                border border-white/20 // Clean definition
                shadow-inner shadow-white/10 // Subtle inner highlight
                shadow-md shadow-black/50 // Base lift shadow
                
                // 🎨 REFINED GLOW ON HOVER
                hover:bg-white/20
                hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] // Soft, ambient white glow
                ${FUTURISTIC_GLOW}

                transition-all duration-300 ease-in-out
                disabled:opacity-50 disabled:cursor-not-allowed
                
                // 🎨 REFINED ACTIVE STATE VISUALS (When Selecting)
                ${isRouletteActive
                  ? 'animate-pulse ring-2 ring-white/70 shadow-[0_0_15px_rgba(255,255,255,0.7)]'
                  : ''}
              `}
            >
              {isRouletteActive ? 'Selecting...' : 'Select Exercise'}
            </button>
          </MotionDiv>

          {/* Right Controls: Add Time (Minimalist/Pro) */}
          <div className="flex space-x-2">
            <MotionDiv whileTap={{ scale: 0.85 }}>
              <button
                onClick={addOneMinute}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Add 1 Minute"
              >
                <PlusCircle size={18} />
              </button>
            </MotionDiv>
          </div>
        </div>
      </div>


      {/* Exercise Modal */}
      {selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};