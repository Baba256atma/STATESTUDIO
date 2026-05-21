import type { StrategicInterventionWindow } from "./interventionTimingTypes";

export const INTERVENTION_TIMING_MAX_WINDOWS = 10;
export const INTERVENTION_TIMING_MAX_SNAPSHOTS = 8;
export const INTERVENTION_TIMING_MAX_SIGNALS = 10;
export const INTERVENTION_TIMING_MAX_SENSITIVITIES = 8;
export const INTERVENTION_TIMING_MAX_OPPORTUNITY_FIELDS = 8;
export const INTERVENTION_TIMING_MAX_PRESSURE_INDICATORS = 10;
export const INTERVENTION_TIMING_MIN_EVAL_INTERVAL_MS = 500;
export const INTERVENTION_TIMING_MAX_RECURSION_DEPTH = 2;
export const INTERVENTION_TIMING_MIN_CONFIDENCE = 0.48;

const lastEvalAtByOrg = new Map<string, number>();
let timingDepth = 0;

export function beginInterventionTimingEvaluation(): boolean {
  if (timingDepth >= INTERVENTION_TIMING_MAX_RECURSION_DEPTH) return false;
  timingDepth += 1;
  return true;
}

export function endInterventionTimingEvaluation(): void {
  timingDepth = Math.max(0, timingDepth - 1);
}

export function shouldEvaluateInterventionTiming(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INTERVENTION_TIMING_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateStrategicInterventionWindow(
  window: StrategicInterventionWindow | null | undefined
): window is StrategicInterventionWindow {
  if (!window) return false;
  if (!window.interventionWindowId.trim() || !window.summary.trim()) return false;
  if (window.confidence < INTERVENTION_TIMING_MIN_CONFIDENCE) return false;
  if (window.timingSignals.length === 0) return false;
  return Number.isFinite(window.generatedAt);
}

export function shouldRetainStrategicInterventionWindow(
  window: StrategicInterventionWindow
): boolean {
  if (!validateStrategicInterventionWindow(window)) return false;
  if (window.timingSensitivity === "low" && window.confidence < 0.62) return false;
  if (window.windowState === "missed" && window.timingSensitivity === "low") return false;
  if (window.windowState === "emerging" && window.timingSensitivity === "low" && window.confidence < 0.66) {
    return false;
  }
  return true;
}

export function confidenceToInterventionTimingLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function sensitivityRank(
  sensitivity: StrategicInterventionWindow["timingSensitivity"]
): number {
  const ranks: Record<StrategicInterventionWindow["timingSensitivity"], number> = {
    low: 1,
    moderate: 2,
    high: 3,
    critical: 4,
  };
  return ranks[sensitivity];
}

export function resetInterventionTimingGuards(): void {
  lastEvalAtByOrg.clear();
  timingDepth = 0;
}
