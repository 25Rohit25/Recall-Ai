import { create } from 'zustand';
import { MeetingDetailResponse } from '@/hooks/useMeetings';

interface UiState {
  activeSidebarView: 'overview' | 'tasks' | 'copilot';
  isCommandPaletteOpen: boolean;
  currentTime: number;
  seekRequest: number | null;
  activeMeeting: MeetingDetailResponse | null;
  setActiveSidebarView: (view: 'overview' | 'tasks' | 'copilot') => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
  setCurrentTime: (time: number) => void;
  triggerSeek: (time: number) => void;
  clearSeekRequest: () => void;
  setActiveMeeting: (meeting: MeetingDetailResponse | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeSidebarView: 'overview',
  isCommandPaletteOpen: false,
  currentTime: 0,
  seekRequest: null,
  activeMeeting: null,
  setActiveSidebarView: (view) => set({ activeSidebarView: view }),
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  setCurrentTime: (time) => set({ currentTime: time }),
  triggerSeek: (time) => set({ seekRequest: time }),
  clearSeekRequest: () => set({ seekRequest: null }),
  setActiveMeeting: (meeting) => set({ activeMeeting: meeting }),
}));
