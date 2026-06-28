'use client';
import { useState } from 'react';
import { useGenerateWorkflow } from '@/hooks/useKnowledge';
import { Check, Copy, FileCode2, Loader2, MessageSquare, Mail, Kanban } from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkflowGeneratorProps {
  meetingId: string;
}

export function WorkflowGenerator({ meetingId }: WorkflowGeneratorProps) {
  const [activeType, setActiveType] = useState<'slack' | 'email' | 'jira'>('slack');
  const [copied, setCopied] = useState(false);
  const { mutate, data, isPending, isError } = useGenerateWorkflow();

  const handleGenerate = () => {
    mutate({ meetingId, type: activeType });
  };

  const handleCopy = () => {
    if (data?.content) {
      navigator.clipboard.writeText(data.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs = [
    { id: 'slack', label: 'Slack Update', icon: MessageSquare },
    { id: 'email', label: 'Stakeholder Email', icon: Mail },
    { id: 'jira', label: 'Jira Ticket', icon: Kanban },
  ] as const;

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[500px] shadow-2xl">
      {/* Header Tabs */}
      <div className="flex items-center gap-1 bg-[#020617] p-2 border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-[#0F172A] text-purple-400 border border-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 relative flex flex-col">
        {!data && !isPending && !isError && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 border border-purple-500/20">
              <FileCode2 size={32} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">Generate {tabs.find(t => t.id === activeType)?.label}</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Use our AI to automatically format this meeting&apos;s intelligence, tasks, and deadlines into a rich, copy-pasteable markdown payload.
            </p>
            <button 
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all"
            >
              Generate Now
            </button>
          </div>
        )}

        {isPending && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <Loader2 className="animate-spin text-purple-500 mb-4" size={32} />
            <p className="text-slate-400 animate-pulse">Generating workflow via AI...</p>
          </div>
        )}

        {isError && (
          <div className="flex-1 flex items-center justify-center text-rose-400">
            Failed to generate workflow. Please try again.
          </div>
        )}

        {data && !isPending && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Generation Complete
              </span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors border border-slate-700"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-y-auto font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed custom-scrollbar">
              {data.content}
            </div>
            <button 
              onClick={handleGenerate}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700"
            >
              Regenerate
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
