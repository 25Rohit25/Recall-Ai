/**
 * Why it exists: React Query hooks to interface with the Meeting Service.
 * Why this implementation is scalable: Handles caching, background refetching, and provides loading/error states out of the box. 
 * Optimistic Updates are implemented for Pin/Archive to give the user instantaneous feedback without waiting for network roundtrips.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingService } from '../services/meetingService';
import { MeetingFilterParams, CreateMeetingPayload, UpdateMeetingPayload, Meeting } from '@/types/meeting';
import { toast } from 'sonner';

// Query Keys
export const meetingKeys = {
  all: ['meetings'] as const,
  lists: () => [...meetingKeys.all, 'list'] as const,
  list: (filters: MeetingFilterParams) => [...meetingKeys.lists(), filters] as const,
  details: () => [...meetingKeys.all, 'detail'] as const,
  detail: (id: string) => [...meetingKeys.details(), id] as const,
};

export const useMeetings = (filters: MeetingFilterParams) => {
  return useQuery({
    queryKey: meetingKeys.list(filters),
    queryFn: () => meetingService.getMeetings(filters),
    placeholderData: (previousData) => previousData, // Keeps previous data on screen while fetching next page
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMeetingPayload) => meetingService.createMeeting(payload),
    onSuccess: () => {
      toast.success('Meeting created successfully');
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
    onError: () => toast.error('Failed to create meeting'),
  });
};

export const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => meetingService.deleteMeeting(id),
    onSuccess: () => {
      toast.success('Meeting deleted');
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
    onError: () => toast.error('Failed to delete meeting'),
  });
};

export const useTogglePinMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, pinStatus }: { id: string, pinStatus: boolean }) => 
      pinStatus ? meetingService.pinMeeting(id) : meetingService.unpinMeeting(id),
    
    // Optimistic Update
    onMutate: async ({ id, pinStatus }) => {
      await queryClient.cancelQueries({ queryKey: meetingKeys.lists() });
      
      const previousMeetings = queryClient.getQueryData(meetingKeys.lists());
      
      // Update the lists query in the cache
      queryClient.setQueriesData({ queryKey: meetingKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((m: Meeting) => m.id === id ? { ...m, is_pinned: pinStatus } : m)
        };
      });
      
      return { previousMeetings };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMeetings) {
        queryClient.setQueriesData({ queryKey: meetingKeys.lists() }, context.previousMeetings);
      }
      toast.error('Failed to update pin status');
    },
    onSettled: () => {
      // Always refetch to ensure server sync
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
  });
};

export const useToggleArchiveMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, archiveStatus }: { id: string, archiveStatus: boolean }) => 
      archiveStatus ? meetingService.archiveMeeting(id) : meetingService.restoreMeeting(id),
    onSuccess: (_, variables) => {
      toast.success(variables.archiveStatus ? 'Meeting archived' : 'Meeting restored');
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
    onError: () => toast.error('Action failed'),
  });
};

export const useDuplicateMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => meetingService.duplicateMeeting(id),
    onSuccess: () => {
      toast.success('Meeting duplicated');
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
    },
    onError: () => toast.error('Failed to duplicate meeting'),
  });
};
