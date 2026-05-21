import type { MacroOperationalObservation } from "./institutionalConsciousnessTypes";

export const INSTITUTIONAL_CONSCIOUSNESS_MAX_OBSERVATIONS = 10;
export const INSTITUTIONAL_CONSCIOUSNESS_MAX_SNAPSHOTS = 8;
export const INSTITUTIONAL_CONSCIOUSNESS_MAX_SIGNALS = 10;
export const INSTITUTIONAL_CONSCIOUSNESS_MAX_FIELDS = 8;
export const INSTITUTIONAL_CONSCIOUSNESS_MAX_RELATIONSHIPS = 10;
export const INSTITUTIONAL_CONSCIOUSNESS_MIN_EVAL_INTERVAL_MS = 500;
export const INSTITUTIONAL_CONSCIOUSNESS_MAX_RECURSION_DEPTH = 2;
export const INSTITUTIONAL_CONSCIOUSNESS_MIN_CONFIDENCE = 0.48;
export const INSTITUTIONAL_CONSCIOUSNESS_MAX_INFLATED_CONFIDENCE = 0.94;
export const INSTITUTIONAL_CONSCIOUSNESS_MIN_UNIFIED_LAYERS = 3;
export const INSTITUTIONAL_CONSCIOUSNESS_MIN_CONSENSUS_SUBSYSTEMS = 5;

const lastEvalAtByOrg = new Map<string, number>();
let consciousnessDepth = 0;

export function beginInstitutionalConsciousnessEvaluation(): boolean {
  if (consciousnessDepth >= INSTITUTIONAL_CONSCIOUSNESS_MAX_RECURSION_DEPTH) return false;
  consciousnessDepth += 1;
  return true;
}

export function endInstitutionalConsciousnessEvaluation(): void {
  consciousnessDepth = Math.max(0, consciousnessDepth - 1);
}

export function shouldEvaluateInstitutionalConsciousness(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INSTITUTIONAL_CONSCIOUSNESS_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampInstitutionalConfidence(score: number): number {
  return Number(
    Math.min(
      INSTITUTIONAL_CONSCIOUSNESS_MAX_INFLATED_CONFIDENCE,
      Math.max(INSTITUTIONAL_CONSCIOUSNESS_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateMacroOperationalObservation(
  observation: MacroOperationalObservation | null | undefined
): observation is MacroOperationalObservation {
  if (!observation) return false;
  if (!observation.institutionalAwarenessId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < INSTITUTIONAL_CONSCIOUSNESS_MIN_CONFIDENCE) return false;
  if (observation.confidence > INSTITUTIONAL_CONSCIOUSNESS_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.ecosystemSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainMacroOperationalObservation(
  observation: MacroOperationalObservation
): boolean {
  if (!validateMacroOperationalObservation(observation)) return false;
  if (
    observation.institutionalState === "institutionally_conscious" &&
    observation.awarenessStrength === "weak"
  ) {
    return false;
  }
  if (observation.institutionalState === "isolated" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function awarenessStrengthRank(
  strength: MacroOperationalObservation["awarenessStrength"]
): number {
  const ranks: Record<MacroOperationalObservation["awarenessStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
    civilization_scale: 5,
  };
  return ranks[strength];
}

export function institutionalStateRank(
  state: MacroOperationalObservation["institutionalState"]
): number {
  const ranks: Record<MacroOperationalObservation["institutionalState"], number> = {
    isolated: 1,
    connected: 2,
    ecosystem_aware: 3,
    systemically_integrated: 4,
    institutionally_conscious: 5,
  };
  return ranks[state];
}

export function resetInstitutionalConsciousnessGuards(): void {
  lastEvalAtByOrg.clear();
  consciousnessDepth = 0;
}
