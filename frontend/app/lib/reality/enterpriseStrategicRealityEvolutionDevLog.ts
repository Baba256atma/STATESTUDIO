/**
 * D7:7:6 — Dev-only enterprise strategic reality evolution logs (deduped, replay-safe).
 */

export type EnterpriseStrategicRealityEvolutionDevChannel =
  | "RealityEvolution"
  | "Transformation"
  | "StrategicTransition"
  | "AdaptiveEvolution"
  | "EvolutionGuard";

const DEDUPE_MS = 220;
const lastAt = new Map<string, number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logEnterpriseStrategicRealityEvolutionDev(
  channel: EnterpriseStrategicRealityEvolutionDevChannel,
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
