import type { CognitiveConstraintObservation } from "./cognitiveGovernanceTypes";

export const COGNITIVE_GOVERNANCE_MAX_OBSERVATIONS = 10;
export const COGNITIVE_GOVERNANCE_MAX_SNAPSHOTS = 8;
export const COGNITIVE_GOVERNANCE_MAX_SIGNALS = 10;
export const COGNITIVE_GOVERNANCE_MAX_INDICATORS = 10;
export const COGNITIVE_GOVERNANCE_MAX_INTEGRITY_FIELDS = 8;
export const COGNITIVE_GOVERNANCE_MIN_EVAL_INTERVAL_MS = 500;
export const COGNITIVE_GOVERNANCE_MAX_RECURSION_DEPTH = 2;
export const COGNITIVE_GOVERNANCE_MIN_CONFIDENCE = 0.48;
export const COGNITIVE_GOVERNANCE_MAX_INFLATED_CONFIDENCE = 0.94;
export const COGNITIVE_GOVERNANCE_MIN_UNIFIED_LAYERS = 3;
export const COGNITIVE_GOVERNANCE_MIN_ADAPTATION_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let governanceDepth = 0;

export function beginCognitiveGovernanceEvaluation(): boolean {
  if (governanceDepth >= COGNITIVE_GOVERNANCE_MAX_RECURSION_DEPTH) return false;
  governanceDepth += 1;
  return true;
}

export function endCognitiveGovernanceEvaluation(): void {
  governanceDepth = Math.max(0, governanceDepth - 1);
}

export function shouldEvaluateCognitiveGovernance(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < COGNITIVE_GOVERNANCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampGovernanceConfidence(score: number): number {
  return Number(
    Math.min(
      COGNITIVE_GOVERNANCE_MAX_INFLATED_CONFIDENCE,
      Math.max(COGNITIVE_GOVERNANCE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateCognitiveConstraintObservation(
  observation: CognitiveConstraintObservation | null | undefined
): observation is CognitiveConstraintObservation {
  if (!observation) return false;
  if (!observation.governanceId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < COGNITIVE_GOVERNANCE_MIN_CONFIDENCE) return false;
  if (observation.confidence > COGNITIVE_GOVERNANCE_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.governanceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainCognitiveConstraintObservation(
  observation: CognitiveConstraintObservation
): boolean {
  if (!validateCognitiveConstraintObservation(observation)) return false;
  if (observation.regulationState === "self_regulated" && observation.governanceStrength === "weak") {
    return false;
  }
  if (observation.regulationState === "unrestricted" && observation.confidence > 0.9) {
    return false;
  }
  return true;
}

export function governanceStrengthRank(
  strength: CognitiveConstraintObservation["governanceStrength"]
): number {
  const ranks: Record<CognitiveConstraintObservation["governanceStrength"], number> = {
    weak: 1,
    monitored: 2,
    stable: 3,
    governed: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function regulationStateRank(
  state: CognitiveConstraintObservation["regulationState"]
): number {
  const ranks: Record<CognitiveConstraintObservation["regulationState"], number> = {
    unrestricted: 1,
    monitored: 2,
    constrained: 3,
    stabilized: 4,
    self_regulated: 5,
  };
  return ranks[state];
}

export function resetCognitiveGovernanceGuards(): void {
  lastEvalAtByOrg.clear();
  governanceDepth = 0;
}
