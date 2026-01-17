import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Power, Zap, Activity } from 'lucide-react';
import { SessionStatus } from '../types';

interface FocusTimerProps {
  status: SessionStatus;
  elapsedSeconds: number;
  durationSeconds: number;
  fatigueScore: number;
  currentIntensity: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onIntensityChange: (intensity: number) => void;
  currentInsight?: string;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  status,
  elapsedSeconds,
  durationSeconds,
  fatigueScore,
  currentIntensity,
  onStart,
  onPause,
  onReset,
  onIntensityChange,
}) => {
  const [sliderValue, setSliderValue] = useState(currentIntensity);

  useEffect(() => {
    setSliderValue(currentIntensity);
  }, [currentIntensity]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    onIntensityChange(val);
  };

  const progressPercent = durationSeconds > 0
    ? Math.min(100, (elapsedSeconds / durationSeconds) * 100)
    : 0;

  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
  const isFinished = elapsedSeconds >= durationSeconds && durationSeconds > 0;
  const isRunning = status === SessionStatus.RUNNING;

  return (
    // LAW OF BREATHING ROOM: Double padding (p-8 instead of p-4)
    // LAW OF PRECISION GEOMETRY: rounded-3xl, 1px border
    <div className={`
      w-full h-full
      bg-[#050505]
      rounded-3xl
      relative flex flex-col justify-between
      p-8
      border border-white/[0.05]
      shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]
      transition-all duration-700
      ${isRunning ? 'shadow-[0_0_100px_-30px_rgba(0,255,133,0.1)] border-[#00FF85]/20' : ''}
    `}>

      {/* 1. HEADER - INVISIBLE HIERARCHY */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#444] font-medium">
            Active Session
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-[#00FF85] animate-pulse' : 'bg-[#333]'}`} />
            <span className={`text-[11px] uppercase tracking-[0.1em] ${isRunning ? 'text-[#00FF85]' : 'text-[#666]'}`}>
              {isRunning ? 'Online' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Minimal Cognitive Load Indicator */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#333] font-medium">
            Load
          </span>
          <span className="text-[12px] font-mono text-[#666]">
            {fatigueScore}%
          </span>
        </div>
      </div>

      {/* 2. CENTERPIECE - WEIGHTED TYPOGRAPHY */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className={`
           text-7xl font-sans font-light tracking-tighter tabular-nums
           ${isRunning ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-[#333]'}
           transition-colors duration-500
        `}>
          {minutes}:{seconds}
        </div>

        {/* Progress Line - Surgical */}
        <div className="w-full max-w-[120px] h-[1px] bg-[#222] mt-6 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#00FF85]"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </div>
      </div>

      {/* 3. CONTROLS - PRECISION GEOMETRY */}
      <div className="space-y-6">

        {/* Intensity Slider - Monochromatic */}
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] text-[#444]">
            <span>Intensity</span>
            <span>{sliderValue} / 10</span>
          </div>
          <div className="relative h-1 w-full bg-[#111] rounded-full overflow-hidden">
            {/* Fill */}
            <div
              className="absolute top-0 left-0 bottom-0 bg-white/[0.1] transition-all duration-300"
              style={{ width: `${(sliderValue / 10) * 100}%` }}
            />
            <input
              type="range" v
              min="1" max="10"
              value={sliderValue}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="
                 flex-1 h-12
                 bg-[#EAEAEA] hover:bg-white
                 text-black
                 rounded-lg
                 font-medium text-[11px] uppercase tracking-[0.1em]
                 transition-all duration-300
                 flex items-center justify-center gap-2
                 shadow-[0_0_20px_rgba(255,255,255,0.1)]
               "
            >
              <Play className="w-3 h-3 fill-current" />
              Initiate
            </button>
          ) : (
            <>
              <button
                onClick={onPause}
                className="
                   flex-1 h-12
                   bg-[#111] hover:bg-[#1A1A1A]
                   text-[#EAEAEA]
                   border border-white/[0.1]
                   rounded-lg
                   font-medium text-[11px] uppercase tracking-[0.1em]
                   transition-all duration-300
                   flex items-center justify-center gap-2
                 "
              >
                <Pause className="w-3 h-3 fill-current" />
                Halt
              </button>
              <button
                onClick={onReset}
                className="
                   w-12 h-12
                   flex items-center justify-center
                   bg-[#080808] hover:bg-[#111]
                   text-[#666] hover:text-red-500
                   border border-white/[0.05]
                   rounded-lg
                   transition-all duration-300
                 "
              >
                <Power className="w-3 h-3" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};