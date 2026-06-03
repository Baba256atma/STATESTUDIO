/**
 * Development-only topology connection highlight brake logs (deduped, non-fatal).
 */

const loggedBrakeSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyConnectionHighlightBrake(message: string): void {
  if (!isDev()) return;
  if (loggedBrakeSignatures.has(message)) return;
  loggedBrakeSignatures.add(message);
  globalThis.console?.warn?.(`[TopologyConnectionHighlight][Brake] ${message}`);
}

export function resetTopologyConnectionHighlightBrakeLogsForTests(): void {
  loggedBrakeSignatures.clear();
}
