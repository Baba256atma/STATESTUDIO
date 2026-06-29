/**
 * APP-9:2 — Confidence record controlled mutations.
 */

import { normalizeConfidenceRecord } from "./confidenceEvolutionNormalization.ts";
import {
  getConfidenceRecordById,
  replaceConfidenceRecordRevision,
} from "./confidenceEvolutionEngineRegistry.ts";
import {
  validateConfidenceEvolutionEngineRecord,
  validateUpdateConfidenceMetadataInput,
  validationFailureResult,
} from "./confidenceEvolutionEngineValidation.ts";
import {
  type ConfidenceEvolutionEngineRecord,
  type ConfidenceRecordResult,
  type UpdateConfidenceMetadataInput,
  confidenceEvolutionEngineErrorFromCode,
} from "./confidenceEvolutionEngineTypes.ts";

function mergeMetadata(
  existing: ConfidenceEvolutionEngineRecord["metadata"],
  updates: Readonly<Record<string, string>> | undefined
): ConfidenceEvolutionEngineRecord["metadata"] {
  if (!updates) {
    return existing;
  }
  const normalized = normalizeConfidenceRecord({
    workspaceId: "metadata-merge",
    title: "metadata",
    confidenceLevel: "medium",
    confidenceScore: 0.5,
    source: "manual",
    reason: "unknown",
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
  existing: ConfidenceEvolutionEngineRecord,
  input: UpdateConfidenceMetadataInput
): ConfidenceEvolutionEngineRecord {
  const status = input.status ?? existing.status;
  const updatedAt = input.updatedAt ?? existing.updatedAt;
  return Object.freeze({
    id: existing.id,
    workspaceId: existing.workspaceId,
    decisionId: existing.decisionId,
    scenarioId: existing.scenarioId,
    journalEntryId: existing.journalEntryId,
    title: input.title ?? existing.title,
    confidenceLevel: input.confidenceLevel ?? existing.confidenceLevel,
    confidenceScore: input.confidenceScore ?? existing.confidenceScore,
    source: existing.source,
    reason: input.reason ?? existing.reason,
    notes: input.notes ?? existing.notes,
    evidenceReferences: mergeStringList(existing.evidenceReferences, input.evidenceReferences),
    previousConfidence: input.previousConfidence ?? existing.previousConfidence,
    tags: input.tags ? Object.freeze([...input.tags]) : existing.tags,
    metadata: mergeMetadata(existing.metadata, input.metadata),
    status,
    createdAt: existing.createdAt,
    updatedAt,
    contractVersion: existing.contractVersion,
    revisionVersion: existing.revisionVersion + 1,
    archived: status === "archived",
    readOnly: true as const,
  });
}

export function updateConfidenceMetadata(
  input: UpdateConfidenceMetadataInput
): ConfidenceRecordResult<ConfidenceEvolutionEngineRecord> {
  const existing = getConfidenceRecordById(input.id);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Confidence record not found: ${input.id}.`,
      data: null,
      error: confidenceEvolutionEngineErrorFromCode("recordNotFound", "Confidence record not found.", "id"),
      readOnly: true as const,
    });
  }

  const updateValidation = validateUpdateConfidenceMetadataInput(existing, input);
  if (!updateValidation.valid) {
    return validationFailureResult(updateValidation, "Metadata update");
  }

  const next = buildNextRevision(existing, input);
  const recordValidation = validateConfidenceEvolutionEngineRecord(next);
  if (!recordValidation.valid) {
    return validationFailureResult(recordValidation, "Metadata update");
  }

  return replaceConfidenceRecordRevision(existing, next);
}

export function archiveConfidenceRecord(
  recordId: UpdateConfidenceMetadataInput["id"],
  workspaceId: UpdateConfidenceMetadataInput["workspaceId"]
): ConfidenceRecordResult<ConfidenceEvolutionEngineRecord> {
  return updateConfidenceMetadata(
    Object.freeze({
      id: recordId,
      workspaceId,
      status: "archived",
    })
  );
}

export const ConfidenceEvolutionMutations = Object.freeze({
  updateConfidenceMetadata,
  archiveConfidenceRecord,
});
