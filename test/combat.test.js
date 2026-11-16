import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateFacing, tickCooldown, canAttack, attackHits } from '../src/logic/combat.js';

function assertClose(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `expected ${actual} to be close to ${expected}`
  );
}

test('updateFacing: direction -1 turns to the left', () => {
  assert.equal(updateFacing(1, -1), -1);
});

test('updateFacing: direction 1 turns to the right', () => {
  assert.equal(updateFacing(-1, 1), 1);
});

test('updateFacing: direction 0 keeps current facing', () => {
  assert.equal(updateFacing(-1, 0), -1);
});

test('tickCooldown: subtracts dt', () => {
  assertClose(tickCooldown(0.4, 0.1), 0.3);
});

test('tickCooldown: does not go below 0', () => {
  assert.equal(tickCooldown(0.05, 0.1), 0);
});

test('canAttack: requested with cooldown 0 returns true', () => {
  assert.equal(canAttack(true, 0), true);
});

test('canAttack: requested while on cooldown returns false', () => {
  assert.equal(canAttack(true, 0.2), false);
});

test('canAttack: not requested returns false', () => {
  assert.equal(canAttack(false, 0), false);
});

test('attackHits: enemy in front within reach returns true', () => {
  assert.equal(attackHits(300, 1, 350, 80, 540, 480), true);
});

test('attackHits: enemy behind returns false', () => {
  assert.equal(attackHits(300, 1, 250, 80, 540, 480), false);
});

test('attackHits: enemy beyond reach returns false', () => {
  assert.equal(attackHits(300, 1, 400, 80, 540, 480), false);
});

test('attackHits: enemy exactly at reach limit returns true', () => {
  assert.equal(attackHits(300, 1, 380, 80, 540, 480), true);
});

test('attackHits: within reach but player above enemy returns false', () => {
  assert.equal(attackHits(300, 1, 350, 80, 470, 480), false);
});
