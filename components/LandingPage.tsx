import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ollamaService } from '../services/ollamaService';
import { authService } from '../services/authService';
import type { User } from '@supabase/supabase-js';

// --- DESIGN TOKENS ---
const COLORS = {
    electricBlue: "#2A5EE8",
    deepMoss: "#2D3A30",
    white: "#ffffff",
    borderWidth: "6px"
};

// --- COMPONENT: ANIMATED CLOUDS ---
const Cloud = ({ delay = 0, duration = 40, top = '10%', scale = 1 }) => (
    <motion.div
        initial={{ x: '-40vw', opacity: 0 }}
        animate={{
            x: '110vw',
            opacity: [0, 0.5, 0.5, 0]
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "linear"
        }}
        className="absolute pointer-events-none"
        style={{ top, transform: `scale(${scale})`, zIndex: 5 }}
    >
        <div className="relative">
            <div className="w-96 h-24 bg-white/40 blur-[50px] rounded-full" />
            <div className="absolute -top-8 left-16 w-48 h-24 bg-white/30 blur-[40px] rounded-full" />
            <div className="absolute top-4 left-40 w-56 h-20 bg-white/20 blur-[35px] rounded-full" />
        </div>
    </motion.div>
);

// --- COMPONENT: THE PIXEL CLONE MEADOW ---
const EnvironmentalBackground = React.memo(() => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#E8EDF5]">
        {/* 1. Sky Gradient */}
        <div
            className="absolute inset-0 h-full w-full z-0"
            style={{
                background: `linear-gradient(to bottom, #2A5EE8 0%, #5C85EE 30%, #A5BFF0 60%, #E8EDF5 100%)`
            }}
        />

        {/* 2. Cloud Layer */}
        <Cloud top="10%" delay={0} duration={80} scale={1.2} />
        <Cloud top="25%" delay={25} duration={60} scale={0.9} />
        <Cloud top="5%" delay={45} duration={100} scale={1.5} />

        {/* 3. Soft Volumetric Haze */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[150px] bg-white/20 blur-[100px] rounded-full z-[6]" />

        {/* 4. The Meadow */}
        <div
            className="absolute bottom-0 w-full h-[35vh] z-10"
            style={{
                backgroundColor: COLORS.deepMoss,
                backgroundImage: `
                    linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%),
                    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)
                `,
                clipPath: 'polygon(0% 15%, 5% 10%, 12% 18%, 18% 8%, 25% 15%, 32% 10%, 40% 18%, 48% 12%, 55% 16%, 62% 8%, 70% 15%, 78% 11%, 85% 19%, 92% 10%, 100% 16%, 100% 100%, 0% 100%)'
            }}
        />

        {/* Shadow Depth for Grass */}
        <div
            className="absolute bottom-0 w-full h-[25vh] opacity-20 z-[11]"
            style={{
                background: `linear-gradient(to top, #000, transparent)`,
                maskImage: 'repeating-linear-gradient(90deg, black 0px, black 1px, transparent 1px, transparent 4px)',
            }}
        />

        {/* 5. Floating Particles */}
        {[...Array(18)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
                animate={{
                    y: "-10vh",
                    opacity: [0, 0.4, 0],
                    x: `${(Math.random() * 100) + (Math.sin(i) * 8)}vw`
                }}
                transition={{
                    duration: 20 + Math.random() * 20,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 15
                }}
                className="absolute w-[2px] h-[2px] bg-white/40 z-20"
            />
        ))}

        {/* 6. MASTER PIXEL GRAIN */}
        <div className="absolute inset-0 opacity-[0.4] mix-blend-overlay z-[100]">
            <svg className="w-full h-full">
                <filter id="ultraPixelGrain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="1.5" intercept="-0.2" />
                        <feFuncG type="linear" slope="1.5" intercept="-0.2" />
                        <feFuncB type="linear" slope="1.5" intercept="-0.2" />
                    </feComponentTransfer>
                </filter>
                <rect width="100%" height="100%" filter="url(#ultraPixelGrain)" />
            </svg>
        </div>
    </div>
));

// --- AUTH FORM COMPONENT ---
const AuthForm = ({ onAuthSuccess }: { onAuthSuccess: (user: User) => void }) => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'signup') {
                const { user, error: authError } = await authService.signUp(email, password, fullName);
                if (authError) throw authError;
                if (user) onAuthSuccess(user);
            } else {
                const { user, error: authError } = await authService.signIn(email, password);
                if (authError) throw authError;
                if (user) onAuthSuccess(user);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden backdrop-blur-[50px] bg-white/70 border border-white/50 rounded-[40px] p-10 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] max-w-md w-full"
        >
            {/* Inner Rim Light Detail */}
            <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]" />

            <div className="mb-8 text-center">
                <span className="text-[10px] font-black tracking-[0.4em] text-blue-600/40 uppercase">
                    {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </span>
                <h2 className="text-4xl font-black tracking-tighter text-blue-600 mt-2" style={{ fontFamily: "'EB Garamond', serif" }}>
                    Ytterbium
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                    <div>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl outline-none focus:border-blue-400 transition-colors text-gray-800 placeholder:text-gray-400"
                        />
                    </div>
                )}

                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl outline-none focus:border-blue-400 transition-colors text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl outline-none focus:border-blue-400 transition-colors text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm text-center bg-red-50/50 py-2 rounded-lg"
                    >
                        {error}
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-4 bg-blue-600 rounded-2xl text-white font-bold shadow-lg shadow-blue-500/30 overflow-hidden disabled:opacity-50"
                >
                    <span className="relative z-10 text-[9px] uppercase tracking-[0.5em] pl-[0.5em]">
                        {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
                    </span>
                    {!loading && (
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                    )}
                </motion.button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-sm text-blue-600/70 hover:text-blue-600 transition-colors"
                >
                    {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
            </div>

            {/* Outer Soft Glow */}
            <div className="absolute -inset-10 bg-blue-400/10 blur-[100px] -z-10 rounded-full" />
        </motion.div>
    );
};

const PLACEHOLDERS = [
    "What needs focus?",
    "Define your primary objective.",
    "What task are you working on?",
    "What shall we accomplish?",
    "Enter your focus target."
];

const TopLeftInputBar = ({ status, onSubmit }: { status: 'IDLE' | 'THINKING', onSubmit: (task: string) => void }) => {
    const [localTask, setLocalTask] = useState('');
    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localTask.trim()) onSubmit(localTask);
    };

    // --- TYPEWRITER LOGIC ---
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const fullText = PLACEHOLDERS[placeholderIndex];

        if (isTyping) {
            if (currentPlaceholder.length < fullText.length) {
                timer = setTimeout(() => {
                    setCurrentPlaceholder(fullText.slice(0, currentPlaceholder.length + 1));
                }, 70); // Typing speed
            } else {
                timer = setTimeout(() => setIsTyping(false), 3000); // Wait at end
            }
        } else {
            if (currentPlaceholder.length > 0) {
                timer = setTimeout(() => {
                    setCurrentPlaceholder(currentPlaceholder.slice(0, -1));
                }, 30); // Deleting speed
            } else {
                setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
                setIsTyping(true);
            }
        }

        return () => clearTimeout(timer);
    }, [currentPlaceholder, isTyping, placeholderIndex]);

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed top-12 left-12 z-[150] w-full max-w-xl px-4"
        >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-40">Project // Focus</span>
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-6 relative">
                    <input
                        type="text"
                        value={localTask}
                        onChange={(e) => setLocalTask(e.target.value)}
                        disabled={status === 'THINKING'}
                        placeholder={currentPlaceholder}
                        className="w-full bg-transparent text-3xl font-bold tracking-tighter outline-none border-none placeholder:text-gray-300 text-black leading-none"
                        autoComplete="off"
                        autoFocus
                    />

                    {status === 'THINKING' && (
                        <motion.div
                            className="absolute bottom-0 left-0 h-1"
                            style={{ backgroundColor: COLORS.electricBlue }}
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </form>
            </div>
        </motion.div>
    );
};

const LandingPage: React.FC<{ onEnter: (data: any) => void }> = ({ onEnter }) => {
    const [authState, setAuthState] = useState<'checking' | 'unauthenticated' | 'authenticated'>('checking');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [finalTask, setFinalTask] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'THINKING' | 'READY'>('IDLE');
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [showAuth, setShowAuth] = useState(false);



    // Check for existing session on mount
    useEffect(() => {
        const checkAuth = async () => {
            const user = await authService.getUser();
            if (user) {
                setCurrentUser(user);
                setAuthState('authenticated');
            } else {
                setAuthState('unauthenticated');
            }
        };

        checkAuth();

        // Listen for auth changes
        const subscription = authService.onAuthStateChange((user) => {
            setCurrentUser(user);
            setAuthState(user ? 'authenticated' : 'unauthenticated');
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleAuthSuccess = (user: User) => {
        setCurrentUser(user);
        setAuthState('authenticated');
    };

    const handleInitialSubmit = async (task: string) => {
        setFinalTask(task);
        setStatus('THINKING');

        try {
            // Call AI service to analyze and classify the task
            const aiResult = await ollamaService.analyzeTask(task);

            setAnalysisResult({
                intensity: aiResult.suggestedIntensity,
                insight: aiResult.explanation,
                type: aiResult.taskType,
                focusMode: aiResult.focusMode
            });
            setStatus('READY');
        } catch (error) {
            console.error('AI Classification Error:', error);
            // Fallback to balanced focus if AI fails
            setAnalysisResult({
                intensity: 6,
                insight: "AI analysis unavailable. Using balanced focus mode.",
                type: "Standard Task",
                focusMode: "Balanced Focus"
            });
            setStatus('READY');
        }
    };

    return (
        <div className="min-h-screen relative font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
            <div
                className="fixed inset-0 z-[200] pointer-events-none border-white"
                style={{ borderStyle: 'solid', borderWidth: COLORS.borderWidth }}
            />

            <EnvironmentalBackground />

            <AnimatePresence>
                {status !== 'IDLE' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[15] backdrop-blur-3xl bg-white/5"
                        transition={{ duration: 0.8 }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {status !== 'READY' && (
                    <TopLeftInputBar status={status as 'IDLE' | 'THINKING'} onSubmit={handleInitialSubmit} />
                )}
            </AnimatePresence>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="relative z-20 min-h-screen flex items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {/* Loading State */}
                    {authState === 'checking' && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-white text-xl"
                        >
                            Loading...
                        </motion.div>
                    )}

                    {/* Auth form removed for Ghost Session flow - Focus Input is now the primary entry point */}

                    {/* Analysis Result (Now works for both auth and ghost) */}
                    {status === 'READY' && analysisResult && (
                        <motion.div
                            key="ready"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative"
                        >
                            {/* Precision Glass Card - "Contextual Tasks" Inspired Layout */}
                            <div
                                className="relative overflow-hidden backdrop-blur-[40px] border border-white/40 rounded-[24px] w-full max-w-[380px] text-left shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]"
                                style={{
                                    background: `rgba(255, 255, 255, 0.7)`,
                                }}
                            >
                                {/* 1. Header Bar */}
                                <div className="px-6 py-4 border-b border-black/[0.05] bg-black/[0.02] flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                                        <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">System State</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-black/10" />
                                        <div className="w-1 h-1 rounded-full bg-black/10" />
                                    </div>
                                </div>

                                {/* 2. Body Content */}
                                <div className="p-8 space-y-8">
                                    {/* Title & Description */}
                                    <div className="space-y-3">
                                        <motion.h2
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-2xl font-black tracking-tight text-slate-800 leading-none"
                                        >
                                            Focus: {analysisResult.focusMode.split(' ')[0]}
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-[14px] text-slate-500 font-medium leading-relaxed max-w-[90%]"
                                        >
                                            {analysisResult.focusMode === "Balanced Focus"
                                                ? "Designed for sustained clarity, not strain."
                                                : analysisResult.insight.replace(/^"|"$/g, '')}
                                        </motion.p>
                                    </div>

                                    {/* Focus Intensity Bar */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-3"
                                    >
                                        <div className="relative h-2 w-full bg-black/[0.05] rounded-full overflow-hidden">
                                            <div
                                                className="absolute inset-0 opacity-80"
                                                style={{
                                                    background: 'linear-gradient(to right, #ff9b9b 0%, #ffdf91 40%, #a8e6cf 70%, #81c784 100%)'
                                                }}
                                            />
                                            <motion.div
                                                initial={{ left: '0%' }}
                                                animate={{ left: `${((analysisResult.intensity - 1) / 9) * 100}%` }}
                                                transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                                                className="absolute top-0 bottom-0 w-[2px] bg-black/80 z-10"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Calibration: {analysisResult.intensity}/10</span>
                                            <div className="flex gap-4">
                                                <span className="text-[9px] font-bold text-slate-300 uppercase">Calm</span>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase">Peak</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Shopify Button */}
                                    <div className="pt-2">
                                        <motion.button
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onEnter({ ...analysisResult, task: finalTask, user: currentUser })}
                                            className="relative w-full h-[48px] bg-gradient-to-b from-[#2d2d2d] via-[#1a1a1a] to-[#000000] border border-black/50 rounded-[12px] text-white font-bold shadow-lg overflow-hidden group"
                                        >
                                            <span className="relative z-10 text-[13px] tracking-tight">Begin Session</span>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Outer Deep Glow */}
                            <div className="absolute -inset-20 bg-blue-500/5 blur-[120px] -z-10 rounded-full" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 5. Footer Branding (RESTORED) */}
            <motion.div
                className="fixed bottom-12 right-12 text-right z-[150] pointer-events-none text-white"
                animate={{
                    filter: authState !== 'unauthenticated' && status !== 'IDLE' ? 'blur(10px)' : 'blur(0px)',
                    opacity: authState !== 'unauthenticated' && status !== 'IDLE' ? 0.4 : 1
                }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex flex-col items-end">
                    <h2
                        className="text-[34px] tracking-tighter uppercase leading-[0.85] flex flex-col items-end"
                        style={{ fontFamily: "'EB Garamond', serif" }}
                    >
                        <span className="opacity-90">WHERE BIOLOGY</span>
                        <span className="opacity-90">MEETS</span>
                        <div className="flex items-end gap-3 translate-y-[-1px]">
                            <div className="text-[8px] font-sans font-bold tracking-[0.2em] leading-tight opacity-50 mb-1">
                                ©2025<br />YTTERBIUM
                            </div>
                            <span className="text-[34px] text-white">DEEP FOCUS.</span>
                        </div>
                    </h2>
                </div>
            </motion.div>
        </div>
    );
};

export default LandingPage;
