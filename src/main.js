import {
  directionFromKeys,
  updatePlayerX,
  applyGravity,
  updatePlayerY,
  startJump,
} from './logic/player.js';
import { moveToward, canHit, updateEnemyState } from './logic/enemy.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const PLAYER_SPEED = 300; // px/s
const JUMP_SPEED = 800; // px/s
const GRAVITY = 2000; // px/s^2
const MAX_DT = 0.05; // seconds

const ENEMY_WIDTH = 40;
const ENEMY_HEIGHT = 60;
const ENEMY_SPEED = 120; // px/s
const ENEMY_STOP_DISTANCE = 50; // between centers
const ENEMY_ATTACK_RANGE = 70;
const ENEMY_WINDUP_TIME = 0.5; // seconds
const ENEMY_RECOVER_TIME = 1.0; // seconds
const HIT_FLASH_TIME = 0.2; // seconds

const GROUND_Y = canvas.height - PLAYER_HEIGHT;
const ENEMY_Y = canvas.height - ENEMY_HEIGHT;

let playerX = (canvas.width - PLAYER_WIDTH) / 2;
let playerY = GROUND_Y;
let playerVy = 0;
let onGround = true;
let jumpRequested = false;
let hitFlashTimer = 0;

let enemyX = canvas.width - ENEMY_WIDTH - 20;
let enemyState = 'approach';
let enemyTimer = 0;

const keys = { left: false, right: false };

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyA') {
    keys.left = true;
  } else if (event.code === 'KeyD') {
    keys.right = true;
  } else if (event.code === 'Space') {
    event.preventDefault();
    if (!event.repeat) {
      jumpRequested = true;
    }
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

  playerVy = startJump(onGround, jumpRequested, JUMP_SPEED, playerVy);
  jumpRequested = false;
  playerVy = applyGravity(playerVy, GRAVITY, dt);
  const vertical = updatePlayerY(playerY, playerVy, dt, GROUND_Y);
  playerY = vertical.y;
  playerVy = vertical.vy;
  onGround = vertical.onGround;

  const playerCenterX = playerX + PLAYER_WIDTH / 2;
  let enemyCenterX = enemyX + ENEMY_WIDTH / 2;
  const inRange = Math.abs(enemyCenterX - playerCenterX) <= ENEMY_ATTACK_RANGE;

  const enemyUpdate = updateEnemyState(
    enemyState,
    enemyTimer,
    dt,
    inRange,
    ENEMY_WINDUP_TIME,
    ENEMY_RECOVER_TIME
  );
  enemyState = enemyUpdate.state;
  enemyTimer = enemyUpdate.timer;

  if (enemyState === 'approach') {
    enemyCenterX = moveToward(enemyCenterX, playerCenterX, ENEMY_SPEED, dt, ENEMY_STOP_DISTANCE);
    enemyX = enemyCenterX - ENEMY_WIDTH / 2;
  }

  if (enemyUpdate.attackHappened) {
    const playerBottom = playerY + PLAYER_HEIGHT;
    if (canHit(enemyCenterX, playerCenterX, ENEMY_ATTACK_RANGE, playerBottom, ENEMY_Y)) {
      hitFlashTimer = HIT_FLASH_TIME;
    }
  }

  hitFlashTimer = Math.max(hitFlashTimer - dt, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = hitFlashTimer > 0 ? '#f00' : '#fff';
  ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

  ctx.fillStyle = enemyState === 'windup' ? '#ff0' : '#c33';
  ctx.fillRect(enemyX, ENEMY_Y, ENEMY_WIDTH, ENEMY_HEIGHT);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
