/**
 * APP-10:7 — Recommendation Learning Engine evidence aggregation and profile builder.
 */

import {
  RECOMMENDATION_CATEGORY_LABELS,
  RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
  RECOMMENDATION_LIFECYCLE_STATE_LABELS,
} from "./recommendationLearningEngineConstants.ts";
import { buildRecommendationId } from "./recommendationLearningNormalizer.ts";
import type {
  ExecutiveRecommendationHistory,
  NormalizedRecommendationRecord,
  RecommendationCategory,
  RecommendationEvidence,
  RecommendationFailureLink,
  RecommendationHistoricalMetrics,
  RecommendationImplementation,
  RecommendationLifecycle,
  RecommendationOutcomeLink,
  RecommendationProfile,
  RecommendationProvenance,
} from "./recommendationLearningEngineTypes.ts";

export type RecommendationRecordGroup = Readonly<{
  groupKey: string;
  workspaceId: string;
  recommendationSummary: string;
  recommendationCategory: RecommendationCategory;
  relatedStrategyIds: readonly string[];
  records: readonly NormalizedRecommendationRecord[];
  readOnly: true;
}>;

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))].sort());
}

function buildEvidenceId(sourceType: string, referenceId: string, scenarioId: string): string {
  return `recommendation-evidence-${sourceType}-${referenceId}-${scenarioId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function groupRecommendationRecords(
  records: readonly NormalizedRecommendationRecord[]
): readonly RecommendationRecordGroup[] {
  const groups = new Map<string, NormalizedRecommendationRecord[]>();
  for (const record of records) {
    const existing = groups.get(record.recommendationSignature) ?? [];
    existing.push(record);
    groups.set(record.recommendationSignature, existing);
  }
  return Object.freeze(
    [...groups.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([groupKey, entries]) => {
        const first = entries[0]!;
        return Object.freeze({
          groupKey,
          workspaceId: first.workspaceId,
          recommendationSummary: first.recommendationSummary,
          recommendationCategory: first.recommendationCategory,
          relatedStrategyIds: first.relatedStrategyIds,
          records: Object.freeze([...entries].sort((a, b) => a.scenarioId.localeCompare(b.scenarioId))),
          readOnly: true as const,
        });
      })
  );
}

export function aggregateRecommendationEvidence(
  records: readonly NormalizedRecommendationRecord[]
): readonly RecommendationEvidence[] {
  const evidenceMap = new Map<string, RecommendationEvidence>();
  for (const record of records) {
    evidenceMap.set(
      buildEvidenceId("recommendation", record.recommendationRecordId, record.scenarioId),
      Object.freeze({
        evidenceId: buildEvidenceId("recommendation", record.recommendationRecordId, record.scenarioId),
        sourceApp: "APP-8",
        sourceType: "recommendation_record",
        referenceId: record.recommendationRecordId,
        scenarioId: record.scenarioId,
        description: `Historical recommendation: ${record.recommendationSummary}.`,
        readOnly: true as const,
      })
    );
    for (const decisionId of record.decisionIds) {
      const evidenceId = buildEvidenceId("decision", decisionId, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-6",
            sourceType: "decision_timeline",
            referenceId: decisionId,
            scenarioId: record.scenarioId,
            description: `Decision timeline reference ${decisionId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const journalId of record.journalEntryIds) {
      const evidenceId = buildEvidenceId("journal", journalId, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-8",
            sourceType: "decision_journal",
            referenceId: journalId,
            scenarioId: record.scenarioId,
            description: `Decision journal reference ${journalId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const timelineRef of record.timelineReferences) {
      const evidenceId = buildEvidenceId("timeline", timelineRef, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-7",
            sourceType: "business_timeline",
            referenceId: timelineRef,
            scenarioId: record.scenarioId,
            description: `Business timeline reference ${timelineRef}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const strategyId of record.relatedStrategyIds) {
      const evidenceId = buildEvidenceId("strategy", strategyId, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-10/6",
            sourceType: "strategy_reference",
            referenceId: strategyId,
            scenarioId: record.scenarioId,
            description: `Related strategy ${strategyId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const similarityId of record.relatedSimilarityResultIds) {
      const evidenceId = buildEvidenceId("similarity", similarityId, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-10/3",
            sourceType: "similarity_reference",
            referenceId: similarityId,
            scenarioId: record.scenarioId,
            description: `Related similarity result ${similarityId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const outcomeId of record.relatedOutcomeIds) {
      const evidenceId = buildEvidenceId("outcome", outcomeId, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-10/4",
            sourceType: "outcome_reference",
            referenceId: outcomeId,
            scenarioId: record.scenarioId,
            description: `Related outcome ${outcomeId}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const failureId of record.relatedFailureIds) {
      const evidenceId = buildEvidenceId("failure", failureId, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-10/5",
            sourceType: "failure_reference",
            referenceId: failureId,
            scenarioId: record.scenarioId,
            description: `Related failure ${failureId}.`,
            readOnly: true as const,
          })
        );
      }
    }
  }
  return Object.freeze([...evidenceMap.values()].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId)));
}

export function buildRecommendationOutcomeLinks(
  records: readonly NormalizedRecommendationRecord[]
): readonly RecommendationOutcomeLink[] {
  const links: RecommendationOutcomeLink[] = [];
  for (const record of records) {
    for (const outcomeId of record.relatedOutcomeIds) {
      links.push(
        Object.freeze({
          linkId: `recommendation-outcome-link-${outcomeId}-${record.scenarioId}`,
          outcomeId,
          scenarioId: record.scenarioId,
          summary: record.outcomeSummary,
          readOnly: true as const,
        })
      );
    }
  }
  return Object.freeze(links.sort((left, right) => left.linkId.localeCompare(right.linkId)));
}

export function buildRecommendationFailureLinks(
  records: readonly NormalizedRecommendationRecord[]
): readonly RecommendationFailureLink[] {
  const links: RecommendationFailureLink[] = [];
  for (const record of records) {
    for (const failureId of record.relatedFailureIds) {
      links.push(
        Object.freeze({
          linkId: `recommendation-failure-link-${failureId}-${record.scenarioId}`,
          failureId,
          scenarioId: record.scenarioId,
          summary: record.failureSummary,
          readOnly: true as const,
        })
      );
    }
  }
  return Object.freeze(links.sort((left, right) => left.linkId.localeCompare(right.linkId)));
}

export function buildAcceptanceHistory(records: readonly NormalizedRecommendationRecord[]): readonly RecommendationLifecycle[] {
  const history: RecommendationLifecycle[] = [];
  for (const record of records) {
    for (const event of record.acceptanceEvents) {
      history.push(
        Object.freeze({
          lifecycleId: `recommendation-lifecycle-${event.state}-${record.scenarioId}-${event.recordedAt}`,
          state: event.state,
          recordedAt: event.recordedAt,
          readOnly: true as const,
        })
      );
    }
  }
  return Object.freeze(history.sort((left, right) => left.lifecycleId.localeCompare(right.lifecycleId)));
}

export function buildImplementationHistory(
  records: readonly NormalizedRecommendationRecord[]
): readonly RecommendationImplementation[] {
  const history: RecommendationImplementation[] = [];
  for (const record of records) {
    for (const event of record.implementationEvents) {
      history.push(
        Object.freeze({
          implementationId: `recommendation-implementation-${record.scenarioId}-${event.implementedAt}`,
          scenarioId: record.scenarioId,
          implementedAt: event.implementedAt,
          summary: event.summary,
          readOnly: true as const,
        })
      );
    }
  }
  return Object.freeze(history.sort((left, right) => left.implementationId.localeCompare(right.implementationId)));
}

export function buildLifecycleHistory(records: readonly NormalizedRecommendationRecord[]): readonly RecommendationLifecycle[] {
  const history: RecommendationLifecycle[] = [];
  for (const record of records) {
    history.push(
      Object.freeze({
        lifecycleId: `recommendation-lifecycle-state-${record.lifecycleState}-${record.scenarioId}`,
        state: record.lifecycleState,
        recordedAt: record.recordedAt,
        readOnly: true as const,
      })
    );
  }
  return Object.freeze(history.sort((left, right) => left.lifecycleId.localeCompare(right.lifecycleId)));
}

export function buildHistoricalMetrics(records: readonly NormalizedRecommendationRecord[]): RecommendationHistoricalMetrics {
  let acceptanceCount = 0;
  let rejectionCount = 0;
  let implementationCount = 0;
  let completionCount = 0;
  for (const record of records) {
    for (const event of record.acceptanceEvents) {
      if (event.state === "accepted") {
        acceptanceCount += 1;
      } else {
        rejectionCount += 1;
      }
    }
    implementationCount += record.implementationEvents.length;
    if (record.lifecycleState === "completed") {
      completionCount += 1;
    }
  }
  return Object.freeze({
    acceptanceCount,
    rejectionCount,
    implementationCount,
    completionCount,
    readOnly: true as const,
  });
}

export function buildRecommendationProvenance(group: RecommendationRecordGroup): RecommendationProvenance {
  const scenarioIds = uniqueSorted(group.records.map((record) => record.scenarioId));
  return Object.freeze({
    scenarioIds,
    decisionIds: uniqueSorted(group.records.flatMap((record) => record.decisionIds)),
    journalEntryIds: uniqueSorted(group.records.flatMap((record) => record.journalEntryIds)),
    timelineReferences: uniqueSorted(group.records.flatMap((record) => record.timelineReferences)),
    similarityResultIds: uniqueSorted(group.records.flatMap((record) => record.relatedSimilarityResultIds)),
    strategyIds: uniqueSorted(group.records.flatMap((record) => record.relatedStrategyIds)),
    outcomeIds: uniqueSorted(group.records.flatMap((record) => record.relatedOutcomeIds)),
    failureIds: uniqueSorted(group.records.flatMap((record) => record.relatedFailureIds)),
    confidenceVersion: group.records[0]?.confidenceVersion ?? "APP-9/1",
    similarityVersion: "APP-10/3",
    outcomeVersion: "APP-10/4",
    failureVersion: "APP-10/5",
    strategyVersion: "APP-10/6",
    engineVersion: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveRecommendationHistoryFromGroup(
  group: RecommendationRecordGroup,
  learningTimestamp: string
): ExecutiveRecommendationHistory {
  const historicalEvidence = aggregateRecommendationEvidence(group.records);
  const provenance = buildRecommendationProvenance(group);
  const first = group.records[0]!;
  const recommendationId = buildRecommendationId(group.workspaceId, group.groupKey);
  const acceptanceHistory = buildAcceptanceHistory(group.records);
  const implementationHistory = buildImplementationHistory(group.records);
  const lifecycleHistory = buildLifecycleHistory(group.records);
  const outcomeLinks = buildRecommendationOutcomeLinks(group.records);
  const failureLinks = buildRecommendationFailureLinks(group.records);
  const historicalMetrics = buildHistoricalMetrics(group.records);

  const profile: RecommendationProfile = Object.freeze({
    recommendationId,
    workspaceId: group.workspaceId,
    recommendationCategory: group.recommendationCategory,
    recommendationSummary: group.recommendationSummary,
    lifecycleState: first.lifecycleState,
    relatedStrategyIds: group.relatedStrategyIds,
    relatedOutcomeIds: provenance.outcomeIds,
    relatedFailureIds: provenance.failureIds,
    relatedScenarioIds: provenance.scenarioIds,
    acceptanceHistory,
    implementationHistory,
    outcomeSummary: first.outcomeSummary,
    failureSummary: first.failureSummary,
    historicalEvidence,
    historicalMetrics,
    provenance,
    evidenceCount: historicalEvidence.length,
    engineVersion: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
    learningTimestamp,
    version: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
    metadata: Object.freeze({
      metadataVersion: RECOMMENDATION_LEARNING_ENGINE_CONTRACT_VERSION,
      owner: "recommendation-learning-engine",
      extensions: Object.freeze({
        scenarioCount: String(group.records.length),
        categoryLabel: RECOMMENDATION_CATEGORY_LABELS[group.recommendationCategory],
        lifecycleLabel: RECOMMENDATION_LIFECYCLE_STATE_LABELS[first.lifecycleState],
      }),
      readOnly: true as const,
    }),
    readOnly: true as const,
  });

  return Object.freeze({
    profile,
    outcomeLinks,
    failureLinks,
    lifecycleHistory,
    readOnly: true as const,
  });
}

export const RecommendationLearningEvidenceAggregation = Object.freeze({
  groupRecommendationRecords,
  aggregateRecommendationEvidence,
  buildExecutiveRecommendationHistoryFromGroup,
  buildRecommendationProvenance,
  buildRecommendationOutcomeLinks,
  buildRecommendationFailureLinks,
  buildHistoricalMetrics,
});
