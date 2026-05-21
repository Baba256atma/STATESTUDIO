type ForesightDiagnosticKind =
  | "trajectory_sync_instability"
  | "fragmented_foresight_rendering"
  | "unstable_future_state_recomputation"
  | "resilience_forecast_drift"
  | "strategic_timing_cognition_degradation"
  | "future_state_continuity_violation";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: ForesightDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f10-4-foresight] ${kind}: ${message}`);
}

export function reportTrajectorySyncInstability(message: string): void {
  emit("trajectory_sync_instability", message);
}

export function reportFutureStateContinuityViolation(message: string): void {
  emit("future_state_continuity_violation", message);
}

export function reportResilienceForecastDrift(message: string): void {
  emit("resilience_forecast_drift", message);
}
