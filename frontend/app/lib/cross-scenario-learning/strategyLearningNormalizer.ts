/**
 * APP-10:6 — Strategy Learning Engine record normalizer.
 */

import type {
  HistoricalStrategyRecordInput,
  NormalizedStrategyRecord,
} from "./strategyLearningEngineTypes.ts";

function normalizeValue(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.map((value) => value.trim()).filter(Boolean))].sort());
}

export function buildStrategySignature(
  strategyName: string,
  strategyCategory: string,
  relatedPatternIds: readonly string[]
): string {
  const patternKey = [...relatedPatternIds].sort().join("|") || "no-patterns";
  return `${normalizeValue(strategyName).toLowerCase()}|${strategyCategory}|${patternKey}`;
}

export function buildStrategyId(workspaceId: string, strategySignature: string): string {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  let hash = 0;
  for (let index = 0; index < strategySignature.length; index += 1) {
    hash = (Math.imul(31, hash) + strategySignature.charCodeAt(index)) >>> 0;
  }
  return `executive-strategy-${safeWorkspace}-${hash.toString(16).padStart(8, "0")}`;
}

export function normalizeStrategyRecord(
  input: HistoricalStrategyRecordInput,
  defaultTimestamp: string
): NormalizedStrategyRecord {
  const relatedPatternIds = uniqueSorted(input.relatedPatternIds);
  const strategySignature = buildStrategySignature(input.strategyName, input.strategyCategory, relatedPatternIds);
  return Object.freeze({
    scenarioId: input.scenarioId.trim(),
    workspaceId: input.workspaceId.trim(),
    strategySignature,
    strategyName: normalizeValue(input.strategyName),
    strategyCategory: input.strategyCategory,
    businessGoal: normalizeValue(input.businessGoal),
    workspaceDomain: normalizeValue(input.workspaceDomain),
    timelinePhase: normalizeValue(input.timelinePhase),
    kpiDirection: normalizeValue(input.kpiDirection),
    riskProfile: normalizeValue(input.riskProfile),
    resourceConstraints: normalizeValue(input.resourceConstraints ?? "none"),
    dependencyConstraints: normalizeValue(input.dependencyConstraints ?? "none"),
    executionConditions: normalizeValue(input.executionConditions ?? "standard"),
    outcomeSummary: normalizeValue(input.outcomeSummary),
    failureSummary: normalizeValue(input.failureSummary),
    relatedPatternIds,
    relatedSimilarityResultIds: uniqueSorted(input.relatedSimilarityResultIds),
    relatedOutcomeIds: uniqueSorted(input.relatedOutcomeIds),
    relatedFailureIds: uniqueSorted(input.relatedFailureIds),
    decisionIds: uniqueSorted(input.decisionIds),
    journalEntryIds: uniqueSorted(input.journalEntryIds),
    timelineReferences: uniqueSorted(input.timelineReferences),
    confidenceVersion: input.confidenceVersion?.trim() || "APP-9/1",
    sourceApps: uniqueSorted(input.sourceApps),
    recordedAt: input.recordedAt ?? defaultTimestamp,
    readOnly: true as const,
  });
}

export function normalizeStrategyRecords(
  records: readonly HistoricalStrategyRecordInput[],
  defaultTimestamp: string
): readonly NormalizedStrategyRecord[] {
  return Object.freeze(records.map((record) => normalizeStrategyRecord(record, defaultTimestamp)));
}

export const StrategyLearningNormalizer = Object.freeze({
  normalizeStrategyRecord,
  normalizeStrategyRecords,
  buildStrategySignature,
  buildStrategyId,
});
