import { useQuery } from '@tanstack/react-query';
import { getLecturerCourses, getCourseAssignments } from '../lib/api/courses';
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
        throw new Error('Lecturer ID is unavailable');
      }

      // 1. Fetch all courses managed by the lecturer
      const rawCourses = await getLecturerCourses(lecturerId);

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
            pendingAppeals: 0,
            accent,
          };
        })
      );

      return enrichedCourses;
    },
  });
}
