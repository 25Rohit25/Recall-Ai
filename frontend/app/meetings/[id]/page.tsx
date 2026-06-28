'use client';
import { useMeetingDetail } from '@/hooks/useMeetings';
import { LeftSidebar } from '@/components/LeftSidebar';
import { MediaPlayer } from '@/components/MediaPlayer';
import { TranscriptView } from '@/components/TranscriptView';
import { IntelligencePanel } from '@/components/IntelligencePanel';
import { Share2, MoreHorizontal, CalendarClock } from 'lucide-react';
import { use, useEffect } from 'react';
import { useUiStore } from '@/store/useUiStore';

export default function MeetingWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: meeting, isLoading, isError } = useMeetingDetail(resolvedParams.id);
  const setActiveMeeting = useUiStore((state) => state.setActiveMeeting);

  useEffect(() => {
    if (meeting) {
      setActiveMeeting(meeting);
    }
    return () => setActiveMeeting(null);
  }, [meeting, setActiveMeeting]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm font-medium tracking-wide">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Error loading meeting data.
      </div>
    );
  }

  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="flex h-screen w-full bg-workspace-900 text-slate-200 overflow-hidden font-sans selection:bg-ai-purple/30">
      <LeftSidebar />
      
      {/* Center Panel */}
      <main className="flex-1 flex flex-col h-full relative z-10 shadow-2xl shadow-black/50">
        {/* Header */}
        <header className="px-6 py-5 border-b border-workspace-border bg-workspace-800/80 backdrop-blur-xl flex justify-between items-start sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3 text-xs font-medium text-ai-purple mb-2">
              <span className="px-2 py-0.5 rounded-full bg-ai-purple/10 border border-ai-purple/20">
                {meeting.status.toUpperCase()}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <CalendarClock size={14} />
                {formattedDate}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{meeting.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-workspace-800 transition-colors">
              <Share2 size={18} />
            </button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-workspace-800 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* Media Player Bar */}
        <div className="px-6 py-4 border-b border-workspace-border bg-workspace-800/50">
          <MediaPlayer mediaUrl={meeting.media_url} />
        </div>

        {/* Transcript Stream */}
        <TranscriptView segments={meeting.transcript_segments} />
      </main>

      <IntelligencePanel meeting={meeting} />
    </div>
  );
}
