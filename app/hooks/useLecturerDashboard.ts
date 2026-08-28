import { useQuery } from '@tanstack/react-query';
import { getLecturerDashboard } from '../lib/api/dashboard';
import type { LecturerDashboardData } from '../lib/api/types';
import { getLtiUserId } from '../lib/lti-session';
import { isRetryableQueryError } from '../lib/query-errors';

export function useLecturerDashboard(customLecturerId?: string) {
  const lecturerId = customLecturerId || getLtiUserId(
    import.meta.env.VITE_LECTURER_ID
  );

  return useQuery<LecturerDashboardData>({
    queryKey: ['lecturerDashboard', lecturerId],
    queryFn: async () => {
      if (!lecturerId) {
        throw new Error('Lecturer ID is required to fetch dashboard data');
      }
      return getLecturerDashboard(lecturerId);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: (query) =>
      !query.state.error || isRetryableQueryError(query.state.error),
  });
}
