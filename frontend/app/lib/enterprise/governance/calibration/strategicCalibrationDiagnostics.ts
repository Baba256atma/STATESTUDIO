type CalibrationDiagnosticKind =
  | "calibration_sync_instability"
  | "refinement_continuity_violation"
  | "decision_evolution_drift"
  | "fragmented_calibration_rendering"
  | "institutional_learning_degradation"
  | "strategic_refinement_instability";

const recent = new Map<string, number>();
const DEDUPE_MS = 8_000;

function emit(kind: CalibrationDiagnosticKind, message: string): void {
  const key = `${kind}:${message}`;
  const now = Date.now();
  const last = recent.get(key);
  if (last != null && now - last < DEDUPE_MS) return;
  recent.set(key, now);
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[nexora:f9-3-calibration] ${kind}: ${message}`);
}

export function reportCalibrationSyncInstability(message: string): void {
  emit("calibration_sync_instability", message);
}

export function reportRefinementContinuityViolation(message: string): void {
  emit("refinement_continuity_violation", message);
}

export function reportDecisionEvolutionDrift(message: string): void {
  emit("decision_evolution_drift", message);
}
