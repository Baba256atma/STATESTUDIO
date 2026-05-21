import type { PurposeAlignmentObservation } from "./strategicIntentTypes";

export const STRATEGIC_INTENT_MAX_OBSERVATIONS = 10;
export const STRATEGIC_INTENT_MAX_SNAPSHOTS = 8;
export const STRATEGIC_INTENT_MAX_SIGNALS = 10;
export const STRATEGIC_INTENT_MAX_FIELDS = 8;
export const STRATEGIC_INTENT_MAX_TOPOLOGIES = 10;
export const STRATEGIC_INTENT_MIN_EVAL_INTERVAL_MS = 500;
export const STRATEGIC_INTENT_MAX_RECURSION_DEPTH = 2;
export const STRATEGIC_INTENT_MIN_CONFIDENCE = 0.48;
export const STRATEGIC_INTENT_MAX_INFLATED_CONFIDENCE = 0.94;
export const STRATEGIC_INTENT_MIN_UNIFIED_RUNTIMES = 4;
export const STRATEGIC_INTENT_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const STRATEGIC_INTENT_MIN_AWARENESS_SYNC_OBSERVATIONS = 1;
export const STRATEGIC_INTENT_MIN_SINGULARITY_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let strategicIntentDepth = 0;

export function beginStrategicIntentEvaluation(): boolean {
  if (strategicIntentDepth >= STRATEGIC_INTENT_MAX_RECURSION_DEPTH) return false;
  strategicIntentDepth += 1;
  return true;
}

export function endStrategicIntentEvaluation(): void {
  strategicIntentDepth = Math.max(0, strategicIntentDepth - 1);
}

export function shouldEvaluateStrategicIntent(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRATEGIC_INTENT_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampStrategicIntentConfidence(score: number): number {
  return Number(
    Math.min(
      STRATEGIC_INTENT_MAX_INFLATED_CONFIDENCE,
      Math.max(STRATEGIC_INTENT_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validatePurposeAlignmentObservation(
  observation: PurposeAlignmentObservation | null | undefined
): observation is PurposeAlignmentObservation {
  if (!observation) return false;
  if (!observation.intentId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < STRATEGIC_INTENT_MIN_CONFIDENCE) return false;
  if (observation.confidence > STRATEGIC_INTENT_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.alignmentSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainPurposeAlignmentObservation(
  observation: PurposeAlignmentObservation
): boolean {
  if (!validatePurposeAlignmentObservation(observation)) return false;
  if (
    observation.intentState === "enterprise_purpose_aligned" &&
    observation.alignmentStrength === "weak"
  ) {
    return false;
  }
  if (observation.intentState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function alignmentStrengthRank(
  strength: PurposeAlignmentObservation["alignmentStrength"]
): number {
  const ranks: Record<PurposeAlignmentObservation["alignmentStrength"], number> = {
    weak: 1,
    moderate: 2,
    aligned: 3,
    unified: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function intentStateRank(state: PurposeAlignmentObservation["intentState"]): number {
  const ranks: Record<PurposeAlignmentObservation["intentState"], number> = {
    fragmented: 1,
    partially_aligned: 2,
    directionally_coherent: 3,
    strategically_unified: 4,
    enterprise_purpose_aligned: 5,
  };
  return ranks[state];
}

export function resetStrategicIntentGuards(): void {
  lastEvalAtByOrg.clear();
  strategicIntentDepth = 0;
}
