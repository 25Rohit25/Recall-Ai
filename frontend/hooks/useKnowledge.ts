import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://recall-ai-9vki.onrender.com/api/v1';

export interface TeamAnalytics {
  user_name: string;
  total_meetings: number;
  average_talk_time_seconds: number;
  total_questions_asked: number;
  global_tasks_completed_percentage: number;
  tasks_summary: {
    total: number;
    completed: number;
  };
  open_decisions: Array<{
    id: number;
    description: string;
    lifecycle_history: Array<{
      status: string;
      timestamp: string;
      actor?: string;
      detail?: string;
    }>;
  }>;
}

export interface CompareMeetingMetrics {
  id: string;
  title: string;
  participation: number;
  risks: number;
  tasks: number;
  health: number;
}

export interface DeltaMetric {
  value_a: number;
  value_b: number;
  delta: number;
  percentage: number;
}

export interface CompareResponse {
  meeting_a: CompareMeetingMetrics;
  meeting_b: CompareMeetingMetrics;
  comparison: {
    participation: DeltaMetric;
    risks: DeltaMetric;
    tasks: DeltaMetric;
    health: DeltaMetric;
  };
}

export interface RecommendationsResponse {
  meeting_id: string;
  recommendations: string[];
}

export interface KnowledgeEntityTimeline {
  entity: {
    id: number;
    name: string;
    type: string;
  };
  meetings: Array<{
    meeting_id: string;
    meeting_title: string;
    date: string;
    decisions: string[];
    risks: string[];
    action_items: Array<{
      task: string;
      owner: string;
      status: string;
    }>;
  }>;
}

export interface WorkflowGenerationResult {
  meeting_id: string;
  workflow_type: string;
  content: string;
}

async function fetchTeamAnalytics(userName: string): Promise<TeamAnalytics> {
  const res = await fetch(`${API_BASE}/analytics/team/${encodeURIComponent(userName)}`);
  if (!res.ok) throw new Error('Failed to fetch team analytics');
  return res.json();
}

async function fetchKnowledgeEntity(entityName: string): Promise<KnowledgeEntityTimeline> {
  const res = await fetch(`${API_BASE}/knowledge/${encodeURIComponent(entityName)}`);
  if (!res.ok) throw new Error('Failed to fetch knowledge entity');
  return res.json();
}

async function generateWorkflowRequest(meetingId: string, type: string): Promise<WorkflowGenerationResult> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/generate-workflow?type=${encodeURIComponent(type)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Failed to generate workflow');
  return res.json();
}

async function fetchCompareMeetings(meetingA: string, meetingB: string): Promise<CompareResponse> {
  const res = await fetch(`${API_BASE}/analytics/compare?meeting_a=${meetingA}&meeting_b=${meetingB}`);
  if (!res.ok) throw new Error('Failed to fetch meeting comparison');
  return res.json();
}

async function generateRecommendationsRequest(meetingId: string): Promise<RecommendationsResponse> {
  const res = await fetch(`${API_BASE}/meetings/${meetingId}/generate-recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to generate recommendations');
  return res.json();
}

export function useTeamAnalytics(userName: string) {
  return useQuery({
    queryKey: ['teamAnalytics', userName],
    queryFn: () => fetchTeamAnalytics(userName),
    enabled: !!userName,
  });
}

export function useKnowledgeEntity(entityName: string) {
  return useQuery({
    queryKey: ['knowledgeEntity', entityName],
    queryFn: () => fetchKnowledgeEntity(entityName),
    enabled: !!entityName,
  });
}

export function useGenerateWorkflow() {
  return useMutation({
    mutationFn: ({ meetingId, type }: { meetingId: string; type: string }) => generateWorkflowRequest(meetingId, type),
  });
}

export function useCompareMeetings(meetingA: string, meetingB: string) {
  return useQuery({
    queryKey: ['compareMeetings', meetingA, meetingB],
    queryFn: () => fetchCompareMeetings(meetingA, meetingB),
    enabled: !!meetingA && !!meetingB,
  });
}

export function useGenerateRecommendations() {
  return useMutation({
    mutationFn: (meetingId: string) => generateRecommendationsRequest(meetingId),
  });
}
