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
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
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

                        {/* Social Auth */}
                        <div className="space-y-4 mb-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    setLoading(true);
                                    setError('');
                                    try {
                                        const { error: authError } = await authService.signInWithGoogle();
                                        if (authError) throw authError;
                                    } catch (err: any) {
                                        setError(err.message || 'Authentication failed');
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                                className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 transition-colors hover:bg-zinc-200 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12.545,11.071L12,11.071L12,12.929L15.636,12.929C15.111,15.111 13.555,16.555 12,16.555C9.485,16.555 7.445,14.515 7.445,12C7.445,9.485 9.485,7.445 12,7.445C13.2,7.445 14.155,7.889 14.777,8.555L16.222,7.111C15.155,6.111 13.666,5.555 12,5.555C8.445,5.555 5.555,8.445 5.555,12C5.555,15.555 8.445,18.445 12,18.445C16.889,18.445 20,15.111 20,12C20,11.111 19.889,10.222 19.666,9.445L12,9.445L12,11.071L12.545,11.071Z" />
                                </svg>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black">
                                    {loading ? 'Redirecting...' : 'Continue with Google'}
                                </span>
                            </motion.button>
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-3 rounded-xl border border-red-400/20 mb-4">
                                {error}
                            </p>
                        )}

                        <p className="text-[9px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
                            Sign in to enable AI fatigue detection<br />and save your focus history.
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
