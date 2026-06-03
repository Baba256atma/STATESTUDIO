/**
 * Development-only topology binding brake logs (deduped, non-fatal).
 */

const loggedBrakeSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyBindingBrake(message: string): void {
  if (!isDev()) return;
  if (loggedBrakeSignatures.has(message)) return;
  loggedBrakeSignatures.add(message);
  globalThis.console?.warn?.(`[TopologyBinding][Brake] ${message}`);
}

export function resetTopologyBindingBrakeLogsForTests(): void {
  loggedBrakeSignatures.clear();
}
