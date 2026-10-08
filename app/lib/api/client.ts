import { getLtiSession } from '../lti-session';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export class ApiError extends Error {
  status: number;
  data: unknown;
  retryAfterMs?: number;

  constructor(message: string, status: number, data?: unknown, retryAfterMs?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.retryAfterMs = retryAfterMs;
  }
}

function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }

  const retryAt = Date.parse(value);
  if (Number.isNaN(retryAt)) return undefined;

  return Math.max(0, retryAt - Date.now());
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${SERVER_URL}/api${normalizedEndpoint}`);
  const { ltik } = getLtiSession();
  if (ltik && !url.searchParams.has('ltik')) {
    url.searchParams.set('ltik', ltik);
  }

  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url.toString(), {
    ...options,
    credentials: options.credentials || 'include',
    headers,
  });

  if (!response.ok) {
    let errorData: unknown;
    let errorMessage = `Request failed with status ${response.status}: ${response.statusText}`;

    try {
      errorData = await response.json();
      if (errorData && typeof errorData === 'object' && 'message' in errorData && typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      }
    } catch {
      // Non-JSON error response
    }

    throw new ApiError(
      errorMessage,
      response.status,
      errorData,
      parseRetryAfter(response.headers.get('Retry-After'))
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

async function download(
  endpoint: string,
  fallbackFilename = 'appeal-evidence.pdf',
): Promise<{ blob: Blob; filename: string }> {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${SERVER_URL}/api${normalizedEndpoint}`);
  const { ltik } = getLtiSession();
  if (ltik) url.searchParams.set('ltik', ltik);

  const response = await fetch(url.toString(), { credentials: 'include' });
  if (!response.ok) {
    let message = `Download failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (typeof data?.message === 'string') message = data.message;
    } catch {
      // The download endpoint may return a non-JSON proxy error.
    }
    throw new ApiError(message, response.status);
  }

  const disposition = response.headers.get('Content-Disposition') || '';
  const encodedName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  return {
    blob: await response.blob(),
    filename: encodedName ? decodeURIComponent(encodedName) : fallbackFilename,
  };
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (typeof FormData !== 'undefined' && body instanceof FormData) return body;
  return JSON.stringify(body);
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: serializeBody(body),
    }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: serializeBody(body),
    }),
  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: serializeBody(body),
    }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
  download,
};
