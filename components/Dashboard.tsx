// components/Dashboard.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { FocusTimer } from './FocusTimer';
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
// import { useNavigate } from 'react-router-dom'; // We might need this later

const DEFAULT_DURATION = 25 * 60; // 25 min default
const SCALE_FACTOR = 1.05;
const GHOST_SESSION_KEY = 'ytterbium_ghost_session_id';

const MotionDiv = motion.div as any;

const INTENSITY_THRESHOLDS: Record<number, number> = {
    10: 65, 9: 70, 8: 75, 7: 80, 6: 85, 5: 90, 4: 95, 3: 100, 2: 100, 1: 100,
};

const INTENSITY_TIME_CAPS: Record<number, number> = {
    1: 70, 2: 80, 3: 90, 4: 50, 5: 55, 6: 60, 7: 65, 8: 30, 9: 35, 10: 5 / 60,
};

export const Dashboard: React.FC = () => {
    // const navigate = useNavigate(); // For redirecting out if needed
    const [mode, setMode] = useState<AppMode>(AppMode.FOCUS);
    const [status, setStatus] = useState<SessionStatus>(SessionStatus.IDLE);
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [elapsed, setElapsed] = useState(0);

    const [focusIntensity, setFocusIntensity] = useState(5);
    const isFocusMode = mode === AppMode.FOCUS;

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { isPremium } = useSubscription();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [alienMode, setAlienMode] = useState(false);

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
    const [path1, setPath1] = useState<string>('');
    const [path2, setPath2] = useState<string>('');
    const [barsToday, setBarsToday] = useState(0);
    const [totalBars, setTotalBars] = useState(0);

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
                        setStatus(activeSession.status as SessionStatus);
                        setElapsed(activeSession.elapsed_seconds);
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


    // Effects (Timer, Fatigue, Intervention, Layout)
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (status === SessionStatus.RUNNING) {
            interval = setInterval(() => setElapsed(e => e + 1), 1000);
        }
        return () => { if (interval) clearInterval(interval); };
    }, [status]);

    useEffect(() => {
        const handleMetricsUpdate = (metrics: FatigueMetrics) => setCurrentMetrics(metrics);
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

    // Layout paths (copy of updatePaths)
    const getPathCoords = useCallback((path: string, type: 'start' | 'end') => {
        // simplified for brevity
        return { x: 0, y: 0 };
    }, []);

    const updatePaths = useCallback(() => {
        if (!layoutWrapperRef.current || !tasksRef.current || !timerRefDiv.current || !vaultRef.current) return;
        const wrapperRect = layoutWrapperRef.current.getBoundingClientRect();
        const tasksRect = tasksRef.current.getBoundingClientRect();
        const timerRect = timerRefDiv.current.getBoundingClientRect();
        const vaultRect = vaultRef.current.getBoundingClientRect();
        const currentScale = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : SCALE_FACTOR;

        const relativeX = (rect: DOMRect) => (rect.left - wrapperRect.left) / currentScale;
        const relativeY = (rect: DOMRect) => (rect.top - wrapperRect.top) / currentScale;
        const getWidth = (rect: DOMRect) => rect.width / currentScale;
        const getHeight = (rect: DOMRect) => rect.height / currentScale;

        const startX1 = relativeX(tasksRect) + getWidth(tasksRect) - 4;
        const startY1 = relativeY(tasksRect) + getHeight(tasksRect) / 2;
        const endX1 = relativeX(timerRect) + 4;
        const endY1 = relativeY(timerRect) + getHeight(timerRect) / 2;
        const controlOffset1 = 60;
        setPath1(`M ${startX1} ${startY1} C ${startX1 + controlOffset1} ${startY1} ${endX1 - controlOffset1} ${endY1} ${endX1} ${endY1}`);

        const startX2 = relativeX(timerRect) + getWidth(timerRect) - 4;
        const startY2 = relativeY(timerRect) + getHeight(timerRect) / 2;
        const endX2 = relativeX(vaultRect) + 4;
        const endY2 = relativeY(vaultRect) + getHeight(vaultRect) / 2;
        const controlOffset2 = 60;
        setPath2(`M ${startX2} ${startY2} C ${startX2 + controlOffset2} ${startY2} ${endX2 - controlOffset2} ${endY2} ${endX2} ${endY2}`);
    }, []);

    useEffect(() => {
        if (!layoutWrapperRef.current) return;
        let animationFrameId: number;
        let startTime = Date.now();
        const tick = () => {
            updatePaths();
            if (Date.now() - startTime < 1500) animationFrameId = requestAnimationFrame(tick);
        };
        tick();
        const handleResize = () => updatePaths();
        window.addEventListener('resize', handleResize);
        const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updatePaths));
        if (layoutWrapperRef.current) resizeObserver.observe(layoutWrapperRef.current);
        if (tasksRef.current) resizeObserver.observe(tasksRef.current);
        if (timerRefDiv.current) resizeObserver.observe(timerRefDiv.current);
        if (vaultRef.current) resizeObserver.observe(vaultRef.current);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [updatePaths, mode, tasks, isFocusMode]);

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

    if (isAuthLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] animate-pulse">Synchronizing environment...</p>
            </div>
        );
    }

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
                                    {/* SVG Code reused */}
                                    <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-40 hidden md:block">
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
                                            <marker id="arrow-head" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#c7d2fe" /></marker>
                                        </defs>
                                        {path1 && (<g filter="url(#subtle-glow)"><path d={path1} fill="none" stroke="url(#connection-gradient)" strokeWidth="1.5" strokeDasharray="8 8" className="transition-all duration-500"><animate attributeName="stroke-dashoffset" from="0" to="8" dur="3s" repeatCount="indefinite" calcMode="linear" /></path></g>)}
                                        {path2 && (<g filter="url(#subtle-glow)"><path d={path2} fill="none" stroke="url(#connection-gradient)" strokeWidth="1.5" strokeDasharray="8 8" className="transition-all duration-500"><animate attributeName="stroke-dashoffset" from="0" to="8" dur="3s" repeatCount="indefinite" calcMode="linear" begin="1s" /></path></g>)}
                                    </svg>

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 pt-20 md:pt-0">
                                        <div ref={tasksRef} className={`w-full max-w-[16rem] min-h-[13rem] relative z-20 ${isFocusMode ? 'opacity-100' : 'opacity-0'}`}>
                                            {isFocusMode ? <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} onDelete={deleteTask} /> : <div className="h-full w-full" />}
                                        </div>
                                        {!isMobile && <div className="w-[16rem] relative z-0 pointer-events-none" />}
                                        <div ref={timerRefDiv} className={`w-full max-w-[20rem] h-[15rem] relative z-30 ${isFocusMode ? 'opacity-100' : 'opacity-0'}`}>
                                            {isFocusMode ? <FocusTimer status={status} elapsedSeconds={elapsed} durationSeconds={duration} fatigueScore={currentMetrics?.fatigueScore || 0} onStart={() => handleStart()} onPause={handlePause} onReset={handleReset} onIntensityChange={handleIntensityChange} currentIntensity={focusIntensity} currentInsight={insight} /> : <div className="h-full w-full" />}
                                        </div>
                                        {!isMobile && <div className="w-[16rem] relative z-0 pointer-events-none" />}
                                        <div ref={vaultRef} className={`w-full max-w-[16rem] h-[9.25rem] mt-0 md:mt-24 relative z-20 ${isFocusMode ? 'opacity-100' : 'opacity-0'}`}>
                                            {isFocusMode ? <GoldVault progress={(elapsed / duration) * 100} barsToday={barsToday} totalBars={totalBars} /> : <div className="h-full w-full" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {mode === AppMode.RELAX && (
                                    <MotionDiv key="relax" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <RelaxTimer onComplete={() => { setMode(AppMode.FOCUS); setStatus(SessionStatus.IDLE); setElapsed(0); }} fatigueScore={currentMetrics?.fatigueScore || 50} />
                                    </MotionDiv>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {mode === AppMode.STATS && (
                                    <MotionDiv key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <StatsView metricsHistory={metricsHistory} />
                                    </MotionDiv>
                                )}
                            </AnimatePresence>

                        </MotionDiv>
                    </AnimatePresence>
                </main>
            </div>

            {/* Paywall Gate */}
            <PaywallModal
                isOpen={isPaywallOpen}
                currentUser={currentUser}
                onAuth={async (isAnnual) => {
                    localStorage.setItem('pending_plan', isAnnual ? 'annual' : 'monthly');
                    await authService.signInWithGoogle();
                }}
            // Passed to PricingCard via internal ref prop drilling if needed, but PaywallModal renders PricingCard
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
