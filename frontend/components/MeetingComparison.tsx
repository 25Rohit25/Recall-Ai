'use client';
import { useCompareMeetings } from '@/hooks/useKnowledge';
import { Loader2, TrendingUp, TrendingDown, Minus, Activity, Users, AlertTriangle, CheckSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MeetingComparisonProps {
  meetingAId: string;
  meetingBId: string;
}

export function MeetingComparison({ meetingAId, meetingBId }: MeetingComparisonProps) {
  const { data, isLoading, isError } = useCompareMeetings(meetingAId, meetingBId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl min-h-[400px]">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={32} />
        <p>Crunching meeting analytics...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-rose-400 bg-[#0F172A] rounded-2xl border border-rose-500/20 shadow-xl min-h-[400px]">
        <p>Failed to compare meetings. Please select two valid meetings.</p>
      </div>
    );
  }

  const { meeting_a, meeting_b, comparison } = data;

  const renderDelta = (delta: number, percentage: number, inverseGood = false) => {
    // If inverseGood is true, negative is green (e.g. fewer risks is better)
    const isPositive = delta > 0;
    const isNeutral = delta === 0;
    const isGood = isNeutral ? null : inverseGood ? !isPositive : isPositive;
    
    return (
      <div className={twMerge(
        "flex items-center gap-1.5 font-bold text-sm px-2 py-1 rounded-md border",
        isNeutral ? "text-slate-400 bg-slate-800 border-slate-700" :
        isGood ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
        "text-rose-400 bg-rose-500/10 border-rose-500/20"
      )}>
        {isNeutral ? <Minus size={14} /> : isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {isNeutral ? 'No Change' : `${isPositive ? '+' : ''}${percentage}%`}
      </div>
    );
  };

  const metrics = [
    { key: 'participation', label: 'Unique Participants', icon: Users, inverseGood: false },
    { key: 'health', label: 'Health Score', icon: Activity, inverseGood: false },
    { key: 'tasks', label: 'Action Items Generated', icon: CheckSquare, inverseGood: false },
    { key: 'risks', label: 'Flagged Risks', icon: AlertTriangle, inverseGood: true },
  ] as const;

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-[#020617]/50 divide-x divide-slate-800 p-6 items-center">
        <div className="text-center px-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-2">Meeting A</span>
          <h3 className="text-lg font-bold text-slate-200 line-clamp-2">{meeting_a.title}</h3>
        </div>
        <div className="text-center px-4 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner mb-2">
            <span className="text-xs font-bold text-purple-400">VS</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Comparison Delta</span>
        </div>
        <div className="text-center px-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-2">Meeting B</span>
          <h3 className="text-lg font-bold text-slate-200 line-clamp-2">{meeting_b.title}</h3>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="flex flex-col divide-y divide-slate-800/50 p-2">
        {metrics.map((metric) => {
          const valA = meeting_a[metric.key];
          const valB = meeting_b[metric.key];
          const comp = comparison[metric.key];
          const Icon = metric.icon;

          return (
            <div key={metric.key} className="grid grid-cols-3 items-center py-5 px-6 hover:bg-slate-800/30 transition-colors rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-light text-slate-300">{valA}</div>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                  <Icon size={16} className="text-purple-400" />
                  {metric.label}
                </div>
                {renderDelta(comp.delta, comp.percentage, metric.inverseGood)}
              </div>

              <div className="text-center">
                <div className="text-2xl font-light text-slate-300">{valB}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
