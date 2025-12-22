import React, { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { BrainCircuit, Bolt, Zap, Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { FatigueMetrics } from '../types';

interface StatsViewProps {
  metricsHistory: FatigueMetrics[];
}

// Custom component to ensure the Gold Bar icon is consistent and beautiful
const GoldBarIcon = () => (
  <Trophy className="w-4 h-4 text-amber-500/80 fill-amber-500/20" strokeWidth={1.5} />
);

export const StatsView: React.FC<StatsViewProps> = ({ metricsHistory }) => {
  // 1. Enhanced AI Session Analysis
  const sessionAnalysis = useMemo(() => {
    // Mock Data and Logic for a richer scenario
    const safeHistory = metricsHistory.length > 0 ? metricsHistory : [
      { timestamp: Date.now() - 30000, fatigueScore: 20, keystrokeLatencyMs: 120 },
      { timestamp: Date.now() - 20000, fatigueScore: 35, keystrokeLatencyMs: 130 },
      { timestamp: Date.now() - 10000, fatigueScore: 50, keystrokeLatencyMs: 140 },
      { timestamp: Date.now(), fatigueScore: 88, keystrokeLatencyMs: 250 }, // Critical Spike
    ];

    const lastMetric = safeHistory[safeHistory.length - 1];
    const maxFatigue = safeHistory.reduce((max, curr) => Math.max(max, curr.fatigueScore), 0);
    const initialLatency = safeHistory[0]?.keystrokeLatencyMs || 100;
    const latencyChange = lastMetric.keystrokeLatencyMs - initialLatency;

    // Determine the outcome and key metrics
    const isFatigueStop = maxFatigue > 80;

    let verdict, reason, keyMetricValue, keyMetricLabel, accentColor, icon;

    if (isFatigueStop) {
      verdict = "Critical Fatigue Detected. Protection Engaged.";
      reason = `The AI proactively ended the session to prevent cognitive burnout.`;
      keyMetricValue = `${latencyChange > 0 ? '+' : ''}${latencyChange}ms`;
      keyMetricLabel = 'Typing Latency Shift';
      accentColor = "#ef4444"; // Red (Burnout/Stop)
      icon = Zap;
    } else {
      verdict = "Sustained Deep Focus Achieved.";
      reason = "Your cognitive stability remained excellent across all key focus vectors.";
      keyMetricValue = `+${Math.floor(maxFatigue / 10)}%`;
      keyMetricLabel = 'Peak Stability Index';
      accentColor = "#34d399"; // Green (Flow/Success)
      icon = Bolt;
    }

    return {
      verdict,
      reason,
      keyMetricValue,
      keyMetricLabel,
      icon,
      data: safeHistory.map(m => ({
        value: m.fatigueScore,
        safeZone: 75, // The line where fatigue becomes risky
        sessionTime: m.timestamp
      })),
      goldBars: 5, // Enhanced daily reward
      accentColor,
      isFatigueStop
    };
  }, [metricsHistory]);

  const Icon = sessionAnalysis.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] relative flex flex-col"
    >

      {/* Header (Clean, Pro Look) */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center bg-white/5 relative z-10 shrink-0">
        <Icon className={`w-4 h-4 mr-2 ${sessionAnalysis.isFatigueStop ? 'text-red-400' : 'text-emerald-400'}`} />
        <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Ytterbium Insights</h3>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between p-6 relative z-10">

        {/* 1. System Verdict (PRIMARY - Dominant, Empathetic) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-left mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-light text-zinc-50 tracking-tight leading-normal">
            {sessionAnalysis.verdict}
          </h2>
        </motion.div>

        {/* 2. Visual Confirmation (SECONDARY - The Trust Band) */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 1, type: "spring", stiffness: 50 }}
          style={{ originX: 0 }}
          className="w-full h-20 mb-6 relative -mx-2" // Slightly wider than content for dramatic effect
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionAnalysis.data}>
              <defs>
                {/* Gradient for the fatigue curve */}
                <linearGradient id="fatigueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sessionAnalysis.accentColor} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={sessionAnalysis.accentColor} stopOpacity={0.0} />
                </linearGradient>
                {/* Gradient for the Confidence Band (Subtle grey fill) */}
                <linearGradient id="safeZoneGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a1a1aa" stopOpacity={0.05} />
                  <stop offset="100%" stopColor="#a1a1aa" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* The "Safe Zone" Band (Low Opacity, Non-data line) */}
              <Area
                type="monotone"
                dataKey="safeZone"
                stroke="#a1a1aa" // Zinc-400
                strokeWidth={1}
                strokeDasharray="4 4" // Dotted line for the threshold
                fill="url(#safeZoneGradient)"
                fillOpacity={0.1}
                dot={false}
              />

              {/* The Actual Fatigue Curve */}
              <Area
                type="monotone"
                dataKey="value"
                stroke={sessionAnalysis.accentColor}
                strokeWidth={2}
                fill="url(#fatigueGradient)"
                dot={false}
                isAnimationActive={true}
                animationDuration={1800}
              />
            </AreaChart>
          </ResponsiveContainer>

        </motion.div>

        {/* Pro Context: Key Metric Card */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`flex justify-between items-center p-3 rounded-xl mb-6 border ${sessionAnalysis.isFatigueStop ? 'border-red-600/30 bg-red-900/20' : 'border-emerald-600/30 bg-emerald-900/20'}`}
        >
          <div className='flex flex-col'>
            <span className='text-[10px] text-zinc-400 uppercase tracking-wider font-semibold'>Key Metric</span>
            <span className={`text-lg font-light ${sessionAnalysis.isFatigueStop ? 'text-red-300' : 'text-emerald-300'}`}>
              {sessionAnalysis.keyMetricLabel}
            </span>
          </div>
          <div className='flex items-center gap-1'>
            {sessionAnalysis.isFatigueStop ? <TrendingDown className='w-4 h-4 text-red-400' /> : <TrendingUp className='w-4 h-4 text-emerald-400' />}
            <span className={`text-xl font-mono ${sessionAnalysis.isFatigueStop ? 'text-red-200' : 'text-emerald-200'}`}>
              {sessionAnalysis.keyMetricValue}
            </span>
          </div>
        </motion.div>

        {/* 3. System Reason (TERTIARY - Direct Explanation) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-zinc-400 font-normal leading-relaxed text-left border-l-2 pl-3 border-zinc-700"
        >
          {sessionAnalysis.reason}
        </motion.p>
      </div>

      {/* 4. Gold Bars Summary (QUATERNARY - Clean Footer) */}
      <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 opacity-70">
          <GoldBarIcon />
          <span className="text-xs font-medium text-zinc-400">DAILY GOLD BARS</span>
        </div>

        <div className="flex items-center">
          <span className="text-xl font-light text-amber-300">
            +{sessionAnalysis.goldBars}
          </span>
        </div>
      </div>

    </motion.div>
  );
};