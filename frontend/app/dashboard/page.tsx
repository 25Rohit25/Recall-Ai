'use client';
import { useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { EmptyWorkspaceState } from '@/components/EmptyWorkspaceState';
import { Clock, CheckSquare, Calendar, AlertOctagon, Users, Video } from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import { useTeamAnalytics } from '@/hooks/useKnowledge';
import { KnowledgeSearch } from '@/components/KnowledgeSearch';
import Link from 'next/link';

import { CreateMeetingModal } from '@/components/CreateMeetingModal';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { data: meetings, isLoading } = useMeetings();
  const { data: analytics, isLoading: isAnalyticsLoading } = useTeamAnalytics('Alice (CEO)');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const metrics = [
    { label: 'Total Meetings', value: analytics?.total_meetings ?? 0, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Avg Talk Time (s)', value: analytics?.average_talk_time_seconds ?? 0, icon: CheckSquare, color: 'text-[var(--ff-purple)]', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Tasks Completed (%)', value: `${analytics?.global_tasks_completed_percentage ?? 0}%`, icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Questions Asked', value: analytics?.total_questions_asked ?? 0, icon: AlertOctagon, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  ];

  const handleUploadClick = () => setIsModalOpen(true);

  return (
    <div className="flex h-full w-full bg-[var(--background)] text-slate-200 overflow-hidden font-sans selection:bg-[var(--ff-purple)]">
      <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-slate-800 bg-[var(--ff-sidebar)]">
        <LeftSidebar />
      </div>
      
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-y-auto bg-[var(--background)]">
        <header className="px-8 py-6 sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex justify-between items-center max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-white">All Meetings</h1>
            
            <div className="flex items-center gap-4">
              <KnowledgeSearch />
              <button 
                onClick={handleUploadClick}
                className="bg-[var(--ff-purple)] hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Upload
              </button>
            </div>
          </div>
        </header>

        <CreateMeetingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Top Metrics Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {metrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div key={i} className="bg-[var(--ff-card)] p-5 rounded-xl border border-slate-800 flex items-center gap-4 shadow-sm hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 rounded-full ${metric.bg} ${metric.border} border flex items-center justify-center shrink-0`}>
                    <Icon size={24} className={metric.color} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-100">{metric.value}</div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-0.5">{metric.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Personal Assistant View */}
          <div className="bg-gradient-to-r from-purple-900/20 to-[var(--ff-card)] border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--ff-purple)]/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <h2 className="text-sm font-bold text-[var(--ff-purple)] uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--ff-purple)] shadow-[0_0_10px_rgba(124,92,252,0.8)]" />
              AI Copilot Insights
            </h2>
            <div className="text-xl text-slate-300 font-light leading-relaxed max-w-4xl">
              Good Morning, <span className="font-semibold text-white">Alice</span>. 
              You have <strong className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mx-1">{analytics?.tasks_summary?.total ?? 0} open action items</strong>. 
              Based on recent transcripts, we noticed repeated discussions around <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block mt-1">API rate limits</span>.
            </div>
          </div>

          {/* Dynamic Content Area */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              <div className="animate-pulse flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-[var(--ff-purple)] border-t-transparent rounded-full animate-spin" />
                Loading workspace data...
              </div>
            </div>
          ) : !meetings || meetings.length === 0 ? (
            <EmptyWorkspaceState 
              onUpload={handleUploadClick}
              onImport={() => console.log('Import')}
              onLoadSample={() => console.log('Load Sample')}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-lg font-semibold text-white">Meeting Library</h3>
                <span className="text-sm text-slate-500 font-medium">{meetings.length} recordings</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting) => (
                  <Link 
                    key={meeting.id} 
                    href={`/meetings/${meeting.id}`}
                    className="block p-5 bg-[var(--ff-card)] border border-slate-800 rounded-xl hover:border-purple-500/50 hover:bg-[var(--ff-surface)] transition-all hover:shadow-[0_0_20px_rgba(124,92,252,0.15)] group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--ff-purple)]/10 flex items-center justify-center border border-[var(--ff-purple)]/20 group-hover:scale-110 transition-transform">
                        <Video size={20} className="text-[var(--ff-purple)]" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800/50 border border-slate-700 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                        {meeting.status}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-200 mb-2 line-clamp-1 group-hover:text-white transition-colors">{meeting.title}</h4>
                    <p suppressHydrationWarning className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 font-medium">
                      <Calendar size={12} />
                      {new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded">
                        <Clock size={12} />
                        {Math.floor(meeting.duration / 60)} min
                      </span>
                      <span className="text-xs font-bold bg-gradient-to-r from-indigo-400 to-[var(--ff-purple)] bg-clip-text text-transparent flex items-center gap-1">
                        Score {meeting.health_score || 85}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
