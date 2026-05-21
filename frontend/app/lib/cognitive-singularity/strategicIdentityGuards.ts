import type { IdentityAlignmentObservation } from "./strategicIdentityTypes";

export const STRATEGIC_IDENTITY_MAX_OBSERVATIONS = 10;
export const STRATEGIC_IDENTITY_MAX_SNAPSHOTS = 8;
export const STRATEGIC_IDENTITY_MAX_SIGNALS = 10;
export const STRATEGIC_IDENTITY_MAX_FIELDS = 8;
export const STRATEGIC_IDENTITY_MAX_DRIFT_INDICATORS = 10;
export const STRATEGIC_IDENTITY_MIN_EVAL_INTERVAL_MS = 500;
export const STRATEGIC_IDENTITY_MAX_RECURSION_DEPTH = 2;
export const STRATEGIC_IDENTITY_MIN_CONFIDENCE = 0.48;
export const STRATEGIC_IDENTITY_MAX_INFLATED_CONFIDENCE = 0.94;
export const STRATEGIC_IDENTITY_MIN_UNIFIED_RUNTIMES = 4;
export const STRATEGIC_IDENTITY_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const STRATEGIC_IDENTITY_MIN_STRATEGIC_INTENT_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let strategicIdentityDepth = 0;

export function beginStrategicIdentityEvaluation(): boolean {
  if (strategicIdentityDepth >= STRATEGIC_IDENTITY_MAX_RECURSION_DEPTH) return false;
  strategicIdentityDepth += 1;
  return true;
}

export function endStrategicIdentityEvaluation(): void {
  strategicIdentityDepth = Math.max(0, strategicIdentityDepth - 1);
}

export function shouldEvaluateStrategicIdentity(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRATEGIC_IDENTITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampStrategicIdentityConfidence(score: number): number {
  return Number(
    Math.min(
      STRATEGIC_IDENTITY_MAX_INFLATED_CONFIDENCE,
      Math.max(STRATEGIC_IDENTITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateIdentityAlignmentObservation(
  observation: IdentityAlignmentObservation | null | undefined
): observation is IdentityAlignmentObservation {
  if (!observation) return false;
  if (!observation.identityId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < STRATEGIC_IDENTITY_MIN_CONFIDENCE) return false;
  if (observation.confidence > STRATEGIC_IDENTITY_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.consistencySignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainIdentityAlignmentObservation(
  observation: IdentityAlignmentObservation
): boolean {
  if (!validateIdentityAlignmentObservation(observation)) return false;
  if (
    observation.identityState === "strategically_integrated" &&
    observation.consistencyLevel === "weak"
  ) {
    return false;
  }
  if (observation.identityState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function consistencyLevelRank(
  level: IdentityAlignmentObservation["consistencyLevel"]
): number {
  const ranks: Record<IdentityAlignmentObservation["consistencyLevel"], number> = {
    weak: 1,
    moderate: 2,
    aligned: 3,
    strong: 4,
    enterprise_grade: 5,
  };
  return ranks[level];
}

export function identityStateRank(state: IdentityAlignmentObservation["identityState"]): number {
  const ranks: Record<IdentityAlignmentObservation["identityState"], number> = {
    fragmented: 1,
    drifting: 2,
    partially_consistent: 3,
    self_consistent: 4,
    strategically_integrated: 5,
  };
  return ranks[state];
}

export function resetStrategicIdentityGuards(): void {
  lastEvalAtByOrg.clear();
  strategicIdentityDepth = 0;
}
