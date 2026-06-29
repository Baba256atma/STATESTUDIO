/**
 * APP-4:3 — Executive Memory storage validation pipeline.
 * Validates records before commit — never bypasses APP-4:2 contracts.
 */

import { isExecutiveMemoryRegistered } from "./executiveMemoryRegistry.ts";
import { createExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import {
  validateExecutiveMemoryMetadataContract,
  validateExecutiveMemoryRecordBackwardCompatibility,
  validateExecutiveMemoryRecordShape,
} from "./executiveMemoryRecordValidation.ts";
import type { ExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import type { ExecutiveMemoryProviderId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryValidationResult } from "./executiveMemoryTypes.ts";
import {
  createExecutiveMemoryStorageError,
  executiveMemoryStorageErrorFromCode,
} from "./executiveMemoryStorageErrors.ts";
import type { ExecutiveMemoryStorageError, ExecutiveMemoryUpdateInput } from "./executiveMemoryStorageTypes.ts";
import { createExecutiveMemoryBody, createExecutiveMemoryMetadata } from "./executiveMemoryMetadata.ts";
import { createExecutiveMemoryVersion } from "./executiveMemoryMetadata.ts";

function validationFailure(error: ExecutiveMemoryStorageError): ExecutiveMemoryValidationResult {
  return Object.freeze({
    valid: false,
    issues: Object.freeze([
      Object.freeze({ code: error.code, message: error.message, field: error.field }),
    ]),
    readOnly: true as const,
  });
}

export function validateExecutiveMemoryStorageProvider(
  providerId: ExecutiveMemoryProviderId
): Readonly<{ valid: boolean; error: ExecutiveMemoryStorageError | null }> {
  if (!isExecutiveMemoryRegistered(providerId)) {
    return Object.freeze({
      valid: false,
      error: executiveMemoryStorageErrorFromCode(
        "invalidProvider",
        `Provider is not registered: ${providerId}.`,
        "providerId"
      ),
    });
  }
  return Object.freeze({ valid: true, error: null });
}

export function validateExecutiveMemoryRecordForStorage(
  record: ExecutiveMemoryRecord
): Readonly<{ valid: boolean; error: ExecutiveMemoryStorageError | null; validation: ExecutiveMemoryValidationResult }> {
  const shape = validateExecutiveMemoryRecordShape(record);
  if (!shape.valid) {
    return Object.freeze({
      valid: false,
      error: executiveMemoryStorageErrorFromCode(
        "validationFailure",
        shape.issues.map((entry) => entry.message).join("; ")
      ),
      validation: shape,
    });
  }

  const compatibility = validateExecutiveMemoryRecordBackwardCompatibility(record);
  if (!compatibility.valid) {
    return Object.freeze({
      valid: false,
      error: executiveMemoryStorageErrorFromCode(
        "invalidSchema",
        compatibility.issues.map((entry) => entry.message).join("; ")
      ),
      validation: compatibility,
    });
  }

  const provider = validateExecutiveMemoryStorageProvider(record.providerId);
  if (!provider.valid) {
    return Object.freeze({
      valid: false,
      error: provider.error,
      validation: validationFailure(provider.error!),
    });
  }

  return Object.freeze({ valid: true, error: null, validation: shape });
}

function bumpSemanticVersion(version: string): string {
  const parts = version.split(".").map((entry) => Number.parseInt(entry, 10));
  if (parts.length !== 3 || parts.some((entry) => Number.isNaN(entry))) {
    return "1.0.1";
  }
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function applyExecutiveMemoryUpdate(
  existing: ExecutiveMemoryRecord,
  updates: ExecutiveMemoryUpdateInput,
  updatedAt: string
): ExecutiveMemoryRecord {
  const nextHeader = updates.header
    ? Object.freeze({ ...existing.header, ...updates.header, readOnly: true as const })
    : existing.header;

  const nextBody = updates.body
    ? createExecutiveMemoryBody({
        narrative: updates.body.narrative ?? existing.body.narrative,
        keyPoints: updates.body.keyPoints ?? existing.body.keyPoints,
      })
    : existing.body;

  const nextMetadata = updates.metadata
    ? createExecutiveMemoryMetadata({
        memoryId: existing.metadata.memoryId,
        workspaceId: existing.metadata.workspaceId,
        category: existing.metadata.category,
        owner: existing.metadata.owner,
        sourceModule: existing.metadata.sourceModule,
        tags: updates.tags ?? existing.metadata.tags,
        references: updates.references ?? existing.metadata.references,
        customMetadata: updates.metadata.customMetadata ?? existing.metadata.customMetadata,
        extensionMetadata: updates.metadata.extensionMetadata ?? existing.metadata.extensionMetadata,
      })
    : createExecutiveMemoryMetadata({
        memoryId: existing.metadata.memoryId,
        workspaceId: existing.metadata.workspaceId,
        category: existing.metadata.category,
        owner: existing.metadata.owner,
        sourceModule: existing.metadata.sourceModule,
        tags: updates.tags ?? existing.metadata.tags,
        references: updates.references ?? existing.metadata.references,
        customMetadata: existing.metadata.customMetadata,
        extensionMetadata: existing.metadata.extensionMetadata,
      });

  const nextVersion = createExecutiveMemoryVersion({
    versionId: `${existing.version.versionId}-rev-${updatedAt}`,
    schemaVersion: existing.version.schemaVersion,
    contractVersion: existing.version.contractVersion,
    semanticVersion: bumpSemanticVersion(existing.version.semanticVersion),
    createdAt: updatedAt,
    compatibility: existing.version.compatibility,
  });

  return createExecutiveMemoryRecord({
    id: existing.id,
    providerId: existing.providerId,
    workspaceId: existing.workspaceId,
    category: existing.category,
    header: nextHeader,
    body: nextBody,
    goal: updates.goal !== undefined ? updates.goal : existing.goal,
    intent: updates.intent !== undefined ? updates.intent : existing.intent,
    scenario: updates.scenario !== undefined ? updates.scenario : existing.scenario,
    decision: updates.decision !== undefined ? updates.decision : existing.decision,
    evidence: updates.evidence ?? existing.evidence,
    confidence: updates.confidence !== undefined ? updates.confidence : existing.confidence,
    references: updates.references ?? existing.references,
    tags: updates.tags ?? existing.tags,
    businessContext:
      updates.businessContext !== undefined ? updates.businessContext : existing.businessContext,
    assumptions: updates.assumptions ?? existing.assumptions,
    constraints: updates.constraints ?? existing.constraints,
    outcomes: updates.outcomes ?? existing.outcomes,
    lessonsLearned: updates.lessonsLearned ?? existing.lessonsLearned,
    relationships: updates.relationships ?? existing.relationships,
    createdAt: existing.createdAt,
    updatedAt,
    version: nextVersion,
    metadata: nextMetadata,
    schemaVersion: existing.schemaVersion,
    contractVersion: existing.contractVersion,
  });
}

export function validateExecutiveMemoryUpdateIdentifiers(
  existing: ExecutiveMemoryRecord,
  candidate: ExecutiveMemoryRecord
): Readonly<{ valid: boolean; error: ExecutiveMemoryStorageError | null }> {
  if (existing.id !== candidate.id) {
    return Object.freeze({
      valid: false,
      error: executiveMemoryStorageErrorFromCode("idImmutable", "Record id cannot change during update.", "id"),
    });
  }
  if (existing.providerId !== candidate.providerId) {
    return Object.freeze({
      valid: false,
      error: executiveMemoryStorageErrorFromCode(
        "providerImmutable",
        "Provider id cannot change during update.",
        "providerId"
      ),
    });
  }
  if (existing.schemaVersion !== candidate.schemaVersion) {
    return Object.freeze({
      valid: false,
      error: createExecutiveMemoryStorageError(
        "schema_version_immutable",
        "Schema version cannot change during update.",
        "schemaVersion"
      ),
    });
  }
  const metadataValidation = validateExecutiveMemoryMetadataContract(candidate.metadata);
  if (!metadataValidation.valid) {
    return Object.freeze({
      valid: false,
      error: executiveMemoryStorageErrorFromCode(
        "validationFailure",
        metadataValidation.issues.map((entry) => entry.message).join("; ")
      ),
    });
  }
  return Object.freeze({ valid: true, error: null });
}
