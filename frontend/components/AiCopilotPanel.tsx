'use client';
import { useState } from 'react';
import { useUiStore, ChatMessage } from '@/store/useUiStore';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function AiCopilotPanel({ className = '' }: { className?: string }) {
  const [input, setInput] = useState('');
  const chatHistory = useUiStore((state) => state.aiChatHistory);
  const addChatMessage = useUiStore((state) => state.addChatMessage);
  const triggerCitationSeek = useUiStore((state) => state.triggerCitationSeek);

  const suggestedPrompts = [
    "Summarize the key decisions",
    "What are the next steps?",
    "List the major risks discussed"
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    addChatMessage({ id: uuidv4(), role: 'user', content: text });
    setInput('');

    // Mock AI response
    setTimeout(() => {
      addChatMessage({
        id: uuidv4(),
        role: 'ai',
        content: `Based on the transcript, here is a synthesized answer regarding "${text}".`,
        citationTimestamp: 165 // Mock citation at 02:45
      });
    }, 1000);
  };

  return (
    <aside className={`flex flex-col h-full bg-[#0F172A] border-l border-slate-800 z-20 shadow-2xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-[#020617]/50 flex items-center gap-2">
        <Sparkles size={18} className="text-purple-500" />
        <h2 className="text-sm font-semibold text-slate-200">AI Copilot</h2>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 transition-all duration-300">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <MessageSquare size={32} className="text-purple-500" />
            </div>
            <p className="text-sm text-slate-400 mb-6">
              Ask questions about the meeting. Copilot will synthesize answers with direct citations.
            </p>
            <div className="w-full space-y-2">
              {suggestedPrompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-[#020617] hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-sm text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20 focus:outline-none"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm shadow-md shadow-purple-500/10' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-sm'
              }`}>
                {msg.content}
                {msg.citationTimestamp !== undefined && (
                  <button 
                    onClick={() => triggerCitationSeek(msg.citationTimestamp!)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 ml-2 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40 transition-colors text-xs font-mono border border-indigo-500/30"
                  >
                    [{Math.floor(msg.citationTimestamp / 60)}:{(Math.floor(msg.citationTimestamp % 60)).toString().padStart(2, '0')}]
                  </button>
                )}
              </div>
              {msg.role === 'ai' && (
                <div className="flex gap-2 mt-2 ml-1 text-slate-500">
                  <button className="hover:text-slate-300 transition-colors"><ThumbsUp size={14} /></button>
                  <button className="hover:text-slate-300 transition-colors"><ThumbsDown size={14} /></button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-[#020617]/50">
        <div className="relative">
          <input 
            id="copilot-input"
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask Copilot..." 
            className="w-full bg-[#020617] border border-slate-800 rounded-lg px-4 py-3 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-600"
          />
          <button 
            onClick={() => handleSend(input)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20 hover:opacity-90 hover:scale-105 transition-all focus:outline-none"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
