import { updatePositionX } from './logic/movement.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const SQUARE_SIZE = 40;
const SPEED = 200; // px/s
const MAX_DT = 0.05; // seconds

let squareX = 0;
const squareY = (canvas.height - SQUARE_SIZE) / 2;

let lastTimestamp = null;

function frame(timestamp) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }
  const dt = Math.min((timestamp - lastTimestamp) / 1000, MAX_DT);
  lastTimestamp = timestamp;

  squareX = updatePositionX(squareX, SPEED, dt, canvas.width);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(squareX, squareY, SQUARE_SIZE, SQUARE_SIZE);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
