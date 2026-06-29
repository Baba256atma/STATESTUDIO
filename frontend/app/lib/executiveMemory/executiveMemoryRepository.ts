/**
 * APP-4:3 — Executive Memory repository.
 * Safe storage APIs over APP-4:2 contracts.
 */

import type { ExecutiveMemoryMetadata } from "./executiveMemoryMetadata.ts";
import type { ExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import { executiveMemoryStorageErrorFromCode } from "./executiveMemoryStorageErrors.ts";
import { computeExecutiveMemoryStorageStatistics } from "./executiveMemoryStorageStatistics.ts";
import {
  applyExecutiveMemoryUpdate,
  validateExecutiveMemoryRecordForStorage,
  validateExecutiveMemoryUpdateIdentifiers,
} from "./executiveMemoryStorageValidation.ts";
import type { ExecutiveMemoryStore } from "./executiveMemoryStore.ts";
import type {
  ExecutiveMemoryListQuery,
  ExecutiveMemoryStorageResult,
  ExecutiveMemoryStorageStatistics,
  ExecutiveMemoryStoredRecord,
  ExecutiveMemoryUpdateInput,
} from "./executiveMemoryStorageTypes.ts";

function createResult<T>(
  success: boolean,
  reason: string,
  data: T | null,
  error: ExecutiveMemoryStorageResult<T>["error"] = null
): ExecutiveMemoryStorageResult<T> {
  return Object.freeze({ success, reason, data, error, readOnly: true as const });
}

export function createExecutiveMemoryRepository(store: ExecutiveMemoryStore) {
  function runTransaction<T>(
    operation: (transaction: ReturnType<ExecutiveMemoryStore["beginTransaction"]>) => ExecutiveMemoryStorageResult<T>
  ): ExecutiveMemoryStorageResult<T> {
    const transaction = store.beginTransaction();
    const outcome = operation(transaction);
    if (!outcome.success) {
      transaction.rollback();
      return createResult(
        false,
        outcome.reason,
        null,
        outcome.error ??
          executiveMemoryStorageErrorFromCode("transactionRollback", "Storage transaction rolled back.")
      );
    }
    transaction.finalize();
    return outcome;
  }

  return Object.freeze({
    createExecutiveMemory: (
      record: ExecutiveMemoryRecord,
      timestamp: string = record.createdAt
    ): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> =>
      runTransaction((transaction) =>
        transaction.commitStoredRecord(record, {
          lifecycle: "active",
          storedAt: timestamp,
          archivedAt: null,
        })
      ),

    saveExecutiveMemory: (
      record: ExecutiveMemoryRecord,
      timestamp: string = record.updatedAt
    ): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> => {
      const exists = store.has(record.id);
      if (!exists) {
        return runTransaction((transaction) =>
          transaction.commitStoredRecord(record, {
            lifecycle: "active",
            storedAt: timestamp,
            archivedAt: null,
          })
        );
      }
      const existing = store.get(record.id);
      return runTransaction((transaction) =>
        transaction.commitStoredRecord(record, {
          lifecycle: existing?.lifecycle ?? "active",
          storageRevision: (existing?.storageRevision ?? 0) + 1,
          storedAt: existing?.storedAt ?? timestamp,
          archivedAt: existing?.archivedAt ?? null,
          allowDuplicate: true,
        })
      );
    },

    updateExecutiveMemory: (
      recordId: ExecutiveMemoryId,
      updates: ExecutiveMemoryUpdateInput,
      timestamp: string
    ): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> => {
      const existing = store.get(recordId);
      if (!existing) {
        return createResult(
          false,
          `Record not found: ${recordId}.`,
          null,
          executiveMemoryStorageErrorFromCode("recordNotFound", `Record not found: ${recordId}.`, "id")
        );
      }

      const candidate = applyExecutiveMemoryUpdate(existing.record, updates, timestamp);
      const identifierValidation = validateExecutiveMemoryUpdateIdentifiers(existing.record, candidate);
      if (!identifierValidation.valid) {
        return createResult(false, identifierValidation.error!.message, null, identifierValidation.error);
      }

      const validation = validateExecutiveMemoryRecordForStorage(candidate);
      if (!validation.valid) {
        return createResult(false, validation.error!.message, null, validation.error);
      }

      return runTransaction((transaction) =>
        transaction.commitStoredRecord(candidate, {
          lifecycle: existing.lifecycle,
          storageRevision: existing.storageRevision + 1,
          storedAt: existing.storedAt,
          archivedAt: existing.archivedAt,
          allowDuplicate: true,
        })
      );
    },

    archiveExecutiveMemory: (
      recordId: ExecutiveMemoryId,
      timestamp: string
    ): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> =>
      runTransaction((transaction) => {
        const outcome = transaction.commitLifecycleChange(recordId, "archived", timestamp);
        if (!outcome.success) {
          return createResult(
            false,
            outcome.reason,
            null,
            outcome.error ??
              executiveMemoryStorageErrorFromCode("archiveFailure", `Failed to archive record: ${recordId}.`, "id")
          );
        }
        return outcome;
      }),

    restoreExecutiveMemory: (
      recordId: ExecutiveMemoryId,
      _timestamp: string
    ): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> =>
      runTransaction((transaction) => {
        const outcome = transaction.commitLifecycleChange(recordId, "active", _timestamp);
        if (!outcome.success) {
          return createResult(
            false,
            outcome.reason,
            null,
            outcome.error ??
              executiveMemoryStorageErrorFromCode("restoreFailure", `Failed to restore record: ${recordId}.`, "id")
          );
        }
        return outcome;
      }),

    deleteExecutiveMemory: (
      recordId: ExecutiveMemoryId,
      timestamp: string
    ): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> =>
      runTransaction((transaction) => {
        const outcome = transaction.commitLifecycleChange(recordId, "archived", timestamp);
        if (!outcome.success) {
          return createResult(
            false,
            outcome.reason,
            null,
            outcome.error ??
              executiveMemoryStorageErrorFromCode("archiveFailure", `Soft delete failed for record: ${recordId}.`, "id")
          );
        }
        return outcome;
      }),

    getExecutiveMemoryById: (recordId: ExecutiveMemoryId): ExecutiveMemoryStoredRecord | null =>
      store.get(recordId),

    hasExecutiveMemory: (recordId: ExecutiveMemoryId): boolean => store.has(recordId),

    getExecutiveMemories: (query?: ExecutiveMemoryListQuery): readonly ExecutiveMemoryStoredRecord[] =>
      store.list(query),

    getExecutiveMemoryMetadata: (recordId: ExecutiveMemoryId): ExecutiveMemoryMetadata | null =>
      store.get(recordId)?.record.metadata ?? null,

    getExecutiveMemoryStatistics: (): ExecutiveMemoryStorageStatistics =>
      computeExecutiveMemoryStorageStatistics(store.list()),
  });
}

export type ExecutiveMemoryRepository = ReturnType<typeof createExecutiveMemoryRepository>;

export const ExecutiveMemoryRepositoryFactory = Object.freeze({
  createExecutiveMemoryRepository,
});
