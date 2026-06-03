/**
 * Development-only topology connection brake logs (deduped, non-fatal).
 */

const loggedBrakeSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyConnectionBrake(message: string): void {
  if (!isDev()) return;
  if (loggedBrakeSignatures.has(message)) return;
  loggedBrakeSignatures.add(message);
  globalThis.console?.warn?.(`[TopologyConnection][Brake] ${message}`);
}

export function resetTopologyConnectionBrakeLogsForTests(): void {
  loggedBrakeSignatures.clear();
}
