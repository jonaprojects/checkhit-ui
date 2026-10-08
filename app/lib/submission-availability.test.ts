import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getSubmissionErrorKey,
  getSubmissionUnavailableReason,
  isAppealInProgress,
} from './submission-availability.ts';

const now = new Date('2026-10-08T12:00:00.000Z');
const open = {
  status: 'PUBLISHED',
  startAt: '2026-10-01T00:00:00.000Z',
  dueAt: '2026-10-09T00:00:00.000Z',
};

test('reports why the submission window is unavailable', () => {
  assert.equal(getSubmissionUnavailableReason(open, now), null);
  assert.equal(
    getSubmissionUnavailableReason({ status: 'PUBLISHED', startAt: null, dueAt: null }, now),
    null,
  );
  assert.equal(getSubmissionUnavailableReason({ ...open, status: 'CLOSED' }, now), 'closed');
  assert.equal(
    getSubmissionUnavailableReason({ ...open, startAt: '2026-10-08T13:00:00.000Z' }, now),
    'notOpen',
  );
  assert.equal(
    getSubmissionUnavailableReason({ ...open, dueAt: '2026-10-08T12:00:00.000Z' }, now),
    'deadlinePassed',
  );
});

test('treats only pending appeals as in progress', () => {
  assert.equal(isAppealInProgress('SUBMITTED'), true);
  assert.equal(isAppealInProgress('UNDER_REVIEW'), true);
  for (const status of ['ACCEPTED', 'REJECTED', 'CANCELLED', null, undefined]) {
    assert.equal(isAppealInProgress(status), false, String(status));
  }
});

test('maps server rejection codes to translated messages', () => {
  assert.equal(getSubmissionErrorKey('DEADLINE_PASSED'), 'assignmentDetail.errors.deadlinePassed');
  assert.equal(getSubmissionErrorKey('APPEAL_IN_PROGRESS'), 'assignmentDetail.errors.appealInProgress');
  assert.equal(getSubmissionErrorKey('LIMIT_FILE_SIZE'), null);
  assert.equal(getSubmissionErrorKey(undefined), null);
});
