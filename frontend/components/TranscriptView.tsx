'use client';
import { useUiStore } from '@/store/useUiStore';
import { TranscriptSegment } from '@/hooks/useMeetings';
import { useRef } from 'react';

export function TranscriptView({ segments }: { segments: TranscriptSegment[] }) {
  const currentTime = useUiStore((state) => state.currentTime);
  const activeCitation = useUiStore((state) => state.activeCitation);
  const triggerSeek = useUiStore((state) => state.triggerSeek);
  const clearActiveCitation = useUiStore((state) => state.clearActiveCitation);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-24 scroll-smooth scrollbar-thin scrollbar-thumb-workspace-border scrollbar-track-transparent" ref={scrollRef}>
      <div className="max-w-3xl mx-auto space-y-6 pt-6">
        {segments.map((segment) => {
          const isActive = currentTime >= segment.start_time && currentTime <= segment.end_time;
          const isCited = activeCitation !== null && activeCitation >= segment.start_time && activeCitation <= segment.end_time;
          
          if (isCited) {
            // Auto clear citation pulse after 2s
            setTimeout(clearActiveCitation, 2000);
          }

          return (
            <div 
              key={segment.id} 
              className={`group flex gap-4 transition-all duration-300 p-3 -mx-3 rounded-r-xl border-l-4 cursor-pointer ${
                isActive 
                  ? 'bg-[#1E293B]/50 border-purple-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.05)]' 
                  : 'border-transparent hover:bg-slate-800/40'
              } ${isCited ? 'ring-2 ring-purple-500 ring-opacity-50 animate-pulse bg-purple-900/20' : ''}`}
              onClick={() => triggerSeek(segment.start_time)}
            >
              <div className="w-16 flex-shrink-0 text-xs font-mono text-slate-500 pt-1">
                {formatTime(segment.start_time)}
              </div>
              <div className="flex-1">
                <div className={`text-sm font-semibold mb-1 transition-colors ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  {segment.speaker}
                </div>
                <div className={`text-[15px] leading-relaxed transition-colors ${
                  isActive ? 'text-slate-200 font-medium drop-shadow-sm' : 'text-slate-400 group-hover:text-slate-300'
                }`}>
                  {segment.text.replace(/\[Segment \d+\]/g, '').trim()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
