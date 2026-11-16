import { test } from 'node:test';
import assert from 'node:assert/strict';
import { endScreenContent, shouldRestart } from '../src/logic/match.js';

test('endScreenContent: victory has title VITÓRIA and a reward', () => {
  const content = endScreenContent('victory');
  assert.equal(content.title, 'VITÓRIA');
  assert.notEqual(content.reward, null);
});

test('endScreenContent: defeat has title DERROTA and no reward', () => {
  const content = endScreenContent('defeat');
  assert.equal(content.title, 'DERROTA');
  assert.equal(content.reward, null);
});

test('endScreenContent: playing returns null', () => {
  assert.equal(endScreenContent('playing'), null);
});

test('endScreenContent: unknown result throws', () => {
  assert.throws(() => endScreenContent('paused'));
});

test('shouldRestart: victory with request restarts', () => {
  assert.equal(shouldRestart('victory', true), true);
});

test('shouldRestart: defeat with request restarts', () => {
  assert.equal(shouldRestart('defeat', true), true);
});

test('shouldRestart: playing with request does not restart', () => {
  assert.equal(shouldRestart('playing', true), false);
});

test('shouldRestart: victory without request does not restart', () => {
  assert.equal(shouldRestart('victory', false), false);
});
