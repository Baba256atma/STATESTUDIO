/**
 * APP-8:5 — Decision Journal evidence scoring rules.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type { DecisionJournalEvidenceStrength } from "./decisionJournalEvidenceAssumptionTypes.ts";
import { scoreConfidenceLevel } from "./decisionJournalReflectionRules.ts";

export const DECISION_JOURNAL_EVIDENCE_RULES = Object.freeze({
  weakEvidenceCount: 1,
  moderateEvidenceCount: 2,
  strongEvidenceCount: 3,
  veryStrongEvidenceCount: 4,
  balancedAlignmentTolerance: 0.2,
  qualityConfidenceMin: 0,
  qualityConfidenceMax: 1,
  reasoningFields: Object.freeze(["rationale", "summary", "expectedOutcome"] as const),
} as const);

export const DECISION_JOURNAL_EVIDENCE_STRENGTH_SCORES = Object.freeze({
  none: 0,
  weak: 0.25,
  moderate: 0.5,
  strong: 0.75,
  very_strong: 1,
} as const satisfies Readonly<Record<DecisionJournalEvidenceStrength, number>>);

export function clampQualityConfidence(value: number): number {
  return Math.min(
    DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMax,
    Math.max(DECISION_JOURNAL_EVIDENCE_RULES.qualityConfidenceMin, value)
  );
}

export function calculateEvidenceStrength(evidenceCount: number): DecisionJournalEvidenceStrength {
  if (evidenceCount <= 0) {
    return "none";
  }
  if (evidenceCount === DECISION_JOURNAL_EVIDENCE_RULES.weakEvidenceCount) {
    return "weak";
  }
  if (evidenceCount === DECISION_JOURNAL_EVIDENCE_RULES.moderateEvidenceCount) {
    return "moderate";
  }
  if (evidenceCount === DECISION_JOURNAL_EVIDENCE_RULES.strongEvidenceCount) {
    return "strong";
  }
  return "very_strong";
}

export function scoreEvidenceStrength(strength: DecisionJournalEvidenceStrength): number {
  return DECISION_JOURNAL_EVIDENCE_STRENGTH_SCORES[strength];
}

export function calculateEvidenceCoverage(entry: DecisionJournalEngineEntry): number {
  const evidenceCount = entry.evidenceReferences.length;
  const reasoningFieldCount = DECISION_JOURNAL_EVIDENCE_RULES.reasoningFields.filter((field) => {
    const value = entry[field];
    return typeof value === "string" && value.trim().length > 0;
  }).length;
  if (reasoningFieldCount === 0) {
    return evidenceCount > 0 ? 1 : 0;
  }
  return clampQualityConfidence(evidenceCount / reasoningFieldCount);
}

export function detectUnsupportedFields(entry: DecisionJournalEngineEntry): readonly string[] {
  if (entry.evidenceReferences.length > 0) {
    return Object.freeze([]);
  }
  const unsupported = DECISION_JOURNAL_EVIDENCE_RULES.reasoningFields.filter((field) => {
    const value = entry[field];
    return typeof value === "string" && value.trim().length > 0;
  });
  return Object.freeze([...unsupported]);
}

export function calculateConfidenceEvidenceAlignment(entry: DecisionJournalEngineEntry): number {
  const confidenceScore = scoreConfidenceLevel(entry.confidence);
  const evidenceScore = scoreEvidenceStrength(calculateEvidenceStrength(entry.evidenceReferences.length));
  return clampQualityConfidence(1 - Math.abs(confidenceScore - evidenceScore));
}

export function calculateRiskEvidenceAlignment(entry: DecisionJournalEngineEntry): number {
  if (entry.acceptedRisks.length === 0) {
    return 1;
  }
  if (entry.evidenceReferences.length === 0) {
    return 0;
  }
  return clampQualityConfidence(entry.evidenceReferences.length / entry.acceptedRisks.length);
}

export const DecisionJournalEvidenceRules = Object.freeze({
  DECISION_JOURNAL_EVIDENCE_RULES,
  DECISION_JOURNAL_EVIDENCE_STRENGTH_SCORES,
  clampQualityConfidence,
  calculateEvidenceStrength,
  scoreEvidenceStrength,
  calculateEvidenceCoverage,
  detectUnsupportedFields,
  calculateConfidenceEvidenceAlignment,
  calculateRiskEvidenceAlignment,
});
