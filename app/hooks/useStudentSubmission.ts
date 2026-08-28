import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAssignmentSubmission,
  submitDraftSubmission,
  updateDraftSubmission,
} from '../lib/api/submissions';

interface SaveDraftInput {
  assignmentId: string;
  submissionId?: string;
  file: File;
}

interface SubmitInput {
  assignmentId: string;
  submissionId?: string;
  file?: File;
}

function useInvalidateStudentSubmissionQueries() {
  const queryClient = useQueryClient();

  return async (assignmentId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['studentAssignmentDetail', assignmentId] }),
      queryClient.invalidateQueries({ queryKey: ['studentAssignments'] }),
      queryClient.invalidateQueries({ queryKey: ['studentCourses'] }),
      queryClient.invalidateQueries({ queryKey: ['studentCourse'] }),
      queryClient.invalidateQueries({ queryKey: ['studentGrades'] }),
    ]);
  };
}

export function useSaveStudentSubmissionDraft() {
  const invalidate = useInvalidateStudentSubmissionQueries();

  return useMutation({
    mutationFn: ({ assignmentId, submissionId, file }: SaveDraftInput) =>
      submissionId
        ? updateDraftSubmission(submissionId, { files: [file] }, true)
        : createAssignmentSubmission(assignmentId, { files: [file] }, false),
    onSuccess: (_submission, variables) => invalidate(variables.assignmentId),
  });
}

export function useSubmitStudentAssignment() {
  const invalidate = useInvalidateStudentSubmissionQueries();

  return useMutation({
    mutationFn: async ({ assignmentId, submissionId, file }: SubmitInput) => {
      if (!submissionId) {
        if (!file) throw new Error('A submission file is required');
        return createAssignmentSubmission(assignmentId, { files: [file] }, true);
      }

      if (file) {
        await updateDraftSubmission(submissionId, { files: [file] }, true);
      }
      return submitDraftSubmission(submissionId);
    },
    onSuccess: (_submission, variables) => invalidate(variables.assignmentId),
  });
}
