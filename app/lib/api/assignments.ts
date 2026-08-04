import { apiClient } from './client';
import type { StudentAssignmentDetailResponse } from './types';

/**
 * Fetch detailed assignment information for a student including course details,
 * student submission state, AI/lecturer evaluation, and appeal status.
 */
export async function getStudentAssignmentDetail(
  assignmentId: string,
  studentId?: string
): Promise<StudentAssignmentDetailResponse> {
  const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
  return apiClient.get<StudentAssignmentDetailResponse>(`/assignments/${assignmentId}${query}`);
}
