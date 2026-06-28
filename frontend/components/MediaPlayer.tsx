'use client';
import { useRef, useEffect } from 'react';
import { useUiStore } from '@/store/useUiStore';

export function MediaPlayer({ mediaUrl }: { mediaUrl: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const setCurrentTime = useUiStore((state) => state.setCurrentTime);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [setCurrentTime]);

  useEffect(() => {
    const unsubscribe = useUiStore.subscribe((state) => {
      if (state.seekRequest !== null && audioRef.current) {
        audioRef.current.currentTime = state.seekRequest;
        audioRef.current.play().catch(() => {});
        useUiStore.getState().clearSeekRequest();
      }
    });
    return unsubscribe;
  }, []);

  if (!mediaUrl) {
    return (
      <div className="w-full h-16 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-sm text-slate-500 shadow-inner">
        No media available for this meeting.
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 p-2 shadow-inner">
      <audio 
        ref={audioRef} 
        controls 
        className="w-full h-10 outline-none"
        src={mediaUrl} 
      />
    </div>
  );
}
