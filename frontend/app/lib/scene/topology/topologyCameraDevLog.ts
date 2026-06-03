/**
 * Development-only topology camera brake logs (deduped, non-fatal).
 */

const loggedBrakeSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyCameraBrake(message: string): void {
  if (!isDev()) return;
  if (loggedBrakeSignatures.has(message)) return;
  loggedBrakeSignatures.add(message);
  globalThis.console?.warn?.(`[TopologyCamera][Brake] ${message}`);
}

export function resetTopologyCameraBrakeLogsForTests(): void {
  loggedBrakeSignatures.clear();
}
