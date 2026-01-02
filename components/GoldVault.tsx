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
        <div className="w-full h-full bg-zinc-950/20 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl transition-all hover:shadow-[0_0_20px_-10px_rgba(212,175,55,0.3)] relative flex flex-col group/panel">

            {/* Header - Matches Nodes style */}
            <div className="px-2.5 py-1 border-b border-white/[0.05] flex justify-between items-center bg-black/40 relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Pickaxe className="w-2.5 h-2.5 text-zinc-500" />
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Reserve</h3>
                </div>
                <div className="flex items-center gap-1.5 px-1.5 py-0.25 rounded-md text-zinc-500 border border-white/[0.05] shadow-sm">
                    <span className="text-[8px] font-bold tracking-widest uppercase">
                        {progress >= 100 ? '● SYNCED' : '● EXTRACT'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                {/* Progress Section */}
                <div className="px-2 py-[2px] min-h-[24px] hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Progress</span>
                        <span className="text-[10px] font-medium text-zinc-300">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full"
                            style={{
                                background: 'linear-gradient(90deg, #8B735B 0%, #D4AF37 100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Today's Yield */}
                <div className="px-2 py-[2px] min-h-[24px] hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="w-2.5 h-2.5 text-zinc-600" />
                            <span className="text-[9px] text-zinc-500 uppercase tracking-tighter">Yield</span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-300 tabular-nums tracking-widest">{barsToday} Bars</span>
                    </div>
                    {barsToday > 0 ? (
                        <div className="flex h-1 items-center gap-0.5 overflow-hidden rounded bg-white/[0.02]">
                            {Array.from({ length: Math.min(8, barsToday) }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                    className="h-full flex-1 rounded-[1px]"
                                    style={{
                                        background: 'linear-gradient(180deg, #D4AF37 0%, #8B735B 100%)'
                                    }}
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
                <div className="px-2 py-0.5 hover:bg-white/5 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Coins className="w-3 h-3 text-gray-500" />
                            <span className="text-[11px] text-gray-400">Total Reserve</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 w-1 rounded-full ${totalBars > i * 10 ? 'bg-[#D4AF37] shadow-[0_0_4px_#D4AF37]' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[11px] font-medium text-gray-200">{totalBars}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};