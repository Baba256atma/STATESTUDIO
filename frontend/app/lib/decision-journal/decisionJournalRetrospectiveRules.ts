/**
 * APP-8:6 — Decision Journal retrospective scoring rules.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalAssumptionModel,
  DecisionJournalEvidenceModel,
} from "./decisionJournalEvidenceAssumptionTypes.ts";
import {
  clampRetrospectiveConfidence,
  readRetrospectiveMetadataValue,
} from "./decisionJournalOutcomeRules.ts";

export const DECISION_JOURNAL_RETROSPECTIVE_RULES = Object.freeze({
  reviewCompleteScore: 1,
  reviewReviewedScore: 0.8,
  reviewActiveWithReviewersScore: 0.6,
  reviewDraftScore: 0.3,
  reviewArchivedScore: 0.5,
  reliableEvidenceThreshold: 0.7,
  unreliableEvidenceThreshold: 0.3,
  verifiedAssumptionThreshold: 0.8,
  invalidatedAssumptionThreshold: 0.2,
  riskRealizedThreshold: 0.8,
  reviewIncompleteThreshold: 0.6,
  lessonsSeparatorPattern: /[;|]/,
} as const);

function parseNumericMetadata(value: string, fallback: number): number {
  if (!value.trim()) {
    return fallback;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return clampRetrospectiveConfidence(parsed);
}

function parseLessonsLearned(rawValue: string): readonly string[] {
  if (!rawValue.trim()) {
    return Object.freeze([]);
  }
  return Object.freeze(
    rawValue
      .split(DECISION_JOURNAL_RETROSPECTIVE_RULES.lessonsSeparatorPattern)
      .map((lesson) => lesson.trim())
      .filter((lesson) => lesson.length > 0)
  );
}

export function calculateAssumptionAccuracy(
  entry: DecisionJournalEngineEntry,
  assumptionModel: DecisionJournalAssumptionModel
): number {
  const metadataValue = readRetrospectiveMetadataValue(entry, "assumptionAccuracy");
  if (metadataValue.trim()) {
    const normalized = metadataValue.trim().toLowerCase();
    if (normalized === "verified") {
      return 1;
    }
    if (normalized === "partially_verified" || normalized === "partial") {
      return 0.5;
    }
    if (normalized === "invalidated") {
      return 0;
    }
    return parseNumericMetadata(metadataValue, assumptionModel.confidence);
  }
  if (assumptionModel.unsupportedAssumptions.length > 0) {
    return clampRetrospectiveConfidence(assumptionModel.confidence * 0.5);
  }
  return clampRetrospectiveConfidence(assumptionModel.confidence);
}

export function calculateRiskRealization(entry: DecisionJournalEngineEntry): number {
  const metadataValue = readRetrospectiveMetadataValue(entry, "riskRealization").trim().toLowerCase();
  if (metadataValue === "realized" || metadataValue === "yes" || metadataValue === "true") {
    return 1;
  }
  if (metadataValue === "partial" || metadataValue === "partially") {
    return 0.5;
  }
  if (metadataValue === "not_realized" || metadataValue === "no" || metadataValue === "false" || metadataValue === "none") {
    return 0;
  }
  if (entry.acceptedRisks.length === 0) {
    return 1;
  }
  return 0.5;
}

export function calculateEvidenceReliability(
  entry: DecisionJournalEngineEntry,
  evidenceModel: DecisionJournalEvidenceModel
): number {
  const metadataValue = readRetrospectiveMetadataValue(entry, "evidenceReliability").trim().toLowerCase();
  if (metadataValue === "reliable" || metadataValue === "yes" || metadataValue === "true") {
    return 1;
  }
  if (metadataValue === "unreliable" || metadataValue === "no" || metadataValue === "false") {
    return 0;
  }
  if (metadataValue === "partial" || metadataValue === "partially") {
    return 0.5;
  }
  return clampRetrospectiveConfidence(evidenceModel.confidence);
}

export function calculateReviewCompleteness(entry: DecisionJournalEngineEntry): number {
  if (entry.status === "reviewed" && entry.reviewers.length > 0) {
    return DECISION_JOURNAL_RETROSPECTIVE_RULES.reviewCompleteScore;
  }
  if (entry.status === "reviewed") {
    return DECISION_JOURNAL_RETROSPECTIVE_RULES.reviewReviewedScore;
  }
  if (entry.status === "active" && entry.reviewers.length > 0) {
    return DECISION_JOURNAL_RETROSPECTIVE_RULES.reviewActiveWithReviewersScore;
  }
  if (entry.status === "archived") {
    return DECISION_JOURNAL_RETROSPECTIVE_RULES.reviewArchivedScore;
  }
  return DECISION_JOURNAL_RETROSPECTIVE_RULES.reviewDraftScore;
}

export function readRetrospectiveNotes(entry: DecisionJournalEngineEntry): string {
  return readRetrospectiveMetadataValue(entry, "retrospectiveNotes").trim();
}

export function readLessonsLearned(entry: DecisionJournalEngineEntry): readonly string[] {
  return parseLessonsLearned(readRetrospectiveMetadataValue(entry, "lessonsLearned"));
}

export function calculateRetrospectiveConfidence(
  assumptionAccuracy: number,
  riskRealization: number,
  evidenceReliability: number,
  reviewCompleteness: number
): number {
  return clampRetrospectiveConfidence(
    (assumptionAccuracy + evidenceReliability + reviewCompleteness + (1 - Math.abs(riskRealization - 0.5))) / 4
  );
}

export const DecisionJournalRetrospectiveRules = Object.freeze({
  DECISION_JOURNAL_RETROSPECTIVE_RULES,
  calculateAssumptionAccuracy,
  calculateRiskRealization,
  calculateEvidenceReliability,
  calculateReviewCompleteness,
  readRetrospectiveNotes,
  readLessonsLearned,
  calculateRetrospectiveConfidence,
});
