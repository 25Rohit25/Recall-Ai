/**
 * Why it exists: Abstracts all API calls into a clean Service class.
 * Why this implementation is scalable: If the API endpoint changes, or we switch from Axios to Fetch, we only change it here. It provides a strongly typed contract for our React Query hooks.
 */
import { apiClient } from '@/lib/axios';
import { 
  Meeting, 
  PaginatedMeetingResponse, 
  MeetingFilterParams, 
  CreateMeetingPayload,
  UpdateMeetingPayload
} from '@/types/meeting';

export const meetingService = {
  getMeetings: async (params: MeetingFilterParams): Promise<PaginatedMeetingResponse> => {
    const { data } = await apiClient.get<PaginatedMeetingResponse>('/meetings', { params });
    return data;
  },

  getMeeting: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.get<Meeting>(`/meetings/${id}`);
    return data;
  },

  createMeeting: async (payload: CreateMeetingPayload): Promise<Meeting> => {
    const { data } = await apiClient.post<Meeting>('/meetings', payload);
    return data;
  },

  updateMeeting: async (id: string, payload: UpdateMeetingPayload): Promise<Meeting> => {
    const { data } = await apiClient.patch<Meeting>(`/meetings/${id}`, payload);
    return data;
  },

  deleteMeeting: async (id: string): Promise<void> => {
    await apiClient.delete(`/meetings/${id}`);
  },

  pinMeeting: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.post<Meeting>(`/meetings/${id}/pin`);
    return data;
  },

  unpinMeeting: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.post<Meeting>(`/meetings/${id}/unpin`);
    return data;
  },

  archiveMeeting: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.post<Meeting>(`/meetings/${id}/archive`);
    return data;
  },

  restoreMeeting: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.post<Meeting>(`/meetings/${id}/restore`);
    return data;
  },

  duplicateMeeting: async (id: string): Promise<Meeting> => {
    const { data } = await apiClient.post<Meeting>(`/meetings/${id}/duplicate`);
    return data;
  }
};
