import { FatigueMetrics, FocusIntensity } from '../types';

// Constants for detection logic
const WINDOW_SIZE_MS = 5000; // Process metrics every 5 seconds

// Adaptive Baseline Storage Keys
const KEY_LATENCY_BASELINE = 'ytterbium_latency_baseline';
const KEY_VARIANCE_BASELINE = 'ytterbium_variance_baseline';

// Default baselines (used until a user baseline is established)
const DEFAULT_BASELINE_LATENCY = 120; // ms (Example baseline)
const DEFAULT_BASELINE_VARIANCE = 30; // ms

// ----------------------------------------------------------------------------------
// [NEW CONSTANT] Factor to adjust score based on Intensity. 
// At Intensity 10, the score is 20% higher. At Intensity 1, the score is 16% lower.
// ----------------------------------------------------------------------------------
const getIntensitySensitivityFactor = (intensity: FocusIntensity): number => {
  // 5 is the neutral intensity (Factor 1.0)
  return 1.0 + ((intensity - 5) / 5) * 0.2;
}

class FatigueService {
  private lastKeyTime: number = 0;
  private keyLatencies: number[] = [];
  private lastMousePos: { x: number; y: number } | null = null;
  private mouseDistance: number = 0;
  private mouseMoves: number = 0;
  private mouseDirectionChanges: number = 0;
  private lastMouseAngle: number = 0;

  private listenersAttached: boolean = false;
  private onMetricsUpdate: ((metrics: FatigueMetrics) => void) | null = null;
  private intervalId: number | null = null;

  // Adaptive Baseline Properties
  private userBaselineLatency: number;
  private userBaselineVariance: number;

  // ----------------------------------------------------------------------------------
  // [NEW PROPERTY] To store the user's selected intensity
  private currentIntensity: FocusIntensity = 5;
  // ----------------------------------------------------------------------------------

  // Rolling scores for smoothing
  private recentScores: number[] = [];

  constructor() {
    this.userBaselineLatency = FatigueService.getBaseline(KEY_LATENCY_BASELINE, DEFAULT_BASELINE_LATENCY);
    this.userBaselineVariance = FatigueService.getBaseline(KEY_VARIANCE_BASELINE, DEFAULT_BASELINE_VARIANCE);
  }

  // --- Persistence and Baseline Helpers (Preserved) ---
  private static getBaseline(key: string, defaultValue: number): number {
    const value = localStorage.getItem(key);
    return value ? parseFloat(value) : defaultValue;
  }

  private static setBaseline(key: string, value: number): void {
    const currentBest = FatigueService.getBaseline(key, value);
    // Only save the best (lowest) values
    if (value < currentBest) {
      localStorage.setItem(key, value.toString());
    }
  }

  // --- Input Handlers (Preserved) ---
  private handleKeyDown = (event: KeyboardEvent) => {
    const now = performance.now();
    if (this.lastKeyTime !== 0) {
      const latency = now - this.lastKeyTime;
      this.keyLatencies.push(latency);
    }
    this.lastKeyTime = now;
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.mouseMoves++;
    if (this.lastMousePos) {
      const dx = event.clientX - this.lastMousePos.x;
      const dy = event.clientY - this.lastMousePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.mouseDistance += distance;

      // Track direction changes for erratic movement detection
      if (distance > 5) { // Only track meaningful movement
        const angle = Math.atan2(dy, dx);
        if (this.lastMouseAngle !== 0 && Math.abs(angle - this.lastMouseAngle) > Math.PI / 4) {
          this.mouseDirectionChanges++;
        }
        this.lastMouseAngle = angle;
      }
    }
    this.lastMousePos = { x: event.clientX, y: event.clientY };
  };

  // --- Core Logic: Calculate Metrics ---
  private calculateMetrics = () => {
    if (!this.onMetricsUpdate) return;

    // Calculate averages and stats for the window
    const avgLatency = this.keyLatencies.length > 0 ? this.keyLatencies.reduce((a, b) => a + b, 0) / this.keyLatencies.length : 0;
    const mouseVelocity = this.mouseDistance * (1000 / WINDOW_SIZE_MS); // Px per second
    const erraticScore = this.mouseDirectionChanges;

    // Calculate Standard Deviation (Jitter)
    const mean = avgLatency;
    const stdDev = this.keyLatencies.length > 1
      ? Math.sqrt(this.keyLatencies.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (this.keyLatencies.length - 1))
      : 0;

    // --- 1. FATIGUE SCORING ---
    let fatigueScore = 0;

    // Cognitive Slowing Score (40% weight)
    const cognitiveSlowingScore = Math.max(0, avgLatency - this.userBaselineLatency) / this.userBaselineLatency * 100 * 0.4;
    fatigueScore += cognitiveSlowingScore;

    // Motor Control Inconsistency Score (30% weight)
    const motorInconsistencyScore = Math.max(0, stdDev - this.userBaselineVariance) / this.userBaselineVariance * 100 * 0.3;
    fatigueScore += motorInconsistencyScore;

    // Mouse Dynamics Score (Sluggish or Erratic)
    if (mouseVelocity < 50 && this.mouseMoves > 0) {
      // Moving but very slowly (sluggish/disengaged)
      fatigueScore += 10;
    }
    if (erraticScore > 2) {
      // Jittery movement (frustration/loss of fine motor control)
      fatigueScore += 20;
    }

    // Additional Factor: Non-Activity Penalty (Stagnation)
    if (this.keyLatencies.length === 0 && this.mouseMoves < 5) {
      // Very low input: Apply a gentle penalty to detect long periods of disengagement.
      fatigueScore += 5;
    }

    // ----------------------------------------------------------------------------------
    // [NEW LOGIC] Apply Intensity Sensitivity Factor to the raw score
    const sensitivityFactor = getIntensitySensitivityFactor(this.currentIntensity);
    fatigueScore *= sensitivityFactor;
    // ----------------------------------------------------------------------------------

    // Clamp score
    fatigueScore = Math.min(100, Math.max(0, fatigueScore));

    // Smoothing
    this.recentScores.push(fatigueScore);
    if (this.recentScores.length > 5) this.recentScores.shift();
    const smoothedScore = this.recentScores.reduce((a, b) => a + b, 0) / this.recentScores.length;

    const metrics: FatigueMetrics = {
      timestamp: Date.now(),
      keystrokeLatencyMs: avgLatency,
      typingSpeedWpm: this.keyLatencies.length * (60000 / WINDOW_SIZE_MS) / 5, // Approx WPM
      mouseDistancePx: this.mouseDistance,
      mouseVelocityPxPerSec: mouseVelocity,
      erraticMouseMovement: erraticScore > 2,
      fatigueScore: Math.round(smoothedScore)
    };

    if (avgLatency > 0 && stdDev > 0) {
      FatigueService.setBaseline(KEY_LATENCY_BASELINE, avgLatency);
      FatigueService.setBaseline(KEY_VARIANCE_BASELINE, stdDev);
    }

    this.onMetricsUpdate(metrics);

    // --- Reset for next window ---
    this.keyLatencies = [];
    this.mouseDistance = 0;
    this.mouseMoves = 0;
    this.mouseDirectionChanges = 0;
    this.lastKeyTime = 0;
  };

  // --- Tracking Controls ---
  // [MODIFIED] Added intensity parameter
  public startTracking(onMetricsUpdate: (metrics: FatigueMetrics) => void, intensity: FocusIntensity = 5) {
    if (this.listenersAttached) return;

    this.onMetricsUpdate = onMetricsUpdate;
    this.currentIntensity = intensity; // [UPDATE] Set the new intensity

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    this.listenersAttached = true;

    // Start interval
    this.intervalId = window.setInterval(this.calculateMetrics, WINDOW_SIZE_MS);
  }

  public stopTracking() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.listenersAttached) {
      document.removeEventListener('keydown', this.handleKeyDown);
      document.removeEventListener('mousemove', this.handleMouseMove);
      this.listenersAttached = false;
    }
    // Clear temporary data on stop
    this.keyLatencies = [];
    this.recentScores = [];
    this.lastKeyTime = 0;
  }
}

export const fatigueService = new FatigueService();