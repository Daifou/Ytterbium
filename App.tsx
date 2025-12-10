import React, { useState, useEffect, useRef } from 'react';
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

const DEFAULT_DURATION = 25 * 60; // 25 min default

const MotionDiv = motion.div as any;

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.FOCUS);
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [elapsed, setElapsed] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Draft system architecture', completed: false, priority: 'high' },
    { id: '2', title: 'Review API specs', completed: true, priority: 'medium' },
  ]);
  const [alienMode, setAlienMode] = useState(false);

  // Metrics State
  const [currentMetrics, setCurrentMetrics] = useState<FatigueMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<FatigueMetrics[]>([]);
  const [fqs, setFqs] = useState(100);
  const [insight, setInsight] = useState('');

  // Timer Ref
  const timerRef = useRef<number | null>(null);

  // Layout Refs
  const layoutRef = useRef<HTMLDivElement>(null);
  const tasksRef = useRef<HTMLDivElement>(null);
  const timerRefDiv = useRef<HTMLDivElement>(null); // Renamed to avoid conflict with timerRef
  const vaultRef = useRef<HTMLDivElement>(null);

  // Path States
  const [path1, setPath1] = useState<string>('');
  const [path2, setPath2] = useState<string>('');

  // Initialize Fatigue Service
  useEffect(() => {
    // Only track during active focus sessions
    if (status === SessionStatus.RUNNING && mode === AppMode.FOCUS) {
      fatigueService.startTracking((metrics) => {
        setCurrentMetrics(metrics);
        setMetricsHistory(prev => [...prev, metrics]);

        // Dynamic FQS Calculation
        const newFqs = Math.max(0, 100 - metrics.fatigueScore);
        setFqs(newFqs);

        if (metrics.fatigueScore > 75) {
          setInsight("Fatigue levels spiking. Consider a micro-break soon.");
        }
      });
    } else {
      fatigueService.stopTracking();
    }

    return () => fatigueService.stopTracking();
  }, [status, mode]);

  // Timer Logic
  useEffect(() => {
    if (status === SessionStatus.RUNNING) {
      timerRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          if (prev >= duration) {
            setStatus(SessionStatus.COMPLETED);
            setMode(AppMode.RELAX);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, duration]);

  // Periodic AI Insight
  useEffect(() => {
    if (status === SessionStatus.RUNNING && elapsed > 0 && elapsed % 300 === 0) {
      getGeminiInsight(metricsHistory, elapsed, tasks.filter(t => t.completed).length)
        .then(setInsight);
    }
  }, [elapsed, status, metricsHistory, tasks]);

  const handleStart = () => setStatus(SessionStatus.RUNNING);
  const handlePause = () => setStatus(SessionStatus.PAUSED);
  const handleReset = () => {
    setStatus(SessionStatus.IDLE);
    setElapsed(0);
    setDuration(DEFAULT_DURATION);
    setMetricsHistory([]);
    setFqs(100);
    setInsight('');
  };

  const [dilationFactor, setDilationFactor] = useState(5);

  const calculateSessionLength = (factor: number) => {
    // Simulate AI Calculation complexity
    const baseRandom = Math.random();
    let minutes = 25;

    if (factor <= 3) {
      // Low Dilation: 15 - 25 mins
      minutes = 15 + Math.floor(baseRandom * 11);
    } else if (factor <= 7) {
      // Medium Dilation: 25 - 45 mins
      minutes = 25 + Math.floor(baseRandom * 21);
    } else {
      // High Dilation: 45 - 90 mins
      minutes = 45 + Math.floor(baseRandom * 46);
    }
    return minutes * 60;
  };

  const handleDurationChange = (factor: number) => {
    setDilationFactor(factor);
    const newDuration = calculateSessionLength(factor);
    setDuration(newDuration);
    setElapsed(0);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (title: string) => {
    setTasks([...tasks, { id: Date.now().toString(), title, completed: false, priority: 'medium' }]);
  };

  // Update Paths
  useEffect(() => {
    const updatePaths = () => {
      if (!layoutRef.current || !tasksRef.current || !timerRefDiv.current || !vaultRef.current) return;

      const layoutRect = layoutRef.current.getBoundingClientRect();
      const tasksRect = tasksRef.current.getBoundingClientRect();
      const timerRect = timerRefDiv.current.getBoundingClientRect();
      const vaultRect = vaultRef.current.getBoundingClientRect();

      // Path 1: Tasks -> Timer
      const startX1 = tasksRect.right - layoutRect.left;
      const startY1 = (tasksRect.top + tasksRect.height / 2) - layoutRect.top;
      const endX1 = timerRect.left - layoutRect.left;
      const endY1 = (timerRect.top + timerRect.height / 2) - layoutRect.top;
      const distX1 = endX1 - startX1;
      setPath1(`M ${startX1} ${startY1} C ${startX1 + distX1 * 0.4} ${startY1} ${endX1 - distX1 * 0.4} ${endY1} ${endX1} ${endY1}`);

      // Path 2: Timer -> Vault
      const startX2 = timerRect.right - layoutRect.left;
      const startY2 = (timerRect.top + timerRect.height / 2) - layoutRect.top;
      const endX2 = vaultRect.left - layoutRect.left;
      const endY2 = (vaultRect.top + vaultRect.height / 2) - layoutRect.top;
      const distX2 = endX2 - startX2;
      setPath2(`M ${startX2} ${startY2} C ${startX2 + distX2 * 0.4} ${startY2} ${endX2 - distX2 * 0.4} ${endY2} ${endX2} ${endY2}`);
    };

    updatePaths();

    const handleResize = () => updatePaths();
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    if (layoutRef.current) resizeObserver.observe(layoutRef.current);
    if (tasksRef.current) resizeObserver.observe(tasksRef.current);
    if (timerRefDiv.current) resizeObserver.observe(timerRefDiv.current);
    if (vaultRef.current) resizeObserver.observe(vaultRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={`h-screen bg-transparent text-gray-200 selection:bg-primary/30 relative overflow-hidden flex flex-col ${alienMode ? 'font-alien' : 'font-sans'}`}>

      {/* Background System */}
      <Background />
      <CosmicParticles />
      <QuantumRippleBackground zIndex={5} />
      <AIWhisper />

      {/* Central Ambient Spot - Very faint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Navigation Layout */}
      <Sidebar
        currentMode={mode}
        setMode={setMode}
        alienMode={alienMode}
        toggleAlienMode={() => setAlienMode(!alienMode)}
      />

      {/* Right Section: AI Indicator */}
      <div className="fixed top-10 right-10 z-50 flex flex-col items-end gap-1 pointer-events-none opacity-80 mix-blend-screen">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-medium text-zinc-500 uppercase tracking-widest leading-none ${alienMode ? 'font-alien' : ''} transition-colors duration-1000 ${status === SessionStatus.RUNNING ? 'text-indigo-400' : ''}`}>AI System</span>
          <div className="relative flex items-center justify-center w-3 h-3">
            <div className={`absolute w-full h-full rounded-full transition-colors duration-1000 ${status === SessionStatus.RUNNING ? 'bg-indigo-500' : 'bg-zinc-700'}`} />
            {status === SessionStatus.RUNNING && (
              <>
                <MotionDiv
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-indigo-400 rounded-full blur-sm"
                />
                <MotionDiv
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 border border-indigo-400/50 rounded-full"
                />
              </>
            )}
          </div>
        </div>
        {status === SessionStatus.RUNNING && (
          <span className="text-[9px] text-zinc-600 font-mono">{currentMetrics?.fatigueScore ?? 0}% Load</span>
        )}
      </div>

      {/* Main Content Area */}
      <main
        className="flex-1 relative w-full h-full z-10 flex flex-col items-center justify-center overflow-hidden md:pl-72"
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
            {/* Holographic Shimmer Overlay */}
            <MotionDiv
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '150%', opacity: [0, 0.25, 0] }}
              transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
              className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* Content Views */}
            {mode === AppMode.FOCUS && (
              <div className="w-full h-full flex items-start justify-center pt-32 relative">

                {/* Main 3-Column Layout Wrapper */}
                <div ref={layoutRef} className="flex justify-start items-start w-full max-w-[1600px] px-4 -ml-32 gap-6 relative" style={{ transform: 'scale(1.05)', transformOrigin: 'center' }}>

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
                      onDurationChange={handleDurationChange}
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

                  {/* Connections SVG */}
                  <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-10">
                    <defs>
                      <linearGradient id="flow-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5B8EF4" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#5B8EF4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#5B8EF4" stopOpacity="0.3" />
                      </linearGradient>
                      <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Path 1 */}
                    <path
                      d={path1}
                      fill="none"
                      stroke="url(#flow-gradient-1)"
                      strokeWidth="1.5"
                      strokeDasharray="3 6"
                      className="opacity-100"
                    />
                    <circle r="2.5" fill="#5B8EF4" opacity="0.6" filter="url(#dot-glow)">
                      <animateMotion dur="3s" repeatCount="indefinite" path={path1} />
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle r="2.5" fill="#5B8EF4" opacity="0.6" filter="url(#dot-glow)">
                      <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path={path1} />
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" begin="1s" />
                    </circle>

                    {/* Path 2 */}
                    <path
                      d={path2}
                      fill="none"
                      stroke="url(#flow-gradient-1)"
                      strokeWidth="1.5"
                      strokeDasharray="3 6"
                      className="opacity-100"
                    />
                    <circle r="2.5" fill="#5B8EF4" opacity="0.6" filter="url(#dot-glow)">
                      <animateMotion dur="3s" repeatCount="indefinite" path={path2} />
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle r="2.5" fill="#5B8EF4" opacity="0.6" filter="url(#dot-glow)">
                      <animateMotion dur="3s" repeatCount="indefinite" begin="1s" path={path2} />
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" begin="1s" />
                    </circle>
                  </svg>

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