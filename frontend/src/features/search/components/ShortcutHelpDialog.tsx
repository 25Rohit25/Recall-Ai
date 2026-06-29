'use client';
/**
 * Why it exists: Provides a premium keyboard shortcut guide for power users.
 * Why this architecture is scalable: It centralizes all shortcuts so the user doesn't have to guess.
 */
import React, { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

export const ShortcutHelpDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + / or Cmd + /
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
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

  if (!isOpen) return null;

  const shortcuts = [
    { category: 'Navigation', items: [
      { keys: ['Cmd', 'K'], desc: 'Open Command Palette' },
      { keys: ['Cmd', 'F'], desc: 'Search Transcript' },
      { keys: ['ESC'], desc: 'Close active dialog' },
    ]},
    { category: 'Media Controls', items: [
      { keys: ['Space'], desc: 'Play / Pause' },
      { keys: ['→'], desc: 'Forward 10s' },
      { keys: ['←'], desc: 'Backward 10s' },
    ]},
    { category: 'Productivity', items: [
      { keys: ['Cmd', 'N'], desc: 'New Meeting' },
      { keys: ['Cmd', 'E'], desc: 'Export Notes' },
      { keys: ['Cmd', '/'], desc: 'Show this menu' },
    ]},
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center text-gray-900 dark:text-white font-semibold">
            <Keyboard className="w-5 h-5 mr-2 text-blue-500" />
            Keyboard Shortcuts
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-gray-400 hover:text-gray-500 bg-gray-100 dark:bg-gray-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {shortcuts.map(group => (
            <div key={group.category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{group.category}</h3>
              <div className="space-y-2">
                {group.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.desc}</span>
                    <div className="flex space-x-1">
                      {item.keys.map(k => (
                         <kbd key={k} className="px-2 py-1 text-xs font-sans bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-400">
                           {k}
                         </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
