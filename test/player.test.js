import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  directionFromKeys,
  updatePlayerX,
  applyGravity,
  updatePlayerY,
  startJump,
} from '../src/logic/player.js';

function assertClose(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) < 1e-9,
    `expected ${actual} to be close to ${expected}`
  );
}

test('directionFromKeys: no key pressed returns 0', () => {
  assert.equal(directionFromKeys(false, false), 0);
});

test('directionFromKeys: only left pressed returns -1', () => {
  assert.equal(directionFromKeys(true, false), -1);
});

test('directionFromKeys: only right pressed returns 1', () => {
  assert.equal(directionFromKeys(false, true), 1);
});

test('directionFromKeys: both keys pressed returns 0', () => {
  assert.equal(directionFromKeys(true, true), 0);
});

test('updatePlayerX: direction 0 does not move', () => {
  assert.equal(updatePlayerX(100, 0, 300, 0.1, 0, 920), 100);
});

test('updatePlayerX: direction 1 moves right', () => {
  assert.equal(updatePlayerX(100, 1, 300, 0.1, 0, 920), 130);
});

test('updatePlayerX: direction -1 moves left', () => {
  assert.equal(updatePlayerX(100, -1, 300, 0.1, 0, 920), 70);
});

test('updatePlayerX: does not go below minX', () => {
  assert.equal(updatePlayerX(10, -1, 300, 0.1, 0, 920), 0);
});

test('updatePlayerX: does not go above maxX', () => {
  assert.equal(updatePlayerX(910, 1, 300, 0.1, 0, 920), 920);
});

test('applyGravity: vy=0, gravity=2000, dt=0.1 returns 200', () => {
  assertClose(applyGravity(0, 2000, 0.1), 200);
});

test('updatePlayerY: in the air', () => {
  const result = updatePlayerY(100, 200, 0.1, 480);
  assertClose(result.y, 120);
  assert.equal(result.vy, 200);
  assert.equal(result.onGround, false);
});

test('updatePlayerY: landing on the ground', () => {
  const result = updatePlayerY(470, 200, 0.1, 480);
  assert.equal(result.y, 480);
  assert.equal(result.vy, 0);
  assert.equal(result.onGround, true);
});

test('startJump: on ground with jump requested returns -jumpSpeed', () => {
  assert.equal(startJump(true, true, 800, 0), -800);
});

test('startJump: in the air with jump requested keeps vy (no double jump)', () => {
  assert.equal(startJump(false, true, 800, -300), -300);
});

test('startJump: on ground without jump requested keeps vy', () => {
  assert.equal(startJump(true, false, 800, 0), 0);
});
