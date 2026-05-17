/**
 * D7:4:6 — Dev-only collapse prevention logs (deduped, replay-safe).
 */

export type PreventionDevChannel =
  | "CollapsePrevention"
  | "StabilizationWindow"
  | "PreventionOpportunity"
  | "ResiliencePreservation"
  | "PreventionGuard";

const DEDUPE_MS = 220;
const lastAt = new Map<string, number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logPreventionDev(
  channel: PreventionDevChannel,
  payload: Record<string, unknown>
): void {
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
