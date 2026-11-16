export function endScreenContent(result) {
  if (result === 'victory') {
    return {
      title: 'VITÓRIA',
      reward: 'Nova arma: Espada do Espírito',
      hint: 'Pressione R para reiniciar',
    };
  }
  if (result === 'defeat') {
    return {
      title: 'DERROTA',
      reward: null,
      hint: 'Pressione R para reiniciar',
    };
  }
  if (result === 'playing') {
    return null;
  }
  throw new Error(`Unknown match result: ${result}`);
}

export function shouldRestart(result, restartRequested) {
  return result !== 'playing' && restartRequested;
}
