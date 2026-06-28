import { useQuery } from '@tanstack/react-query';

// --- Type Definitions ---
export type MeetingStatus = 'processing' | 'completed';

export interface Intelligence {
  overview: string;
  decisions: string[];
  risks: string[];
  topics: string[];
  deadlines: Array<{ task: string; date: string }>;
  health_score: number;
}

export interface TranscriptSegment {
  id: number;
  speaker: string;
  start_time: number;
  end_time: number;
  text: string;
}

export interface ActionItem {
  id: number;
  task: string;
  status: string;
  owner: string;
}

export interface MeetingListResponse {
  id: string;
  title: string;
  date: string;
  duration: number;
  status: MeetingStatus;
  health_score: number | null;
}

export interface MeetingDetailResponse {
  id: string;
  title: string;
  date: string;
  duration: number;
  media_url: string | null;
  status: MeetingStatus;
  intelligence: Intelligence | null;
  action_items: ActionItem[];
  transcript_segments: TranscriptSegment[];
}

// --- API Fetchers ---
const API_BASE = 'http://127.0.0.1:8000/api/v1';

async function fetchMeetings(): Promise<MeetingListResponse[]> {
  const res = await fetch(`${API_BASE}/meetings/`);
  if (!res.ok) throw new Error('Failed to fetch meetings');
  return res.json();
}

async function fetchMeetingDetail(id: string): Promise<MeetingDetailResponse> {
  const res = await fetch(`${API_BASE}/meetings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch meeting detail');
  return res.json();
}

// --- Custom Hooks ---
export function useMeetings() {
  return useQuery({
    queryKey: ['meetings'],
    queryFn: fetchMeetings,
  });
}

export function useMeetingDetail(id: string) {
  return useQuery({
    queryKey: ['meeting', id],
    queryFn: () => fetchMeetingDetail(id),
    enabled: !!id,
  });
}
