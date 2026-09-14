import { apiClient } from './client';
import type { EvaluationDetail } from './types';

export async function getEvaluationDetail(evaluationId: string): Promise<EvaluationDetail> {
  return apiClient.get<EvaluationDetail>(`/evaluations/${evaluationId}`);
}
