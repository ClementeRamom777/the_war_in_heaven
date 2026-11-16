export function updateFacing(facing, direction) {
  if (direction !== 0) {
    return direction;
  }
  return facing;
}

export function tickCooldown(cooldown, dt) {
  return Math.max(0, cooldown - dt);
}

export function canAttack(attackRequested, cooldown) {
  return attackRequested && cooldown <= 0;
}

export function attackHits(playerCenterX, facing, enemyCenterX, reach, playerBottom, enemyTop) {
  const offset = (enemyCenterX - playerCenterX) * facing;
  return offset >= 0 && offset <= reach && playerBottom > enemyTop;
}
