'use client';
import { useEffect, useState } from 'react';
import { useUiStore } from '@/store/useUiStore';
import { Search, ListTodo, FileText, MessageSquare, Moon } from 'lucide-react';
import { exportMeetingToMarkdown } from '@/lib/export';

export function CommandPalette() {
  const isOpen = useUiStore((state) => state.isCommandPaletteOpen);
  const setOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const setActiveSidebarView = useUiStore((state) => state.setActiveSidebarView);
  const activeMeeting = useUiStore((state) => state.activeMeeting);
  const [query, setQuery] = useState('');

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const commands = [
    { id: 'search', label: 'Search Meetings', icon: <Search size={18} />, action: () => console.log('Search triggered') },
    { id: 'tasks', label: 'Jump to Action Items', icon: <ListTodo size={18} />, action: () => setActiveSidebarView('tasks') },
    { id: 'export', label: 'Export Transcript to Markdown', icon: <FileText size={18} />, action: () => {
        if (activeMeeting) {
          exportMeetingToMarkdown(activeMeeting);
        } else {
          alert('Please open a workspace first to export notes.');
        }
      }
    },
    { id: 'ask', label: 'Ask AI', icon: <MessageSquare size={18} />, action: () => setActiveSidebarView('copilot') },
    { id: 'theme', label: 'Toggle Theme', icon: <Moon size={18} />, action: () => console.log('Theme toggle triggered') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 shadow-2xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search size={20} className="text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 text-lg"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-xs font-semibold text-slate-500 bg-slate-800 px-2 py-1 rounded">ESC</div>
        </div>
        
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">No results found.</div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 border border-transparent transition-colors text-left"
                >
                  <span className="text-slate-400 group-hover:text-indigo-400">{cmd.icon}</span>
                  {cmd.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
