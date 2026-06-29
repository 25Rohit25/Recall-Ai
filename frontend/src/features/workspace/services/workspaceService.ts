/**
 * Why it exists: Abstracts workspace API calls into a clean service.
 */
import { apiClient } from '@/lib/axios';

export interface ActionItem {
  id: string;
  meeting_id: string;
  description: string;
  owner_name: string | null;
  priority: string;
  is_completed: boolean;
}

export interface MeetingSummary {
  id: string;
  meeting_id: string;
  executive_summary: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata_json?: any;
}

export const workspaceService = {
  getSummary: async (meetingId: string): Promise<MeetingSummary> => {
    const { data } = await apiClient.get<MeetingSummary>(`/meetings/${meetingId}/workspace/summary`);
    return data;
  },

  regenerateSummary: async (meetingId: string): Promise<MeetingSummary> => {
    const { data } = await apiClient.post<MeetingSummary>(`/meetings/${meetingId}/workspace/summary/regenerate`);
    return data;
  },

  getActionItems: async (meetingId: string): Promise<ActionItem[]> => {
    const { data } = await apiClient.get<ActionItem[]>(`/meetings/${meetingId}/workspace/action-items`);
    return data;
  },

  updateActionItem: async (meetingId: string, itemId: string, updates: Partial<ActionItem>): Promise<ActionItem> => {
    const { data } = await apiClient.patch<ActionItem>(`/meetings/${meetingId}/workspace/action-items/${itemId}`, updates);
    return data;
  },

  sendMessage: async (meetingId: string, message: string): Promise<ChatMessage> => {
    const { data } = await apiClient.post<ChatMessage>(`/meetings/${meetingId}/workspace/chat`, { message });
    return data;
  }
};
