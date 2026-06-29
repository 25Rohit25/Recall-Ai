/**
 * Why it exists: Orchestrates the AI Intelligence workspace panels.
 * Why this architecture is scalable: Panels are independent components fetching their own data. We avoid massive monolithic queries or prop drilling.
 */
import React from 'react';
import { SummaryPanel } from './SummaryPanel';
import { ActionItemsPanel } from './ActionItemsPanel';
import { AIChatPanel } from './AIChatPanel';
import { ExportMenu } from './ExportMenu';

export const WorkspaceContainer = ({ meetingId }: { meetingId: string }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-4 lg:p-8 bg-gray-50 dark:bg-gray-950 transcript-scrollbar">
      
      {/* Workspace Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meeting Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">AI-generated insights and action items</p>
        </div>
        <ExportMenu meetingId={meetingId} />
      </div>

      {/* Top Row: Summary & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-6">
          <SummaryPanel meetingId={meetingId} />
          <ActionItemsPanel meetingId={meetingId} />
        </div>
        
        {/* Chat / Assistant Column */}
        <div className="flex flex-col">
          <AIChatPanel meetingId={meetingId} />
        </div>
      </div>

      {/* Future Panels: Chapters, Decisions, Risks would be conditionally rendered or placed below */}
      
    </div>
  );
};
