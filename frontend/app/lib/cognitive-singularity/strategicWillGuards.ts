import type { EnterpriseCommitmentObservation } from "./strategicWillTypes";

export const STRATEGIC_WILL_MAX_OBSERVATIONS = 10;
export const STRATEGIC_WILL_MAX_SNAPSHOTS = 8;
export const STRATEGIC_WILL_MAX_SIGNALS = 10;
export const STRATEGIC_WILL_MAX_FIELDS = 8;
export const STRATEGIC_WILL_MAX_FRAGMENTATION_INDICATORS = 10;
export const STRATEGIC_WILL_MIN_EVAL_INTERVAL_MS = 500;
export const STRATEGIC_WILL_MAX_RECURSION_DEPTH = 2;
export const STRATEGIC_WILL_MIN_CONFIDENCE = 0.48;
export const STRATEGIC_WILL_MAX_INFLATED_CONFIDENCE = 0.94;
export const STRATEGIC_WILL_MIN_UNIFIED_RUNTIMES = 4;
export const STRATEGIC_WILL_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const STRATEGIC_WILL_MIN_STRATEGIC_IDENTITY_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let strategicWillDepth = 0;

export function beginStrategicWillEvaluation(): boolean {
  if (strategicWillDepth >= STRATEGIC_WILL_MAX_RECURSION_DEPTH) return false;
  strategicWillDepth += 1;
  return true;
}

export function endStrategicWillEvaluation(): void {
  strategicWillDepth = Math.max(0, strategicWillDepth - 1);
}

export function shouldEvaluateStrategicWill(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRATEGIC_WILL_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampStrategicWillConfidence(score: number): number {
  return Number(
    Math.min(
      STRATEGIC_WILL_MAX_INFLATED_CONFIDENCE,
      Math.max(STRATEGIC_WILL_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateEnterpriseCommitmentObservation(
  observation: EnterpriseCommitmentObservation | null | undefined
): observation is EnterpriseCommitmentObservation {
  if (!observation) return false;
  if (!observation.willId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < STRATEGIC_WILL_MIN_CONFIDENCE) return false;
  if (observation.confidence > STRATEGIC_WILL_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.commitmentSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainEnterpriseCommitmentObservation(
  observation: EnterpriseCommitmentObservation
): boolean {
  if (!validateEnterpriseCommitmentObservation(observation)) return false;
  if (
    observation.willState === "strategically_committed" &&
    observation.commitmentStrength === "weak"
  ) {
    return false;
  }
  if (observation.willState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function commitmentStrengthRank(
  strength: EnterpriseCommitmentObservation["commitmentStrength"]
): number {
  const ranks: Record<EnterpriseCommitmentObservation["commitmentStrength"], number> = {
    weak: 1,
    moderate: 2,
    committed: 3,
    strongly_committed: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function willStateRank(state: EnterpriseCommitmentObservation["willState"]): number {
  const ranks: Record<EnterpriseCommitmentObservation["willState"], number> = {
    fragmented: 1,
    hesitant: 2,
    partially_committed: 3,
    directionally_committed: 4,
    strategically_committed: 5,
  };
  return ranks[state];
}

export function resetStrategicWillGuards(): void {
  lastEvalAtByOrg.clear();
  strategicWillDepth = 0;
}
