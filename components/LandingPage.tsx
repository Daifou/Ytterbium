import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/aiService';
import { supabase } from '../services/supabase';
import { databaseService } from '../services/databaseService';
import type { User } from '@supabase/supabase-js';
import { Header } from './Header';
import { PricingModal } from './PricingModal';
import { PricingSection } from './PricingSection';
import { authService } from '../services/authService';
import { useSubscription } from '../hooks/useSubscription';
import { Logo } from './Logo';
import { StickyScroll } from './StickyScroll';
import { ResultView } from './ResultView';

interface LandingPageProps {
    onEnter: (data: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    const [stage, setStage] = useState<'hero' | 'analyzing' | 'result'>('hero');
    const [task, setTask] = useState('');
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [freeSessionsUsed, setFreeSessionsUsed] = useState(0);
    const { isPremium, loading: isSubscriptionLoading, checkSubscription, refreshSubscription } = useSubscription(); // Use existing hook
    // const isPremium = false;
    const chatInputRef = useRef<HTMLInputElement>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Lock body scroll when in 'analyzing' or 'result' stages
    useEffect(() => {
        if (stage === 'analyzing' || stage === 'result') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [stage]);

    // Check for existing user & usage stats
    // Check for existing user & Auto-Enter for Premium with Pending Session
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (user) {
                // CRITICAL: Wait for subscription to load before making decisions
                // This prevents mobile race conditions where isPremium is checked before data loads
                console.log("[LandingPage] User detected, waiting for subscription load...");

                // Use refreshSubscription for consistency
                const subData = await refreshSubscription();

                console.log("[LandingPage] Subscription check complete:", {
                    isPremium: subData?.is_premium,
                    status: subData?.status
                });

                if (subData) {
                    setFreeSessionsUsed((subData as any).free_sessions_used || 0);

                    // Auto-Restore Session if Premium + Pending Session
                    const pendingSession = localStorage.getItem('pending_session');
                    if (pendingSession && subData.is_premium) {
                        console.log("[LandingPage] ✅ Premium user with pending session - auto-entering dashboard...");
                        try {
                            const sessionData = JSON.parse(pendingSession);
                            onEnter({
                                ...sessionData,
                                user: user
                            });
                            return;
                        } catch (e) {
                            console.error("Failed to parse pending session", e);
                        }
                    }
                }

                // Clean up any stale auth flags
                localStorage.removeItem('auth_return_mode');
            }
        };
        checkUser();
    }, []);

    const scrollToInput = () => {
        chatInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => chatInputRef.current?.focus(), 600);
    };

    const handleGetStarted = () => {
        scrollToInput();
    };

    const handleLogin = async () => {
        console.log("[LandingPage] Initiating Google login...");
        const { error } = await authService.signInWithGoogle();
        if (error) console.error('[LandingPage] Login error:', error);
    };

    const handleTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task.trim()) return;

        setStage('analyzing');

        try {
            const aiResult = await aiService.analyzeTask(task);
            setAnalysisResult({
                intensity: aiResult.suggestedIntensity,
                insight: aiResult.explanation,
                type: aiResult.taskType,
                focusMode: aiResult.focusMode,
                suggestedSessions: aiResult.suggestedSessions,
            });
            setStage('result');
        } catch (error) {
            console.error('AI analysis failed:', error);
            setAnalysisResult({
                intensity: 6,
                insight: 'Balanced focus recommended for this task.',
                type: 'Standard Task',
                focusMode: 'Balanced Focus',
                suggestedSessions: 2,
            });
            setStage('result');
        }
    };

    const handleStartSession = async () => {
        // 1. ALWAYS save session data first so it survives redirects/reloads
        localStorage.setItem('pending_session', JSON.stringify({
            task,
            intensity: analysisResult.intensity,
            insight: analysisResult.insight,
            focusMode: analysisResult.focusMode,
            suggestedSessions: analysisResult.suggestedSessions,
        }));

        // 2. Show loading state while checking subscription
        setIsSyncing(true);

        // 3. If user is logged in, FORCE fresh subscription check to avoid stale data
        if (currentUser) {
            console.log("[LandingPage handleStartSession] Verifying subscription for logged-in user...");
            const freshSub = await refreshSubscription();

            console.log("[LandingPage handleStartSession] Fresh subscription result:", {
                isPremium: freshSub?.is_premium,
                status: freshSub?.status,
                userId: currentUser.id
            });

            // If user is premium, go straight to dashboard
            if (freshSub?.is_premium) {
                console.log("[LandingPage handleStartSession] ✅ VERIFIED PREMIUM - Entering dashboard");
                setIsSyncing(false);
                onEnter({
                    task,
                    intensity: analysisResult.intensity,
                    insight: analysisResult.insight,
                    focusMode: analysisResult.focusMode,
                    suggestedSessions: analysisResult.suggestedSessions,
                    user: currentUser,
                });
                return;
            }

            // If not premium, fall through to show paywall
            console.log("[LandingPage handleStartSession] ⚠️ User is logged in but NOT premium - showing paywall");
        } else {
            console.log("[LandingPage handleStartSession] No user logged in - showing paywall/auth");
        }

        // 4. Not logged in OR Not Premium -> Show Unified Pricing Modal
        setIsSyncing(false);
        setShowPricingModal(true);
    };

    const handleGoogleSignUp = async () => {
        try {
            console.log("[LandingPage] Engaging authService.signInWithGoogle...");

            const { error } = await authService.signInWithGoogle();

            if (error) {
                console.error('[LandingPage] OAuth Error:', error);
                alert(`Authentication stalled: ${error.message}\n\nPlease verify your Supabase keys in .env.local.`);
            }
        } catch (err: any) {
            console.error('[LandingPage] Critical Auth Failure:', err);
            alert(`Critical System Error: ${err.message || 'Unknown failure'}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white relative">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-[#09090b]" />

            {/* Header */}
            <Header
                onGetStartedClick={handleGetStarted}
                onLoginClick={handleLogin}
                isDashboard={stage !== 'hero'}
                currentUser={currentUser}
            />

            {/* Main Content */}
            <div className="relative z-20 min-h-screen flex items-center justify-center px-6 pt-20">
                <AnimatePresence mode="wait">
                    {/* Hero Section - Centered Input */}
                    <AnimatePresence>
                        {stage === 'hero' && !showPricingModal && (
                            <motion.div
                                initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="relative z-10 w-full max-w-3xl px-6"
                            >
                                {/* Visual Hierarchy: Headline -> Subheadline */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-center mb-10"
                                >
                                    <h1 className="flex flex-col items-center">
                                        {/* Headline - The "Authority" */}
                                        <span className="text-5xl md:text-[84px] font-instrument italic text-white tracking-tight leading-[0.9] max-w-4xl px-4">
                                            You're Already <br /> Burning Out
                                        </span>

                                        {/* Subheadline - The "Clinical Detail" */}
                                        <div className="mt-12 max-w-2xl mx-auto px-6">
                                            <p className="text-zinc-400 text-base md:text-[18px] leading-relaxed font-light tracking-wide text-balance">
                                                Blurred vision. Tension headaches. Mental fog.<br />
                                                Ytterbium stops you before permanent damage.
                                            </p>
                                        </div>
                                    </h1>
                                </motion.div>

                                {/* Input Container */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                                    className="relative group mt-4 max-w-2xl mx-auto"
                                >
                                    <div className="relative bg-[#18181b] border border-zinc-800 rounded-2xl md:rounded-[36px] overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-zinc-700/50">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleTaskSubmit(e);
                                            }}
                                            className="flex flex-col"
                                        >
                                            <textarea
                                                ref={chatInputRef}
                                                value={task}
                                                onChange={(e) => setTask(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleTaskSubmit(e);
                                                    }
                                                }}
                                                placeholder="Ask Ytterbium to analyze a task..."
                                                className="w-full bg-transparent text-white placeholder-zinc-500 text-sm md:text-base px-8 pt-6 pb-16 focus:outline-none resize-none min-h-[100px] leading-relaxed font-sans"
                                                style={{ caretColor: '#818cf8' }}
                                                autoFocus
                                            />

                                            {/* Input Footer / Actions */}
                                            <div className="absolute bottom-4 right-4 flex items-center justify-end">
                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={!task.trim()}
                                                    className={`p-2 rounded-full transition-all duration-300 ${task.trim()
                                                        ? 'bg-zinc-50 text-zinc-950 translate-x-0 opacity-100 shadow-[0_0_20px_rgba(250,250,250,0.2)] hover:scale-105'
                                                        : 'bg-zinc-900/50 text-zinc-600 translate-x-0 opacity-50 cursor-not-allowed border border-zinc-800'
                                                        }`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </motion.div>

                                {/* Suggestion Chips (Compact & Pro Style) */}
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                                    {['Deep Work Session', 'Study for Exam', 'Debug Code'].map((label, i) => (
                                        <motion.button
                                            key={label}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1 + (i * 0.1), duration: 0.4 }}
                                            onClick={() => setTask(label)}
                                            className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 backdrop-blur-md flex items-center gap-2 text-xs md:text-sm shadow-sm"
                                        >
                                            <span className="font-medium tracking-tight">{label}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Scroll Indicator */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5, duration: 1 }}
                                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600"
                                >
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Discover Ytterbium</span>
                                    <motion.div
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                        className="w-px h-12 bg-gradient-to-b from-zinc-800 to-transparent"
                                    />
                                </motion.div>

                            </motion.div>
                        )}

                        {stage === 'analyzing' && (
                            <AnalyzingState key="analyzing" />
                        )}

                        {stage === 'result' && analysisResult && (
                            <ResultView
                                key="result"
                                task={task}
                                result={analysisResult}
                                onStartSession={handleStartSession}
                                showLock={currentUser ? (!isPremium && freeSessionsUsed >= 3) : false}
                                isSyncing={isSubscriptionLoading || isSyncing}
                            />
                        )}
                    </AnimatePresence>
                </AnimatePresence>
            </div>

            {/* Sticky Scroll Section - Between AI Input and Pricing */}
            {stage === 'hero' && <StickyScroll />}

            {/* Pricing Section (Accessible via Scroll / Anchor) */}
            {stage === 'hero' && (
                <PricingSection
                    currentUser={currentUser}
                    onAuthRequired={() => setShowAuthModal(true)}
                />
            )}

            {/* Auth Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <AuthModal onClose={() => setShowAuthModal(false)} onSignUp={handleGoogleSignUp} />
                )}
            </AnimatePresence>

            {/* Pricing Modal */}
            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
                currentUser={currentUser}
                isAuthMode={!currentUser}
                onAuthRequired={handleGoogleSignUp}
            />
            {/* Footer - Only visible on Hero stage */}
            {stage === 'hero' && (
                <footer className="relative z-10 py-12 border-t border-white/5 text-center">
                    <p className="text-zinc-500 text-xs tracking-widest uppercase font-medium">
                        © 2026 Ytterbium.
                    </p>
                </footer>
            )}
        </div >


    );
};

// Analyzing State with Skeleton Loader
const AnalyzingState: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = [
        'Analyzing cognitive load...',
        'Calibrating task intensity...',
        'Optimizing session flow...',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl h-[80vh] flex flex-col md:flex-row gap-0 overflow-hidden rounded-sm border border-zinc-800 bg-[#09090b] shadow-2xl"
        >
            {/* Left Sidebar - Chat Style (30%) */}
            <div className="w-full md:w-[35%] flex flex-col border-r border-zinc-900 relative bg-[#0d0d0e]">
                {/* Chat History Area */}
                <div className="flex-1 p-6 space-y-8">
                    {/* User Message Skeleton */}
                    <div className="flex flex-col items-end space-y-2">
                        <div className="bg-zinc-800/30 px-4 py-3 rounded-sm w-3/4 border border-zinc-700/30">
                            <div className="h-4 bg-zinc-700/50 rounded-sm w-full animate-pulse" />
                        </div>
                    </div>

                    {/* AI Message Skeleton */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-12 h-12 flex items-center justify-center text-indigo-500">
                            <Logo className="w-full h-full" />
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Thinking...</span>
                    </div>
                    <div className="space-y-3 w-full">
                        <div className="h-4 bg-zinc-800/50 rounded-md w-[80%] animate-pulse" />
                        <div className="h-4 bg-zinc-800/50 rounded-md w-[60%] animate-pulse" />
                        <div className="pt-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-zinc-800 bg-[#0d0d0e]">
                    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-none px-4 py-3 opacity-30 select-none">
                        <span className="text-zinc-600 text-sm">Ask Ytterbium...</span>
                    </div>
                </div>
            </div>

            {/* Right Main Content (65%) - Stacked Card Skeleton */}
            <div className="flex-1 flex flex-col items-center justify-center p-12 pb-24 relative bg-[#09090b]">
                {/* Status Pill */}
                <div className="absolute top-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">{messages[messageIndex]}</span>
                </div>

                {/* Stacked Card Skeleton Effect */}
                <div className="relative w-full max-w-[340px] aspect-[4/5] flex flex-col items-center justify-center opacity-50">
                    <div className="absolute top-[-10px] w-[95%] aspect-[4/5] bg-zinc-900/40 border border-zinc-800/50 rounded-sm -z-10" />
                    <div className="w-full h-full rounded-sm border border-zinc-800 bg-[#121214] flex flex-col overflow-hidden">
                        <div className="flex-1 bg-[#0a0a0b] flex items-center justify-center relative overflow-hidden">
                            {/* Technical Grid Overlay */}
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(zinc-800 1px, transparent 1px), linear-gradient(90deg, zinc-800 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                            <div className="w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center animate-pulse z-10">
                                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="h-4 bg-zinc-800/50 rounded-sm w-3/4 animate-pulse" />
                            <div className="h-4 bg-zinc-800/50 rounded-sm w-1/2 animate-pulse" />
                            <div className="pt-4 h-12 bg-zinc-800/30 rounded-sm w-full animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};



// Auth Modal Component
interface AuthModalProps {
    onClose: () => void;
    onSignUp: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSignUp }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-[400px] w-full p-6 md:p-10 rounded-sm bg-[#09090b] border border-zinc-800 relative shadow-2xl"
            >
                {/* Close Button hit-box (44x44px) */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center text-zinc-500 hover:text-white transition-colors group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="space-y-8">
                    {/* Top Left Logo Identity */}
                    <div className="flex justify-start">
                        <div className="w-12 h-12 flex items-center justify-center">
                            <Logo className="w-full h-full" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl md:text-[28px] font-bold text-zinc-50 tracking-tight leading-none uppercase">Start Building.</h3>
                        <p className="text-xl md:text-[28px] font-bold text-zinc-800 leading-none uppercase">Create free account</p>
                    </div>

                    <div className="pt-4 space-y-4">
                        {/* Google Sign In Button - Hybrid Style */}
                        <button
                            type="button"
                            onClick={() => {
                                console.log("[AuthModal] Primary Action: Continue with Google");
                                onSignUp();
                            }}
                            className="w-full h-[52px] px-4 rounded-sm bg-zinc-50 text-zinc-950 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white transition-all relative z-50 group shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google

                            {/* Muted Indigo Badge Style */}
                            <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-sm shadow-sm backdrop-blur-sm pointer-events-none">
                                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Last used</span>
                            </div>
                        </button>
                    </div>

                    <div className="space-y-4 pt-4">
                        <p className="text-[10px] text-zinc-500 leading-relaxed font-medium uppercase tracking-widest">
                            By continuing, you agree to the <a href="#" className="text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-800">Terms of Service</a> and <a href="#" className="text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-800">Privacy Policy</a>.
                        </p>
                        <div className="pt-2 border-t border-zinc-900">
                            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em]">Standard security protocols active</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LandingPage;