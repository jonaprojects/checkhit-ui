import { useQuery } from '@tanstack/react-query';
import { getLecturerDashboard } from '../lib/api/dashboard';
import type { LecturerDashboardData } from '../lib/api/types';
import { getLtiUserId } from '../lib/lti-session';

const DEV_LECTURER_ID = '5a205d7f-7084-4f91-ba7c-aeb0b6078256';

export function useLecturerDashboard(customLecturerId?: string) {
  const lecturerId = customLecturerId || getLtiUserId(
    import.meta.env.VITE_LECTURER_ID || DEV_LECTURER_ID
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
    refetchOnWindowFocus: true,
  });
}
