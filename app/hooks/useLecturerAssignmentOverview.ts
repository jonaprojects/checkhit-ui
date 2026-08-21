import { useQuery } from '@tanstack/react-query';
import { getLecturerAssignmentOverview } from '../lib/api/assignments';
import type {
  LecturerAssignmentOverviewResponse,
  LecturerAssignmentStudent,
  GetLecturerAssignmentOverviewParams,
} from '../lib/api/types';

export interface ProcessedLecturerStudent extends LecturerAssignmentStudent {
  formattedSubmittedAt: string;
  formattedEvaluatedAt: string;
  percentageScore: number | null;
}

export interface EnrichedLecturerAssignmentOverview extends Omit<LecturerAssignmentOverviewResponse, 'students'> {
  formattedDueDate: string;
  formattedStartDate: string | null;
  remainingTimeLabel: string;
  isOverdue: boolean;
  students: ProcessedLecturerStudent[];
}

function formatDate(dateStr?: string | null, isEn: boolean = true): string {
  if (!dateStr) return isEn ? 'No date' : 'ללא תאריך';
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

function calculateRemainingTime(
  dueAt: string | null | undefined,
  remainingHours: number | null | undefined,
  isEn: boolean
): { label: string; isOverdue: boolean } {
  if (!dueAt) {
    return { label: isEn ? 'No deadline' : 'ללא מועד הגשה', isOverdue: false };
  }

  const dueDate = new Date(dueAt);
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { label: isEn ? 'Ended' : 'הסתיים', isOverdue: true };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHoursInDay = hours % 24;

  if (days > 0) {
    const dayUnit = isEn ? (days === 1 ? 'day' : 'days') : (days === 1 ? 'יום' : 'ימים');
    return {
      label: isEn
        ? `${days} ${dayUnit} ${remainingHoursInDay}h`
        : `${days} ${dayUnit} ו-${remainingHoursInDay} שעות`,
      isOverdue: false,
    };
  }

  return {
    label: isEn ? `${hours}h remaining` : `${hours} שעות נותרו`,
    isOverdue: false,
  };
}

export function useLecturerAssignmentOverview(
  assignmentId?: string,
  params: GetLecturerAssignmentOverviewParams = {},
  isEn: boolean = true,
  ltik?: string
) {
  return useQuery({
    queryKey: ['lecturerAssignmentOverview', assignmentId, params.status, params.search, ltik, isEn],
    queryFn: async (): Promise<EnrichedLecturerAssignmentOverview> => {
      if (!assignmentId) {
        throw new Error('Assignment ID is required');
      }

      const rawData = await getLecturerAssignmentOverview(assignmentId, params, ltik);

      const { label: remainingTimeLabel, isOverdue } = calculateRemainingTime(
        rawData.dueAt,
        rawData.stats.remainingHours,
        isEn
      );

      const formattedDueDate = formatDate(rawData.dueAt, isEn);
      const formattedStartDate = rawData.startAt ? formatDate(rawData.startAt, isEn) : null;

      const processedStudents: ProcessedLecturerStudent[] = (rawData.students || []).map((item) => {
        const formattedSubmittedAt = item.submission?.submittedAt
          ? formatDate(item.submission.submittedAt, isEn)
          : isEn ? 'Not submitted' : 'טרם הוגש';

        const formattedEvaluatedAt = item.evaluation?.evaluatedAt
          ? formatDate(item.evaluation.evaluatedAt, isEn)
          : '—';

        let percentageScore: number | null = null;
        if (item.evaluation?.score != null) {
          const max = item.evaluation.maxScore || rawData.maxScore || 100;
          percentageScore = Math.round((item.evaluation.score / max) * 100);
        }

        return {
          ...item,
          formattedSubmittedAt,
          formattedEvaluatedAt,
          percentageScore,
        };
      });

      return {
        ...rawData,
        formattedDueDate,
        formattedStartDate,
        remainingTimeLabel,
        isOverdue,
        students: processedStudents,
      };
    },
    enabled: Boolean(assignmentId),
  });
}
