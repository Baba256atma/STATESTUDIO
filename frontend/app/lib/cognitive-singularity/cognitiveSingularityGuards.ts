import type { IntelligenceConvergenceObservation } from "./cognitiveSingularityTypes";

export const COGNITIVE_SINGULARITY_MAX_OBSERVATIONS = 10;
export const COGNITIVE_SINGULARITY_MAX_SNAPSHOTS = 8;
export const COGNITIVE_SINGULARITY_MAX_SIGNALS = 10;
export const COGNITIVE_SINGULARITY_MAX_FIELDS = 8;
export const COGNITIVE_SINGULARITY_MAX_TOPOLOGIES = 10;
export const COGNITIVE_SINGULARITY_MIN_EVAL_INTERVAL_MS = 500;
export const COGNITIVE_SINGULARITY_MAX_RECURSION_DEPTH = 2;
export const COGNITIVE_SINGULARITY_MIN_CONFIDENCE = 0.48;
export const COGNITIVE_SINGULARITY_MAX_INFLATED_CONFIDENCE = 0.94;
export const COGNITIVE_SINGULARITY_MIN_UNIFIED_RUNTIMES = 4;
export const COGNITIVE_SINGULARITY_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;

const lastEvalAtByOrg = new Map<string, number>();
let singularityDepth = 0;

export function beginCognitiveSingularityEvaluation(): boolean {
  if (singularityDepth >= COGNITIVE_SINGULARITY_MAX_RECURSION_DEPTH) return false;
  singularityDepth += 1;
  return true;
}

export function endCognitiveSingularityEvaluation(): void {
  singularityDepth = Math.max(0, singularityDepth - 1);
}

export function shouldEvaluateCognitiveSingularity(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < COGNITIVE_SINGULARITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampCognitiveSingularityConfidence(score: number): number {
  return Number(
    Math.min(
      COGNITIVE_SINGULARITY_MAX_INFLATED_CONFIDENCE,
      Math.max(COGNITIVE_SINGULARITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateIntelligenceConvergenceObservation(
  observation: IntelligenceConvergenceObservation | null | undefined
): observation is IntelligenceConvergenceObservation {
  if (!observation) return false;
  if (!observation.convergenceId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < COGNITIVE_SINGULARITY_MIN_CONFIDENCE) return false;
  if (observation.confidence > COGNITIVE_SINGULARITY_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.convergenceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainIntelligenceConvergenceObservation(
  observation: IntelligenceConvergenceObservation
): boolean {
  if (!validateIntelligenceConvergenceObservation(observation)) return false;
  if (
    observation.cognitionState === "strategically_coherent" &&
    observation.convergenceStrength === "weak"
  ) {
    return false;
  }
  if (observation.cognitionState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function convergenceStrengthRank(
  strength: IntelligenceConvergenceObservation["convergenceStrength"]
): number {
  const ranks: Record<IntelligenceConvergenceObservation["convergenceStrength"], number> = {
    weak: 1,
    moderate: 2,
    synchronized: 3,
    unified: 4,
    enterprise_singularity: 5,
  };
  return ranks[strength];
}

export function cognitionStateRank(state: IntelligenceConvergenceObservation["cognitionState"]): number {
  const ranks: Record<IntelligenceConvergenceObservation["cognitionState"], number> = {
    fragmented: 1,
    partially_aligned: 2,
    converging: 3,
    unified: 4,
    strategically_coherent: 5,
  };
  return ranks[state];
}

export function resetCognitiveSingularityGuards(): void {
  lastEvalAtByOrg.clear();
  singularityDepth = 0;
}
