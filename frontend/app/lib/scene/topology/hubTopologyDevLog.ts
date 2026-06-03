/**
 * Development-only hub topology logs.
 */

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logHubTopologyGenerating(
  hubName: string,
  satelliteCount: number,
  connectionCount: number
): void {
  if (!isDev()) return;
  globalThis.console?.info?.("[Topology][Hub] Generating hub layout");
  globalThis.console?.info?.(`[Topology][Hub] Hub: ${hubName}`);
  globalThis.console?.info?.(`[Topology][Hub] Satellites: ${satelliteCount}`);
  globalThis.console?.info?.(`[Topology][Hub] Connections: ${connectionCount}`);
}
