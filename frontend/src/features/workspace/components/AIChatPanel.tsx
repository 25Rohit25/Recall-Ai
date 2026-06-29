/**
 * Why it exists: A premium native Chat interface acting as the user's personal RAG assistant for the meeting.
 * Why this architecture is scalable: The state is locally encapsulated in the hook. The chat bubbles use a distinct UI, distinguishing user queries from the AI.
 */
import React, { useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';

export const AIChatPanel = ({ meetingId }: { meetingId: string }) => {
  const { messages, isTyping, sendMessage } = useAIChat(meetingId);
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const suggestedPrompts = [
    "What decisions were made?",
    "Summarize engineering discussion.",
    "Who owns authentication?",
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        <Bot className="w-5 h-5 text-blue-500 mr-2" />
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Ask FireNotes AI</h2>
          <p className="text-xs text-gray-500">Ask questions about this meeting transcript</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">No questions asked yet</h3>
              <p className="text-xs text-gray-500 max-w-[200px] mb-4">Try one of these to get started:</p>
              <div className="flex flex-col space-y-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs text-left px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-md transition-colors text-gray-700 dark:text-gray-300"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white ml-3' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white mr-3'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
                
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex flex-row max-w-[85%]">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mr-3 flex items-center justify-center shadow-sm">
                  <Bot size={14} />
               </div>
               <div className="px-4 py-4 rounded-2xl rounded-tl-none bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center space-x-1">
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Ask about this meeting..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-full transition-colors"
          >
            <Send size={14} className={isTyping ? "opacity-50" : ""} />
          </button>
        </form>
      </div>

    </div>
  );
};
