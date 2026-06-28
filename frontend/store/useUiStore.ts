import { create } from 'zustand';
import { MeetingDetailResponse } from '@/hooks/useMeetings';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  citationTimestamp?: number;
}

interface UiState {
  isCommandPaletteOpen: boolean;
  currentTime: number;
  seekRequest: number | null;
  activeMeeting: MeetingDetailResponse | null;
  aiChatHistory: ChatMessage[];
  activeCitation: number | null;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setCurrentTime: (time: number) => void;
  triggerSeek: (time: number) => void;
  triggerCitationSeek: (time: number) => void;
  clearSeekRequest: () => void;
  clearActiveCitation: () => void;
  setActiveMeeting: (meeting: MeetingDetailResponse | null) => void;
  addChatMessage: (msg: ChatMessage) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isCommandPaletteOpen: false,
  currentTime: 0,
  seekRequest: null,
  activeMeeting: null,
  aiChatHistory: [],
  activeCitation: null,
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setCurrentTime: (time) => set({ currentTime: time }),
  triggerSeek: (time) => set({ seekRequest: time }),
  triggerCitationSeek: (time) => set({ seekRequest: time, activeCitation: time }),
  clearSeekRequest: () => set({ seekRequest: null }),
  clearActiveCitation: () => set({ activeCitation: null }),
  setActiveMeeting: (meeting) => set({ activeMeeting: meeting }),
  addChatMessage: (msg) => set((state) => ({ aiChatHistory: [...state.aiChatHistory, msg] })),
}));
