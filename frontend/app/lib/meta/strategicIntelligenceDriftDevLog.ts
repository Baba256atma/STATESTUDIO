/**
 * D7:8:4 — Dev-only strategic intelligence drift logs (deduped, replay-safe).
 */

export type StrategicIntelligenceDriftDevChannel =
  | "StrategicDrift"
  | "MetaCoherence"
  | "IntelligenceDegradation"
  | "LongHorizonDrift"
  | "StrategicDriftGuard";

const DEDUPE_MS = 220;
const lastAt = new Map<string, number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logStrategicIntelligenceDriftDev(
  channel: StrategicIntelligenceDriftDevChannel,
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
