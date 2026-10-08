import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationStreamUrl,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type GetNotificationsParams,
} from '../lib/api/notifications';
import type { Notification, NotificationCategory } from '../lib/api/types';
import type { NotificationType } from '../components/ui/NotificationItem';
import {
  isRetryableQueryError,
  UserContextUnavailableError,
  shouldRetryUserQuery,
} from '../lib/query-errors';

export interface ProcessedNotification extends Notification {
  uiType: NotificationType;
  formattedTime: string;
}

export function getNotificationDestination(
  notification: Notification,
): string | null | undefined {
  const legacyMessageId = notification.link?.match(/^\/messages\/([^/?#]+)$/)?.[1];
  if (legacyMessageId) {
    const portal =
      typeof window !== 'undefined' && window.location.pathname.startsWith('/lecturer')
        ? 'lecturer'
        : 'student';
    return `/${portal}/messages?message=${legacyMessageId}`;
  }

  if (!notification.link?.startsWith('/student/appeals/')) {
    return notification.link;
  }

  const assignmentId = notification.metadata?.assignmentId;
  return typeof assignmentId === 'string'
    ? `/student/assignments/${assignmentId}`
    : '/student/appeals';
}

export function mapNotificationCategory(category: NotificationCategory): NotificationType {
  switch (category) {
    case 'ASSIGNMENT':
      return 'assignment';
    case 'GRADE':
      return 'success';
    case 'APPEAL':
      return 'appeal';
    case 'WARNING':
      return 'warning';
    case 'SYSTEM':
      return 'system';
    case 'INFO':
    default:
      return 'info';
  }
}

export function formatRelativeTime(dateStr: string, isEn: boolean = true): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return isEn ? 'Just now' : 'הרגע';
    }
    if (diffMins < 60) {
      return isEn ? `${diffMins} mins ago` : `לפני ${diffMins} דקות`;
    }
    if (diffHours < 24) {
      return isEn ? `${diffHours} hours ago` : `לפני ${diffHours} שעות`;
    }
    if (diffDays === 1) {
      return isEn ? 'Yesterday' : 'אתמול';
    }
    if (diffDays < 7) {
      return isEn ? `${diffDays} days ago` : `לפני ${diffDays} ימים`;
    }
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function useNotifications(
  userId?: string,
  params?: GetNotificationsParams,
  isEn: boolean = true
) {
  return useQuery({
    queryKey: ['notifications', userId, params],
    queryFn: async (): Promise<ProcessedNotification[]> => {
      if (!userId) {
        throw new UserContextUnavailableError();
      }
      const notifications = await getUserNotifications(userId, params);
      return notifications.map((n) => ({
        ...n,
        link: getNotificationDestination(n),
        uiType: mapNotificationCategory(n.category),
        formattedTime: formatRelativeTime(n.createdAt, isEn),
      }));
    },
    retry: shouldRetryUserQuery,
    staleTime: 30000,
  });
}

export function useUnreadNotificationCount(userId?: string) {
  return useQuery({
    queryKey: ['unreadNotificationsCount', userId],
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;
      const res = await getUnreadNotificationCount(userId);
      return res.unreadCount;
    },
    enabled: Boolean(userId),
    refetchInterval: (query) =>
      query.state.error && !isRetryableQueryError(query.state.error) ? false : 30000,
  });
}

export function useNotificationRealtime(userId?: string): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId || typeof EventSource === 'undefined') return;

    const eventSource = new EventSource(getNotificationStreamUrl(userId), {
      withCredentials: true,
    });

    const refreshNotifications = () => {
      void queryClient.invalidateQueries({
        queryKey: ['notifications', userId],
      });
      void queryClient.invalidateQueries({
        queryKey: ['unreadNotificationsCount', userId],
      });
    };

    const handleNotification = (event: Event) => {
      refreshNotifications();

      try {
        const notification = JSON.parse(
          (event as MessageEvent<string>).data,
        ) as Notification;
        if (notification.category !== 'APPEAL') return;

        const assignmentId = notification.metadata?.assignmentId;
        void queryClient.invalidateQueries({ queryKey: ['studentAppeals'] });
        void queryClient.invalidateQueries({ queryKey: ['studentAssignments'] });
        void queryClient.invalidateQueries({ queryKey: ['studentDashboard'] });
        void queryClient.invalidateQueries({
          queryKey:
            typeof assignmentId === 'string'
              ? ['studentAssignmentDetail', assignmentId]
              : ['studentAssignmentDetail'],
        });
      } catch {
        void queryClient.invalidateQueries({ queryKey: ['studentAppeals'] });
        void queryClient.invalidateQueries({
          queryKey: ['studentAssignmentDetail'],
        });
      }
    };

    eventSource.addEventListener('connected', refreshNotifications);
    eventSource.addEventListener('notification', handleNotification);
    eventSource.addEventListener('notification-read', refreshNotifications);
    eventSource.addEventListener('notifications-read-all', refreshNotifications);

    return () => eventSource.close();
  }, [queryClient, userId]);
}

export function useMarkNotificationAsRead(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount', userId] });
    },
  });
}

export function useMarkAllNotificationsAsRead(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('No user ID provided');
      return markAllNotificationsAsRead(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount', userId] });
    },
  });
}
