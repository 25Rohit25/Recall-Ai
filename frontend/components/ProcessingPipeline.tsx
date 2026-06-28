'use client';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';

export type PipelineStage = 
  | 'Uploading'
  | 'Parsing Transcript'
  | 'Chunking'
  | 'Detecting Speakers'
  | 'Generating Insights'
  | 'Extracting Tasks'
  | 'Done';

const STAGES: PipelineStage[] = [
  'Uploading',
  'Parsing Transcript',
  'Chunking',
  'Detecting Speakers',
  'Generating Insights',
  'Extracting Tasks',
  'Done'
];

export function ProcessingPipeline({ currentStage }: { currentStage: PipelineStage }) {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-[#020617] border border-slate-800 rounded-xl shadow-2xl">
      <h3 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        Processing Meeting Intelligence
      </h3>
      
      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={stage} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#020617] bg-[#0F172A] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_0_4px_#020617]">
                {isCompleted ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : isActive ? (
                  <CircleDot size={14} className="text-purple-500 animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-slate-700" />
                )}
              </div>
              
              <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-lg border transition-all ${
                isActive 
                  ? 'bg-purple-900/20 border-purple-500/30 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                  : isCompleted
                    ? 'bg-emerald-900/10 border-emerald-500/20 text-emerald-200/70'
                    : 'bg-[#0F172A] border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold tracking-wide">{stage}</span>
                  {isActive && <span className="text-[10px] uppercase tracking-widest text-purple-400 font-mono">Running</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
