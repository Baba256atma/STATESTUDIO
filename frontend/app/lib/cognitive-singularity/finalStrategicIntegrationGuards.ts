import type { StrategicIntegrationObservation } from "./finalStrategicIntegrationTypes";

export const FINAL_STRATEGIC_INTEGRATION_MAX_OBSERVATIONS = 10;
export const FINAL_STRATEGIC_INTEGRATION_MAX_SNAPSHOTS = 8;
export const FINAL_STRATEGIC_INTEGRATION_MAX_SIGNALS = 10;
export const FINAL_STRATEGIC_INTEGRATION_MAX_FIELDS = 8;
export const FINAL_STRATEGIC_INTEGRATION_MAX_FRAGMENTATION_INDICATORS = 10;
export const FINAL_STRATEGIC_INTEGRATION_MIN_EVAL_INTERVAL_MS = 500;
export const FINAL_STRATEGIC_INTEGRATION_MAX_RECURSION_DEPTH = 2;
export const FINAL_STRATEGIC_INTEGRATION_MIN_CONFIDENCE = 0.48;
export const FINAL_STRATEGIC_INTEGRATION_MAX_INFLATED_CONFIDENCE = 0.94;
export const FINAL_STRATEGIC_INTEGRATION_MIN_UNIFIED_RUNTIMES = 4;
export const FINAL_STRATEGIC_INTEGRATION_MIN_INSTITUTIONAL_SUBSYSTEMS = 5;
export const FINAL_STRATEGIC_INTEGRATION_MIN_STRATEGIC_RESONANCE_OBSERVATIONS = 1;

const lastEvalAtByOrg = new Map<string, number>();
let finalStrategicIntegrationDepth = 0;

export function beginFinalStrategicIntegrationEvaluation(): boolean {
  if (finalStrategicIntegrationDepth >= FINAL_STRATEGIC_INTEGRATION_MAX_RECURSION_DEPTH) {
    return false;
  }
  finalStrategicIntegrationDepth += 1;
  return true;
}

export function endFinalStrategicIntegrationEvaluation(): void {
  finalStrategicIntegrationDepth = Math.max(0, finalStrategicIntegrationDepth - 1);
}

export function shouldEvaluateFinalStrategicIntegration(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < FINAL_STRATEGIC_INTEGRATION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampFinalStrategicIntegrationConfidence(score: number): number {
  return Number(
    Math.min(
      FINAL_STRATEGIC_INTEGRATION_MAX_INFLATED_CONFIDENCE,
      Math.max(FINAL_STRATEGIC_INTEGRATION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicIntegrationObservation(
  observation: StrategicIntegrationObservation | null | undefined
): observation is StrategicIntegrationObservation {
  if (!observation) return false;
  if (!observation.integrationId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < FINAL_STRATEGIC_INTEGRATION_MIN_CONFIDENCE) return false;
  if (observation.confidence > FINAL_STRATEGIC_INTEGRATION_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.integrationSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainStrategicIntegrationObservation(
  observation: StrategicIntegrationObservation
): boolean {
  if (!validateStrategicIntegrationObservation(observation)) return false;
  if (
    observation.integrationState === "fully_integrated" &&
    observation.integrationStrength === "weak"
  ) {
    return false;
  }
  if (observation.integrationState === "fragmented" && observation.confidence > 0.92) {
    return false;
  }
  return true;
}

export function integrationStrengthRank(
  strength: StrategicIntegrationObservation["integrationStrength"]
): number {
  const ranks: Record<StrategicIntegrationObservation["integrationStrength"], number> = {
    weak: 1,
    moderate: 2,
    integrated: 3,
    unified: 4,
    enterprise_grade: 5,
  };
  return ranks[strength];
}

export function integrationStateRank(
  state: StrategicIntegrationObservation["integrationState"]
): number {
  const ranks: Record<StrategicIntegrationObservation["integrationState"], number> = {
    fragmented: 1,
    partially_integrated: 2,
    converging: 3,
    unified: 4,
    fully_integrated: 5,
  };
  return ranks[state];
}

export function resetFinalStrategicIntegrationGuards(): void {
  lastEvalAtByOrg.clear();
  finalStrategicIntegrationDepth = 0;
}
