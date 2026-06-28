'use client';
import { ActionItem } from '@/hooks/useMeetings';
import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

function ActionItemRow({ item }: { item: ActionItem }) {
  const [completed, setCompleted] = useState(item.status === 'completed');
  // Mocking priority based on task text for now since it's not in schema
  const isHigh = item.task.toLowerCase().includes('asap') || item.task.toLowerCase().includes('urgent');

  return (
    <div 
      className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 ${
        completed 
          ? 'bg-workspace-900/50 border-workspace-border/50 opacity-60' 
          : 'bg-workspace-800/50 border-workspace-border hover:bg-workspace-800 hover:shadow-lg hover:border-slate-500'
      }`}
      onClick={() => setCompleted(!completed)}
    >
      <div className="mt-0.5">
        {completed ? (
          <CheckCircle2 size={18} className="text-ai-purple" />
        ) : (
          <Circle size={18} className="text-slate-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm mb-2 leading-relaxed ${completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
          {item.task}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-workspace-900 border border-workspace-border text-xs font-medium text-slate-400">
            <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[9px] text-slate-200">
              {item.owner.substring(0, 2).toUpperCase()}
            </div>
            {item.owner}
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            isHigh ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {isHigh ? 'High' : 'Medium'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ActionItemsList({ items }: { items: ActionItem[] }) {
  if (!items || items.length === 0) {
    return <div className="text-sm text-slate-500 italic px-1">No action items detected.</div>;
  }
  
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ActionItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}
