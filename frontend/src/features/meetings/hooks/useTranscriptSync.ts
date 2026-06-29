/**
 * Why it exists: Manages the bidirectional synchronization between the media player and the transcript UI.
 * Why this implementation is scalable:
 * - Uses `requestAnimationFrame` for timeline updates instead of React state `setInterval`, preventing cascading re-renders.
 * - Stores `currentTime` in a ref. Only updates React state when the `activeSegmentIndex` actually changes.
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { TranscriptSegment } from '@/types/transcript';

export const useTranscriptSync = (segments: TranscriptSegment[] | undefined) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // We only put the active INDEX in state so we only re-render when the active speaker changes.
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  
  // Refs for performance
  const rafRef = useRef<number>();
  const lastActiveIndexRef = useRef<number>(-1);

  // Sync logic running on animation frame
  const syncTime = useCallback(() => {
    if (!audioRef.current || !segments) return;
    
    const time = audioRef.current.currentTime;
    
    // Binary search would be faster for 5000+ items, but linear is fine if we start from the last known index.
    // For extreme performance, we do a localized search around the last known index.
    let foundIndex = -1;
    let startIdx = Math.max(0, lastActiveIndexRef.current - 5);
    let endIdx = Math.min(segments.length - 1, lastActiveIndexRef.current + 10);
    
    // Check locally first (most common case during normal playback)
    for (let i = startIdx; i <= endIdx; i++) {
      if (time >= segments[i].start_time && time <= segments[i].end_time) {
        foundIndex = i;
        break;
      }
    }
    
    // If not found locally (user seeked), do a full binary search
    if (foundIndex === -1) {
       let left = 0;
       let right = segments.length - 1;
       while (left <= right) {
         const mid = Math.floor((left + right) / 2);
         if (time >= segments[mid].start_time && time <= segments[mid].end_time) {
           foundIndex = mid;
           break;
         } else if (time < segments[mid].start_time) {
           right = mid - 1;
         } else {
           left = mid + 1;
         }
       }
    }

    if (foundIndex !== -1 && foundIndex !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = foundIndex;
      setActiveIndex(foundIndex);
    }
    
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(syncTime);
    }
  }, [segments, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(syncTime);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, syncTime]);

  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);
  
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      // Temporarily resume auto-scroll on manual seek
      setIsAutoScrollPaused(false);
      // Force an immediate sync
      syncTime(); 
    }
  }, [syncTime]);

  // Hook into native audio events to catch external play/pause (e.g. media keys on keyboard)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleSeeked = () => syncTime();
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('seeked', handleSeeked);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('seeked', handleSeeked);
    };
  }, [syncTime]);

  return {
    audioRef,
    activeIndex,
    isPlaying,
    isAutoScrollPaused,
    setIsAutoScrollPaused,
    togglePlay,
    seekTo
  };
};
