import { apiClient } from './client';
import type { AssignmentSubmission } from './types';
import {
  buildSubmissionFormData,
  type SubmissionContent,
} from '../submission-form-data';

export function createAssignmentSubmission(
  assignmentId: string,
  content: SubmissionContent,
  submit: boolean
): Promise<AssignmentSubmission> {
  return apiClient.post<AssignmentSubmission>(
    `/assignments/${assignmentId}/submissions`,
    buildSubmissionFormData(content, { submit })
  );
}

export function updateDraftSubmission(
  submissionId: string,
  content: SubmissionContent,
  clearFiles: boolean
): Promise<AssignmentSubmission> {
  return apiClient.patch<AssignmentSubmission>(
    `/submissions/${submissionId}`,
    buildSubmissionFormData(content, { clearFiles })
  );
}

export function submitDraftSubmission(submissionId: string): Promise<AssignmentSubmission> {
  return apiClient.post<AssignmentSubmission>(`/submissions/${submissionId}/submit`);
}

export async function downloadSubmissionFile(
  submissionId: string,
  fileId: string,
  fallbackFilename = 'submission',
): Promise<void> {
  const { blob, filename } = await apiClient.download(
    `/submissions/${submissionId}/files/${fileId}`,
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
