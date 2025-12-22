// App.tsx - FULL 738 LINE RESTORATION
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { FocusTimer } from './components/FocusTimer';
import { RelaxTimer } from './components/RelaxTimer';
import { StatsView } from './components/StatsView';
import { TaskList } from './components/TaskList';
import { Background } from './components/Background';
import { GoldVault } from './components/GoldVault';
import { AppMode, SessionStatus, Task, FatigueMetrics } from './types';
import { fatigueService } from './services/fatigueService';
import { CosmicParticles } from './components/CosmicParticles';
import { QuantumRippleBackground } from './components/QuantumRippleBackground';
import { AIWhisper } from './components/AIWhisper';
import LandingPage from './components/LandingPage';
import { AIOptimizedIndicator } from './components/AIOptimizedIndicator';

const DEFAULT_DURATION = 25 * 60; // 25 min default
const SCALE_FACTOR = 1.05; // Matches the transform: scale(1.05) in the JSX

const MotionDiv = motion.div as any;

// ----------------------------------------------------------------------------------
// Define dynamic fatigue thresholds based on Intensity (1-10)
const INTENSITY_THRESHOLDS: Record<number, number> = {
  10: 65, // Max Focus: Very sensitive, stop at 65 score
  9: 70,
  8: 75,
  7: 80,
  6: 85,
  5: 90, // Default Threshold
  4: 95,
  3: 100, // Very Low Focus: Timer only stops if score hits max
  2: 100,
  1: 100,
};

// ----------------------------------------------------------------------------------
// [UPDATED] Invisible Biological Governor (Hidden Time Limits in Minutes)
// This logic is hidden from the UI. The user sees a counting-up timer,
// but the session will auto-pause when these "Elite" performance caps are hit.
// 10: 5 / 60 creates exactly 5 seconds for rapid testing.
// ----------------------------------------------------------------------------------
const INTENSITY_TIME_CAPS: Record<number, number> = {
  1: 70,
  2: 80,
  3: 90,
  4: 50,
  5: 55,
  6: 60,
  7: 65,
  8: 30,
  9: 35,
  10: 5 / 60, // 5 seconds test mode
};
// ----------------------------------------------------------------------------------

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.FOCUS);
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [elapsed, setElapsed] = useState(0);

  // State: Track the user's Focus Intensity (default 5)
  const [focusIntensity, setFocusIntensity] = useState(5);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Draft system architecture', completed: false, priority: 'high' },
    { id: '2', title: 'Review API specs', completed: true, priority: 'medium' },
  ]);
  const [alienMode, setAlienMode] = useState(false);

  // Fatigue state is initialized to null
  const [currentMetrics, setCurrentMetrics] = useState<FatigueMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<FatigueMetrics[]>([]);
  const [insight, setInsight] = useState('Welcome. Ready to initiate Deep Work sequence.');

  // Layout Refs
  const tasksRef = useRef<HTMLDivElement>(null);
  const timerRefDiv = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);

  // CRITICAL: Main scaled content area reference - SVG parent
  const layoutWrapperRef = useRef<HTMLDivElement>(null);

  // Path States
  const [path1, setPath1] = useState<string>('');
  const [path2, setPath2] = useState<string>('');

  // --- 1. TIMER LOGIC (Preserved) ---
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (status === SessionStatus.RUNNING) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);
  // ---------------------------

  // --- 2. AI FATIGUE TRACKING LIFECYCLE (Updated to pass intensity) ---
  useEffect(() => {
    // Callback function to update metrics in App state
    const handleMetricsUpdate = (metrics: FatigueMetrics) => {
      setCurrentMetrics(metrics);
    };

    if (status === SessionStatus.RUNNING) {
      // Start tracking user input when the timer is running
      fatigueService.startTracking(handleMetricsUpdate, focusIntensity);
    } else {
      // Stop tracking when paused, idle, or completed
      fatigueService.stopTracking();
    }

    // Cleanup function: stop tracking when the component unmounts or status changes away from RUNNING
    return () => {
      fatigueService.stopTracking();
    };
  }, [status, focusIntensity]);
  // ---------------------------

  // --- 3. [UPDATED] AI INTERVENTION LOGIC (ADAPTIVE: Checks score AND Hidden Time Caps) ---
  useEffect(() => {
    const score = currentMetrics?.fatigueScore || 0;

    // Get the dynamic threshold based on user's selected intensity
    const criticalThreshold = INTENSITY_THRESHOLDS[focusIntensity] || 90;

    // Get the hidden biological cap (minutes converted to seconds)
    const hiddenTimeLimit = (INTENSITY_TIME_CAPS[focusIntensity] || 60) * 60;

    if (status === SessionStatus.RUNNING) {
      // STOP TRIGGER: Fatigue hits threshold OR secret time limit reached
      if (score >= criticalThreshold || elapsed >= hiddenTimeLimit) {

        // AI automatically stops the timer
        setStatus(SessionStatus.PAUSED);

        // Haptic & Audio "Chime"
        // A "Pro" solution often relies on a single, high-quality audio cue.
        // Audio: Play a single, low-frequency "glass bowl" chime or a soft "thrum" when the session pauses automatically.
        // Haptic: If used on a device with haptics, a double-tap vibration synchronized with the UI transition to SessionStatus.PAUSED.

        // [SENSORY CUE] Audio & Haptic Feedback
        try {
          // 1. Audio: Low-frequency "Glass Bowl" Chime
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const now = ctx.currentTime;

            // Glass bowl harmonics (ratios) - creating a resonant, complex sound
            const ratios = [1.0, 1.5, 2.0, 3.5];
            const fundamental = 174.61; // F3 (Solfeggio "healing" frequency - deeper and more grounding)

            ratios.forEach((ratio, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();

              osc.type = 'sine';
              osc.frequency.value = fundamental * ratio;

              const duration = 3.5; // Longer tail

              // ADSR Envelope
              gain.gain.setValueAtTime(0, now);
              gain.gain.linearRampToValueAtTime(0.08 - (i * 0.015), now + 0.1); // Softer attack
              gain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Smooth decay

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start(now);
              osc.stop(now + duration);
            });
          }

          // 2. Haptic: Double-tap (Pulse - Pause - Pulse)
          if (navigator.vibrate) {
            navigator.vibrate([40, 60, 40]);
          }
        } catch (e) {
          console.error("Sensory cue failed:", e);
        }

        if (elapsed >= hiddenTimeLimit) {
          // [PRO NARRATIVE] Professional, high-status feedback
          setInsight(`Optimal focus window utilized. Initiating recovery sequence to preserve cognitive gold.`);
        } else {
          // Message when biometric fatigue is detected
          setInsight(`🚨 Critical Fatigue Detected (${score}%). Session paused based on Intensity ${focusIntensity}/10 threshold of ${criticalThreshold}%.`);
        }

        if (currentMetrics) {
          setMetricsHistory(prev => [...prev, currentMetrics]);
        }
      }
    }
  }, [currentMetrics?.fatigueScore, status, focusIntensity, elapsed]);
  // ---------------------------

  // Utility to get coordinates from the path string for connection points
  const getPathCoords = useCallback((path: string, type: 'start' | 'end') => {
    const parts = path.split(' ');
    if (parts.length < 3) return { x: 0, y: 0 };

    if (type === 'start') {
      return { x: parseFloat(parts[1]) || 0, y: parseFloat(parts[2]) || 0 };
    }

    if (type === 'end' && parts.length > 8) {
      // The end point of a Cubic Bezier curve is the last two numbers
      return {
        x: parseFloat(parts[parts.length - 2]) || 0,
        y: parseFloat(parts[parts.length - 1]) || 0
      };
    }

    return { x: 0, y: 0 };
  }, []);

  // Path calculation logic
  const updatePaths = useCallback(() => {
    if (!layoutWrapperRef.current || !tasksRef.current || !timerRefDiv.current || !vaultRef.current) {
      return;
    }

    // Get bounds relative to the main layout wrapper
    const wrapperRect = layoutWrapperRef.current.getBoundingClientRect();
    const tasksRect = tasksRef.current.getBoundingClientRect();
    const timerRect = timerRefDiv.current.getBoundingClientRect();
    const vaultRect = vaultRef.current.getBoundingClientRect();

    // Function to calculate relative coordinates (adjusting for the SCALE_FACTOR)
    const relativeX = (rect: DOMRect) => (rect.left - wrapperRect.left) / SCALE_FACTOR;
    const relativeY = (rect: DOMRect) => (rect.top - wrapperRect.top) / SCALE_FACTOR;

    const getWidth = (rect: DOMRect) => rect.width / SCALE_FACTOR;
    const getHeight = (rect: DOMRect) => rect.height / SCALE_FACTOR;

    // Path 1: Tasks (Right side) → Timer (Left side)
    const startX1 = relativeX(tasksRect) + getWidth(tasksRect) - 1;
    const startY1 = relativeY(tasksRect) + getHeight(tasksRect) / 2 - 25;
    const endX1 = relativeX(timerRect);
    const endY1 = relativeY(timerRect) + getHeight(timerRect) / 2;

    const controlOffset1 = 40;
    const path1String = `M ${startX1} ${startY1} 
                         C ${startX1 + controlOffset1} ${startY1} 
                           ${endX1 - controlOffset1} ${endY1} 
                           ${endX1} ${endY1}`;
    setPath1(path1String);

    // Path 2: Timer (Right side) → Vault (Left side)
    const startX2 = relativeX(timerRect) + getWidth(timerRect) - 4;
    const startY2 = relativeY(timerRect) + getHeight(timerRect) / 2;
    const endX2 = relativeX(vaultRef.current.getBoundingClientRect());
    const endY2 = relativeY(vaultRef.current.getBoundingClientRect()) + getHeight(vaultRef.current.getBoundingClientRect()) / 2;

    const controlOffset2 = 40;
    const path2String = `M ${startX2} ${startY2} 
                         C ${startX2 + controlOffset2} ${startY2} 
                           ${endX2 - controlOffset2} ${endY2} 
                           ${endX2} ${endY2}`;
    setPath2(path2String);

  }, []);


  // Handler functions
  const handleStart = () => {
    // [FIX] If the session was finished (Limit Reached), clicking "NEW SESSION" should reset to IDLE
    // so the user can re-configure settings (Intensity) before starting again.
    if (elapsed >= duration) {
      setElapsed(0);
      setCurrentMetrics(null);
      setStatus(SessionStatus.IDLE);
      setInsight('Ready to initiate Deep Work sequence.');
      return;
    }

    // Reset metrics on start to get a fresh baseline
    setCurrentMetrics(null);
    setStatus(SessionStatus.RUNNING);
    setInsight('AI optimizing focus...');
  };
  const handlePause = () => setStatus(SessionStatus.PAUSED);
  const handleReset = () => {
    setStatus(SessionStatus.IDLE);
    setElapsed(0);
    // CRITICAL: Reset fatigue metrics on full session reset
    setCurrentMetrics(null);
    setInsight('Ready to initiate Deep Work sequence.');
  };

  const handleIntensityChange = (intensity: number) => {
    // Validate the intensity is within 1-10 range and update state
    const validatedIntensity = Math.max(1, Math.min(10, intensity));
    setFocusIntensity(validatedIntensity);

    // Dynamically update the hidden 'duration' goal based on the mapping
    const secretMinutes = INTENSITY_TIME_CAPS[validatedIntensity] || 60;
    setDuration(secretMinutes * 60);

    setInsight(`Focus Intensity set to ${validatedIntensity}/10. AI detection threshold adjusted.`);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const addTask = (title: string) => {
    const newTask = { id: Date.now().toString(), title, completed: false, priority: 'medium' as const };
    setTasks(prev => [...prev, newTask]);
  };

  // Layout observer (Preserved)
  useEffect(() => {
    if (!layoutWrapperRef.current) return;

    let animationFrameId: number;
    let startTime = Date.now();

    const tick = () => {
      updatePaths();
      // Run continuously for a short period to catch initial layout stabilization
      if (Date.now() - startTime < 1500) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    tick();

    const handleResize = () => {
      updatePaths();
    };

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updatePaths);
    });

    window.addEventListener('resize', handleResize);
    // Observe the main wrapper that defines the coordinate system
    if (layoutWrapperRef.current) {
      resizeObserver.observe(layoutWrapperRef.current);
    }

    // Observe the components being connected
    if (tasksRef.current) resizeObserver.observe(tasksRef.current);
    if (timerRefDiv.current) resizeObserver.observe(timerRefDiv.current);
    if (vaultRef.current) resizeObserver.observe(vaultRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [updatePaths, mode, tasks, hasEntered]);

  if (!hasEntered) {
    return <LandingPage onEnter={(data) => {
      setHasEntered(true);
      if (data) {
        // Apply AI settings
        handleIntensityChange(data.intensity);
        setInsight(data.insight);

        // Add the analyzed task
        const newTask = { id: Date.now().toString(), title: data.task, completed: false, priority: 'high' as const };
        setTasks(prev => [newTask, ...prev]);

        // Auto-start Timer with "Beauty Shot" delay
        setElapsed(0);
        setCurrentMetrics(null);
        setStatus(SessionStatus.IDLE); // Explicitly show IDLE state first

        // Delay start by 2 seconds to showcase the UI
        setTimeout(() => {
          setStatus(SessionStatus.RUNNING);
        }, 2000);
      }
    }} />;

  }

  const path1Start = getPathCoords(path1, 'start');
  const path1End = getPathCoords(path1, 'end');
  const path2Start = getPathCoords(path2, 'start');
  const path2End = getPathCoords(path2, 'end');

  // Pre-calculate focus mode boolean for usage in the layout below
  const isFocusMode = mode === AppMode.FOCUS;


  return (
    <div className={`h-screen bg-transparent text-gray-200 selection:bg-primary/30 relative overflow-hidden flex flex-col ${alienMode ? 'font-alien' : 'font-sans'}`}>
      {/* Background System and Sidebar */}
      <Background />
      <CosmicParticles />
      <QuantumRippleBackground zIndex={5} />
      <AIWhisper />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <Sidebar
        currentMode={mode}
        setMode={setMode}
        alienMode={alienMode}
        toggleAlienMode={() => setAlienMode(!alienMode)}
      />

      {/* AI Optimized Indicator displayed globally in the top right */}
      <AIOptimizedIndicator currentInsight={insight} />

      {/* Main Content Area */}
      <main
        className="flex-1 relative w-full h-full z-10 flex flex-col items-center justify-center md:pl-72"
        style={{ perspective: '1600px' }}
      >
        <AnimatePresence mode="wait">
          <MotionDiv
            key={mode}
            initial={{ opacity: 0, rotateY: 3, scale: 0.96, filter: 'blur(8px)', y: 15 }}
            animate={{
              opacity: 1,
              rotateY: 0,
              scale: 1,
              filter: 'blur(0px)',
              y: 0,
              transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                y: { type: 'spring', stiffness: 100, damping: 20 }
              }
            }}
            exit={{
              opacity: 0,
              rotateY: -3,
              scale: 0.96,
              filter: 'blur(8px)',
              y: -15,
              transition: { duration: 0.5, ease: "easeIn" }
            }}
            className="w-full max-w-[1800px] px-6 relative flex flex-col items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >

            <div className="w-full h-full flex items-start justify-center pt-32 relative">
              {/* Scaled Layout Wrapper - SVG Parent */}
              <div
                ref={layoutWrapperRef}
                className="flex justify-start items-start w-full max-w-[1600px] px-4 -ml-32 gap-6 relative"
                style={{
                  transform: `scale(${SCALE_FACTOR})`,
                  transformOrigin: 'center',
                  // CRITICAL FIX: Hide when not in FOCUS mode, but KEEP IT IN THE DOM
                  opacity: isFocusMode ? 1 : 0,
                  pointerEvents: isFocusMode ? 'auto' : 'none',
                  transition: 'opacity 0.5s ease-out'
                }}
              >
                {/* PRO DATABASE CONNECTION LINES - SVG REMAINS ALWAYS RENDERED */}
                <svg
                  className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-40"
                  style={{ isolation: 'isolate' }}
                >
                  <defs>
                    {/* Lighter, more transparent gradient */}
                    <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#c7d2fe" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.2" />
                    </linearGradient>

                    {/* Subtle Glow - Reduced intensity */}
                    <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Perfect Geometric Arrow */}
                    <marker
                      id="arrow-head"
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <path
                        d="M0,0 L6,3 L0,6"
                        fill="#c7d2fe"
                        fillOpacity="0.6"
                      />
                    </marker>
                  </defs>

                  {/* CONNECTION 1: Tasks → Timer */}
                  {path1 && (
                    <g>
                      <path
                        d={path1}
                        fill="none"
                        stroke="url(#connection-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        markerEnd="url(#arrow-head)"
                        className="transition-all duration-500"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="8"
                          dur="3s"
                          repeatCount="indefinite"
                          calcMode="linear"
                        />
                      </path>

                      {/* Animated dot - Smaller and cleaner */}
                      <circle r="1.5" fill="#e0e7ff" fillOpacity="0.8">
                        <animateMotion
                          dur="4s"
                          repeatCount="indefinite"
                          path={path1}
                          rotate="auto"
                        />
                      </circle>
                    </g>
                  )}

                  {/* CONNECTION 2: Timer → Vault */}
                  {path2 && (
                    <g>
                      <path
                        d={path2}
                        fill="none"
                        stroke="url(#connection-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        markerEnd="url(#arrow-head)"
                        className="transition-all duration-500"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="8"
                          dur="3s"
                          repeatCount="indefinite"
                          calcMode="linear"
                          begin="1s"
                        />
                      </path>

                      {/* Animated dot */}
                      <circle r="1.5" fill="#e0e7ff" fillOpacity="0.8">
                        <animateMotion
                          dur="4s"
                          repeatCount="indefinite"
                          path={path2}
                          rotate="auto"
                          begin="2s"
                        />
                      </circle>
                    </g>
                  )}

                  {/* Connection Points - Smaller, less glow */}
                  {path1Start.x > 0 && (
                    <circle
                      cx={path1Start.x}
                      cy={path1Start.y}
                      r="2.5"
                      fill="#c7d2fe"
                      className="transition-all duration-300 opacity-80"
                    />
                  )}

                  {path1End.x > 0 && path2Start.x > 0 && (
                    <circle
                      cx={path1End.x}
                      cy={path1End.y}
                      r="2.5"
                      fill="#c7d2fe"
                      className="transition-all duration-300 opacity-80"
                    />
                  )}

                  {path2End.x > 0 && (
                    <circle
                      cx={path2End.x}
                      cy={path2End.y}
                      r="2.5"
                      fill="#c7d2fe"
                      className="transition-all duration-300 opacity-80"
                    />
                  )}
                </svg>


                {/* 1. Left Column: Contextual Tasks - RENDERED ALWAYS */}
                <div ref={tasksRef} className={`w-[24rem] min-h-[13rem] mt-24 relative z-20 transition-opacity duration-700 ${isFocusMode ? 'opacity-100 animate-in slide-in-from-left-8 fade-in' : 'opacity-0'}`}>
                  {/* Only render TaskList content when in Focus mode */}
                  {isFocusMode ? (
                    <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
                  ) : (
                    <div className="h-full w-full" /> // Placeholder to maintain ref size/position
                  )}
                </div>

                {/* Connector 1 Placeholder */}
                <div className="w-24 relative z-0 pointer-events-none" />

                {/* 2. Center Column: AI Optimized - RENDERED ALWAYS */}
                <div ref={timerRefDiv} className={`w-[24rem] h-[15rem] relative z-30 transition-opacity duration-1000 ${isFocusMode ? 'opacity-100 animate-in zoom-in-95 fade-in' : 'opacity-0'}`}>
                  {/* Only render FocusTimer content when in Focus mode */}
                  {isFocusMode ? (
                    <FocusTimer
                      status={status}
                      elapsedSeconds={elapsed}
                      durationSeconds={duration}
                      fatigueScore={currentMetrics?.fatigueScore || 0}
                      onStart={handleStart}
                      onPause={handlePause}
                      onReset={handleReset}
                      onIntensityChange={handleIntensityChange}
                      currentInsight={insight}
                    />
                  ) : (
                    <div className="h-full w-full" /> // Placeholder to maintain ref size/position
                  )}
                </div>

                {/* Connector 2 Placeholder */}
                <div className="w-24 relative z-0 pointer-events-none" />

                {/* 3. Right Column: Gold Vault - RENDERED ALWAYS */}
                <div ref={vaultRef} className={`w-[24rem] h-[9.25rem] mt-24 relative z-20 transition-opacity duration-700 ${isFocusMode ? 'opacity-100 animate-in slide-in-from-right-8 fade-in' : 'opacity-0'}`}>
                  {/* Only render GoldVault content when in Focus mode */}
                  {isFocusMode ? (
                    <GoldVault
                      progress={(elapsed / duration) * 100}
                      barsToday={3}
                      totalBars={47}
                    />
                  ) : (
                    <div className="h-full w-full" /> // Placeholder to maintain ref size/position
                  )}
                </div>
              </div>
            </div>

            {/* 2. ABSOLUTE CONTAINER for STATS and RELAX modes to overlay FocusLayout 
                 without causing layout shifts. 
            */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-${mode !== AppMode.FOCUS ? 'auto' : 'none'}`}>

              <AnimatePresence>
                {mode === AppMode.RELAX && (
                  <MotionDiv
                    key="relax"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    <RelaxTimer
                      onComplete={() => {
                        setMode(AppMode.FOCUS);
                        setStatus(SessionStatus.IDLE);
                        setElapsed(0);
                        setDuration(DEFAULT_DURATION);
                      }}
                      fatigueScore={currentMetrics?.fatigueScore || 50}
                    />
                  </MotionDiv>
                )}
              </AnimatePresence>


              <AnimatePresence>
                {mode === AppMode.STATS && (
                  <MotionDiv
                    key="stats"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StatsView metricsHistory={metricsHistory} />
                  </MotionDiv>
                )}
              </AnimatePresence>

            </div>

          </MotionDiv>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;