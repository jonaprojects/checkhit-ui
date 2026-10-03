import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAppeal, type CreateAppealInput } from '../lib/api/appeals';

export function useCreateAppeal(assignmentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppealInput) => createAppeal(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['studentAssignmentDetail', assignmentId] }),
        queryClient.invalidateQueries({ queryKey: ['studentAssignments'] }),
        queryClient.invalidateQueries({ queryKey: ['studentAppeals'] }),
        queryClient.invalidateQueries({ queryKey: ['studentDashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['notifications'] }),
        queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] }),
      ]);
    },
  });
}
