import { test } from 'node:test';
import assert from 'node:assert/strict';
import { directionFromKeys, updatePlayerX } from '../src/logic/player.js';

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
