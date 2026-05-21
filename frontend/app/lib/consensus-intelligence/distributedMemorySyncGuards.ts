import type { CollaborativeContinuityObservation } from "./distributedMemorySyncTypes";

export const DISTRIBUTED_MEMORY_SYNC_MAX_OBSERVATIONS = 10;
export const DISTRIBUTED_MEMORY_SYNC_MAX_SNAPSHOTS = 8;
export const DISTRIBUTED_MEMORY_SYNC_MAX_SIGNALS = 10;
export const DISTRIBUTED_MEMORY_SYNC_MAX_DIVERGENCE = 10;
export const DISTRIBUTED_MEMORY_SYNC_MAX_ALIGNMENT = 8;
export const DISTRIBUTED_MEMORY_SYNC_MIN_EVAL_INTERVAL_MS = 500;
export const DISTRIBUTED_MEMORY_SYNC_MAX_RECURSION_DEPTH = 2;
export const DISTRIBUTED_MEMORY_SYNC_MIN_CONFIDENCE = 0.48;
export const DISTRIBUTED_MEMORY_SYNC_MAX_INFLATED_CONFIDENCE = 0.94;
export const DISTRIBUTED_MEMORY_SYNC_MIN_UNIFIED_LAYERS = 3;
export const DISTRIBUTED_MEMORY_SYNC_MIN_COLLECTIVE_LEARNING_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let syncDepth = 0;

export function beginDistributedMemorySyncEvaluation(): boolean {
  if (syncDepth >= DISTRIBUTED_MEMORY_SYNC_MAX_RECURSION_DEPTH) return false;
  syncDepth += 1;
  return true;
}

export function endDistributedMemorySyncEvaluation(): void {
  syncDepth = Math.max(0, syncDepth - 1);
}

export function shouldEvaluateDistributedMemorySync(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DISTRIBUTED_MEMORY_SYNC_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampSyncConfidence(score: number): number {
  return Number(
    Math.min(
      DISTRIBUTED_MEMORY_SYNC_MAX_INFLATED_CONFIDENCE,
      Math.max(DISTRIBUTED_MEMORY_SYNC_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateCollaborativeContinuityObservation(
  observation: CollaborativeContinuityObservation | null | undefined
): observation is CollaborativeContinuityObservation {
  if (!observation) return false;
  if (!observation.synchronizationId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < DISTRIBUTED_MEMORY_SYNC_MIN_CONFIDENCE) return false;
  if (observation.confidence > DISTRIBUTED_MEMORY_SYNC_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.synchronizationSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainCollaborativeContinuityObservation(
  observation: CollaborativeContinuityObservation
): boolean {
  if (!validateCollaborativeContinuityObservation(observation)) return false;
  if (
    observation.continuityState === "continuous" &&
    observation.synchronizationStrength === "weak"
  ) {
    return false;
  }
  if (observation.continuityState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function synchronizationStrengthRank(
  strength: CollaborativeContinuityObservation["synchronizationStrength"]
): number {
  const ranks: Record<CollaborativeContinuityObservation["synchronizationStrength"], number> = {
    weak: 1,
    partial: 2,
    stable: 3,
    synchronized: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function continuityStateRank(
  state: CollaborativeContinuityObservation["continuityState"]
): number {
  const ranks: Record<CollaborativeContinuityObservation["continuityState"], number> = {
    fragmented: 1,
    drifting: 2,
    aligned: 3,
    synchronized: 4,
    continuous: 5,
  };
  return ranks[state];
}

export function resetDistributedMemorySyncGuards(): void {
  lastEvalAtByOrg.clear();
  syncDepth = 0;
}
