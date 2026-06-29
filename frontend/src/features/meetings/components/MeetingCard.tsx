/**
 * Why it exists: Displays a single meeting summary in a premium grid or list format.
 * Why this implementation is scalable: Memoized with `React.memo` to prevent re-renders when the parent dashboard state changes (e.g., search typing).
 */
import React from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, MoreVertical, Pin, Archive, Copy, Trash, Play } from 'lucide-react';
import { Meeting } from '@/types/meeting';
import { useTogglePinMeeting, useToggleArchiveMeeting, useDeleteMeeting, useDuplicateMeeting } from '../hooks/useMeetings';

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard = React.memo(({ meeting }: MeetingCardProps) => {
  const togglePin = useTogglePinMeeting();
  const toggleArchive = useToggleArchiveMeeting();
  const deleteMeeting = useDeleteMeeting();
  const duplicateMeeting = useDuplicateMeeting();

  // Helper to format duration from seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">
      
      {/* Badges */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {meeting.is_pinned && (
          <div className="bg-yellow-100 text-yellow-800 p-1.5 rounded-full" title="Pinned">
            <Pin size={14} className="fill-current" />
          </div>
        )}
        {meeting.is_archived && (
          <div className="bg-gray-100 text-gray-600 p-1.5 rounded-full" title="Archived">
            <Archive size={14} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 truncate pr-12">
          {meeting.title}
        </h3>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1.5" />
          {format(new Date(meeting.meeting_date), 'MMM d, yyyy')}
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1.5" />
          {formatDuration(meeting.duration)}
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-grow">
        {meeting.description || 'No description provided.'}
      </p>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            meeting.transcript_status === 'completed' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {meeting.transcript_status}
          </span>
        </div>
        
        {/* Context Menu (Simulated dropdown for now, would use shadcn DropdownMenu) */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => togglePin.mutate({ id: meeting.id, pinStatus: !meeting.is_pinned })}
            className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={meeting.is_pinned ? "Unpin" : "Pin"}
          >
            <Pin size={16} className={meeting.is_pinned ? "fill-current" : ""} />
          </button>
          <button 
            onClick={() => duplicateMeeting.mutate(meeting.id)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={() => toggleArchive.mutate({ id: meeting.id, archiveStatus: !meeting.is_archived })}
            className="p-2 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={meeting.is_archived ? "Restore" : "Archive"}
          >
            <Archive size={16} />
          </button>
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to delete this meeting?')) {
                deleteMeeting.mutate(meeting.id);
              }
            }}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});

MeetingCard.displayName = 'MeetingCard';
export default MeetingCard;
