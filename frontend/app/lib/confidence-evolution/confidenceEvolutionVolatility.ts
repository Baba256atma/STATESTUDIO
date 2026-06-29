/**
 * APP-9:4 — Confidence volatility scoring and classification.
 */

import { calculateAverageAbsoluteDelta } from "./confidenceEvolutionDeltas.ts";
import {
  CONFIDENCE_EVOLUTION_TREND_RULES,
  clampConfidenceMetric,
} from "./confidenceEvolutionTrendRules.ts";
import type { ConfidenceDeltaPair, ConfidenceVolatilityLevel } from "./confidenceEvolutionTrendTypes.ts";

export function calculateConfidenceVolatility(
  deltas: readonly ConfidenceDeltaPair[],
  recordCount: number
): number {
  if (recordCount < 2) {
    return CONFIDENCE_EVOLUTION_TREND_RULES.minScore;
  }
  return clampConfidenceMetric(calculateAverageAbsoluteDelta(deltas));
}

export function classifyConfidenceVolatilityLevel(
  volatilityScore: number,
  recordCount: number
): ConfidenceVolatilityLevel {
  if (recordCount < 2 || volatilityScore === CONFIDENCE_EVOLUTION_TREND_RULES.minScore) {
    return "none";
  }
  if (volatilityScore < CONFIDENCE_EVOLUTION_TREND_RULES.volatilityLowThreshold) {
    return "low";
  }
  if (volatilityScore < CONFIDENCE_EVOLUTION_TREND_RULES.volatilityMediumThreshold) {
    return "medium";
  }
  if (volatilityScore < CONFIDENCE_EVOLUTION_TREND_RULES.volatilityHighThreshold) {
    return "high";
  }
  return "extreme";
}

export const ConfidenceEvolutionVolatility = Object.freeze({
  calculateConfidenceVolatility,
  classifyConfidenceVolatilityLevel,
});
