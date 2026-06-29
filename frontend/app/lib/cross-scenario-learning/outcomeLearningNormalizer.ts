/**
 * APP-10:4 — Outcome Learning Engine record normalizer.
 */

import type {
  HistoricalOutcomeRecordInput,
  NormalizedOutcomeRecord,
} from "./outcomeLearningEngineTypes.ts";

function normalizeValue(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function uniqueSorted(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.map((value) => value.trim()).filter(Boolean))].sort());
}

export function buildOutcomeSignature(
  businessGoal: string,
  finalOutcomeCategory: string,
  relatedPatternIds: readonly string[]
): string {
  const patternKey = [...relatedPatternIds].sort().join("|") || "no-patterns";
  return `${normalizeValue(businessGoal).toLowerCase()}|${finalOutcomeCategory}|${patternKey}`;
}

export function buildOutcomeId(workspaceId: string, outcomeSignature: string): string {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  let hash = 0;
  for (let index = 0; index < outcomeSignature.length; index += 1) {
    hash = (Math.imul(31, hash) + outcomeSignature.charCodeAt(index)) >>> 0;
  }
  return `executive-outcome-${safeWorkspace}-${hash.toString(16).padStart(8, "0")}`;
}

export function normalizeOutcomeRecord(
  input: HistoricalOutcomeRecordInput,
  defaultTimestamp: string
): NormalizedOutcomeRecord {
  const relatedPatternIds = uniqueSorted(input.relatedPatternIds);
  const outcomeSignature = buildOutcomeSignature(input.businessGoal, input.finalOutcomeCategory, relatedPatternIds);
  return Object.freeze({
    scenarioId: input.scenarioId.trim(),
    workspaceId: input.workspaceId.trim(),
    businessGoal: normalizeValue(input.businessGoal),
    outcomeSignature,
    finalOutcomeCategory: input.finalOutcomeCategory,
    kpiChangeSummary: normalizeValue(input.kpiChangeSummary),
    riskChangeSummary: normalizeValue(input.riskChangeSummary),
    decisionSummary: normalizeValue(input.decisionSummary),
    relatedPatternIds,
    relatedSimilarityResultIds: uniqueSorted(input.relatedSimilarityResultIds),
    decisionIds: uniqueSorted(input.decisionIds),
    journalEntryIds: uniqueSorted(input.journalEntryIds),
    timelineReferences: uniqueSorted(input.timelineReferences),
    confidenceVersion: input.confidenceVersion?.trim() || "APP-9/1",
    sourceApps: uniqueSorted(input.sourceApps),
    recordedAt: input.recordedAt ?? defaultTimestamp,
    readOnly: true as const,
  });
}

export function normalizeOutcomeRecords(
  records: readonly HistoricalOutcomeRecordInput[],
  defaultTimestamp: string
): readonly NormalizedOutcomeRecord[] {
  return Object.freeze(records.map((record) => normalizeOutcomeRecord(record, defaultTimestamp)));
}

export const OutcomeLearningNormalizer = Object.freeze({
  normalizeOutcomeRecord,
  normalizeOutcomeRecords,
  buildOutcomeSignature,
  buildOutcomeId,
});
