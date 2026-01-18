import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock, Zap, Activity, Gauge, Target, Sparkles } from 'lucide-react';
import { SessionStatus } from '../types';

interface FocusTimerProps {
  status: SessionStatus;
  elapsedSeconds: number;
  durationSeconds: number;
  fatigueScore: number;
  currentIntensity: number; // Added prop
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onIntensityChange: (intensity: number) => void;
  currentInsight?: string; // Prop kept for compatibility with App.tsx
}

// ----------------------------------------------------------------------------------
// [NEW LOGIC] Function to map the 1-10 numerical scale to clear conceptual labels
// ----------------------------------------------------------------------------------
const getIntensityLabel = (intensity: number): { label: string, color: string } => {
  if (intensity <= 3) {
    return { label: 'Creative', color: 'text-neutral-400' };
  }
  if (intensity <= 7) {
    return { label: 'Balanced', color: 'text-neutral-100' };
  }
  return { label: 'Deep Laser', color: 'text-primary' };
};

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
  currentInsight,
}) => {
  const [sliderValue, setSliderValue] = useState(currentIntensity);

  // Sync sliderValue when currentIntensity changes from parent (e.g., AI classification)
  React.useEffect(() => {
    console.log("[FocusTimer] Syncing intensity from prop:", currentIntensity);
    setSliderValue(currentIntensity);
  }, [currentIntensity]);

  // Get the current label based on the slider value
  const { label: intensityLabel, color: intensityColor } = getIntensityLabel(sliderValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    // Call the intensity handler to update App.tsx and its hidden duration mapping
    onIntensityChange(val);
  };

  // [FIX] Progress Bar now uses the dynamic duration from App.tsx 
  // This ensures the bar hits 100% exactly when the hidden cap (e.g., 40 mins) is reached.
  const progressPercent = durationSeconds > 0
    ? Math.min(100, (elapsedSeconds / durationSeconds) * 100)
    : 0;

  // Timer Display Logic (Counting Up)
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

  // [UPDATED] Check if session is finished via AI Intervention
  const isFinished = elapsedSeconds >= durationSeconds && durationSeconds > 0;

  // Status configuration - Simplified
  let StatusIcon = Clock;
  let statusColor = "text-gray-400";
  let statusText = "IDLE";

  if (status === SessionStatus.RUNNING) {
    if (fatigueScore > 70) {
      StatusIcon = Activity;
      statusColor = "text-primary";
      statusText = "HIGH LOAD";
    } else {
      StatusIcon = Zap;
      statusColor = "text-primary";
      statusText = "FOCUSING";
    }
  } else if (status === SessionStatus.PAUSED) {
    if (isFinished) {
      StatusIcon = Sparkles;
      statusColor = "text-primary";
      statusText = "PEAK";
    } else {
      StatusIcon = Clock;
      statusColor = "text-neutral-400";
      statusText = "PAUSED";
    }
  }

  const actionButtonClasses = `
    flex items-center justify-center
    text-neutral-500 hover:text-neutral-100 transition-all duration-200
    p-1.5 rounded-lg
    bg-neutral-800 border border-neutral-700
  `;

  const resetButtonStyle = `
    text-neutral-500 hover:text-primary transition-all duration-200
    p-1.5 rounded-lg
    bg-neutral-800 border border-neutral-700
  `;

  // APPLE SPECTRAL GLOW LOGIC
  const isRunning = status === SessionStatus.RUNNING;

  return (
    // Updated: Added max-w-[240px] and mx-auto to tighten width
    <div id="focus-timer-node" className={`
      w-[14rem] h-full
      bg-[#0f0f12]/60
      backdrop-blur-xl
      rounded-2xl
      shadow-[0_8px_32px_rgba(0,0,0,0.5)]
      relative flex flex-col
      transition-all duration-700 ease-in-out

      /* Standard border (reverts to this when not running) */
      border ${(!isRunning && !isFinished) ? 'border-white/[0.08]' : 'border-transparent'}

      /* [UPDATED] Spectral Edge Glow Pseudo-element */
      /* Adds a VERY subtle pulsing Emerald glow when the session is running */
      ${isRunning ? `
        before:content-['']
        before:absolute before:inset-0 before:rounded-2xl 
        before:p-[0.5px] 
        before:bg-gradient-to-tr 
        before:from-emerald-400/20 before:via-white/5 before:to-emerald-400/20
        before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:mask-composite-exclude
        before:pointer-events-none
        before:z-20
        before:animate-pulse
        shadow-[0_0_20px_rgba(52,211,153,0.08)]
      ` : isFinished ? `
        before:content-['']
        before:absolute before:inset-0 before:rounded-2xl 
        before:p-[1px] 
        before:bg-gradient-to-tr 
        before:from-amber-400/40 before:via-white/20 before:to-amber-400/40
        before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
        before:mask-composite-exclude
        before:pointer-events-none
        before:z-20
        before:animate-pulse
        shadow-[0_0_30px_rgba(251,191,36,0.15)]
      ` : `
        before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none
      `}

      after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-white/[0.01] after:pointer-events-none
    `}>

      {/* Header: Title bar aesthetic */}
      <div className="
        px-3 py-2
        border-b border-neutral-800
        flex justify-between items-center 
        bg-neutral-900/50
        relative z-10 shrink-0
      ">
        <h3 className="text-[10px] font-bold text-neutral-500 tracking-wider">TIMER</h3>

        {/* Status badge */}
        <div className={`
          flex items-center gap-1.5
          ${statusColor}
        `}>
          <StatusIcon className="w-2.5 h-2.5" />
          <span className="text-[9px] font-bold tracking-tight uppercase">{statusText}</span>
        </div>
      </div>

      {/* Main Content Area - Updated p-2.5 for width reduction */}
      <div className="p-2.5 space-y-3 flex-1 flex flex-col relative z-10">

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className={`
            text-3xl font-mono font-bold tracking-tight tabular-nums
            ${isFinished ? 'text-primary' : 'text-neutral-100'}
          `}>
            {minutes}:{seconds}
          </div>

          {/* Progress indicator */}
          <div className="w-full max-w-[120px] flex flex-col gap-1 mt-3">
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${isFinished || isRunning ? 'bg-primary' : 'bg-neutral-600'}`}
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </div>
            <div className={`text-[9px] font-mono text-center ${isFinished ? 'text-primary' : 'text-neutral-500'}`}>
              {Math.round(progressPercent)}%
            </div>
          </div>
        </div>

        {/* Configuration/Status Area */}
        <div className="space-y-3">
          {status === SessionStatus.IDLE ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Target className="w-2.5 h-2.5 text-gray-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                  <span className={`text-[8px] uppercase tracking-tighter ${intensityColor} font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}>
                    {intensityLabel}
                  </span>
                </div>
                <div className="text-[9px] text-gray-400 font-mono">{sliderValue}/10</div>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="
                    absolute inset-0 
                    bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-red-500/40 
                    rounded-full pointer-events-none
                  "></div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    className="
                      relative
                      w-full h-0.5 
                      bg-transparent 
                      rounded-full 
                      appearance-none 
                      [&::-webkit-slider-thumb]:appearance-none 
                      [&::-webkit-slider-thumb]:h-2.5 
                      [&::-webkit-slider-thumb]:w-2.5 
                      [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:bg-gradient-to-br 
                      [&::-webkit-slider-thumb]:from-white 
                      [&::-webkit-slider-thumb]:to-gray-200
                      [&::-webkit-slider-thumb]:border 
                      [&::-webkit-slider-thumb]:border-white/[0.3]
                      [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_1px_2px_rgba(255,255,255,0.8)_inset]
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-all
                      [&::-webkit-slider-thumb]:duration-200
                      [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-webkit-slider-thumb]:hover:shadow-[0_4px_12px_rgba(99,102,241,0.4),0_1px_2px_rgba(255,255,255,0.8)_inset]
                      [&::-webkit-slider-thumb]:-translate-y-[calc((0.625rem-0.125rem)/2)]
                      [&::-webkit-slider-track]:appearance-none
                      [&::-webkit-slider-track]:bg-gradient-to-r
                      [&::-webkit-slider-track]:from-purple-500/70
                      [&::-webkit-slider-track]:via-cyan-500/70
                      [&::-webkit-slider-track]:to-red-500/70
                      [&::-webkit-slider-track]:rounded-full
                      [&::-webkit-slider-track]:h-0.5
                      cursor-pointer
                    "
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-2.5 h-2.5 text-gray-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                  <span className="text-[8px] text-gray-400 uppercase tracking-tighter">COGNITIVE LOAD</span>
                </div>
                <div className="text-[9px] text-white font-mono">{fatigueScore}/100</div>
              </div>

              {/* Cognitive Load Bar */}
              <div className="
                w-full h-1 
                bg-white/[0.05] 
                rounded-full 
                overflow-hidden
                shadow-[0_1px_2px_rgba(0,0,0,0.2)_inset]
                border border-white/[0.05]
              ">
                <motion.div
                  className="
                    h-full 
                    bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500
                    shadow-[0_0_12px_rgba(34,197,94,0.15),0_1px_2px_rgba(255,255,255,0.1)_inset]
                    relative
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.2] before:to-transparent before:opacity-50
                  "
                  initial={{ width: "0%" }}
                  animate={{ width: `${fatigueScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Grouped Controls (Action Buttons and Footer) */}
        <div className="mt-auto shrink-0 space-y-2">

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-center gap-2">
              {status === SessionStatus.RUNNING ? (
                <>
                  <button
                    onClick={onPause}
                    className={actionButtonClasses}
                  >
                    <Pause className="w-3 h-3" />
                  </button>
                  <button
                    onClick={onReset}
                    className={resetButtonStyle}
                  >
                    <Square className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};