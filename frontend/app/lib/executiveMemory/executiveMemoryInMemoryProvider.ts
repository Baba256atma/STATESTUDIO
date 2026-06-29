/**
 * APP-4:3 — In-memory Executive Memory storage provider.
 */

import type { ExecutiveMemoryStorageProviderAdapter } from "./executiveMemoryStorageProvider.ts";
import { resolveExecutiveMemoryStorageProviderCapabilities } from "./executiveMemoryStorageProvider.ts";
import type {
  ExecutiveMemoryId,
  ExecutiveMemoryListQuery,
  ExecutiveMemoryStorageTransactionSnapshot,
  ExecutiveMemoryStoredRecord,
} from "./executiveMemoryStorageTypes.ts";

function freezeStoredRecord(record: ExecutiveMemoryStoredRecord): ExecutiveMemoryStoredRecord {
  return Object.freeze({
    ...record,
    record: Object.freeze(record.record),
    readOnly: true as const,
  });
}

function matchesQuery(entry: ExecutiveMemoryStoredRecord, query?: ExecutiveMemoryListQuery): boolean {
  if (!query) return true;
  if (query.workspaceId && entry.record.workspaceId !== query.workspaceId) return false;
  if (query.providerId && entry.record.providerId !== query.providerId) return false;
  if (query.category && entry.record.category !== query.category) return false;
  if (query.lifecycle && entry.lifecycle !== query.lifecycle) return false;
  return true;
}

export function createExecutiveMemoryInMemoryProvider(): ExecutiveMemoryStorageProviderAdapter {
  const records = new Map<ExecutiveMemoryId, ExecutiveMemoryStoredRecord>();
  const kind = "in_memory" as const;

  return Object.freeze({
    kind,
    capabilities: resolveExecutiveMemoryStorageProviderCapabilities(kind),
    initialize: () => {
      records.clear();
    },
    resetForTests: () => {
      records.clear();
    },
    snapshot: (): ExecutiveMemoryStorageTransactionSnapshot =>
      Object.freeze({
        records: Object.freeze(new Map(records)),
        readOnly: true as const,
      }),
    restoreSnapshot: (snapshot: ExecutiveMemoryStorageTransactionSnapshot) => {
      records.clear();
      for (const [key, value] of snapshot.records.entries()) {
        records.set(key, freezeStoredRecord(value));
      }
    },
    get: (recordId: ExecutiveMemoryId) => records.get(recordId) ?? null,
    has: (recordId: ExecutiveMemoryId) => records.has(recordId),
    list: (query?: ExecutiveMemoryListQuery) =>
      Object.freeze(
        [...records.values()]
          .filter((entry) => matchesQuery(entry, query))
          .sort((left, right) => left.record.id.localeCompare(right.record.id))
          .map((entry) => freezeStoredRecord(entry))
      ),
    commit: (record: ExecutiveMemoryStoredRecord) => {
      records.set(record.record.id, freezeStoredRecord(record));
    },
  });
}

export const ExecutiveMemoryInMemoryProvider = Object.freeze({
  createExecutiveMemoryInMemoryProvider,
});
