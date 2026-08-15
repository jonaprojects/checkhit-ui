import { useQuery } from '@tanstack/react-query';
import { getLecturer, getStudent } from '../lib/api/users';
import type { User } from '../lib/api/types';

export type CurrentUserView = 'lecturer' | 'student';

export function useCurrentUser(view: CurrentUserView) {
  const userId =
    view === 'lecturer'
      ? import.meta.env.VITE_LECTURER_ID
      : import.meta.env.VITE_STUDENT_ID;

  return useQuery<User>({
    queryKey: ['currentUser', view, userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is not configured in environment variables');
      }

      const profile =
        view === 'lecturer'
          ? await getLecturer(userId)
          : await getStudent(userId);

      return profile.user;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 10,
  });
}
