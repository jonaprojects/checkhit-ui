import { ApiError } from './api/client';

const MAX_TRANSIENT_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 30_000;
const RETRYABLE_HTTP_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

export class UserContextUnavailableError extends Error {
  constructor() {
    super('User context is unavailable');
    this.name = 'UserContextUnavailableError';
  }
}

export class StudentContextUnavailableError extends UserContextUnavailableError {
  constructor() {
    super();
    this.name = 'StudentContextUnavailableError';
  }
}

export function isRetryableQueryError(error: unknown): boolean {
  if (error instanceof UserContextUnavailableError) return false;

  if (error instanceof ApiError) {
    return RETRYABLE_HTTP_STATUSES.has(error.status);
  }

  // fetch rejects with TypeError for transport failures such as loss of network.
  return error instanceof TypeError;
}

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  return failureCount < MAX_TRANSIENT_RETRIES && isRetryableQueryError(error);
}

export function queryRetryDelay(attemptIndex: number, error: unknown): number {
  if (error instanceof ApiError && error.retryAfterMs !== undefined) {
    return Math.min(error.retryAfterMs, MAX_RETRY_DELAY_MS);
  }

  const exponentialDelay = Math.min(1000 * 2 ** attemptIndex, MAX_RETRY_DELAY_MS);
  // Equal jitter prevents many clients from retrying at the same instant.
  return exponentialDelay / 2 + Math.random() * (exponentialDelay / 2);
}

export function shouldRetryStudentQuery(failureCount: number, error: Error): boolean {
  return shouldRetryQuery(failureCount, error);
}

export function shouldRetryUserQuery(failureCount: number, error: Error): boolean {
  return shouldRetryQuery(failureCount, error);
}
