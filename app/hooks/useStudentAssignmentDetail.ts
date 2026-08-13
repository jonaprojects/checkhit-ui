import { useQuery } from '@tanstack/react-query';
import { getStudentAssignmentDetail } from '../lib/api/assignments';
import type {
  StudentAssignmentDetailResponse,
  SubmissionFile,
  AssignmentEvaluation,
  AssignmentAppeal,
  StudentAssignmentStatus,
} from '../lib/api/types';

export interface ProcessedSubmissionFile extends SubmissionFile {
  formattedSize: string;
}

export interface ProcessedStudentAssignmentDetail extends Omit<StudentAssignmentDetailResponse, 'submission'> {
  formattedDueDate: string;
  isOverdue: boolean;
  formattedStartDate?: string | null;
  submission: {
    id: string;
    attemptNumber: number;
    status: 'DRAFT' | 'SUBMITTED';
    submittedAt: string | null;
    formattedSubmittedAt?: string | null;
    files: ProcessedSubmissionFile[];
    evaluation: (AssignmentEvaluation & {
      formattedEvaluatedAt?: string | null;
      percentage?: number | null;
    }) | null;
  } | null;
  appeal: (AssignmentAppeal & {
    formattedCreatedAt?: string;
    formattedResolvedAt?: string | null;
  }) | null;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatDate(dateStr?: string | null, isEn: boolean = true): string | null {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function useStudentAssignmentDetail(assignmentId?: string, isEn: boolean = true) {
  const studentId = import.meta.env.VITE_STUDENT_ID;

  return useQuery({
    queryKey: ['studentAssignmentDetail', assignmentId, studentId, isEn],
    queryFn: async (): Promise<ProcessedStudentAssignmentDetail> => {
      if (!assignmentId) {
        throw new Error('Assignment ID is required');
      }

      const data = await getStudentAssignmentDetail(assignmentId, studentId);

      const isOverdue = data.dueAt ? new Date() > new Date(data.dueAt) : false;
      const formattedDueDate = formatDate(data.dueAt, isEn) || (isEn ? 'No deadline' : 'ללא מועד הגשה');
      const formattedStartDate = formatDate(data.startAt, isEn);

      let processedSubmission: ProcessedStudentAssignmentDetail['submission'] = null;
      if (data.submission) {
        const processedFiles: ProcessedSubmissionFile[] = (data.submission.files || []).map((file) => ({
          ...file,
          formattedSize: formatBytes(file.sizeBytes || file.fileSize),
        }));

        let processedEvaluation = null;
        if (data.submission.evaluation) {
          const evalScore = data.submission.evaluation.score;
          const evalMaxScore = data.submission.evaluation.maxScore || data.maxScore || 100;
          const percentage = evalScore !== null && evalScore !== undefined ? Math.round((evalScore / evalMaxScore) * 100) : null;

          processedEvaluation = {
            ...data.submission.evaluation,
            percentage,
            formattedEvaluatedAt: formatDate(data.submission.evaluation.evaluatedAt, isEn),
          };
        }

        processedSubmission = {
          ...data.submission,
          files: processedFiles,
          formattedSubmittedAt: formatDate(data.submission.submittedAt, isEn),
          evaluation: processedEvaluation,
        };
      }

      let processedAppeal = null;
      if (data.appeal) {
        processedAppeal = {
          ...data.appeal,
          formattedCreatedAt: formatDate(data.appeal.createdAt, isEn) || '',
          formattedResolvedAt: formatDate(data.appeal.resolvedAt, isEn),
        };
      }

      return {
        ...data,
        formattedDueDate,
        isOverdue,
        formattedStartDate,
        submission: processedSubmission,
        appeal: processedAppeal,
      };
    },
    enabled: Boolean(assignmentId),
  });
}
