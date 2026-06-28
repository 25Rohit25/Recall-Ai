'use client';
import { useRef, useEffect, useState } from 'react';
import { useUiStore } from '@/store/useUiStore';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export function AudioPlayer({ mediaUrl }: { mediaUrl: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const setCurrentTime = useUiStore((state) => state.setCurrentTime);

  useEffect(() => {
    if (!mediaUrl || !containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(124, 92, 252, 0.4)', // --ff-purple with opacity
      progressColor: '#7C5CFC', // --ff-purple
      cursorColor: '#F8FAFC',
      barWidth: 2,
      barGap: 3,
      barRadius: 3,
      height: 48,
      normalize: true,
    });

    ws.load(mediaUrl);
    wavesurferRef.current = ws;

    ws.on('ready', () => {
      setIsReady(true);
    });

    ws.on('timeupdate', (currentTime) => {
      setCurrentTime(currentTime);
    });

    ws.on('interaction', () => {
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    return () => {
      ws.destroy();
    };
  }, [mediaUrl, setCurrentTime]);

  useEffect(() => {
    const unsubscribe = useUiStore.subscribe((state) => {
      if (state.seekRequest !== null && wavesurferRef.current && isReady) {
        const duration = wavesurferRef.current.getDuration();
        if (duration > 0) {
          wavesurferRef.current.seekTo(state.seekRequest / duration);
          wavesurferRef.current.play();
        }
        useUiStore.getState().clearSeekRequest();
      }
    });
    return unsubscribe;
  }, [isReady]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  const toggleMute = () => {
    if (wavesurferRef.current) {
      const muted = !isMuted;
      wavesurferRef.current.setMuted(muted);
      setIsMuted(muted);
    }
  };

  if (!mediaUrl) {
    return (
      <div className="w-full h-16 flex items-center justify-center gap-3 text-sm text-slate-500">
        <span>No media available for this meeting.</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center gap-4 bg-[var(--ff-surface)] p-2 rounded-lg">
      <button 
        onClick={togglePlay}
        disabled={!isReady}
        className="w-10 h-10 rounded-full bg-[var(--ff-purple)] flex items-center justify-center text-white disabled:opacity-50 hover:bg-purple-500 transition-colors shrink-0"
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
      </button>
      
      <div className="flex-1 overflow-hidden" ref={containerRef} />
      
      <button 
        onClick={toggleMute}
        disabled={!isReady}
        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 disabled:opacity-50"
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}
