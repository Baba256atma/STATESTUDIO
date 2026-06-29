/**
 * APP-1:8 — Executive Prediction Resolver.
 * Read-only prediction result resolution.
 */

import type {
  ExecutiveConflictResult,
  ExecutivePredictionEvaluatedResult,
  ExecutivePredictionHorizonKey,
} from "./executivePredictionEngineTypes.ts";
import { resolveHighestSeverityConflict } from "./executiveConflictResolver.ts";

export function resolvePredictionById(
  results: readonly ExecutivePredictionEvaluatedResult[],
  predictionId: string
): ExecutivePredictionEvaluatedResult | null {
  return results.find((result) => result.predictionId === predictionId) ?? null;
}

export function resolvePredictionsByHorizon(
  results: readonly ExecutivePredictionEvaluatedResult[],
  horizon: ExecutivePredictionHorizonKey
): readonly ExecutivePredictionEvaluatedResult[] {
  return Object.freeze(results.filter((result) => result.predictionHorizon === horizon));
}

export function resolveHighestConfidencePrediction(
  results: readonly ExecutivePredictionEvaluatedResult[]
): ExecutivePredictionEvaluatedResult | null {
  if (results.length === 0) return null;
  return [...results].sort((left, right) => right.confidence - left.confidence)[0] ?? null;
}

export function resolveAllConflicts(
  results: readonly ExecutivePredictionEvaluatedResult[]
): readonly ExecutiveConflictResult[] {
  return Object.freeze(results.flatMap((result) => [...result.conflicts]));
}

export function resolveMostSevereConflictFromPredictions(
  results: readonly ExecutivePredictionEvaluatedResult[]
): ExecutiveConflictResult | null {
  return resolveHighestSeverityConflict(resolveAllConflicts(results));
}

export const ExecutivePredictionResolver = Object.freeze({
  resolvePredictionById,
  resolvePredictionsByHorizon,
  resolveHighestConfidencePrediction,
  resolveAllConflicts,
  resolveMostSevereConflictFromPredictions,
});
