'use client';
import { MeetingDetailResponse } from '@/hooks/useMeetings';
import { Activity } from 'lucide-react';
import { ActionItemsList } from './ActionItemsList';

export function IntelligencePanel({ meeting, className = '' }: { meeting: MeetingDetailResponse, className?: string }) {
  const intel = meeting.intelligence;

  if (!intel) {
    return (
      <aside className={`bg-[#0F172A] border-l border-slate-800 flex items-center justify-center text-slate-500 z-20 ${className}`}>
        No intelligence payload available.
      </aside>
    );
  }

  return (
    <aside className={`bg-[#0F172A] border-l border-slate-800 flex flex-col h-full z-20 shadow-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#020617]/50">
        <h2 className="text-sm font-semibold text-slate-200">Intelligence</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-slate-700">
        
        {/* Health Score */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity size={16} className="text-ai-purple" />
            Health Score
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-ai-purple to-ai-pink bg-clip-text text-transparent">
              {intel.health_score}
            </span>
            <span className="text-sm text-slate-500">/ 100</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#020617]/50 hover:shadow-lg hover:border-slate-600 transition-all duration-200">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{intel.overview}</p>
        </div>

        {/* Key Decisions */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Decisions</h3>
          <ul className="space-y-3">
            {meeting.decisions?.map((decision, i) => (
              <li key={decision.id || i} className="flex gap-3 text-sm text-slate-300">
                <span className="text-ai-purple mt-0.5">•</span>
                <span className="leading-relaxed">{decision.description}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Risks Identified</h3>
          <ul className="space-y-3">
            {intel.risks?.map((risk, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Items */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Action Items</h3>
          <ActionItemsList items={meeting.action_items} />
        </div>

      </div>
    </aside>
  );
}
