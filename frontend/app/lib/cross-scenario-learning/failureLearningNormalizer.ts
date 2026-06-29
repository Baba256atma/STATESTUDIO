/**
 * APP-10:5 — Failure Learning Engine record normalizer.
 */

import type {
  HistoricalFailureRecordInput,
  NormalizedFailureRecord,
} from "./failureLearningEngineTypes.ts";

function normalizeValue(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.map((value) => value.trim()).filter(Boolean))].sort());
}

export function buildFailureSignature(
  businessGoal: string,
  failureCategory: string,
  relatedPatternIds: readonly string[],
  failureFactorKeys: readonly string[]
): string {
  const patternKey = [...relatedPatternIds].sort().join("|") || "no-patterns";
  const factorKey = [...failureFactorKeys].sort().join("|") || "no-factors";
  return `${normalizeValue(businessGoal).toLowerCase()}|${failureCategory}|${patternKey}|${factorKey}`;
}

export function buildFailureId(workspaceId: string, failureSignature: string): string {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  let hash = 0;
  for (let index = 0; index < failureSignature.length; index += 1) {
    hash = (Math.imul(31, hash) + failureSignature.charCodeAt(index)) >>> 0;
  }
  return `executive-failure-${safeWorkspace}-${hash.toString(16).padStart(8, "0")}`;
}

export function normalizeFailureRecord(
  input: HistoricalFailureRecordInput,
  defaultTimestamp: string
): NormalizedFailureRecord {
  const relatedPatternIds = uniqueSorted(input.relatedPatternIds);
  const failureFactorKeys = uniqueSorted(input.failureFactorKeys) as NormalizedFailureRecord["failureFactorKeys"];
  const failureSignature = buildFailureSignature(
    input.businessGoal,
    input.failureCategory,
    relatedPatternIds,
    failureFactorKeys
  );
  return Object.freeze({
    scenarioId: input.scenarioId.trim(),
    workspaceId: input.workspaceId.trim(),
    businessGoal: normalizeValue(input.businessGoal),
    failureSignature,
    failureCategory: input.failureCategory,
    failureFactorKeys,
    failureCauses: Object.freeze(
      input.failureCauses.map((cause) =>
        Object.freeze({
          label: normalizeValue(cause.label),
          description: normalizeValue(cause.description),
        })
      )
    ),
    kpiImpactSummary: normalizeValue(input.kpiImpactSummary),
    riskImpactSummary: normalizeValue(input.riskImpactSummary),
    relatedPatternIds,
    relatedSimilarityResultIds: uniqueSorted(input.relatedSimilarityResultIds),
    relatedOutcomeIds: uniqueSorted(input.relatedOutcomeIds),
    decisionIds: uniqueSorted(input.decisionIds),
    journalEntryIds: uniqueSorted(input.journalEntryIds),
    timelineReferences: uniqueSorted(input.timelineReferences),
    confidenceVersion: input.confidenceVersion?.trim() || "APP-9/1",
    sourceApps: uniqueSorted(input.sourceApps),
    recordedAt: input.recordedAt ?? defaultTimestamp,
    readOnly: true as const,
  });
}

export function normalizeFailureRecords(
  records: readonly HistoricalFailureRecordInput[],
  defaultTimestamp: string
): readonly NormalizedFailureRecord[] {
  return Object.freeze(records.map((record) => normalizeFailureRecord(record, defaultTimestamp)));
}

export const FailureLearningNormalizer = Object.freeze({
  normalizeFailureRecord,
  normalizeFailureRecords,
  buildFailureSignature,
  buildFailureId,
});
