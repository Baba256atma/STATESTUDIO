/**
 * APP-8:6 — Decision Journal outcome comparison rules.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type { DecisionJournalOutcomeStatus } from "./decisionJournalRetrospectiveTypes.ts";

export const DECISION_JOURNAL_OUTCOME_RULES = Object.freeze({
  qualityConfidenceMin: 0,
  qualityConfidenceMax: 1,
  minimumWordLength: 3,
  partialOverlapRatio: 0.5,
  exceededLengthRatio: 1.2,
} as const);

export const DECISION_JOURNAL_RETROSPECTIVE_METADATA_KEYS = Object.freeze({
  observedOutcome: "observedOutcome",
  retrospectiveNotes: "retrospectiveNotes",
  lessonsLearned: "lessonsLearned",
  assumptionAccuracy: "assumptionAccuracy",
  riskRealization: "riskRealization",
  evidenceReliability: "evidenceReliability",
  outcomeStatus: "outcomeStatus",
} as const);

export function clampRetrospectiveConfidence(value: number): number {
  return Math.min(
    DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMax,
    Math.max(DECISION_JOURNAL_OUTCOME_RULES.qualityConfidenceMin, value)
  );
}

export function isDecisionJournalOutcomeStatus(value: string): value is DecisionJournalOutcomeStatus {
  return (
    value === "not_observed" ||
    value === "aligned" ||
    value === "partially_aligned" ||
    value === "misaligned" ||
    value === "exceeded" ||
    value === "unknown"
  );
}

export function readRetrospectiveMetadataValue(
  entry: DecisionJournalEngineEntry,
  key: keyof typeof DECISION_JOURNAL_RETROSPECTIVE_METADATA_KEYS
): string {
  return entry.metadata.extensions[DECISION_JOURNAL_RETROSPECTIVE_METADATA_KEYS[key]] ?? "";
}

export function readObservedOutcome(entry: DecisionJournalEngineEntry): string {
  return readRetrospectiveMetadataValue(entry, "observedOutcome").trim();
}

export function normalizeOutcomeText(value: string): string {
  return value.trim().toLowerCase();
}

function tokenizeOutcome(value: string): readonly string[] {
  return Object.freeze(
    normalizeOutcomeText(value)
      .split(/\s+/)
      .filter((token) => token.length >= DECISION_JOURNAL_OUTCOME_RULES.minimumWordLength)
  );
}

function wordOverlapRatio(expected: string, observed: string): number {
  const expectedTokens = new Set(tokenizeOutcome(expected));
  const observedTokens = tokenizeOutcome(observed);
  if (expectedTokens.size === 0 || observedTokens.length === 0) {
    return 0;
  }
  const overlap = observedTokens.filter((token) => expectedTokens.has(token)).length;
  return overlap / Math.max(expectedTokens.size, observedTokens.length);
}

export function calculateOutcomeStatus(
  expectedOutcome: string,
  observedOutcome: string,
  statusOverride?: string
): DecisionJournalOutcomeStatus {
  if (statusOverride && isDecisionJournalOutcomeStatus(statusOverride)) {
    return statusOverride;
  }
  if (!observedOutcome.trim()) {
    return "not_observed";
  }
  if (!expectedOutcome.trim()) {
    return "unknown";
  }

  const expected = normalizeOutcomeText(expectedOutcome);
  const observed = normalizeOutcomeText(observedOutcome);
  if (expected === observed) {
    return "aligned";
  }
  if (observed.includes("exceeded") || observed.includes("surpassed")) {
    return "exceeded";
  }
  if (expected.includes(observed) || observed.includes(expected)) {
    return "partially_aligned";
  }

  const overlap = wordOverlapRatio(expectedOutcome, observedOutcome);
  if (overlap === 0) {
    return "misaligned";
  }
  if (
    overlap >= DECISION_JOURNAL_OUTCOME_RULES.partialOverlapRatio &&
    observed.split(/\s+/).length > expected.split(/\s+/).length * DECISION_JOURNAL_OUTCOME_RULES.exceededLengthRatio
  ) {
    return "exceeded";
  }
  if (overlap > 0) {
    return "partially_aligned";
  }
  return "misaligned";
}

export function outcomeStatusConfidence(status: DecisionJournalOutcomeStatus): number {
  switch (status) {
    case "aligned":
      return 0.95;
    case "exceeded":
      return 0.9;
    case "partially_aligned":
      return 0.75;
    case "misaligned":
      return 0.85;
    case "not_observed":
      return 0.8;
    case "unknown":
    default:
      return 0.5;
  }
}

export const DecisionJournalOutcomeRules = Object.freeze({
  DECISION_JOURNAL_OUTCOME_RULES,
  DECISION_JOURNAL_RETROSPECTIVE_METADATA_KEYS,
  clampRetrospectiveConfidence,
  isDecisionJournalOutcomeStatus,
  readRetrospectiveMetadataValue,
  readObservedOutcome,
  normalizeOutcomeText,
  calculateOutcomeStatus,
  outcomeStatusConfidence,
});
