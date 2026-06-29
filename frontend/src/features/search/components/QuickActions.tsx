'use client';
/**
 * Why it exists: Provides quick access to common actions globally without navigating away from the current view.
 */
import React, { useState } from 'react';
import { Plus, Search, HelpCircle, FileDown, Settings, ChevronUp, Bot } from 'lucide-react';

export const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      
      {/* Floating Menu */}
      <div className={`flex flex-col space-y-2 transition-all duration-200 origin-bottom ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}`}>
        <button className="flex items-center justify-end px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:text-blue-600 group transition-colors">
          <span className="text-sm font-medium mr-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-600">New Meeting</span>
          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md"><Plus size={16} /></div>
        </button>
        
        <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} className="flex items-center justify-end px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:text-blue-600 group transition-colors">
          <span className="text-sm font-medium mr-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-600">Global Search</span>
          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md"><Search size={16} /></div>
        </button>
        
        <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '/', metaKey: true }))} className="flex items-center justify-end px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:text-blue-600 group transition-colors">
          <span className="text-sm font-medium mr-3 text-gray-700 dark:text-gray-300 group-hover:text-blue-600">Shortcuts</span>
          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md"><HelpCircle size={16} /></div>
        </button>
      </div>

      {/* FAB Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        <ChevronUp size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
    </div>
  );
};
