import type { ReasoningIntegrityObservation } from "./metaCognitionTypes";

export const META_COGNITION_MAX_OBSERVATIONS = 10;
export const META_COGNITION_MAX_SNAPSHOTS = 8;
export const META_COGNITION_MAX_SIGNALS = 10;
export const META_COGNITION_MAX_RISKS = 10;
export const META_COGNITION_MAX_HEALTH_RECORDS = 8;
export const META_COGNITION_MAX_REFLECTIONS = 8;
export const META_COGNITION_MIN_EVAL_INTERVAL_MS = 500;
export const META_COGNITION_MAX_RECURSION_DEPTH = 2;
export const META_COGNITION_MIN_CONFIDENCE = 0.48;
export const META_COGNITION_MAX_INFLATED_CONFIDENCE = 0.94;
export const META_COGNITION_MIN_UNIFIED_LAYERS = 3;

const lastEvalAtByOrg = new Map<string, number>();
let reflectionDepth = 0;

export function beginMetaCognitionEvaluation(): boolean {
  if (reflectionDepth >= META_COGNITION_MAX_RECURSION_DEPTH) return false;
  reflectionDepth += 1;
  return true;
}

export function endMetaCognitionEvaluation(): void {
  reflectionDepth = Math.max(0, reflectionDepth - 1);
}

export function shouldEvaluateMetaCognition(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < META_COGNITION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampMetaCognitionConfidence(score: number): number {
  return Number(
    Math.min(
      META_COGNITION_MAX_INFLATED_CONFIDENCE,
      Math.max(META_COGNITION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateReasoningIntegrityObservation(
  observation: ReasoningIntegrityObservation | null | undefined
): observation is ReasoningIntegrityObservation {
  if (!observation) return false;
  if (!observation.metaCognitionId.trim() || !observation.summary.trim()) return false;
  if (observation.confidence < META_COGNITION_MIN_CONFIDENCE) return false;
  if (observation.confidence > META_COGNITION_MAX_INFLATED_CONFIDENCE) return false;
  if (observation.qualitySignals.length < 1) return false;
  return Number.isFinite(observation.generatedAt);
}

export function shouldRetainReasoningIntegrityObservation(
  observation: ReasoningIntegrityObservation
): boolean {
  if (!validateReasoningIntegrityObservation(observation)) return false;
  if (observation.integrityState === "verified" && observation.confidence < 0.72) {
    return false;
  }
  if (observation.integrityState === "fragmented" && observation.confidence > 0.88) {
    return false;
  }
  return true;
}

export function cognitionHealthRank(health: ReasoningIntegrityObservation["cognitionHealth"]): number {
  const ranks: Record<ReasoningIntegrityObservation["cognitionHealth"], number> = {
    weak: 1,
    monitored: 2,
    stable: 3,
    strong: 4,
    executive_grade: 5,
  };
  return ranks[health];
}

export function integrityStateRank(state: ReasoningIntegrityObservation["integrityState"]): number {
  const ranks: Record<ReasoningIntegrityObservation["integrityState"], number> = {
    uncertain: 1,
    fragmented: 2,
    coherent: 3,
    reliable: 4,
    verified: 5,
  };
  return ranks[state];
}

export function resetMetaCognitionGuards(): void {
  lastEvalAtByOrg.clear();
  reflectionDepth = 0;
}
