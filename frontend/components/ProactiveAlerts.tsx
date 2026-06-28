'use client';
import { useEffect, useState } from 'react';
import { useGenerateRecommendations } from '@/hooks/useKnowledge';
import { Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProactiveAlertsProps {
  meetingId: string;
}

export function ProactiveAlerts({ meetingId }: ProactiveAlertsProps) {
  const { mutate, data, isPending } = useGenerateRecommendations();
  const [isVisible, setIsVisible] = useState(false);
  const [actioned, setActioned] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Simulate AI taking a moment to analyze before showing the alert
    const timer = setTimeout(() => {
      mutate(meetingId, {
        onSuccess: (res) => {
          if (res.recommendations.length > 0) {
            setIsVisible(true);
          }
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [meetingId, mutate]);

  const handleAction = (index: number) => {
    setActioned(prev => new Set(prev).add(index));
  };

  return (
    <AnimatePresence>
      {isVisible && data && data.recommendations.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-50 w-96 bg-gradient-to-br from-[#1E1B4B] to-[#020617] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-purple-500/20 bg-purple-900/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center relative">
                <Sparkles size={12} className="text-purple-400" />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">AI Suggestions Available</h4>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            {data.recommendations.map((rec, idx) => {
              const isActioned = actioned.has(idx);
              return (
                <div 
                  key={idx}
                  className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${
                    isActioned 
                      ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' 
                      : 'bg-slate-900/50 border-slate-700/50 hover:border-purple-500/40'
                  }`}
                >
                  <div className="text-sm text-slate-300 leading-relaxed">
                    {rec}
                  </div>
                  {!isActioned && (
                    <button 
                      onClick={() => handleAction(idx)}
                      className="self-start flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded"
                    >
                      Execute <ChevronRight size={12} />
                    </button>
                  )}
                  {isActioned && (
                    <div className="self-start flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      <CheckCircle2 size={12} /> Completed
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
