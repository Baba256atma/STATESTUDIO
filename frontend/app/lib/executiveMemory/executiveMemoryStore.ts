/**
 * APP-4:3 — Executive Memory store.
 * Atomic commit layer over storage provider adapters.
 */

import type { ExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import { executiveMemoryStorageErrorFromCode } from "./executiveMemoryStorageErrors.ts";
import type { ExecutiveMemoryStorageProviderAdapter } from "./executiveMemoryStorageProvider.ts";
import { validateExecutiveMemoryRecordForStorage } from "./executiveMemoryStorageValidation.ts";
import type {
  ExecutiveMemoryLifecycleState,
  ExecutiveMemoryListQuery,
  ExecutiveMemoryStorageResult,
  ExecutiveMemoryStoredRecord,
} from "./executiveMemoryStorageTypes.ts";

function createResult<T>(
  success: boolean,
  reason: string,
  data: T | null,
  error: ExecutiveMemoryStorageResult<T>["error"] = null
): ExecutiveMemoryStorageResult<T> {
  return Object.freeze({ success, reason, data, error, readOnly: true as const });
}

function freezeStoredRecord(
  record: ExecutiveMemoryRecord,
  lifecycle: ExecutiveMemoryLifecycleState,
  storageRevision: number,
  storedAt: string,
  archivedAt: string | null
): ExecutiveMemoryStoredRecord {
  return Object.freeze({
    record,
    lifecycle,
    storageRevision,
    storedAt,
    archivedAt,
    readOnly: true as const,
  });
}

export type ExecutiveMemoryStoreTransaction = Readonly<{
  commitStoredRecord: (
    record: ExecutiveMemoryRecord,
    options?: Readonly<{
      lifecycle?: ExecutiveMemoryLifecycleState;
      storageRevision?: number;
      storedAt?: string;
      archivedAt?: string | null;
      allowDuplicate?: boolean;
    }>
  ) => ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord>;
  commitLifecycleChange: (
    recordId: ExecutiveMemoryId,
    lifecycle: ExecutiveMemoryLifecycleState,
    timestamp: string
  ) => ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord>;
  rollback: () => void;
  finalize: () => ExecutiveMemoryStorageResult<null>;
}>;

export function createExecutiveMemoryStore(provider: ExecutiveMemoryStorageProviderAdapter) {
  function beginTransaction(): ExecutiveMemoryStoreTransaction {
    const snapshot = provider.snapshot();
    let committed = false;

    return Object.freeze({
      commitStoredRecord: (record, options = {}) => {
        const validation = validateExecutiveMemoryRecordForStorage(record);
        if (!validation.valid) {
          provider.restoreSnapshot(snapshot);
          return createResult(
            false,
            validation.error?.message ?? "Validation failed.",
            null,
            validation.error
          );
        }

        const recordId = record.id;
        const exists = provider.has(recordId);
        if (exists && !options.allowDuplicate) {
          provider.restoreSnapshot(snapshot);
          return createResult(
            false,
            `Duplicate record id: ${recordId}.`,
            null,
            executiveMemoryStorageErrorFromCode("duplicateId", `Duplicate record id: ${recordId}.`, "id")
          );
        }

        const existing = provider.get(recordId);
        const stored = freezeStoredRecord(
          record,
          options.lifecycle ?? existing?.lifecycle ?? "active",
          options.storageRevision ?? (existing ? existing.storageRevision + 1 : 1),
          options.storedAt ?? existing?.storedAt ?? record.createdAt,
          options.archivedAt !== undefined
            ? options.archivedAt
            : options.lifecycle === "archived"
              ? record.updatedAt
              : (existing?.archivedAt ?? null)
        );
        provider.commit(stored);
        return createResult(true, "Record committed.", stored);
      },

      commitLifecycleChange: (recordId, lifecycle, timestamp) => {
        const existing = provider.get(recordId);
        if (!existing) {
          provider.restoreSnapshot(snapshot);
          return createResult(
            false,
            `Record not found: ${recordId}.`,
            null,
            executiveMemoryStorageErrorFromCode("recordNotFound", `Record not found: ${recordId}.`, "id")
          );
        }

        if (lifecycle === "archived" && existing.lifecycle === "archived") {
          provider.restoreSnapshot(snapshot);
          return createResult(
            false,
            `Record already archived: ${recordId}.`,
            null,
            executiveMemoryStorageErrorFromCode("alreadyArchived", `Record already archived: ${recordId}.`, "id")
          );
        }

        if (lifecycle === "active" && existing.lifecycle === "active") {
          provider.restoreSnapshot(snapshot);
          return createResult(
            false,
            `Record is not archived: ${recordId}.`,
            null,
            executiveMemoryStorageErrorFromCode("notArchived", `Record is not archived: ${recordId}.`, "id")
          );
        }

        const stored = freezeStoredRecord(
          existing.record,
          lifecycle,
          existing.storageRevision + 1,
          existing.storedAt,
          lifecycle === "archived" ? timestamp : null
        );
        provider.commit(stored);
        return createResult(true, "Lifecycle updated.", stored);
      },

      rollback: () => {
        provider.restoreSnapshot(snapshot);
      },

      finalize: () => {
        if (committed) {
          return createResult(true, "Transaction already finalized.", null);
        }
        committed = true;
        return createResult(true, "Transaction finalized.", null);
      },
    });
  }

  return Object.freeze({
    provider,
    beginTransaction,
    get: (recordId: ExecutiveMemoryId) => provider.get(recordId),
    has: (recordId: ExecutiveMemoryId) => provider.has(recordId),
    list: (query?: ExecutiveMemoryListQuery) => provider.list(query),
    resetForTests: () => provider.resetForTests(),
    initialize: () => provider.initialize(),
  });
}

export type ExecutiveMemoryStore = ReturnType<typeof createExecutiveMemoryStore>;

export const ExecutiveMemoryStoreFactory = Object.freeze({
  createExecutiveMemoryStore,
});
