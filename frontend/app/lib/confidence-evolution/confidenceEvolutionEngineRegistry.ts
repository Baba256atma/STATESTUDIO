/**
 * APP-9:2 — Confidence Evolution append-only registry.
 */

import type { ConfidenceRecordId, ConfidenceWorkspaceId } from "./confidenceEvolutionTypes.ts";
import {
  CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_ENGINE_LIMITS,
  type ConfidenceEvolutionEngineRecord,
  type ConfidenceEvolutionEngineRegistrySnapshot,
  type ConfidenceRecordResult,
  confidenceEvolutionEngineErrorFromCode,
} from "./confidenceEvolutionEngineTypes.ts";

const publishedRecords = new Map<ConfidenceRecordId, ConfidenceEvolutionEngineRecord>();
const revisionHistory = new Map<ConfidenceRecordId, ConfidenceEvolutionEngineRecord[]>();
const workspaceIndex = new Map<ConfidenceWorkspaceId, Set<ConfidenceRecordId>>();
const workspaceSequenceCounters = new Map<ConfidenceWorkspaceId, number>();

export function resetConfidenceEvolutionEngineRegistryForTests(): void {
  publishedRecords.clear();
  revisionHistory.clear();
  workspaceIndex.clear();
  workspaceSequenceCounters.clear();
}

export function isDuplicateConfidenceRecordId(recordId: ConfidenceRecordId): boolean {
  return publishedRecords.has(recordId);
}

export function allocateConfidenceRecordSequenceNumber(workspaceId: ConfidenceWorkspaceId): number {
  const current = workspaceSequenceCounters.get(workspaceId) ?? 0;
  const next = current + 1;
  workspaceSequenceCounters.set(workspaceId, next);
  return next;
}

export function generateConfidenceRecordId(
  workspaceId: ConfidenceWorkspaceId,
  sequence: number
): ConfidenceRecordId {
  const safeWorkspace = workspaceId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return `confidence-evolution-record-${safeWorkspace}-${String(sequence).padStart(6, "0")}`;
}

function indexRecord(record: ConfidenceEvolutionEngineRecord): void {
  const ids = workspaceIndex.get(record.workspaceId) ?? new Set<ConfidenceRecordId>();
  ids.add(record.id);
  workspaceIndex.set(record.workspaceId, ids);
}

export function registerConfidenceRecord(
  record: ConfidenceEvolutionEngineRecord
): ConfidenceRecordResult<ConfidenceEvolutionEngineRecord> {
  if (publishedRecords.has(record.id)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate confidence record id: ${record.id}.`,
      data: null,
      error: confidenceEvolutionEngineErrorFromCode("duplicateRecord", "Duplicate confidence record id.", "id"),
      readOnly: true as const,
    });
  }
  if (publishedRecords.size >= CONFIDENCE_EVOLUTION_ENGINE_LIMITS.maxPublishedRecords) {
    return Object.freeze({
      success: false,
      reason: "Confidence record registry is full.",
      data: null,
      error: confidenceEvolutionEngineErrorFromCode("registryFull", "Registry full."),
      readOnly: true as const,
    });
  }

  publishedRecords.set(record.id, record);
  revisionHistory.set(record.id, Object.freeze([record]));
  indexRecord(record);

  return Object.freeze({
    success: true,
    reason: "Confidence record registered.",
    data: record,
    error: null,
    readOnly: true as const,
  });
}

export function replaceConfidenceRecordRevision(
  previous: ConfidenceEvolutionEngineRecord,
  next: ConfidenceEvolutionEngineRecord
): ConfidenceRecordResult<ConfidenceEvolutionEngineRecord> {
  if (previous.id !== next.id) {
    return Object.freeze({
      success: false,
      reason: "Confidence record identity must remain stable across revisions.",
      data: null,
      error: confidenceEvolutionEngineErrorFromCode("forbiddenMutation", "Record id cannot change.", "id"),
      readOnly: true as const,
    });
  }
  if (next.revisionVersion !== previous.revisionVersion + 1) {
    return Object.freeze({
      success: false,
      reason: "Revision version must increment by exactly one.",
      data: null,
      error: confidenceEvolutionEngineErrorFromCode(
        "validationFailure",
        "Invalid revision increment.",
        "revisionVersion"
      ),
      readOnly: true as const,
    });
  }

  const history = revisionHistory.get(previous.id) ?? Object.freeze([previous]);
  revisionHistory.set(previous.id, Object.freeze([...history, next]));
  publishedRecords.set(next.id, next);

  return Object.freeze({
    success: true,
    reason: "Confidence record revision registered.",
    data: next,
    error: null,
    readOnly: true as const,
  });
}

export function getConfidenceRecordById(recordId: ConfidenceRecordId): ConfidenceEvolutionEngineRecord | null {
  return publishedRecords.get(recordId) ?? null;
}

export function getConfidenceRecordsByWorkspace(
  workspaceId: ConfidenceWorkspaceId
): readonly ConfidenceEvolutionEngineRecord[] {
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => publishedRecords.get(id))
      .filter((record): record is ConfidenceEvolutionEngineRecord => record !== undefined)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  );
}

export function getConfidenceRevisionHistory(
  recordId: ConfidenceRecordId
): readonly ConfidenceEvolutionEngineRecord[] {
  return Object.freeze(revisionHistory.get(recordId) ?? []);
}

export function getConfidenceEvolutionEngineRegistrySnapshot(): ConfidenceEvolutionEngineRegistrySnapshot {
  return Object.freeze({
    registryVersion: CONFIDENCE_EVOLUTION_ENGINE_CONTRACT_VERSION,
    publishedRecordCount: publishedRecords.size,
    recordIds: Object.freeze([...publishedRecords.keys()]),
    readOnly: true as const,
  });
}

export const ConfidenceEvolutionEngineRegistry = Object.freeze({
  resetConfidenceEvolutionEngineRegistryForTests,
  isDuplicateConfidenceRecordId,
  allocateConfidenceRecordSequenceNumber,
  generateConfidenceRecordId,
  registerConfidenceRecord,
  replaceConfidenceRecordRevision,
  getConfidenceRecordById,
  getConfidenceRecordsByWorkspace,
  getConfidenceRevisionHistory,
  getConfidenceEvolutionEngineRegistrySnapshot,
});
