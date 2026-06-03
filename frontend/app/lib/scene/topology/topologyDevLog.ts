/**
 * Development-only topology engine logs.
 */

let initializedLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyInitializedOnce(): void {
  if (!isDev() || initializedLogged) return;
  initializedLogged = true;
  globalThis.console?.info?.("[Topology] Initialized");
}

export function logTopologyGenerating(topology: string, nodeCount: number): void {
  if (!isDev()) return;
  globalThis.console?.info?.(`[Topology] Generating topology: ${topology}`);
  globalThis.console?.info?.(`[Topology] Node count: ${nodeCount}`);
}

export function resetTopologyDevLogsForTests(): void {
  initializedLogged = false;
}
