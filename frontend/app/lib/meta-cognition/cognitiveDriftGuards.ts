import type { StrategicReasoningStability } from "./cognitiveDriftTypes";

export const COGNITIVE_DRIFT_MAX_STABILITIES = 10;
export const COGNITIVE_DRIFT_MAX_SNAPSHOTS = 8;
export const COGNITIVE_DRIFT_MAX_SIGNALS = 10;
export const COGNITIVE_DRIFT_MAX_VOLATILITY = 10;
export const COGNITIVE_DRIFT_MAX_CONSISTENCY_FIELDS = 8;
export const COGNITIVE_DRIFT_MIN_EVAL_INTERVAL_MS = 500;
export const COGNITIVE_DRIFT_MAX_RECURSION_DEPTH = 2;
export const COGNITIVE_DRIFT_MIN_CONFIDENCE = 0.48;
export const COGNITIVE_DRIFT_MAX_INFLATED_CONFIDENCE = 0.94;
export const COGNITIVE_DRIFT_MIN_UNIFIED_LAYERS = 3;
export const COGNITIVE_DRIFT_MIN_INTEGRITY_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let driftDepth = 0;

export function beginCognitiveDriftEvaluation(): boolean {
  if (driftDepth >= COGNITIVE_DRIFT_MAX_RECURSION_DEPTH) return false;
  driftDepth += 1;
  return true;
}

export function endCognitiveDriftEvaluation(): void {
  driftDepth = Math.max(0, driftDepth - 1);
}

export function shouldEvaluateCognitiveDrift(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < COGNITIVE_DRIFT_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampDriftConfidence(score: number): number {
  return Number(
    Math.min(
      COGNITIVE_DRIFT_MAX_INFLATED_CONFIDENCE,
      Math.max(COGNITIVE_DRIFT_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicReasoningStability(
  stability: StrategicReasoningStability | null | undefined
): stability is StrategicReasoningStability {
  if (!stability) return false;
  if (!stability.driftId.trim() || !stability.summary.trim()) return false;
  if (stability.confidence < COGNITIVE_DRIFT_MIN_CONFIDENCE) return false;
  if (stability.confidence > COGNITIVE_DRIFT_MAX_INFLATED_CONFIDENCE) return false;
  if (stability.stabilitySignals.length < 1) return false;
  return Number.isFinite(stability.generatedAt);
}

export function shouldRetainStrategicReasoningStability(
  stability: StrategicReasoningStability
): boolean {
  if (!validateStrategicReasoningStability(stability)) return false;
  if (stability.stabilityState === "stable" && stability.driftSeverity === "critical") {
    return false;
  }
  if (stability.stabilityState === "fragmented" && stability.confidence > 0.88) {
    return false;
  }
  return true;
}

export function driftSeverityRank(severity: StrategicReasoningStability["driftSeverity"]): number {
  const ranks: Record<StrategicReasoningStability["driftSeverity"], number> = {
    low: 1,
    monitored: 2,
    elevated: 3,
    unstable: 4,
    critical: 5,
  };
  return ranks[severity];
}

export function stabilityStateRank(state: StrategicReasoningStability["stabilityState"]): number {
  const ranks: Record<StrategicReasoningStability["stabilityState"], number> = {
    fragmented: 1,
    degrading: 2,
    fluctuating: 3,
    adaptive: 4,
    stable: 5,
  };
  return ranks[state];
}

export function resetCognitiveDriftGuards(): void {
  lastEvalAtByOrg.clear();
  driftDepth = 0;
}
