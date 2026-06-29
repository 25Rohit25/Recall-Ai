/**
 * Why it exists: Provides export functionality (Markdown/TXT) for the AI Workspace.
 */
import React, { useState } from 'react';
import { Download, FileText, FileDown, CheckCircle } from 'lucide-react';
import { useSummary, useActionItems } from '../hooks/useWorkspace';

export const ExportMenu = ({ meetingId }: { meetingId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { data: summary } = useSummary(meetingId);
  const { data: actionItems } = useActionItems(meetingId);

  const handleExport = async (format: 'markdown' | 'txt') => {
    setIsExporting(true);
    setIsOpen(false);
    
    // Fake generation time
    await new Promise(res => setTimeout(res, 1000));
    
    let content = '';
    
    if (format === 'markdown') {
      content += `# Meeting Summary\n\n${summary?.executive_summary || 'No summary available.'}\n\n`;
      content += `## Action Items\n\n`;
      if (actionItems) {
        actionItems.forEach(item => {
          content += `- [${item.is_completed ? 'x' : ' '}] ${item.description} (Owner: ${item.owner_name || 'Unassigned'})\n`;
        });
      }
    } else {
      content += `MEETING SUMMARY\n\n${summary?.executive_summary || 'No summary available.'}\n\n`;
      content += `ACTION ITEMS\n\n`;
      if (actionItems) {
        actionItems.forEach(item => {
          content += `[${item.is_completed ? 'X' : ' '}] ${item.description} - ${item.owner_name || 'Unassigned'}\n`;
        });
      }
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Meeting_Export.${format === 'markdown' ? 'md' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 shadow-sm transition-colors"
      >
        {isExporting ? <CheckCircle size={16} className="mr-2 text-green-500" /> : <Download size={16} className="mr-2" />}
        Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <button 
            onClick={() => handleExport('markdown')}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800"
          >
            <FileDown size={16} className="mr-3 text-blue-500" />
            Markdown (.md)
          </button>
          <button 
            onClick={() => handleExport('txt')}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300"
          >
            <FileText size={16} className="mr-3 text-gray-500" />
            Plain Text (.txt)
          </button>
        </div>
      )}
    </div>
  );
};
