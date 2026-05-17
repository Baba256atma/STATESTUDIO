/**
 * D7:1:6 — Dev-only comparison logs (deduped, replay-safe).
 */

export type ComparisonDevChannel =
  | "ScenarioComparison"
  | "ComparisonDelta"
  | "TradeoffAnalysis"
  | "ComparisonGuard";

const DEDUPE_MS = 220;
const lastAt = new Map<string, number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logComparisonDev(channel: ComparisonDevChannel, payload: Record<string, unknown>): void {
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
