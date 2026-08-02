import { apiClient } from './client';
import type { Appeal } from './types';

export interface CreateAppealInput {
  submissionId: string;
  reason: string;
  fileIds?: string[];
}

/**
 * Fetch all appeals submitted by a specific student.
 */
export async function getStudentAppeals(studentId: string): Promise<Appeal[]> {
  return apiClient.get<Appeal[]>(`/students/${studentId}/appeals`);
}

/**
 * Fetch details of a single appeal.
 */
export async function getAppealById(appealId: string): Promise<Appeal> {
  return apiClient.get<Appeal>(`/appeals/${appealId}`);
}

/**
 * Submit a new appeal for a submission.
 */
export async function createAppeal(data: CreateAppealInput): Promise<Appeal> {
  return apiClient.post<Appeal>('/appeals', data);
}
