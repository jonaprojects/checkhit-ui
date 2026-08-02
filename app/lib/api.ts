const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

type CreateAssignmentPayload = {
  name: FormDataEntryValue | null;
  description: string;
  type: FormDataEntryValue | null;
  evaluationInstructions: string;
  maxScore: number;
  dueAt: string | null;
  status: "PUBLISHED";
};

type CreatedAssignment = {
  id: string;
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
    throw new Error((await response.text()) || "API request failed.");
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
