import { directionFromKeys, updatePlayerX } from './logic/player.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const PLAYER_SPEED = 300; // px/s
const MAX_DT = 0.05; // seconds

let playerX = (canvas.width - PLAYER_WIDTH) / 2;
const playerY = canvas.height - PLAYER_HEIGHT;

const keys = { left: false, right: false };

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyA') {
    keys.left = true;
  } else if (event.code === 'KeyD') {
    keys.right = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.code === 'KeyA') {
    keys.left = false;
  } else if (event.code === 'KeyD') {
    keys.right = false;
  }
});

window.addEventListener('blur', () => {
  keys.left = false;
  keys.right = false;
});

let lastTimestamp = null;

function frame(timestamp) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp;
  }
  const dt = Math.min((timestamp - lastTimestamp) / 1000, MAX_DT);
  lastTimestamp = timestamp;

  const direction = directionFromKeys(keys.left, keys.right);
  playerX = updatePlayerX(playerX, direction, PLAYER_SPEED, dt, 0, canvas.width - PLAYER_WIDTH);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
