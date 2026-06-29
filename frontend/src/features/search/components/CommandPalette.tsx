'use client';
/**
 * Why it exists: A premium, universal Command Palette (Ctrl+K).
 * Why this architecture is scalable: It intercepts global keyboard events to mount/unmount. It handles complex keyboard navigation (Arrow Up/Down, Enter) natively without heavy external libraries.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Search, MonitorPlay, CheckSquare, X, ArrowRight, History } from 'lucide-react';
import { useGlobalSearch, useRecentSearches } from '../hooks/useGlobalSearch';
import { useRouter } from 'next/navigation';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data: searchResults, isLoading } = useGlobalSearch(query);
  const { data: recentSearches } = useRecentSearches();

  // Aggregate results for keyboard navigation
  const flatResults = React.useMemo(() => {
    if (!query) return [];
    if (!searchResults) return [];
    
    const items = [];
    if (searchResults.meetings?.length) {
      items.push({ type: 'header', title: 'Meetings' });
      items.push(...searchResults.meetings.map(m => ({ ...m, icon: MonitorPlay })));
    }
    if (searchResults.action_items?.length) {
      items.push({ type: 'header', title: 'Action Items' });
      items.push(...searchResults.action_items.map(m => ({ ...m, icon: CheckSquare })));
    }
    if (searchResults.transcripts?.length) {
      items.push({ type: 'header', title: 'Transcript Mentions' });
      items.push(...searchResults.transcripts.map(m => ({ ...m, icon: Search })));
    }
    return items;
  }, [searchResults, query]);

  const selectableItems = flatResults.filter(item => item.type !== 'header');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleNavigation = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < selectableItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectableItems[selectedIndex]) {
      e.preventDefault();
      const item = selectableItems[selectedIndex];
      
      // Navigate to the specific meeting
      const targetMeetingId = item.type === 'meeting' ? item.id : item.meeting_id;
      if (targetMeetingId) {
        router.push(`/meetings/${targetMeetingId}`);
      }
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-gray-900/50 backdrop-blur-sm p-4">
      
      {/* Click away to close */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all"
        onKeyDown={handleNavigation}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-lg"
            placeholder="Search meetings, transcripts, tasks... (Cmd+K)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-500 bg-gray-100 dark:bg-gray-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          
          {/* Default Empty State / Recent */}
          {!query && (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Searches</h3>
              {recentSearches && recentSearches.length > 0 ? (
                <div className="space-y-1">
                  {recentSearches.map((sq, i) => (
                    <button key={i} onClick={() => setQuery(sq)} className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                      <History className="w-4 h-4 mr-3 text-gray-400" />
                      {sq}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No recent searches</p>
              )}
            </div>
          )}

          {/* Loading */}
          {isLoading && query.length >= 2 && (
             <div className="p-4 space-y-3 animate-pulse">
               <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
               <div className="h-12 bg-gray-100 dark:bg-gray-800/50 rounded w-full"></div>
             </div>
          )}

          {/* Render Results */}
          {query.length >= 2 && flatResults.map((item: any, idx) => {
            if (item.type === 'header') {
              return (
                <h3 key={`h-${idx}`} className="px-4 py-2 mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.title}
                </h3>
              );
            }

            // Find its relative index among selectable items
            const currentSelectableIndex = selectableItems.findIndex(x => x.id === item.id && x.type === item.type);
            const isSelected = selectedIndex === currentSelectableIndex;

            const Icon = item.icon;

            return (
              <div 
                key={`${item.type}-${item.id}`}
                className={`flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onMouseEnter={() => setSelectedIndex(currentSelectableIndex)}
                onClick={() => {
                   const target = item.type === 'meeting' ? item.id : item.meeting_id;
                   if (target) router.push(`/meetings/${target}`);
                   setIsOpen(false);
                }}
              >
                <div className="flex items-center min-w-0">
                  <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  <div className="truncate">
                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                      {item.title || item.description || item.text}
                    </p>
                    {item.type === 'transcript' && (
                      <p className={`text-xs truncate mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        Transcript Match
                      </p>
                    )}
                  </div>
                </div>
                {isSelected && <ArrowRight className="w-4 h-4 ml-4 flex-shrink-0" />}
              </div>
            );
          })}
          
          {query.length >= 2 && flatResults.length === 0 && !isLoading && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          )}

        </div>
        
        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
           <div className="flex space-x-4 text-xs text-gray-500">
             <span className="flex items-center"><kbd className="px-1.5 py-0.5 border rounded bg-white dark:bg-gray-800 mr-1 text-[10px]">↑↓</kbd> Navigate</span>
             <span className="flex items-center"><kbd className="px-1.5 py-0.5 border rounded bg-white dark:bg-gray-800 mr-1 text-[10px]">↵</kbd> Open</span>
             <span className="flex items-center"><kbd className="px-1.5 py-0.5 border rounded bg-white dark:bg-gray-800 mr-1 text-[10px]">ESC</kbd> Close</span>
           </div>
        </div>

      </div>
    </div>
  );
};
