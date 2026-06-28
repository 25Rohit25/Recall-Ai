'use client';
import { TranscriptSegment } from '@/hooks/useMeetings';
import { useUiStore } from '@/store/useUiStore';
import { motion } from 'framer-motion';

export function TranscriptHeatmap({ segments }: { segments: TranscriptSegment[] }) {
  const currentTime = useUiStore((state) => state.currentTime);
  const triggerSeek = useUiStore((state) => state.triggerSeek);

  // We assume a total duration of the meeting based on the last segment
  const totalDuration = segments.length > 0 ? segments[segments.length - 1].end_time : 1;

  return (
    <div className="w-full h-8 bg-slate-800/50 overflow-hidden relative cursor-pointer group">
      {/* Progress indicator line */}
      <motion.div 
        className="absolute top-0 bottom-0 left-0 bg-white/10 z-10 pointer-events-none"
        style={{ width: `${(currentTime / totalDuration) * 100}%` }}
        initial={false}
        animate={{ width: `${(currentTime / totalDuration) * 100}%` }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-white z-20 shadow-[0_0_10px_rgba(255,255,255,0.8)] pointer-events-none"
        style={{ left: `${(currentTime / totalDuration) * 100}%` }}
      />
      
      {/* The heatmap track */}
      <div className="flex w-full h-full">
        {segments.map((segment) => {
          const widthPercent = ((segment.end_time - segment.start_time) / totalDuration) * 100;
          
          // Determine density/context color
          // We'll use simple string matching to mock high density vs arguments
          const textLower = segment.text.toLowerCase();
          let colorClass = 'bg-slate-700/50';
          if (textLower.includes('disagree') || textLower.includes('no,') || textLower.includes('but')) {
            colorClass = 'bg-rose-600/80';
          } else if (segment.text.length > 100 || textLower.includes('important')) {
            colorClass = 'bg-purple-600/80';
          }

          return (
            <div
              key={segment.id}
              className={`h-full ${colorClass} hover:brightness-125 transition-all border-r border-slate-900/50`}
              style={{ width: `${widthPercent}%` }}
              onClick={(e) => {
                e.stopPropagation();
                triggerSeek(segment.start_time);
              }}
              title={`[${segment.speaker}] ${segment.text}`}
            />
          );
        })}
      </div>
    </div>
  );
}
