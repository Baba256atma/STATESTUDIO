/**
 * Development-only auto topology selection logs.
 */

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyAutoSelection(input: {
  nodeCount: number;
  selected: string;
  reason: string;
}): void {
  if (!isDev()) return;
  globalThis.console?.info?.(`[Topology][Auto] Node count: ${input.nodeCount}`);
  globalThis.console?.info?.(`[Topology][Auto] Selected: ${input.selected}`);
  globalThis.console?.info?.(`[Topology][Auto] Reason: ${input.reason}`);
}
