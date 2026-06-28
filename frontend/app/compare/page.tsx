'use client';
import { useState, useEffect } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { MeetingComparison } from '@/components/MeetingComparison';
import { useMeetings } from '@/hooks/useMeetings';
import { Scale, Loader2 } from 'lucide-react';

export default function ComparePage() {
  const { data: meetings, isLoading } = useMeetings();
  const [meetingA, setMeetingA] = useState<string>('');
  const [meetingB, setMeetingB] = useState<string>('');

  // Auto-select first two meetings for demo purposes if available
  useEffect(() => {
    if (meetings && meetings.length >= 2 && !meetingA && !meetingB) {
      setMeetingA(meetings[0].id);
      setMeetingB(meetings[1].id);
    }
  }, [meetings, meetingA, meetingB]);

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-purple-500/30">
      <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-slate-800 bg-[#0F172A]">
        <LeftSidebar />
      </div>
      
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-y-auto">
        <header className="px-8 py-6 sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center gap-3 max-w-5xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Scale size={20} className="text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Meeting Comparison Engine</h1>
          </div>
        </header>

        <div className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-8">
          
          <div className="bg-gradient-to-r from-slate-900 to-[#0F172A] border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4">Select Meetings to Compare</h2>
            {isLoading ? (
               <div className="flex items-center gap-2 text-slate-500 text-sm">
                 <Loader2 size={16} className="animate-spin" /> Loading available meetings...
               </div>
            ) : !meetings || meetings.length < 2 ? (
               <div className="text-rose-400 text-sm">Need at least two meetings to perform a comparison.</div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Baseline Meeting (A)</label>
                  <select 
                    value={meetingA} 
                    onChange={(e) => setMeetingA(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none"
                  >
                    <option value="" disabled>Select a meeting...</option>
                    {meetings.map((m) => (
                      <option key={m.id} value={m.id} disabled={m.id === meetingB}>{m.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Comparison Meeting (B)</label>
                  <select 
                    value={meetingB} 
                    onChange={(e) => setMeetingB(e.target.value)}
                    className="w-full bg-[#020617] border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none"
                  >
                    <option value="" disabled>Select a meeting...</option>
                    {meetings.map((m) => (
                      <option key={m.id} value={m.id} disabled={m.id === meetingA}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {meetingA && meetingB && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <MeetingComparison meetingAId={meetingA} meetingBId={meetingB} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
