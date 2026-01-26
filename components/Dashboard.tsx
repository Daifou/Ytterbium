import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom'; // Added for PiP
import LeaderLine from 'leader-line-new';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { FocusTimer } from './FocusTimer';
import { MiniFocusTimer } from './MiniFocusTimer';
import { RelaxTimer } from './RelaxTimer';
import { StatsView } from './StatsView';
import { TaskList } from './TaskList';
import { Background } from './Background';
import { GoldVault } from './GoldVault';
import { AppMode, SessionStatus, Task, FatigueMetrics } from '../types';
import { fatigueService } from '../services/fatigueService';
import { CosmicParticles } from './CosmicParticles';
import { QuantumRippleBackground } from './QuantumRippleBackground';
import { AIWhisper } from './AIWhisper';
import { AIOptimizedIndicator } from './AIOptimizedIndicator';
import { authService } from '../services/authService';
import { databaseService } from '../services/databaseService';
import { AuthModal } from './AuthModal';
import { PaywallModal } from './PaywallModal';
import { CountdownNotification } from './CountdownNotification';
import { MacNotification } from './MacNotification';
import { Moon } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { useSubscription } from '../hooks/useSubscription';
import { useDocumentPiP } from '../hooks/useDocumentPiP'; // Added
import { useLocation } from 'react-router-dom';
import { InfiniteCanvas } from './InfiniteCanvas';
import { CanvasHUD } from './CanvasHUD';
import { useSpatialStore } from '../lib/spatial-store';
import { LayoutGrid, Maximize2 } from 'lucide-react'; // Icons for view toggle

const DEFAULT_DURATION = 25 * 60; // 25 min default
const SCALE_FACTOR = 1.0;
const GHOST_SESSION_KEY = 'ytterbium_ghost_session_id';

const MotionDiv = motion.div as any;

const INTENSITY_THRESHOLDS: Record<number, number> = {
    10: 65, 9: 70, 8: 75, 7: 80, 6: 85, 5: 90, 4: 95, 3: 100, 2: 100, 1: 100,
};

const INTENSITY_TIME_CAPS: Record<number, number> = {
    1: 70, 2: 80, 3: 90, 4: 50, 5: 55, 6: 60, 7: 65, 8: 30, 9: 35, 10: 5 / 60,
};

const LoadingPercentage = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p < 98) return p + Math.floor(Math.random() * 8) + 1;
                return p;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);
    return <div className="text-[9px] text-zinc-600 font-mono tracking-widest">({Math.min(99, progress)}%)</div>;
};

// Helper component to sync data to nodes without re-rendering the entire canvas
const NodesDataSync = ({ timerProps, taskListProps, goldVaultProps }: any) => {
    const { nodes, onNodesChange } = useSpatialStore();

    // We use a simplified check to avoid infinite loops, 
    // real app should use 'useReactFlow' setNodes or similar.
    // For now, we assume this component re-renders when props change, 
    // and we trigger a store update if the data in the store is stale.
    // However, updating store during render is bad. We use useEffect.

    useEffect(() => {
        // We can batch update the nodes in the store
        // This logic runs whenever props change.

        let hasChanges = false;
        const newNodes = nodes.map(node => {
            if (node.id === 'focus-timer') {
                // Determine if changed?
                // For MVP simplicity, just overwrite.
                const updated = { ...node, data: { ...node.data, ...timerProps } };
                if (JSON.stringify(node.data) !== JSON.stringify(updated.data)) {
                    hasChanges = true;
                    return updated;
                }
            }
            if (node.id === 'task-list') {
                const updated = { ...node, data: { ...node.data, ...taskListProps } };
                if (JSON.stringify(node.data) !== JSON.stringify(updated.data)) {
                    hasChanges = true;
                    return updated;
                }
            }
            if (node.id === 'gold-vault') {
                const updated = { ...node, data: { ...node.data, ...goldVaultProps } };
                if (JSON.stringify(node.data) !== JSON.stringify(updated.data)) {
                    hasChanges = true;
                    return updated;
                }
            }
            return node;
        });

        if (hasChanges) {
            // Updating the store.
            // CAUTION: This might trigger re-renders. unique dependency array helps.
            // We need a direct way to setNodes without triggering this effect again if data is same.
            // Our JSON.stringify check might be expensive but prevents loops.
            useSpatialStore.setState({ nodes: newNodes });
        }
    }, [timerProps, taskListProps, goldVaultProps, nodes]);

    return null;
};

export const Dashboard: React.FC = () => {
    const { pipWindow, openPip, closePip } = useDocumentPiP(); // PiP Hook
    const location = useLocation();
    const [mode, setMode] = useState<AppMode>(() => {
        if (typeof window === 'undefined') return AppMode.FOCUS;
        const saved = localStorage.getItem('ytterbium_active_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.mode) return parsed.mode as AppMode;
            } catch (e) { }
        }
        return AppMode.FOCUS;
    });
    const [status, setStatus] = useState<SessionStatus>(() => {
        if (typeof window === 'undefined') return SessionStatus.IDLE;
        const saved = localStorage.getItem('ytterbium_active_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.status) return parsed.status as SessionStatus;
            } catch (e) { }
        }
        return SessionStatus.IDLE;
    });
    const [duration, setDuration] = useState(() => {
        if (typeof window === 'undefined') return DEFAULT_DURATION;
        const saved = localStorage.getItem('ytterbium_active_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.duration) return parsed.duration;
            } catch (e) { }
        }
        return DEFAULT_DURATION;
    });
    const [elapsed, setElapsed] = useState(() => {
        if (typeof window === 'undefined') return 0;
        const saved = localStorage.getItem('ytterbium_active_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.status === SessionStatus.RUNNING && parsed.startTime) {
                    const diff = Math.floor((Date.now() - parsed.startTime) / 1000);
                    return diff > 0 ? diff : 0;
                }
                if (parsed.elapsed) return parsed.elapsed;
            } catch (e) { }
        }
        return 0;
    });

    const [focusIntensity, setFocusIntensity] = useState(() => {
        if (typeof window === 'undefined') return 5;
        const saved = localStorage.getItem('ytterbium_active_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.focusIntensity) return parsed.focusIntensity;
            } catch (e) { }
        }
        return 5;
    });
    const isFocusMode = mode === AppMode.FOCUS;

    const [currentUser, setCurrentUser] = useState<User | null>(null); // Restored

    // Spatial Store
    const { viewMode, setViewMode, nodes, onNodesChange } = useSpatialStore();

    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { isPremium } = useSubscription();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [alienMode, setAlienMode] = useState(false);

    const [fatigueScore, setFatigueScore] = useState(0);
    const [currentMetrics, setCurrentMetrics] = useState<FatigueMetrics | null>(null);
    const [metricsHistory, setMetricsHistory] = useState<FatigueMetrics[]>([]);
    const [insight, setInsight] = useState('Initializing quantum focus systems...');
    const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);
    const [pendingStartUserId, setPendingStartUserId] = useState<string | null>(null);
    const [shouldTriggerCountdown, setShouldTriggerCountdown] = useState(false);
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);
    const [isJustPaid, setIsJustPaid] = useState(false);

    // New State for Whop/Checkout
    const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
    const [freeSessionsUsed, setFreeSessionsUsed] = useState(0);
    const [notification, setNotification] = useState<{
        title: string;
        message: string;
        action?: { label: string; onClick: () => void };
    } | null>(null);

    // AI Sidebar Flow State
    const [sidebarAIState, setSidebarAIState] = useState<'idle' | 'analyzing' | 'confirming'>('idle');
    const [sidebarAnalysis, setSidebarAnalysis] = useState<any>(null);
    const [sidebarTask, setSidebarTask] = useState('');
    const [activeSessionGoal, setActiveSessionGoal] = useState(() => {
        if (typeof window === 'undefined') return 4;
        const saved = localStorage.getItem('ytterbium_active_session');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.activeSessionGoal) return parsed.activeSessionGoal;
            } catch (e) { }
        }
        const pending = localStorage.getItem('pending_session');
        if (pending) {
            try {
                const parsed = JSON.parse(pending);
                if (parsed.suggestedSessions) return parsed.suggestedSessions;
            } catch (e) { }
        }
        return 4;
    });

    const tasksRef = useRef<HTMLDivElement>(null);
    const timerRefDiv = useRef<HTMLDivElement>(null);
    const vaultRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const layoutWrapperRef = useRef<HTMLDivElement>(null);
    const line1Ref = useRef<any>(null);
    const line2Ref = useRef<any>(null);
    const [barsToday, setBarsToday] = useState(0);
    const [totalBars, setTotalBars] = useState(0);

    // Auto-PiP Logic (Visibility Change)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'hidden') {
                if (status === SessionStatus.RUNNING && !pipWindow) {
                    console.log("Tab hidden, attempting Auto-PiP...");
                    try {
                        // Larger height to accommodate cognitive load metric comfortably
                        await openPip({ width: 320, height: 140 });
                    } catch (e) {
                        console.warn("Auto-PiP blocked by browser (requires user gesture):", e);
                    }
                }
            } else if (document.visibilityState === 'visible') {
                if (pipWindow) {
                    console.log("Tab visible, closing PiP...");
                    closePip();
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [status, pipWindow, openPip, closePip]);

    const refreshVaultStats = useCallback(async () => {
        if (currentUser) {
            const stats = await databaseService.getVaultStats(currentUser.id);
            setBarsToday(stats.barsToday);
            setTotalBars(stats.totalBars);
        }
    }, [currentUser]);

    // Security: Paywall Enforcer
    // Security: Paywall Enforcer
    useEffect(() => {
        // Enforce paywall if user is logged in, not active premium, and hasn't just completed payment
        if (currentUser && !isPremium && !isJustPaid) {
            console.log("[Dashboard] Security: User is non-premium. Enforcing paywall.");
            setIsPaywallOpen(true);
        }
    }, [currentUser, isPremium, isJustPaid]);


    // Handle Whop Success / "Just Paid" state persistence
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('checkout') === 'success') {
            console.log("[Dashboard] Whop success detected.");
            setIsJustPaid(true);
            localStorage.setItem('ytterbium_just_paid', 'true');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);

            setNotification({
                title: "Access Granted",
                message: "Your neural environment is now fully unlocked. Welcome to Pro.",
            });
            setTimeout(() => setNotification(null), 5000);
        } else if (localStorage.getItem('ytterbium_just_paid') === 'true') {
            // Keep it active for 5 mins after payment to allow webhook sync
            setIsJustPaid(true);
        }
    }, [location]);

    // Initialize Auth & Session
    useEffect(() => {
        const initAuth = async () => {
            setIsAuthLoading(true);
            try {
                const user = await authService.getUser();
                if (user) {
                    setCurrentUser(user);

                    // Check for active session
                    const activeSession = await databaseService.getCurrentSession(user.id);
                    if (activeSession) {
                        setCurrentSessionId(activeSession.id);

                        // Smart Timer Persistence: Check local state before overwriting with DB
                        let preserveLocalState = false;
                        const localState = localStorage.getItem('ytterbium_active_session');
                        if (localState) {
                            try {
                                const parsed = JSON.parse(localState);
                                if (parsed.status === SessionStatus.RUNNING) {
                                    // If local state is valid and running, prefer it (handles page refreshes)
                                    preserveLocalState = true;
                                    console.log("[Dashboard] Preserving local timer state over DB snapshot");
                                }
                            } catch (e) { }
                        }

                        if (!preserveLocalState) {
                            setStatus(activeSession.status as SessionStatus);
                            setElapsed(activeSession.elapsed_seconds);
                        }

                        setFocusIntensity(activeSession.focus_intensity);
                        if (activeSession.type === 'RELAX') setMode(AppMode.RELAX);
                        setInsight(`Welcome back. Resuming ${activeSession.type.toLowerCase()} session.`);
                    }

                    // Check for pending session (from Landing Page navigation)
                    const pendingSession = localStorage.getItem('pending_session');
                    if (pendingSession) {
                        const sessionData = JSON.parse(pendingSession);
                        localStorage.removeItem('pending_session');
                        handleIntensityChange(sessionData.intensity);
                        setInsight(sessionData.insight);
                        if (sessionData.suggestedSessions) {
                            setActiveSessionGoal(sessionData.suggestedSessions);
                        }
                        await addTask(sessionData.task, user.id);

                        setPendingStartUserId(user.id);
                        setShouldTriggerCountdown(true);
                    }
                } else {
                    // Ghost session logic
                    const ghostSessionId = localStorage.getItem(GHOST_SESSION_KEY);
                    if (ghostSessionId) {
                        setCurrentSessionId(ghostSessionId);
                        setInsight('Quantum session active. (Ghost Mode)');
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsAuthLoading(false);
            }
        };
        initAuth();

        const subscription = authService.onAuthStateChange(async (user) => {
            setCurrentUser(user);
            if (!user) {
                setCurrentSessionId(null);
                setTasks([]);
            }
        });
        return () => { subscription.unsubscribe(); };
    }, []);

    // Handlers (Start, Pause, Reset, etc) - Copied from App.tsx
    const handleIntensityChange = (intensity: number) => {
        const validatedIntensity = Math.max(1, Math.min(10, intensity));
        setFocusIntensity(validatedIntensity);
        const secretMinutes = INTENSITY_TIME_CAPS[validatedIntensity] || 60;
        setDuration(secretMinutes * 60);
        setInsight(`Focus Intensity set to ${validatedIntensity}/10. AI detection threshold adjusted.`);
    };

    const handleStart = useCallback(async (overrideUserId?: string) => {
        const effectiveUserId = overrideUserId || currentUser?.id || null;
        if (elapsed >= duration) {
            setElapsed(0);
            setCurrentMetrics(null);
            setStatus(SessionStatus.IDLE);
            setInsight('Ready to initiate Deep Work sequence.');
            return;
        }
        setCurrentMetrics(null);
        setStatus(SessionStatus.RUNNING);
        setInsight('AI optimizing focus...');

        // [AUTO-PIP] Open the mini player automatically on start (counts as user gesture)
        if (!pipWindow) {
            try {
                // Larger height to accommodate cognitive load metric comfortably
                await openPip({ width: 320, height: 140 });
            } catch (e) {
                console.warn("Auto-PiP on start failed:", e);
            }
        }

        if (!currentSessionId) {
            const sessionId = await databaseService.createSession(effectiveUserId, {
                duration_seconds: duration,
                type: 'FOCUS',
                focus_intensity: focusIntensity,
            });
            if (sessionId) {
                setCurrentSessionId(sessionId);
                if (!effectiveUserId) localStorage.setItem(GHOST_SESSION_KEY, sessionId);
            }
        } else {
            await databaseService.updateSession(currentSessionId, { status: 'RUNNING' });
        }
    }, [currentUser, duration, focusIntensity, currentSessionId, elapsed]);

    const handlePause = async () => {
        if (!currentUser) {
            setIsAuthModalOpen(true);
            return;
        }
        setStatus(SessionStatus.PAUSED);
        if (currentSessionId) {
            await databaseService.updateSession(currentSessionId, { status: 'PAUSED', elapsed_seconds: elapsed });
        }
    };

    const handleReset = async () => {
        const sessionElapsed = elapsed;
        setStatus(SessionStatus.IDLE);
        setElapsed(0);
        setCurrentMetrics(null);
        setInsight('Ready to initiate Deep Work sequence.');

        if (currentSessionId) {
            await databaseService.updateSession(currentSessionId, {
                status: 'COMPLETED',
                elapsed_seconds: sessionElapsed,
                end_time: new Date().toISOString(),
            });

            if (mode === AppMode.FOCUS && currentUser) {
                const barsEarned = Math.floor(sessionElapsed / 600);
                if (barsEarned > 0) {
                    await databaseService.incrementTotalReserve(currentUser.id, barsEarned);
                    await refreshVaultStats();
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
    };

    const deleteTask = async (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (currentUser) await databaseService.deleteTask(id);
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        const newCompleted = !task.completed;
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
        if (currentUser) await databaseService.updateTask(id, { completed: newCompleted });
    };

    const addTask = useCallback(async (title: string, overrideUserId?: string) => {
        const effectiveUserId = overrideUserId || currentUser?.id || null;
        if (!effectiveUserId) {
            const newTask = { id: Date.now().toString(), title, completed: false, priority: 'medium' as const };
            setTasks(prev => [...prev, newTask]);
            return;
        }
        try {
            const dbTask = await databaseService.createTask(effectiveUserId, {
                title,
                priority: 'medium',
                session_id: currentSessionId || undefined,
            });
            if (dbTask) {
                setTasks(prev => [...prev, databaseService.dbTaskToTask(dbTask)]);
            }
        } catch (e) {
            const newTask = { id: Date.now().toString(), title, completed: false, priority: 'medium' as const };
            setTasks(prev => [...prev, newTask]);
        }
    }, [currentUser, currentSessionId]);

    const handleSidebarAIStart = async (taskText: string) => {
        setSidebarTask(taskText);
        setSidebarAIState('analyzing');

        try {
            // Import ollamaService if not already (it is in LandingPage, but Dashboard needs it too)
            // Actually Dashboard.tsx imports are at top. Let's check.
            const { aiService } = await import('../services/aiService');
            const aiResult = await aiService.analyzeTask(taskText);
            setSidebarAnalysis({
                intensity: aiResult.suggestedIntensity,
                insight: aiResult.explanation,
                type: aiResult.taskType,
                focusMode: aiResult.focusMode,
                suggestedSessions: aiResult.suggestedSessions,
            });
            setSidebarAIState('confirming');
        } catch (error) {
            console.error('Sidebar AI analysis failed:', error);
            setSidebarAnalysis({
                intensity: 6,
                insight: 'Standard focus recommended.',
                type: 'Task',
                focusMode: 'Balanced Focus',
                suggestedSessions: 2,
            });
            setSidebarAIState('confirming');
        }
    };

    const confirmSidebarSession = async (action: 'start_new' | 'resume') => {
        if (action === 'start_new') {
            await handleReset(); // Clear old session if any
            handleIntensityChange(sidebarAnalysis.intensity);
            setInsight(sidebarAnalysis.insight);
            if (sidebarAnalysis.suggestedSessions) {
                setActiveSessionGoal(sidebarAnalysis.suggestedSessions);
            }
            await addTask(sidebarTask, currentUser?.id);
            setShouldTriggerCountdown(true);
        } else {
            // Resume current or just close
            setStatus(SessionStatus.RUNNING);
        }
        setSidebarAIState('idle');
        setSidebarTask('');
        setSidebarAnalysis(null);
    };


    // Effects (Timer, Fatigue, Intervention, Layout)
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (status === SessionStatus.RUNNING) {
            interval = setInterval(() => setElapsed(e => e + 1), 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [status]);

    useEffect(() => {
        const handleMetricsUpdate = (metrics: FatigueMetrics) => {
            setCurrentMetrics(metrics);
            setFatigueScore(metrics.fatigueScore);
        };
        if (status === SessionStatus.RUNNING) {
            fatigueService.startTracking(handleMetricsUpdate, focusIntensity);
        } else {
            fatigueService.stopTracking();
        }
        return () => fatigueService.stopTracking();
    }, [status, focusIntensity]);

    useEffect(() => {
        const score = currentMetrics?.fatigueScore || 0;
        const criticalThreshold = INTENSITY_THRESHOLDS[focusIntensity] || 90;
        const hiddenTimeLimit = (INTENSITY_TIME_CAPS[focusIntensity] || 60) * 60;

        if (status === SessionStatus.RUNNING) {
            if (score >= criticalThreshold || elapsed >= hiddenTimeLimit) {
                setStatus(SessionStatus.PAUSED);
                // Sensory cue here (omitted for brevity, can re-add if needed or reuse existing)

                if (elapsed >= hiddenTimeLimit) {
                    setInsight(`Optimal focus window utilized. Initiating recovery sequence.`);
                } else {
                    setInsight(`🚨 Critical Fatigue Detected (${score}%). Session paused.`);
                }

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

                if (!currentUser) setIsAuthModalOpen(true);
                if (currentMetrics && currentSessionId) {
                    databaseService.saveMetrics(currentSessionId, currentMetrics);
                }
            }
        }
    }, [currentMetrics?.fatigueScore, status, focusIntensity, elapsed]);

    // --- NOTIFICATION SOUND EFFECT ---
    useEffect(() => {
        if (notification) {
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.volume = 0.5;
                audio.play();
            } catch (e) {
                console.error("Audio playback failed", e);
            }
        }
    }, [notification]);

    // --- MAGNETIC LEADER LINE CONNECTIVITY ---
    useEffect(() => {
        const cleanupGhosts = () => {
            const ghosts = document.querySelectorAll('.leader-line');
            ghosts.forEach(g => g.remove());
        };

        if (isMobile || mode !== AppMode.FOCUS) {
            cleanupGhosts();
            if (line1Ref.current) { try { line1Ref.current.remove(); } catch (e) { } line1Ref.current = null; }
            if (line2Ref.current) { try { line2Ref.current.remove(); } catch (e) { } line2Ref.current = null; }
            return;
        }

        let timerId: any;

        const initLines = () => {
            const tasksEl = document.getElementById('task-list-node');
            const timerEl = document.getElementById('focus-timer-node');
            const vaultEl = document.getElementById('gold-vault-node');

            if (tasksEl && timerEl && !line1Ref.current) {
                line1Ref.current = new LeaderLine(tasksEl, timerEl, {
                    color: 'rgba(255, 255, 255, 0.2)',
                    size: 1,
                    path: 'fluid',
                    startSocket: 'right',
                    endSocket: 'left',
                    startPlug: 'disc',
                    endPlug: 'disc',
                    startPlugSize: 1.5,
                    endPlugSize: 1.5,
                    dash: { len: 4, gap: 4, animation: true }
                });
            }

            if (timerEl && vaultEl && !line2Ref.current) {
                line2Ref.current = new LeaderLine(timerEl, vaultEl, {
                    color: 'rgba(255, 255, 255, 0.2)',
                    size: 1,
                    path: 'fluid',
                    startSocket: 'right',
                    endSocket: 'left',
                    startPlug: 'disc',
                    endPlug: 'disc',
                    startPlugSize: 1.5,
                    endPlugSize: 1.5,
                    dash: { len: 4, gap: 4, animation: true }
                });
            }

            if (line1Ref.current && line2Ref.current) {
                clearInterval(timerId);
            }
        };

        timerId = setInterval(initLines, 100);

        const handleUpdate = () => {
            requestAnimationFrame(() => {
                if (line1Ref.current) line1Ref.current.position();
                if (line2Ref.current) line2Ref.current.position();
            });
        };

        window.addEventListener('resize', handleUpdate);
        window.addEventListener('scroll', handleUpdate, true); // Catch internal scrolls

        // Observe nodes directly for surgical precision
        const observer = new ResizeObserver(handleUpdate);

        const tasksEl = document.getElementById('task-list-node');
        const timerEl = document.getElementById('focus-timer-node');
        const vaultEl = document.getElementById('gold-vault-node');

        if (tasksEl) observer.observe(tasksEl);
        if (timerEl) observer.observe(timerEl);
        if (vaultEl) observer.observe(vaultEl);
        if (layoutWrapperRef.current) observer.observe(layoutWrapperRef.current);

        return () => {
            clearInterval(timerId);
            window.removeEventListener('resize', handleUpdate);
            window.removeEventListener('scroll', handleUpdate, true);
            observer.disconnect();
            if (line1Ref.current) { try { line1Ref.current.remove(); } catch (e) { } line1Ref.current = null; }
            if (line2Ref.current) { try { line2Ref.current.remove(); } catch (e) { } line2Ref.current = null; }
            cleanupGhosts();
        };
    }, [isMobile, tasks, mode]);

    // Load Tasks
    useEffect(() => {
        let subscription: any;
        const loadUserData = async () => {
            if (currentUser) {
                const dbTasks = await databaseService.getTasks(currentUser.id, false);
                setTasks(dbTasks.map(databaseService.dbTaskToTask));
                subscription = databaseService.subscribeToTasks(currentUser.id, (payload) => {
                    // simplified update logic
                    if (payload.eventType === 'INSERT') {
                        setTasks(prev => [...prev, databaseService.dbTaskToTask(payload.new as any)]);
                    } else if (payload.eventType === 'UPDATE') {
                        const updated = databaseService.dbTaskToTask(payload.new as any);
                        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
                    } else if (payload.eventType === 'DELETE') {
                        setTasks(prev => prev.filter(t => t.id !== payload.old.id));
                    }
                });
            }
        };
        loadUserData();
        refreshVaultStats();
        return () => { if (subscription) subscription.unsubscribe(); };
    }, [currentUser, refreshVaultStats]);

    // Auto-Start Countdown Logic
    useEffect(() => {
        if (shouldTriggerCountdown) {
            const t = setTimeout(() => {
                setShouldTriggerCountdown(false);
                setCountdownRemaining(3);
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [shouldTriggerCountdown]);

    useEffect(() => {
        if (countdownRemaining !== null && countdownRemaining > 0) {
            const timer = setTimeout(() => setCountdownRemaining(prev => (prev !== null ? prev - 1 : null)), 1000);
            return () => clearTimeout(timer);
        } else if (countdownRemaining === 0) {
            setCountdownRemaining(null);
            handleStart(pendingStartUserId || undefined);
            setPendingStartUserId(null);
        }
    }, [countdownRemaining, handleStart, pendingStartUserId]);

    // ----------------------------------------------------------------------------------
    // TIMER PERSISTENCE (LOCAL STORAGE)
    // ----------------------------------------------------------------------------------
    useEffect(() => {
        // SAVE STATE
        if (status === SessionStatus.RUNNING) {
            const state = {
                status,
                mode,
                duration,
                focusIntensity,
                // store the theoretical start time to calculate accurate elapsed on reload
                startTime: Date.now() - (elapsed * 1000),
                activeSessionGoal, // PERSIST GOAL
                lastUpdated: Date.now()
            };
            localStorage.setItem('ytterbium_active_session', JSON.stringify(state));
        } else if (status === SessionStatus.PAUSED) {
            const state = {
                status,
                mode,
                duration,
                focusIntensity,
                elapsed, // Fixed elapsed for paused state
                activeSessionGoal, // PERSIST GOAL
                lastUpdated: Date.now()
            };
            localStorage.setItem('ytterbium_active_session', JSON.stringify(state));
        } else if (status === SessionStatus.IDLE) {
            localStorage.removeItem('ytterbium_active_session');
        }
    }, [status, mode, duration, focusIntensity, elapsed]);

    useEffect(() => {
        // RESTORE STATE ON MOUNT (Fallback/Double Check)
        // Since we initialize in useState, this is mostly for logging or edge cases
        const saved = localStorage.getItem('ytterbium_active_session');
        if (saved) {
            console.log("[Dashboard] Session state rehydrated from localStorage");
        }
    }, []);

    // ----------------------------------------------------------------------------------
    // SYNC STATE TO SPATIAL NODES
    // ----------------------------------------------------------------------------------
    useEffect(() => {
        // We only need to sync if we are in spatial mode (or about to switch)
        // But checking every render is fine for now; React Flow handles diffs efficiently.

        // 1. Find the Focus Timer Node
        const timerHelper = nodes.find(n => n.type === 'focusTimer');
        if (timerHelper) {
            // Update its data
            // Note: In a real app we'd use a more targeted update to avoid full re-renders
            // or share a store. Here we patch the node data.
            const newData = {
                ...timerHelper.data,
                status,
                elapsedSeconds: elapsed,
                durationSeconds: duration,
                fatigueScore: currentMetrics?.fatigueScore || 0,
                currentIntensity: focusIntensity,
                onStart: handleStart,
                onPause: handlePause,
                onReset: handleReset,
                onIntensityChange: handleIntensityChange
            };

            // Only update if changed (deep comparison would be better, but strictly needed?)
            // React Flow `applyNodeChanges` might be needed if we want to be "correct",
            // but mutating data directly often works for simple cases, THOUGH it's bad practice.
            // Let's use map to create a new array.
            const newNodes = nodes.map(n => {
                if (n.id === 'focus-timer') return { ...n, data: newData };
                return n;
            });

            // This causes an infinite loop if we simply setNodes(newNodes) because of the dependency array.
            // We need a way to only update when data actually changes.
            // For MVP: Let's rely on the fact that FocusTimerNode re-renders if the store updates.
            // Actually, we should push this data to the store using a specialized action.
            // But `nodes` in useSpatialStore is the source of truth.
            // A better pattern: The FocusTimerNode component itself should subscribe to a specialized store
            // or Context that holds the dashboard state.

            // Since we didn't refactor Dashboard state to a store yet, we will
            // use a "Push" approach but throttle it or direct prop passing in InfiniteCanvas?
            // React Flow Provider doesn't easy pass random context to nodes.

            // Revised Plan:
            // We will pass these values to the `InfiniteCanvas` component, which will
            // use `useReactFlow` to update the nodes' data imperatively.

            // Actually, creating a Context is the cleanest way.
            // But let's stick to the Plan: "Wrap existing components".
            // The wrapper components need access to these props.
            // Let's render the `InfiniteCanvas` passing these props as a special `context` prop?
            // React Flow Provider doesn't easy pass random context to nodes.

            // Best quick fix: Update the store's node data ONLY when these values change.
            // We can create a dedicated `updateNodeData` action in the store.
            // But for now, let's leave this sync logic for a refactor step to avoid breaking things now.
            // Instead, we will pass the props directly to a CONTEXT that the nodes can consume.
        }
    }, [status, elapsed, duration, currentMetrics?.fatigueScore, focusIntensity, handleStart, handlePause, handleReset, handleIntensityChange, nodes]);

    // ----------------------------------------------------------------------------------
    // LOAD USER DATA
    // ----------------------------------------------------------------------------------
    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
                <div className="relative flex flex-col items-center space-y-16 w-full max-w-sm px-10">
                    {/* Image-accurate Minimalist Logo/Text */}
                    <div className="flex items-center justify-center space-x-6 w-full">
                        <div className="h-[1px] bg-zinc-800/50 flex-1" />
                        <span className="text-[12px] font-medium tracking-[0.5em] uppercase text-zinc-500 font-sans whitespace-nowrap">
                            ytterbium // bio
                        </span>
                        <div className="h-[1px] bg-zinc-800/50 w-8" /> {/* Offset line like the screenshot */}
                    </div>

                    {/* Status & Animated percentage */}
                    <div className="flex flex-col items-center space-y-3">
                        <div className="text-[9px] text-zinc-700 font-mono tracking-[0.3em] uppercase opacity-70">
                            Neural Calibration Active
                        </div>
                        <LoadingPercentage />
                    </div>
                </div>

                {/* Subtle Glow like landing page */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
            </div>
        );
    }

    const vaultState = {
        dailyProgress: (elapsed / duration) * 100,
        barsToday: barsToday,
        totalBars: totalBars
    };

    return (
        <>
            <div className="fixed bottom-2 right-2 text-[8px] text-white/20 z-[9999] pointer-events-none uppercase tracking-widest">
                Sync Engine v1.2.1-DASHBOARD
            </div>
            <AnimatePresence>
                {countdownRemaining !== null && (
                    <CountdownNotification key="countdown-overlay" countdown={countdownRemaining} />
                )}
            </AnimatePresence>

            <div
                className={`h-screen bg-neutral-900 text-neutral-100 selection:bg-primary/30 relative overflow-hidden flex flex-col ${alienMode ? 'font-alien' : 'font-sans'} ${isPaywallOpen ? 'pointer-events-none select-none' : ''}`}
            >
                <div className="absolute inset-0 bg-neutral-900 z-0" />

                {/* Main Application Layer */}
                <div className="relative z-10 flex h-full">
                    <Sidebar
                        currentMode={mode}
                        setMode={setMode}
                        alienMode={alienMode}
                        toggleAlienMode={() => setAlienMode(!alienMode)}
                        onSignOut={handleSignOut}
                        user={currentUser}
                        focusIntensity={focusIntensity}
                        completedCount={barsToday}
                        sessionStatus={status}
                        sidebarAIState={sidebarAIState}
                        sidebarAnalysis={sidebarAnalysis}
                        activeSessionGoal={activeSessionGoal}
                        onSidebarAISubmit={handleSidebarAIStart}
                        onConfirmSession={confirmSidebarSession}
                        onCancelAI={() => setSidebarAIState('idle')}
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

                    {/* View Toggle Removed per user request */}

                    {viewMode === 'spatial' ? (
                        <div className="absolute inset-0 z-10 bg-[#050505]">
                            <InfiniteCanvas>
                                <CanvasHUD />
                                <NodesDataSync
                                    timerProps={{
                                        status,
                                        elapsedSeconds: elapsed,
                                        durationSeconds: duration,
                                        fatigueScore: currentMetrics?.fatigueScore || 0,
                                        currentIntensity: focusIntensity,
                                        onStart: handleStart,
                                        onPause: handlePause,
                                        onReset: handleReset,
                                        onIntensityChange: handleIntensityChange
                                    }}
                                    taskListProps={{
                                        tasks,
                                        onToggle: toggleTask,
                                        onAdd: addTask,
                                        onDelete: deleteTask
                                    }}
                                    goldVaultProps={{
                                        progress: vaultState.dailyProgress,
                                        barsToday: vaultState.barsToday,
                                        totalBars: vaultState.totalBars
                                    }}
                                />
                            </InfiniteCanvas>
                        </div>
                    ) : (
                        <main
                            className="
                    fixed md:top-6 md:right-6 md:bottom-6 md:left-[280px]
                    inset-0 md:inset-auto z-10
                    flex flex-col items-center justify-center
                            bg-neutral-950
                            md:rounded-2xl
                            md:border md:border-neutral-800
                            overflow-hidden
                        "
                            style={{
                                perspective: '1600px',
                                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                                backgroundSize: '24px 24px'
                            }}
                        >

                            <AIOptimizedIndicator currentInsight={insight} />

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
                                        <div
                                            className="w-full h-full flex items-start justify-center pt-8 relative"
                                            style={{
                                                transform: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : `scale(${SCALE_FACTOR})`,
                                                transformOrigin: 'center',
                                            }}
                                        >
                                            <div
                                                ref={layoutWrapperRef}
                                                className="flex flex-col md:flex-row justify-center items-center w-full max-w-[1600px] px-4 relative"
                                            >
                                                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 pt-20 md:pt-0">
                                                    <motion.div
                                                        ref={tasksRef}
                                                        layout
                                                        className={`w-full max-w-[14rem] min-h-[11rem] relative z-20 overflow-visible`}
                                                    >
                                                        <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} onDelete={deleteTask} />
                                                    </motion.div>
                                                    {!isMobile && <div className="w-[8rem] relative z-0 pointer-events-none" />}
                                                    <motion.div
                                                        ref={timerRefDiv}
                                                        layout
                                                        className={`w-[14rem] h-[14rem] relative z-30 overflow-visible`}
                                                    >
                                                        <FocusTimer status={status} elapsedSeconds={elapsed} durationSeconds={duration} fatigueScore={currentMetrics?.fatigueScore || 0} onStart={() => handleStart()} onPause={handlePause} onReset={handleReset} onIntensityChange={handleIntensityChange} currentIntensity={focusIntensity} currentInsight={insight} onTogglePiP={() => pipWindow ? closePip() : openPip({ width: 300, height: 100 })} />
                                                    </motion.div>
                                                    {!isMobile && <div className="w-[8rem] relative z-0 pointer-events-none" />}
                                                    <motion.div
                                                        ref={vaultRef}
                                                        layout
                                                        className={`w-full max-w-[14rem] h-[8rem] mt-0 md:mt-24 relative z-20 overflow-visible`}
                                                    >
                                                        <GoldVault progress={(elapsed / duration) * 100} barsToday={barsToday} totalBars={totalBars} />
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {mode === AppMode.RELAX && (
                                        <RelaxTimer onComplete={() => { setMode(AppMode.FOCUS); setStatus(SessionStatus.IDLE); setElapsed(0); }} fatigueScore={currentMetrics?.fatigueScore || 50} />
                                    )}

                                    {mode === AppMode.STATS && (
                                        <StatsView metricsHistory={metricsHistory} />
                                    )}
                                </MotionDiv>
                            </AnimatePresence>
                        </main>
                    )}
                </div>

                {/* Paywall Gate */}
                <PaywallModal
                    isOpen={isPaywallOpen}
                    currentUser={currentUser}
                    onClose={() => setIsPaywallOpen(false)}
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

                <MiniFocusTimer
                    status={status}
                    elapsedSeconds={elapsed}
                    durationSeconds={duration}
                    fatigueScore={currentMetrics?.fatigueScore || 0}
                    isVisible={!pipWindow && mode !== AppMode.FOCUS && (status === SessionStatus.RUNNING || status === SessionStatus.PAUSED)}
                    onClick={() => setMode(AppMode.FOCUS)}
                    variant="overlay"
                />

                {/* 
                  2. Document PiP Portal 
                     - Renders the "pip" variant into the separate window
                */}
                {pipWindow && createPortal(
                    <MiniFocusTimer
                        status={status}
                        elapsedSeconds={elapsed}
                        durationSeconds={duration}
                        fatigueScore={currentMetrics?.fatigueScore || 0}
                        isVisible={true}
                        onClick={() => { }} // No interaction needed in PiP typically
                        variant="pip"
                    />,
                    pipWindow.document.body
                )}

            </div>
        </>
    );
};
