import { apiClient } from '@/lib/axios';

export interface SearchResult {
  id: string;
  type: string;
  title?: string;
  text?: string;
  description?: string;
  meeting_id?: string;
}

export interface GlobalSearchResponse {
  meetings: SearchResult[];
  transcripts: SearchResult[];
  action_items: SearchResult[];
  decisions: SearchResult[];
}

export const searchService = {
  globalSearch: async (query: string): Promise<GlobalSearchResponse> => {
    const { data } = await apiClient.get<GlobalSearchResponse>('/search', { params: { q: query } });
    return data;
  },
  
  getRecentSearches: async (): Promise<string[]> => {
    const { data } = await apiClient.get<{ queries: string[] }>('/search/recent');
    return data.queries;
  }
};
