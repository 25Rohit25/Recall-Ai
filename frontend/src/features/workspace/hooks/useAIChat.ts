/**
 * Why it exists: Manages the AI Chat state locally.
 * Why this architecture is scalable: In the future, this can easily be swapped to use `useSubscription` or SSE for streaming responses by appending chunks to `messages`.
 */
import { useState, useCallback } from 'react';
import { workspaceService, ChatMessage } from '../services/workspaceService';

export const useAIChat = (meetingId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await workspaceService.sendMessage(meetingId, content);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error("Failed to send message", error);
      // Could push a system error message here
    } finally {
      setIsTyping(false);
    }
  }, [meetingId]);

  return { messages, isTyping, sendMessage };
};
