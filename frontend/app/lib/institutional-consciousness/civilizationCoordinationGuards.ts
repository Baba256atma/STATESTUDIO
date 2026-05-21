import type { CoordinationStabilityObservation } from "./civilizationCoordinationTypes";

export const CIVILIZATION_COORDINATION_MAX_OBSERVATIONS = 10;
export const CIVILIZATION_COORDINATION_MAX_SNAPSHOTS = 8;
export const CIVILIZATION_COORDINATION_MAX_SIGNALS = 10;
export const CIVILIZATION_COORDINATION_MAX_FIELDS = 8;
export const CIVILIZATION_COORDINATION_MAX_TOPOLOGIES = 10;
export const CIVILIZATION_COORDINATION_MIN_EVAL_INTERVAL_MS = 500;
export const CIVILIZATION_COORDINATION_MAX_RECURSION_DEPTH = 2;
export const CIVILIZATION_COORDINATION_MIN_CONFIDENCE = 0.48;
export const CIVILIZATION_COORDINATION_MAX_INFLATED_CONFIDENCE = 0.94;
export const CIVILIZATION_COORDINATION_MIN_UNIFIED_LAYERS = 3;
export const CIVILIZATION_COORDINATION_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const CIVILIZATION_COORDINATION_MIN_ADAPTATION_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let coordinationDepth = 0;

export function beginCivilizationCoordinationEvaluation(): boolean {
  if (coordinationDepth >= CIVILIZATION_COORDINATION_MAX_RECURSION_DEPTH) return false;
  coordinationDepth += 1;
  return true;
}

export function endCivilizationCoordinationEvaluation(): void {
  coordinationDepth = Math.max(0, coordinationDepth - 1);
}

export function shouldEvaluateCivilizationCoordination(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CIVILIZATION_COORDINATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampCivilizationCoordinationConfidence(score: number): number {
  return Number(
    Math.min(
      CIVILIZATION_COORDINATION_MAX_INFLATED_CONFIDENCE,
      Math.max(CIVILIZATION_COORDINATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateCoordinationStabilityObservation(
  observation: CoordinationStabilityObservation | null | undefined
): observation is CoordinationStabilityObservation {
  if (!observation) return false;
  if (!observation.coordinationId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < CIVILIZATION_COORDINATION_MIN_CONFIDENCE) return false;
  if (observation.confidence > CIVILIZATION_COORDINATION_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.coordinationSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainCoordinationStabilityObservation(
  observation: CoordinationStabilityObservation
): boolean {
  if (!validateCoordinationStabilityObservation(observation)) return false;
  if (
    observation.harmonyState === "civilization_coherent" &&
    observation.coordinationStrength === "weak"
  ) {
    return false;
  }
  if (observation.harmonyState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function coordinationStrengthRank(
  strength: CoordinationStabilityObservation["coordinationStrength"]
): number {
  const ranks: Record<CoordinationStabilityObservation["coordinationStrength"], number> = {
    weak: 1,
    moderate: 2,
    stable: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function harmonyStateRank(state: CoordinationStabilityObservation["harmonyState"]): number {
  const ranks: Record<CoordinationStabilityObservation["harmonyState"], number> = {
    fragmented: 1,
    unstable: 2,
    coordinated: 3,
    harmonized: 4,
    civilization_coherent: 5,
  };
  return ranks[state];
}

export function resetCivilizationCoordinationGuards(): void {
  lastEvalAtByOrg.clear();
  coordinationDepth = 0;
}
