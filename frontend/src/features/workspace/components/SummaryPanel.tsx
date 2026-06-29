/**
 * Why it exists: Displays the LLM-generated executive summary.
 * Why this architecture is scalable: Includes built-in regeneration logic. The UI handles the loading state (shimmer/skeleton) independently from the rest of the workspace.
 */
import React from 'react';
import { Sparkles, RefreshCw, Edit3 } from 'lucide-react';
import { useSummary, useRegenerateSummary } from '../hooks/useWorkspace';

export const SummaryPanel = ({ meetingId }: { meetingId: string }) => {
  const { data: summary, isLoading, isError } = useSummary(meetingId);
  const { mutate: regenerate, isPending: isRegenerating } = useRegenerateSummary(meetingId);

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (isError) return <div className="text-red-500">Failed to load summary.</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
          Executive Summary
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => regenerate()} 
            disabled={isRegenerating}
            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded disabled:opacity-50"
            title="Regenerate with AI"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded" title="Edit text">
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {isRegenerating ? (
           <p className="text-gray-500 italic animate-pulse">AI is rethinking the summary...</p>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {summary?.executive_summary || "No summary available."}
          </p>
        )}
      </div>
    </div>
  );
};
