export enum AppMode {
  FOCUS = 'FOCUS',
  RELAX = 'RELAX',
  STATS = 'STATS'
}

export enum SessionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

// ----------------------------------------------------------------------------------
// [NEW TYPE] Focus Intensity (1-10) for AI sensitivity control
export type FocusIntensity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
// ----------------------------------------------------------------------------------


export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface FatigueMetrics {
  timestamp: number;
  keystrokeLatencyMs: number; // Average latency between keystrokes in this window
  typingSpeedWpm: number;
  mouseDistancePx: number;
  mouseVelocityPxPerSec: number;
  erraticMouseMovement: boolean; // Computed based on trajectory changes
  fatigueScore: number; // 0 (fresh) to 100 (exhausted)
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  durationSeconds: number; // Planned duration
  elapsedSeconds: number; // Actual elapsed
  type: 'FOCUS' | 'RELAX';
  fqs: number; // Focus Quality Score (0-100)
}

export interface Insight {
  type: 'suggestion' | 'warning' | 'kudos';
  message: string;
  timestamp: number;
}