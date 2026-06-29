/**
 * APP-10:5 — Failure Learning Engine evidence aggregation and profile builder.
 */

import {
  FAILURE_CATEGORY_LABELS,
  FAILURE_FACTOR_LABELS,
  FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
} from "./failureLearningEngineConstants.ts";
import { buildFailureId } from "./failureLearningNormalizer.ts";
import type {
  ExecutiveFailure,
  FailureCategory,
  FailureCause,
  FailureEvidence,
  FailureFactor,
  FailureFactorKey,
  FailureHistory,
  FailureMetadata,
  FailureProfile,
  FailureProvenance,
  NormalizedFailureRecord,
} from "./failureLearningEngineTypes.ts";

export type FailureRecordGroup = Readonly<{
  groupKey: string;
  workspaceId: string;
  businessGoal: string;
  failureCategory: FailureCategory;
  failureFactorKeys: readonly FailureFactorKey[];
  relatedPatternIds: readonly string[];
  records: readonly NormalizedFailureRecord[];
  readOnly: true;
}>;

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))].sort());
}

function buildEvidenceId(sourceType: string, referenceId: string, scenarioId: string): string {
  return `failure-evidence-${sourceType}-${referenceId}-${scenarioId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function buildFailureFactors(factorKeys: readonly FailureFactorKey[]): readonly FailureFactor[] {
  return Object.freeze(
    [...factorKeys]
      .sort()
      .map((factorKey) =>
        Object.freeze({
          factorId: `failure-factor-${factorKey}`,
          factorKey,
          label: FAILURE_FACTOR_LABELS[factorKey],
          description: `Historical contributing factor: ${FAILURE_FACTOR_LABELS[factorKey]}.`,
          readOnly: true as const,
        })
      )
  );
}

function buildFailureCauses(
  records: readonly NormalizedFailureRecord[]
): readonly FailureCause[] {
  const causeMap = new Map<string, FailureCause>();
  for (const record of records) {
    for (const cause of record.failureCauses) {
      const causeId = `failure-cause-${cause.label.toLowerCase().replace(/\s+/g, "-")}`;
      if (!causeMap.has(causeId)) {
        causeMap.set(
          causeId,
          Object.freeze({
            causeId,
            label: cause.label,
            description: cause.description,
            readOnly: true as const,
          })
        );
      }
    }
  }
  return Object.freeze([...causeMap.values()].sort((left, right) => left.causeId.localeCompare(right.causeId)));
}

export function groupFailureRecords(records: readonly NormalizedFailureRecord[]): readonly FailureRecordGroup[] {
  const groups = new Map<string, NormalizedFailureRecord[]>();
  for (const record of records) {
    const existing = groups.get(record.failureSignature) ?? [];
    existing.push(record);
    groups.set(record.failureSignature, existing);
  }
  return Object.freeze(
    [...groups.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([groupKey, entries]) => {
        const first = entries[0]!;
        return Object.freeze({
          groupKey,
          workspaceId: first.workspaceId,
          businessGoal: first.businessGoal,
          failureCategory: first.failureCategory,
          failureFactorKeys: first.failureFactorKeys,
          relatedPatternIds: first.relatedPatternIds,
          records: Object.freeze([...entries].sort((a, b) => a.scenarioId.localeCompare(b.scenarioId))),
          readOnly: true as const,
        });
      })
  );
}

export function aggregateFailureEvidence(records: readonly NormalizedFailureRecord[]): readonly FailureEvidence[] {
  const evidenceMap = new Map<string, FailureEvidence>();
  for (const record of records) {
    evidenceMap.set(
      buildEvidenceId("scenario", record.scenarioId, record.scenarioId),
      Object.freeze({
        evidenceId: buildEvidenceId("scenario", record.scenarioId, record.scenarioId),
        sourceApp: "APP-5",
        sourceType: "failed_scenario",
        referenceId: record.scenarioId,
        scenarioId: record.scenarioId,
        description: `Failed scenario evidence for ${record.businessGoal}.`,
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
            sourceType: "failed_decision",
            referenceId: decisionId,
            scenarioId: record.scenarioId,
            description: `Failed decision ${decisionId}.`,
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
            sourceType: "journal_failure",
            referenceId: journalId,
            scenarioId: record.scenarioId,
            description: `Journal failure record ${journalId}.`,
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
            sourceType: "timeline_failure",
            referenceId: timelineRef,
            scenarioId: record.scenarioId,
            description: `Timeline failure ${timelineRef}.`,
            readOnly: true as const,
          })
        );
      }
    }
    for (const patternId of record.relatedPatternIds) {
      const evidenceId = buildEvidenceId("pattern", patternId, record.scenarioId);
      if (!evidenceMap.has(evidenceId)) {
        evidenceMap.set(
          evidenceId,
          Object.freeze({
            evidenceId,
            sourceApp: "APP-10/2",
            sourceType: "pattern_reference",
            referenceId: patternId,
            scenarioId: record.scenarioId,
            description: `Related pattern ${patternId}.`,
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
  }
  return Object.freeze([...evidenceMap.values()].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId)));
}

export function buildFailureProvenance(group: FailureRecordGroup): FailureProvenance {
  const scenarioIds = uniqueSorted(group.records.map((record) => record.scenarioId));
  return Object.freeze({
    scenarioIds,
    decisionIds: uniqueSorted(group.records.flatMap((record) => record.decisionIds)),
    journalEntryIds: uniqueSorted(group.records.flatMap((record) => record.journalEntryIds)),
    timelineReferences: uniqueSorted(group.records.flatMap((record) => record.timelineReferences)),
    similarityResultIds: uniqueSorted(group.records.flatMap((record) => record.relatedSimilarityResultIds)),
    patternIds: uniqueSorted(group.records.flatMap((record) => record.relatedPatternIds)),
    outcomeIds: uniqueSorted(group.records.flatMap((record) => record.relatedOutcomeIds)),
    confidenceVersion: group.records[0]?.confidenceVersion ?? "APP-9/1",
    extractionVersion: "APP-10/2",
    similarityVersion: "APP-10/3",
    outcomeVersion: "APP-10/4",
    engineVersion: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildFailureHistory(group: FailureRecordGroup): FailureHistory {
  return Object.freeze({
    historyId: `failure-history-${group.groupKey.slice(0, 32)}`,
    scenarioIds: uniqueSorted(group.records.map((record) => record.scenarioId)),
    failureCategories: Object.freeze(group.records.map((record) => record.failureCategory)),
    recordedAt: Object.freeze(group.records.map((record) => record.recordedAt)),
    readOnly: true as const,
  });
}

export function buildExecutiveFailureFromGroup(
  group: FailureRecordGroup,
  learningTimestamp: string
): ExecutiveFailure {
  const evidence = aggregateFailureEvidence(group.records);
  const provenance = buildFailureProvenance(group);
  const first = group.records[0]!;
  const failureId = buildFailureId(group.workspaceId, group.groupKey);
  const failureFactors = buildFailureFactors(group.failureFactorKeys);
  const failureCauses = buildFailureCauses(group.records);

  const profile: FailureProfile = Object.freeze({
    failureId,
    workspaceId: group.workspaceId,
    relatedPatternIds: group.relatedPatternIds,
    relatedScenarioIds: provenance.scenarioIds,
    relatedOutcomeIds: provenance.outcomeIds,
    businessGoal: group.businessGoal,
    failureCategory: group.failureCategory,
    failureFactors,
    failureCauses,
    kpiImpactSummary: first.kpiImpactSummary,
    riskImpactSummary: first.riskImpactSummary,
    evidenceCount: evidence.length,
    provenance,
    engineVersion: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
    learningTimestamp,
    version: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
    metadata: Object.freeze({
      metadataVersion: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
      owner: "failure-learning-engine",
      extensions: Object.freeze({
        scenarioCount: String(group.records.length),
        patternCount: String(group.relatedPatternIds.length),
        factorCount: String(failureFactors.length),
      }),
      readOnly: true as const,
    } satisfies FailureMetadata),
    readOnly: true as const,
  });

  return Object.freeze({
    failure: profile,
    evidence,
    history: buildFailureHistory(group),
    readOnly: true as const,
  });
}

export const FailureLearningEvidenceAggregation = Object.freeze({
  groupFailureRecords,
  aggregateFailureEvidence,
  buildExecutiveFailureFromGroup,
  buildFailureProvenance,
});
