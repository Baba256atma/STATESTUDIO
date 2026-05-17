/**
 * D7:2:1 — Dev-only topology logs (deduped, replay-safe).
 */

export type TopologyDevChannel =
  | "Topology"
  | "OperationalUniverse"
  | "DependencyMap"
  | "TopologyGuard"
  | "RegionClassification";

const DEDUPE_MS = 220;
const lastAt = new Map<string, number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTopologyDev(channel: TopologyDevChannel, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  try {
    const now = Date.now();
    const key = `${channel}|${JSON.stringify(payload)}`;
    const prev = lastAt.get(key) ?? 0;
    if (now - prev < DEDUPE_MS) return;
    lastAt.set(key, now);
    globalThis.console?.debug?.(`[Nexora][${channel}]`, payload);
  } catch {
    // ignore
  }
}
