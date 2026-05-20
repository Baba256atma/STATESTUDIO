type GovernanceDiagnosticKind =
  | "governance_sync_instability"
  | "strategic_continuity_violation"
  | "oversight_cognition_drift"
  | "fragmented_governance_rendering"
  | "institutional_discipline_degradation"
  | "adaptive_governance_instability";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: GovernanceDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f9-1-governance] ${kind}: ${message}`);
}

export function reportGovernanceSyncInstability(message: string): void {
  emit("governance_sync_instability", message);
}

export function reportStrategicContinuityViolation(message: string): void {
  emit("strategic_continuity_violation", message);
}

export function reportOversightCognitionDrift(message: string): void {
  emit("oversight_cognition_drift", message);
}

export function reportFragmentedGovernanceRendering(message: string): void {
  emit("fragmented_governance_rendering", message);
}
