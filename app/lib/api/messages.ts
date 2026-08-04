import { apiClient } from './client';
import type {
  MessageItem,
  MessageReply,
  GetMessagesParams,
  MessagesListResponse,
  CreateMessageDto,
  CreateReplyDto,
  UnreadMessagesCountResponse,
} from './types';

/**
 * Fetch a paginated list of messages with filters (inbox/sent/archive, targetType, search, courseId).
 */
export async function getMessages(params: GetMessagesParams = {}): Promise<MessagesListResponse> {
  const query = new URLSearchParams();

  if (params.userId) query.append('userId', params.userId);
  if (params.folder) query.append('folder', params.folder);
  if (params.targetType && params.targetType !== 'ALL') query.append('targetType', params.targetType);
  if (params.courseId) query.append('courseId', params.courseId);
  if (params.search) query.append('search', params.search);
  if (params.page) query.append('page', String(params.page));
  if (params.limit) query.append('limit', String(params.limit));

  const queryString = query.toString();
  const endpoint = `/messages${queryString ? `?${queryString}` : ''}`;

  return apiClient.get<MessagesListResponse>(endpoint, {
    headers: params.userId ? { 'x-user-id': params.userId } : {},
  });
}

/**
 * Fetch full message details including threaded replies.
 */
export async function getMessageDetail(id: string, userId?: string): Promise<MessageItem> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return apiClient.get<MessageItem>(`/messages/${id}${query}`, {
    headers: userId ? { 'x-user-id': userId } : {},
  });
}

/**
 * Create and send a new message or broadcast announcement.
 */
export async function createMessage(data: CreateMessageDto): Promise<MessageItem> {
  return apiClient.post<MessageItem>('/messages', data, {
    headers: data.senderId ? { 'x-user-id': data.senderId } : {},
  });
}

/**
 * Send a reply to an existing message thread.
 */
export async function createReply(messageId: string, data: CreateReplyDto): Promise<MessageReply> {
  return apiClient.post<MessageReply>(`/messages/${messageId}/replies`, data, {
    headers: data.senderId ? { 'x-user-id': data.senderId } : {},
  });
}

/**
 * Mark a message as read or unread for the current user.
 */
export async function markMessageRead(
  messageId: string,
  userId: string,
  isRead: boolean = true
): Promise<{ success: boolean; messageId: string; isRead: boolean; readAt?: string | null }> {
  return apiClient.patch(`/messages/${messageId}/read`, {
    userId,
    isRead,
  }, {
    headers: { 'x-user-id': userId },
  });
}

/**
 * Archive or unarchive a message for the current user.
 */
export async function archiveMessage(
  messageId: string,
  userId: string,
  isArchived: boolean = true
): Promise<{ success: boolean; messageId: string; isArchived: boolean }> {
  return apiClient.patch(`/messages/${messageId}/archive`, {
    userId,
    isArchived,
  }, {
    headers: { 'x-user-id': userId },
  });
}

/**
 * Soft-delete a message from the current user's mailbox.
 */
export async function deleteMessage(
  messageId: string,
  userId: string
): Promise<{ success: boolean; message?: string }> {
  return apiClient.delete(`/messages/${messageId}`, {
    body: JSON.stringify({ userId }),
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
  });
}

/**
 * Get total unread message count for navbar badges.
 */
export async function getUnreadMessageCount(userId: string): Promise<UnreadMessagesCountResponse> {
  const query = `?userId=${encodeURIComponent(userId)}`;
  return apiClient.get<UnreadMessagesCountResponse>(`/messages/unread-count${query}`, {
    headers: { 'x-user-id': userId },
  });
}
