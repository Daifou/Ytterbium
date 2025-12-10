import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock, Zap, Activity, Gauge, Target, Plus } from 'lucide-react';

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
  onDurationChange?: (newDuration: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  status,
  elapsedSeconds,
  durationSeconds,
  fatigueScore,
  onStart,
  onPause,
  onReset,
  onDurationChange,
}) => {
  const [sliderValue, setSliderValue] = useState(5);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (onDurationChange) onDurationChange(val);
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

  // Minimalist, compact action button style (matching TaskList's Add button inspiration)
  const actionButtonClasses = `
    flex items-center justify-center
    text-gray-500 hover:text-primary transition-colors
    p-1.5 rounded-md
  `;

  const resetButtonStyle = `
    text-gray-600 hover:text-red-400 transition-colors
    p-1.5 rounded-md
  `;

  return (
    // Card Structure: Matching TaskList's minimalist glass card
    <div className="w-full h-full bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl shadow-2xl relative flex flex-col transition-all duration-300">

      {/* Header: Matching TaskList's title bar aesthetic */}
      <div className="px-3 py-1.5 border-b border-white/5 flex justify-between items-center bg-surface relative z-10 shrink-0">
        <h3 className="text-[11px] font-medium text-gray-400">AI Focus Timer</h3>

        {/* Status badge - Used the same style but adapted to the timer status */}
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 ${statusColor} border border-white/10`}>
          <StatusIcon className="w-2.5 h-2.5" />
          <span className="text-[9px] font-medium tracking-tight">{statusText}</span>
        </div>
      </div>

      {/* Main Content Area: Reduced vertical spacing for density */}
      <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">

        {/* Timer Display - Centered, prominent but compact */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl font-mono font-medium text-white tracking-tighter tabular-nums">
            {minutes}:{seconds}
          </div>

          {/* Progress indicator - Compact and subtle */}
          <div className="w-full max-w-[120px] flex items-center gap-2 mt-1">
            <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-400"
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
                  <Target className="w-3 h-3 text-gray-500" />
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">INTENSITY</span>
                </div>
                <div className="text-[10px] text-white font-mono">{sliderValue}/10</div>
              </div>

              {/* Slider - Cleaned up to use minimal lines */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="flex-1 h-0.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/20 cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-gray-500" />
                  <span className="text-[9px] text-gray-400 uppercase tracking-wider">COGNITIVE LOAD</span>
                </div>
                <div className="text-[10px] text-white font-mono">{fatigueScore}/100</div>
              </div>

              {/* Cognitive Load Bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${fatigueScore}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons - Compact, minimal style */}
          <div className="pt-2 border-t border-white/5">
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
                // START SESSION button: Updated with minimalist pro styling
                <button
                  onClick={onStart}
                  className="
                    flex items-center justify-center gap-1.5
                    flex-1 text-[10px] py-1.5
                    border border-gray-300/30 rounded-lg
                    text-gray-300 hover:text-white
                    bg-white/5 hover:bg-white/10
                    hover:border-gray-300/50
                    transition-all duration-200
                    font-medium tracking-wide
                  "
                >
                  <Play className="w-3 h-3" />
                  START SESSION
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Compact status message */}
        <div className="mt-auto pt-2 border-t border-white/5">
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
                  className={`w-0.5 h-1.5 rounded-sm transition-colors duration-300 ${status === SessionStatus.RUNNING && fatigueScore > (i * 25)
                    ? 'bg-gradient-to-b from-emerald-500 to-amber-500'
                    : 'bg-white/5'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};