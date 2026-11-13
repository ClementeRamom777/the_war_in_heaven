import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updatePositionX } from '../src/logic/movement.js';

test('with dt = 0, position does not change', () => {
  assert.equal(updatePositionX(123, 200, 0, 960), 123);
});

test('with x = 0, speed = 200 and dt = 0.5, returns 100', () => {
  assert.equal(updatePositionX(0, 200, 0.5, 960), 100);
});

test('when position goes past worldWidth, wraps back to 0', () => {
  assert.equal(updatePositionX(950, 200, 0.1, 960), 0);
});
