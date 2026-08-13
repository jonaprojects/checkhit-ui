import { useQuery } from '@tanstack/react-query';
import { getCourseById, getCourseAssignments } from '../lib/api/courses';
import type { Course, Assignment } from '../lib/api/types';

export interface EnrichedLecturerCourseDetail extends Course {
  code: string;
  displayTitle: string;
}

export interface EnrichedCourseAssignment extends Assignment {
  formattedDueDate: string;
  isOverdue: boolean;
}

function extractCourseCode(courseName: string): { code: string; displayTitle: string } {
  const match = courseName.match(/^([A-Za-z0-9\-_]+):\s*(.+)$/);
  if (match) {
    return { code: match[1], displayTitle: match[2] };
  }
  return { code: 'CS', displayTitle: courseName };
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

export function useLecturerCourse(courseId?: string, isEn: boolean = true) {
  return useQuery({
    queryKey: ['lecturerCourse', courseId, isEn],
    queryFn: async () => {
      if (!courseId) {
        throw new Error('Course ID is missing');
      }

      // Fetch course details & assignments in parallel
      const [courseData, assignmentsData] = await Promise.all([
        getCourseById(courseId),
        getCourseAssignments(courseId).catch(() => [] as Assignment[]),
      ]);

      const { code, displayTitle } = extractCourseCode(courseData.name);

      const enrichedAssignments: EnrichedCourseAssignment[] = (assignmentsData || []).map((assignment) => {
        const { formatted, isOverdue } = formatDueDate(assignment.dueAt, isEn);
        return {
          ...assignment,
          formattedDueDate: formatted,
          isOverdue,
        };
      });

      const enrichedCourse: EnrichedLecturerCourseDetail = {
        ...courseData,
        code,
        displayTitle,
      };

      return {
        course: enrichedCourse,
        assignments: enrichedAssignments,
      };
    },
    enabled: Boolean(courseId),
  });
}
