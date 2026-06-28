'use client';
import { useUiStore } from '@/store/useUiStore';
import { MeetingDetailResponse, ActionItem } from '@/hooks/useMeetings';
import { CheckCircle2, MessageSquare, ListTodo, FileText, Activity, Send } from 'lucide-react';
import { useState } from 'react';

export function IntelligencePanel({ meeting }: { meeting: MeetingDetailResponse }) {
  const activeSidebarView = useUiStore((state) => state.activeSidebarView);
  const setActiveSidebarView = useUiStore((state) => state.setActiveSidebarView);
  const intel = meeting.intelligence;
  const [copilotInput, setCopilotInput] = useState('');

  const suggestedPrompts = [
    "What are the deadlines?",
    "Summarize the risks",
    "List the decisions made"
  ];

  return (
    <aside className="w-80 flex-shrink-0 border-l border-workspace-border bg-workspace-800/80 backdrop-blur-md flex flex-col h-full z-20 shadow-2xl">
      {/* Tabs */}
      <div className="flex p-2 gap-1 border-b border-workspace-border bg-workspace-900/50">
        <TabButton 
          active={activeSidebarView === 'overview'} 
          onClick={() => setActiveSidebarView('overview')}
          icon={<FileText size={16} />}
          label="Overview"
        />
        <TabButton 
          active={activeSidebarView === 'tasks'} 
          onClick={() => setActiveSidebarView('tasks')}
          icon={<ListTodo size={16} />}
          label="Tasks"
        />
        <TabButton 
          active={activeSidebarView === 'copilot'} 
          onClick={() => setActiveSidebarView('copilot')}
          icon={<MessageSquare size={16} />}
          label="Ask AI"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {activeSidebarView === 'overview' && intel && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity size={16} className="text-ai-purple" />
                Health Score
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-ai-purple to-ai-pink bg-clip-text text-transparent">{intel.health_score}</span>
                <span className="text-sm text-slate-500">/ 100</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-workspace-border bg-workspace-800/30 hover:shadow-lg hover:border-slate-500 transition-all duration-200">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{intel.overview}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Decisions</h3>
              <ul className="space-y-2">
                {intel.decisions.map((decision, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Risks Identified</h3>
              <ul className="space-y-2">
                {intel.risks.map((risk, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeSidebarView === 'tasks' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {meeting.action_items.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
            {meeting.action_items.length === 0 && (
              <div className="text-sm text-slate-500 text-center py-8">No action items detected.</div>
            )}
          </div>
        )}

        {activeSidebarView === 'copilot' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
              <div className="p-3 rounded-full bg-gradient-to-r from-ai-purple/20 to-ai-pink/20 mb-4 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <MessageSquare size={32} className="text-ai-purple" />
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Ask questions about the meeting. Copilot will synthesize answers based on the transcript and intelligence payload.
              </p>
              
              <div className="w-full space-y-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => setCopilotInput(prompt)}
                    className="w-full text-left px-4 py-2.5 rounded-lg bg-workspace-800 hover:bg-workspace-700/80 border border-workspace-border hover:border-ai-purple/50 text-sm text-slate-300 transition-all hover:shadow-lg hover:shadow-ai-purple/10"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 relative">
              <input 
                type="text" 
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="Ask Copilot..." 
                className="w-full bg-workspace-900 border border-workspace-border rounded-lg px-4 py-3 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-ai-purple focus:border-ai-purple transition-all placeholder:text-slate-600"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white bg-gradient-to-r from-ai-purple to-ai-pink shadow-lg shadow-ai-purple/20 hover:opacity-90 transition-opacity">
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${
        active 
          ? 'bg-slate-800 text-slate-200 shadow-sm' 
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function TaskItem({ task }: { task: ActionItem }) {
  const [completed, setCompleted] = useState(task.status === 'completed');
  
  return (
    <div 
      className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex gap-3 ${
        completed 
          ? 'bg-workspace-900/50 border-workspace-border/50 opacity-60' 
          : 'bg-workspace-800/50 border-workspace-border hover:bg-workspace-800 hover:shadow-lg hover:border-slate-500'
      }`}
      onClick={() => setCompleted(!completed)}
    >
      <CheckCircle2 
        size={18} 
        className={`flex-shrink-0 mt-0.5 transition-colors ${completed ? 'text-green-500' : 'text-slate-600'}`} 
      />
      <div>
        <p className={`text-sm transition-all ${completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
          {task.task}
        </p>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
          {task.owner}
        </p>
      </div>
    </div>
  );
}
