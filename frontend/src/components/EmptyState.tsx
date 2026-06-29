/**
 * Why it exists: Provides an empty state when a search yields no results or when there are no meetings in the dashboard.
 */
import React from 'react';
import { FileSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] p-8 bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 border-dashed m-4 animate-fade-in">
      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
        {icon || <FileSearch className="w-8 h-8" />}
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};
