import type { StrategicPerspectiveWeight } from "./perspectiveWeightingTypes";

export const PERSPECTIVE_WEIGHTING_MAX_WEIGHTINGS = 10;
export const PERSPECTIVE_WEIGHTING_MAX_SNAPSHOTS = 8;
export const PERSPECTIVE_WEIGHTING_MAX_SHIFTS = 10;
export const PERSPECTIVE_WEIGHTING_MAX_SIGNALS = 10;
export const PERSPECTIVE_WEIGHTING_MAX_FIELDS = 8;
export const PERSPECTIVE_WEIGHTING_MIN_EVAL_INTERVAL_MS = 500;
export const PERSPECTIVE_WEIGHTING_MAX_RECURSION_DEPTH = 2;
export const PERSPECTIVE_WEIGHTING_MIN_CONFIDENCE = 0.48;
export const PERSPECTIVE_WEIGHTING_MAX_INFLATED_CONFIDENCE = 0.94;
export const PERSPECTIVE_WEIGHTING_MIN_UNIFIED_LAYERS = 3;
export const PERSPECTIVE_WEIGHTING_MIN_NEGOTIATION_DEPTH = 1;

const lastEvalAtByOrg = new Map<string, number>();
let weightingDepth = 0;

export function beginPerspectiveWeightingEvaluation(): boolean {
  if (weightingDepth >= PERSPECTIVE_WEIGHTING_MAX_RECURSION_DEPTH) return false;
  weightingDepth += 1;
  return true;
}

export function endPerspectiveWeightingEvaluation(): void {
  weightingDepth = Math.max(0, weightingDepth - 1);
}

export function shouldEvaluatePerspectiveWeighting(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < PERSPECTIVE_WEIGHTING_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampWeightingConfidence(score: number): number {
  return Number(
    Math.min(
      PERSPECTIVE_WEIGHTING_MAX_INFLATED_CONFIDENCE,
      Math.max(PERSPECTIVE_WEIGHTING_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicPerspectiveWeight(
  weighting: StrategicPerspectiveWeight | null | undefined
): weighting is StrategicPerspectiveWeight {
  if (!weighting) return false;
  if (!weighting.weightingId.trim() || !weighting.summary.trim()) return false;
  if (weighting.confidence < PERSPECTIVE_WEIGHTING_MIN_CONFIDENCE) return false;
  if (weighting.confidence > PERSPECTIVE_WEIGHTING_MAX_INFLATED_CONFIDENCE) return false;
  if (weighting.weightingSignals.length < 1) return false;
  return Number.isFinite(weighting.generatedAt);
}

export function shouldRetainStrategicPerspectiveWeight(
  weighting: StrategicPerspectiveWeight
): boolean {
  if (!validateStrategicPerspectiveWeight(weighting)) return false;
  if (weighting.priorityState === "stabilized" && weighting.weightingStrength === "weak") {
    return false;
  }
  if (weighting.priorityState === "concentrated" && weighting.confidence > 0.92) {
    return false;
  }
  return true;
}

export function weightingStrengthRank(
  strength: StrategicPerspectiveWeight["weightingStrength"]
): number {
  const ranks: Record<StrategicPerspectiveWeight["weightingStrength"], number> = {
    weak: 1,
    moderate: 2,
    elevated: 3,
    dominant: 4,
    executive_grade: 5,
  };
  return ranks[strength];
}

export function priorityStateRank(state: StrategicPerspectiveWeight["priorityState"]): number {
  const ranks: Record<StrategicPerspectiveWeight["priorityState"], number> = {
    balanced: 1,
    shifting: 2,
    adaptive: 3,
    concentrated: 4,
    stabilized: 5,
  };
  return ranks[state];
}

export function resetPerspectiveWeightingGuards(): void {
  lastEvalAtByOrg.clear();
  weightingDepth = 0;
}
