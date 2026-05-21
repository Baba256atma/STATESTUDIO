import type { ExecutiveTrustObservation } from "./reasoningIntegrityTypes";

export const REASONING_INTEGRITY_MAX_OBSERVATIONS = 10;
export const REASONING_INTEGRITY_MAX_SNAPSHOTS = 8;
export const REASONING_INTEGRITY_MAX_SIGNALS = 10;
export const REASONING_INTEGRITY_MAX_CONTRADICTIONS = 10;
export const REASONING_INTEGRITY_MAX_ALIGNMENTS = 8;
export const REASONING_INTEGRITY_MIN_EVAL_INTERVAL_MS = 500;
export const REASONING_INTEGRITY_MAX_RECURSION_DEPTH = 2;
export const REASONING_INTEGRITY_MIN_CONFIDENCE = 0.48;
export const REASONING_INTEGRITY_MAX_INFLATED_CONFIDENCE = 0.94;
export const REASONING_INTEGRITY_MIN_UNIFIED_LAYERS = 3;
export const REASONING_INTEGRITY_MIN_META_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let verificationDepth = 0;

export function beginReasoningIntegrityEvaluation(): boolean {
  if (verificationDepth >= REASONING_INTEGRITY_MAX_RECURSION_DEPTH) return false;
  verificationDepth += 1;
  return true;
}

export function endReasoningIntegrityEvaluation(): void {
  verificationDepth = Math.max(0, verificationDepth - 1);
}

export function shouldEvaluateReasoningIntegrity(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < REASONING_INTEGRITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampIntegrityConfidence(score: number): number {
  return Number(
    Math.min(
      REASONING_INTEGRITY_MAX_INFLATED_CONFIDENCE,
      Math.max(REASONING_INTEGRITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateExecutiveTrustObservation(
  observation: ExecutiveTrustObservation | null | undefined
): observation is ExecutiveTrustObservation {
  if (!observation) return false;
  if (!observation.integrityId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < REASONING_INTEGRITY_MIN_CONFIDENCE) return false;
  if (observation.confidence > REASONING_INTEGRITY_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.consistencySignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainExecutiveTrustObservation(
  observation: ExecutiveTrustObservation
): boolean {
  if (!validateExecutiveTrustObservation(observation)) return false;
  if (observation.consistencyState === "verified" && observation.confidence < 0.72) {
    return false;
  }
  if (observation.consistencyState === "contradictory" && observation.confidence > 0.88) {
    return false;
  }
  return true;
}

export function integrityStrengthRank(
  strength: ExecutiveTrustObservation["integrityStrength"]
): number {
  const ranks: Record<ExecutiveTrustObservation["integrityStrength"], number> = {
    weak: 1,
    monitored: 2,
    stable: 3,
    strong: 4,
    executive_grade: 5,
  };
  return ranks[strength];
}

export function consistencyStateRank(
  state: ExecutiveTrustObservation["consistencyState"]
): number {
  const ranks: Record<ExecutiveTrustObservation["consistencyState"], number> = {
    contradictory: 1,
    fragmented: 2,
    partially_aligned: 3,
    coherent: 4,
    verified: 5,
  };
  return ranks[state];
}

export function resetReasoningIntegrityGuards(): void {
  lastEvalAtByOrg.clear();
  verificationDepth = 0;
}
