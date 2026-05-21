import type { CollaborativeIntegrityObservation } from "./distributedGovernanceTypes";

export const DISTRIBUTED_GOVERNANCE_MAX_OBSERVATIONS = 10;
export const DISTRIBUTED_GOVERNANCE_MAX_SNAPSHOTS = 8;
export const DISTRIBUTED_GOVERNANCE_MAX_SIGNALS = 10;
export const DISTRIBUTED_GOVERNANCE_MAX_INDICATORS = 10;
export const DISTRIBUTED_GOVERNANCE_MAX_COHERENCE = 8;
export const DISTRIBUTED_GOVERNANCE_MIN_EVAL_INTERVAL_MS = 500;
export const DISTRIBUTED_GOVERNANCE_MAX_RECURSION_DEPTH = 2;
export const DISTRIBUTED_GOVERNANCE_MIN_CONFIDENCE = 0.48;
export const DISTRIBUTED_GOVERNANCE_MAX_INFLATED_CONFIDENCE = 0.94;
export const DISTRIBUTED_GOVERNANCE_MIN_UNIFIED_LAYERS = 3;
export const DISTRIBUTED_GOVERNANCE_MIN_MEMORY_SYNC_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let governanceDepth = 0;

export function beginDistributedGovernanceEvaluation(): boolean {
  if (governanceDepth >= DISTRIBUTED_GOVERNANCE_MAX_RECURSION_DEPTH) return false;
  governanceDepth += 1;
  return true;
}

export function endDistributedGovernanceEvaluation(): void {
  governanceDepth = Math.max(0, governanceDepth - 1);
}

export function shouldEvaluateDistributedGovernance(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DISTRIBUTED_GOVERNANCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampGovernanceConfidence(score: number): number {
  return Number(
    Math.min(
      DISTRIBUTED_GOVERNANCE_MAX_INFLATED_CONFIDENCE,
      Math.max(DISTRIBUTED_GOVERNANCE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateCollaborativeIntegrityObservation(
  observation: CollaborativeIntegrityObservation | null | undefined
): observation is CollaborativeIntegrityObservation {
  if (!observation) return false;
  if (!observation.governanceId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < DISTRIBUTED_GOVERNANCE_MIN_CONFIDENCE) return false;
  if (observation.confidence > DISTRIBUTED_GOVERNANCE_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.governanceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainCollaborativeIntegrityObservation(
  observation: CollaborativeIntegrityObservation
): boolean {
  if (!validateCollaborativeIntegrityObservation(observation)) return false;
  if (
    observation.governanceState === "integrity_preserved" &&
    observation.integrityStrength === "weak"
  ) {
    return false;
  }
  if (observation.governanceState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function integrityStrengthRank(
  strength: CollaborativeIntegrityObservation["integrityStrength"]
): number {
  const ranks: Record<CollaborativeIntegrityObservation["integrityStrength"], number> = {
    weak: 1,
    monitored: 2,
    stable: 3,
    governed: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function governanceStateRank(
  state: CollaborativeIntegrityObservation["governanceState"]
): number {
  const ranks: Record<CollaborativeIntegrityObservation["governanceState"], number> = {
    fragmented: 1,
    unstable: 2,
    regulated: 3,
    coherent: 4,
    integrity_preserved: 5,
  };
  return ranks[state];
}

export function resetDistributedGovernanceGuards(): void {
  lastEvalAtByOrg.clear();
  governanceDepth = 0;
}
