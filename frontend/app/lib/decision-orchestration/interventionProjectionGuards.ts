import type { StrategicInterventionProjection } from "./interventionProjectionTypes";

export const INTERVENTION_PROJECTION_MAX_PROJECTIONS = 10;
export const INTERVENTION_PROJECTION_MAX_SNAPSHOTS = 8;
export const INTERVENTION_PROJECTION_MAX_SIMULATIONS = 10;
export const INTERVENTION_PROJECTION_MAX_SIGNALS = 10;
export const INTERVENTION_PROJECTION_MAX_EVOLUTIONS = 10;
export const INTERVENTION_PROJECTION_MAX_TOPOLOGIES = 8;
export const INTERVENTION_PROJECTION_MIN_EVAL_INTERVAL_MS = 500;
export const INTERVENTION_PROJECTION_MAX_RECURSION_DEPTH = 2;
export const INTERVENTION_PROJECTION_MIN_CONFIDENCE = 0.48;
export const INTERVENTION_PROJECTION_MAX_INFLATED_CONFIDENCE = 0.94;

const lastEvalAtByOrg = new Map<string, number>();
let projectionDepth = 0;

export function beginInterventionProjectionEvaluation(): boolean {
  if (projectionDepth >= INTERVENTION_PROJECTION_MAX_RECURSION_DEPTH) return false;
  projectionDepth += 1;
  return true;
}

export function endInterventionProjectionEvaluation(): void {
  projectionDepth = Math.max(0, projectionDepth - 1);
}

export function shouldEvaluateInterventionProjection(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < INTERVENTION_PROJECTION_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function clampProjectionConfidence(score: number): number {
  return Number(
    Math.min(
      INTERVENTION_PROJECTION_MAX_INFLATED_CONFIDENCE,
      Math.max(INTERVENTION_PROJECTION_MIN_CONFIDENCE, score)
    ).toFixed(2)
  );
}

export function validateStrategicInterventionProjection(
  projection: StrategicInterventionProjection | null | undefined
): projection is StrategicInterventionProjection {
  if (!projection) return false;
  if (!projection.projectionId.trim() || !projection.summary.trim()) return false;
  if (projection.confidence < INTERVENTION_PROJECTION_MIN_CONFIDENCE) return false;
  if (projection.confidence > INTERVENTION_PROJECTION_MAX_INFLATED_CONFIDENCE) return false;
  if (projection.projectedOutcomes.length < 1) return false;
  return Number.isFinite(projection.generatedAt);
}

export function shouldRetainStrategicInterventionProjection(
  projection: StrategicInterventionProjection
): boolean {
  if (!validateStrategicInterventionProjection(projection)) return false;
  if (projection.projectionState === "probable" && projection.confidence < 0.65) {
    return false;
  }
  if (projection.projectionState === "uncertain" && projection.confidence > 0.85) {
    return false;
  }
  return true;
}

export function projectionStateRank(
  state: StrategicInterventionProjection["projectionState"]
): number {
  const ranks: Record<StrategicInterventionProjection["projectionState"], number> = {
    uncertain: 1,
    hypothetical: 2,
    emerging: 3,
    stabilizing: 4,
    probable: 5,
  };
  return ranks[state];
}

export function projectionStrengthRank(
  strength: StrategicInterventionProjection["projectionStrength"]
): number {
  const ranks: Record<StrategicInterventionProjection["projectionStrength"], number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
    systemic: 4,
  };
  return ranks[strength];
}

export function resetInterventionProjectionGuards(): void {
  lastEvalAtByOrg.clear();
  projectionDepth = 0;
}
