import type { AdaptiveReasoningObservation } from "./cognitiveAdaptationTypes";

export const COGNITIVE_ADAPTATION_MAX_OBSERVATIONS = 10;
export const COGNITIVE_ADAPTATION_MAX_SNAPSHOTS = 8;
export const COGNITIVE_ADAPTATION_MAX_SIGNALS = 10;
export const COGNITIVE_ADAPTATION_MAX_INDICATORS = 10;
export const COGNITIVE_ADAPTATION_MAX_BALANCE_FIELDS = 8;
export const COGNITIVE_ADAPTATION_MIN_EVAL_INTERVAL_MS = 500;
export const COGNITIVE_ADAPTATION_MAX_RECURSION_DEPTH = 2;
export const COGNITIVE_ADAPTATION_MIN_CONFIDENCE = 0.48;
export const COGNITIVE_ADAPTATION_MAX_INFLATED_CONFIDENCE = 0.94;
export const COGNITIVE_ADAPTATION_MIN_UNIFIED_LAYERS = 3;
export const COGNITIVE_ADAPTATION_MIN_RESILIENCE_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let adaptationDepth = 0;

export function beginCognitiveAdaptationEvaluation(): boolean {
  if (adaptationDepth >= COGNITIVE_ADAPTATION_MAX_RECURSION_DEPTH) return false;
  adaptationDepth += 1;
  return true;
}

export function endCognitiveAdaptationEvaluation(): void {
  adaptationDepth = Math.max(0, adaptationDepth - 1);
}

export function shouldEvaluateCognitiveAdaptation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < COGNITIVE_ADAPTATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampAdaptationConfidence(score: number): number {
  return Number(
    Math.min(
      COGNITIVE_ADAPTATION_MAX_INFLATED_CONFIDENCE,
      Math.max(COGNITIVE_ADAPTATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateAdaptiveReasoningObservation(
  observation: AdaptiveReasoningObservation | null | undefined
): observation is AdaptiveReasoningObservation {
  if (!observation) return false;
  if (!observation.adaptationId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < COGNITIVE_ADAPTATION_MIN_CONFIDENCE) return false;
  if (observation.confidence > COGNITIVE_ADAPTATION_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.adaptationSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainAdaptiveReasoningObservation(
  observation: AdaptiveReasoningObservation
): boolean {
  if (!validateAdaptiveReasoningObservation(observation)) return false;
  if (observation.stabilizationState === "self_stabilized" && observation.adaptationStrength === "weak") {
    return false;
  }
  if (observation.stabilizationState === "reactive" && observation.confidence > 0.9) {
    return false;
  }
  return true;
}

export function adaptationStrengthRank(
  strength: AdaptiveReasoningObservation["adaptationStrength"]
): number {
  const ranks: Record<AdaptiveReasoningObservation["adaptationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    enterprise_grade: 4,
  };
  return ranks[strength];
}

export function stabilizationStateRank(
  state: AdaptiveReasoningObservation["stabilizationState"]
): number {
  const ranks: Record<AdaptiveReasoningObservation["stabilizationState"], number> = {
    reactive: 1,
    adaptive: 2,
    balancing: 3,
    stabilizing: 4,
    self_stabilized: 5,
  };
  return ranks[state];
}

export function resetCognitiveAdaptationGuards(): void {
  lastEvalAtByOrg.clear();
  adaptationDepth = 0;
}
