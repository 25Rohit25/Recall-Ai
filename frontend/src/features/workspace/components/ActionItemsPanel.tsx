/**
 * Why it exists: A specialized task manager UI for AI-extracted action items.
 * Why this architecture is scalable: The checkboxes instantly update UI via optimistic queries.
 */
import React from 'react';
import { CheckSquare, Calendar, User } from 'lucide-react';
import { useActionItems, useUpdateActionItem } from '../hooks/useWorkspace';

export const ActionItemsPanel = ({ meetingId }: { meetingId: string }) => {
  const { data: actionItems, isLoading } = useActionItems(meetingId);
  const { mutate: updateItem } = useUpdateActionItem(meetingId);

  if (isLoading) return <div className="animate-pulse h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>;
  if (!actionItems || actionItems.length === 0) return null;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <CheckSquare className="w-5 h-5 text-green-500 mr-2" />
        Action Items
      </h2>
      
      <div className="space-y-3">
        {actionItems.map(item => (
          <div 
            key={item.id} 
            className={`flex items-start p-3 rounded-lg border transition-all ${
              item.is_completed 
                ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <input 
              type="checkbox" 
              checked={item.is_completed}
              onChange={(e) => updateItem({ itemId: item.id, updates: { is_completed: e.target.checked } })}
              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-colors"
            />
            <div className="flex-grow min-w-0">
              <p className={`text-sm font-medium ${item.is_completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {item.description}
              </p>
              <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                {item.owner_name && (
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" /> {item.owner_name}
                  </span>
                )}
                {item.priority === 'high' && (
                  <span className="text-red-500 font-medium">High Priority</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
