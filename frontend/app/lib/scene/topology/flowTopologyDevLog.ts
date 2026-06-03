/**
 * Development-only flow topology logs.
 */

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logFlowTopologyGenerating(nodeCount: number, connectionCount: number): void {
  if (!isDev()) return;
  globalThis.console?.info?.("[Topology][Flow] Generating flow layout");
  globalThis.console?.info?.(`[Topology][Flow] Nodes: ${nodeCount}`);
  globalThis.console?.info?.(`[Topology][Flow] Connections: ${connectionCount}`);
}
