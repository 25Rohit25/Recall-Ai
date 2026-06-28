import { Lightbulb, UserPlus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface LifecycleEvent {
  status: 'Proposed' | 'Assigned' | 'In Progress' | 'Completed' | 'Verified' | string;
  timestamp: string;
  actor?: string;
  detail?: string;
}

interface DecisionTimelineProps {
  history: LifecycleEvent[];
}

export function DecisionTimeline({ history }: DecisionTimelineProps) {
  if (!history || history.length === 0) {
    return <div className="text-sm text-slate-500 italic">No lifecycle history available.</div>;
  }

  const getIconForStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'proposed':
        return <Lightbulb size={16} className="text-amber-400" />;
      case 'assigned':
        return <UserPlus size={16} className="text-blue-400" />;
      case 'in progress':
        return <Clock size={16} className="text-purple-400" />;
      case 'completed':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'verified':
        return <CheckCircle size={16} className="text-teal-400" />;
      default:
        return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const getBgForStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'proposed':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'assigned':
        return 'bg-blue-500/10 border-blue-500/20';
      case 'in progress':
        return 'bg-purple-500/10 border-purple-500/20';
      case 'completed':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'verified':
        return 'bg-teal-500/10 border-teal-500/20';
      default:
        return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
      {history.map((event, index) => (
        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className={twMerge(
            'flex items-center justify-center w-8 h-8 rounded-full border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 bg-[#0F172A] z-10',
            getBgForStatus(event.status)
          )}>
            {getIconForStatus(event.status)}
          </div>
          
          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-[#0F172A] shadow-lg group-hover:border-purple-500/30 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className={twMerge("text-xs font-bold uppercase tracking-wider", 
                event.status.toLowerCase() === 'completed' || event.status.toLowerCase() === 'verified' ? 'text-emerald-400' : 'text-slate-300'
              )}>
                {event.status}
              </span>
              <time className="text-[10px] text-slate-500">{new Date(event.timestamp).toLocaleDateString()}</time>
            </div>
            {event.actor && (
              <div className="text-sm text-slate-300 mt-1">
                by <span className="font-medium text-purple-300">{event.actor}</span>
              </div>
            )}
            {event.detail && (
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{event.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
