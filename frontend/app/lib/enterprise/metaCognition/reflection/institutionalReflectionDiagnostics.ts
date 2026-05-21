type InstitutionalReflectionDiagnosticKind =
  | "evolution_sync_instability"
  | "institutional_reflection_drift"
  | "resilience_progression_recomputation"
  | "fragmented_cognition_evolution"
  | "strategic_maturity_continuity_degradation";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: InstitutionalReflectionDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f10-3-reflection] ${kind}: ${message}`);
}

export function reportEvolutionSyncInstability(message: string): void {
  emit("evolution_sync_instability", message);
}

export function reportInstitutionalReflectionDrift(message: string): void {
  emit("institutional_reflection_drift", message);
}

export function reportStrategicMaturityContinuityDegradation(message: string): void {
  emit("strategic_maturity_continuity_degradation", message);
}
