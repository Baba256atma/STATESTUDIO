import type { DiversityResilienceObservation } from "./diversityPreservationTypes";

export const DIVERSITY_PRESERVATION_MAX_OBSERVATIONS = 10;
export const DIVERSITY_PRESERVATION_MAX_SNAPSHOTS = 8;
export const DIVERSITY_PRESERVATION_MAX_INDICATORS = 10;
export const DIVERSITY_PRESERVATION_MAX_SIGNALS = 10;
export const DIVERSITY_PRESERVATION_MAX_FIELDS = 8;
export const DIVERSITY_PRESERVATION_MIN_EVAL_INTERVAL_MS = 500;
export const DIVERSITY_PRESERVATION_MAX_RECURSION_DEPTH = 2;
export const DIVERSITY_PRESERVATION_MIN_CONFIDENCE = 0.48;
export const DIVERSITY_PRESERVATION_MAX_INFLATED_CONFIDENCE = 0.94;
export const DIVERSITY_PRESERVATION_MIN_UNIFIED_LAYERS = 3;
export const DIVERSITY_PRESERVATION_MIN_DEBATE_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let diversityDepth = 0;

export function beginDiversityPreservationEvaluation(): boolean {
  if (diversityDepth >= DIVERSITY_PRESERVATION_MAX_RECURSION_DEPTH) return false;
  diversityDepth += 1;
  return true;
}

export function endDiversityPreservationEvaluation(): void {
  diversityDepth = Math.max(0, diversityDepth - 1);
}

export function shouldEvaluateDiversityPreservation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < DIVERSITY_PRESERVATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampDiversityConfidence(score: number): number {
  return Number(
    Math.min(
      DIVERSITY_PRESERVATION_MAX_INFLATED_CONFIDENCE,
      Math.max(DIVERSITY_PRESERVATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateDiversityResilienceObservation(
  observation: DiversityResilienceObservation | null | undefined
): observation is DiversityResilienceObservation {
  if (!observation) return false;
  if (!observation.diversityId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < DIVERSITY_PRESERVATION_MIN_CONFIDENCE) return false;
  if (observation.confidence > DIVERSITY_PRESERVATION_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.diversitySignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainDiversityResilienceObservation(
  observation: DiversityResilienceObservation
): boolean {
  if (!validateDiversityResilienceObservation(observation)) return false;
  if (observation.pluralityState === "resilient" && observation.fragilityStrength === "weak") {
    return false;
  }
  if (observation.pluralityState === "collapsed" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function fragilityStrengthRank(
  strength: DiversityResilienceObservation["fragilityStrength"]
): number {
  const ranks: Record<DiversityResilienceObservation["fragilityStrength"], number> = {
    weak: 1,
    monitored: 2,
    elevated: 3,
    dangerous: 4,
    systemic: 5,
  };
  return ranks[strength];
}

export function pluralityStateRank(state: DiversityResilienceObservation["pluralityState"]): number {
  const ranks: Record<DiversityResilienceObservation["pluralityState"], number> = {
    collapsed: 1,
    narrowing: 2,
    diverse: 3,
    balanced: 4,
    resilient: 5,
  };
  return ranks[state];
}

export function resetDiversityPreservationGuards(): void {
  lastEvalAtByOrg.clear();
  diversityDepth = 0;
}
