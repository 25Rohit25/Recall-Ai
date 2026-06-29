'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { FileText, Sparkles } from 'lucide-react';

const TranscriptContainer = dynamic(() => import('@/features/meetings/components/TranscriptContainer').then(mod => mod.TranscriptContainer), {
  loading: () => <div className="p-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-96 w-full"></div>,
  ssr: false // Media player shouldn't SSR to avoid hydration mismatch
});

const WorkspaceContainer = dynamic(() => import('@/features/workspace/components/WorkspaceContainer').then(mod => mod.WorkspaceContainer), {
  loading: () => <div className="p-8 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-96 w-full"></div>,
});

export default function MeetingTranscriptPage({ params }: { params: { meeting_id: string } }) {
  const meetingId = params?.meeting_id || 'test-meeting-id';
  
  // In a real Next.js app, this might be handled via query params (?tab=workspace)
  const [activeTab, setActiveTab] = useState<'transcript' | 'workspace'>('workspace');
  
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-16 flex-shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6">
        <div className="font-bold text-xl text-blue-600 tracking-tight">FireNotes AI</div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'workspace' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Sparkles size={16} className="mr-2" />
            AI Workspace
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'transcript' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileText size={16} className="mr-2" />
            Transcript
          </button>
        </div>
        
        <div className="w-24"></div> {/* Spacer for centering tabs */}
      </header>
      
      {/* Main Container */}
      <div className="flex-grow overflow-hidden relative">
        {/* We use CSS display:none for transcript so we don't unmount the media player / lose sync */}
        <div className={`absolute inset-0 ${activeTab === 'transcript' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <TranscriptContainer meetingId={meetingId} />
        </div>
        
        <div className={`absolute inset-0 ${activeTab === 'workspace' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
          <WorkspaceContainer meetingId={meetingId} />
        </div>
      </div>
      
    </div>
  );
}
