/**
 * APP-8:5 — Decision Journal Evidence + Assumption model builder.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import {
  buildWorkspaceAssumptionCounts,
  calculateAssumptionCoverage,
  detectAssumptionRiskOverlap,
  detectRepeatedAssumptionsForEntry,
  detectUnsupportedAssumptions,
  scoreAssumptionQuality,
} from "./decisionJournalAssumptionRules.ts";
import {
  calculateConfidenceEvidenceAlignment,
  calculateEvidenceCoverage,
  calculateEvidenceStrength,
  calculateRiskEvidenceAlignment,
  detectUnsupportedFields,
  scoreEvidenceStrength,
} from "./decisionJournalEvidenceRules.ts";
import { detectReasoningQualityFlags } from "./decisionJournalQualityFlags.ts";
import {
  DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
  type BuildDecisionJournalEvidenceAssumptionInput,
  type DecisionJournalAssumptionModel,
  type DecisionJournalEvidenceAssumptionModel,
  type DecisionJournalEvidenceModel,
  type DecisionJournalQualityFlag,
} from "./decisionJournalEvidenceAssumptionTypes.ts";
import {
  DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
} from "./decisionJournalQueryTypes.ts";
import { DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION } from "./decisionJournalReflectionTypes.ts";

export function evaluateDecisionJournalEvidence(
  entry: DecisionJournalEngineEntry,
  flags: readonly DecisionJournalQualityFlag[] = Object.freeze([])
): DecisionJournalEvidenceModel {
  const evidenceCount = entry.evidenceReferences.length;
  const evidenceStrength = calculateEvidenceStrength(evidenceCount);
  return Object.freeze({
    workspaceId: entry.workspaceId,
    entryId: entry.id,
    evidenceCount,
    evidenceReferences: entry.evidenceReferences,
    evidenceStrength,
    evidenceCoverage: calculateEvidenceCoverage(entry),
    unsupportedFields: detectUnsupportedFields(entry),
    confidenceEvidenceAlignment: calculateConfidenceEvidenceAlignment(entry),
    riskEvidenceAlignment: calculateRiskEvidenceAlignment(entry),
    flags: Object.freeze(flags.filter((flag) => flag.entryId === entry.id)),
    confidence: scoreEvidenceStrength(evidenceStrength),
    metadata: Object.freeze({
      entryTitle: entry.title,
      entryConfidence: entry.confidence,
    }),
    readOnly: true as const,
  });
}

export function evaluateDecisionJournalAssumptions(
  entry: DecisionJournalEngineEntry,
  workspaceAssumptionCounts: Readonly<Map<string, number>>,
  flags: readonly DecisionJournalQualityFlag[] = Object.freeze([])
): DecisionJournalAssumptionModel {
  const assumptionCount = entry.assumptions.length;
  return Object.freeze({
    workspaceId: entry.workspaceId,
    entryId: entry.id,
    assumptionCount,
    assumptions: entry.assumptions,
    assumptionCoverage: calculateAssumptionCoverage(assumptionCount),
    repeatedAssumptions: detectRepeatedAssumptionsForEntry(entry, workspaceAssumptionCounts),
    unsupportedAssumptions: detectUnsupportedAssumptions(entry),
    assumptionRiskOverlap: detectAssumptionRiskOverlap(entry),
    flags: Object.freeze(flags.filter((flag) => flag.entryId === entry.id)),
    confidence: scoreAssumptionQuality(entry),
    metadata: Object.freeze({
      entryTitle: entry.title,
      riskCount: String(entry.acceptedRisks.length),
    }),
    readOnly: true as const,
  });
}

export function buildDecisionJournalEvidenceAssumptionModelFromEntries(
  entries: readonly DecisionJournalEngineEntry[],
  input: BuildDecisionJournalEvidenceAssumptionInput
): DecisionJournalEvidenceAssumptionModel {
  const generatedAt = input.generatedAt ?? "2026-01-01T00:00:00.000Z";
  const includeArchived = input.includeArchived ?? false;
  const workspaceAssumptionCounts = buildWorkspaceAssumptionCounts(entries);

  const evidenceModels: DecisionJournalEvidenceModel[] = [];
  const assumptionModels: DecisionJournalAssumptionModel[] = [];
  const qualityFlags: DecisionJournalQualityFlag[] = [];

  for (const entry of entries) {
    const preliminaryEvidence = evaluateDecisionJournalEvidence(entry);
    const preliminaryAssumption = evaluateDecisionJournalAssumptions(entry, workspaceAssumptionCounts);
    const entryFlags = detectReasoningQualityFlags(entry, preliminaryEvidence, preliminaryAssumption);
    qualityFlags.push(...entryFlags);
    evidenceModels.push(evaluateDecisionJournalEvidence(entry, entryFlags));
    assumptionModels.push(evaluateDecisionJournalAssumptions(entry, workspaceAssumptionCounts, entryFlags));
  }

  return Object.freeze({
    workspaceId: input.workspaceId,
    entryCount: entries.length,
    generatedAt,
    evidenceModels: Object.freeze(evidenceModels),
    assumptionModels: Object.freeze(assumptionModels),
    qualityFlags: Object.freeze(
      [...qualityFlags].sort((left, right) => left.type.localeCompare(right.type) || left.entryId.localeCompare(right.entryId))
    ),
    metadata: Object.freeze({
      qualityVersion: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
      queryContractVersion: DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
      reflectionContractVersion: DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
      includedArchived: includeArchived,
      readOnly: true as const,
    }),
    contractVersion: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const DecisionJournalEvidenceAssumptionBuilder = Object.freeze({
  evaluateDecisionJournalEvidence,
  evaluateDecisionJournalAssumptions,
  buildDecisionJournalEvidenceAssumptionModelFromEntries,
});
