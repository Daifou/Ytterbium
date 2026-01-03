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
    return { label: 'Creative Focus', color: 'text-purple-400' }; // Low sensitivity
  }
  if (intensity <= 7) {
    return { label: 'Balanced Focus', color: 'text-cyan-400' }; // Medium sensitivity
  }
  return { label: 'Deep Laser Focus', color: 'text-red-400' }; // High sensitivity
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
      statusColor = "text-red-400";
      statusText = "OVERLOAD";
    } else if (fatigueScore > 40) {
      StatusIcon = Gauge;
      statusColor = "text-amber-400";
      statusText = "ACTIVE";
    } else {
      StatusIcon = Zap;
      statusColor = "text-emerald-400";
      statusText = "FLOW";
    }
  } else if (status === SessionStatus.PAUSED) {
    // [UPDATED] If paused because we hit the peak, show "PEAK REACHED"
    if (isFinished) {
      StatusIcon = Sparkles;
      statusColor = "text-amber-400";
      statusText = "PEAK REACHED";
    } else {
      StatusIcon = Clock;
      statusColor = "text-blue-400";
      statusText = "PAUSED";
    }
  }

  const actionButtonClasses = `
    flex items-center justify-center
    text-gray-500 hover:text-primary transition-all duration-200
    p-1.5 rounded-md
    shadow-[0_1px_0px_rgba(255,255,255,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.3)]
    bg-white/[0.02] hover:bg-white/[0.06]
    border border-white/[0.02] hover:border-white/[0.1]
    backdrop-blur-sm
  `;

  const resetButtonStyle = `
    text-gray-600 hover:text-red-400 transition-all duration-200
    p-1.5 rounded-md
    shadow-[0_1px_0px_rgba(255,255,255,0.05)] hover:shadow-[0_2px_4px_rgba(220,38,38,0.2)]
    bg-white/[0.02] hover:bg-white/[0.06]
    border border-white/[0.02] hover:border-red-400/[0.2]
    backdrop-blur-sm
  `;

  // APPLE SPECTRAL GLOW LOGIC
  const isRunning = status === SessionStatus.RUNNING;

  return (
    // Updated: Added max-w-[240px] and mx-auto to tighten width
    <div className={`
      w-full max-w-[240px] mx-auto h-full
      bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-950/40
      backdrop-blur-xl
      rounded-2xl
      shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_32px_rgba(0,0,0,0.32),0_16px_60px_rgba(0,0,0,0.28)]
      hover:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.36),0_20px_80px_rgba(0,0,0,0.32)]
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
        px-2.5 py-1.5 
        border-b border-white/[0.08] 
        flex justify-between items-center 
        bg-gradient-to-r from-white/[0.03] to-white/[0.01]
        relative z-10 shrink-0
        backdrop-blur-sm
        after:absolute after:inset-0 after:rounded-t-2xl after:bg-gradient-to-b after:from-white/[0.04] after:to-transparent after:pointer-events-none
      ">
        <h3 className="text-[10px] font-medium text-gray-400 tracking-tight">AI Timer</h3>

        {/* Status badge */}
        <div className={`
          flex items-center gap-1 px-1.5 py-0.5 rounded-lg
          ${statusColor}
          bg-white/[0.04]
          border border-white/[0.1]
          shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(255,255,255,0.05)_inset]
          backdrop-blur-sm
          relative
          before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none
        `}>
          <StatusIcon className="w-2 h-2 relative z-10" />
          <span className="text-[8px] font-medium tracking-tighter relative z-10">{statusText}</span>
        </div>
      </div>

      {/* Main Content Area - Updated p-4 to p-3 for width reduction */}
      <div className="p-3 space-y-4 flex-1 flex flex-col relative z-10">

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center">
          <div className={`
            text-2xl font-mono font-medium tracking-tighter tabular-nums
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
            ${isFinished ? 'text-amber-400' : 'text-white'}
          `}>
            {minutes}:{seconds}
          </div>

          {/* Progress indicator - Invisible Target Logic */}
          <div className="w-full max-w-[100px] flex items-center gap-2 mt-1">
            <div className="
              flex-1 h-0.5 
              bg-white/[0.05] 
              rounded-full overflow-hidden
              shadow-[0_1px_2px_rgba(0,0,0,0.2)_inset]
              border border-white/[0.05]
            ">
              <motion.div
                className={`
                  h-full 
                  ${isFinished
                    ? 'bg-gradient-to-r from-amber-500 via-white to-amber-500'
                    : isRunning
                      ? 'bg-gradient-to-r from-emerald-500/60 via-emerald-400/40 to-emerald-500/60'
                      : 'bg-gradient-to-r from-indigo-500/80 via-blue-400/80 to-cyan-400/80'
                  }
                  shadow-[0_0_6px_rgba(16,185,129,0.2),0_1px_1px_rgba(255,255,255,0.1)_inset]
                  relative
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.1] before:to-transparent before:opacity-30
                `}
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "linear" }}
              />
            </div>
            <div className={`text-[8px] font-mono tabular-nums w-5 text-right ${isFinished ? 'text-amber-400' : isRunning ? 'text-emerald-400' : 'text-gray-500'}`}>
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
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-center gap-2">
              {status === SessionStatus.RUNNING ? (
                <>
                  <button
                    onClick={onPause}
                    className={actionButtonClasses}
                    title="Pause Session"
                  >
                    <Pause className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={onReset}
                    className={resetButtonStyle}
                    title="Reset Session"
                  >
                    <Square className="w-2.5 h-2.5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onStart}
                  className="
                    flex items-center justify-center gap-1.5
                    flex-1 text-[9px] py-1.5
                    border border-gray-300/[0.15]
                    rounded-xl
                    text-gray-300 hover:text-white
                    bg-gradient-to-b from-white/[0.07] to-white/[0.03]
                    hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.05]
                    hover:border-gray-300/[0.25]
                    transition-all duration-200
                    font-medium tracking-tighter
                    shadow-[0_4px_12px_rgba(0,0,0,0.2),0_1px_2px_rgba(255,255,255,0.05)_inset]
                    hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_2px_4px_rgba(255,255,255,0.1)_inset]
                    backdrop-blur-sm
                    relative
                    before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/[0.1] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200
                    active:scale-[0.98]
                  "
                >
                  <Play className="w-2.5 h-2.5 relative z-10" />
                  <span className="relative z-10">{isFinished ? 'RESTART' : 'START'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between">
              <div className="text-[8px] text-gray-500 tracking-tighter">
                {status === SessionStatus.IDLE ? 'Ready' :
                  status === SessionStatus.RUNNING ? 'Optimizing...' :
                    isFinished ? 'Finished' : 'Paused'}
              </div>

              {/* Status indicators */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      w-0.5 h-1 rounded-sm 
                      transition-all duration-300
                      ${(status === SessionStatus.RUNNING || isFinished) && fatigueScore > (i * 25)
                        ? 'bg-gradient-to-b from-emerald-500 to-amber-500 shadow-[0_0_4px_rgba(34,197,94,0.3)]'
                        : 'bg-white/[0.05]'
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};