type InstitutionalRuntimeDiagnosticKind =
  | "cognition_sync_drift"
  | "orchestration_instability"
  | "continuity_degradation"
  | "resilience_cognition_fragmentation"
  | "governance_sync_failure"
  | "executive_cognition_continuity_violation";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: InstitutionalRuntimeDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f10-6-institutional] ${kind}: ${message}`);
}

export function reportInstitutionalCognitionSyncDrift(message: string): void {
  emit("cognition_sync_drift", message);
}

export function reportExecutiveCognitionContinuityViolation(message: string): void {
  emit("executive_cognition_continuity_violation", message);
}

export function reportContinuityDegradation(message: string): void {
  emit("continuity_degradation", message);
}
