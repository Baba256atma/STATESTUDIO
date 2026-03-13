export function smoothValue(current: number, target: number, speed: number, delta: number) {
  // exponential smoothing toward target
  return current + (target - current) * (1 - Math.exp(-speed * delta));
}
