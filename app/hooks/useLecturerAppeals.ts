import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLecturerAppeals,
  getLecturerAppealsStats,
  getAppealById,
  resolveAppeal,
} from '../lib/api/appeals';
import type {
  LecturerAppeal,
  GetLecturerAppealsParams,
  LecturerAppealsStats,
  ResolveAppealDto,
  BackendAppealStatus,
  AppealStatus,
} from '../lib/api/types';
import { getLtiUserId } from '../lib/lti-session';

const DEV_LECTURER_ID = '5a205d7f-7084-4f91-ba7c-aeb0b6078256';

export interface ProcessedLecturerAppeal extends LecturerAppeal {
  studentName: string;
  studentEmail: string;
  studentInitials: string;
  courseName: string;
  assignmentName: string;
  gradeDisplay: string;
  formattedDate: string;
  uiStatus: 'pending' | 'resolved' | 'accepted' | 'rejected';
}

function mapStatusToUi(status: AppealStatus | BackendAppealStatus | string): 'pending' | 'resolved' | 'accepted' | 'rejected' {
  switch (status) {
    case 'ACCEPTED':
      return 'accepted';
    case 'REJECTED':
      return 'rejected';
    case 'RESOLVED':
      return 'resolved';
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
    case 'IN_REVIEW':
    case 'PENDING':
    default:
      return 'pending';
  }
}

function formatDate(dateStr?: string | null, isEn: boolean = true): string {
  if (!dateStr) return '';
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

function getInitials(name: string): string {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function useLecturerAppeals(
  params: GetLecturerAppealsParams = {},
  isEn: boolean = true
) {
  const lecturerId = getLtiUserId(import.meta.env.VITE_LECTURER_ID || DEV_LECTURER_ID);

  return useQuery({
    queryKey: ['lecturerAppeals', lecturerId, params, isEn],
    queryFn: async (): Promise<ProcessedLecturerAppeal[]> => {
      const data = await getLecturerAppeals(lecturerId, params);

      return data.map((appeal) => {
        const studentName =
          appeal.student?.user?.name ||
          appeal.student?.user?.email?.split('@')[0] ||
          (isEn ? 'Student' : 'סטודנט');
        const studentEmail = appeal.student?.user?.email || '';
        const studentInitials = getInitials(studentName);

        const courseName =
          appeal.submission?.assignment?.course?.name ||
          (isEn ? 'General Course' : 'קורס כללי');
        const assignmentName =
          appeal.submission?.assignment?.name ||
          (isEn ? 'Assignment' : 'מטלה');

        const score = appeal.evaluation?.score;
        const maxScore = appeal.evaluation?.maxScore || 100;
        const gradeDisplay = score !== undefined && score !== null ? `${score}/${maxScore}` : `-/${maxScore}`;

        const dateToFormat = appeal.resolvedAt || appeal.createdAt || appeal.submission?.submittedAt;
        const formattedDate = formatDate(dateToFormat, isEn);
        const uiStatus = mapStatusToUi(appeal.status);

        return {
          ...appeal,
          studentName,
          studentEmail,
          studentInitials,
          courseName,
          assignmentName,
          gradeDisplay,
          formattedDate,
          uiStatus,
        };
      });
    },
    enabled: Boolean(lecturerId),
  });
}

export function useLecturerAppealsStats() {
  const lecturerId = getLtiUserId(import.meta.env.VITE_LECTURER_ID || DEV_LECTURER_ID);

  return useQuery({
    queryKey: ['lecturerAppealsStats', lecturerId],
    queryFn: async (): Promise<LecturerAppealsStats> => {
      return getLecturerAppealsStats(lecturerId);
    },
    enabled: Boolean(lecturerId),
  });
}

export function useAppealDetail(appealId?: string, isEn: boolean = true) {
  return useQuery({
    queryKey: ['appealDetail', appealId, isEn],
    queryFn: async (): Promise<ProcessedLecturerAppeal> => {
      if (!appealId) throw new Error('Appeal ID is required');
      const appeal = await getAppealById(appealId);

      const studentName =
        appeal.student?.user?.name ||
        appeal.student?.user?.email?.split('@')[0] ||
        (isEn ? 'Student' : 'סטודנט');
      const studentEmail = appeal.student?.user?.email || '';
      const studentInitials = getInitials(studentName);

      const courseName =
        appeal.submission?.assignment?.course?.name ||
        (isEn ? 'General Course' : 'קורס כללי');
      const assignmentName =
        appeal.submission?.assignment?.name ||
        (isEn ? 'Assignment' : 'מטלה');

      const score = appeal.evaluation?.score;
      const maxScore = appeal.evaluation?.maxScore || 100;
      const gradeDisplay = score !== undefined && score !== null ? `${score}/${maxScore}` : `-/${maxScore}`;

      const dateToFormat = appeal.resolvedAt || appeal.createdAt || appeal.submission?.submittedAt;
      const formattedDate = formatDate(dateToFormat, isEn);
      const uiStatus = mapStatusToUi(appeal.status);

      return {
        ...appeal,
        studentName,
        studentEmail,
        studentInitials,
        courseName,
        assignmentName,
        gradeDisplay,
        formattedDate,
        uiStatus,
      };
    },
    enabled: Boolean(appealId),
  });
}

export function useResolveAppeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appealId,
      data,
    }: {
      appealId: string;
      data: ResolveAppealDto;
    }) => {
      return resolveAppeal(appealId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lecturerAppeals'] });
      queryClient.invalidateQueries({ queryKey: ['lecturerAppealsStats'] });
      queryClient.invalidateQueries({ queryKey: ['appealDetail', variables.appealId] });
      queryClient.invalidateQueries({ queryKey: ['studentAppeals'] });
    },
  });
}
