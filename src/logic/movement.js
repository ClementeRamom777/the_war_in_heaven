export function updatePositionX(x, speed, dt, worldWidth) {
  const nextX = x + speed * dt;
  if (nextX > worldWidth) {
    return 0;
  }
  return nextX;
}
