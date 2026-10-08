import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MAX_SUBMISSION_FILE_SIZE,
  SUBMISSION_FILE_ACCEPT,
  validateSubmissionFile,
} from './submission-validation.ts';

const fileOfSize = (name: string, size: number) =>
  ({ name, size }) as unknown as File;

test('accepts the file types the server stores and grades', () => {
  for (const name of ['answer.pdf', 'answer.DOCX', 'answer.txt']) {
    assert.equal(validateSubmissionFile(fileOfSize(name, 10)), null, name);
  }
  assert.equal(SUBMISSION_FILE_ACCEPT, '.pdf,.docx,.txt');
});

test('rejects file types the server refuses', () => {
  for (const name of ['answer.zip', 'answer.md', 'answer']) {
    assert.equal(validateSubmissionFile(fileOfSize(name, 10)), 'unsupported', name);
  }
});

test('enforces the server default upload limit', () => {
  assert.equal(MAX_SUBMISSION_FILE_SIZE, 20 * 1024 * 1024);
  assert.equal(validateSubmissionFile(fileOfSize('a.pdf', MAX_SUBMISSION_FILE_SIZE)), null);
  assert.equal(validateSubmissionFile(fileOfSize('a.pdf', MAX_SUBMISSION_FILE_SIZE + 1)), 'tooLarge');
  assert.equal(validateSubmissionFile(fileOfSize('a.pdf', 0)), 'empty');
});
