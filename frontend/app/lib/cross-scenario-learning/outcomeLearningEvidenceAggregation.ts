/**
 * APP-10:4 — Outcome Learning Engine evidence aggregation and profile builder.
 */

import { OUTCOME_CATEGORY_KEYS, OUTCOME_CATEGORY_LABELS, OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION } from "./outcomeLearningEngineConstants.ts";
import { buildOutcomeId } from "./outcomeLearningNormalizer.ts";
import type {
  ExecutiveOutcome,
  NormalizedOutcomeRecord,
  OutcomeCategory,
  OutcomeEvidence,
  OutcomeHistory,
  OutcomeMetadata,
  OutcomeProfile,
  OutcomeProvenance,
  OutcomeStatistics,
  OutcomeSummary,
} from "./outcomeLearningEngineTypes.ts";

export type OutcomeRecordGroup = Readonly<{
  groupKey: string;
  workspaceId: string;
  businessGoal: string;
  finalOutcomeCategory: OutcomeCategory;
  relatedPatternIds: readonly string[];
  records: readonly NormalizedOutcomeRecord[];
  readOnly: true;
}>;

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))].sort());
}

function buildEvidenceId(sourceType: string, referenceId: string, scenarioId: string): string {
  return `outcome-evidence-${sourceType}-${referenceId}-${scenarioId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export function groupOutcomeRecords(records: readonly NormalizedOutcomeRecord[]): readonly OutcomeRecordGroup[] {
  const groups = new Map<string, NormalizedOutcomeRecord[]>();
  for (const record of records) {
    const existing = groups.get(record.outcomeSignature) ?? [];
    existing.push(record);
    groups.set(record.outcomeSignature, existing);
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
          finalOutcomeCategory: first.finalOutcomeCategory,
          relatedPatternIds: first.relatedPatternIds,
          records: Object.freeze([...entries].sort((a, b) => a.scenarioId.localeCompare(b.scenarioId))),
          readOnly: true as const,
        });
      })
  );
}

export function aggregateOutcomeEvidence(records: readonly NormalizedOutcomeRecord[]): readonly OutcomeEvidence[] {
  const evidenceMap = new Map<string, OutcomeEvidence>();
  for (const record of records) {
    evidenceMap.set(
      buildEvidenceId("scenario", record.scenarioId, record.scenarioId),
      Object.freeze({
        evidenceId: buildEvidenceId("scenario", record.scenarioId, record.scenarioId),
        sourceApp: "APP-5",
        sourceType: "completed_scenario",
        referenceId: record.scenarioId,
        scenarioId: record.scenarioId,
        description: `Completed scenario outcome for ${record.businessGoal}.`,
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
            sourceType: "decision_outcome",
            referenceId: decisionId,
            scenarioId: record.scenarioId,
            description: `Decision outcome ${decisionId}.`,
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
            sourceType: "journal_outcome",
            referenceId: journalId,
            scenarioId: record.scenarioId,
            description: `Journal outcome ${journalId}.`,
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
            sourceType: "timeline_outcome",
            referenceId: timelineRef,
            scenarioId: record.scenarioId,
            description: `Timeline outcome ${timelineRef}.`,
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
  }
  return Object.freeze([...evidenceMap.values()].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId)));
}

export function buildOutcomeProvenance(group: OutcomeRecordGroup): OutcomeProvenance {
  const scenarioIds = uniqueSorted(group.records.map((record) => record.scenarioId));
  return Object.freeze({
    scenarioIds,
    decisionIds: uniqueSorted(group.records.flatMap((record) => record.decisionIds)),
    journalEntryIds: uniqueSorted(group.records.flatMap((record) => record.journalEntryIds)),
    timelineReferences: uniqueSorted(group.records.flatMap((record) => record.timelineReferences)),
    similarityResultIds: uniqueSorted(group.records.flatMap((record) => record.relatedSimilarityResultIds)),
    patternIds: uniqueSorted(group.records.flatMap((record) => record.relatedPatternIds)),
    confidenceVersion: group.records[0]?.confidenceVersion ?? "APP-9/1",
    extractionVersion: "APP-10/2",
    similarityVersion: "APP-10/3",
    engineVersion: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildOutcomeStatistics(group: OutcomeRecordGroup, evidenceCount: number): OutcomeStatistics {
  const categoryCounts = Object.fromEntries(
    OUTCOME_CATEGORY_KEYS.map((category) => [category, 0])
  ) as Record<OutcomeCategory, number>;
  for (const record of group.records) {
    categoryCounts[record.finalOutcomeCategory] += 1;
  }
  return Object.freeze({
    totalScenarios: group.records.length,
    totalEvidence: evidenceCount,
    categoryCounts: Object.freeze(categoryCounts),
    patternCount: group.relatedPatternIds.length,
    readOnly: true as const,
  });
}

export function buildOutcomeHistory(group: OutcomeRecordGroup): OutcomeHistory {
  return Object.freeze({
    historyId: `outcome-history-${group.groupKey.slice(0, 32)}`,
    scenarioIds: uniqueSorted(group.records.map((record) => record.scenarioId)),
    outcomeCategories: Object.freeze(group.records.map((record) => record.finalOutcomeCategory)),
    recordedAt: Object.freeze(group.records.map((record) => record.recordedAt)),
    readOnly: true as const,
  });
}

export function buildExecutiveOutcomeFromGroup(
  group: OutcomeRecordGroup,
  learningTimestamp: string
): ExecutiveOutcome {
  const evidence = aggregateOutcomeEvidence(group.records);
  const provenance = buildOutcomeProvenance(group);
  const first = group.records[0]!;
  const outcomeId = buildOutcomeId(group.workspaceId, group.groupKey);

  const profile: OutcomeProfile = Object.freeze({
    outcomeId,
    workspaceId: group.workspaceId,
    relatedPatternIds: group.relatedPatternIds,
    relatedScenarioIds: provenance.scenarioIds,
    businessGoal: group.businessGoal,
    finalOutcomeCategory: group.finalOutcomeCategory,
    kpiChangeSummary: first.kpiChangeSummary,
    riskChangeSummary: first.riskChangeSummary,
    decisionSummary: first.decisionSummary,
    evidenceCount: evidence.length,
    provenance,
    engineVersion: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
    learningTimestamp,
    version: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
    metadata: Object.freeze({
      metadataVersion: OUTCOME_LEARNING_ENGINE_CONTRACT_VERSION,
      owner: "outcome-learning-engine",
      extensions: Object.freeze({
        scenarioCount: String(group.records.length),
        patternCount: String(group.relatedPatternIds.length),
      }),
      readOnly: true as const,
    }),
    readOnly: true as const,
  });

  const summary: OutcomeSummary = Object.freeze({
    summaryId: `outcome-summary-${outcomeId}`,
    headline: `${OUTCOME_CATEGORY_LABELS[group.finalOutcomeCategory]} outcome observed for ${group.businessGoal}.`,
    category: group.finalOutcomeCategory,
    scenarioCount: group.records.length,
    evidenceCount: evidence.length,
    readOnly: true as const,
  });

  return Object.freeze({
    outcome: profile,
    summary,
    evidence,
    statistics: buildOutcomeStatistics(group, evidence.length),
    history: buildOutcomeHistory(group),
    readOnly: true as const,
  });
}

export const OutcomeLearningEvidenceAggregation = Object.freeze({
  groupOutcomeRecords,
  aggregateOutcomeEvidence,
  buildExecutiveOutcomeFromGroup,
  buildOutcomeProvenance,
});
