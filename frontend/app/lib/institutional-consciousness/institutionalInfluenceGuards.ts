import type { MacroInfluenceObservation } from "./institutionalInfluenceTypes";

export const INSTITUTIONAL_INFLUENCE_MAX_OBSERVATIONS = 10;
export const INSTITUTIONAL_INFLUENCE_MAX_SNAPSHOTS = 8;
export const INSTITUTIONAL_INFLUENCE_MAX_SIGNALS = 10;
export const INSTITUTIONAL_INFLUENCE_MAX_FIELDS = 8;
export const INSTITUTIONAL_INFLUENCE_MAX_TOPOLOGIES = 10;
export const INSTITUTIONAL_INFLUENCE_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_INFLUENCE_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_INFLUENCE_MIN_CONFIDENCE = 0.48;
export const INSTITUTIONAL_INFLUENCE_MAX_INFLATED_CONFIDENCE = 0.94;
export const INSTITUTIONAL_INFLUENCE_MIN_UNIFIED_LAYERS = 3;
export const INSTITUTIONAL_INFLUENCE_MIN_CONSENSUS_SUBSYSTEMS = 5;
export const INSTITUTIONAL_INFLUENCE_MIN_FRAGILITY_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let influenceDepth = 0;

export function beginInstitutionalInfluenceEvaluation(): boolean {
  if (influenceDepth >= INSTITUTIONAL_INFLUENCE_MAX_RECURSION_DEPTH) return false;
  influenceDepth += 1;
  return true;
}

export function endInstitutionalInfluenceEvaluation(): void {
  influenceDepth = Math.max(0, influenceDepth - 1);
}

export function shouldEvaluateInstitutionalInfluence(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_INFLUENCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampInstitutionalInfluenceConfidence(score: number): number {
  return Number(
    Math.min(
      INSTITUTIONAL_INFLUENCE_MAX_INFLATED_CONFIDENCE,
      Math.max(INSTITUTIONAL_INFLUENCE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateMacroInfluenceObservation(
  observation: MacroInfluenceObservation | null | undefined
): observation is MacroInfluenceObservation {
  if (!observation) return false;
  if (!observation.influenceId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < INSTITUTIONAL_INFLUENCE_MIN_CONFIDENCE) return false;
  if (observation.confidence > INSTITUTIONAL_INFLUENCE_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.influenceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainMacroInfluenceObservation(
  observation: MacroInfluenceObservation
): boolean {
  if (!validateMacroInfluenceObservation(observation)) return false;
  if (
    observation.impactState === "civilization_scale_impact" &&
    observation.influenceStrength === "weak"
  ) {
    return false;
  }
  if (observation.impactState === "localized" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function influenceStrengthRank(
  strength: MacroInfluenceObservation["influenceStrength"]
): number {
  const ranks: Record<MacroInfluenceObservation["influenceStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function impactStateRank(state: MacroInfluenceObservation["impactState"]): number {
  const ranks: Record<MacroInfluenceObservation["impactState"], number> = {
    localized: 1,
    distributed: 2,
    ecosystem_active: 3,
    systemically_influential: 4,
    civilization_scale_impact: 5,
  };
  return ranks[state];
}

export function resetInstitutionalInfluenceGuards(): void {
  lastEvalAtByOrg.clear();
  influenceDepth = 0;
}
