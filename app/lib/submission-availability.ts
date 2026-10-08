export type SubmissionUnavailableReason = 'closed' | 'notOpen' | 'deadlinePassed';

interface SubmissionWindow {
  status: string;
  startAt: string | null;
  dueAt: string | null;
}

/** Mirrors the server's submission window check; the server remains authoritative. */
export function getSubmissionUnavailableReason(
  assignment: SubmissionWindow,
  now: Date = new Date(),
): SubmissionUnavailableReason | null {
  if (assignment.status === 'CLOSED' || assignment.status === 'ARCHIVED') return 'closed';
  if (assignment.startAt && new Date(assignment.startAt).getTime() > now.getTime()) {
    return 'notOpen';
  }
  if (assignment.dueAt && new Date(assignment.dueAt).getTime() <= now.getTime()) {
    return 'deadlinePassed';
  }
  return null;
}

export function isAppealInProgress(status?: string | null): boolean {
  return status === 'SUBMITTED' || status === 'UNDER_REVIEW';
}

const SUBMISSION_ERROR_KEYS: Record<string, string> = {
  ALREADY_SUBMITTED: 'assignmentDetail.errors.alreadySubmitted',
  ASSIGNMENT_CLOSED: 'assignmentDetail.errors.assignmentClosed',
  ASSIGNMENT_NOT_OPEN: 'assignmentDetail.errors.notOpen',
  DEADLINE_PASSED: 'assignmentDetail.errors.deadlinePassed',
  APPEAL_IN_PROGRESS: 'assignmentDetail.errors.appealInProgress',
  DRAFT_EXISTS: 'assignmentDetail.errors.draftExists',
  GRADING_IN_PROGRESS: 'assignmentDetail.errors.gradingInProgress',
};

export function getSubmissionErrorKey(code: unknown): string | null {
  return typeof code === 'string' ? SUBMISSION_ERROR_KEYS[code] ?? null : null;
}
