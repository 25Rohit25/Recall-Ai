'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Tag, Calendar, User, ArrowRight } from 'lucide-react';
import { useKnowledgeEntity } from '@/hooks/useKnowledge';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function KnowledgeSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use a debounced query for the API
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  const { data, isLoading, isError } = useKnowledgeEntity(debouncedQuery);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation logic
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
    if (e.key === 'ArrowDown' && !isOpen) setIsOpen(true);
    // Add advanced up/down selection logic if needed
  };

  const handleFocus = () => setIsOpen(true);

  return (
    <div className="relative w-96 group z-50" ref={containerRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={18} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!isOpen) setIsOpen(true);
        }}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder="Search knowledge graph (e.g. 'Kafka', 'PgBouncer')..."
        className="w-full bg-[#0F172A] border border-slate-700 rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600 shadow-lg"
      />
      {isLoading && debouncedQuery && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 animate-spin" size={16} />
      )}

      <AnimatePresence>
        {isOpen && query.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-3 left-0 w-[500px] bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col"
          >
            {isLoading ? (
              <div className="p-6 text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                <Loader2 className="animate-spin text-purple-500" size={16} /> Searching the Graph...
              </div>
            ) : isError || !data ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No matching entities found in the Knowledge Graph for &quot;{query}&quot;.
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="font-semibold text-slate-200">Knowledge Entity: {data.entity.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                    <Tag size={10} className="inline mr-1" /> {data.entity.type}
                  </span>
                </div>
                
                <div className="p-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Mentioned In</h4>
                  <div className="space-y-2">
                    {/* @ts-expect-error - timeline might not be typed perfectly in useKnowledge */}
                    {(data.timeline || data.meetings)?.map((meeting: { meeting_id: string, meeting_title: string, date: string, action_items: { owner: string }[] }) => (
                      <Link 
                        key={meeting.meeting_id} 
                        href={`/meetings/${meeting.meeting_id}`}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/50 transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-200 group-hover:text-purple-300 transition-colors">
                            {meeting.meeting_title}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Calendar size={12} /> {new Date(meeting.date).toLocaleDateString()}
                            </span>
                            {meeting.action_items?.length > 0 && (
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <User size={12} /> Key Owners: {Array.from(new Set(meeting.action_items.map((a) => a.owner.split(' ')[0]))).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
