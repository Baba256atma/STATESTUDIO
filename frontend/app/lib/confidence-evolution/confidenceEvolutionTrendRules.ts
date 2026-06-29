/**
 * APP-9:4 — Confidence trend scoring rules.
 * Centralized deterministic thresholds — no prediction or recommendation.
 */

export const CONFIDENCE_EVOLUTION_TREND_RULES = Object.freeze({
  stableDeltaThreshold: 0.05,
  dropDeltaThreshold: -0.2,
  minScore: 0,
  maxScore: 1,
  volatilityLowThreshold: 0.1,
  volatilityMediumThreshold: 0.25,
  volatilityHighThreshold: 0.5,
  stabilityModerateThreshold: 0.15,
  stabilityUnstableThreshold: 0.35,
  modelConfidenceRecordDivisor: 5,
} as const);

export function clampConfidenceScore(value: number): number {
  if (Number.isNaN(value)) {
    return CONFIDENCE_EVOLUTION_TREND_RULES.minScore;
  }
  return Math.min(
    CONFIDENCE_EVOLUTION_TREND_RULES.maxScore,
    Math.max(CONFIDENCE_EVOLUTION_TREND_RULES.minScore, value)
  );
}

export function clampConfidenceMetric(value: number): number {
  return clampConfidenceScore(value);
}

export function calculateModelConfidence(recordCount: number): number {
  if (recordCount <= 0) {
    return CONFIDENCE_EVOLUTION_TREND_RULES.minScore;
  }
  return clampConfidenceMetric(recordCount / CONFIDENCE_EVOLUTION_TREND_RULES.modelConfidenceRecordDivisor);
}

export const ConfidenceEvolutionTrendRules = Object.freeze({
  rules: CONFIDENCE_EVOLUTION_TREND_RULES,
  clampConfidenceScore,
  clampConfidenceMetric,
  calculateModelConfidence,
});
