// App.tsx - WITH SUPABASE INTEGRATION
// FORCE REBUILD: 2026-01-03T14:12:00Z
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
import { PaywallModal } from './components/PaywallModal';
import { CountdownNotification } from './components/CountdownNotification';
import { MacNotification } from './components/MacNotification';
import { Moon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useSubscription } from './hooks/useSubscription';

const DEFAULT_DURATION = 25 * 60; // 25 min default
const SCALE_FACTOR = 1.05; // Restored to original scale as per request
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


  // Subscription Hook
  const { isPremium } = useSubscription();
  // const isPremium = false; // DEBUG: Hardcoded to false

  const [tasks, setTasks] = useState<Task[]>([]);
  const [alienMode, setAlienMode] = useState(false);

  // Fatigue state is initialized to null
  const [currentMetrics, setCurrentMetrics] = useState<FatigueMetrics | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<FatigueMetrics[]>([]);
  const [insight, setInsight] = useState('Initializing quantum focus systems...');
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);
  const [pendingStartUserId, setPendingStartUserId] = useState<string | null>(null);
  const [shouldTriggerCountdown, setShouldTriggerCountdown] = useState(false); // [NEW] Centralized trigger flag
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
  const [freeSessionsUsed, setFreeSessionsUsed] = useState(0);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    action?: { label: string; onClick: () => void };
  } | null>(null);

  // Layout Refs
  const tasksRef = useRef<HTMLDivElement>(null);
  const timerRefDiv = useRef<HTMLDivElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);

  // [NEW] Mobile detection state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // [SECURITY] Enforce Paywall State
  useEffect(() => {
    // If user is logged in AND not premium, and has entered the app, FORCE paywall open
    if (currentUser && hasEntered && !isPremium) {
      console.log("[App] Security: User is non-premium. Enforcing paywall.");
      setIsPaywallOpen(true);
    }
  }, [currentUser, hasEntered, isPremium]);

  // --- 4. AUTH & SESSION INITIALIZATION ---
  useEffect(() => {
    const initAuth = async () => {
      console.log("[App] initAuth starting...");
      setIsAuthLoading(true);

      // Check if this is an OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const isOAuthCallback = urlParams.get('authenticated') === 'true';

      // Clean up the URL if it's an OAuth callback
      if (isOAuthCallback) {
        console.log("[App] OAuth callback detected, cleaning URL...");
        window.history.replaceState({}, '', window.location.pathname);
      }

      try {
        const user = await authService.getUser();
        console.log("[App] initAuth found user:", user?.email || 'none');
        console.log("%c!!! CODE IS UPDATED - v1.2.2 !!!", "color: red; font-size: 20px; font-weight: bold;");

        if (user) {
          setCurrentUser(user);
          const pendingPlan = localStorage.getItem('pending_plan');
          if (pendingPlan) {
            console.log("[App] initAuth: Redirecting to checkout for plan:", pendingPlan);
            const productId = pendingPlan === 'annual' ? 'annual_id_placeholder' : 'ccmqg';
            const appUrl = window.location.origin;
            const redirectUrl = `${appUrl}/?payment_success=true`;
            const checkoutUrl = `https://ytterbiumlife.gumroad.com/l/${productId}?email=${encodeURIComponent(user.email || '')}&user_id=${user.id}&redirect_url=${encodeURIComponent(redirectUrl)}`;
            localStorage.removeItem('pending_plan');
            window.location.href = checkoutUrl;
            return;
          }

          // [CHANGE] Do NOT automatically bypass landing page just because user is auth'd.
          // We want them to enter a task/intention unless they have an ACTIVE session.
          if (user) {
            console.log("[App] User identity confirmed. Checking for active sessions...");
          }

          const activeSession = await databaseService.getCurrentSession(user.id);
          if (activeSession) {
            console.log("[App] initAuth: Restoring active session:", activeSession.id);
            setCurrentSessionId(activeSession.id);
            setStatus(activeSession.status as SessionStatus);
            setElapsed(activeSession.elapsed_seconds);
            setFocusIntensity(activeSession.focus_intensity);

            if (activeSession.type === 'RELAX') setMode(AppMode.RELAX);
            setInsight(`Welcome back. Resuming ${activeSession.type.toLowerCase()} session.`);
            setHasEntered(true); // ONLY bypass if there is an active session
          }

          // [CRITICAL] Check for pending session immediately after confirming user
          const pendingSession = localStorage.getItem('pending_session');
          if (pendingSession) {
            console.log("[App] initAuth: Detected pending session. Triggering restoration...");
            try {
              const sessionData = JSON.parse(pendingSession);
              localStorage.removeItem('pending_session');

              setInsight("Restoring your environment...");
              handleIntensityChange(sessionData.intensity);
              setInsight(sessionData.insight);

              await addTask(sessionData.task, user.id);

              // [FIX] Store data and set trigger instead of manual setTimeout
              setHasEntered(true); // CRITICAL: Must set this for useEffect to trigger
              setPendingStartUserId(user.id);
              setShouldTriggerCountdown(true);
              console.log("[App] initAuth Restoration: flags set for countdown trigger effect.");
            } catch (e) {
              console.error("[App] initAuth: Restoration failed", e);
            }
          }
        } else {
          console.log("[App] initAuth: No user found.");
          const ghostSessionId = localStorage.getItem(GHOST_SESSION_KEY);
          if (ghostSessionId) {
            console.log("[App] initAuth: Restoring ghost session:", ghostSessionId);
            setCurrentSessionId(ghostSessionId);
            setHasEntered(true);
            setInsight('Quantum session active. (Ghost Mode)');
          }
        }
      } catch (err) {
        console.error('[App] initAuth error:', err);
      } finally {
        console.log("[App] initAuth complete. isAuthLoading -> false");
        setIsAuthLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes globally
    const subscription = authService.onAuthStateChange(async (user) => {
      console.log("[App] Auth State Changed. User:", user?.email);

      // Only trigger updates if the user actually CHANGED
      // This prevents re-triggering logic on initial load which relies on initAuth
      setCurrentUser(prevUser => {
        if (prevUser?.id === user?.id) return prevUser;
        return user;
      });

      if (!user) {
        console.log("[App] onAuthStateChange: User is NULL. resetting state.");
        setHasEntered(false);
        setCurrentSessionId(null);
        setTasks([]);
      } else {
        // [FIX - 2026-01-03] REMOVED unconditional bypass. 
        // We do NOT want to auto-enter just because user is logged in.
        // We only auto-enter if there is a pending_session below.
        console.log("[App] onAuthStateChange: User found:", user.email);

        // [NEW] Also check for pending session here in case initAuth was too early
        const pendingSession = localStorage.getItem('pending_session');
        if (pendingSession) {
          console.log("[App] onAuthStateChange: Detected pending session. Restoring...");
          try {
            const sessionData = JSON.parse(pendingSession);
            localStorage.removeItem('pending_session');
            handleIntensityChange(sessionData.intensity);
            setInsight(sessionData.insight);
            addTask(sessionData.task, user.id);

            // [FIX] Store data and set trigger
            setHasEntered(true); // CRITICAL: Must set this for useEffect to trigger
            setPendingStartUserId(user.id);
            setShouldTriggerCountdown(true);
            console.log("[App] onAuthStateChange Restoration: flags set for countdown trigger effect.");
          } catch (e) {
            console.error("[App] onAuthStateChange: Restoration failed", e);
          }
        }

        // CHECK FOR PENDING PLAN REDIRECT (Race Condition Fix)
        const pendingPlan = localStorage.getItem('pending_plan');
        console.log("[App] Pending Plan Check:", pendingPlan);

        if (pendingPlan) {
          const msg = `[DEBUG] Redirecting to checkout for plan: ${pendingPlan}`;
          console.log(msg);
          // alert(msg); // Uncomment to force pause if needed

          // Redirect to checkout if they just signed up and intend to pay
          const productId = pendingPlan === 'annual' ? 'annual_id_placeholder' : 'ccmqg';
          const appUrl = window.location.origin;
          const redirectUrl = `${appUrl}/?payment_success=true`;
          const checkoutUrl = `https://ytterbiumlife.gumroad.com/l/${productId}?email=${encodeURIComponent(user.email || '')}&user_id=${user.id}&redirect_url=${encodeURIComponent(redirectUrl)}`;

          // Clear it to avoid loops, though redirect unloads page anyway
          localStorage.removeItem('pending_plan');
          window.location.href = checkoutUrl;
          return;
        }

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

  // Handle payment success redirect from Gumroad
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');

    if (paymentSuccess === 'true' && currentUser) {
      console.log("[App] Payment success detected, entering app...");

      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);

      // Show success notification
      setNotification({
        title: "Payment Successful!",
        message: "Welcome to Ytterbium Pro. Your subscription is now active.",
        action: {
          label: "Start Focus Session",
          onClick: () => {
            setHasEntered(true);
            setNotification(null);
          }
        }
      });

      // Auto-enter app after short delay
      setTimeout(() => {
        setHasEntered(true);
        setNotification(null);
      }, 3000);
    }
  }, [currentUser]);

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

        // [NEW] Trigger Mac-style notification for Relax exercises
        setNotification({
          title: "Recovery Recommended",
          message: "High cognitive load detected. Restore your focus with a guided relaxation session.",
          action: {
            label: "Open Relax Mode",
            onClick: () => {
              setMode(AppMode.RELAX);
              setNotification(null);
            }
          }
        });

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
  const handleStart = useCallback(async (overrideUserId?: string) => {
    console.log("[App] handleStart: Initiating focus sequence. overrideUserId:", overrideUserId);

    // Use override user ID if provided (from landing page flows), otherwise default to current user
    const effectiveUserId = overrideUserId || currentUser?.id || null;
    console.log("[App] handleStart: Effective user ID for session creation:", effectiveUserId);

    if (elapsed >= duration) {
      setElapsed(0);
      setCurrentMetrics(null);
      setStatus(SessionStatus.IDLE);
      setInsight('Ready to initiate Deep Work sequence.');
      return;
    }

    console.log("[App] handleStart: status -> RUNNING, insight -> AI optimizing focus...");
    setCurrentMetrics(null);
    setStatus(SessionStatus.RUNNING);
    setInsight('AI optimizing focus...');

    if (!currentSessionId) {
      console.log("[App] Creating fresh session for user:", effectiveUserId);
      const sessionId = await databaseService.createSession(effectiveUserId, {
        duration_seconds: duration,
        type: 'FOCUS',
        focus_intensity: focusIntensity,
      });
      if (sessionId) {
        setCurrentSessionId(sessionId);
        if (!effectiveUserId) {
          localStorage.setItem(GHOST_SESSION_KEY, sessionId);
        }
      }
    } else {
      console.log("[App] Resuming existing session:", currentSessionId);
      await databaseService.updateSession(currentSessionId, {
        status: 'RUNNING',
      });
    }
  }, [currentUser, duration, focusIntensity, currentSessionId, elapsed]);
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

          // Increment free sessions usage if not premium
          if (!isPremium && sessionElapsed > 600) {
            await databaseService.incrementFreeSessionsUsed(currentUser.id);
          }
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

  const deleteTask = async (id: string) => {
    // Update local state immediately for UI responsiveness
    setTasks(prev => prev.filter(t => t.id !== id));

    // Update in database
    if (currentUser) {
      await databaseService.deleteTask(id);
    }
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

  const addTask = useCallback(async (title: string, overrideUserId?: string) => {
    console.log("[App] addTask invoked. Title:", title, "overrideUserId:", overrideUserId);
    const effectiveUserId = overrideUserId || currentUser?.id || null;
    console.log("[App] effectiveUserId:", effectiveUserId);

    if (!effectiveUserId) {
      console.log("[App] No user ID, adding task to local state only");
      const newTask = { id: Date.now().toString(), title, completed: false, priority: 'medium' as const };
      setTasks(prev => {
        console.log("[App] Previous tasks:", prev);
        const updated = [...prev, newTask];
        console.log("[App] Updated tasks:", updated);
        return updated;
      });
      console.log("[App] Local task added");
      return;
    }

    try {
      console.log("[App] User ID exists, creating task in database...");
      const dbTask = await databaseService.createTask(effectiveUserId, {
        title,
        priority: 'medium',
        session_id: currentSessionId || undefined,
      });

      if (dbTask) {
        const newTask = databaseService.dbTaskToTask(dbTask);
        setTasks(prev => [...prev, newTask]);
        console.log("[App] Database task added to state");
      } else {
        throw new Error("Database returned null");
      }
    } catch (e) {
      console.error("[App] Failed to create task in database, falling back to local state:", e);
      // FALLBACK: Add to local state anyway so user sees it
      const newTask = { id: Date.now().toString(), title, completed: false, priority: 'medium' as const };
      setTasks(prev => [...prev, newTask]);
    }
  }, [currentUser, currentSessionId]);

  // Layout observer (Preserved)
  // Layout observer
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

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updatePaths);
    });

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
  }, [updatePaths, mode, tasks, hasEntered, isFocusMode]);

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

  // The pending session restoration is now handled directly in initAuth and onAuthStateChange
  // to prevent race conditions where hasEntered is set to true before this effect can run.
  useEffect(() => {
    // Primary restoration logic moved to initAuth and onAuthStateChange
  }, [currentUser, hasEntered]);

  // [NEW] Centralized effect to trigger the countdown after the dashboard mounts
  // [NEW] Centralized effect to trigger the countdown after the dashboard mounts

  // [RESTORED] Centralized effect to trigger the countdown after the dashboard mounts
  useEffect(() => {
    if (hasEntered && shouldTriggerCountdown) {
      console.log("[App] DEBUG: shouldTriggerCountdown sequence engaged", { status, countdownRemaining });

      // We wait 1.5 seconds to ensure all dashboard components (Sidebar, Background, etc) are painted
      const t = setTimeout(() => {
        console.log("[App] Firing auto-start sequence Now.");
        setShouldTriggerCountdown(false); // Reset the flag
        setCountdownRemaining(3);
      }, 1500);

      return () => clearTimeout(t);
    }
  }, [hasEntered, shouldTriggerCountdown, status]);

  // Countdown Timer for session start from landing page
  useEffect(() => {
    if (countdownRemaining !== null && countdownRemaining > 0) {
      console.log(`[App] Countdown Tick: ${countdownRemaining}`);
      const timer = setTimeout(() => {
        setCountdownRemaining(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdownRemaining === 0) {
      console.log("[App] Countdown hit zero! Starting session...");
      setCountdownRemaining(null);
      // Use the stored user ID for timer start
      handleStart(pendingStartUserId || undefined);
      // Clear the pending user ID after starting
      setPendingStartUserId(null);
    }
  }, [countdownRemaining, handleStart, pendingStartUserId]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] animate-pulse">Synchronizing auth state...</p>
      </div>
    );
  }

  // [URGENT] Move Notification to the VERY top level of the render to ensure visibility

  // [FIX] Consolidate rendering for cleaner state management and to prevent CountdownOverlay unmounting
  return (
    <>
      <div className="fixed bottom-2 right-2 text-[8px] text-white/20 z-[9999] pointer-events-none uppercase tracking-widest">
        Sync Engine v1.2.1-LISTENER
      </div>

      <AnimatePresence>
        {countdownRemaining !== null && (
          <CountdownNotification key="countdown-overlay" countdown={countdownRemaining} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRedirectingToCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-zinc-400 font-medium tracking-widest uppercase">Preparing your checkout...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasEntered ? (
        <LandingPage onEnter={async (data: any) => {
          console.log("[App] onEnter called from LandingPage. Intensity:", data?.intensity);

          if (data) {
            const userId = data.user?.id || currentUser?.id;
            const updatedUser = data.user || currentUser;

            // 1. Prepare Environment State
            handleIntensityChange(data.intensity);
            setInsight(data.insight);
            setElapsed(0);
            setCurrentMetrics(null);
            setStatus(SessionStatus.IDLE);
            setCurrentSessionId(null);
            setPendingStartUserId(userId || null);

            // 2. Check for Paywall
            const profile = userId ? await databaseService.getProfile(userId) : null;
            const sessionsUsed = (profile as any)?.free_sessions_used || 0;
            setFreeSessionsUsed(sessionsUsed);

            const needsPaywall = !isPremium && (!updatedUser || sessionsUsed >= 3);

            if (needsPaywall) {
              setIsPaywallOpen(true);
              setHasEntered(true); // Proceed to dashboard but show modal
            } else {
              // Standard Entry
              setHasEntered(true);
              setShouldTriggerCountdown(true);
              await addTask(data.task, userId);
            }
          }
        }} />
      ) : (
        <div
          className={`h-screen bg-[#050505] text-gray-200 selection:bg-primary/30 relative overflow-hidden flex flex-col ${alienMode ? 'font-alien' : 'font-sans'} ${isPaywallOpen ? 'pointer-events-none select-none' : ''}`}
        >
          <AIWhisper />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
          <Sidebar
            currentMode={mode}
            setMode={setMode}
            alienMode={alienMode}
            toggleAlienMode={() => setAlienMode(!alienMode)}
            onSignOut={handleSignOut}
            user={currentUser}
            focusIntensity={focusIntensity}
          />

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              setIsAuthModalOpen(false);
            }}
            intensityMode={insight.includes('Intensity') ? insight.split(' threshold')[0].replace('🚨 ', '') : 'Focus Mode'}
          />


          {/* MAIN CONTENT - FLOATING CARD LAYOUT */}
          {/* This wrapper creates the floating card effect next to the sidebar */}
          <main
            className="
                fixed md:top-12 md:right-12 md:bottom-12 md:left-[300px] 
                inset-0 md:inset-auto z-10 
                flex flex-col items-center justify-center 
                bg-[#0A0A0C] 
                md:rounded-[32px] 
                md:border md:border-white/5 
                overflow-hidden
                shadow-2xl
            "
            style={{ perspective: '1600px' }}
          >
            <AIOptimizedIndicator currentInsight={insight} />
            <Background />
            <CosmicParticles />
            <QuantumRippleBackground zIndex={5} />
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
                <div className="w-full h-full flex items-start justify-center pt-8 relative">
                  <div
                    ref={layoutWrapperRef}
                    className="flex flex-col md:flex-row justify-center items-center w-full max-w-[1600px] px-4 relative"
                    style={{
                      transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : `scale(${SCALE_FACTOR})`,
                      transformOrigin: 'center',
                      opacity: isFocusMode ? 1 : 0,
                      pointerEvents: isFocusMode ? 'auto' : 'none',
                      transition: 'opacity 0.5s ease-out'
                    }}
                  >
                    <svg
                      className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-40 hidden md:block"
                      style={{ isolation: 'isolate' }}
                    >
                      <defs>
                        <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                          <stop offset="50%" stopColor="#c7d2fe" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                        </linearGradient>
                        <filter id="subtle-glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <marker
                          id="arrow-head"
                          markerWidth="4"
                          markerHeight="4"
                          refX="3.5"
                          refY="2"
                          orient="auto"
                        >
                          <path d="M0,0 L4,2 L0,4 Z" fill="#c7d2fe" />
                        </marker>
                      </defs>

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
                            <animate attributeName="stroke-dashoffset" from="0" to="8" dur="3s" repeatCount="indefinite" calcMode="linear" />
                          </path>
                          <circle r="1.5" fill="#e0e7ff" fillOpacity="0.8">
                            <animateMotion dur="4s" repeatCount="indefinite" path={path1} rotate="auto" />
                          </circle>
                        </g>
                      )}

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
                            <animate attributeName="stroke-dashoffset" from="0" to="8" dur="3s" repeatCount="indefinite" calcMode="linear" begin="1s" />
                          </path>
                          <circle r="1.5" fill="#e0e7ff" fillOpacity="0.8">
                            <animateMotion dur="4s" repeatCount="indefinite" path={path2} rotate="auto" begin="2s" />
                          </circle>
                        </g>
                      )}
                    </svg>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 pt-20 md:pt-0">
                      <div ref={tasksRef} className={`w-full max-w-[16rem] min-h-[13rem] relative z-20 transition-opacity duration-700 ${isFocusMode ? 'opacity-100 animate-in slide-in-from-left-8 fade-in' : 'opacity-0'}`}>
                        {isFocusMode ? <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} onDelete={deleteTask} /> : <div className="h-full w-full" />}
                      </div>

                      {!isMobile && <div className="w-[16rem] relative z-0 pointer-events-none" />}

                      <div ref={timerRefDiv} className={`w-full max-w-[20rem] h-[15rem] relative z-30 transition-opacity duration-1000 ${isFocusMode ? 'opacity-100 animate-in zoom-in-95 fade-in' : 'opacity-0'}`}>
                        {isFocusMode ? (
                          <FocusTimer
                            status={status}
                            elapsedSeconds={elapsed}
                            durationSeconds={duration}
                            fatigueScore={currentMetrics?.fatigueScore || 0}
                            onStart={() => handleStart()}
                            onPause={handlePause}
                            onReset={handleReset}
                            onIntensityChange={handleIntensityChange}
                            currentIntensity={focusIntensity}
                            currentInsight={insight}
                          />
                        ) : <div className="h-full w-full" />}
                      </div>

                      {!isMobile && <div className="w-[16rem] relative z-0 pointer-events-none" />}

                      <div ref={vaultRef} className={`w-full max-w-[16rem] h-[9.25rem] mt-0 md:mt-24 relative z-20 transition-opacity duration-700 ${isFocusMode ? 'opacity-100 animate-in slide-in-from-right-8 fade-in' : 'opacity-0'}`}>
                        {isFocusMode ? (
                          <GoldVault
                            progress={(elapsed / duration) * 100}
                            barsToday={barsToday}
                            totalBars={totalBars}
                          />
                        ) : <div className="h-full w-full" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`absolute inset-0 flex items-center justify-center pointer-events-${mode !== AppMode.FOCUS ? 'auto' : 'none'}`}>
                  <AnimatePresence>
                    {mode === AppMode.RELAX && (
                      <MotionDiv key="relax" initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -50, scale: 0.9 }} transition={{ duration: 0.5 }}>
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
                      <MotionDiv key="stats" initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -50, scale: 0.9 }} transition={{ duration: 0.5 }}>
                        <StatsView metricsHistory={metricsHistory} />
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
              </MotionDiv>
            </AnimatePresence>
          </main>
        </div>
      )}

      {/* Paywall Gate */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onAuth={async (isAnnual) => {
          localStorage.setItem('pending_plan', isAnnual ? 'annual' : 'monthly');
          await authService.signInWithGoogle();
        }}
      />
      <MacNotification
        isVisible={!!notification}
        title={notification?.title || ''}
        message={notification?.message || ''}
        icon={<Moon className="w-5 h-5 text-indigo-300" />}
        onClose={() => setNotification(null)}
        action={notification?.action}
      />
    </>
  );
};

export default App;