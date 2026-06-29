/**
 * Why it exists: Typescript interfaces that exactly map to our Backend Transcript Schemas.
 * Why this implementation is scalable: Centralizes type definitions. Any API schema change only needs to be updated here.
 */

export interface Speaker {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface TranscriptSegment {
  id: string;
  meeting_id: string;
  speaker_id: string | null;
  transcript_text: string;
  start_time: number;
  end_time: number;
  word_count: number;
  confidence_score: number;
  sequence_number: number;
  language: string;
  speaker: Speaker | null;
}

export interface TranscriptSearchResponse {
  matches: TranscriptSegment[];
  total_matches: number;
}
