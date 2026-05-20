type UnifiedDiagnosticKind =
  | "governance_sync_instability"
  | "institutional_continuity_violation"
  | "strategic_evolution_drift"
  | "fragmented_governance_composition"
  | "operational_coherence_degradation"
  | "unified_orchestration_failure";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: UnifiedDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f9-6-unified] ${kind}: ${message}`);
}

export function reportUnifiedGovernanceSyncInstability(message: string): void {
  emit("governance_sync_instability", message);
}

export function reportInstitutionalContinuityViolation(message: string): void {
  emit("institutional_continuity_violation", message);
}

export function reportStrategicEvolutionDrift(message: string): void {
  emit("strategic_evolution_drift", message);
}

export function reportUnifiedOrchestrationFailure(message: string): void {
  emit("unified_orchestration_failure", message);
}
