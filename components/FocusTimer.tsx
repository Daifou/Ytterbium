import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock, Zap, Activity, Gauge, Target } from 'lucide-react';

export enum SessionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED'
}

interface FocusTimerProps {
  status: SessionStatus;
  elapsedSeconds: number;
  durationSeconds: number;
  fatigueScore: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onIntensityChange: (intensity: number) => void;
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
  onStart,
  onPause,
  onReset,
  onIntensityChange,
}) => {
  const [sliderValue, setSliderValue] = useState(5);
  // Get the current label based on the slider value
  const { label: intensityLabel, color: intensityColor } = getIntensityLabel(sliderValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    // Call the intensity handler to update App.tsx and fatigueService.ts
    onIntensityChange(val);
  };

  const progressPercent = Math.min(100, (elapsedSeconds / durationSeconds) * 100);
  const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

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
    StatusIcon = Clock;
    statusColor = "text-blue-400";
    statusText = "PAUSED";
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

  return (
    <div className="
      w-full h-full
      bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-950/40
      backdrop-blur-xl
      border border-white/[0.08]
      rounded-2xl
      shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_32px_rgba(0,0,0,0.32),0_16px_60px_rgba(0,0,0,0.28)]
      hover:shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_40px_rgba(0,0,0,0.36),0_20px_80px_rgba(0,0,0,0.32)]
      relative flex flex-col
      transition-all duration-500
      before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none
      after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:via-transparent after:to-white/[0.01] after:pointer-events-none
    ">

      {/* Header: Title bar aesthetic */}
      <div className="
        px-3 py-1.5 
        border-b border-white/[0.08] 
        flex justify-between items-center 
        bg-gradient-to-r from-white/[0.03] to-white/[0.01]
        relative z-10 shrink-0
        backdrop-blur-sm
        after:absolute after:inset-0 after:rounded-t-2xl after:bg-gradient-to-b after:from-white/[0.04] after:to-transparent after:pointer-events-none
      ">
        <h3 className="text-[11px] font-medium text-gray-400 tracking-wide">AI Focus Timer</h3>

        {/* Status badge */}
        <div className={`
          flex items-center gap-1 px-2 py-0.5 rounded-lg
          ${statusColor}
          bg-white/[0.04]
          border border-white/[0.1]
          shadow-[0_2px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(255,255,255,0.05)_inset]
          backdrop-blur-sm
          relative
          before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none
        `}>
          <StatusIcon className="w-2.5 h-2.5 relative z-10" />
          <span className="text-[9px] font-medium tracking-tight relative z-10">{statusText}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">

        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="
            text-2xl font-mono font-medium text-white tracking-tighter tabular-nums
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]
          ">
            {minutes}:{seconds}
          </div>

          {/* Progress indicator */}
          <div className="w-full max-w-[120px] flex items-center gap-2 mt-1">
            <div className="
              flex-1 h-1 
              bg-white/[0.05] 
              rounded-full overflow-hidden
              shadow-[0_1px_2px_rgba(0,0,0,0.2)_inset]
              border border-white/[0.05]
            ">
              <motion.div
                className="
                  h-full 
                  bg-gradient-to-r from-indigo-500 via-blue-400 to-cyan-400
                  shadow-[0_0_8px_rgba(99,102,241,0.3),0_1px_2px_rgba(255,255,255,0.2)_inset]
                  relative
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.2] before:to-transparent before:opacity-50
                "
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="text-[9px] text-gray-500 font-mono tabular-nums w-6 text-right">
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
                  <Target className="w-3 h-3 text-gray-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                  {/* [MODIFICATION] Display the conceptual label */}
                  <span className={`text-[9px] uppercase tracking-wider ${intensityColor} font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}>
                    {intensityLabel}
                  </span>
                </div>
                {/* [MODIFICATION] Display the technical number for power users */}
                <div className="text-[10px] text-gray-400 font-mono">/10</div>
              </div>

              {/* Slider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="
                    absolute inset-0 
                    bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-red-500/10 
                    rounded-full
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
                      [&::-webkit-slider-thumb]:h-3 
                      [&::-webkit-slider-thumb]:w-3 
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
                      [&::-webkit-slider-track]:appearance-none
                      [&::-webkit-slider-track]:bg-gradient-to-r
                      [&::-webkit-slider-track]:from-purple-500/30
                      [&::-webkit-slider-track]:via-cyan-500/30
                      [&::-webkit-slider-track]:to-red-500/30
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
                  <Activity className="w-3 h-3 text-gray-500 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">COGNITIVE LOAD</span>
                </div>
                <div className="text-[10px] text-white font-mono">{fatigueScore}/100</div>
              </div>

              {/* Cognitive Load Bar */}
              <div className="
                w-full h-1.5 
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

          {/* Action Buttons */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-center gap-4">
              {status === SessionStatus.RUNNING ? (
                <>
                  <button
                    onClick={onPause}
                    className={actionButtonClasses}
                    title="Pause Session"
                  >
                    <Pause className="w-3 h-3" />
                  </button>
                  <button
                    onClick={onReset}
                    className={resetButtonStyle}
                    title="Reset Session"
                  >
                    <Square className="w-3 h-3" />
                  </button>
                </>
              ) : (
                // START SESSION button
                <button
                  onClick={onStart}
                  className="
                    flex items-center justify-center gap-1.5
                    flex-1 text-[10px] py-1.5
                    border border-gray-300/[0.15]
                    rounded-xl
                    text-gray-300 hover:text-white
                    bg-gradient-to-b from-white/[0.07] to-white/[0.03]
                    hover:bg-gradient-to-b hover:from-white/[0.12] hover:to-white/[0.05]
                    hover:border-gray-300/[0.25]
                    transition-all duration-200
                    font-medium tracking-wide
                    shadow-[0_4px_12px_rgba(0,0,0,0.2),0_1px_2px_rgba(255,255,255,0.05)_inset]
                    hover:shadow-[0_8px_24px_rgba(0,0,0,0.3),0_2px_4px_rgba(255,255,255,0.1)_inset]
                    backdrop-blur-sm
                    relative
                    before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-b before:from-white/[0.1] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-200
                    active:scale-[0.98]
                  "
                >
                  <Play className="w-3 h-3 relative z-10" />
                  <span className="relative z-10">START SESSION</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-2 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <div className="text-[9px] text-gray-500">
              {status === SessionStatus.IDLE ? 'Ready for session' :
                status === SessionStatus.RUNNING ? 'AI optimizing focus...' : 'Session paused'}
            </div>

            {/* Status indicators */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-0.5 h-1.5 rounded-sm 
                    transition-all duration-300
                    ${status === SessionStatus.RUNNING && fatigueScore > (i * 25)
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
  );
};