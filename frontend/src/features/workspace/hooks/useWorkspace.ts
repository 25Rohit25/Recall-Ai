/**
 * Why it exists: React Query hooks for the AI Workspace.
 * Why this architecture is scalable: Uses optimistic UI updates for action item toggles. The UI responds instantly, and only reverts if the backend request fails.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceService, ActionItem } from '../services/workspaceService';

export const workspaceKeys = {
  all: ['workspace'] as const,
  summary: (meetingId: string) => [...workspaceKeys.all, meetingId, 'summary'] as const,
  actionItems: (meetingId: string) => [...workspaceKeys.all, meetingId, 'actionItems'] as const,
};

export const useSummary = (meetingId: string) => {
  return useQuery({
    queryKey: workspaceKeys.summary(meetingId),
    queryFn: () => workspaceService.getSummary(meetingId),
    enabled: !!meetingId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useRegenerateSummary = (meetingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => workspaceService.regenerateSummary(meetingId),
    onSuccess: (newSummary) => {
      queryClient.setQueryData(workspaceKeys.summary(meetingId), newSummary);
    }
  });
};

export const useActionItems = (meetingId: string) => {
  return useQuery({
    queryKey: workspaceKeys.actionItems(meetingId),
    queryFn: () => workspaceService.getActionItems(meetingId),
    enabled: !!meetingId,
  });
};

export const useUpdateActionItem = (meetingId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, updates }: { itemId: string, updates: Partial<ActionItem> }) => 
      workspaceService.updateActionItem(meetingId, itemId, updates),
    
    // Optimistic Update
    onMutate: async ({ itemId, updates }) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.actionItems(meetingId) });
      const previousItems = queryClient.getQueryData<ActionItem[]>(workspaceKeys.actionItems(meetingId));
      
      if (previousItems) {
        queryClient.setQueryData<ActionItem[]>(
          workspaceKeys.actionItems(meetingId),
          previousItems.map(item => item.id === itemId ? { ...item, ...updates } : item)
        );
      }
      return { previousItems };
    },
    
    onError: (err, newTodo, context) => {
      // Revert if failed
      if (context?.previousItems) {
        queryClient.setQueryData(workspaceKeys.actionItems(meetingId), context.previousItems);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.actionItems(meetingId) });
    },
  });
};
