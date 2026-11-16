import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDamage, healthRatio, matchResult } from '../src/logic/health.js';

test('applyDamage: subtracts damage from hp', () => {
  assert.equal(applyDamage(100, 20), 80);
});

test('applyDamage: never goes below zero', () => {
  assert.equal(applyDamage(10, 25), 0);
});

test('healthRatio: half hp gives 0.5', () => {
  assert.equal(healthRatio(50, 100), 0.5);
});

test('healthRatio: zero hp gives 0', () => {
  assert.equal(healthRatio(0, 100), 0);
});

test('healthRatio: full hp gives 1', () => {
  assert.equal(healthRatio(100, 100), 1);
});

test('matchResult: both alive is playing', () => {
  assert.equal(matchResult(100, 100), 'playing');
});

test('matchResult: player at zero is defeat', () => {
  assert.equal(matchResult(0, 50), 'defeat');
});

test('matchResult: enemy at zero is victory', () => {
  assert.equal(matchResult(50, 0), 'victory');
});

test('matchResult: both at zero is defeat', () => {
  assert.equal(matchResult(0, 0), 'defeat');
});
