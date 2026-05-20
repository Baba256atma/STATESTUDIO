type PressureDiagnosticKind =
  | "pressure_governance_sync_instability"
  | "stability_continuity_violation"
  | "escalation_governance_drift"
  | "fragmented_stability_rendering"
  | "institutional_resilience_degradation"
  | "strategic_composure_instability";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: PressureDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f9-4-pressure] ${kind}: ${message}`);
}

export function reportPressureGovernanceSyncInstability(message: string): void {
  emit("pressure_governance_sync_instability", message);
}

export function reportStabilityContinuityViolation(message: string): void {
  emit("stability_continuity_violation", message);
}

export function reportEscalationGovernanceDrift(message: string): void {
  emit("escalation_governance_drift", message);
}
