/**
 * D7:1:2 — Dev-only state evolution logs (deduped, SSR-safe).
 */

export type OperationalEvolutionDevChannel =
  | "StateEvolution"
  | "Transition"
  | "OperationalState"
  | "SimulationProgression";

const DEDUPE_MS = 220;
const lastKeyAt = new Map<string, number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logOperationalEvolutionDev(
  channel: OperationalEvolutionDevChannel,
  payload: Record<string, unknown>
): void {
  if (!isDev()) return;
  try {
    const now = Date.now();
    const key = `${channel}|${JSON.stringify(payload)}`;
    const last = lastKeyAt.get(key) ?? 0;
    if (now - last < DEDUPE_MS) return;
    lastKeyAt.set(key, now);
    globalThis.console?.debug?.(`[Nexora][${channel}]`, payload);
  } catch {
    // ignore
  }
}
