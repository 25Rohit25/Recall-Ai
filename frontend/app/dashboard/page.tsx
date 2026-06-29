'use client';
import { useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { EmptyWorkspaceState } from '@/components/EmptyWorkspaceState';
import { Clock, Calendar, Video } from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import Link from 'next/link';

import { CreateMeetingModal } from '@/components/CreateMeetingModal';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { data: meetings, isLoading } = useMeetings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUploadClick = () => setIsModalOpen(true);

  const filteredMeetings = meetings?.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <input 
                type="text"
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[var(--ff-surface)] border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[var(--ff-purple)]"
              />
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
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-500">
              <div className="animate-pulse flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-[var(--ff-purple)] border-t-transparent rounded-full animate-spin" />
                Loading workspace data...
              </div>
            </div>
          ) : !filteredMeetings || filteredMeetings.length === 0 ? (
            <EmptyWorkspaceState 
              onUpload={handleUploadClick}
              onImport={() => console.log('Import')}
              onLoadSample={() => console.log('Load Sample')}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-lg font-semibold text-white">Meeting Library</h3>
                <span className="text-sm text-slate-500 font-medium">{filteredMeetings.length} recordings</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeetings.map((meeting) => (
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
