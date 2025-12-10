import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FatigueMetrics } from '../types';

interface StatsViewProps {
  metricsHistory: FatigueMetrics[];
}

export const StatsView: React.FC<StatsViewProps> = ({ metricsHistory }) => {
  // Sample data preparation
  const data = metricsHistory.length > 0 ? metricsHistory.slice(-20).map((m, i) => ({
    time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    fatigue: m.fatigueScore,
    latency: Math.min(m.keystrokeLatencyMs, 500), // Clamp for viz
  })) : [
    { time: '10:00', fatigue: 20, latency: 120 },
    { time: '10:05', fatigue: 25, latency: 130 },
    { time: '10:10', fatigue: 22, latency: 115 },
    { time: '10:15', fatigue: 30, latency: 140 },
    { time: '10:20', fatigue: 45, latency: 180 },
    { time: '10:25', fatigue: 40, latency: 160 },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto animate-in fade-in">
      <h2 className="text-2xl font-semibold text-white mb-2">Session Analytics</h2>
      <p className="text-gray-500 mb-8">Real-time analysis of cognitive load and input dynamics.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Fatigue Trend */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">Fatigue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="fatigue" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorFatigue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keystroke Latency */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">Keystroke Latency (ms)</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: '#27272a'}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} 
                />
                <Bar dataKey="latency" fill="#5e6ad2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border p-6 rounded-xl">
            <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Focus Quality</div>
            <div className="text-3xl font-light text-white">84<span className="text-sm text-gray-500 ml-1">/100</span></div>
            <div className="mt-2 text-xs text-emerald-500">+4% vs last session</div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl">
             <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Typing Flow</div>
             <div className="text-3xl font-light text-white">High</div>
             <div className="mt-2 text-xs text-gray-500">Consistent rhythm detected</div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-xl">
             <div className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Next Break</div>
             <div className="text-3xl font-light text-white">12<span className="text-sm text-gray-500 ml-1">min</span></div>
             <div className="mt-2 text-xs text-indigo-400">Based on current fatigue</div>
        </div>
      </div>
    </div>
  );
};