import type { RuntimeResilienceObservation } from "./cognitiveResilienceTypes";

export const COGNITIVE_RESILIENCE_MAX_OBSERVATIONS = 10;
export const COGNITIVE_RESILIENCE_MAX_SNAPSHOTS = 8;
export const COGNITIVE_RESILIENCE_MAX_SIGNALS = 10;
export const COGNITIVE_RESILIENCE_MAX_DURABILITY = 10;
export const COGNITIVE_RESILIENCE_MAX_STRESS_FIELDS = 8;
export const COGNITIVE_RESILIENCE_MIN_EVAL_INTERVAL_MS = 500;
export const COGNITIVE_RESILIENCE_MAX_RECURSION_DEPTH = 2;
export const COGNITIVE_RESILIENCE_MIN_CONFIDENCE = 0.48;
export const COGNITIVE_RESILIENCE_MAX_INFLATED_CONFIDENCE = 0.94;
export const COGNITIVE_RESILIENCE_MIN_UNIFIED_LAYERS = 3;
export const COGNITIVE_RESILIENCE_MIN_TRUST_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let resilienceDepth = 0;

export function beginCognitiveResilienceEvaluation(): boolean {
  if (resilienceDepth >= COGNITIVE_RESILIENCE_MAX_RECURSION_DEPTH) return false;
  resilienceDepth += 1;
  return true;
}

export function endCognitiveResilienceEvaluation(): void {
  resilienceDepth = Math.max(0, resilienceDepth - 1);
}

export function shouldEvaluateCognitiveResilience(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < COGNITIVE_RESILIENCE_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampResilienceConfidence(score: number): number {
  return Number(
    Math.min(
      COGNITIVE_RESILIENCE_MAX_INFLATED_CONFIDENCE,
      Math.max(COGNITIVE_RESILIENCE_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateRuntimeResilienceObservation(
  observation: RuntimeResilienceObservation | null | undefined
): observation is RuntimeResilienceObservation {
  if (!observation) return false;
  if (!observation.resilienceId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < COGNITIVE_RESILIENCE_MIN_CONFIDENCE) return false;
  if (observation.confidence > COGNITIVE_RESILIENCE_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.resilienceSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainRuntimeResilienceObservation(
  observation: RuntimeResilienceObservation
): boolean {
  if (!validateRuntimeResilienceObservation(observation)) return false;
  if (observation.survivabilityState === "survivable" && observation.resilienceStrength === "fragile") {
    return false;
  }
  if (observation.survivabilityState === "degraded" && observation.confidence > 0.9) {
    return false;
  }
  return true;
}

export function resilienceStrengthRank(
  strength: RuntimeResilienceObservation["resilienceStrength"]
): number {
  const ranks: Record<RuntimeResilienceObservation["resilienceStrength"], number> = {
    fragile: 1,
    monitored: 2,
    stable: 3,
    resilient: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function survivabilityStateRank(
  state: RuntimeResilienceObservation["survivabilityState"]
): number {
  const ranks: Record<RuntimeResilienceObservation["survivabilityState"], number> = {
    degraded: 1,
    unstable: 2,
    adaptive: 3,
    durable: 4,
    survivable: 5,
  };
  return ranks[state];
}

export function resetCognitiveResilienceGuards(): void {
  lastEvalAtByOrg.clear();
  resilienceDepth = 0;
}
