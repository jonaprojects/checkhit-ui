import { apiClient } from './client';
import type {
  StudentAssignmentDetailResponse,
  LecturerAssignmentOverviewResponse,
  GetLecturerAssignmentOverviewParams,
} from './types';

/**
 * Fetch detailed assignment information for a student including course details,
 * student submission state, AI/lecturer evaluation, and appeal status.
 */
export async function getStudentAssignmentDetail(
  assignmentId: string,
  studentId?: string,
  ltik?: string
): Promise<StudentAssignmentDetailResponse> {
  const query = new URLSearchParams();
  if (studentId) query.set('studentId', studentId);
  if (ltik) query.set('ltik', ltik);

  const queryString = query.toString();
  return apiClient.get<StudentAssignmentDetailResponse>(
    `/assignments/${assignmentId}${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Fetch complete lecturer overview for an assignment including metadata,
 * KPI statistics, and the full enrolled student submissions roster.
 */
export async function getLecturerAssignmentOverview(
  assignmentId: string,
  params: GetLecturerAssignmentOverviewParams = {},
  ltik?: string
): Promise<LecturerAssignmentOverviewResponse> {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (ltik) query.set('ltik', ltik);

  const queryString = query.toString();
  return apiClient.get<LecturerAssignmentOverviewResponse>(
    `/assignments/${assignmentId}/lecturer-overview${queryString ? `?${queryString}` : ''}`
  );
}

