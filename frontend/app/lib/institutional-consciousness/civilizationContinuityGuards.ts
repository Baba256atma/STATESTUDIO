import type { EcosystemSurvivabilityObservation } from "./civilizationContinuityTypes";

export const CIVILIZATION_CONTINUITY_MAX_OBSERVATIONS = 10;
export const CIVILIZATION_CONTINUITY_MAX_SNAPSHOTS = 8;
export const CIVILIZATION_CONTINUITY_MAX_SIGNALS = 10;
export const CIVILIZATION_CONTINUITY_MAX_FIELDS = 8;
export const CIVILIZATION_CONTINUITY_MAX_TOPOLOGIES = 10;
export const CIVILIZATION_CONTINUITY_MIN_EVAL_INTERVAL_MS = 500;
export const CIVILIZATION_CONTINUITY_MAX_RECURSION_DEPTH = 2;
export const CIVILIZATION_CONTINUITY_MIN_CONFIDENCE = 0.48;
export const CIVILIZATION_CONTINUITY_MAX_INFLATED_CONFIDENCE = 0.94;
export const CIVILIZATION_CONTINUITY_MIN_UNIFIED_LAYERS = 3;
export const CIVILIZATION_CONTINUITY_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const CIVILIZATION_CONTINUITY_MIN_INFLUENCE_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let continuityDepth = 0;

export function beginCivilizationContinuityEvaluation(): boolean {
  if (continuityDepth >= CIVILIZATION_CONTINUITY_MAX_RECURSION_DEPTH) return false;
  continuityDepth += 1;
  return true;
}

export function endCivilizationContinuityEvaluation(): void {
  continuityDepth = Math.max(0, continuityDepth - 1);
}

export function shouldEvaluateCivilizationContinuity(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CIVILIZATION_CONTINUITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampCivilizationContinuityConfidence(score: number): number {
  return Number(
    Math.min(
      CIVILIZATION_CONTINUITY_MAX_INFLATED_CONFIDENCE,
      Math.max(CIVILIZATION_CONTINUITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateEcosystemSurvivabilityObservation(
  observation: EcosystemSurvivabilityObservation | null | undefined
): observation is EcosystemSurvivabilityObservation {
  if (!observation) return false;
  if (!observation.continuityId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < CIVILIZATION_CONTINUITY_MIN_CONFIDENCE) return false;
  if (observation.confidence > CIVILIZATION_CONTINUITY_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.continuitySignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainEcosystemSurvivabilityObservation(
  observation: EcosystemSurvivabilityObservation
): boolean {
  if (!validateEcosystemSurvivabilityObservation(observation)) return false;
  if (
    observation.sustainabilityState === "continuity_preserved" &&
    observation.continuityStrength === "weak"
  ) {
    return false;
  }
  if (observation.sustainabilityState === "fragile" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function continuityStrengthRank(
  strength: EcosystemSurvivabilityObservation["continuityStrength"]
): number {
  const ranks: Record<EcosystemSurvivabilityObservation["continuityStrength"], number> = {
    weak: 1,
    moderate: 2,
    stable: 3,
    resilient: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function sustainabilityStateRank(
  state: EcosystemSurvivabilityObservation["sustainabilityState"]
): number {
  const ranks: Record<EcosystemSurvivabilityObservation["sustainabilityState"], number> = {
    fragile: 1,
    pressured: 2,
    adaptive: 3,
    sustainable: 4,
    continuity_preserved: 5,
  };
  return ranks[state];
}

export function resetCivilizationContinuityGuards(): void {
  lastEvalAtByOrg.clear();
  continuityDepth = 0;
}
