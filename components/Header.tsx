import React from 'react';
import { motion } from 'framer-motion';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
    onGetStartedClick: () => void;
    onLoginClick: () => void;
    isDashboard?: boolean;
    currentUser?: User | null;
}

import { Logo } from './Logo';

export const Header: React.FC<HeaderProps> = ({ onGetStartedClick, onLoginClick, isDashboard = false, currentUser }) => {
    // Get initials from current user or fallback
    const initials = currentUser?.email
        ? currentUser.email.substring(0, 2).toUpperCase()
        : 'G'; // G for Guest or similar default if generic profile is needed

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-[200] border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md"
        >
            <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4 md:px-0">
                {/* Logo Section */}
                <div className="md:px-8 md:border-r border-zinc-800 h-full flex items-center">
                    <div className="flex items-center gap-2">
                        <Logo className="w-6 h-6 text-zinc-50" />
                        <span className="text-zinc-50 font-semibold text-base tracking-tight">Ytterbium</span>
                    </div>
                </div>

                {/* Navigation / Breadcrumb Section */}
                <div className="hidden md:flex flex-1 px-10 items-center gap-2 h-full border-r border-zinc-800">
                    {isDashboard ? (
                        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.03em] font-normal">
                            <span className="text-zinc-500">Workspace</span>
                            <span className="text-zinc-700">/</span>
                            <span className="text-zinc-200">Focus Session</span>
                        </div>
                    ) : (
                        <a
                            href="#pricing"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('pricing')?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }}
                            className="text-zinc-200 hover:text-white transition-colors duration-200 text-[11px] uppercase tracking-[0.03em] font-normal"
                        >
                            Pricing
                        </a>
                    )}
                </div>

                {/* Right Section: Auth / Profile */}
                <div className="flex items-center h-full">
                    {isDashboard ? (
                        <div className="px-0 md:px-8 flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-zinc-700 transition-colors cursor-pointer group">
                                    <span className="text-[10px] font-bold group-hover:text-zinc-200 transition-colors">{initials}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:flex px-10 border-r border-zinc-800 h-full items-center">
                                <button
                                    onClick={onLoginClick}
                                    className="text-zinc-200 hover:text-white transition-colors duration-200 text-[11px] uppercase tracking-[0.03em] font-normal"
                                >
                                    Log in
                                </button>
                            </div>

                            <div className="pl-4 md:px-10 h-full flex items-center">
                                <motion.button
                                    onClick={onGetStartedClick}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-zinc-50 text-zinc-950 px-4 md:px-6 py-2 rounded-sm font-black text-[10px] uppercase tracking-[0.15em] hover:bg-white transition-all duration-200"
                                >
                                    Get Started
                                </motion.button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    );
};
