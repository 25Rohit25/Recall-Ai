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
      <div className="w-full h-16 flex items-center justify-center gap-3 text-sm text-slate-500 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m3 3 18 18"/><path d="M15 9.38a4.94 4.94 0 0 0-2.39-1.28l-2.77-.55A2.96 2.96 0 0 0 6.6 9.4 3 3 0 0 0 9.25 13H11"/><path d="M17 17a3 3 0 0 1-2.6-1.5M9.26 9.26 8.5 8"/><path d="m15 15 2.1-2.1a2.9 2.9 0 0 0 0-4.2V2a4 4 0 0 1 4 4v4"/></svg>
        <span>No media available for this meeting.</span>
      </div>
    );
  }

  return (
    <div className="w-full p-2 shadow-inner">
      <audio 
        ref={audioRef} 
        controls 
        className="w-full h-10 outline-none"
        src={mediaUrl} 
      />
    </div>
  );
}
