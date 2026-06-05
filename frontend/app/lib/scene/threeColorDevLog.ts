/**
 * Development-only Three.js color sanitization brake logs (deduped, non-fatal).
 */

const loggedBrakeSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logThreeColorBrake(value: string): void {
  if (!isDev()) return;
  const signature = `Invalid Three.js color sanitized: ${value}`;
  if (loggedBrakeSignatures.has(signature)) return;
  loggedBrakeSignatures.add(signature);
  globalThis.console?.warn?.(`[ThreeColor][Brake] ${signature}`);
}

export function getThreeColorBrakeCount(): number {
  return loggedBrakeSignatures.size;
}

export function resetThreeColorBrakeLogsForTests(): void {
  loggedBrakeSignatures.clear();
}
