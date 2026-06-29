/**
 * APP-10:7 — Recommendation Learning Engine record normalizer.
 */

import type {
  HistoricalRecommendationRecordInput,
  NormalizedRecommendationRecord,
} from "./recommendationLearningEngineTypes.ts";

function normalizeValue(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.map((value) => value.trim()).filter(Boolean))].sort());
}

export function buildRecommendationSignature(
  recommendationSummary: string,
  recommendationCategory: string,
  relatedStrategyIds: readonly string[]
): string {
  const strategyKey = [...relatedStrategyIds].sort().join("|") || "no-strategies";
  return `${normalizeValue(recommendationSummary).toLowerCase()}|${recommendationCategory}|${strategyKey}`;
}

export function buildRecommendationId(workspaceId: string, recommendationSignature: string): string {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  let hash = 0;
  for (let index = 0; index < recommendationSignature.length; index += 1) {
    hash = (Math.imul(31, hash) + recommendationSignature.charCodeAt(index)) >>> 0;
  }
  return `executive-recommendation-${safeWorkspace}-${hash.toString(16).padStart(8, "0")}`;
}

export function normalizeRecommendationRecord(
  input: HistoricalRecommendationRecordInput,
  defaultTimestamp: string
): NormalizedRecommendationRecord {
  const relatedStrategyIds = uniqueSorted(input.relatedStrategyIds);
  const recommendationSignature = buildRecommendationSignature(
    input.recommendationSummary,
    input.recommendationCategory,
    relatedStrategyIds
  );
  return Object.freeze({
    recommendationRecordId: input.recommendationRecordId.trim(),
    scenarioId: input.scenarioId.trim(),
    workspaceId: input.workspaceId.trim(),
    recommendationSignature,
    recommendationSummary: normalizeValue(input.recommendationSummary),
    recommendationCategory: input.recommendationCategory,
    lifecycleState: input.lifecycleState,
    outcomeSummary: normalizeValue(input.outcomeSummary),
    failureSummary: normalizeValue(input.failureSummary),
    relatedStrategyIds,
    relatedSimilarityResultIds: uniqueSorted(input.relatedSimilarityResultIds),
    relatedOutcomeIds: uniqueSorted(input.relatedOutcomeIds),
    relatedFailureIds: uniqueSorted(input.relatedFailureIds),
    decisionIds: uniqueSorted(input.decisionIds),
    journalEntryIds: uniqueSorted(input.journalEntryIds),
    timelineReferences: uniqueSorted(input.timelineReferences),
    acceptanceEvents: Object.freeze(
      input.acceptanceEvents.map((event) =>
        Object.freeze({
          state: event.state,
          recordedAt: event.recordedAt ?? defaultTimestamp,
        })
      )
    ),
    implementationEvents: Object.freeze(
      input.implementationEvents.map((event) =>
        Object.freeze({
          implementedAt: event.implementedAt ?? defaultTimestamp,
          summary: normalizeValue(event.summary),
        })
      )
    ),
    confidenceVersion: input.confidenceVersion?.trim() || "APP-9/1",
    sourceApps: uniqueSorted(input.sourceApps),
    recordedAt: input.recordedAt ?? defaultTimestamp,
    readOnly: true as const,
  });
}

export function normalizeRecommendationRecords(
  records: readonly HistoricalRecommendationRecordInput[],
  defaultTimestamp: string
): readonly NormalizedRecommendationRecord[] {
  return Object.freeze(records.map((record) => normalizeRecommendationRecord(record, defaultTimestamp)));
}

export const RecommendationLearningNormalizer = Object.freeze({
  normalizeRecommendationRecord,
  normalizeRecommendationRecords,
  buildRecommendationSignature,
  buildRecommendationId,
});
