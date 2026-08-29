import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createRealtimeTicket } from '../lib/api/realtime';
import type { EvaluationStatus } from '../lib/api/types';
import { getLtiSession } from '../lib/lti-session';
import type { ProcessedStudentAssignmentDetail } from './useStudentAssignmentDetail';

type EvaluationStatusEvent = {
  type: 'evaluation.status_changed';
  evaluationId: string;
  submissionId: string;
  assignmentId: string;
  courseId: string;
  status: EvaluationStatus;
  score: number | null;
  maxScore: number;
  occurredAt: string;
};

const MIN_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;

function isEvaluationStatusEvent(value: unknown): value is EvaluationStatusEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Partial<EvaluationStatusEvent>;
  return (
    event.type === 'evaluation.status_changed' &&
    typeof event.evaluationId === 'string' &&
    typeof event.assignmentId === 'string' &&
    typeof event.status === 'string'
  );
}

function getWebSocketUrl(ticket: string): string {
  const serverUrl = new URL(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');
  serverUrl.protocol = serverUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  serverUrl.pathname = '/api/realtime/ws';
  serverUrl.search = new URLSearchParams({ ticket }).toString();
  return serverUrl.toString();
}

export function useEvaluationRealtime(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!getLtiSession().ltik) return;

    let stopped = false;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectDelay = MIN_RECONNECT_DELAY_MS;

    const refreshEvaluationQueries = (event?: EvaluationStatusEvent) => {
      if (event) {
        queryClient.setQueriesData<ProcessedStudentAssignmentDetail>(
          { queryKey: ['studentAssignmentDetail', event.assignmentId] },
          (current) => {
            if (!current?.submission || current.submission.id !== event.submissionId) {
              return current;
            }

            const existingEvaluation = current.submission.evaluation;
            const isCompleted = event.status === 'COMPLETED';
            return {
              ...current,
              studentStatus: isCompleted ? 'GRADED' : 'SUBMITTED',
              submission: {
                ...current.submission,
                evaluation: {
                  id: event.evaluationId,
                  score: event.score,
                  maxScore: event.maxScore,
                  feedback: existingEvaluation?.feedback ?? null,
                  status: event.status,
                  isFinal: isCompleted,
                  evaluatedAt: isCompleted ? event.occurredAt : null,
                  formattedEvaluatedAt: isCompleted
                    ? existingEvaluation?.formattedEvaluatedAt
                    : null,
                  percentage:
                    event.score === null
                      ? null
                      : Math.round((event.score / event.maxScore) * 100),
                },
              },
            };
          }
        );

        void queryClient.invalidateQueries({
          queryKey: ['evaluationDetail', event.evaluationId],
        });
        void queryClient.invalidateQueries({
          queryKey: ['studentAssignmentDetail', event.assignmentId],
        });
        void queryClient.invalidateQueries({
          queryKey: ['lecturerAssignmentOverview', event.assignmentId],
        });
      } else {
        void queryClient.invalidateQueries({ queryKey: ['studentAssignmentDetail'] });
        void queryClient.invalidateQueries({ queryKey: ['evaluationDetail'] });
      }

      void queryClient.invalidateQueries({ queryKey: ['studentAssignments'] });
      void queryClient.invalidateQueries({ queryKey: ['studentCourse'] });
      void queryClient.invalidateQueries({ queryKey: ['studentGrades'] });
      void queryClient.invalidateQueries({ queryKey: ['lecturerDashboard'] });
    };

    const scheduleReconnect = () => {
      if (stopped || reconnectTimer) return;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        void connect();
      }, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY_MS);
    };

    const connect = async () => {
      try {
        const { ticket } = await createRealtimeTicket();
        if (stopped) return;

        socket = new WebSocket(getWebSocketUrl(ticket));
        socket.onopen = () => {
          reconnectDelay = MIN_RECONNECT_DELAY_MS;
          refreshEvaluationQueries();
        };
        socket.onmessage = (message) => {
          try {
            const event: unknown = JSON.parse(String(message.data));
            if (isEvaluationStatusEvent(event)) refreshEvaluationQueries(event);
          } catch {
            // Ignore malformed messages and keep the realtime connection alive.
          }
        };
        socket.onclose = scheduleReconnect;
        socket.onerror = () => socket?.close();
      } catch {
        scheduleReconnect();
      }
    };

    void connect();

    return () => {
      stopped = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [queryClient]);
}
