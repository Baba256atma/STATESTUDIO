/**
 * APP-8:2 — Decision Journal entry normalization.
 */

import { DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION } from "./decisionJournalConstants.ts";
import {
  DECISION_JOURNAL_ENGINE_LIMITS,
  type CreateDecisionJournalEntryInput,
  type NormalizedDecisionJournalEntryInput,
} from "./decisionJournalEngineTypes.ts";

function trim(value: string): string {
  return value.trim();
}

function normalizeStringList(
  values: readonly string[] | undefined,
  maxCount: number
): readonly string[] {
  if (!values?.length) {
    return Object.freeze([]);
  }
  const normalized = values
    .map((value) => trim(value).slice(0, 512))
    .filter((value) => value.length > 0)
    .slice(0, maxCount);
  return Object.freeze([...new Set(normalized)]);
}

function normalizeTags(tags: readonly string[] | undefined): readonly string[] {
  if (!tags?.length) {
    return Object.freeze([]);
  }
  const normalized = tags
    .map((tag) => trim(tag).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxTagLength))
    .filter((tag) => tag.length > 0)
    .slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxTagsPerEntry);
  return Object.freeze([...new Set(normalized)]);
}

function normalizeReviewers(reviewers: readonly string[] | undefined): readonly string[] {
  if (!reviewers?.length) {
    return Object.freeze([]);
  }
  const normalized = reviewers
    .map((reviewer) => trim(reviewer).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxAuthorLength))
    .filter((reviewer) => reviewer.length > 0)
    .slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxReviewersPerEntry);
  return Object.freeze([...new Set(normalized)]);
}

function normalizeMetadata(
  extensions: Readonly<Record<string, string>> | undefined
): NormalizedDecisionJournalEntryInput["metadata"] {
  const normalized: Record<string, string> = {};
  if (!extensions) {
    return Object.freeze({
      metadataVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
      extensions: Object.freeze({}),
      readOnly: true as const,
    });
  }
  let count = 0;
  for (const [rawKey, rawValue] of Object.entries(extensions)) {
    if (count >= DECISION_JOURNAL_ENGINE_LIMITS.maxMetadataKeys) {
      break;
    }
    const key = trim(rawKey);
    const value = trim(String(rawValue)).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxMetadataValueLength);
    if (key.length === 0 || value.length === 0) {
      continue;
    }
    normalized[key] = value;
    count += 1;
  }
  return Object.freeze({
    metadataVersion: DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
    extensions: Object.freeze(normalized),
    readOnly: true as const,
  });
}

export function normalizeDecisionJournalEntry(
  input: CreateDecisionJournalEntryInput
): NormalizedDecisionJournalEntryInput {
  const createdAt = trim(input.createdAt);
  const updatedAt = trim(input.updatedAt ?? input.createdAt);
  return Object.freeze({
    id: input.id ? trim(input.id) : undefined,
    workspaceId: trim(input.workspaceId),
    decisionId: input.decisionId ? trim(input.decisionId) : undefined,
    scenarioId: input.scenarioId ? trim(input.scenarioId) : undefined,
    title: trim(input.title).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxTitleLength),
    summary: trim(input.summary).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxSummaryLength),
    rationale: trim(input.rationale).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxRationaleLength),
    assumptions: normalizeStringList(input.assumptions, DECISION_JOURNAL_ENGINE_LIMITS.maxListItemsPerField),
    alternatives: normalizeStringList(input.alternatives, DECISION_JOURNAL_ENGINE_LIMITS.maxListItemsPerField),
    evidenceReferences: normalizeStringList(
      input.evidenceReferences,
      DECISION_JOURNAL_ENGINE_LIMITS.maxListItemsPerField
    ),
    acceptedRisks: normalizeStringList(input.acceptedRisks, DECISION_JOURNAL_ENGINE_LIMITS.maxListItemsPerField),
    expectedOutcome: trim(input.expectedOutcome).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxExpectedOutcomeLength),
    confidence: input.confidence,
    tradeoffs: normalizeStringList(input.tradeoffs, DECISION_JOURNAL_ENGINE_LIMITS.maxListItemsPerField),
    constraints: normalizeStringList(input.constraints, DECISION_JOURNAL_ENGINE_LIMITS.maxListItemsPerField),
    author: trim(input.author).slice(0, DECISION_JOURNAL_ENGINE_LIMITS.maxAuthorLength),
    reviewers: normalizeReviewers(input.reviewers),
    tags: normalizeTags(input.tags),
    metadata: normalizeMetadata(input.metadata),
    status: input.status ?? "draft",
    source: input.source,
    createdAt,
    updatedAt,
  });
}

export const DecisionJournalEngineNormalization = Object.freeze({
  normalizeDecisionJournalEntry,
});
