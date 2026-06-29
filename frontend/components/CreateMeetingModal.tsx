'use client';
import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateMeetingModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://recall-ai-9vki.onrender.com/api/v1';
      const res = await fetch(`${API_BASE}/meetings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          participants: participants.split(',').map(p => p.trim()).filter(Boolean),
          transcript_text: transcriptText
        })
      });
      
      const data = await res.json();
      
      // Auto-generate summary for better demo experience
      await fetch(`${API_BASE}/meetings/${data.id}/generate-summary`, {
        method: 'POST'
      });
      
      onClose();
      
      // Navigate to new meeting
      router.push(`/meetings/${data.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--ff-card)] w-full max-w-2xl rounded-xl border border-slate-800 shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">Upload New Meeting</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Meeting Title</label>
            <input 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[var(--ff-surface)] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--ff-purple)]"
              placeholder="e.g. Q4 Strategy Review"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Participants (comma separated)</label>
            <input 
              value={participants}
              onChange={e => setParticipants(e.target.value)}
              className="w-full bg-[var(--ff-surface)] border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--ff-purple)]"
              placeholder="Alice, Bob, Charlie"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Raw Transcript Text</label>
            <textarea 
              required
              value={transcriptText}
              onChange={e => setTranscriptText(e.target.value)}
              className="w-full bg-[var(--ff-surface)] border border-slate-700 rounded-lg px-4 py-2 text-white h-48 focus:outline-none focus:border-[var(--ff-purple)] resize-none font-mono text-sm"
              placeholder="Speaker Name: This is what they said..."
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[var(--ff-purple)] text-white hover:bg-purple-500 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
            >
              {isSubmitting ? <><Loader2 className="animate-spin" size={18} /> Processing...</> : 'Upload & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
