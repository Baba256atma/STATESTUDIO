/**
 * APP-9:4 — Confidence trend direction and stability classification.
 */

import { CONFIDENCE_EVOLUTION_TREND_RULES } from "./confidenceEvolutionTrendRules.ts";
import type {
  ConfidenceDeltaPair,
  ConfidenceStabilityLevel,
  ConfidenceTrendDirection,
} from "./confidenceEvolutionTrendTypes.ts";

export function classifyConfidenceTrendDirection(
  totalDelta: number | null,
  deltas: readonly ConfidenceDeltaPair[],
  recordCount: number
): ConfidenceTrendDirection {
  if (recordCount === 0) {
    return "unknown";
  }
  if (recordCount === 1) {
    return "stable";
  }

  const threshold = CONFIDENCE_EVOLUTION_TREND_RULES.stableDeltaThreshold;
  let significantUps = 0;
  let significantDowns = 0;
  for (const entry of deltas) {
    if (entry.delta > threshold) {
      significantUps += 1;
    } else if (entry.delta < -threshold) {
      significantDowns += 1;
    }
  }

  if (significantUps > 0 && significantDowns > 0) {
    return "mixed";
  }

  const total = totalDelta ?? 0;
  if (total > threshold) {
    return "increasing";
  }
  if (total < -threshold) {
    return "decreasing";
  }
  return "stable";
}

export function classifyConfidenceStability(
  volatilityScore: number,
  recordCount: number,
  direction: ConfidenceTrendDirection
): ConfidenceStabilityLevel {
  if (recordCount === 0) {
    return "unknown";
  }
  if (recordCount === 1) {
    return "stable";
  }

  if (volatilityScore <= CONFIDENCE_EVOLUTION_TREND_RULES.stableDeltaThreshold && direction === "stable") {
    return "stable";
  }
  if (volatilityScore <= CONFIDENCE_EVOLUTION_TREND_RULES.stabilityModerateThreshold) {
    return "moderately_stable";
  }
  if (volatilityScore <= CONFIDENCE_EVOLUTION_TREND_RULES.stabilityUnstableThreshold) {
    return "unstable";
  }
  return "highly_unstable";
}

export const ConfidenceEvolutionTrendClassification = Object.freeze({
  classifyConfidenceTrendDirection,
  classifyConfidenceStability,
});
