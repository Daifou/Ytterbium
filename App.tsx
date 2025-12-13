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
import { getGeminiInsight } from './services/geminiService';
import { CosmicParticles } from './components/CosmicParticles';
import { QuantumRippleBackground } from './components/QuantumRippleBackground';
import { AIWhisper } from './components/AIWhisper';
import LandingPage from './components/LandingPage';

const DEFAULT_DURATION = 25 * 60; // 25 min default
const SCALE_FACTOR = 1.05; // Matches the transform: scale(1.05) in the JSX

const MotionDiv = motion.div as any;

// ----------------------------------------------------------------------------------
// [NEW CONFIGURATION] Define dynamic fatigue thresholds based on Intensity (1-10)
// Lower Intensity number (1-4) requires a HIGHER score to stop (less sensitive)
// Higher Intensity number (7-10) requires a LOWER score to stop (more sensitive, stops earlier)
const INTENSITY_THRESHOLDS: Record<number, number> = {
  10: 65, // Max Focus: Very sensitive, stop at 65 score
  9: 70,
  8: 75,
  7: 80,
  6: 85,
  5: 90, // Default Threshold (matches old hardcoded value)
  4: 95,
  3: 100, // Very Low Focus: Timer only stops if score hits max (effectively manual stop)
  2: 100,
  1: 100,
};
// ----------------------------------------------------------------------------------

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.FOCUS);
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [elapsed, setElapsed] = useState(0);

  // ----------------------------------------------------------------------------------
  // [NEW STATE] 1. State: Track the user's Focus Intensity (default 5)
  const [focusIntensity, setFocusIntensity] = useState(5);
  // ----------------------------------------------------------------------------------

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Draft system architecture', completed: false, priority: 'high' },
    { id: '2', title: 'Review API specs', completed: true, priority: 'medium' },
  ]);
  const [alienMode, setAlienMode] = useState(false);

  // Fatigue state is initialized to null
  const [currentMetrics, setCurrentMetrics] = useState<FatigueMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<FatigueMetrics[]>([]);
  const [fqs, setFqs] = useState(100);
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
      // [UPDATE] We pass focusIntensity here. fatigueService.ts must be updated later to use this argument.
      fatigueService.startTracking(handleMetricsUpdate, focusIntensity);
    } else {
      // Stop tracking when paused, idle, or completed
      fatigueService.stopTracking();
    }

    // Cleanup function: stop tracking when the component unmounts or status changes away from RUNNING
    return () => {
      fatigueService.stopTracking();
    };
    // [UPDATE] focusIntensity is now a dependency to restart tracking when sensitivity changes
  }, [status, focusIntensity]);
  // ---------------------------

  // --- 3. AI INTERVENTION LOGIC (ADAPTIVE: Checks score against Intensity) ---
  useEffect(() => {
    const score = currentMetrics?.fatigueScore || 0;

    // [NEW LOGIC] Get the dynamic threshold based on user's selected intensity
    const criticalThreshold = INTENSITY_THRESHOLDS[focusIntensity] || 90;

    // [UPDATE] Use the dynamic criticalThreshold instead of the hard-coded 90
    if (status === SessionStatus.RUNNING && score >= criticalThreshold) {
      // AI automatically stops the timer due to critical fatigue
      setStatus(SessionStatus.PAUSED); // Change status to PAUSED to allow resuming if user wishes

      // Update insight with dynamic information
      setInsight(`🚨 Critical Fatigue Detected (${score}%). Session paused based on Intensity ${focusIntensity}/10 threshold of ${criticalThreshold}%.`);

      if (currentMetrics) {
        setMetricsHistory(prev => [...prev, currentMetrics]);
      }
    }
    // [UPDATE] focusIntensity is now a dependency for intervention logic
  }, [currentMetrics?.fatigueScore, status, focusIntensity]);
  // ---------------------------

  // Utility to get coordinates from the path string for connection points
  const getPathCoords = useCallback((path: string, type: 'start' | 'end') => {
    // ... Path logic preserved ...
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

  // Path calculation logic (Preserved)
  const updatePaths = useCallback(() => {
    // ... Path calculation logic remains the same ...
    if (!layoutWrapperRef.current || !tasksRef.current || !timerRefDiv.current || !vaultRef.current) {
      return;
    }

    const wrapperRect = layoutWrapperRef.current.getBoundingClientRect();
    const tasksRect = tasksRef.current.getBoundingClientRect();
    const timerRect = timerRefDiv.current.getBoundingClientRect();
    const vaultRect = vaultRef.current.getBoundingClientRect();

    const relativeX = (rect: DOMRect) => (rect.left - wrapperRect.left) / SCALE_FACTOR;
    const relativeY = (rect: DOMRect) => (rect.top - wrapperRect.top) / SCALE_FACTOR;

    const getWidth = (rect: DOMRect) => rect.width / SCALE_FACTOR;
    const getHeight = (rect: DOMRect) => rect.height / SCALE_FACTOR;

    const startX1 = relativeX(tasksRect) + getWidth(tasksRect) - 4;
    const startY1 = relativeY(tasksRect) + getHeight(tasksRect) / 2;
    const endX1 = relativeX(timerRect);
    const endY1 = relativeY(timerRect) + getHeight(timerRect) / 2;

    const controlOffset1 = 40;
    const path1String = `M ${startX1} ${startY1} 
                         C ${startX1 + controlOffset1} ${startY1} 
                           ${endX1 - controlOffset1} ${endY1} 
                           ${endX1} ${endY1}`;
    setPath1(path1String);

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

  const calculateSessionLength = (factor: number) => { /* logic */ };
  const handleDurationChange = (factor: number) => {
    setDuration(prev => Math.max(60, prev + factor * 60));
  };

  // ----------------------------------------------------------------------------------
  // [NEW HANDLER] 4. Handler: Captures the intensity value from the FocusTimer slider
  const handleIntensityChange = (intensity: number) => {
    // Validate the intensity is within 1-10 range and update state
    setFocusIntensity(Math.max(1, Math.min(10, intensity)));
    setInsight(`Focus Intensity set to ${intensity}/10. AI detection threshold adjusted.`);
  };
  // ----------------------------------------------------------------------------------

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
    resizeObserver.observe(layoutWrapperRef.current);

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
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  const path1Start = getPathCoords(path1, 'start');
  const path1End = getPathCoords(path1, 'end');
  const path2Start = getPathCoords(path2, 'start');
  const path2End = getPathCoords(path2, 'end');

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
            {mode === AppMode.FOCUS && (
              <div className="w-full h-full flex items-start justify-center pt-32 relative">
                {/* Scaled Layout Wrapper - SVG Parent */}
                <div
                  ref={layoutWrapperRef}
                  className="flex justify-start items-start w-full max-w-[1600px] px-4 -ml-32 gap-6 relative"
                  style={{ transform: `scale(${SCALE_FACTOR})`, transformOrigin: 'center' }}
                >
                  {/* PRO DATABASE CONNECTION LINES - INSIDE SCALED WRAPPER */}
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

                  {/* 1. Left Column: Contextual Tasks */}
                  <div ref={tasksRef} className="w-[24rem] min-h-[13rem] mt-24 relative z-20 animate-in slide-in-from-left-8 duration-700 fade-in">
                    <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
                  </div>

                  {/* Connector 1 Placeholder */}
                  <div className="w-24 relative z-0 pointer-events-none" />

                  {/* 2. Center Column: AI Optimized */}
                  <div ref={timerRefDiv} className="w-[24rem] h-[12rem] relative z-30 animate-in zoom-in-95 duration-1000 fade-in">
                    <FocusTimer
                      status={status}
                      elapsedSeconds={elapsed}
                      durationSeconds={duration}
                      fatigueScore={currentMetrics?.fatigueScore || 0}
                      onStart={handleStart}
                      onPause={handlePause}
                      onReset={handleReset}
                      // ----------------------------------------------------------------------------------
                      // [MODIFIED PROP] 5. Pass the new dedicated handler to FocusTimer
                      onIntensityChange={handleIntensityChange}
                      // [REMOVED PROP] The old onDurationChange prop is no longer needed here
                      // onDurationChange={handleDurationChange} 
                      // ----------------------------------------------------------------------------------
                      currentInsight={insight}
                    />
                  </div>

                  {/* Connector 2 Placeholder */}
                  <div className="w-24 relative z-0 pointer-events-none" />

                  {/* 3. Right Column: Gold Vault */}
                  <div ref={vaultRef} className="w-[24rem] h-[9.25rem] mt-24 relative z-20 animate-in slide-in-from-right-8 duration-700 fade-in">
                    <GoldVault
                      progress={(elapsed / duration) * 100}
                      barsToday={3}
                      totalBars={47}
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === AppMode.RELAX && (
              <RelaxTimer
                onComplete={() => {
                  setMode(AppMode.FOCUS);
                  setStatus(SessionStatus.IDLE);
                  setElapsed(0);
                  setDuration(DEFAULT_DURATION);
                }}
                fatigueScore={currentMetrics?.fatigueScore || 50}
              />
            )}

            {mode === AppMode.STATS && (
              <StatsView metricsHistory={metricsHistory} />
            )}
          </MotionDiv>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;