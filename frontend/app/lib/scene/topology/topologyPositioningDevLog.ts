/**
 * Development-only topology positioning brake logs (deduped, non-fatal).
 */

const loggedBrakeSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyPositioningBrake(message: string): void {
  if (!isDev()) return;
  if (loggedBrakeSignatures.has(message)) return;
  loggedBrakeSignatures.add(message);
  globalThis.console?.warn?.(`[TopologyPositioning][Brake] ${message}`);
}

export function resetTopologyPositioningBrakeLogsForTests(): void {
  loggedBrakeSignatures.clear();
}
