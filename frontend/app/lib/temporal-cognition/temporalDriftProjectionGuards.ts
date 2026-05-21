import type {
  TemporalDriftProjection,
  TrajectoryDirection,
  TrendStrength,
} from "./temporalDriftProjectionTypes";

export const TEMPORAL_DRIFT_MAX_PROJECTIONS = 12;
export const TEMPORAL_DRIFT_MAX_SNAPSHOTS = 8;
export const TEMPORAL_DRIFT_MAX_SIGNALS = 10;
export const TEMPORAL_DRIFT_MAX_DIRECTIONS = 8;
export const TEMPORAL_DRIFT_MAX_TRENDS = 10;
export const TEMPORAL_DRIFT_MAX_FORECASTS = 10;
export const TEMPORAL_DRIFT_MIN_EVAL_INTERVAL_MS = 500;
export const TEMPORAL_DRIFT_MAX_RECURSION_DEPTH = 2;
export const TEMPORAL_DRIFT_MIN_CONFIDENCE = 0.45;

const lastEvalAtByOrg = new Map<string, number>();
let driftDepth = 0;

const VALID_DIRECTIONS = new Set<TrajectoryDirection>([
  "stabilizing",
  "adaptive_growth",
  "stagnating",
  "degrading",
  "fragile",
  "unstable",
  "recovering",
]);

const VALID_STRENGTH = new Set<TrendStrength>([
  "weak",
  "moderate",
  "strong",
  "accelerating",
]);

export function beginTemporalDriftEvaluation(): boolean {
  if (driftDepth >= TEMPORAL_DRIFT_MAX_RECURSION_DEPTH) return false;
  driftDepth += 1;
  return true;
}

export function endTemporalDriftEvaluation(): void {
  driftDepth = Math.max(0, driftDepth - 1);
}

export function shouldEvaluateTemporalDrift(
  organizationId: string,
  evaluationSignature: string,
  lastEvaluationSignature: string | null,
  now = Date.now()
): boolean {
  if (!organizationId.trim()) return false;
  if (evaluationSignature === lastEvaluationSignature) return false;

  const lastAt = lastEvalAtByOrg.get(organizationId) ?? 0;
  if (now - lastAt < TEMPORAL_DRIFT_MIN_EVAL_INTERVAL_MS) return false;

  lastEvalAtByOrg.set(organizationId, now);
  return true;
}

export function validateDriftProjection(
  projection: TemporalDriftProjection | null | undefined
): projection is TemporalDriftProjection {
  if (!projection) return false;
  if (!projection.projectionId.trim() || !projection.summary.trim()) return false;
  if (!VALID_DIRECTIONS.has(projection.trajectoryDirection)) return false;
  if (!VALID_STRENGTH.has(projection.trendStrength)) return false;
  if (projection.confidence < TEMPORAL_DRIFT_MIN_CONFIDENCE) return false;
  if (projection.supportingSignals.length === 0) return false;
  return Number.isFinite(projection.generatedAt);
}

export function shouldRetainDriftProjection(projection: TemporalDriftProjection): boolean {
  if (!validateDriftProjection(projection)) return false;
  if (projection.trajectoryDirection === "stagnating" && projection.trendStrength === "weak") {
    return false;
  }
  if (projection.confidence < 0.55 && projection.supportingSignals.length < 2) return false;
  return true;
}

export function confidenceToTrajectoryLevel(
  confidence: number
): "low" | "moderate" | "high" | "verified" {
  if (confidence >= 0.9) return "verified";
  if (confidence >= 0.78) return "high";
  if (confidence >= 0.62) return "moderate";
  return "low";
}

export function resetTemporalDriftProjectionGuards(): void {
  lastEvalAtByOrg.clear();
  driftDepth = 0;
}
