import { useQuery } from '@tanstack/react-query';
import { getStudentCourses, getCourseAssignments } from '../lib/api/courses';
import type { Course, Assignment } from '../lib/api/types';
import type { CourseAccent } from '../components/CourseCard';

export interface EnrichedStudentCourse extends Course {
  code: string;
  displayTitle: string;
  instructorName: string;
  instructorId?: string;
  assignmentsCount: number;
  activeAssignments: number;
  accent: CourseAccent;
}

export const COURSE_ACCENTS: CourseAccent[] = [
  { bg: 'bg-teal-50', text: 'text-teal-700', groupHoverBg: 'group-hover:bg-teal-600', borderHover: 'hover:border-teal-300' },
  { bg: 'bg-blue-50', text: 'text-blue-700', groupHoverBg: 'group-hover:bg-blue-600', borderHover: 'hover:border-blue-300' },
  { bg: 'bg-purple-50', text: 'text-purple-700', groupHoverBg: 'group-hover:bg-purple-600', borderHover: 'hover:border-purple-300' },
  { bg: 'bg-emerald-50', text: 'text-emerald-700', groupHoverBg: 'group-hover:bg-emerald-600', borderHover: 'hover:border-emerald-300' },
  { bg: 'bg-indigo-50', text: 'text-indigo-700', groupHoverBg: 'group-hover:bg-indigo-600', borderHover: 'hover:border-indigo-300' },
  { bg: 'bg-amber-50', text: 'text-amber-700', groupHoverBg: 'group-hover:bg-amber-600', borderHover: 'hover:border-amber-300' },
];

function extractCourseCode(courseName: string, index: number): { code: string; displayTitle: string } {
  const match = courseName.match(/^([A-Za-z0-9\-_]+):\s*(.+)$/);
  if (match) {
    return { code: match[1], displayTitle: match[2] };
  }
  return { code: `CS${100 + (index + 1) * 10}`, displayTitle: courseName };
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

function getInstructorId(course: Course): string | undefined {
  if (!course.lecturers || course.lecturers.length === 0) {
    return undefined;
  }
  const first = course.lecturers[0];
  return first.lecturer?.userId || first.lecturerId || first.lecturer?.user?.id;
}

export function useStudentCourses() {
  const studentId = import.meta.env.VITE_STUDENT_ID;

  return useQuery({
    queryKey: ['studentCourses', studentId],
    queryFn: async (): Promise<EnrichedStudentCourse[]> => {
      if (!studentId) {
        throw new Error('VITE_STUDENT_ID is not configured in environment variables');
      }

      // 1. Fetch all courses for the enrolled student
      const rawCourses = await getStudentCourses(studentId);

      // 2. Fetch assignments for each course in parallel to get live counts
      const enrichedCourses = await Promise.all(
        rawCourses.map(async (course, idx) => {
          let assignments: Assignment[] = [];
          try {
            assignments = await getCourseAssignments(course.id);
          } catch {
            assignments = [];
          }

          const { code, displayTitle } = extractCourseCode(course.name, idx);
          const instructorName = getInstructorNames(course);
          const instructorId = getInstructorId(course);
          const activeAssignments = assignments.filter(
            (a) => a.status === 'PUBLISHED'
          ).length;

          const accent = COURSE_ACCENTS[idx % COURSE_ACCENTS.length];

          return {
            ...course,
            code,
            displayTitle,
            instructorName,
            instructorId,
            assignmentsCount: assignments.length,
            activeAssignments,
            accent,
          };
        })
      );

      return enrichedCourses;
    },
  });
}
