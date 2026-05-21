import type { AwarenessSynchronizationObservation } from "./awarenessSynchronizationTypes";

export const AWARENESS_SYNC_MAX_OBSERVATIONS = 10;
export const AWARENESS_SYNC_MAX_SNAPSHOTS = 8;
export const AWARENESS_SYNC_MAX_SIGNALS = 10;
export const AWARENESS_SYNC_MAX_FIELDS = 8;
export const AWARENESS_SYNC_MAX_ALIGNMENTS = 10;
export const AWARENESS_SYNC_MAX_FRAGMENTATION_INDICATORS = 10;
export const AWARENESS_SYNC_MIN_EVAL_INTERVAL_MS = 500;
export const AWARENESS_SYNC_MAX_RECURSION_DEPTH = 2;
export const AWARENESS_SYNC_MIN_CONFIDENCE = 0.48;
export const AWARENESS_SYNC_MAX_INFLATED_CONFIDENCE = 0.94;
export const AWARENESS_SYNC_MIN_UNIFIED_RUNTIMES = 4;
export const AWARENESS_SYNC_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const AWARENESS_SYNC_MIN_SINGULARITY_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let synchronizationDepth = 0;

export function beginAwarenessSynchronizationEvaluation(): boolean {
  if (synchronizationDepth >= AWARENESS_SYNC_MAX_RECURSION_DEPTH) return false;
  synchronizationDepth += 1;
  return true;
}

export function endAwarenessSynchronizationEvaluation(): void {
  synchronizationDepth = Math.max(0, synchronizationDepth - 1);
}

export function shouldEvaluateAwarenessSynchronization(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < AWARENESS_SYNC_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampAwarenessSynchronizationConfidence(score: number): number {
  return Number(
    Math.min(
      AWARENESS_SYNC_MAX_INFLATED_CONFIDENCE,
      Math.max(AWARENESS_SYNC_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateAwarenessSynchronizationObservation(
  observation: AwarenessSynchronizationObservation | null | undefined
): observation is AwarenessSynchronizationObservation {
  if (!observation) return false;
  if (!observation.synchronizationId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < AWARENESS_SYNC_MIN_CONFIDENCE) return false;
  if (observation.confidence > AWARENESS_SYNC_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.synchronizedDomains.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainAwarenessSynchronizationObservation(
  observation: AwarenessSynchronizationObservation
): boolean {
  if (!validateAwarenessSynchronizationObservation(observation)) return false;
  if (
    observation.awarenessState === "strategically_coherent" &&
    observation.synchronizationStrength === "weak"
  ) {
    return false;
  }
  if (observation.awarenessState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function synchronizationStrengthRank(
  strength: AwarenessSynchronizationObservation["synchronizationStrength"]
): number {
  const ranks: Record<AwarenessSynchronizationObservation["synchronizationStrength"], number> = {
    weak: 1,
    moderate: 2,
    synchronized: 3,
    unified: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function awarenessStateRank(
  state: AwarenessSynchronizationObservation["awarenessState"]
): number {
  const ranks: Record<AwarenessSynchronizationObservation["awarenessState"], number> = {
    fragmented: 1,
    partially_aligned: 2,
    synchronized: 3,
    unified: 4,
    strategically_coherent: 5,
  };
  return ranks[state];
}

export function resetAwarenessSynchronizationGuards(): void {
  lastEvalAtByOrg.clear();
  synchronizationDepth = 0;
}
