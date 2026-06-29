/**
 * APP-8:6 — Decision Journal Retrospective model builder.
 */

import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";
import type {
  DecisionJournalAssumptionModel,
  DecisionJournalEvidenceModel,
} from "./decisionJournalEvidenceAssumptionTypes.ts";
import {
  evaluateDecisionJournalAssumptions,
  evaluateDecisionJournalEvidence,
} from "./decisionJournalEvidenceAssumptionBuilder.ts";
import { buildWorkspaceAssumptionCounts } from "./decisionJournalAssumptionRules.ts";
import {
  calculateOutcomeStatus,
  outcomeStatusConfidence,
  readObservedOutcome,
  readRetrospectiveMetadataValue,
} from "./decisionJournalOutcomeRules.ts";
import { detectRetrospectiveFlags } from "./decisionJournalRetrospectiveFlags.ts";
import {
  calculateAssumptionAccuracy,
  calculateEvidenceReliability,
  calculateRetrospectiveConfidence,
  calculateReviewCompleteness,
  calculateRiskRealization,
  readLessonsLearned,
  readRetrospectiveNotes,
} from "./decisionJournalRetrospectiveRules.ts";
import {
  DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
  type BuildDecisionJournalRetrospectiveInput,
  type DecisionJournalOutcomeEvaluation,
  type DecisionJournalRetrospectiveFlag,
  type DecisionJournalRetrospectiveModel,
  type DecisionJournalRetrospectiveWorkspaceModel,
} from "./decisionJournalRetrospectiveTypes.ts";
import { DECISION_JOURNAL_QUERY_CONTRACT_VERSION } from "./decisionJournalQueryTypes.ts";
import { DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION } from "./decisionJournalEvidenceAssumptionTypes.ts";

export function evaluateDecisionJournalOutcome(
  entry: DecisionJournalEngineEntry
): DecisionJournalOutcomeEvaluation {
  const expectedOutcome = entry.expectedOutcome;
  const observedOutcome = readObservedOutcome(entry);
  const outcomeStatus = calculateOutcomeStatus(
    expectedOutcome,
    observedOutcome,
    readRetrospectiveMetadataValue(entry, "outcomeStatus")
  );
  return Object.freeze({
    workspaceId: entry.workspaceId,
    entryId: entry.id,
    expectedOutcome,
    observedOutcome,
    outcomeStatus,
    confidence: outcomeStatusConfidence(outcomeStatus),
    metadata: Object.freeze({
      entryTitle: entry.title,
    }),
    readOnly: true as const,
  });
}

export function evaluateDecisionJournalRetrospective(
  entry: DecisionJournalEngineEntry,
  evidenceModel: DecisionJournalEvidenceModel,
  assumptionModel: DecisionJournalAssumptionModel
): DecisionJournalRetrospectiveModel {
  const outcome = evaluateDecisionJournalOutcome(entry);
  const assumptionAccuracy = calculateAssumptionAccuracy(entry, assumptionModel);
  const riskRealization = calculateRiskRealization(entry);
  const evidenceReliability = calculateEvidenceReliability(entry, evidenceModel);
  const reviewCompleteness = calculateReviewCompleteness(entry);

  const preliminary = Object.freeze({
    workspaceId: entry.workspaceId,
    entryId: entry.id,
    expectedOutcome: outcome.expectedOutcome,
    observedOutcome: outcome.observedOutcome,
    outcomeStatus: outcome.outcomeStatus,
    retrospectiveNotes: readRetrospectiveNotes(entry),
    lessonsLearned: readLessonsLearned(entry),
    assumptionAccuracy,
    riskRealization,
    evidenceReliability,
    reviewCompleteness,
    flags: Object.freeze([]),
    confidence: calculateRetrospectiveConfidence(
      assumptionAccuracy,
      riskRealization,
      evidenceReliability,
      reviewCompleteness
    ),
    metadata: Object.freeze({
      entryTitle: entry.title,
      entryStatus: entry.status,
    }),
    readOnly: true as const,
  });

  const flags = detectRetrospectiveFlags(entry, preliminary);
  return Object.freeze({
    ...preliminary,
    flags,
  });
}

export function buildDecisionJournalRetrospectiveModelFromEntries(
  entries: readonly DecisionJournalEngineEntry[],
  input: BuildDecisionJournalRetrospectiveInput
): DecisionJournalRetrospectiveWorkspaceModel {
  const generatedAt = input.generatedAt ?? "2026-01-01T00:00:00.000Z";
  const includeArchived = input.includeArchived ?? false;
  const workspaceAssumptionCounts = buildWorkspaceAssumptionCounts(entries);
  const retrospectives: DecisionJournalRetrospectiveModel[] = [];
  const retrospectiveFlags: DecisionJournalRetrospectiveFlag[] = [];

  for (const entry of entries) {
    const evidenceModel = evaluateDecisionJournalEvidence(entry);
    const assumptionModel = evaluateDecisionJournalAssumptions(entry, workspaceAssumptionCounts);
    const retrospective = evaluateDecisionJournalRetrospective(entry, evidenceModel, assumptionModel);
    retrospectives.push(retrospective);
    retrospectiveFlags.push(...retrospective.flags);
  }

  return Object.freeze({
    workspaceId: input.workspaceId,
    entryCount: entries.length,
    generatedAt,
    retrospectives: Object.freeze(retrospectives),
    retrospectiveFlags: Object.freeze(
      [...retrospectiveFlags].sort(
        (left, right) => left.type.localeCompare(right.type) || left.entryId.localeCompare(right.entryId)
      )
    ),
    metadata: Object.freeze({
      retrospectiveVersion: DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
      queryContractVersion: DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
      evidenceAssumptionContractVersion: DECISION_JOURNAL_EVIDENCE_ASSUMPTION_CONTRACT_VERSION,
      includedArchived: includeArchived,
      readOnly: true as const,
    }),
    contractVersion: DECISION_JOURNAL_RETROSPECTIVE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const DecisionJournalRetrospectiveBuilder = Object.freeze({
  evaluateDecisionJournalOutcome,
  evaluateDecisionJournalRetrospective,
  buildDecisionJournalRetrospectiveModelFromEntries,
});
