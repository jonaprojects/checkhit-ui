const API_BASE_URL = (
  import.meta.env.VITE_SERVER_URL ??
  import.meta.env.VITE_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "");

export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";

export type CreateAssignmentPayload = {
  name: string;
  description: string;
  type: string;
  evaluationInstructions: string;
  maxScore: number;
  startAt: string | null;
  dueAt: string | null;
  status: AssignmentStatus;
};

export type CreatedAssignment = CreateAssignmentPayload & {
  id: string;
  courseId: string;
};

export type AssignmentQuestionInput = {
  questionKey: string;
  orderIndex: number;
  prompt: string;
  rubric: string | null;
  maxScore: number;
};

export type QuestionImportResult = {
  importId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "SUPERSEDED";
  assignmentId: string;
  fileId: string;
};

export type QuestionImportStatus = {
  id: string;
  assignmentId: string;
  status: QuestionImportResult["status"];
  errorMessage: string | null;
  attemptCount: number;
  maxAttempts: number;
};

const buildAuthenticatedUrl = (path: string, ltik: string): string => {
  const url = new URL(`${API_BASE_URL}${path}`);
  url.searchParams.set("ltik", ltik);
  return url.toString();
};

const request = async (
  path: string,
  ltik: string,
  init: RequestInit,
): Promise<Response> => {
  const response = await fetch(buildAuthenticatedUrl(path, ltik), {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText || "API request failed.";

    try {
      const data = JSON.parse(responseText) as { message?: unknown };
      if (typeof data.message === "string") {
        message = data.message;
      }
    } catch {
      // Preserve non-JSON server errors.
    }

    throw new Error(message);
  }

  return response;
};

export const createAssignment = async (
  courseId: string,
  ltik: string,
  payload: CreateAssignmentPayload,
): Promise<CreatedAssignment> => {
  const response = await request(`/api/courses/${courseId}/assignments`, ltik, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return (await response.json()) as CreatedAssignment;
};

export const replaceAssignmentQuestions = async (
  assignmentId: string,
  ltik: string,
  questions: AssignmentQuestionInput[],
): Promise<void> => {
  await request(`/api/assignments/${assignmentId}/questions`, ltik, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions }),
  });
};

export const importAssignmentQuestions = async (
  assignmentId: string,
  ltik: string,
  file: File,
): Promise<QuestionImportResult> => {
  const body = new FormData();
  body.append("file", file);
  const response = await request(
    `/api/assignments/${assignmentId}/question-imports`,
    ltik,
    {
      method: "POST",
      body,
    },
  );

  return (await response.json()) as QuestionImportResult;
};

export const getQuestionImportStatus = async (
  importId: string,
  ltik: string,
): Promise<QuestionImportStatus> => {
  const response = await request(`/api/question-imports/${importId}`, ltik, {
    method: "GET",
  });
  return (await response.json()) as QuestionImportStatus;
};

export const generateDeeplink = async (
  taskId: string,
  ltik: string,
): Promise<string> => {
  const response = await request("/api/generate-deeplink", ltik, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId }),
  });

  return response.text();
};
