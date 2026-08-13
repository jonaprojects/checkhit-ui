import { apiClient } from './client';
import type {
  Appeal,
  GetStudentAppealsParams,
  LecturerAppeal,
  LecturerAppealsStats,
  GetLecturerAppealsParams,
  ResolveAppealDto,
} from './types';

export interface CreateAppealInput {
  submissionId: string;
  reason: string;
  fileIds?: string[];
}

/**
 * Fetch all appeals submitted by a specific student.
 */
export async function getStudentAppeals(
  studentId: string,
  params: GetStudentAppealsParams = {}
): Promise<Appeal[]> {
  const query = new URLSearchParams();
  if (params.limit) query.append('limit', String(params.limit));
  if (params.status) query.append('status', params.status);

  const queryString = query.toString();
  return apiClient.get<Appeal[]>(
    `/students/${studentId}/appeals${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Fetch all appeals across courses taught by a lecturer.
 */
export async function getLecturerAppeals(
  lecturerId: string,
  params: GetLecturerAppealsParams = {}
): Promise<LecturerAppeal[]> {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.courseId) query.append('courseId', params.courseId);
  if (params.search) query.append('search', params.search);
  if (params.limit) query.append('limit', String(params.limit));

  const queryString = query.toString();
  return apiClient.get<LecturerAppeal[]>(
    `/lecturers/${lecturerId}/appeals${queryString ? `?${queryString}` : ''}`
  );
}

/**
 * Fetch appeals summary counts for lecturer badges and tabs.
 */
export async function getLecturerAppealsStats(lecturerId: string): Promise<LecturerAppealsStats> {
  return apiClient.get<LecturerAppealsStats>(`/lecturers/${lecturerId}/appeals/stats`);
}

/**
 * Fetch full details of a single appeal.
 */
export async function getAppealById(appealId: string): Promise<LecturerAppeal> {
  return apiClient.get<LecturerAppeal>(`/appeals/${appealId}`);
}

/**
 * Resolve an appeal and update score and resolution comment.
 */
export async function resolveAppeal(appealId: string, data: ResolveAppealDto): Promise<LecturerAppeal> {
  try {
    return await apiClient.patch<LecturerAppeal>(`/appeals/${appealId}`, data);
  } catch (error) {
    // If server mounts the alias endpoint:
    return await apiClient.patch<LecturerAppeal>(`/appeals/${appealId}/resolve`, data);
  }
}

/**
 * Submit a new appeal for a submission (student).
 */
export async function createAppeal(data: CreateAppealInput): Promise<Appeal> {
  return apiClient.post<Appeal>('/appeals', data);
}
