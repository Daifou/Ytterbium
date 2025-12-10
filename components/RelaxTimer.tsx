import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, PlusCircle, RotateCcw } from 'lucide-react'; // Added icons for the new controls
import { ExerciseCard } from './ExerciseCard';
import { ExerciseModal } from './ExerciseModal';

const MotionDiv = motion.div as any;

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
  { emoji: '💨', label: 'Breathing', labelShort: 'Breath', description: 'Deep breathing exercise.', duration: 240, animationType: 'breathing' },
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
    // Outer container: Fixed size, dark/warm stove aesthetic
    // max-w-sm (~400px), fixed height (h-auto but content restricted), rounded
    <div className="flex flex-col items-center justify-start 
                    max-w-sm mx-auto 
                    bg-zinc-800/80 dark:bg-zinc-900/90 backdrop-blur-lg 
                    rounded-2xl shadow-2xl p-4 
                    border border-zinc-700/50 
                    animate-in fade-in duration-700"
    >
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
            <div key={index} onClick={startRoulette} className="cursor-pointer">
              <ExerciseCard
                emoji={exercise.emoji}
                label={exercise.label}
                isHighlighted={rouletteIndex === index}
                scale={selectedExercise?.label === exercise.label ? 1.1 : 1}
                duration={exercise.duration} // Passing duration for the timer/status card
              />
            </div>
          ))}

          {/* Empty Slot 1 (Bottom Row, Middle) */}
          <div className="opacity-0 pointer-events-none">
            <div className='min-h-[96px]' />
          </div>

          {/* Status/Timer Card (Bottom Row, Right) */}
          <div className="relative flex flex-col items-center justify-center min-h-[96px] bg-zinc-700/40 rounded-xl p-3 border border-zinc-700 text-white/70 shadow-inner">
            <span className="text-sm font-semibold mb-1">Total Time</span>
            <span className="text-xl font-bold text-indigo-400">
              {formatTime(timerDuration)}
            </span>
            <span className="text-xs mt-1">Select above</span>
          </div>

        </div>
      </MotionDiv>

      {/* Control Bar (Stove-like bottom panel) */}
      <div className="w-full mt-4 flex items-center justify-between bg-zinc-700/50 rounded-xl p-2.5 shadow-inner border border-zinc-600">

        {/* Left Controls: Play/Pause */}
        <div className="flex space-x-2">
          <button
            onClick={toggleTimer}
            className="p-2 rounded-full bg-indigo-500/80 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
            disabled={!selectedExercise}
            aria-label={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
          >
            {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={resetTimer}
            className="p-2 rounded-full bg-zinc-600/50 hover:bg-zinc-600 text-white transition-colors"
            aria-label="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Center Button: Start Relaxing (Main Action) */}
        <button
          onClick={startRoulette}
          disabled={isRouletteActive}
          className={`
            px-5 py-2 
            bg-indigo-600 hover:bg-indigo-500
            text-white
            font-semibold text-sm
            rounded-full 
            shadow-md hover:shadow-lg
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isRouletteActive ? 'Selecting...' : 'Select Exercise'}
        </button>

        {/* Right Controls: Add Time */}
        <div className="flex space-x-2">
          <button
            onClick={addOneMinute}
            className="p-2 rounded-full bg-zinc-600/50 hover:bg-zinc-600 text-white transition-colors"
            aria-label="Add 1 Minute"
          >
            <PlusCircle size={18} />
          </button>
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