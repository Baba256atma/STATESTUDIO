import type { CascadingInstabilityObservation } from "./civilizationFragilityTypes";

export const CIVILIZATION_FRAGILITY_MAX_OBSERVATIONS = 10;
export const CIVILIZATION_FRAGILITY_MAX_SNAPSHOTS = 8;
export const CIVILIZATION_FRAGILITY_MAX_SIGNALS = 10;
export const CIVILIZATION_FRAGILITY_MAX_FIELDS = 8;
export const CIVILIZATION_FRAGILITY_MAX_TOPOLOGIES = 10;
export const CIVILIZATION_FRAGILITY_MIN_EVAL_INTERVAL_MS = 500;
export const CIVILIZATION_FRAGILITY_MAX_RECURSION_DEPTH = 2;
export const CIVILIZATION_FRAGILITY_MIN_CONFIDENCE = 0.48;
export const CIVILIZATION_FRAGILITY_MAX_INFLATED_CONFIDENCE = 0.94;
export const CIVILIZATION_FRAGILITY_MIN_UNIFIED_LAYERS = 3;
export const CIVILIZATION_FRAGILITY_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const CIVILIZATION_FRAGILITY_MIN_ECOSYSTEM_SYNC_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let fragilityDepth = 0;

export function beginCivilizationFragilityEvaluation(): boolean {
  if (fragilityDepth >= CIVILIZATION_FRAGILITY_MAX_RECURSION_DEPTH) return false;
  fragilityDepth += 1;
  return true;
}

export function endCivilizationFragilityEvaluation(): void {
  fragilityDepth = Math.max(0, fragilityDepth - 1);
}

export function shouldEvaluateCivilizationFragility(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < CIVILIZATION_FRAGILITY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampCivilizationFragilityConfidence(score: number): number {
  return Number(
    Math.min(
      CIVILIZATION_FRAGILITY_MAX_INFLATED_CONFIDENCE,
      Math.max(CIVILIZATION_FRAGILITY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateCascadingInstabilityObservation(
  observation: CascadingInstabilityObservation | null | undefined
): observation is CascadingInstabilityObservation {
  if (!observation) return false;
  if (!observation.fragilityId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < CIVILIZATION_FRAGILITY_MIN_CONFIDENCE) return false;
  if (observation.confidence > CIVILIZATION_FRAGILITY_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.propagationSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainCascadingInstabilityObservation(
  observation: CascadingInstabilityObservation
): boolean {
  if (!validateCascadingInstabilityObservation(observation)) return false;
  if (
    observation.resilienceState === "macro_stabilized" &&
    observation.propagationStrength === "weak"
  ) {
    return false;
  }
  if (observation.resilienceState === "unstable" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function propagationStrengthRank(
  strength: CascadingInstabilityObservation["propagationStrength"]
): number {
  const ranks: Record<CascadingInstabilityObservation["propagationStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function resilienceStateRank(
  state: CascadingInstabilityObservation["resilienceState"]
): number {
  const ranks: Record<CascadingInstabilityObservation["resilienceState"], number> = {
    unstable: 1,
    pressured: 2,
    adaptive: 3,
    resilient: 4,
    macro_stabilized: 5,
  };
  return ranks[state];
}

export function resetCivilizationFragilityGuards(): void {
  lastEvalAtByOrg.clear();
  fragilityDepth = 0;
}
