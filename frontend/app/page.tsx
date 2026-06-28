'use client';

import { useMeetings } from '@/hooks/useMeetings';
import Link from 'next/link';
import { CalendarClock, Activity, ArrowRight, Video } from 'lucide-react';
import { LeftSidebar } from '@/components/LeftSidebar';

export default function Home() {
  const { data: meetings, isLoading, isError } = useMeetings();

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      <LeftSidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="px-10 py-12 border-b border-slate-800/80 bg-slate-900/20 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-slate-100 tracking-tight mb-3">Welcome to FireNotes AI</h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Your enterprise Meeting Intelligence Platform. Select a recent workspace to dive into the transcript, insights, and tasks.
            </p>
          </div>
        </header>

        <div className="p-10 relative z-10">
          <h2 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Video className="text-indigo-400" />
            Recent Workspaces
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 rounded-xl bg-slate-900/50 border border-slate-800 animate-pulse" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Failed to connect to the backend API. Make sure it is running on port 8000.
            </div>
          )}

          {meetings && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {meetings.map((meeting) => (
                <Link 
                  href={`/meetings/${meeting.id}`} 
                  key={meeting.id}
                  className="group relative flex flex-col justify-between p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:bg-slate-800/60 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {meeting.status.toUpperCase()}
                      </span>
                      {meeting.health_score && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                          <Activity size={16} />
                          {meeting.health_score}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2 line-clamp-2">
                      {meeting.title}
                    </h3>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <CalendarClock size={16} />
                      {new Date(meeting.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Open Workspace <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
