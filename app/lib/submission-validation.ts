export const MAX_SUBMISSION_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['pdf', 'zip', 'md']);

export type SubmissionFileValidationError = 'empty' | 'unsupported' | 'tooLarge';

export function validateSubmissionFile(file: File): SubmissionFileValidationError | null {
  if (file.size === 0) return 'empty';
  if (file.size > MAX_SUBMISSION_FILE_SIZE) return 'tooLarge';

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) return 'unsupported';

  return null;
}
