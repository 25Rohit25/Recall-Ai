'use client';
import { useMeetingDetail } from '@/hooks/useMeetings';
import { LeftSidebar } from '@/components/LeftSidebar';
import { AudioPlayer } from '@/components/transcript/AudioPlayer';
import { TranscriptView } from '@/components/TranscriptView';
import { ActionItemsList } from '@/components/ActionItemsList';
import { Share2, CalendarClock, Download, Search, Trash2 } from 'lucide-react';
import { use, useEffect, useState } from 'react';
import { useUiStore } from '@/store/useUiStore';
import { AiCopilotPanel } from '@/components/AiCopilotPanel';
import { useRouter } from 'next/navigation';

export default function MeetingWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [activeRightTab, setActiveRightTab] = useState('Summary');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: meeting, isLoading, isError } = useMeetingDetail(resolvedParams.id);
  const setActiveMeeting = useUiStore((state) => state.setActiveMeeting);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://recall-ai-9vki.onrender.com/api/v1';
      await fetch(`${API_BASE}/meetings/${resolvedParams.id}`, { method: 'DELETE' });
      router.push('/dashboard');
    } catch (e) {
      console.error('Failed to delete meeting', e);
    }
  };

  useEffect(() => {
    if (meeting) {
      setActiveMeeting(meeting);
    }
    return () => setActiveMeeting(null);
  }, [meeting, setActiveMeeting]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--background)] text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--ff-purple)] border-t-transparent animate-spin" />
          <p className="text-sm font-medium tracking-wide">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--background)] text-slate-400">
        Error loading meeting data.
      </div>
    );
  }

  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="grid grid-cols-12 h-full w-full bg-[var(--background)] text-slate-200 overflow-hidden font-sans selection:bg-[var(--ff-purple)]">
      {/* Sidebar - 2 Cols */}
      <div className="col-span-2 overflow-y-auto border-r border-slate-800 bg-[var(--ff-sidebar)]">
        <LeftSidebar />
      </div>
      
      {/* Transcript Panel - 6 Cols */}
      <main className="col-span-6 flex flex-col h-full relative z-10 border-r border-slate-800 bg-[var(--background)]">
        {/* Header */}
        <header className="px-6 py-4 border-b border-slate-800 bg-[var(--background)] sticky top-0 z-20 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{meeting.title}</h1>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mt-1">
              <span className="flex items-center gap-1.5">
                <CalendarClock size={14} />
                {formattedDate}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                {meeting.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[var(--ff-surface)] transition-colors">
              <Share2 size={18} />
            </button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[var(--ff-surface)] transition-colors">
              <Download size={18} />
            </button>
            <button onClick={handleDelete} className="p-2 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors" title="Delete Meeting">
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        {/* Media Player Area */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[var(--ff-surface)]">
          <AudioPlayer mediaUrl={meeting.media_url} />
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-800 flex items-center gap-4 bg-[var(--background)] sticky top-[138px] z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search transcript..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--ff-surface)] border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--ff-purple)]"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
            <button className="px-3 py-1.5 rounded-lg bg-[var(--ff-surface)] border border-slate-800 hover:text-white transition-colors">Speakers</button>
            <button className="px-3 py-1.5 rounded-lg bg-[var(--ff-surface)] border border-slate-800 hover:text-white transition-colors">Topics</button>
          </div>
        </div>

        {/* Transcript Content */}
        <div className="flex-1 overflow-hidden relative">
          <TranscriptView segments={(meeting.segments || []).filter(s => s.text.toLowerCase().includes(searchQuery.toLowerCase()))} />
        </div>
      </main>

      {/* Right Intelligence Panel - 4 Cols */}
      <aside className="col-span-4 flex flex-col h-full bg-[var(--background)]">
        {/* Multi-Tab Navigation */}
        <div className="px-6 pt-4 border-b border-slate-800 flex items-center gap-6 text-sm font-medium text-slate-400 bg-[var(--background)]">
          {['Summary', 'Action Items', 'AI Copilot'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveRightTab(tab)}
              className={`pb-3 border-b-2 transition-colors focus:outline-none ${activeRightTab === tab ? 'border-[var(--ff-purple)] text-white' : 'border-transparent hover:text-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
          {activeRightTab === 'Summary' ? (
            <div className="space-y-6">
               <div className="p-5 rounded-xl bg-[var(--ff-card)] border border-slate-800 shadow-lg">
                  <h3 className="text-sm font-bold text-[var(--ff-purple)] mb-2 uppercase tracking-wide">Overview</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">{meeting.intelligence?.overview || 'No summary available.'}</p>
               </div>
               
               {meeting.decisions && meeting.decisions.length > 0 && (
                 <div className="p-5 rounded-xl bg-[var(--ff-card)] border border-slate-800 shadow-lg">
                    <h3 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wide">Key Decisions</h3>
                    <ul className="space-y-2">
                      {meeting.decisions.map((d: any) => (
                        <li key={d.id} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          {d.description}
                        </li>
                      ))}
                    </ul>
                 </div>
               )}
               
               <div className="p-5 rounded-xl bg-[var(--ff-card)] border border-slate-800 shadow-lg">
                  <h3 className="text-sm font-bold text-rose-400 mb-3 uppercase tracking-wide">Topics & Risks</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {meeting.intelligence?.topics?.map((t: string) => (
                      <span key={t} className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300">{t}</span>
                    ))}
                  </div>
                  {meeting.intelligence?.risks && meeting.intelligence.risks.length > 0 && (
                    <ul className="space-y-2 border-t border-slate-800 pt-3">
                      {meeting.intelligence.risks.map((r: string, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-rose-500 mt-0.5 text-xs">⚠️</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
               </div>
            </div>
          ) : activeRightTab === 'Action Items' ? (
            <div>
               <ActionItemsList items={meeting.action_items} />
            </div>
          ) : activeRightTab === 'AI Copilot' ? (
            <div className="h-full">
              <AiCopilotPanel className="col-span-12 h-full border-0 shadow-none bg-transparent !p-0" />
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
