/**
 * Why it exists: Abstracts all API calls into a clean Service class for Transcript endpoints.
 * Why this implementation is scalable: Separates data fetching from UI components, providing a strong contract for React Query hooks.
 */
import { apiClient } from '@/lib/axios';
import { TranscriptSegment, TranscriptSearchResponse } from '@/types/transcript';

export const transcriptService = {
  getTranscript: async (meetingId: string): Promise<TranscriptSegment[]> => {
    const { data } = await apiClient.get<TranscriptSegment[]>(`/meetings/${meetingId}/transcript`);
    return data;
  },

  searchTranscript: async (meetingId: string, query: string): Promise<TranscriptSearchResponse> => {
    const { data } = await apiClient.get<TranscriptSearchResponse>(`/meetings/${meetingId}/transcript/search`, {
      params: { q: query }
    });
    return data;
  },
  
  getSpeakerSegments: async (meetingId: string, speakerId: string): Promise<TranscriptSegment[]> => {
    const { data } = await apiClient.get<TranscriptSegment[]>(`/meetings/${meetingId}/transcript/speaker/${speakerId}`);
    return data;
  }
};
