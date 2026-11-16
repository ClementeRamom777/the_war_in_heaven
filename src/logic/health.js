export function applyDamage(hp, damage) {
  return Math.max(0, hp - damage);
}

export function healthRatio(hp, maxHp) {
  return Math.min(1, Math.max(0, hp / maxHp));
}

export function matchResult(playerHp, enemyHp) {
  if (playerHp <= 0) {
    return 'defeat';
  }
  if (enemyHp <= 0) {
    return 'victory';
  }
  return 'playing';
}
