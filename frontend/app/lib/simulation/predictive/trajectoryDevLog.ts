/**
 * D7:4:1 — Dev-only predictive trajectory logs (deduped, replay-safe).
 */

export type TrajectoryDevChannel =
  | "Trajectory"
  | "PredictiveFuture"
  | "TrajectoryDrift"
  | "FutureVolatility"
  | "TrajectoryGuard";

const DEDUPE_MS = 220;
const lastAt = new Map<string, number>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function logTrajectoryDev(
  channel: TrajectoryDevChannel,
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
