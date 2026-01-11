import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ollamaService } from '../services/ollamaService';
import { supabase } from '../services/supabase';
import { databaseService } from '../services/databaseService';
import type { User } from '@supabase/supabase-js';
import { Header } from './Header';
import { PricingModal } from './PricingModal';
import { PricingSection } from './PricingSection';
import { authService } from '../services/authService';
import { useSubscription } from '../hooks/useSubscription';
import { Logo } from './Logo';

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
    const { isPremium } = useSubscription(); // Use existing hook
    // const isPremium = false;
    const chatInputRef = useRef<HTMLInputElement>(null);

    // Check for existing user & usage stats
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (user) {
                const profile = await databaseService.getProfile(user.id);
                if (profile) {
                    setFreeSessionsUsed((profile as any).free_sessions_used || 0);
                }
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
            const aiResult = await ollamaService.analyzeTask(task);
            setAnalysisResult({
                intensity: aiResult.suggestedIntensity,
                insight: aiResult.explanation,
                type: aiResult.taskType,
                focusMode: aiResult.focusMode,
                suggestedSessions: Math.ceil(aiResult.suggestedIntensity / 3.33),
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
        // We always "Enter" the app now, App.tsx will handle the Paywall Gate
        // if user is not premium or not logged in.
        onEnter({
            task,
            intensity: analysisResult.intensity,
            insight: analysisResult.insight,
            focusMode: analysisResult.focusMode,
            user: currentUser,
        });
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
        <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
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
            <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24">
                <AnimatePresence mode="wait">
                    {/* Hero Section - Centered Input */}
                    <AnimatePresence>
                        {stage === 'hero' && (
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
                                    className="text-center mb-16"
                                >
                                    <h1 className="flex flex-col items-center">
                                        {/* Headline - The "Authority" */}
                                        <span className="text-5xl md:text-[84px] font-instrument italic text-white tracking-tight leading-[0.9] max-w-4xl px-4">
                                            You're Already <br /> Burning Out
                                        </span>

                                        {/* Subheadline - The "Clinical Detail" */}
                                        <div className="mt-12 max-w-2xl mx-auto px-6">
                                            <p className="text-zinc-400 text-base md:text-[18px] leading-relaxed font-light tracking-wide text-balance">
                                                Blurred vision. Tension headaches. Mental fog. Your body is screaming warnings you've learned to ignore.
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
                                    <div className="relative bg-[#18181b] border border-zinc-800 rounded-2xl md:rounded-[36px] overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-zinc-700/50 group-hover:shadow-indigo-500/5">
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

                                    {/* Sub-input subtle text */}
                                    <p className="mt-4 text-center text-[11px] text-zinc-600 uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        Powered by biological AI calibration
                                    </p>
                                </motion.div>

                                {/* Suggestion Chips (Secondary Button Style) */}
                                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                                    {['Deep Work Session', 'Study for Exam', 'Debug Code'].map((suggestion, i) => (
                                        <motion.button
                                            key={suggestion}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 + (i * 0.1) }}
                                            onClick={() => setTask(suggestion)}
                                            className="px-5 py-2.5 rounded-full border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 text-xs md:text-sm text-zinc-500 hover:text-zinc-200 transition-all duration-300 backdrop-blur-sm"
                                        >
                                            {suggestion}
                                        </motion.button>
                                    ))}
                                </div>

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
                            />
                        )}
                    </AnimatePresence>
                </AnimatePresence>
            </div>

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
                onAuthRequired={() => {
                    setShowPricingModal(false);
                    setShowAuthModal(true);
                }}
            />
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

// Result View Component
interface ResultViewProps {
    task: string;
    result: any;
    onStartSession: () => void;
    showLock?: boolean;
}

const ResultView: React.FC<ResultViewProps> = ({ task, result, onStartSession, showLock }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl md:h-[80vh] flex flex-col md:flex-row gap-0 overflow-hidden md:rounded-sm border-0 md:border border-zinc-800 bg-[#09090b] shadow-2xl"
        >
            {/* Left Sidebar - Chat Style (30%) */}
            <div className="w-full md:w-[35%] flex flex-col border-b md:border-b-0 md:border-r border-zinc-900 relative bg-[#0d0d0e] max-h-[35vh] md:max-h-none">
                {/* Chat History Area */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6 md:space-y-8">
                    {/* User Message */}
                    <div className="flex flex-col items-end space-y-2">
                        <div className="bg-zinc-800/50 px-4 py-3 rounded-sm max-w-[90%] border border-zinc-700/50">
                            <p className="text-zinc-200 text-sm leading-relaxed font-sans">{task}</p>
                        </div>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold px-1 font-sans">You</span>
                    </div>

                    {/* AI Message */}
                    <div className="flex flex-col items-start space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-12 h-12 flex items-center justify-center text-indigo-500">
                                <Logo className="w-full h-full" />
                            </div>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold font-sans">Ytterbium</span>
                        </div>
                        <div className="space-y-4 max-w-[95%]">
                            <p className="text-zinc-400 text-sm leading-relaxed font-light font-sans">
                                I've analyzed your focus request. Based on the cognitive load required for <span className="text-zinc-200 font-medium">"{task}"</span>, I've calibrated a specialized environment.
                            </p>
                            <p className="text-zinc-400 text-sm leading-relaxed font-light font-sans">
                                <span className="text-zinc-200 font-medium">{result.focusMode}</span> mode is best suited for this. {result.insight.replace(/^"|"$/g, '')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-800 bg-[#0d0d0e]">
                    <div className="relative group">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-none px-4 py-3 flex items-center justify-between opacity-50 cursor-not-allowed">
                            <span className="text-zinc-500 text-sm font-sans font-light tracking-wide">Ask Ytterbium...</span>
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-zinc-800 text-zinc-600">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="p-1 rounded-lg bg-zinc-700 text-zinc-900">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Main Content (65%) - Stacked Card Design */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 py-12 md:py-24 relative bg-[#09090b]">


                {/* Stacked Card Effect */}
                <div className="relative w-full max-w-[300px] md:max-w-[340px] aspect-[4/5] flex flex-col items-center justify-center my-8 md:my-0">
                    {/* Backward Layers */}
                    <div className="absolute top-[-10px] w-[95%] aspect-[4/5] bg-zinc-900/40 border border-zinc-800/50 rounded-sm -z-10" />
                    <div className="absolute top-[-20px] w-[90%] aspect-[4/5] bg-zinc-900/20 border border-zinc-800/30 rounded-sm -z-20" />

                    {/* Main Card */}
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full h-full rounded-sm border border-zinc-800 bg-[#121214] overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Card Upper: Placeholder/Visual Area */}
                        <div className="flex-1 bg-[#0a0a0b] relative group overflow-hidden">
                            {/* Technical Grid Overlay */}
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(zinc-800 1px, transparent 1px), linear-gradient(90deg, zinc-800 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121214]/80" />
                            {/* Focus Mode Icon/Graphics Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    {showLock ? (
                                        <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-center px-8">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-1 font-bold font-sans">Recommended State</div>
                                    <div className="text-3xl font-black text-white tracking-tight font-sans">{result.focusMode}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-[#121214] space-y-6 text-center">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.2em] font-sans">Ytterbium Environment</h3>
                                <div className="flex items-center justify-center gap-2">
                                    {/* Badge 1: Intensity */}
                                    <div
                                        className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-[5px] border border-white/10 flex items-center shadow-[0_0_10px_rgba(161,161,170,0.1)]"
                                    >
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">
                                            {result.intensity}/10 Intensity
                                        </span>
                                    </div>

                                    {/* Badge 2: Sessions */}
                                    <div
                                        className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-[5px] border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                                    >
                                        <svg className="w-3 h-3 text-emerald-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                        </svg>
                                        <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.15em]">
                                            {result.suggestedSessions} Sessions
                                        </span>
                                    </div>
                                </div>
                                {/* Intensity Progress Bar */}
                                <div className="w-full h-[1px] bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${result.intensity * 10}%` }}
                                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                        className="h-full bg-indigo-500/40"
                                    />
                                </div>
                            </div>

                            {/* Action Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onStartSession}
                                className={`w-full py-4 rounded-md font-medium text-[13px] transition-all duration-200 flex items-center justify-center gap-2 ${showLock
                                    ? 'bg-zinc-900/50 text-zinc-600 cursor-not-allowed border border-zinc-800'
                                    : 'bg-[#1A1A1A] text-white hover:bg-[#252525] border border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-[0.99]'
                                    }`}
                            >
                                {showLock ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Limit Reached
                                    </span>
                                ) : "Initiate Environment"}
                            </motion.button>
                        </div>
                    </motion.div>
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
                        <div className="w-12 h-12 flex items-center justify-center text-indigo-500">
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
