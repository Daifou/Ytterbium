// LandingPage.tsx - FINAL, REFINED VERSION: Atmospheric Glow, Premium Navbar, Module Depth

import React from 'react';
import { motion } from 'framer-motion';
import { Pickaxe, BrainCircuit, HeartPulse, Timer, Zap, ArrowRight, Database, Layers } from 'lucide-react';

const LandingPage = ({ onEnter }) => {
    // Glacial Style for Components - Consistent theme
    const glacialPanelStyle = "bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-xl shadow-2xl transition-all hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)]";

    // Primary Button: Subtle, Translucent (as requested previously)
    const primaryButton = "flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white text-sm rounded-lg font-semibold border border-indigo-500/50 hover:bg-white/20 transition-colors shadow-lg shadow-indigo-500/10";

    // Secondary Button 
    const secondaryButton = "flex items-center gap-2 px-5 py-2.5 border border-gray-700 text-gray-400 text-sm rounded-lg font-semibold hover:border-indigo-500 hover:text-white transition-colors";

    // --- Background Mimicry (Enhanced Glow - Request 1) ---
    const BackgroundMimic = () => (
        <>
            {/* Main Indigo Glow (Amplified) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[900px] h-[900px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
            {/* Subtle Cyan/Teal secondary Glow for atmosphere */}
            <div className="absolute bottom-0 right-0 translate-x-[20%] translate-y-[20%] w-[500px] h-[500px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none z-0" />
        </>
    );

    return (
        // ROOT: Using grid place-items-center for centering
        <div className="min-h-screen bg-black text-gray-200 font-sans relative overflow-hidden grid place-items-center">

            <BackgroundMimic />

            {/* NAVBAR (Fixed to top) - Enhanced Glass Blur (Request 2) */}
            <header className="fixed top-6 w-full z-50 flex justify-center">
                <div
                    className="w-full max-w-4xl mx-auto px-6 py-3 flex justify-between items-center 
                               bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl" // shadow-2xl for floating depth
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-base font-semibold text-gray-100 tracking-wide">Ytterbium System</span>
                    </div>

                    <nav className="flex items-center space-x-8">
                        <div className="flex items-center space-x-6 text-[11px] text-gray-500 uppercase tracking-widest">
                            <a href="#" className="hover:text-white transition-colors">Modules</a>
                            <a href="#" className="hover:text-white transition-colors">Protocol</a>
                        </div>

                        <motion.button
                            onClick={onEnter}
                            className="text-indigo-400 border border-indigo-500/50 rounded-full px-3 py-1 font-medium hover:bg-indigo-500/10 transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Launch Terminal
                        </motion.button>
                    </nav>
                </div>
            </header>

            {/* MAIN SYSTEM ACCESS CARD - Perfect Centering + Robust Margin Offset */}
            <main className="p-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className={`w-full max-w-xl ${glacialPanelStyle} overflow-hidden mt-24`}
                >
                    {/* Panel Header */}
                    <div className="px-5 py-2 border-b border-white/10 flex items-center gap-3 bg-zinc-900/50">
                        <Database className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest">System Access Terminal</h3>
                    </div>

                    {/* Panel Content */}
                    <div className="divide-y divide-white/5">

                        {/* 1. HERO/ACCESS BLOCK */}
                        <div className="p-8 text-center">
                            <h1 className="text-3xl font-extrabold leading-snug tracking-tight">
                                <span className="text-gray-100">AI Deep-Work </span>
                                <span className="text-indigo-400">Interface</span>
                            </h1>
                            <p className="mt-3 text-gray-400 text-sm max-w-sm mx-auto">
                                The intelligence layer for burnout detection, dynamic session timing, and contextual task automation.
                            </p>

                            <div className="mt-6 flex justify-center gap-4">
                                <motion.button
                                    onClick={onEnter}
                                    className={primaryButton}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Initiate Session <ArrowRight className="w-4 h-4" />
                                </motion.button>
                                <button className={secondaryButton}>
                                    <Layers className="w-4 h-4" />
                                    Protocol Docs
                                </button>
                            </div>
                        </div>

                        {/* 2. MODULES/FEATURES BLOCK */}
                        <div id="modules" className="p-5">
                            <h2 className="text-xs font-semibold mb-4 text-gray-500 uppercase tracking-widest text-center">Core Modules</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {/* Feature 1: Depth Added (Request 3) */}
                                <div className="flex flex-col gap-1 p-3 
                                            border border-white/10 rounded-lg 
                                            bg-white/5 shadow-inner shadow-black/50
                                            transition-all duration-300
                                            hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] hover:bg-white/10"
                                >
                                    <BrainCircuit className="w-4 h-4 text-indigo-400 mb-1" />
                                    <h3 className="text-xs font-semibold text-white uppercase leading-none">Neural Load</h3>
                                    <p className="text-gray-500 text-xs">Predictive fatigue.</p>
                                </div>
                                {/* Feature 2: Depth Added (Request 3) */}
                                <div className="flex flex-col gap-1 p-3 
                                            border border-white/10 rounded-lg 
                                            bg-white/5 shadow-inner shadow-black/50
                                            transition-all duration-300
                                            hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] hover:bg-white/10"
                                >
                                    <Timer className="w-4 h-4 text-indigo-400 mb-1" />
                                    <h3 className="text-xs font-semibold text-white uppercase leading-none">Time Dilation</h3>
                                    <p className="text-gray-500 text-xs">AI-optimized session.</p>
                                </div>
                                {/* Feature 3: Depth Added (Request 3) */}
                                <div className="flex flex-col gap-1 p-3 
                                            border border-white/10 rounded-lg 
                                            bg-white/5 shadow-inner shadow-black/50
                                            transition-all duration-300
                                            hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)] hover:bg-white/10"
                                >
                                    <HeartPulse className="w-4 h-4 text-indigo-400 mb-1" />
                                    <h3 className="text-xs font-semibold text-white uppercase leading-none">Adaptive Breaks</h3>
                                    <p className="text-gray-500 text-xs">Maximized recovery.</p>
                                </div>
                            </div>
                        </div>

                        {/* 3. FOOTER/STATUS BLOCK */}
                        <div className="p-3 flex justify-between items-center text-gray-600 text-[10px]">
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-green-500" />
                                <span>Status: Operational</span>
                            </div>
                            <span>Ytterbium System v1.0 | Access Terminal</span>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default LandingPage;