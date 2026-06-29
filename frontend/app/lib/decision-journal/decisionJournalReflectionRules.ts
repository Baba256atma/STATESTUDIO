/**
 * APP-8:4 — Decision Journal Reflection deterministic rules.
 */

import type { DecisionJournalConfidence } from "./decisionJournalTypes.ts";
import type { DecisionJournalInsightSeverity } from "./decisionJournalReflectionTypes.ts";

export const DECISION_JOURNAL_REFLECTION_RULES = Object.freeze({
  repeatedPatternMinOccurrences: 2,
  repeatedPatternHighThreshold: 3,
  repeatedPatternCriticalThreshold: 5,
  manyAlternativesThreshold: 3,
  lowEvidenceMaxCount: 0,
  highConfidenceLevels: Object.freeze(["high", "very_high"] as const),
  confidencePatternMinEntries: 3,
  confidencePatternDominanceRatio: 0.5,
  insightConfidenceMin: 0,
  insightConfidenceMax: 1,
} as const);

export const DECISION_JOURNAL_CONFIDENCE_LEVEL_SCORES = Object.freeze({
  very_low: 0.2,
  low: 0.4,
  medium: 0.6,
  high: 0.8,
  very_high: 1.0,
} as const satisfies Readonly<Record<DecisionJournalConfidence, number>>);

export function normalizeReflectionPatternKey(value: string): string {
  return value.trim().toLowerCase();
}

export function isHighConfidenceLevel(confidence: DecisionJournalConfidence): boolean {
  return (DECISION_JOURNAL_REFLECTION_RULES.highConfidenceLevels as readonly string[]).includes(confidence);
}

export function scoreConfidenceLevel(confidence: DecisionJournalConfidence): number {
  return DECISION_JOURNAL_CONFIDENCE_LEVEL_SCORES[confidence];
}

export function clampInsightConfidence(value: number): number {
  return Math.min(
    DECISION_JOURNAL_REFLECTION_RULES.insightConfidenceMax,
    Math.max(DECISION_JOURNAL_REFLECTION_RULES.insightConfidenceMin, value)
  );
}

export function severityForRepeatedPattern(occurrenceCount: number): DecisionJournalInsightSeverity {
  if (occurrenceCount >= DECISION_JOURNAL_REFLECTION_RULES.repeatedPatternCriticalThreshold) {
    return "critical";
  }
  if (occurrenceCount >= DECISION_JOURNAL_REFLECTION_RULES.repeatedPatternHighThreshold) {
    return "high";
  }
  return "medium";
}

export function confidenceForRepeatedPattern(occurrenceCount: number): number {
  return clampInsightConfidence(
    occurrenceCount / DECISION_JOURNAL_REFLECTION_RULES.repeatedPatternMinOccurrences * 0.5
  );
}

export const DecisionJournalReflectionRules = Object.freeze({
  DECISION_JOURNAL_REFLECTION_RULES,
  DECISION_JOURNAL_CONFIDENCE_LEVEL_SCORES,
  normalizeReflectionPatternKey,
  isHighConfidenceLevel,
  scoreConfidenceLevel,
  clampInsightConfidence,
  severityForRepeatedPattern,
  confidenceForRepeatedPattern,
});
