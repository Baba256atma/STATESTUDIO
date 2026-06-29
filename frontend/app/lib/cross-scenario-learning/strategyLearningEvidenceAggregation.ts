/**
 * APP-10:6 — Strategy Learning Engine evidence aggregation and profile builder.
 */

import {
  STRATEGY_CATEGORY_LABELS,
  STRATEGY_CONDITION_KEYS,
  STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
} from "./strategyLearningEngineConstants.ts";
import { buildStrategyId } from "./strategyLearningNormalizer.ts";
import type {
  ExecutiveStrategy,
  NormalizedStrategyRecord,
  StrategyCategory,
  StrategyCondition,
  StrategyConditionKey,
  StrategyEvidence,
  StrategyFailureLink,
  StrategyOutcomeLink,
  StrategyProfile,
  StrategyProvenance,
} from "./strategyLearningEngineTypes.ts";

export type StrategyRecordGroup = Readonly<{
  groupKey: string;
  workspaceId: string;
  strategyName: string;
  strategyCategory: StrategyCategory;
  relatedPatternIds: readonly string[];
  records: readonly NormalizedStrategyRecord[];
  readOnly: true;
}>;

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))].sort());
}

function buildEvidenceId(sourceType: string, referenceId: string, scenarioId: string): string {
  return `strategy-evidence-${sourceType}-${referenceId}-${scenarioId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function buildBusinessConditions(record: NormalizedStrategyRecord): readonly StrategyCondition[] {
  const conditionValues: Readonly<Record<StrategyConditionKey, string>> = Object.freeze({
    workspace_domain: record.workspaceDomain,
    business_goal: record.businessGoal,
    timeline_phase: record.timelinePhase,
    kpi_direction: record.kpiDirection,
    risk_profile: record.riskProfile,
    resource_constraints: record.resourceConstraints,
    dependency_constraints: record.dependencyConstraints,
    execution_conditions: record.executionConditions,
  });
  return Object.freeze(
    STRATEGY_CONDITION_KEYS.map((conditionKey) =>
      Object.freeze({
        conditionId: `strategy-condition-${conditionKey}-${record.scenarioId}`,
        conditionKey,
        label: conditionKey.replace(/_/g, " "),
        value: conditionValues[conditionKey],
        readOnly: true as const,
      })
    )
  );
}

function mergeBusinessConditions(records: readonly NormalizedStrategyRecord[]): readonly StrategyCondition[] {
  const conditionMap = new Map<string, StrategyCondition>();
  for (const record of records) {
    for (const condition of buildBusinessConditions(record)) {
      const key = `${condition.conditionKey}|${condition.value}`;
      if (!conditionMap.has(key)) {
        conditionMap.set(key, condition);
      }
    }
  }
  return Object.freeze([...conditionMap.values()].sort((left, right) => left.conditionId.localeCompare(right.conditionId)));
}

export function groupStrategyRecords(records: readonly NormalizedStrategyRecord[]): readonly StrategyRecordGroup[] {
  const groups = new Map<string, NormalizedStrategyRecord[]>();
  for (const record of records) {
    const existing = groups.get(record.strategySignature) ?? [];
    existing.push(record);
    groups.set(record.strategySignature, existing);
  }
  return Object.freeze(
    [...groups.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([groupKey, entries]) => {
        const first = entries[0]!;
        return Object.freeze({
          groupKey,
          workspaceId: first.workspaceId,
          strategyName: first.strategyName,
          strategyCategory: first.strategyCategory,
          relatedPatternIds: first.relatedPatternIds,
          records: Object.freeze([...entries].sort((a, b) => a.scenarioId.localeCompare(b.scenarioId))),
          readOnly: true as const,
        });
      })
  );
}

function aggregateAllEvidence(records: readonly NormalizedStrategyRecord[]): readonly StrategyEvidence[] {
  const evidenceMap = new Map<string, StrategyEvidence>();
  for (const record of records) {
    evidenceMap.set(
      buildEvidenceId("scenario", record.scenarioId, record.scenarioId),
      Object.freeze({
        evidenceId: buildEvidenceId("scenario", record.scenarioId, record.scenarioId),
        sourceApp: "APP-5",
        sourceType: "strategy_scenario",
        referenceId: record.scenarioId,
        scenarioId: record.scenarioId,
        description: `Strategy scenario evidence for ${record.strategyName}.`,
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
            sourceType: "strategy_decision",
            referenceId: decisionId,
            scenarioId: record.scenarioId,
            description: `Strategy decision ${decisionId}.`,
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
            sourceType: "strategy_journal",
            referenceId: journalId,
            scenarioId: record.scenarioId,
            description: `Strategy journal ${journalId}.`,
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
            sourceType: "strategy_timeline",
            referenceId: timelineRef,
            scenarioId: record.scenarioId,
            description: `Strategy timeline ${timelineRef}.`,
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

export function classifyStrategyEvidence(
  records: readonly NormalizedStrategyRecord[],
  allEvidence: readonly StrategyEvidence[]
): Readonly<{
  successEvidence: readonly StrategyEvidence[];
  failureEvidence: readonly StrategyEvidence[];
  riskEvidence: readonly StrategyEvidence[];
}> {
  const successIds = new Set<string>();
  const failureIds = new Set<string>();
  const riskIds = new Set<string>();

  for (const record of records) {
    for (const outcomeId of record.relatedOutcomeIds) {
      successIds.add(buildEvidenceId("outcome", outcomeId, record.scenarioId));
    }
    for (const failureId of record.relatedFailureIds) {
      failureIds.add(buildEvidenceId("failure", failureId, record.scenarioId));
    }
    if (record.riskProfile === "high" || record.riskProfile === "medium") {
      for (const timelineRef of record.timelineReferences) {
        riskIds.add(buildEvidenceId("timeline", timelineRef, record.scenarioId));
      }
      riskIds.add(buildEvidenceId("scenario", record.scenarioId, record.scenarioId));
    }
  }

  const successEvidence = allEvidence.filter((entry) => successIds.has(entry.evidenceId));
  const failureEvidence = allEvidence.filter((entry) => failureIds.has(entry.evidenceId));
  const riskEvidence = allEvidence.filter((entry) => riskIds.has(entry.evidenceId));

  return Object.freeze({
    successEvidence: Object.freeze(successEvidence),
    failureEvidence: Object.freeze(failureEvidence),
    riskEvidence: Object.freeze(riskEvidence),
  });
}

export function buildStrategyOutcomeLinks(records: readonly NormalizedStrategyRecord[]): readonly StrategyOutcomeLink[] {
  const links: StrategyOutcomeLink[] = [];
  for (const record of records) {
    for (const outcomeId of record.relatedOutcomeIds) {
      links.push(
        Object.freeze({
          linkId: `strategy-outcome-link-${outcomeId}-${record.scenarioId}`,
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

export function buildStrategyFailureLinks(records: readonly NormalizedStrategyRecord[]): readonly StrategyFailureLink[] {
  const links: StrategyFailureLink[] = [];
  for (const record of records) {
    for (const failureId of record.relatedFailureIds) {
      links.push(
        Object.freeze({
          linkId: `strategy-failure-link-${failureId}-${record.scenarioId}`,
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

export function buildStrategyProvenance(group: StrategyRecordGroup): StrategyProvenance {
  const scenarioIds = uniqueSorted(group.records.map((record) => record.scenarioId));
  return Object.freeze({
    scenarioIds,
    decisionIds: uniqueSorted(group.records.flatMap((record) => record.decisionIds)),
    journalEntryIds: uniqueSorted(group.records.flatMap((record) => record.journalEntryIds)),
    timelineReferences: uniqueSorted(group.records.flatMap((record) => record.timelineReferences)),
    similarityResultIds: uniqueSorted(group.records.flatMap((record) => record.relatedSimilarityResultIds)),
    patternIds: uniqueSorted(group.records.flatMap((record) => record.relatedPatternIds)),
    outcomeIds: uniqueSorted(group.records.flatMap((record) => record.relatedOutcomeIds)),
    failureIds: uniqueSorted(group.records.flatMap((record) => record.relatedFailureIds)),
    confidenceVersion: group.records[0]?.confidenceVersion ?? "APP-9/1",
    extractionVersion: "APP-10/2",
    similarityVersion: "APP-10/3",
    outcomeVersion: "APP-10/4",
    failureVersion: "APP-10/5",
    engineVersion: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildExecutiveStrategyFromGroup(
  group: StrategyRecordGroup,
  learningTimestamp: string
): ExecutiveStrategy {
  const allEvidence = aggregateAllEvidence(group.records);
  const classified = classifyStrategyEvidence(group.records, allEvidence);
  const provenance = buildStrategyProvenance(group);
  const first = group.records[0]!;
  const strategyId = buildStrategyId(group.workspaceId, group.groupKey);
  const businessConditions = mergeBusinessConditions(group.records);
  const outcomeLinks = buildStrategyOutcomeLinks(group.records);
  const failureLinks = buildStrategyFailureLinks(group.records);

  const profile: StrategyProfile = Object.freeze({
    strategyId,
    workspaceId: group.workspaceId,
    strategyName: group.strategyName,
    strategyCategory: group.strategyCategory,
    relatedPatternIds: group.relatedPatternIds,
    relatedScenarioIds: provenance.scenarioIds,
    relatedOutcomeIds: provenance.outcomeIds,
    relatedFailureIds: provenance.failureIds,
    businessConditions,
    successEvidence: classified.successEvidence,
    failureEvidence: classified.failureEvidence,
    riskEvidence: classified.riskEvidence,
    outcomeSummary: first.outcomeSummary,
    failureSummary: first.failureSummary,
    evidenceCount: allEvidence.length,
    provenance,
    engineVersion: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
    learningTimestamp,
    version: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
    metadata: Object.freeze({
      metadataVersion: STRATEGY_LEARNING_ENGINE_CONTRACT_VERSION,
      owner: "strategy-learning-engine",
      extensions: Object.freeze({
        scenarioCount: String(group.records.length),
        categoryLabel: STRATEGY_CATEGORY_LABELS[group.strategyCategory],
        conditionCount: String(businessConditions.length),
      }),
      readOnly: true as const,
    }),
    readOnly: true as const,
  });

  return Object.freeze({
    strategy: profile,
    outcomeLinks,
    failureLinks,
    readOnly: true as const,
  });
}

export const StrategyLearningEvidenceAggregation = Object.freeze({
  groupStrategyRecords,
  aggregateAllEvidence,
  classifyStrategyEvidence,
  buildExecutiveStrategyFromGroup,
  buildStrategyProvenance,
  buildStrategyOutcomeLinks,
  buildStrategyFailureLinks,
});
