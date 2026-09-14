import { useQuery } from '@tanstack/react-query';
import { getEvaluationDetail } from '../lib/api/evaluations';

export function useEvaluationDetail(evaluationId?: string) {
  return useQuery({
    queryKey: ['evaluationDetail', evaluationId],
    queryFn: () => {
      if (!evaluationId) throw new Error('Evaluation ID is required');
      return getEvaluationDetail(evaluationId);
    },
    enabled: Boolean(evaluationId),
  });
}
