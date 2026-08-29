import { apiClient } from './client';

export type RealtimeTicket = {
  ticket: string;
  expiresInMs: number;
};

export function createRealtimeTicket(): Promise<RealtimeTicket> {
  return apiClient.post<RealtimeTicket>('/realtime/ticket');
}
