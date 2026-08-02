import { apiClient } from './client';
import type { Course, Assignment, StudentAssignment } from './types';

/**
 * Fetch all courses where the specified student is enrolled.
 */
export async function getStudentCourses(studentId: string): Promise<Course[]> {
  return apiClient.get<Course[]>(`/students/${studentId}/courses`);
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
  studentId: string
): Promise<StudentAssignment[]> {
  return apiClient.get<StudentAssignment[]>(
    `/students/${studentId}/assignments`
  );
}
