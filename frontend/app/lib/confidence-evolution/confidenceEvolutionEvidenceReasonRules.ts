/**
 * APP-9:5 — Confidence evidence + reason link scoring rules.
 */

import type { ConfidenceChangeReason, ConfidenceSource } from "./confidenceEvolutionTypes.ts";

export const CONFIDENCE_EVIDENCE_REASON_RULES = Object.freeze({
  largeMovementThreshold: 0.2,
  minScore: 0,
  maxScore: 1,
  modelConfidenceRecordDivisor: 5,
  unknownReason: "unknown" as const,
} as const);

export const SOURCE_REASON_ALIGNMENT_MAP = Object.freeze({
  manual: Object.freeze(["manual_revision", "executive_review", "unknown"] as const),
  assistant: Object.freeze(["assumption_updated", "executive_review", "manual_revision"] as const),
  scenario: Object.freeze(["scenario_completed", "assumption_updated"] as const),
  evidence: Object.freeze(["new_evidence", "outcome_observed", "risk_changed"] as const),
  retrospective: Object.freeze(["outcome_observed", "executive_review"] as const),
  journal: Object.freeze(["manual_revision", "executive_review"] as const),
  workspace: Object.freeze(["executive_review", "manual_revision"] as const),
  api: Object.freeze(["manual_revision", "unknown"] as const),
} satisfies Readonly<Record<ConfidenceSource, readonly ConfidenceChangeReason[]>>);

export function clampLinkConfidence(value: number): number {
  if (Number.isNaN(value)) {
    return CONFIDENCE_EVIDENCE_REASON_RULES.minScore;
  }
  return Math.min(
    CONFIDENCE_EVIDENCE_REASON_RULES.maxScore,
    Math.max(CONFIDENCE_EVIDENCE_REASON_RULES.minScore, value)
  );
}

export function calculateModelLinkConfidence(recordCount: number): number {
  if (recordCount <= 0) {
    return CONFIDENCE_EVIDENCE_REASON_RULES.minScore;
  }
  return clampLinkConfidence(recordCount / CONFIDENCE_EVIDENCE_REASON_RULES.modelConfidenceRecordDivisor);
}

export function hasReasonValue(reason: ConfidenceChangeReason): boolean {
  return reason !== CONFIDENCE_EVIDENCE_REASON_RULES.unknownReason;
}

export function hasEvidenceValue(evidenceReferences: readonly string[]): boolean {
  return evidenceReferences.length > 0;
}

export function isExplainedRecord(
  reason: ConfidenceChangeReason,
  evidenceReferences: readonly string[]
): boolean {
  return hasReasonValue(reason) || hasEvidenceValue(evidenceReferences);
}

export function isLargeMovement(delta: number | null): boolean {
  return delta !== null && Math.abs(delta) >= CONFIDENCE_EVIDENCE_REASON_RULES.largeMovementThreshold;
}

export function isSourceReasonAligned(
  source: ConfidenceSource,
  reason: ConfidenceChangeReason
): boolean {
  const compatible = SOURCE_REASON_ALIGNMENT_MAP[source];
  return (compatible as readonly string[]).includes(reason);
}

export function calculateEvidenceCoverage(
  recordsWithEvidence: number,
  totalRecords: number
): number {
  if (totalRecords <= 0) {
    return CONFIDENCE_EVIDENCE_REASON_RULES.minScore;
  }
  return clampLinkConfidence(recordsWithEvidence / totalRecords);
}

export const ConfidenceEvolutionEvidenceReasonRules = Object.freeze({
  rules: CONFIDENCE_EVIDENCE_REASON_RULES,
  sourceReasonAlignmentMap: SOURCE_REASON_ALIGNMENT_MAP,
  clampLinkConfidence,
  calculateModelLinkConfidence,
  hasReasonValue,
  hasEvidenceValue,
  isExplainedRecord,
  isLargeMovement,
  isSourceReasonAligned,
  calculateEvidenceCoverage,
});
