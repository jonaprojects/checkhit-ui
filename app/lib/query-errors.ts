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

export function shouldRetryStudentQuery(failureCount: number, error: Error): boolean {
  return !(error instanceof StudentContextUnavailableError) && failureCount < 2;
}

export function shouldRetryUserQuery(failureCount: number, error: Error): boolean {
  return !(error instanceof UserContextUnavailableError) && failureCount < 2;
}
