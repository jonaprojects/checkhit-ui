import { apiClient } from './client';
import type { Notification } from './types';
import { getLtiSession } from '../lti-session';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export interface GetNotificationsParams {
  unreadOnly?: boolean;
  limit?: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export interface MarkAllReadResponse {
  success: boolean;
  updatedCount: number;
}

export function getNotificationStreamUrl(userId: string): string {
  const url = new URL(
    `/api/users/${encodeURIComponent(userId)}/notifications/stream`,
    SERVER_URL
  );
  const { ltik } = getLtiSession();
  if (ltik) url.searchParams.set('ltik', ltik);
  return url.toString();
}

/**
 * Fetch notifications for a user (student or lecturer).
 */
export async function getUserNotifications(
  userId: string,
  params?: GetNotificationsParams
): Promise<Notification[]> {
  const queryParams = new URLSearchParams();
  if (params?.unreadOnly !== undefined) {
    queryParams.append('unreadOnly', String(params.unreadOnly));
  }
  if (params?.limit !== undefined) {
    queryParams.append('limit', String(params.limit));
  }

  const queryString = queryParams.toString();
  const endpoint = `/users/${userId}/notifications${queryString ? `?${queryString}` : ''}`;
  return apiClient.get<Notification[]>(endpoint);
}

/**
 * Get count of unread notifications for a user.
 */
export async function getUnreadNotificationCount(
  userId: string
): Promise<UnreadCountResponse> {
  return apiClient.get<UnreadCountResponse>(`/users/${userId}/notifications/unread-count`);
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  return apiClient.patch<Notification>(`/notifications/${notificationId}/read`);
}

/**
 * Mark all notifications for a user as read.
 */
export async function markAllNotificationsAsRead(
  userId: string
): Promise<MarkAllReadResponse> {
  return apiClient.patch<MarkAllReadResponse>(`/users/${userId}/notifications/read-all`);
}
