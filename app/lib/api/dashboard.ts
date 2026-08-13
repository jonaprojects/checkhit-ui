import { apiClient } from './client';
import type { LecturerDashboardData } from './types';

/**
 * Fetch aggregated lecturer dashboard data.
 * GET /lecturers/:lecturerId/dashboard
 */
export async function getLecturerDashboard(
  lecturerId: string
): Promise<LecturerDashboardData> {
  return apiClient.get<LecturerDashboardData>(
    `/lecturers/${lecturerId}/dashboard`
  );
}
