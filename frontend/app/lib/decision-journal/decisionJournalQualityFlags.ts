/**
 * APP-8:5 — Decision Journal reasoning quality flags.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalAssumptionModel,
  DecisionJournalEvidenceModel,
  DecisionJournalQualityFlag,
  DecisionJournalQualityFlagType,
} from "./decisionJournalEvidenceAssumptionTypes.ts";
import { DECISION_JOURNAL_ASSUMPTION_RULES } from "./decisionJournalAssumptionRules.ts";
import {
  calculateEvidenceStrength,
  DECISION_JOURNAL_EVIDENCE_RULES,
  scoreEvidenceStrength,
} from "./decisionJournalEvidenceRules.ts";
import { isHighConfidenceLevel, scoreConfidenceLevel } from "./decisionJournalReflectionRules.ts";
import { clampQualityConfidence } from "./decisionJournalEvidenceRules.ts";

function buildFlag(
  type: DecisionJournalQualityFlagType,
  entry: DecisionJournalEngineEntry,
  title: string,
  description: string,
  confidence: number,
  metadata: Readonly<Record<string, string>> = Object.freeze({})
): DecisionJournalQualityFlag {
  return Object.freeze({
    type,
    entryId: entry.id,
    title,
    description,
    confidence: clampQualityConfidence(confidence),
    metadata: Object.freeze({ ...metadata }),
    readOnly: true as const,
  });
}

export function detectReasoningQualityFlags(
  entry: DecisionJournalEngineEntry,
  evidenceModel: DecisionJournalEvidenceModel,
  assumptionModel: DecisionJournalAssumptionModel
): readonly DecisionJournalQualityFlag[] {
  const flags: DecisionJournalQualityFlag[] = [];
  const evidenceCount = entry.evidenceReferences.length;
  const strength = evidenceModel.evidenceStrength;

  if (evidenceCount === 0) {
    flags.push(
      buildFlag(
        "no-evidence",
        entry,
        "No evidence references",
        `Entry "${entry.title}" has no supporting evidence references.`,
        0.95
      )
    );
  }

  if (strength === "weak" || strength === "none") {
    if (evidenceCount > 0) {
      flags.push(
        buildFlag(
          "weak-evidence",
          entry,
          "Weak evidence strength",
          `Entry "${entry.title}" has weak evidence strength (${evidenceCount} reference(s)).`,
          0.8,
          Object.freeze({ evidenceCount: String(evidenceCount) })
        )
      );
    }
  }

  if (isHighConfidenceLevel(entry.confidence) && (strength === "none" || strength === "weak")) {
    flags.push(
      buildFlag(
        "high-confidence-weak-evidence",
        entry,
        "High confidence with weak evidence",
        `Entry "${entry.title}" expresses ${entry.confidence} confidence with ${strength} evidence.`,
        0.85,
        Object.freeze({ confidence: entry.confidence, evidenceStrength: strength })
      )
    );
  }

  if (entry.assumptions.length >= DECISION_JOURNAL_ASSUMPTION_RULES.manyAssumptionsThreshold) {
    flags.push(
      buildFlag(
        "many-assumptions",
        entry,
        "Many assumptions documented",
        `Entry "${entry.title}" documents ${entry.assumptions.length} assumptions.`,
        0.75,
        Object.freeze({ assumptionCount: String(entry.assumptions.length) })
      )
    );
  }

  if (entry.assumptions.length === 0) {
    flags.push(
      buildFlag(
        "no-assumptions",
        entry,
        "No assumptions documented",
        `Entry "${entry.title}" documents no assumptions.`,
        0.8
      )
    );
  }

  if (assumptionModel.unsupportedAssumptions.length > 0) {
    flags.push(
      buildFlag(
        "unsupported-assumption",
        entry,
        "Unsupported assumptions",
        `Entry "${entry.title}" has ${assumptionModel.unsupportedAssumptions.length} assumption(s) without evidence support.`,
        0.85,
        Object.freeze({ unsupportedCount: String(assumptionModel.unsupportedAssumptions.length) })
      )
    );
  }

  if (entry.acceptedRisks.length > 0 && evidenceCount === 0) {
    flags.push(
      buildFlag(
        "risk-without-evidence",
        entry,
        "Risk without evidence",
        `Entry "${entry.title}" accepts ${entry.acceptedRisks.length} risk(s) without evidence references.`,
        0.9,
        Object.freeze({ riskCount: String(entry.acceptedRisks.length) })
      )
    );
  }

  if (assumptionModel.assumptionRiskOverlap.length > 0) {
    flags.push(
      buildFlag(
        "assumption-risk-overlap",
        entry,
        "Assumption and risk overlap",
        `Entry "${entry.title}" has overlapping assumption and risk language.`,
        0.7,
        Object.freeze({ overlapCount: String(assumptionModel.assumptionRiskOverlap.length) })
      )
    );
  }

  const confidenceScore = scoreConfidenceLevel(entry.confidence);
  const evidenceScore = scoreEvidenceStrength(strength);
  if (Math.abs(confidenceScore - evidenceScore) <= DECISION_JOURNAL_EVIDENCE_RULES.balancedAlignmentTolerance) {
    flags.push(
      buildFlag(
        "evidence-balanced",
        entry,
        "Evidence and confidence balanced",
        `Entry "${entry.title}" shows balanced confidence and evidence strength.`,
        clampQualityConfidence(1 - Math.abs(confidenceScore - evidenceScore)),
        Object.freeze({ confidenceScore: String(confidenceScore), evidenceScore: String(evidenceScore) })
      )
    );
  }

  if (strength === "strong" || strength === "very_strong") {
    flags.push(
      buildFlag(
        "evidence-strong",
        entry,
        "Strong evidence strength",
        `Entry "${entry.title}" has ${strength} evidence strength.`,
        0.85,
        Object.freeze({ evidenceStrength: strength, evidenceCount: String(evidenceCount) })
      )
    );
  }

  return Object.freeze(flags.sort((left, right) => left.type.localeCompare(right.type)));
}

export const DecisionJournalQualityFlags = Object.freeze({
  detectReasoningQualityFlags,
});
