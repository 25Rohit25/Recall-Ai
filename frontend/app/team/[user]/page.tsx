'use client';
import { use } from 'react';
import { useTeamAnalytics } from '@/hooks/useKnowledge';
import { LeftSidebar } from '@/components/LeftSidebar';
import { DecisionTimeline } from '@/components/DecisionTimeline';
import { UserCircle2, Clock, CheckSquare, Target, Loader2, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamMemberProfile({ params }: { params: Promise<{ user: string }> }) {
  const resolvedParams = use(params);
  const userName = decodeURIComponent(resolvedParams.user);
  const { data: analytics, isLoading, isError } = useTeamAnalytics(userName);

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-purple-500/30">
      <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-slate-800 bg-[#0F172A]">
        <LeftSidebar />
      </div>
      
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        <header className="px-8 py-8 sticky top-0 z-20 bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center gap-4 max-w-5xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px]">
              <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center">
                <UserCircle2 size={32} className="text-purple-400" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">{userName}</h1>
              <p className="text-sm font-medium text-purple-400 uppercase tracking-widest mt-1">Team Member Profile</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="animate-spin text-purple-500 mb-4" size={32} />
              <p>Loading global analytics...</p>
            </div>
          ) : isError || !analytics ? (
            <div className="p-8 text-center bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              Failed to load analytics for {userName}.
            </div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Meetings', value: analytics.total_meetings, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Avg Talk Time', value: `${Math.round(analytics.average_talk_time_seconds / 60)}m`, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Tasks Completed', value: `${analytics.global_tasks_completed_percentage}%`, icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Open Decisions', value: analytics.open_decisions?.length || 0, icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((metric, i) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl"
                    >
                      <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center mb-4`}>
                        <Icon size={20} className={metric.color} />
                      </div>
                      <div className="text-3xl font-light text-slate-100 mb-1">{metric.value}</div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{metric.label}</div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Open Decisions */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-[#020617]/50">
                  <h3 className="text-lg font-bold text-slate-200">Open Decisions Involving {userName.split(' ')[0]}</h3>
                  <p className="text-sm text-slate-500 mt-1">Decisions from meetings this user attended that are not yet Completed or Verified.</p>
                </div>
                <div className="p-6">
                  {(!analytics.open_decisions || analytics.open_decisions.length === 0) ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No open decisions found for this user.
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {analytics.open_decisions.map((decision) => (
                        <div key={decision.id} className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                          <h4 className="text-sm font-semibold text-slate-200 mb-4">{decision.description}</h4>
                          <DecisionTimeline history={decision.lifecycle_history} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
