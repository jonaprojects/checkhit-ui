import { useQuery } from '@tanstack/react-query';
import { getLecturerCourses, getCourseAssignments } from '../lib/api/courses';
import { getLecturerAppeals } from '../lib/api/appeals';
import type { Course, Assignment } from '../lib/api/types';
import type { CourseAccent } from '../components/CourseCard';
import { COURSE_ACCENTS } from './useStudentCourses';
import { getLtiUserId } from '../lib/lti-session';

export interface EnrichedLecturerCourse extends Course {
  code: string;
  displayTitle: string;
  assignmentsCount: number;
  activeAssignments: number;
  studentsCount: number;
  pendingAppeals: number;
  accent: CourseAccent;
}

export class LecturerContextUnavailableError extends Error {
  constructor() {
    super('Lecturer context is unavailable');
    this.name = 'LecturerContextUnavailableError';
  }
}

function extractCourseCode(courseName: string, index: number): { code: string; displayTitle: string } {
  const match = courseName.match(/^([A-Za-z0-9\-_]+):\s*(.+)$/);
  if (match) {
    return { code: match[1], displayTitle: match[2] };
  }
  return { code: `CS${100 + (index + 1) * 10}`, displayTitle: courseName };
}

export function useLecturerCourses() {
  const lecturerId = getLtiUserId(import.meta.env.VITE_LECTURER_ID);

  return useQuery({
    queryKey: ['lecturerCourses', lecturerId],
    queryFn: async (): Promise<EnrichedLecturerCourse[]> => {
      if (!lecturerId) {
        throw new LecturerContextUnavailableError();
      }

      // 1. Fetch all courses managed by the lecturer, plus their appeals for open counts
      const [rawCourses, appeals] = await Promise.all([
        getLecturerCourses(lecturerId),
        getLecturerAppeals(lecturerId),
      ]);
      const pendingAppealsByCourse = new Map<string, number>();
      for (const appeal of appeals) {
        if (appeal.status !== 'SUBMITTED' && appeal.status !== 'UNDER_REVIEW') continue;
        const courseId = appeal.submission?.assignment?.courseId;
        if (!courseId) continue;
        pendingAppealsByCourse.set(courseId, (pendingAppealsByCourse.get(courseId) ?? 0) + 1);
      }

      // 2. Fetch assignments for each course in parallel to get live assignment metrics
      const enrichedCourses = await Promise.all(
        rawCourses.map(async (course, idx) => {
          let assignments: Assignment[] = [];
          try {
            assignments = await getCourseAssignments(course.id);
          } catch {
            assignments = [];
          }

          const { code, displayTitle } = extractCourseCode(course.name, idx);
          const activeAssignments = assignments.filter(
            (a) => a.status === 'PUBLISHED'
          ).length;

          const accent = COURSE_ACCENTS[idx % COURSE_ACCENTS.length];

          return {
            ...course,
            code,
            displayTitle,
            assignmentsCount: assignments.length,
            activeAssignments,
            studentsCount: course.studentsCount ?? 0,
            pendingAppeals: pendingAppealsByCourse.get(course.id) ?? 0,
            accent,
          };
        })
      );

      return enrichedCourses;
    },
  });
}
