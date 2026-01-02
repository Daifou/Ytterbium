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
        // Updated: Added max-w-[240px] and mx-auto for a tighter, compact width
        <div className="w-full max-w-[240px] mx-auto h-full bg-zinc-950/20 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl transition-all hover:shadow-[0_0_20px_-10px_rgba(212,175,55,0.3)] relative flex flex-col group/panel">

            {/* Header - Updated padding and typography */}
            <div className="px-2.5 py-1 border-b border-white/[0.05] flex justify-between items-center bg-black/40 relative z-10 shrink-0">
                <div className="flex items-center gap-1.5">
                    <Pickaxe className="w-2.5 h-2.5 text-[#D4AF37]" />
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Vault_Res</h3>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[#D4AF37] bg-white/[0.02] border border-white/[0.05]">
                    <span className="text-[7px] font-bold tracking-tighter uppercase">
                        {progress >= 100 ? '● READY' : '● MINING'}
                    </span>
                </div>
            </div>

            {/* Content - Updated px-2.5 for a slimmer feel */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                {/* Progress Section */}
                <div className="px-2.5 py-1.5 hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] text-zinc-500 uppercase tracking-tighter font-medium">Batch_Load</span>
                        <span className="text-[9px] font-mono font-medium text-[#D4AF37]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-0.5 w-full bg-white/[0.05] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="h-full shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                            style={{
                                background: 'linear-gradient(90deg, #8B735B 0%, #D4AF37 100%)'
                            }}
                        />
                    </div>
                </div>

                {/* Today's Yield - Updated spacing and bar width */}
                <div className="px-2.5 py-1.5 hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                            <Layers className="w-2.5 h-2.5 text-zinc-600" />
                            <span className="text-[8px] text-zinc-500 uppercase tracking-tighter font-medium">Daily_Ext</span>
                        </div>
                        <span className="text-[9px] font-bold text-zinc-300 tabular-nums tracking-tight">{barsToday} Bars</span>
                    </div>
                    {barsToday > 0 ? (
                        <div className="flex h-0.5 items-center gap-0.5 overflow-hidden rounded bg-white/[0.02]">
                            {Array.from({ length: Math.min(8, barsToday) }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                    className="h-full flex-1 rounded-[0.5px]"
                                    style={{
                                        background: 'linear-gradient(180deg, #D4AF37 0%, #8B735B 100%)'
                                    }}
                                />
                            ))}
                            {barsToday > 8 && (
                                <span className="ml-1 text-[7px] text-[#D4AF37] font-bold">+{barsToday - 8}</span>
                            )}
                        </div>
                    ) : (
                        <div className="h-0.5 w-full rounded bg-white/[0.02]" />
                    )}
                </div>

                {/* Total Reserve - Ultra compact footer row */}
                <div className="px-2.5 py-1 mt-1 border-t border-white/[0.03] hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Coins className="w-2.5 h-2.5 text-zinc-700" />
                            <span className="text-[9px] text-zinc-500 font-medium tracking-tight">Reserve</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-0.5 w-0.5 rounded-full ${totalBars > i * 10 ? 'bg-[#D4AF37] shadow-[0_0_3px_#D4AF37]' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-zinc-400">{totalBars}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};