import { apiClient } from './client';
import type {
  Course,
  Assignment,
  StudentAssignment,
  GetStudentAssignmentsParams,
  GetStudentCoursesParams,
  UrgentCourse,
} from './types';

/**
 * Fetch all courses where the specified student is enrolled.
 */
export async function getStudentCourses(
  studentId: string,
  params: GetStudentCoursesParams = {}
): Promise<Course[]> {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', String(params.limit));
  if (params.sortBy) query.append('sortBy', params.sortBy);

  const queryString = query.toString();
  return apiClient.get<Course[]>(
    `/students/${studentId}/courses${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Fetch enrolled courses prioritized by urgency (upcoming unsubmitted assignments first).
 */
export async function getStudentUrgentCourses(
  studentId: string,
  params: { limit?: number } = {}
): Promise<UrgentCourse[]> {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', String(params.limit));

  const queryString = query.toString();
  return apiClient.get<UrgentCourse[]>(
    `/students/${studentId}/courses/urgent${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Fetch all courses managed by a lecturer.
 */
export async function getLecturerCourses(lecturerId: string): Promise<Course[]> {
  return apiClient.get<Course[]>(`/lecturers/${lecturerId}/courses`);
}

/**
 * Fetch a single course by its ID.
 */
export async function getCourseById(courseId: string): Promise<Course> {
  return apiClient.get<Course>(`/courses/${courseId}`);
}

/**
 * Fetch all assignments configured for a course.
 */
export async function getCourseAssignments(courseId: string): Promise<Assignment[]> {
  return apiClient.get<Assignment[]>(`/courses/${courseId}/assignments`);
}

/**
 * Fetch all assignments in a course along with student's individual submission & evaluation status.
 */
export async function getStudentCourseAssignments(
  studentId: string,
  courseId: string
): Promise<StudentAssignment[]> {
  return apiClient.get<StudentAssignment[]>(
    `/students/${studentId}/courses/${courseId}/assignments`
  );
}

/**
 * Fetch all assignments across all enrolled courses for a student with completion status and course details.
 */
export async function getAllStudentAssignments(
  studentId: string,
  params: GetStudentAssignmentsParams = {}
): Promise<StudentAssignment[]> {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', String(params.limit));
  if (params.status) query.append('status', params.status);
  if (params.upcoming !== undefined) query.append('upcoming', String(params.upcoming));
  if (params.sort) query.append('sort', params.sort);

  const queryString = query.toString();
  return apiClient.get<StudentAssignment[]>(
    `/students/${studentId}/assignments${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Fetch student's graded assignments sorted by evaluation/submission date descending (latest grades first).
 */
export async function getStudentGrades(
  studentId: string,
  params: { limit?: number } = {}
): Promise<StudentAssignment[]> {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', String(params.limit));

  const queryString = query.toString();
  return apiClient.get<StudentAssignment[]>(
    `/students/${studentId}/grades${queryString ? `?${queryString}` : ''}`
  );
}
