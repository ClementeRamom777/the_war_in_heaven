import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moveToward, canHit, updateEnemyState } from '../src/logic/enemy.js';

function assertClose(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `expected ${actual} to be close to ${expected}`
  );
}

test('moveToward: moves right when target is to the right', () => {
  assertClose(moveToward(100, 500, 120, 0.1, 50), 112);
});

test('moveToward: moves left when target is to the left', () => {
  assertClose(moveToward(500, 100, 120, 0.1, 50), 488);
});

test('moveToward: never gets closer than stopDistance', () => {
  assertClose(moveToward(100, 200, 1000, 1, 50), 150);
});

test('canHit: within range and on the ground returns true', () => {
  assert.equal(canHit(300, 350, 70, 540, 480), true);
});

test('canHit: out of range returns false', () => {
  assert.equal(canHit(300, 400, 70, 540, 480), false);
});

test('canHit: exactly at range limit returns true', () => {
  assert.equal(canHit(300, 370, 70, 540, 480), true);
});

test('canHit: within range but player above enemy returns false', () => {
  assert.equal(canHit(300, 350, 70, 470, 480), false);
});

test('updateEnemyState: approach with inRange goes to windup', () => {
  const result = updateEnemyState('approach', 0, 0.016, true, 0.5, 1.0);
  assert.equal(result.state, 'windup');
  assert.equal(result.timer, 0);
  assert.equal(result.attackHappened, false);
});

test('updateEnemyState: approach without inRange stays in approach', () => {
  const result = updateEnemyState('approach', 0, 0.016, false, 0.5, 1.0);
  assert.equal(result.state, 'approach');
  assert.equal(result.attackHappened, false);
});

test('updateEnemyState: windup before windupTime stays in windup', () => {
  const result = updateEnemyState('windup', 0.1, 0.1, true, 0.5, 1.0);
  assert.equal(result.state, 'windup');
  assertClose(result.timer, 0.2);
  assert.equal(result.attackHappened, false);
});

test('updateEnemyState: windup reaching windupTime goes to recover with attack', () => {
  const result = updateEnemyState('windup', 0.45, 0.05, true, 0.5, 1.0);
  assert.equal(result.state, 'recover');
  assert.equal(result.timer, 0);
  assert.equal(result.attackHappened, true);
});

test('updateEnemyState: recover reaching recoverTime goes back to approach', () => {
  const result = updateEnemyState('recover', 0.95, 0.05, false, 0.5, 1.0);
  assert.equal(result.state, 'approach');
  assert.equal(result.timer, 0);
  assert.equal(result.attackHappened, false);
});

test('updateEnemyState: stunned before stunTime stays stunned', () => {
  const result = updateEnemyState('stunned', 0.5, 0.1, true, 0.5, 1.0, 1.0);
  assert.equal(result.state, 'stunned');
  assertClose(result.timer, 0.6);
  assert.equal(result.attackHappened, false);
});

test('updateEnemyState: stunned reaching stunTime goes back to approach', () => {
  const result = updateEnemyState('stunned', 0.95, 0.05, true, 0.5, 1.0, 1.0);
  assert.equal(result.state, 'approach');
  assert.equal(result.timer, 0);
  assert.equal(result.attackHappened, false);
});
