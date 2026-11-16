import {
  directionFromKeys,
  updatePlayerX,
  applyGravity,
  updatePlayerY,
  startJump,
} from './logic/player.js';
import { moveToward, canHit, updateEnemyState } from './logic/enemy.js';
import {
  updateFacing,
  tickCooldown,
  canAttack,
  attackHits,
  canParry,
  isParryActive,
  resolveEnemyHit,
} from './logic/combat.js';
import { applyDamage, healthRatio, matchResult } from './logic/health.js';
import { endScreenContent, shouldRestart } from './logic/match.js';

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
const ENEMY_STUN_TIME = 1.0; // seconds
const HIT_FLASH_TIME = 0.2; // seconds

const ATTACK_COOLDOWN = 0.4; // seconds
const ATTACK_REACH = 80; // between centers
const ATTACK_SHOW_TIME = 0.1; // seconds
const ENEMY_FLASH_TIME = 0.15; // seconds
const SLASH_WIDTH = 40;
const SLASH_HEIGHT = 10;

const PARRY_ACTIVE_TIME = 0.2; // seconds
const PARRY_COOLDOWN = 0.6; // seconds
const SHIELD_WIDTH = 8;
const SHIELD_HEIGHT = 50;

const MAX_HP = 100;
const ENEMY_DAMAGE = 25;
const PLAYER_DAMAGE = 20;
const HUD_BAR_WIDTH = 300;
const HUD_BAR_HEIGHT = 16;
const HUD_MARGIN = 20;

const TITLE_FONT = 'bold 64px sans-serif';
const TEXT_FONT = '24px sans-serif';
const SWORD_BLADE_WIDTH = 10;
const SWORD_BLADE_HEIGHT = 50;
const SWORD_GUARD_WIDTH = 30;
const SWORD_GUARD_HEIGHT = 6;
const SWORD_HILT_HEIGHT = 14;

const GROUND_Y = canvas.height - PLAYER_HEIGHT;
const ENEMY_Y = canvas.height - ENEMY_HEIGHT;

let playerX;
let playerY;
let playerVy;
let onGround;
let jumpRequested;
let hitFlashTimer;
let facing;
let attackRequested;
let attackCooldown;
let attackShowTimer;
let parryRequested;
let parryTimer;
let parryCooldown;
let restartRequested;
let playerHp;
let enemyHp;

let enemyX;
let enemyState;
let enemyTimer;
let enemyFlashTimer;

const keys = { left: false, right: false };

function resetGame() {
  playerX = (canvas.width - PLAYER_WIDTH) / 2;
  playerY = GROUND_Y;
  playerVy = 0;
  onGround = true;
  jumpRequested = false;
  hitFlashTimer = 0;
  facing = 1;
  attackRequested = false;
  attackCooldown = 0;
  attackShowTimer = 0;
  parryRequested = false;
  parryTimer = 0;
  parryCooldown = 0;
  restartRequested = false;
  playerHp = MAX_HP;
  enemyHp = MAX_HP;

  enemyX = canvas.width - ENEMY_WIDTH - 20;
  enemyState = 'approach';
  enemyTimer = 0;
  enemyFlashTimer = 0;
}

resetGame();

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
  } else if (event.code === 'KeyJ') {
    if (!event.repeat) {
      attackRequested = true;
    }
  } else if (event.code === 'KeyK') {
    if (!event.repeat) {
      parryRequested = true;
    }
  } else if (event.code === 'KeyR') {
    if (!event.repeat) {
      restartRequested = true;
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

  let result = matchResult(playerHp, enemyHp);
  if (shouldRestart(result, restartRequested)) {
    resetGame();
    result = matchResult(playerHp, enemyHp);
  }
  restartRequested = false;

  if (result === 'playing') {
    updateGame(dt);
  }

  draw();
  if (result !== 'playing') {
    drawEndScreen(endScreenContent(result), result);
  }

  requestAnimationFrame(frame);
}

function updateGame(dt) {
  const direction = directionFromKeys(keys.left, keys.right);
  facing = updateFacing(facing, direction);
  playerX = updatePlayerX(playerX, direction, PLAYER_SPEED, dt, 0, canvas.width - PLAYER_WIDTH);

  playerVy = startJump(onGround, jumpRequested, JUMP_SPEED, playerVy);
  jumpRequested = false;
  playerVy = applyGravity(playerVy, GRAVITY, dt);
  const vertical = updatePlayerY(playerY, playerVy, dt, GROUND_Y);
  playerY = vertical.y;
  playerVy = vertical.vy;
  onGround = vertical.onGround;

  const playerCenterX = playerX + PLAYER_WIDTH / 2;
  const playerBottom = playerY + PLAYER_HEIGHT;
  let enemyCenterX = enemyX + ENEMY_WIDTH / 2;

  attackCooldown = tickCooldown(attackCooldown, dt);
  if (canAttack(attackRequested, attackCooldown)) {
    attackCooldown = ATTACK_COOLDOWN;
    attackShowTimer = ATTACK_SHOW_TIME;
    if (attackHits(playerCenterX, facing, enemyCenterX, ATTACK_REACH, playerBottom, ENEMY_Y)) {
      enemyFlashTimer = ENEMY_FLASH_TIME;
      enemyHp = applyDamage(enemyHp, PLAYER_DAMAGE);
    }
  }
  attackRequested = false;

  parryTimer = tickCooldown(parryTimer, dt);
  parryCooldown = tickCooldown(parryCooldown, dt);
  if (canParry(parryRequested, parryCooldown)) {
    parryTimer = PARRY_ACTIVE_TIME;
    parryCooldown = PARRY_COOLDOWN;
  }
  parryRequested = false;

  const inRange = Math.abs(enemyCenterX - playerCenterX) <= ENEMY_ATTACK_RANGE;

  const enemyUpdate = updateEnemyState(
    enemyState,
    enemyTimer,
    dt,
    inRange,
    ENEMY_WINDUP_TIME,
    ENEMY_RECOVER_TIME,
    ENEMY_STUN_TIME
  );
  enemyState = enemyUpdate.state;
  enemyTimer = enemyUpdate.timer;

  if (enemyState === 'approach') {
    enemyCenterX = moveToward(enemyCenterX, playerCenterX, ENEMY_SPEED, dt, ENEMY_STOP_DISTANCE);
    enemyX = enemyCenterX - ENEMY_WIDTH / 2;
  }

  if (enemyUpdate.attackHappened) {
    const hitLanded = canHit(enemyCenterX, playerCenterX, ENEMY_ATTACK_RANGE, playerBottom, ENEMY_Y);
    const hitResult = resolveEnemyHit(hitLanded, isParryActive(parryTimer));
    if (hitResult === 'hit') {
      hitFlashTimer = HIT_FLASH_TIME;
      playerHp = applyDamage(playerHp, ENEMY_DAMAGE);
    } else if (hitResult === 'parried') {
      enemyState = 'stunned';
      enemyTimer = 0;
    }
  }

  hitFlashTimer = Math.max(hitFlashTimer - dt, 0);
  enemyFlashTimer = Math.max(enemyFlashTimer - dt, 0);
  attackShowTimer = Math.max(attackShowTimer - dt, 0);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = hitFlashTimer > 0 ? '#f00' : '#fff';
  ctx.fillRect(playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

  if (attackShowTimer > 0) {
    const slashX = facing === 1 ? playerX + PLAYER_WIDTH : playerX - SLASH_WIDTH;
    const slashY = playerY + (PLAYER_HEIGHT - SLASH_HEIGHT) / 2;
    ctx.fillStyle = '#9cf';
    ctx.fillRect(slashX, slashY, SLASH_WIDTH, SLASH_HEIGHT);
  }

  if (isParryActive(parryTimer)) {
    const shieldX = facing === 1 ? playerX + PLAYER_WIDTH : playerX - SHIELD_WIDTH;
    const shieldY = playerY + (PLAYER_HEIGHT - SHIELD_HEIGHT) / 2;
    ctx.fillStyle = '#6cf';
    ctx.fillRect(shieldX, shieldY, SHIELD_WIDTH, SHIELD_HEIGHT);
  }

  if (enemyFlashTimer > 0) {
    ctx.fillStyle = '#fff';
  } else if (enemyState === 'stunned') {
    ctx.fillStyle = '#88f';
  } else {
    ctx.fillStyle = enemyState === 'windup' ? '#ff0' : '#c33';
  }
  ctx.fillRect(enemyX, ENEMY_Y, ENEMY_WIDTH, ENEMY_HEIGHT);

  drawHealthBar(HUD_MARGIN, playerHp, '#3c6');
  drawHealthBar(canvas.width - HUD_MARGIN - HUD_BAR_WIDTH, enemyHp, '#c33');
}

function drawHealthBar(x, hp, color) {
  ctx.fillStyle = '#333';
  ctx.fillRect(x, HUD_MARGIN, HUD_BAR_WIDTH, HUD_BAR_HEIGHT);
  ctx.fillStyle = color;
  ctx.fillRect(x, HUD_MARGIN, HUD_BAR_WIDTH * healthRatio(hp, MAX_HP), HUD_BAR_HEIGHT);
}

function drawEndScreen(content, result) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = TITLE_FONT;
  ctx.fillStyle = result === 'victory' ? '#3c6' : '#c33';
  ctx.fillText(content.title, centerX, centerY - 60);

  if (content.reward !== null) {
    drawSwordIcon(centerX, centerY - 10);
    ctx.font = TEXT_FONT;
    ctx.fillStyle = '#fff';
    ctx.fillText(content.reward, centerX, centerY + 50);
  }

  ctx.font = TEXT_FONT;
  ctx.fillStyle = '#fff';
  ctx.fillText(content.hint, centerX, centerY + 100);
}

function drawSwordIcon(centerX, centerY) {
  const bladeX = centerX - SWORD_BLADE_WIDTH / 2;
  const bladeTop = centerY - SWORD_BLADE_HEIGHT / 2;
  const guardY = bladeTop + SWORD_BLADE_HEIGHT;

  ctx.fillStyle = '#dde';
  ctx.fillRect(bladeX, bladeTop, SWORD_BLADE_WIDTH, SWORD_BLADE_HEIGHT);

  ctx.fillStyle = '#c93';
  ctx.fillRect(centerX - SWORD_GUARD_WIDTH / 2, guardY, SWORD_GUARD_WIDTH, SWORD_GUARD_HEIGHT);

  ctx.fillStyle = '#742';
  ctx.fillRect(bladeX, guardY + SWORD_GUARD_HEIGHT, SWORD_BLADE_WIDTH, SWORD_HILT_HEIGHT);
}

requestAnimationFrame(frame);
