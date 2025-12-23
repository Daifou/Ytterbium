import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import type { User } from '@supabase/supabase-js';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: User) => void;
    intensityMode: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, intensityMode }) => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signup');
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
                if (user) onSuccess(user);
            } else {
                const { user, error: authError } = await authService.signIn(email, password);
                if (authError) throw authError;
                if (user) onSuccess(user);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative overflow-hidden backdrop-blur-3xl bg-zinc-900/80 border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] max-w-md w-full"
                    >
                        {/* Inner Rim Light */}
                        <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" />

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black tracking-tighter text-white mb-3">
                                Secure your session.
                            </h2>
                            <p className="text-sm text-zinc-400 font-medium leading-relaxed px-4">
                                We have classified your work as <span className="text-indigo-400 font-bold">{intensityMode}</span>. Sign in to enable AI fatigue detection and save your focus history.
                            </p>
                        </div>

                        {/* Social Auth Placeholder */}
                        <div className="space-y-4 mb-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors hover:bg-zinc-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.545,11.071L12,11.071L12,12.929L15.636,12.929C15.111,15.111 13.555,16.555 12,16.555C9.485,16.555 7.445,14.515 7.445,12C7.445,9.485 9.485,7.445 12,7.445C13.2,7.445 14.155,7.889 14.777,8.555L16.222,7.111C15.155,6.111 13.666,5.555 12,5.555C8.445,5.555 5.555,8.445 5.555,12C5.555,15.555 8.445,18.445 12,18.445C16.889,18.445 20,15.111 20,12C20,11.111 19.889,10.222 19.666,9.445L12,9.445L12,11.071L12.545,11.071Z" />
                                </svg>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black">Continue with Google</span>
                            </motion.button>
                        </div>

                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-zinc-900/0 px-2 text-zinc-500 font-bold tracking-widest text-[8px]">Or via Email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {mode === 'signup' && (
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-zinc-600 text-sm"
                                />
                            )}
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-zinc-600 text-sm"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-zinc-600 text-sm"
                            />

                            {error && (
                                <p className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-3 rounded-xl border border-red-400/20">
                                    {error}
                                </p>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="relative w-full py-5 bg-indigo-600 rounded-2xl text-white font-bold shadow-lg shadow-indigo-500/20 overflow-hidden disabled:opacity-50"
                            >
                                <span className="relative z-10 text-[9px] uppercase tracking-[0.4em] pl-[0.4em]">
                                    {loading ? 'Processing...' : mode === 'signin' ? 'Resume Session' : 'Save Progress'}
                                </span>
                                {!loading && (
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    />
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors font-bold"
                            >
                                {mode === 'signin' ? "Need an account? Sign up" : 'Already have an account? Sign in'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
