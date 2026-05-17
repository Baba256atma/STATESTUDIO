/**
 * D7:1:1 — Dev-only structured simulation logs (deduped, SSR-safe).
 */

export type SimulationDevLogChannel =
  | "Simulation"
  | "SimulationTick"
  | "SimulationSnapshot"
  | "SimulationGuard";

const DEDUPE_MS = 220;
const lastKeyAt = new Map<string, number>();

function isDevLoggingEnabled(): boolean {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "production") {
    return false;
  }
  return true;
}

export function logSimulationDev(
  channel: SimulationDevLogChannel,
  payload: Record<string, unknown>
): void {
  if (!isDevLoggingEnabled()) return;
  try {
    const now = Date.now();
    const key = `${channel}|${JSON.stringify(payload)}`;
    const lastAt = lastKeyAt.get(key) ?? 0;
    if (now - lastAt < DEDUPE_MS) return;
    lastKeyAt.set(key, now);
    globalThis.console?.debug?.(`[Nexora][${channel}]`, payload);
  } catch {
    // ignore logging failures
  }
}
