type AdaptationDiagnosticKind =
  | "adaptation_sync_instability"
  | "transformation_continuity_violation"
  | "organizational_evolution_drift"
  | "fragmented_adaptation_rendering"
  | "institutional_transformation_degradation"
  | "strategic_evolution_instability";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: AdaptationDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f9-5-adaptation] ${kind}: ${message}`);
}

export function reportAdaptationSyncInstability(message: string): void {
  emit("adaptation_sync_instability", message);
}

export function reportTransformationContinuityViolation(message: string): void {
  emit("transformation_continuity_violation", message);
}

export function reportOrganizationalEvolutionDrift(message: string): void {
  emit("organizational_evolution_drift", message);
}
