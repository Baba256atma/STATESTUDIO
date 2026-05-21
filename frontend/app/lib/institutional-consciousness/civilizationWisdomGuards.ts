import type { LongHorizonWisdomObservation } from "./civilizationWisdomTypes";

export const CIVILIZATION_WISDOM_MAX_OBSERVATIONS = 10;
export const CIVILIZATION_WISDOM_MAX_SNAPSHOTS = 8;
export const CIVILIZATION_WISDOM_MAX_SIGNALS = 10;
export const CIVILIZATION_WISDOM_MAX_FIELDS = 8;
export const CIVILIZATION_WISDOM_MAX_TOPOLOGIES = 10;
export const CIVILIZATION_WISDOM_MIN_EVAL_INTERVAL_MS = 500;
export const CIVILIZATION_WISDOM_MAX_RECURSION_DEPTH = 2;
export const CIVILIZATION_WISDOM_MIN_CONFIDENCE = 0.48;
export const CIVILIZATION_WISDOM_MAX_INFLATED_CONFIDENCE = 0.94;
export const CIVILIZATION_WISDOM_MIN_UNIFIED_LAYERS = 3;
export const CIVILIZATION_WISDOM_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const CIVILIZATION_WISDOM_MIN_COORDINATION_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let wisdomDepth = 0;

export function beginCivilizationWisdomEvaluation(): boolean {
  if (wisdomDepth >= CIVILIZATION_WISDOM_MAX_RECURSION_DEPTH) return false;
  wisdomDepth += 1;
  return true;
}

export function endCivilizationWisdomEvaluation(): void {
  wisdomDepth = Math.max(0, wisdomDepth - 1);
}

export function shouldEvaluateCivilizationWisdom(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CIVILIZATION_WISDOM_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampCivilizationWisdomConfidence(score: number): number {
  return Number(
    Math.min(
      CIVILIZATION_WISDOM_MAX_INFLATED_CONFIDENCE,
      Math.max(CIVILIZATION_WISDOM_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateLongHorizonWisdomObservation(
  observation: LongHorizonWisdomObservation | null | undefined
): observation is LongHorizonWisdomObservation {
  if (!observation) return false;
  if (!observation.wisdomId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < CIVILIZATION_WISDOM_MIN_CONFIDENCE) return false;
  if (observation.confidence > CIVILIZATION_WISDOM_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.wisdomSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainLongHorizonWisdomObservation(
  observation: LongHorizonWisdomObservation
): boolean {
  if (!validateLongHorizonWisdomObservation(observation)) return false;
  if (
    observation.convergenceState === "wisdom_stabilized" &&
    observation.wisdomStrength === "weak"
  ) {
    return false;
  }
  if (observation.convergenceState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function wisdomStrengthRank(
  strength: LongHorizonWisdomObservation["wisdomStrength"]
): number {
  const ranks: Record<LongHorizonWisdomObservation["wisdomStrength"], number> = {
    weak: 1,
    moderate: 2,
    mature: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function convergenceStateRank(
  state: LongHorizonWisdomObservation["convergenceState"]
): number {
  const ranks: Record<LongHorizonWisdomObservation["convergenceState"], number> = {
    fragmented: 1,
    emerging: 2,
    adaptive: 3,
    converging: 4,
    wisdom_stabilized: 5,
  };
  return ranks[state];
}

export function resetCivilizationWisdomGuards(): void {
  lastEvalAtByOrg.clear();
  wisdomDepth = 0;
}
