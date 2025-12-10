import React from 'react';
import { Battery, Zap } from 'lucide-react';

interface TopBarProps {
  fqs: number;
  fatigueScore: number;
  userName?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ fqs, fatigueScore, userName = "User" }) => {
  // Determine color based on FQS
  const fqsColor = fqs > 80 ? 'text-emerald-400' : fqs > 50 ? 'text-yellow-400' : 'text-rose-400';
  const fatigueColor = fatigueScore < 30 ? 'text-emerald-400' : fatigueScore < 70 ? 'text-yellow-400' : 'text-rose-400';

  return (
    <div className="h-14 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-400">Welcome back, {userName}</span>
      </div>

      <div className="flex items-center gap-6">
        {/* FQS Metric */}
        <div className="flex items-center gap-2" title="Focus Quality Score">
            <Zap className={`w-4 h-4 ${fqsColor}`} />
            <div className="flex flex-col items-end leading-none">
                <span className={`text-sm font-bold ${fqsColor}`}>{fqs}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">FQS</span>
            </div>
        </div>

        {/* Fatigue Metric */}
        <div className="flex items-center gap-2" title="Fatigue Level">
            <Battery className={`w-4 h-4 ${fatigueColor}`} />
             <div className="flex flex-col items-end leading-none">
                <span className={`text-sm font-bold ${fatigueColor}`}>{fatigueScore}%</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Load</span>
            </div>
        </div>
      </div>
    </div>
  );
};