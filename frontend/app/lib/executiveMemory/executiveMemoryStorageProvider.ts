/**
 * APP-4:3 — Executive Memory storage provider abstraction.
 */

import {
  EXECUTIVE_MEMORY_STORAGE_FUTURE_PROVIDERS,
  EXECUTIVE_MEMORY_STORAGE_PROVIDER_KINDS,
} from "./executiveMemoryStorageConstants.ts";
import type {
  ExecutiveMemoryId,
  ExecutiveMemoryStorageProviderCapabilities,
  ExecutiveMemoryStorageProviderKind,
  ExecutiveMemoryStorageTransactionSnapshot,
  ExecutiveMemoryStoredRecord,
} from "./executiveMemoryStorageTypes.ts";
import type { ExecutiveMemoryListQuery } from "./executiveMemoryStorageTypes.ts";

export type ExecutiveMemoryStorageProviderAdapter = Readonly<{
  kind: ExecutiveMemoryStorageProviderKind;
  capabilities: ExecutiveMemoryStorageProviderCapabilities;
  initialize: () => void;
  resetForTests: () => void;
  snapshot: () => ExecutiveMemoryStorageTransactionSnapshot;
  restoreSnapshot: (snapshot: ExecutiveMemoryStorageTransactionSnapshot) => void;
  get: (recordId: ExecutiveMemoryId) => ExecutiveMemoryStoredRecord | null;
  has: (recordId: ExecutiveMemoryId) => boolean;
  list: (query?: ExecutiveMemoryListQuery) => readonly ExecutiveMemoryStoredRecord[];
  commit: (record: ExecutiveMemoryStoredRecord) => void;
}>;

export function resolveExecutiveMemoryStorageProviderCapabilities(
  kind: ExecutiveMemoryStorageProviderKind
): ExecutiveMemoryStorageProviderCapabilities {
  if (kind === "in_memory") {
    return Object.freeze({
      kind,
      supportsTransactions: true,
      supportsArchive: true,
      implemented: true,
      readOnly: true as const,
    });
  }
  const placeholder =
    kind === "local_storage"
      ? EXECUTIVE_MEMORY_STORAGE_FUTURE_PROVIDERS.localStorage
      : EXECUTIVE_MEMORY_STORAGE_FUTURE_PROVIDERS.database;
  return Object.freeze({
    kind,
    supportsTransactions: false,
    supportsArchive: true,
    implemented: placeholder.implemented,
    readOnly: true as const,
  });
}

export function isExecutiveMemoryStorageProviderKind(
  value: string
): value is ExecutiveMemoryStorageProviderKind {
  return (EXECUTIVE_MEMORY_STORAGE_PROVIDER_KINDS as readonly string[]).includes(value);
}

export const ExecutiveMemoryStorageProviderRegistry = Object.freeze({
  futureProviders: EXECUTIVE_MEMORY_STORAGE_FUTURE_PROVIDERS,
  resolveExecutiveMemoryStorageProviderCapabilities,
  isExecutiveMemoryStorageProviderKind,
});
