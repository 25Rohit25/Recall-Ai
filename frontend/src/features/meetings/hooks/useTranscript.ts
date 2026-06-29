/**
 * Why it exists: React Query hook to interface with the Transcript Service.
 * Why this implementation is scalable: Caches the massive transcript array so we don't re-download 2MB of text on every tab switch.
 */
import { useQuery } from '@tanstack/react-query';
import { transcriptService } from '../services/transcriptService';

export const transcriptKeys = {
  all: ['transcripts'] as const,
  detail: (meetingId: string) => [...transcriptKeys.all, meetingId] as const,
  search: (meetingId: string, query: string) => [...transcriptKeys.detail(meetingId), 'search', query] as const,
};

export const useTranscript = (meetingId: string) => {
  return useQuery({
    queryKey: transcriptKeys.detail(meetingId),
    queryFn: () => transcriptService.getTranscript(meetingId),
    enabled: !!meetingId, // Only fetch if we have an ID
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useTranscriptSearch = (meetingId: string, query: string) => {
  return useQuery({
    queryKey: transcriptKeys.search(meetingId, query),
    queryFn: () => transcriptService.searchTranscript(meetingId, query),
    enabled: !!meetingId && query.length >= 2, // Debounce happens before calling this
  });
};
