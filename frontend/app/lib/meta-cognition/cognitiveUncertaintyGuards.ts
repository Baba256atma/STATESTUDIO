import type { StrategicAmbiguityObservation } from "./cognitiveUncertaintyTypes";

export const COGNITIVE_UNCERTAINTY_MAX_OBSERVATIONS = 10;
export const COGNITIVE_UNCERTAINTY_MAX_SNAPSHOTS = 8;
export const COGNITIVE_UNCERTAINTY_MAX_SIGNALS = 10;
export const COGNITIVE_UNCERTAINTY_MAX_TOPOLOGY = 10;
export const COGNITIVE_UNCERTAINTY_MAX_INCOMPLETE = 10;
export const COGNITIVE_UNCERTAINTY_MAX_UNKNOWN_ZONES = 8;
export const COGNITIVE_UNCERTAINTY_MIN_EVAL_INTERVAL_MS = 500;
export const COGNITIVE_UNCERTAINTY_MAX_RECURSION_DEPTH = 2;
export const COGNITIVE_UNCERTAINTY_MIN_CONFIDENCE = 0.48;
export const COGNITIVE_UNCERTAINTY_MAX_INFLATED_CONFIDENCE = 0.94;
export const COGNITIVE_UNCERTAINTY_MIN_UNIFIED_LAYERS = 3;
export const COGNITIVE_UNCERTAINTY_MIN_DRIFT_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let uncertaintyDepth = 0;

export function beginCognitiveUncertaintyEvaluation(): boolean {
  if (uncertaintyDepth >= COGNITIVE_UNCERTAINTY_MAX_RECURSION_DEPTH) return false;
  uncertaintyDepth += 1;
  return true;
}

export function endCognitiveUncertaintyEvaluation(): void {
  uncertaintyDepth = Math.max(0, uncertaintyDepth - 1);
}

export function shouldEvaluateCognitiveUncertainty(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < COGNITIVE_UNCERTAINTY_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampUncertaintyConfidence(score: number): number {
  return Number(
    Math.min(
      COGNITIVE_UNCERTAINTY_MAX_INFLATED_CONFIDENCE,
      Math.max(COGNITIVE_UNCERTAINTY_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicAmbiguityObservation(
  observation: StrategicAmbiguityObservation | null | undefined
): observation is StrategicAmbiguityObservation {
  if (!observation) return false;
  if (!observation.ambiguityId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < COGNITIVE_UNCERTAINTY_MIN_CONFIDENCE) return false;
  if (observation.confidence > COGNITIVE_UNCERTAINTY_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.knownSignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainStrategicAmbiguityObservation(
  observation: StrategicAmbiguityObservation
): boolean {
  if (!validateStrategicAmbiguityObservation(observation)) return false;
  if (observation.cautionPosture === "none" && observation.uncertaintySeverity === "critical") {
    return false;
  }
  if (observation.cautionPosture === "unknown_zone" && observation.confidence > 0.88) {
    return false;
  }
  return true;
}

export function uncertaintySeverityRank(
  severity: StrategicAmbiguityObservation["uncertaintySeverity"]
): number {
  const ranks: Record<StrategicAmbiguityObservation["uncertaintySeverity"], number> = {
    low: 1,
    monitored: 2,
    elevated: 3,
    material: 4,
    critical: 5,
  };
  return ranks[severity];
}

export function cautionPostureRank(
  posture: StrategicAmbiguityObservation["cautionPosture"]
): number {
  const ranks: Record<StrategicAmbiguityObservation["cautionPosture"], number> = {
    none: 5,
    moderated: 4,
    cautious: 3,
    restricted: 2,
    unknown_zone: 1,
  };
  return ranks[posture];
}

export function resetCognitiveUncertaintyGuards(): void {
  lastEvalAtByOrg.clear();
  uncertaintyDepth = 0;
}
