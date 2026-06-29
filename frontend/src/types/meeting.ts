/**
 * Why it exists: Typescript interfaces that exactly map to our Backend Pydantic Schemas.
 * Why this implementation is scalable: Centralizes type definitions. Any API schema change only needs to be updated here, reflecting across the entire frontend.
 */

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  duration: number; // in seconds
  meeting_date: string; // ISO format string
  meeting_type: string;
  is_pinned: boolean;
  is_archived: boolean;
  transcript_status: 'pending' | 'processing' | 'completed' | 'failed';
  summary_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface PaginatedMeetingResponse {
  items: Meeting[];
  total: number;
  page: number;
  size: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface MeetingFilterParams {
  page?: number;
  size?: number;
  search?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  status_filter?: string;
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  duration: number;
  meeting_date: string;
  meeting_type?: string;
}

export interface UpdateMeetingPayload {
  title?: string;
  description?: string;
  duration?: number;
  meeting_date?: string;
  meeting_type?: string;
}
