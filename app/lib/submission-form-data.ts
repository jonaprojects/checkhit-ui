export interface SubmissionContent {
  answerText?: string;
  files?: File[];
}

export function buildSubmissionFormData(
  content: SubmissionContent,
  options: { submit?: boolean; clearFiles?: boolean } = {}
): FormData {
  const formData = new FormData();

  if (content.answerText !== undefined) {
    formData.append('answerText', content.answerText);
  }
  if (options.submit !== undefined) {
    formData.append('submit', String(options.submit));
  }
  if (options.clearFiles !== undefined) {
    formData.append('clearFiles', String(options.clearFiles));
  }
  content.files?.forEach((file) => formData.append('files', file));

  return formData;
}
