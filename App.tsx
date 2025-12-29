// App.tsx - WITH SUPABASE INTEGRATION
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
import { authService } from './services/authService';
import { databaseService } from './services/databaseService';
import { AuthModal } from './components/AuthModal';
import { ImmersiveJourney } from './components/ImmersiveJourney';
import type { User } from '@supabase/supabase-js';

const DEFAULT_DURATION = 25 * 60; // 25 min default
const SCALE_FACTOR = 1.05; // Matches the transform: scale(1.05) in the JSX
const GHOST_SESSION_KEY = 'ytterbium_ghost_session_id';

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
  const [showJourney, setShowJourney] = useState(false);
  const [mode, setMode] = useState<AppMode>(AppMode.FOCUS);
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [elapsed, setElapsed] = useState(0);

  // State: Track the user's Focus Intensity (default 5)
  const [focusIntensity, setFocusIntensity] = useState(5);
  const isFocusMode = mode === AppMode.FOCUS;

  // Supabase state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [alienMode, setAlienMode] = useState(false);

  // Fatigue state is initialized to null
  const [currentMetrics, setCurrentMetrics] = useState<FatigueMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<FatigueMetrics[]>([]);
  const [insight, setInsight] = useState('Initializing quantum focus systems...');

  // Layout Refs
  const tasksRef = useRef<HTMLDivElement>(null);
  const timerRefDiv = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);

  // CRITICAL: Main scaled content area reference - SVG parent
  const layoutWrapperRef = useRef<HTMLDivElement>(null);

  // Path States
  const [path1, setPath1] = useState<string>('');
  const [path2, setPath2] = useState<string>('');

  // Vault state
  const [barsToday, setBarsToday] = useState(0);
  const [totalBars, setTotalBars] = useState(0);

  const refreshVaultStats = useCallback(async () => {
    if (currentUser) {
      const stats = await databaseService.getVaultStats(currentUser.id);
      setBarsToday(stats.barsToday);
      setTotalBars(stats.totalBars);
    }
  }, [currentUser]);

  // --- 4. AUTH & SESSION INITIALIZATION ---
  useEffect(() => {
    const initAuth = async () => {
      setIsAuthLoading(true);
      try {
        const user = await authService.getUser();
        if (user) {
          setCurrentUser(user);
          setHasEntered(true); // Auto-enter if already logged in

          // Check for ongoing session
          const activeSession = await databaseService.getCurrentSession(user.id);
          if (activeSession) {
            setCurrentSessionId(activeSession.id);
            setStatus(activeSession.status as SessionStatus);
            setElapsed(activeSession.elapsed_seconds);
            setFocusIntensity(activeSession.focus_intensity);

            // Set mode based on session type if needed
            if (activeSession.type === 'RELAX') setMode(AppMode.RELAX);

            setInsight(`Welcome back. Resuming ${activeSession.type.toLowerCase()} session.`);
          }
        } else {
          // GHOST RESTORATION: Check if there's a ghost session to restore
          const ghostSessionId = localStorage.getItem(GHOST_SESSION_KEY);
          if (ghostSessionId) {
            setCurrentSessionId(ghostSessionId);
            setHasEntered(true);
            setInsight('Quantum session active. (Ghost Mode)');
          }
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes globally
    const subscription = authService.onAuthStateChange(async (user) => {
      setCurrentUser(user);
      if (!user) {
        setHasEntered(false);
        setCurrentSessionId(null);
        setTasks([]);
      } else {
        // HANDSHAKE: If a user just logged in and we have a ghost session, claim it
        const ghostSessionId = localStorage.getItem(GHOST_SESSION_KEY);
        if (ghostSessionId) {
          const success = await databaseService.claimGhostData(user.id, ghostSessionId);
          if (success) {
            localStorage.removeItem(GHOST_SESSION_KEY);
            setInsight('Data secured. Ghost session successfully linked to your account.');
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

        // [SENSORY CUE] Audio & Haptic Feedback - "Glass Bowl" Chime
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const now = ctx.currentTime;
            const fundamental = 174.61; // F3
            [1.0, 1.5, 2.0, 3.5].forEach((ratio, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.value = fundamental * ratio;
              gain.gain.setValueAtTime(0, now);
              gain.gain.linearRampToValueAtTime(0.08 - (i * 0.015), now + 0.1);
              gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now);
              osc.stop(now + 3.5);
            });
          }
          if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
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

        // AUTH WALL: Trigger modal on auto-pause if not logged in
        if (!currentUser) {
          setIsAuthModalOpen(true);
        }

        if (currentMetrics) {
          setMetricsHistory(prev => [...prev, currentMetrics]);

          // CRITICAL: Save last metrics before pausing
          if (currentSessionId) {
            databaseService.saveMetrics(currentSessionId, currentMetrics);
          }
        }
      }
    }
  }, [currentMetrics?.fatigueScore, status, focusIntensity, elapsed]);
  // ---------------------------

  // Utility to get coordinates from the path string for connection points
  const getPathCoords = useCallback((path: string, type: 'start' | 'end') => {
    const parts = path.trim().split(/\s+/);
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

    // Determine current scale used in CSS
    const currentScale = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : SCALE_FACTOR;

    // Function to calculate relative coordinates (adjusting for the dynamic scale)
    const relativeX = (rect: DOMRect) => (rect.left - wrapperRect.left) / currentScale;
    const relativeY = (rect: DOMRect) => (rect.top - wrapperRect.top) / currentScale;

    const getWidth = (rect: DOMRect) => rect.width / currentScale;
    const getHeight = (rect: DOMRect) => rect.height / currentScale;

    // Path 1: Tasks (Right Center) → Timer (Left Center)
    const startX1 = relativeX(tasksRect) + getWidth(tasksRect) - 4;
    const startY1 = relativeY(tasksRect) + getHeight(tasksRect) / 2;
    const endX1 = relativeX(timerRect) + 4;
    const endY1 = relativeY(timerRect) + getHeight(timerRect) / 2;

    const controlOffset1 = 60;
    const path1String = `M ${startX1} ${startY1} C ${startX1 + controlOffset1} ${startY1} ${endX1 - controlOffset1} ${endY1} ${endX1} ${endY1}`;
    setPath1(path1String);

    // Path 2: Timer (Right Center) → Vault (Left Center)
    const startX2 = relativeX(timerRect) + getWidth(timerRect) - 4;
    const startY2 = relativeY(timerRect) + getHeight(timerRect) / 2;
    const endX2 = relativeX(vaultRect) + 4;
    const endY2 = relativeY(vaultRect) + getHeight(vaultRect) / 2;

    const controlOffset2 = 60;
    const path2String = `M ${startX2} ${startY2} C ${startX2 + controlOffset2} ${startY2} ${endX2 - controlOffset2} ${endY2} ${endX2} ${endY2}`;
    setPath2(path2String);

  }, []);


  // Handler functions
  const handleStart = async () => {
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

    // Create session in database
    if (!currentSessionId) {
      const sessionId = await databaseService.createSession(currentUser?.id || null, {
        duration_seconds: duration,
        type: 'FOCUS',
        focus_intensity: focusIntensity,
      });
      if (sessionId) {
        setCurrentSessionId(sessionId);
        // If it's a ghost session, save ID to localStorage
        if (!currentUser) {
          localStorage.setItem(GHOST_SESSION_KEY, sessionId);
        }
      }
    } else {
      // Update existing session to RUNNING
      await databaseService.updateSession(currentSessionId, {
        status: 'RUNNING',
      });
    }
  };
  const handlePause = async () => {
    // AUTH WALL: Intercept pause if not logged in
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setStatus(SessionStatus.PAUSED);
    // Update session status in database
    if (currentSessionId) {
      await databaseService.updateSession(currentSessionId, {
        status: 'PAUSED',
        elapsed_seconds: elapsed,
      });
    }
  };

  const handleReset = async () => {
    // Capture elapsed time for vault calculation before resetting
    const sessionElapsed = elapsed;

    setStatus(SessionStatus.IDLE);
    setElapsed(0);
    // CRITICAL: Reset fatigue metrics on full session reset
    setCurrentMetrics(null);
    setInsight('Ready to initiate Deep Work sequence.');

    // Mark session as completed in database
    if (currentSessionId) {
      await databaseService.updateSession(currentSessionId, {
        status: 'COMPLETED',
        elapsed_seconds: sessionElapsed,
        end_time: new Date().toISOString(),
      });

      // If it was a focus session, earn 1 bar per 10 minutes (600 seconds)
      if (mode === AppMode.FOCUS && currentUser) {
        const barsEarned = Math.floor(sessionElapsed / 600);
        if (barsEarned > 0) {
          await databaseService.incrementTotalReserve(currentUser.id, barsEarned);
          await refreshVaultStats();
        }
      }

      setCurrentSessionId(null);
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
    // State is handled by onAuthStateChange listener
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

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));

    // Update in database
    if (currentUser) {
      await databaseService.updateTask(id, { completed: newCompleted });
    }
  };

  const addTask = async (title: string) => {
    if (!currentUser) {
      // Local-only mode
      const newTask = { id: Date.now().toString(), title, completed: false, priority: 'medium' as const };
      setTasks(prev => [...prev, newTask]);
      return;
    }

    // Create in database
    const dbTask = await databaseService.createTask(currentUser?.id || null, {
      title,
      priority: 'medium',
      session_id: currentSessionId || undefined,
    });

    if (dbTask) {
      const newTask = databaseService.dbTaskToTask(dbTask);
      setTasks(prev => [...prev, newTask]);
    }
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
  }, [updatePaths, mode, tasks, hasEntered, showJourney, isFocusMode]);

  // Load user tasks on mount and subscribe to changes
  useEffect(() => {
    let subscription: any;

    const loadUserData = async () => {
      if (currentUser) {
        // Load initial tasks from database
        const dbTasks = await databaseService.getTasks(currentUser.id, false);
        const appTasks = dbTasks.map(databaseService.dbTaskToTask);
        setTasks(appTasks);

        // Subscribe to real-time updates
        subscription = databaseService.subscribeToTasks(currentUser.id, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTask = databaseService.dbTaskToTask(payload.new as any);
            setTasks(prev => {
              // Avoid duplicates
              if (prev.some(t => t.id === newTask.id)) return prev;
              return [newTask, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = databaseService.dbTaskToTask(payload.new as any);
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(t => t.id === payload.old.id));
          }
        });
      }
    };

    loadUserData();
    refreshVaultStats();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [currentUser, refreshVaultStats]);

  // Save metrics periodically
  useEffect(() => {
    if (currentMetrics && currentSessionId && status === SessionStatus.RUNNING) {
      // Save metrics every 10 seconds
      const saveInterval = setInterval(async () => {
        if (currentMetrics) {
          await databaseService.saveMetrics(currentSessionId, currentMetrics);
        }
      }, 10000);

      return () => clearInterval(saveInterval);
    }
  }, [currentMetrics, currentSessionId, status]);

  // Update session elapsed time periodically
  useEffect(() => {
    if (currentSessionId && status === SessionStatus.RUNNING) {
      const updateInterval = setInterval(async () => {
        await databaseService.updateSession(currentSessionId, {
          elapsed_seconds: elapsed,
        });
      }, 30000); // Every 30 seconds

      return () => clearInterval(updateInterval);
    }
  }, [currentSessionId, status, elapsed]);

  if (!hasEntered) {
    return <LandingPage onEnter={(data: any) => {
      // Start Ethereal 475Hz drone on first real interaction
      setHasEntered(true);
      setShowJourney(true);
      if (data) {
        // Set current user from auth
        if (data.user) {
          setCurrentUser(data.user);
        }

        // Apply AI settings
        handleIntensityChange(data.intensity);
        setInsight(data.insight);

        // Add the analyzed task
        addTask(data.task);

        // Auto-start Timer with "Beauty Shot" delay
        setElapsed(0);
        setCurrentMetrics(null);
        setStatus(SessionStatus.IDLE); // Explicitly show IDLE state first

        // Delay start by 2 seconds to showcase the UI
        setTimeout(() => {
          handleStart();
        }, 2000);
      }
    }} />;
  }

  if (showJourney) {
    return <ImmersiveJourney onComplete={() => setShowJourney(false)} />;
  }

  const path1Start = getPathCoords(path1, 'start');
  const path1End = getPathCoords(path1, 'end');
  const path2Start = getPathCoords(path2, 'start');
  const path2End = getPathCoords(path2, 'end');

  // Pre-calculate focus mode boolean for usage in the layout below
  // (Moved higher to avoid use-before-define)


  return (
    <div
      className={`h-screen bg-transparent text-gray-200 selection:bg-primary/30 relative overflow-hidden flex flex-col ${alienMode ? 'font-alien' : 'font-sans'}`}
    >
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
        onSignOut={handleSignOut}
        user={currentUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
          // Handshake logic is triggered by onAuthStateChange in useEffect
        }}
        intensityMode={insight.includes('Intensity') ? insight.split(' threshold')[0].replace('🚨 ', '') : 'Focus Mode'}
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
                className="flex flex-col md:flex-row justify-start items-center md:items-start w-full max-w-[1600px] px-4 md:-ml-32 relative"
                style={{
                  transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : `scale(${SCALE_FACTOR})`,
                  transformOrigin: 'center',
                  // CRITICAL FIX: Hide when not in FOCUS mode, but KEEP IT IN THE DOM
                  opacity: isFocusMode ? 1 : 0,
                  pointerEvents: isFocusMode ? 'auto' : 'none',
                  transition: 'opacity 0.5s ease-out'
                }}
              >
                {/* PRO DATABASE CONNECTION LINES - SVG REMAINS ALWAYS RENDERED */}
                <svg
                  className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-40 hidden md:block"
                  style={{ isolation: 'isolate' }}
                >
                  <defs>
                    {/* High visibility gradient */}
                    <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#c7d2fe" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                    </linearGradient>

                    {/* Subtle Glow */}
                    <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Perfect Geometric Arrow */}
                    <marker
                      id="arrow-head"
                      markerWidth="4"
                      markerHeight="4"
                      refX="3.5"
                      refY="2"
                      orient="auto"
                    >
                      <path
                        d="M0,0 L4,2 L0,4 Z"
                        fill="#c7d2fe"
                      />
                    </marker>
                  </defs>

                  {/* CONNECTION 1: Tasks → Timer */}
                  {path1 && (
                    <g filter="url(#subtle-glow)">
                      <path
                        d={path1}
                        fill="none"
                        stroke="url(#connection-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="8 8"
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
                    <g filter="url(#subtle-glow)">
                      <path
                        d={path2}
                        fill="none"
                        stroke="url(#connection-gradient)"
                        strokeWidth="1.5"
                        strokeDasharray="8 8"
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
                </svg>


                {/* 1. Left Column: Contextual Tasks - RENDERED ALWAYS */}
                <div ref={tasksRef} className={`w-full max-w-[24rem] min-h-[13rem] mt-24 md:mt-24 relative z-20 transition-opacity duration-700 ${isFocusMode ? 'opacity-100 animate-in slide-in-from-left-8 fade-in' : 'opacity-0'}`}>
                  {/* Only render TaskList content when in Focus mode */}
                  {isFocusMode ? (
                    <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
                  ) : (
                    <div className="h-full w-full" /> // Placeholder to maintain ref size/position
                  )}
                </div>

                {/* Connector 1 Placeholder */}
                <div className="w-[32rem] relative z-0 pointer-events-none" />

                {/* 2. Center Column: AI Optimized - RENDERED ALWAYS */}
                <div ref={timerRefDiv} className={`w-full max-w-[24rem] h-[15rem] relative z-30 transition-opacity duration-1000 ${isFocusMode ? 'opacity-100 animate-in zoom-in-95 fade-in' : 'opacity-0'}`}>
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
                <div className="w-[32rem] relative z-0 pointer-events-none" />

                {/* 3. Right Column: Gold Vault - RENDERED ALWAYS */}
                <div ref={vaultRef} className={`w-full max-w-[24rem] h-[9.25rem] mt-0 md:mt-24 relative z-20 transition-opacity duration-700 ${isFocusMode ? 'opacity-100 animate-in slide-in-from-right-8 fade-in' : 'opacity-0'}`}>
                  {/* Only render GoldVault content when in Focus mode */}
                  {isFocusMode ? (
                    <GoldVault
                      progress={(elapsed / duration) * 100}
                      barsToday={barsToday}
                      totalBars={totalBars}
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
    </div >
  );
};

export default App;