import { apiClient } from './client';
import type { Lecturer, Student } from './types';

export async function getLecturer(lecturerId: string): Promise<Lecturer> {
  return apiClient.get<Lecturer>(`/lecturers/${lecturerId}`);
}

export async function getStudent(studentId: string): Promise<Student> {
  return apiClient.get<Student>(`/students/${studentId}`);
}
