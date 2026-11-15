export function moveToward(x, targetX, speed, dt, stopDistance) {
  const distance = Math.abs(targetX - x);
  if (distance <= stopDistance) {
    return x;
  }
  const step = Math.min(speed * dt, distance - stopDistance);
  return x + Math.sign(targetX - x) * step;
}

export function canHit(enemyCenterX, playerCenterX, range, playerBottom, enemyTop) {
  return Math.abs(enemyCenterX - playerCenterX) <= range && playerBottom > enemyTop;
}

export function updateEnemyState(state, timer, dt, inRange, windupTime, recoverTime) {
  if (state === 'approach') {
    if (inRange) {
      return { state: 'windup', timer: 0, attackHappened: false };
    }
    return { state: 'approach', timer, attackHappened: false };
  }
  if (state === 'windup') {
    const newTimer = timer + dt;
    if (newTimer >= windupTime) {
      return { state: 'recover', timer: 0, attackHappened: true };
    }
    return { state: 'windup', timer: newTimer, attackHappened: false };
  }
  if (state === 'recover') {
    const newTimer = timer + dt;
    if (newTimer >= recoverTime) {
      return { state: 'approach', timer: 0, attackHappened: false };
    }
    return { state: 'recover', timer: newTimer, attackHappened: false };
  }
  throw new Error(`Unknown enemy state: ${state}`);
}
