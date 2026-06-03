/**
 * Development-only topology runtime position diagnostics (deduped, non-fatal).
 */

const loggedMismatchSignatures = new Set<string>();
const loggedLineResolvedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyPositionMismatch(message: string): void {
  if (!isDev()) return;
  const signature = message;
  if (loggedMismatchSignatures.has(signature)) return;
  loggedMismatchSignatures.add(signature);
  globalThis.console?.warn?.(`[Nexora][TopologyPositionMismatch] ${message}`);
}

export function logTopologyLineResolved(message: string): void {
  if (!isDev()) return;
  if (loggedLineResolvedSignatures.has(message)) return;
  loggedLineResolvedSignatures.add(message);
  globalThis.console?.debug?.(`[Nexora][TopologyLineResolved] ${message}`);
}

export function resetTopologyRuntimePositionDevLogsForTests(): void {
  loggedMismatchSignatures.clear();
  loggedLineResolvedSignatures.clear();
}
