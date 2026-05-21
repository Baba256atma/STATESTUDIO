import type { StrategicReinforcementObservation } from "./strategicResonanceTypes";

export const STRATEGIC_RESONANCE_MAX_OBSERVATIONS = 10;
export const STRATEGIC_RESONANCE_MAX_SNAPSHOTS = 8;
export const STRATEGIC_RESONANCE_MAX_SIGNALS = 10;
export const STRATEGIC_RESONANCE_MAX_FIELDS = 8;
export const STRATEGIC_RESONANCE_MAX_AMPLIFICATION_INDICATORS = 10;
export const STRATEGIC_RESONANCE_MIN_EVAL_INTERVAL_MS = 500;
export const STRATEGIC_RESONANCE_MAX_RECURSION_DEPTH = 2;
export const STRATEGIC_RESONANCE_MIN_CONFIDENCE = 0.48;
export const STRATEGIC_RESONANCE_MAX_INFLATED_CONFIDENCE = 0.94;
export const STRATEGIC_RESONANCE_MIN_UNIFIED_RUNTIMES = 4;
export const STRATEGIC_RESONANCE_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const STRATEGIC_RESONANCE_MIN_STRATEGIC_EQUILIBRIUM_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let strategicResonanceDepth = 0;

export function beginStrategicResonanceEvaluation(): boolean {
  if (strategicResonanceDepth >= STRATEGIC_RESONANCE_MAX_RECURSION_DEPTH) return false;
  strategicResonanceDepth += 1;
  return true;
}

export function endStrategicResonanceEvaluation(): void {
  strategicResonanceDepth = Math.max(0, strategicResonanceDepth - 1);
}

export function shouldEvaluateStrategicResonance(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRATEGIC_RESONANCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampStrategicResonanceConfidence(score: number): number {
  return Number(
    Math.min(
      STRATEGIC_RESONANCE_MAX_INFLATED_CONFIDENCE,
      Math.max(STRATEGIC_RESONANCE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicResonanceObservation(
  observation: StrategicReinforcementObservation | null | undefined
): observation is StrategicReinforcementObservation {
  if (!observation) return false;
  if (!observation.resonanceId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < STRATEGIC_RESONANCE_MIN_CONFIDENCE) return false;
  if (observation.confidence > STRATEGIC_RESONANCE_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.resonanceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainStrategicResonanceObservation(
  observation: StrategicReinforcementObservation
): boolean {
  if (!validateStrategicResonanceObservation(observation)) return false;
  if (
    observation.resonanceState === "strategically_resonant" &&
    observation.resonanceStrength === "weak"
  ) {
    return false;
  }
  if (observation.resonanceState === "dissonant" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function resonanceStrengthRank(
  strength: StrategicReinforcementObservation["resonanceStrength"]
): number {
  const ranks: Record<StrategicReinforcementObservation["resonanceStrength"], number> = {
    weak: 1,
    moderate: 2,
    reinforcing: 3,
    harmonic: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function resonanceStateRank(state: StrategicReinforcementObservation["resonanceState"]): number {
  const ranks: Record<StrategicReinforcementObservation["resonanceState"], number> = {
    dissonant: 1,
    unstable: 2,
    reinforcing: 3,
    harmonically_aligned: 4,
    strategically_resonant: 5,
  };
  return ranks[state];
}

export function resetStrategicResonanceGuards(): void {
  lastEvalAtByOrg.clear();
  strategicResonanceDepth = 0;
}
