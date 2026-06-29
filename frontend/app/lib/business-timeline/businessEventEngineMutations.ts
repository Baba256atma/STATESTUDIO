/**
 * APP-7:2 — Business Event controlled mutations.
 */

import { BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./businessTimelineConstants.ts";
import { normalizeBusinessEvent } from "./businessEventEngineNormalization.ts";
import {
  getBusinessEventById,
  replaceBusinessEventRevision,
} from "./businessEventEngineRegistry.ts";
import {
  validateBusinessEngineEvent,
  validateUpdateBusinessEventMetadataInput,
  validationFailureResult,
} from "./businessEventEngineValidation.ts";
import {
  type BusinessEngineEvent,
  type BusinessEventResult,
  type UpdateBusinessEventMetadataInput,
  businessEventEngineErrorFromCode,
} from "./businessEventEngineTypes.ts";

function mergeMetadata(
  existing: BusinessEngineEvent["metadata"],
  updates: Readonly<Record<string, string>> | undefined
): BusinessEngineEvent["metadata"] {
  if (!updates) {
    return existing;
  }
  const normalized = normalizeBusinessEvent({
    workspaceId: "metadata-merge",
    title: "metadata",
    description: "metadata",
    category: "corporate",
    type: "milestone",
    importance: "medium",
    status: "completed",
    source: "manual",
    createdAt: existing.metadataVersion,
    occurredAt: existing.metadataVersion,
    createdBy: "engine",
    metadata: updates,
  }).metadata;
  return Object.freeze({
    metadataVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    owner: existing.owner,
    extensions: Object.freeze({ ...existing.extensions, ...normalized.extensions }),
    readOnly: true as const,
  });
}

function buildNextRevision(
  existing: BusinessEngineEvent,
  input: UpdateBusinessEventMetadataInput
): BusinessEngineEvent {
  const status = input.status ?? existing.status;
  return Object.freeze({
    id: existing.id,
    workspaceId: existing.workspaceId,
    title: input.title ?? existing.title,
    description: input.description ?? existing.description,
    category: existing.category,
    type: existing.type,
    importance: input.importance ?? existing.importance,
    status,
    source: existing.source,
    createdAt: existing.createdAt,
    occurredAt: existing.occurredAt,
    createdBy: existing.createdBy,
    tags: input.tags ? Object.freeze([...input.tags]) : existing.tags,
    metadata: mergeMetadata(existing.metadata, input.metadata),
    contractVersion: existing.contractVersion,
    revisionVersion: existing.revisionVersion + 1,
    archived: status === "archived",
    readOnly: true as const,
  });
}

export function updateBusinessEventMetadata(
  input: UpdateBusinessEventMetadataInput
): BusinessEventResult<BusinessEngineEvent> {
  const existing = getBusinessEventById(input.id);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Event not found: ${input.id}.`,
      data: null,
      error: businessEventEngineErrorFromCode("eventNotFound", "Event not found.", "id"),
      readOnly: true as const,
    });
  }

  const updateValidation = validateUpdateBusinessEventMetadataInput(existing, input);
  if (!updateValidation.valid) {
    return validationFailureResult(updateValidation, "Metadata update");
  }

  const next = buildNextRevision(existing, input);
  const eventValidation = validateBusinessEngineEvent(next);
  if (!eventValidation.valid) {
    return validationFailureResult(eventValidation, "Metadata update");
  }

  return replaceBusinessEventRevision(existing, next);
}

export function archiveBusinessEvent(
  eventId: UpdateBusinessEventMetadataInput["id"],
  workspaceId: UpdateBusinessEventMetadataInput["workspaceId"]
): BusinessEventResult<BusinessEngineEvent> {
  return updateBusinessEventMetadata(
    Object.freeze({
      id: eventId,
      workspaceId,
      status: "archived",
    })
  );
}

export const BusinessEventEngineMutations = Object.freeze({
  updateBusinessEventMetadata,
  archiveBusinessEvent,
});
