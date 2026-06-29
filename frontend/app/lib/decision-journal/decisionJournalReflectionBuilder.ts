/**
 * APP-8:4 — Decision Journal Reflection model builder.
 */

import { DECISION_JOURNAL_QUERY_CONTRACT_VERSION } from "./decisionJournalQueryTypes.ts";
import {
  buildAlternativeSummary,
  buildConstraintSummary,
  buildTradeoffSummary,
  extractAssumptionPatterns,
  extractDecisionJournalInsights,
  extractRiskPatterns,
  summarizeDecisionJournalConfidence,
  summarizeDecisionJournalEvidence,
  summarizeDecisionJournalReviews,
} from "./decisionJournalInsightExtraction.ts";
import {
  DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
  type BuildDecisionJournalReflectionInput,
  type DecisionJournalReflectionModel,
} from "./decisionJournalReflectionTypes.ts";
import type { DecisionJournalEngineEntry } from "./decisionJournalEngineTypes.ts";

export function buildDecisionJournalReflectionModelFromEntries(
  entries: readonly DecisionJournalEngineEntry[],
  input: BuildDecisionJournalReflectionInput
): DecisionJournalReflectionModel {
  const generatedAt = input.generatedAt ?? "2026-01-01T00:00:00.000Z";
  const includeArchived = input.includeArchived ?? false;
  const workspaceId = input.workspaceId;

  return Object.freeze({
    workspaceId,
    entryCount: entries.length,
    generatedAt,
    insightItems: extractDecisionJournalInsights(entries, workspaceId),
    assumptionPatterns: extractAssumptionPatterns(entries),
    riskPatterns: extractRiskPatterns(entries),
    evidenceSummary: summarizeDecisionJournalEvidence(entries),
    alternativeSummary: buildAlternativeSummary(entries),
    confidenceSummary: summarizeDecisionJournalConfidence(entries),
    tradeoffSummary: buildTradeoffSummary(entries),
    constraintSummary: buildConstraintSummary(entries),
    reviewSummary: summarizeDecisionJournalReviews(entries),
    metadata: Object.freeze({
      reflectionVersion: DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
      queryContractVersion: DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
      includedArchived: includeArchived,
      readOnly: true as const,
    }),
    contractVersion: DECISION_JOURNAL_REFLECTION_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const DecisionJournalReflectionBuilder = Object.freeze({
  buildDecisionJournalReflectionModelFromEntries,
});
