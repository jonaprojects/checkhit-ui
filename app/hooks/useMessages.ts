import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMessages,
  getMessageDetail,
  createMessage,
  createReply,
  markMessageRead,
  archiveMessage,
  deleteMessage,
  getUnreadMessageCount,
} from '../lib/api/messages';
import type {
  GetMessagesParams,
  CreateMessageDto,
  MessageItem,
  MessagesListResponse,
} from '../lib/api/types';
import { UserContextUnavailableError, shouldRetryUserQuery } from '../lib/query-errors';

/**
 * Format relative time or localized date for message item display.
 */
export function formatMessageTime(dateStr: string, isEn: boolean = true): { time: string; date: string } {
  try {
    const dateObj = new Date(dateStr);
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = dateObj.toDateString() === yesterday.toDateString();

    const timeStr = dateObj.toLocaleTimeString(isEn ? 'en-US' : 'he-IL', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let dateLabel = '';
    if (isToday) {
      dateLabel = isEn ? 'Today' : 'היום';
    } else if (isYesterday) {
      dateLabel = isEn ? 'Yesterday' : 'אתמול';
    } else {
      dateLabel = dateObj.toLocaleDateString(isEn ? 'en-US' : 'he-IL', {
        month: 'short',
        day: 'numeric',
      });
    }

    return {
      time: timeStr,
      date: dateLabel,
    };
  } catch {
    return { time: '', date: dateStr };
  }
}

/**
 * Hook to fetch paginated messages list with filters.
 */
export function useMessages(userId?: string, params?: Partial<GetMessagesParams>) {
  return useQuery<MessagesListResponse>({
    queryKey: ['messages', userId, params],
    queryFn: async () => {
      if (!userId) {
        throw new UserContextUnavailableError();
      }
      return getMessages({ userId, ...params });
    },
    retry: shouldRetryUserQuery,
    staleTime: 15000,
  });
}

/**
 * Hook to fetch full message details and threaded replies.
 */
export function useMessageDetail(messageId?: string | null, userId?: string) {
  return useQuery<MessageItem | null>({
    queryKey: ['message', messageId, userId],
    queryFn: async () => {
      if (!messageId) return null;
      return getMessageDetail(messageId, userId);
    },
    enabled: Boolean(messageId),
    staleTime: 15000,
  });
}

/**
 * Hook to send a new message or broadcast announcement.
 */
export function useSendMessage(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateMessageDto) => {
      return createMessage({
        ...dto,
        senderId: dto.senderId || userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount', userId] });
      }
    },
  });
}

/**
 * Hook to post a reply in a message thread.
 */
export function useSendReply(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      if (!userId) throw new Error('User ID is required to reply');
      return createReply(messageId, { senderId: userId, content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['message', variables.messageId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

/**
 * Hook to mark a message as read.
 */
export function useMarkMessageAsRead(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, isRead = true }: { messageId: string; isRead?: boolean }) => {
      if (!userId) throw new Error('User ID is required');
      return markMessageRead(messageId, userId, isRead);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message', variables.messageId] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount', userId] });
      }
    },
  });
}

/**
 * Hook to archive or unarchive a message.
 */
export function useArchiveMessage(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, isArchived = true }: { messageId: string; isArchived?: boolean }) => {
      if (!userId) throw new Error('User ID is required');
      return archiveMessage(messageId, userId, isArchived);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

/**
 * Hook to soft-delete a message from the user's view.
 */
export function useDeleteMessage(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!userId) throw new Error('User ID is required');
      return deleteMessage(messageId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['unreadMessagesCount', userId] });
      }
    },
  });
}

/**
 * Hook for navbar unread messages count.
 */
export function useUnreadMessageCount(userId?: string) {
  return useQuery<number>({
    queryKey: ['unreadMessagesCount', userId],
    queryFn: async () => {
      if (!userId) return 0;
      const res = await getUnreadMessageCount(userId);
      return res.unreadCount;
    },
    enabled: Boolean(userId),
    refetchInterval: 30000,
  });
}
