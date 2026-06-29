/**
 * APP-8:2 — Decision Journal controlled mutations.
 */

import { normalizeDecisionJournalEntry } from "./decisionJournalEngineNormalization.ts";
import {
  getDecisionJournalEntryById,
  replaceDecisionJournalEntryRevision,
} from "./decisionJournalEngineRegistry.ts";
import {
  validateDecisionJournalEngineEntry,
  validateUpdateDecisionJournalMetadataInput,
  validationFailureResult,
} from "./decisionJournalEngineValidation.ts";
import {
  type DecisionJournalEngineEntry,
  type DecisionJournalEntryResult,
  type UpdateDecisionJournalMetadataInput,
  decisionJournalEngineErrorFromCode,
} from "./decisionJournalEngineTypes.ts";

function mergeMetadata(
  existing: DecisionJournalEngineEntry["metadata"],
  updates: Readonly<Record<string, string>> | undefined
): DecisionJournalEngineEntry["metadata"] {
  if (!updates) {
    return existing;
  }
  const normalized = normalizeDecisionJournalEntry({
    workspaceId: "metadata-merge",
    title: "metadata",
    summary: "metadata",
    rationale: "metadata",
    expectedOutcome: "metadata",
    confidence: "medium",
    author: "engine",
    source: "manual",
    createdAt: existing.metadataVersion,
    metadata: updates,
  }).metadata;
  return Object.freeze({
    metadataVersion: existing.metadataVersion,
    owner: existing.owner,
    extensions: Object.freeze({ ...existing.extensions, ...normalized.extensions }),
    readOnly: true as const,
  });
}

function mergeStringList(
  existing: readonly string[],
  updates: readonly string[] | undefined
): readonly string[] {
  return updates ? Object.freeze([...updates]) : existing;
}

function buildNextRevision(
  existing: DecisionJournalEngineEntry,
  input: UpdateDecisionJournalMetadataInput
): DecisionJournalEngineEntry {
  const status = input.status ?? existing.status;
  const updatedAt = input.updatedAt ?? existing.updatedAt;
  return Object.freeze({
    id: existing.id,
    workspaceId: existing.workspaceId,
    decisionId: existing.decisionId,
    scenarioId: existing.scenarioId,
    title: input.title ?? existing.title,
    summary: input.summary ?? existing.summary,
    rationale: input.rationale ?? existing.rationale,
    assumptions: mergeStringList(existing.assumptions, input.assumptions),
    alternatives: mergeStringList(existing.alternatives, input.alternatives),
    evidenceReferences: mergeStringList(existing.evidenceReferences, input.evidenceReferences),
    acceptedRisks: mergeStringList(existing.acceptedRisks, input.acceptedRisks),
    expectedOutcome: input.expectedOutcome ?? existing.expectedOutcome,
    confidence: input.confidence ?? existing.confidence,
    tradeoffs: mergeStringList(existing.tradeoffs, input.tradeoffs),
    constraints: mergeStringList(existing.constraints, input.constraints),
    author: existing.author,
    reviewers: mergeStringList(existing.reviewers, input.reviewers),
    tags: input.tags ? Object.freeze([...input.tags]) : existing.tags,
    metadata: mergeMetadata(existing.metadata, input.metadata),
    status,
    source: existing.source,
    createdAt: existing.createdAt,
    updatedAt,
    contractVersion: existing.contractVersion,
    revisionVersion: existing.revisionVersion + 1,
    archived: status === "archived",
    readOnly: true as const,
  });
}

export function updateDecisionJournalMetadata(
  input: UpdateDecisionJournalMetadataInput
): DecisionJournalEntryResult<DecisionJournalEngineEntry> {
  const existing = getDecisionJournalEntryById(input.id);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Journal entry not found: ${input.id}.`,
      data: null,
      error: decisionJournalEngineErrorFromCode("entryNotFound", "Journal entry not found.", "id"),
      readOnly: true as const,
    });
  }

  const updateValidation = validateUpdateDecisionJournalMetadataInput(existing, input);
  if (!updateValidation.valid) {
    return validationFailureResult(updateValidation, "Metadata update");
  }

  const next = buildNextRevision(existing, input);
  const entryValidation = validateDecisionJournalEngineEntry(next);
  if (!entryValidation.valid) {
    return validationFailureResult(entryValidation, "Metadata update");
  }

  return replaceDecisionJournalEntryRevision(existing, next);
}

export function archiveDecisionJournalEntry(
  entryId: UpdateDecisionJournalMetadataInput["id"],
  workspaceId: UpdateDecisionJournalMetadataInput["workspaceId"]
): DecisionJournalEntryResult<DecisionJournalEngineEntry> {
  return updateDecisionJournalMetadata(
    Object.freeze({
      id: entryId,
      workspaceId,
      status: "archived",
    })
  );
}

export const DecisionJournalEngineMutations = Object.freeze({
  updateDecisionJournalMetadata,
  archiveDecisionJournalEntry,
});
