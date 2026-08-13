import { useQuery } from '@tanstack/react-query';
import { getCourseById, getStudentCourseAssignments } from '../lib/api/courses';
import type { Course, StudentAssignment, StudentTaskStatus } from '../lib/api/types';

export interface ProcessedStudentAssignment extends StudentAssignment {
  uiStatus: 'pending' | 'checking' | 'checked' | 'appeal';
  grade?: number;
  formattedDueDate: string;
  isOverdue: boolean;
}

export interface EnrichedCourseDetail extends Course {
  code: string;
  displayTitle: string;
  instructors: string;
}

function extractCourseCode(courseName: string): { code: string; displayTitle: string } {
  const match = courseName.match(/^([A-Za-z0-9\-_]+):\s*(.+)$/);
  if (match) {
    return { code: match[1], displayTitle: match[2] };
  }
  return { code: 'CS', displayTitle: courseName };
}

function getInstructorNames(course: Course): string {
  if (!course.lecturers || course.lecturers.length === 0) {
    return '';
  }
  return course.lecturers
    .map((cl) => cl.lecturer?.user?.name || '')
    .filter(Boolean)
    .join(', ');
}

function mapStatusToUi(status: StudentTaskStatus): 'pending' | 'checking' | 'checked' | 'appeal' {
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

export function useStudentCourse(courseId?: string, isEn: boolean = true) {
  const studentId = import.meta.env.VITE_STUDENT_ID;

  return useQuery({
    queryKey: ['studentCourse', courseId, studentId],
    queryFn: async () => {
      if (!courseId) {
        throw new Error('Course ID is missing');
      }
      if (!studentId) {
        throw new Error('VITE_STUDENT_ID is not configured in environment variables');
      }

      // Fetch course details & assignments in parallel
      const [courseData, assignmentsData] = await Promise.all([
        getCourseById(courseId),
        getStudentCourseAssignments(studentId, courseId),
      ]);

      const { code, displayTitle } = extractCourseCode(courseData.name);
      const instructors = getInstructorNames(courseData);

      const enrichedCourse: EnrichedCourseDetail = {
        ...courseData,
        code,
        displayTitle,
        instructors,
      };

      const processedAssignments: ProcessedStudentAssignment[] = assignmentsData.map(
        (assignment) => {
          const uiStatus = mapStatusToUi(assignment.studentStatus);
          const grade = assignment.submission?.evaluation?.score;
          const { formatted, isOverdue } = formatDueDate(assignment.dueAt, isEn);

          return {
            ...assignment,
            uiStatus,
            grade,
            formattedDueDate: formatted,
            isOverdue,
          };
        }
      );

      return {
        course: enrichedCourse,
        assignments: processedAssignments,
      };
    },
    enabled: Boolean(courseId && studentId),
  });
}
