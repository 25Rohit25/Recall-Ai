/**
 * Why it exists: The main container for the Transcript. Handles virtualization and auto-scrolling logic.
 * Why this implementation is scalable:
 * - Uses `@tanstack/react-virtual` to render only the visible rows out of potentially thousands.
 * - Auto-scroll checks if the active segment is outside the visible viewport and uses `scrollToIndex`.
 * - "Sync Paused" state prevents fighting the user if they scroll manually.
 */
import React, { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { RefreshCw } from 'lucide-react';
import { TranscriptSegment } from '@/types/transcript';
import { TranscriptRow } from './TranscriptRow';

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  activeIndex: number;
  searchQuery: string;
  isAutoScrollPaused: boolean;
  setIsAutoScrollPaused: (paused: boolean) => void;
  onSeek: (time: number) => void;
}

export const TranscriptPanel = ({
  segments,
  activeIndex,
  searchQuery,
  isAutoScrollPaused,
  setIsAutoScrollPaused,
  onSeek
}: TranscriptPanelProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer setup
  const rowVirtualizer = useVirtualizer({
    count: segments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated height of a row in px
    overscan: 5, // Render 5 items outside viewport for smoother scrolling
  });

  // Detect manual scroll to pause auto-sync
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // If the scroll was not triggered programmatically (e.g. by our own scrollToIndex)
    // We assume the user is manually scrolling.
    // For a robust implementation, we'd track wheel/touch events explicitly.
    setIsAutoScrollPaused(true);
  };

  // Auto-scroll logic
  useEffect(() => {
    if (activeIndex >= 0 && !isAutoScrollPaused && parentRef.current) {
      // Check if the item is currently visible
      const virtualItems = rowVirtualizer.getVirtualItems();
      const isVisible = virtualItems.some(item => item.index === activeIndex);
      
      // If it's not visible, or we just want to keep it centered, we scroll to it.
      if (!isVisible) {
        rowVirtualizer.scrollToIndex(activeIndex, { align: 'center', behavior: 'smooth' });
      }
    }
  }, [activeIndex, isAutoScrollPaused, rowVirtualizer]);

  return (
    <div className="relative h-full w-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
      
      {/* Resume Sync Badge */}
      {isAutoScrollPaused && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            onClick={() => {
              setIsAutoScrollPaused(false);
              if (activeIndex >= 0) {
                rowVirtualizer.scrollToIndex(activeIndex, { align: 'center', behavior: 'smooth' });
              }
            }}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <RefreshCw size={14} className="mr-2" />
            Resume Auto-Scroll
          </button>
        </div>
      )}

      {/* Virtualized Container */}
      <div 
        ref={parentRef}
        className="flex-grow overflow-auto transcript-scrollbar"
        onScroll={handleScroll}
        // Native event listener for wheel/touch to accurately detect user intent
        onWheel={() => setIsAutoScrollPaused(true)}
        onTouchStart={() => setIsAutoScrollPaused(true)}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const segment = segments[virtualRow.index];
            // Check if the previous segment has the same speaker for grouping
            const isSameAsPrevious = virtualRow.index > 0 && segments[virtualRow.index - 1].speaker_id === segment.speaker_id;
            const isActive = activeIndex === virtualRow.index;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <TranscriptRow 
                  segment={segment} 
                  isActive={isActive} 
                  isSameAsPrevious={isSameAsPrevious} 
                  searchQuery={searchQuery}
                  onSeek={onSeek}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
