import { useQuery } from '@tanstack/react-query';
import { getStudentAppeals } from '../lib/api/appeals';
import type { Appeal, BackendAppealStatus, GetStudentAppealsParams } from '../lib/api/types';
import type { AppealStatus } from '../components/ui/StatusBadge';

export interface ProcessedStudentAppeal extends Appeal {
  uiStatus: AppealStatus;
  assignmentId: string;
  assignmentTitle: string;
  courseName: string;
  originalGrade: number | null;
  newGrade: number | null;
  formattedDate: string;
}

function mapAppealStatus(status: BackendAppealStatus): AppealStatus {
  switch (status) {
    case 'ACCEPTED':
      return 'accepted';
    case 'REJECTED':
      return 'rejected';
    case 'RESOLVED':
      return 'resolved';
    case 'SUBMITTED':
    case 'IN_REVIEW':
    case 'PENDING':
    default:
      return 'pending';
  }
}

function formatDate(dateStr: string, isEn: boolean): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function useStudentAppeals(
  optionsOrIsEn: boolean | GetStudentAppealsParams = {},
  isEnParam: boolean = true
) {
  const studentId = import.meta.env.VITE_STUDENT_ID;
  const isBooleanArg = typeof optionsOrIsEn === 'boolean';
  const isEn = isBooleanArg ? optionsOrIsEn : isEnParam;
  const params: GetStudentAppealsParams = isBooleanArg ? {} : optionsOrIsEn;

  return useQuery({
    queryKey: ['studentAppeals', studentId, params],
    queryFn: async (): Promise<ProcessedStudentAppeal[]> => {
      if (!studentId) {
        throw new Error('VITE_STUDENT_ID is not configured in environment variables');
      }

      const appeals = await getStudentAppeals(studentId, params);

      return appeals.map((appeal) => {
        const uiStatus = mapAppealStatus(appeal.status);
        const assignment = appeal.submission?.assignment;
        const assignmentId = assignment?.id || appeal.submissionId;
        const assignmentTitle = assignment?.name || (isEn ? 'Assignment Appeal' : 'ערעור על מטלה');
        const courseName = assignment?.course?.name || '';
        const originalGrade = appeal.evaluation?.score ?? null;
        
        // If resolution or evaluation updated the grade
        let newGrade: number | null = null;
        if (uiStatus === 'accepted' && appeal.evaluation?.score !== undefined) {
          newGrade = appeal.evaluation.score;
        }

        const formattedDate = formatDate(appeal.createdAt, isEn);

        return {
          ...appeal,
          uiStatus,
          assignmentId,
          assignmentTitle,
          courseName,
          originalGrade,
          newGrade,
          formattedDate,
        };
      });
    },
    enabled: Boolean(studentId),
  });
}
