import { useQuery } from '@tanstack/react-query';
import { getAllStudentAssignments } from '../lib/api/courses';
import type { StudentAssignment, StudentTaskStatus } from '../lib/api/types';
import type { AssignmentStatus as UiAssignmentStatus } from '../components/ui/StatusBadge';

export interface ProcessedStudentAssignment extends StudentAssignment {
  uiStatus: UiAssignmentStatus;
  courseName: string;
  grade?: number;
  formattedDueDate: string;
  isOverdue: boolean;
}

function mapStatusToUi(status: StudentTaskStatus): UiAssignmentStatus {
  switch (status) {
    case 'GRADED':
    case 'COMPLETED':
      return 'checked';
    case 'SUBMITTED':
    case 'EVALUATING':
      return 'checking';
    case 'APPEAL':
      return 'appeal';
    case 'NOT_STARTED':
    case 'DRAFT':
    case 'OVERDUE':
    default:
      return 'pending';
  }
}

function formatDueDate(dueAt?: string | null, isEn: boolean = true): { formatted: string; isOverdue: boolean } {
  if (!dueAt) {
    return { formatted: isEn ? 'No deadline' : 'ללא מועד הגשה', isOverdue: false };
  }

  const date = new Date(dueAt);
  const now = new Date();
  const isOverdue = now > date;

  try {
    const formatted = new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return { formatted, isOverdue };
  } catch {
    return { formatted: date.toLocaleDateString(), isOverdue };
  }
}

export function useStudentAssignments(isEn: boolean = true) {
  const studentId = import.meta.env.VITE_STUDENT_ID;

  return useQuery({
    queryKey: ['studentAssignments', studentId],
    queryFn: async (): Promise<ProcessedStudentAssignment[]> => {
      if (!studentId) {
        throw new Error('VITE_STUDENT_ID is not configured in environment variables');
      }

      const assignments = await getAllStudentAssignments(studentId);

      return assignments.map((assignment) => {
        const uiStatus = mapStatusToUi(assignment.studentStatus);
        const grade = assignment.submission?.evaluation?.score;
        const courseName = assignment.course?.name || '';
        const { formatted, isOverdue } = formatDueDate(assignment.dueAt, isEn);

        return {
          ...assignment,
          uiStatus,
          courseName,
          grade,
          formattedDueDate: formatted,
          isOverdue,
        };
      });
    },
    enabled: Boolean(studentId),
  });
}
