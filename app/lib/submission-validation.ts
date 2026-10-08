// Mirrors the server upload policy (MAX_UPLOAD_BYTES default and upload-mime.ts).
export const MAX_SUBMISSION_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['pdf', 'docx', 'txt']);

export const SUBMISSION_FILE_ACCEPT = '.pdf,.docx,.txt';

export type SubmissionFileValidationError = 'empty' | 'unsupported' | 'tooLarge';

export function validateSubmissionFile(file: File): SubmissionFileValidationError | null {
  if (file.size === 0) return 'empty';
  if (file.size > MAX_SUBMISSION_FILE_SIZE) return 'tooLarge';

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) return 'unsupported';

  return null;
}
