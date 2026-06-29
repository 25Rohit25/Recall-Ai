/**
 * Why it exists: A custom, accessible Media Player UI replacing the native HTML5 audio controls.
 * Why this implementation is scalable: Decouples the UI from the `<audio>` element by accepting the `audioRef` and exposing precise control functions. Uses a local RAF loop for the progress bar to ensure 60fps smooth seeking without triggering React state re-renders in the parent component.
 */
import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX, Maximize } from 'lucide-react';
import { formatTime } from '@/utils/time';

interface MediaPlayerProps {
  audioUrl: string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  togglePlay: () => void;
  onSeek: (time: number) => void;
  duration: number; // passed down or extracted from audio metadata
}

export const MediaPlayer = ({ audioUrl, audioRef, isPlaying, togglePlay, onSeek, duration }: MediaPlayerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Smooth UI progress bar update independent of transcript sync
  const updateProgress = () => {
    if (audioRef.current && isPlaying) {
      setCurrentTime(audioRef.current.currentTime);
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateProgress);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  // Handle external seeks (e.g. clicking transcript)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleSeeked = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('seeked', handleSeeked);
    return () => audio.removeEventListener('seeked', handleSeeked);
  }, [audioRef]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    onSeek(newTime);
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      onSeek(Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration)));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const cyclePlaybackRate = () => {
    if (!audioRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-gray-900 text-white rounded-xl p-4 flex flex-col shadow-2xl">
      {/* Hidden Native Audio */}
      <audio ref={audioRef as React.LegacyRef<HTMLAudioElement>} src={audioUrl} preload="metadata" />

      {/* Progress Bar Area */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-xs font-mono text-gray-400 w-12 text-right">{formatTime(currentTime)}</span>
        
        <div 
          ref={progressBarRef}
          className="flex-grow h-2 bg-gray-700 rounded-full cursor-pointer relative group"
          onClick={handleProgressBarClick}
        >
          {/* Progress Fill */}
          <div 
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Hover Knob */}
          <div 
            className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>

        <span className="text-xs font-mono text-gray-400 w-12">{formatTime(duration)}</span>
      </div>

      {/* Controls Area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={toggleMute} className="p-2 text-gray-400 hover:text-white transition-colors" title="Mute/Unmute">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={() => skip(-10)} className="p-2 text-gray-400 hover:text-white transition-colors" title="Rewind 10s">
            <Rewind size={20} />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="h-12 w-12 flex items-center justify-center bg-blue-600 hover:bg-blue-500 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </button>
          
          <button onClick={() => skip(10)} className="p-2 text-gray-400 hover:text-white transition-colors" title="Forward 10s">
            <FastForward size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={cyclePlaybackRate} className="px-2 py-1 text-xs font-bold text-gray-400 hover:text-white border border-gray-700 rounded transition-colors w-12 text-center" title="Playback Speed">
            {playbackRate}x
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors" title="Fullscreen">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
