export function directionFromKeys(leftPressed, rightPressed) {
  if (leftPressed === rightPressed) {
    return 0;
  }
  return leftPressed ? -1 : 1;
}

export function updatePlayerX(x, direction, speed, dt, minX, maxX) {
  const nextX = x + direction * speed * dt;
  return Math.min(Math.max(nextX, minX), maxX);
}

export function applyGravity(vy, gravity, dt) {
  return vy + gravity * dt;
}

export function updatePlayerY(y, vy, dt, groundY) {
  const newY = y + vy * dt;
  if (newY >= groundY) {
    return { y: groundY, vy: 0, onGround: true };
  }
  return { y: newY, vy, onGround: false };
}

export function startJump(onGround, jumpRequested, jumpSpeed, vy) {
  if (onGround && jumpRequested) {
    return -jumpSpeed;
  }
  return vy;
}
