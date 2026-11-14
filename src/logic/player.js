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
