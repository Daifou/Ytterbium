import { FatigueMetrics } from '../types';

// Constants for detection logic
const WINDOW_SIZE_MS = 5000; // Process metrics every 5 seconds
const BASELINE_LATENCY = 120; // ms (Example baseline)
const BASELINE_VARIANCE = 30; // ms

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

  // Rolling baseline for adaptive scoring
  private recentScores: number[] = [];

  constructor() {}

  public startTracking(callback: (metrics: FatigueMetrics) => void) {
    if (this.listenersAttached) return;
    
    this.onMetricsUpdate = callback;
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    
    this.intervalId = window.setInterval(this.processWindow, WINDOW_SIZE_MS);
    this.listenersAttached = true;
  }

  public stopTracking() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    if (this.intervalId) window.clearInterval(this.intervalId);
    this.listenersAttached = false;
    this.keyLatencies = [];
    this.mouseDistance = 0;
    this.mouseMoves = 0;
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    const now = performance.now();
    if (this.lastKeyTime > 0) {
      const latency = now - this.lastKeyTime;
      // Filter out huge pauses (e.g. thinking time > 2s) to focus on typing bursts
      if (latency < 2000) {
        this.keyLatencies.push(latency);
      }
    }
    this.lastKeyTime = now;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.lastMousePos) {
      const dx = e.clientX - this.lastMousePos.x;
      const dy = e.clientY - this.lastMousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      this.mouseDistance += dist;

      // Calculate angle to detect erratic movement (jitter)
      const angle = Math.atan2(dy, dx);
      if (Math.abs(angle - this.lastMouseAngle) > Math.PI / 2) {
        this.mouseDirectionChanges++;
      }
      this.lastMouseAngle = angle;
    }
    this.lastMousePos = { x: e.clientX, y: e.clientY };
    this.mouseMoves++;
  };

  private processWindow = () => {
    // 1. Calculate Averages
    const avgLatency = this.keyLatencies.length > 0 
      ? this.keyLatencies.reduce((a, b) => a + b, 0) / this.keyLatencies.length 
      : 0;

    // Standard Deviation of latency (Stability)
    const variance = this.keyLatencies.length > 0
      ? this.keyLatencies.reduce((acc, val) => acc + Math.pow(val - avgLatency, 2), 0) / this.keyLatencies.length
      : 0;
    const stdDev = Math.sqrt(variance);

    // Mouse velocity (px/sec approximately)
    const mouseVelocity = this.mouseDistance / (WINDOW_SIZE_MS / 1000);
    
    // Erratic score: high direction changes with low distance
    const erraticScore = this.mouseDistance > 0 ? (this.mouseDirectionChanges / this.mouseDistance) * 100 : 0;

    // 2. Compute Fatigue Score (Simplified Algorithm)
    // Fatigue often manifests as:
    // - Higher keystroke latency (slowed processing)
    // - Higher latency variance (inconsistency)
    // - Erratic or sluggish mouse movements
    
    let fatigueScore = 0;
    
    // Factor 1: Cognitive slowing (Latency)
    if (avgLatency > 0) {
      const slowdown = Math.max(0, avgLatency - BASELINE_LATENCY);
      fatigueScore += (slowdown / BASELINE_LATENCY) * 40;
    }
    
    // Factor 2: Motor control consistency (Jitter)
    if (stdDev > BASELINE_VARIANCE) {
      fatigueScore += ((stdDev - BASELINE_VARIANCE) / BASELINE_VARIANCE) * 30;
    }

    // Factor 3: Mouse dynamics
    if (mouseVelocity < 50 && this.mouseMoves > 0) {
       // Moving but very slowly - potential fatigue or deep thought
       fatigueScore += 10;
    }
    if (erraticScore > 2) {
      // Jittery movement
      fatigueScore += 20;
    }

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

    if (this.onMetricsUpdate) {
      this.onMetricsUpdate(metrics);
    }

    // Reset window counters
    this.keyLatencies = [];
    this.mouseDistance = 0;
    this.mouseMoves = 0;
    this.mouseDirectionChanges = 0;
  };
}

export const fatigueService = new FatigueService();