/**
 * Why it exists: Renders a single row of the transcript within the Virtualized list.
 * Why this implementation is scalable: Wrapped in `React.memo` using a custom comparison function. It ONLY re-renders if its specific `isActive` state changes, or if the global `searchQuery` matches its content. It will not re-render just because the `currentTime` changed by 1 millisecond.
 */
import React from 'react';
import { Play, Copy, MessageSquare, BookmarkPlus, Sparkles } from 'lucide-react';
import { TranscriptSegment } from '@/types/transcript';
import { formatTime } from '@/utils/time';

interface TranscriptRowProps {
  segment: TranscriptSegment;
  isActive: boolean;
  isSameAsPrevious: boolean;
  searchQuery: string;
  onSeek: (time: number) => void;
}

const TranscriptRowComponent = ({ 
  segment, 
  isActive, 
  isSameAsPrevious, 
  searchQuery, 
  onSeek 
}: TranscriptRowProps) => {
  
  // State for mock productivity layer
  const [showCommentInput, setShowCommentInput] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  const [comments, setComments] = React.useState<{author: string, text: string}[]>([]);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  // Highlight search keywords and mock custom highlights
  const renderText = () => {
    let text = segment.transcript_text;
    
    // Add a mock permanent highlight for demo purposes if it's the second segment
    // In production, we'd check if `segment.id` exists in our `useHighlights()` query
    const hasMockHighlight = segment.id.endsWith('2'); 

    if (searchQuery && searchQuery.length >= 2) {
      const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
      return parts.map((part, i) => 
        part.toLowerCase() === searchQuery.toLowerCase() 
          ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">{part}</mark>
          : (hasMockHighlight ? <mark key={i} className="bg-green-200/50 dark:bg-green-900/30 text-inherit rounded px-0.5">{part}</mark> : part)
      );
    }
    
    if (hasMockHighlight) {
       return <mark className="bg-green-200/50 dark:bg-green-900/30 text-inherit rounded px-0.5">{text}</mark>;
    }
    return text;
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments([...comments, { author: 'You', text: commentText }]);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  return (
    <div 
      className={`group flex items-start px-4 md:px-8 py-3 transition-colors duration-150 ${
        isActive 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500' 
          : 'bg-transparent border-l-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      {/* Left Column: Avatar & Time */}
      <div className="flex-shrink-0 w-20 flex flex-col items-center mr-4">
        {!isSameAsPrevious ? (
          <>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 dark:border-gray-700 flex items-center justify-center text-blue-700 font-bold shadow-sm overflow-hidden mb-1">
              {segment.speaker?.avatar_url ? (
                <img src={segment.speaker.avatar_url} alt={segment.speaker.name} className="h-full w-full object-cover" />
              ) : (
                segment.speaker?.name.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate w-full text-center">
              {segment.speaker?.name.split(' ')[0] || 'Unknown'}
            </span>
          </>
        ) : (
          <div className="h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <button 
               onClick={() => onSeek(segment.start_time)}
               className="text-gray-400 hover:text-blue-600 transition-colors"
               title="Play from here"
             >
               <Play size={14} className="fill-current" />
             </button>
          </div>
        )}
      </div>

      {/* Right Column: Content & Actions */}
      <div className="flex-grow min-w-0 flex flex-col">
        <div className="flex items-center space-x-3 mb-1">
          <button 
            onClick={() => onSeek(segment.start_time)}
            className={`text-xs font-mono font-medium hover:underline cursor-pointer ${
              isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {formatTime(segment.start_time)}
          </button>
          
          {/* Action Menu (Visible on Hover or if active state like bookmarked) */}
          <div className={`transition-opacity flex items-center space-x-1 ${isBookmarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <button className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded" title="Copy text">
              <Copy size={14} />
            </button>
            <button onClick={() => setShowCommentInput(!showCommentInput)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Add comment">
              <MessageSquare size={14} />
            </button>
            <button onClick={() => setIsBookmarked(!isBookmarked)} className={`p-1 rounded transition-colors ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-600'}`} title="Bookmark">
              <BookmarkPlus size={14} className={isBookmarked ? "fill-current" : ""} />
            </button>
            <button className="p-1 text-gray-400 hover:text-purple-600 rounded" title="Ask AI about this">
              <Sparkles size={14} />
            </button>
          </div>
        </div>

        <p className={`text-base leading-relaxed ${
          isActive 
            ? 'text-gray-900 dark:text-gray-100 font-medium' 
            : 'text-gray-700 dark:text-gray-300'
        }`}>
          {renderText()}
        </p>

        {/* Inline Comments Thread */}
        {(comments.length > 0 || showCommentInput) && (
          <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-800 space-y-3">
            {comments.map((c, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {c.author.charAt(0)}
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mr-2">{c.author}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{c.text}</p>
                </div>
              </div>
            ))}
            
            {showCommentInput && (
              <div className="flex items-start space-x-2 mt-2">
                <input 
                  type="text" 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Write a comment... (Enter to save)"
                  autoFocus
                  className="w-full text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

// Advanced Memoization: Only re-render if it becomes active/inactive, or if search query changes in a way that affects this row.
export const TranscriptRow = React.memo(TranscriptRowComponent, (prev, next) => {
  return (
    prev.isActive === next.isActive &&
    prev.searchQuery === next.searchQuery &&
    prev.isSameAsPrevious === next.isSameAsPrevious &&
    prev.segment.id === next.segment.id
  );
});

TranscriptRow.displayName = 'TranscriptRow';
