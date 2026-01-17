import React from 'react';
import { motion } from 'framer-motion';
import { Database, Hexagon, Layers } from 'lucide-react';

interface GoldVaultProps {
    progress: number;
    barsToday: number;
    totalBars: number;
}

export const GoldVault: React.FC<GoldVaultProps> = ({ progress = 0, barsToday = 0, totalBars = 0 }) => {
    return (
        // LAW OF BREATHING ROOM: Double padding (p-6)
        // LAW OF PRECISION GEOMETRY: rounded-3xl, 1px border
        <div className="w-full h-full bg-[#050505] border border-white/[0.05] rounded-3xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] relative flex flex-col">

            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center relative z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <Hexagon className="w-3.5 h-3.5 text-[#00FF85] stroke-[1.5px]" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#444]">Resource Vault</h3>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 px-6 pb-6 space-y-6">

                {/* Current Extraction Block */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[9px] uppercase tracking-wider text-[#555]">Batch Status</span>
                        <span className="text-[10px] font-mono text-[#EAEAEA]">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-[2px] w-full bg-[#111] overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="h-full bg-[#00FF85] shadow-[0_0_8px_rgba(0,255,133,0.5)]"
                        />
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Today's Yield */}
                    <div className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-3 h-3 text-[#333]" />
                            <span className="text-[8px] uppercase tracking-wider text-[#444]">Yield</span>
                        </div>
                        <div className="text-xl font-light text-white tracking-tighter tabular-nums">
                            {barsToday}
                        </div>
                    </div>

                    {/* Total Reserve */}
                    <div className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                        <div className="flex items-center gap-2 mb-2">
                            <Database className="w-3 h-3 text-[#333]" />
                            <span className="text-[8px] uppercase tracking-wider text-[#444]">Total</span>
                        </div>
                        <div className="text-xl font-light text-white tracking-tighter tabular-nums">
                            {totalBars}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};