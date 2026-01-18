import React from 'react';
import { motion } from 'framer-motion';
import { Database, Coins, Pickaxe, Layers } from 'lucide-react';

interface GoldVaultProps {
    progress: number; // 0-100 representing current bar mining progress
    barsToday: number;
    totalBars: number;
}

export const GoldVault: React.FC<GoldVaultProps> = ({ progress = 0, barsToday = 0, totalBars = 0 }) => {
    return (
        <div id="gold-vault-node" className="w-full h-full bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 rounded-xl overflow-hidden relative flex flex-col group/panel transition-all duration-300 hover:border-neutral-600/50">

            {/* Header */}
            <div className="px-3 py-2 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Pickaxe className="w-4 h-4 text-primary" />
                    <h3 className="text-[10px] font-bold text-neutral-500 tracking-wider">VAULT</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-primary bg-primary/5 border border-primary/20">
                    <span className="text-[9px] font-bold tracking-widest uppercase">
                        {progress >= 100 ? 'ACTIVE' : 'IDLE'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                {/* Progress Section */}
                <div className="px-3 py-2 hover:bg-neutral-800 transition-all duration-200">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Batch</span>
                        <span className="text-[10px] font-bold text-neutral-100 font-mono">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full bg-primary"
                        />
                    </div>
                </div>

                {/* Today's Yield */}
                <div className="px-3 py-2 hover:bg-neutral-800 transition-all duration-200">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Yield</span>
                        </div>
                        <span className="text-[10px] font-bold text-neutral-100 tabular-nums uppercase">{barsToday} BARS</span>
                    </div>
                    {barsToday > 0 ? (
                        <div className="flex h-1.5 items-center gap-1 overflow-hidden rounded bg-neutral-800">
                            {Array.from({ length: Math.min(8, barsToday) }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                    className="h-full flex-1 rounded-full bg-primary"
                                />
                            ))}
                            {barsToday > 8 && (
                                <span className="ml-1 text-[9px] text-[#D4AF37]">+{barsToday - 8}</span>
                            )}
                        </div>
                    ) : (
                        <div className="h-1 w-full rounded bg-white/[0.02]" />
                    )}
                </div>

                {/* Total Reserve */}
                <div className="px-3 py-2 hover:bg-neutral-800 transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Coins className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">RESERVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full ${totalBars > i * 10 ? 'bg-primary' : 'bg-neutral-800'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] font-bold text-neutral-100 font-mono">{totalBars}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};