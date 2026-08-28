import { useQuery } from '@tanstack/react-query';
import { getStudentGrades } from '../lib/api/courses';
import type { StudentAssignment } from '../lib/api/types';
import { getLtiUserId } from '../lib/lti-session';
import { StudentContextUnavailableError, shouldRetryStudentQuery } from '../lib/query-errors';

export interface ProcessedStudentGrade extends StudentAssignment {
  assignmentTitle: string;
  courseName: string;
  score: number;
  maxScore: number;
  formattedDate: string;
  feedback?: string | null;
}

function formatDate(dateStr?: string | null, isEn: boolean = true): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'he-IL', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function useStudentGrades(limit: number = 4, isEn: boolean = true) {
  const studentId = getLtiUserId(import.meta.env.VITE_STUDENT_ID);

  return useQuery({
    queryKey: ['studentGrades', studentId, limit],
    queryFn: async (): Promise<ProcessedStudentGrade[]> => {
      if (!studentId) {
        throw new StudentContextUnavailableError();
      }

      const grades = await getStudentGrades(studentId, { limit });

      return grades.map((item) => {
        const evaluation = item.submission?.evaluation;
        if (evaluation?.score == null) {
          throw new Error('A graded assignment is missing its evaluation score');
        }

        const score = evaluation.score;
        const maxScore = evaluation.maxScore ?? item.maxScore;
        const courseName = item.course?.name || '';
        const gradedDate = item.submission?.submittedAt || item.updatedAt;
        const formattedDate = formatDate(gradedDate, isEn);

        return {
          ...item,
          assignmentTitle: item.name,
          courseName,
          score,
          maxScore,
          formattedDate,
          feedback: evaluation?.feedback,
        };
      });
    },
    retry: shouldRetryStudentQuery,
  });
}
