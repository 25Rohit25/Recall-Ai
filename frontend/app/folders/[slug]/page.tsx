'use client';
import { use } from 'react';
import { useMeetings } from '@/hooks/useMeetings';
import Link from 'next/link';
import { Video, Calendar, Clock, Loader2 } from 'lucide-react';
import { LeftSidebar } from '@/components/LeftSidebar';

export default function FolderPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { data: meetings, isLoading } = useMeetings();
  
  // Format the slug into a readable title (e.g., q3-planning -> Q3 Planning)
  const title = resolvedParams.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-purple-500/30">
      <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-slate-800 bg-[#0F172A]">
        <LeftSidebar />
      </div>
      <main className="flex-1 bg-[#0F172A] p-8 h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-slate-100">{title}</h1>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-slate-400 border border-slate-700">Folder</span>
        </div>
        <p className="text-slate-400 mb-12">Organize and manage meetings in this folder.</p>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <div className="animate-pulse flex items-center gap-2">
              <Loader2 size={20} className="animate-spin text-purple-500" />
              Loading folder contents...
            </div>
          </div>
        ) : !meetings || meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-[#0F172A] rounded-2xl border border-slate-800 border-dashed">
            <p>No meetings found in this folder.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <Link 
                key={meeting.id} 
                href={`/meetings/${meeting.id}`}
                className="block p-5 bg-[#020617] border border-slate-800 rounded-xl hover:border-purple-500/50 hover:bg-slate-800/80 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Video size={20} className="text-indigo-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    {meeting.status}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-200 mb-2 line-clamp-1">{meeting.title}</h4>
                <p suppressHydrationWarning className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(meeting.date).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {Math.floor(meeting.duration / 60)} min
                  </span>
                  <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-rose-400 bg-clip-text text-transparent">
                    Score: {meeting.health_score || 85}/100
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
