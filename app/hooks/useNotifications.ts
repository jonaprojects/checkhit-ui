import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type GetNotificationsParams,
} from '../lib/api/notifications';
import type { Notification, NotificationCategory } from '../lib/api/types';
import type { NotificationType } from '../components/ui/NotificationItem';

export interface ProcessedNotification extends Notification {
  uiType: NotificationType;
  formattedTime: string;
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
        return [];
      }
      const notifications = await getUserNotifications(userId, params);
      return notifications.map((n) => ({
        ...n,
        uiType: mapNotificationCategory(n.category),
        formattedTime: formatRelativeTime(n.createdAt, isEn),
      }));
    },
    enabled: Boolean(userId),
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
    refetchInterval: 30000, // Background poll every 30s
  });
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
