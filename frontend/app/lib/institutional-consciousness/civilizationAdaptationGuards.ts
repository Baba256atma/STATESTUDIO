import type { LongHorizonEvolutionObservation } from "./civilizationAdaptationTypes";

export const CIVILIZATION_ADAPTATION_MAX_OBSERVATIONS = 10;
export const CIVILIZATION_ADAPTATION_MAX_SNAPSHOTS = 8;
export const CIVILIZATION_ADAPTATION_MAX_SIGNALS = 10;
export const CIVILIZATION_ADAPTATION_MAX_FIELDS = 8;
export const CIVILIZATION_ADAPTATION_MAX_TOPOLOGIES = 10;
export const CIVILIZATION_ADAPTATION_MIN_EVAL_INTERVAL_MS = 500;
export const CIVILIZATION_ADAPTATION_MAX_RECURSION_DEPTH = 2;
export const CIVILIZATION_ADAPTATION_MIN_CONFIDENCE = 0.48;
export const CIVILIZATION_ADAPTATION_MAX_INFLATED_CONFIDENCE = 0.94;
export const CIVILIZATION_ADAPTATION_MIN_UNIFIED_LAYERS = 3;
export const CIVILIZATION_ADAPTATION_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const CIVILIZATION_ADAPTATION_MIN_CONTINUITY_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let adaptationDepth = 0;

export function beginCivilizationAdaptationEvaluation(): boolean {
  if (adaptationDepth >= CIVILIZATION_ADAPTATION_MAX_RECURSION_DEPTH) return false;
  adaptationDepth += 1;
  return true;
}

export function endCivilizationAdaptationEvaluation(): void {
  adaptationDepth = Math.max(0, adaptationDepth - 1);
}

export function shouldEvaluateCivilizationAdaptation(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CIVILIZATION_ADAPTATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampCivilizationAdaptationConfidence(score: number): number {
  return Number(
    Math.min(
      CIVILIZATION_ADAPTATION_MAX_INFLATED_CONFIDENCE,
      Math.max(CIVILIZATION_ADAPTATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateLongHorizonEvolutionObservation(
  observation: LongHorizonEvolutionObservation | null | undefined
): observation is LongHorizonEvolutionObservation {
  if (!observation) return false;
  if (!observation.adaptationId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < CIVILIZATION_ADAPTATION_MIN_CONFIDENCE) return false;
  if (observation.confidence > CIVILIZATION_ADAPTATION_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.adaptationSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainLongHorizonEvolutionObservation(
  observation: LongHorizonEvolutionObservation
): boolean {
  if (!validateLongHorizonEvolutionObservation(observation)) return false;
  if (
    observation.evolutionState === "evolutionarily_stable" &&
    observation.adaptationStrength === "weak"
  ) {
    return false;
  }
  if (observation.evolutionState === "static" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function adaptationStrengthRank(
  strength: LongHorizonEvolutionObservation["adaptationStrength"]
): number {
  const ranks: Record<LongHorizonEvolutionObservation["adaptationStrength"], number> = {
    weak: 1,
    moderate: 2,
    adaptive: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function evolutionStateRank(
  state: LongHorizonEvolutionObservation["evolutionState"]
): number {
  const ranks: Record<LongHorizonEvolutionObservation["evolutionState"], number> = {
    static: 1,
    shifting: 2,
    adaptive: 3,
    reorganizing: 4,
    evolutionarily_stable: 5,
  };
  return ranks[state];
}

export function resetCivilizationAdaptationGuards(): void {
  lastEvalAtByOrg.clear();
  adaptationDepth = 0;
}
