import type { StrategicCoherenceObservation } from "./strategicCoherenceTypes";

export const STRATEGIC_COHERENCE_MAX_OBSERVATIONS = 10;
export const STRATEGIC_COHERENCE_MAX_SNAPSHOTS = 8;
export const STRATEGIC_COHERENCE_MAX_SIGNALS = 10;
export const STRATEGIC_COHERENCE_MAX_FIELDS = 8;
export const STRATEGIC_COHERENCE_MAX_MISALIGNMENT_INDICATORS = 10;
export const STRATEGIC_COHERENCE_MIN_EVAL_INTERVAL_MS = 500;
export const STRATEGIC_COHERENCE_MAX_RECURSION_DEPTH = 2;
export const STRATEGIC_COHERENCE_MIN_CONFIDENCE = 0.48;
export const STRATEGIC_COHERENCE_MAX_INFLATED_CONFIDENCE = 0.94;
export const STRATEGIC_COHERENCE_MIN_UNIFIED_RUNTIMES = 4;
export const STRATEGIC_COHERENCE_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const STRATEGIC_COHERENCE_MIN_STRATEGIC_WILL_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let strategicCoherenceDepth = 0;

export function beginStrategicCoherenceEvaluation(): boolean {
  if (strategicCoherenceDepth >= STRATEGIC_COHERENCE_MAX_RECURSION_DEPTH) return false;
  strategicCoherenceDepth += 1;
  return true;
}

export function endStrategicCoherenceEvaluation(): void {
  strategicCoherenceDepth = Math.max(0, strategicCoherenceDepth - 1);
}

export function shouldEvaluateStrategicCoherence(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < STRATEGIC_COHERENCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampStrategicCoherenceConfidence(score: number): number {
  return Number(
    Math.min(
      STRATEGIC_COHERENCE_MAX_INFLATED_CONFIDENCE,
      Math.max(STRATEGIC_COHERENCE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicCoherenceObservation(
  observation: StrategicCoherenceObservation | null | undefined
): observation is StrategicCoherenceObservation {
  if (!observation) return false;
  if (!observation.coherenceId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < STRATEGIC_COHERENCE_MIN_CONFIDENCE) return false;
  if (observation.confidence > STRATEGIC_COHERENCE_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.coherenceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainStrategicCoherenceObservation(
  observation: StrategicCoherenceObservation
): boolean {
  if (!validateStrategicCoherenceObservation(observation)) return false;
  if (
    observation.coherenceState === "fully_aligned" &&
    observation.coherenceStrength === "weak"
  ) {
    return false;
  }
  if (observation.coherenceState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function coherenceStrengthRank(
  strength: StrategicCoherenceObservation["coherenceStrength"]
): number {
  const ranks: Record<StrategicCoherenceObservation["coherenceStrength"], number> = {
    weak: 1,
    moderate: 2,
    aligned: 3,
    unified: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function coherenceStateRank(state: StrategicCoherenceObservation["coherenceState"]): number {
  const ranks: Record<StrategicCoherenceObservation["coherenceState"], number> = {
    fragmented: 1,
    drifting: 2,
    partially_aligned: 3,
    coherent: 4,
    fully_aligned: 5,
  };
  return ranks[state];
}

export function resetStrategicCoherenceGuards(): void {
  lastEvalAtByOrg.clear();
  strategicCoherenceDepth = 0;
}
