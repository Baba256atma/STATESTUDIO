import type { LongHorizonStewardshipObservation } from "./civilizationStewardshipTypes";

export const CIVILIZATION_STEWARDSHIP_MAX_OBSERVATIONS = 10;
export const CIVILIZATION_STEWARDSHIP_MAX_SNAPSHOTS = 8;
export const CIVILIZATION_STEWARDSHIP_MAX_SIGNALS = 10;
export const CIVILIZATION_STEWARDSHIP_MAX_FIELDS = 8;
export const CIVILIZATION_STEWARDSHIP_MAX_TOPOLOGIES = 10;
export const CIVILIZATION_STEWARDSHIP_MIN_EVAL_INTERVAL_MS = 500;
export const CIVILIZATION_STEWARDSHIP_MAX_RECURSION_DEPTH = 2;
export const CIVILIZATION_STEWARDSHIP_MIN_CONFIDENCE = 0.48;
export const CIVILIZATION_STEWARDSHIP_MAX_INFLATED_CONFIDENCE = 0.94;
export const CIVILIZATION_STEWARDSHIP_MIN_UNIFIED_LAYERS = 3;
export const CIVILIZATION_STEWARDSHIP_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const CIVILIZATION_STEWARDSHIP_MIN_WISDOM_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let stewardshipDepth = 0;

export function beginCivilizationStewardshipEvaluation(): boolean {
  if (stewardshipDepth >= CIVILIZATION_STEWARDSHIP_MAX_RECURSION_DEPTH) return false;
  stewardshipDepth += 1;
  return true;
}

export function endCivilizationStewardshipEvaluation(): void {
  stewardshipDepth = Math.max(0, stewardshipDepth - 1);
}

export function shouldEvaluateCivilizationStewardship(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CIVILIZATION_STEWARDSHIP_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampCivilizationStewardshipConfidence(score: number): number {
  return Number(
    Math.min(
      CIVILIZATION_STEWARDSHIP_MAX_INFLATED_CONFIDENCE,
      Math.max(CIVILIZATION_STEWARDSHIP_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateLongHorizonStewardshipObservation(
  observation: LongHorizonStewardshipObservation | null | undefined
): observation is LongHorizonStewardshipObservation {
  if (!observation) return false;
  if (!observation.stewardshipId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < CIVILIZATION_STEWARDSHIP_MIN_CONFIDENCE) return false;
  if (observation.confidence > CIVILIZATION_STEWARDSHIP_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.stewardshipSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainLongHorizonStewardshipObservation(
  observation: LongHorizonStewardshipObservation
): boolean {
  if (!validateLongHorizonStewardshipObservation(observation)) return false;
  if (
    observation.preservationState === "sustainably_preserved" &&
    observation.stewardshipStrength === "weak"
  ) {
    return false;
  }
  if (observation.preservationState === "degrading" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function stewardshipStrengthRank(
  strength: LongHorizonStewardshipObservation["stewardshipStrength"]
): number {
  const ranks: Record<LongHorizonStewardshipObservation["stewardshipStrength"], number> = {
    weak: 1,
    moderate: 2,
    resilient: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function preservationStateRank(
  state: LongHorizonStewardshipObservation["preservationState"]
): number {
  const ranks: Record<LongHorizonStewardshipObservation["preservationState"], number> = {
    degrading: 1,
    pressured: 2,
    protected: 3,
    reinforced: 4,
    sustainably_preserved: 5,
  };
  return ranks[state];
}

export function resetCivilizationStewardshipGuards(): void {
  lastEvalAtByOrg.clear();
  stewardshipDepth = 0;
}
