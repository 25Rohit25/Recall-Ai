/**
 * Why it exists: Orchestrates the Transcript Engine by gluing together the Media Player, Virtualized Panel, Search Hooks, and Sync Hooks.
 * Why this implementation is scalable: Keeps state strictly localized. The global page doesn't re-render when the user types in the search bar or the media player time ticks.
 */
'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranscript } from '../hooks/useTranscript';
import { useTranscriptSync } from '../hooks/useTranscriptSync';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { TranscriptPanel } from './TranscriptPanel';
import { MediaPlayer } from './MediaPlayer';

interface TranscriptContainerProps {
  meetingId: string;
}

export const TranscriptContainer = ({ meetingId }: TranscriptContainerProps) => {
  // --- Data Fetching ---
  const { data: segments, isLoading, isError } = useTranscript(meetingId);
  
  // --- Sync State ---
  const {
    audioRef,
    activeIndex,
    isPlaying,
    isAutoScrollPaused,
    setIsAutoScrollPaused,
    togglePlay,
    seekTo
  } = useTranscriptSync(segments);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Derive matches instantly on the client for zero-latency UI (since we already have the full array cached)
  // For massive transcripts, we use the backend search API, but for < 5000 rows, client-side filtering is instantaneous.
  const searchMatches = useMemo(() => {
    if (!segments || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return segments
      .map((seg, idx) => (seg.transcript_text.toLowerCase().includes(query) ? idx : -1))
      .filter((idx) => idx !== -1);
  }, [segments, searchQuery]);

  // --- Search Actions ---
  const nextMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIdx);
    // Auto-scroll to match
    // In a real app we would expose the virtualizer reference to jump to searchMatches[nextIdx]
  };

  const prevMatch = () => {
    if (searchMatches.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIdx);
  };

  // --- Keyboard Shortcuts ---
  useKeyboardShortcuts({
    onTogglePlay: togglePlay,
    onSeekBackward: () => {
      if (audioRef.current) seekTo(Math.max(0, audioRef.current.currentTime - 5));
    },
    onSeekForward: () => {
      if (audioRef.current) seekTo(audioRef.current.currentTime + 5);
    },
    onSearchFocus: () => document.getElementById('transcript-search')?.focus(),
    onClearSearch: () => setSearchQuery(''),
    onNextSearchResult: nextMatch,
    onPrevSearchResult: prevMatch
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] w-full items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500">Loading transcript engine...</p>
      </div>
    );
  }

  if (isError || !segments) {
    return <div className="p-8 text-red-500">Failed to load transcript data.</div>;
  }

  // Calculate total duration from the last segment
  const totalDuration = segments.length > 0 ? segments[segments.length - 1].end_time : 0;
  // Placeholder audio URL
  const mockAudioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] w-full bg-gray-50 dark:bg-gray-950">
      
      {/* Left Column: Media Player & Meeting Details */}
      <div className="w-full lg:w-1/3 p-4 lg:p-8 flex flex-col border-r border-gray-200 dark:border-gray-800">
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Strategy Sync</h1>
        
        {/* Sticky Player Container */}
        <div className="sticky top-8">
          <MediaPlayer 
            audioUrl={mockAudioUrl}
            audioRef={audioRef}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onSeek={seekTo}
            duration={totalDuration}
          />
          
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Meeting Summary</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                Discussed the Q3 roadmap, finalized the marketing budget, and agreed on the new UI timeline. 
                Engineering needs to resolve the React Query caching issue before Friday.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Action Items</h3>
              <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>Deploy backend migrations by EOD</li>
                <li>Review the new Figma designs</li>
                <li>Schedule follow up with the infra team</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Transcript Engine */}
      <div className="w-full lg:w-2/3 flex flex-col h-full bg-white dark:bg-gray-900 shadow-sm z-10">
        
        {/* Transcript Header / Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transcript</h2>
          
          {/* Search Bar */}
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              id="transcript-search"
              type="text"
              className="block w-64 pl-9 pr-24 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Search transcript... (Ctrl+F)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentMatchIndex(0);
              }}
            />
            
            {searchQuery.length >= 2 && (
              <div className="absolute inset-y-0 right-0 pr-1 flex items-center space-x-1">
                <span className="text-xs text-gray-400 font-mono mr-1">
                  {searchMatches.length > 0 ? `${currentMatchIndex + 1}/${searchMatches.length}` : '0/0'}
                </span>
                <div className="flex border-l border-gray-300 dark:border-gray-600 pl-1 h-5 items-center space-x-0.5">
                  <button onClick={prevMatch} className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded">
                    <ChevronLeft size={14} />
                  </button>
                  <button onClick={nextMatch} className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded">
                    <ChevronRight size={14} />
                  </button>
                  <button onClick={() => setSearchQuery('')} className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded ml-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The Virtualized Transcript List */}
        <div className="flex-grow overflow-hidden">
          <TranscriptPanel 
            segments={segments} 
            activeIndex={activeIndex}
            searchQuery={searchQuery}
            isAutoScrollPaused={isAutoScrollPaused}
            setIsAutoScrollPaused={setIsAutoScrollPaused}
            onSeek={seekTo}
          />
        </div>

      </div>
    </div>
  );
};
