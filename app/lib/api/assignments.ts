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

export async function downloadAssignmentFile(
  assignmentId: string,
  fallbackFilename = 'assignment',
): Promise<void> {
  const { blob, filename } = await apiClient.download(
    `/assignments/${assignmentId}/file`,
    fallbackFilename,
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
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

