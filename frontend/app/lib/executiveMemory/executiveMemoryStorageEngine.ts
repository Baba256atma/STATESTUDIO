/**
 * APP-4:3 — Executive Memory Storage Engine.
 * Official storage entry point — extends APP-4:1 and APP-4:2 only.
 */

import { createExecutiveMemoryInMemoryProvider } from "./executiveMemoryInMemoryProvider.ts";
import { createExecutiveMemoryRepository, type ExecutiveMemoryRepository } from "./executiveMemoryRepository.ts";
import { createExecutiveMemoryStore, type ExecutiveMemoryStore } from "./executiveMemoryStore.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import type { ExecutiveMemoryMetadata } from "./executiveMemoryMetadata.ts";
import type { ExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";
import type {
  ExecutiveMemoryListQuery,
  ExecutiveMemoryStorageProviderKind,
  ExecutiveMemoryStorageResult,
  ExecutiveMemoryStorageState,
  ExecutiveMemoryStorageStatistics,
  ExecutiveMemoryStoredRecord,
  ExecutiveMemoryUpdateInput,
} from "./executiveMemoryStorageTypes.ts";

let activeProviderKind: ExecutiveMemoryStorageProviderKind = "in_memory";
let initialized = false;
let store: ExecutiveMemoryStore = createExecutiveMemoryStore(createExecutiveMemoryInMemoryProvider());
let repository: ExecutiveMemoryRepository = createExecutiveMemoryRepository(store);

function rebuildEngine(providerKind: ExecutiveMemoryStorageProviderKind = "in_memory"): void {
  if (providerKind !== "in_memory") {
    throw new Error(`Storage provider not implemented: ${providerKind}.`);
  }
  const provider = createExecutiveMemoryInMemoryProvider();
  provider.initialize();
  store = createExecutiveMemoryStore(provider);
  repository = createExecutiveMemoryRepository(store);
  activeProviderKind = providerKind;
}

export function initializeExecutiveMemoryStorageEngine(
  timestamp: string,
  providerKind: ExecutiveMemoryStorageProviderKind = "in_memory"
): Readonly<{ success: boolean; reason: string; state: ExecutiveMemoryStorageState | null }> {
  try {
    rebuildEngine(providerKind);
    initialized = true;
    return Object.freeze({
      success: true,
      reason: "Executive Memory storage engine initialized.",
      state: getExecutiveMemoryStorageState(timestamp),
    });
  } catch (error) {
    initialized = false;
    return Object.freeze({
      success: false,
      reason: error instanceof Error ? error.message : "Storage engine initialization failed.",
      state: null,
    });
  }
}

export function isExecutiveMemoryStorageEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveMemoryStorageState(timestamp: string): ExecutiveMemoryStorageState {
  const records = store.list();
  const activeCount = records.filter((entry) => entry.lifecycle === "active").length;
  return Object.freeze({
    engineId: "executive-memory-storage-engine",
    contractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
    providerKind: activeProviderKind,
    recordCount: records.length,
    activeCount,
    archivedCount: records.length - activeCount,
    initialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveMemoryStorageEngineForTests(): void {
  initialized = false;
  rebuildEngine("in_memory");
}

export function createExecutiveMemory(
  record: ExecutiveMemoryRecord,
  timestamp: string = record.createdAt
): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> {
  return repository.createExecutiveMemory(record, timestamp);
}

export function saveExecutiveMemory(
  record: ExecutiveMemoryRecord,
  timestamp: string = record.updatedAt
): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> {
  return repository.saveExecutiveMemory(record, timestamp);
}

export function updateExecutiveMemory(
  recordId: ExecutiveMemoryId,
  updates: ExecutiveMemoryUpdateInput,
  timestamp: string
): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> {
  return repository.updateExecutiveMemory(recordId, updates, timestamp);
}

export function archiveExecutiveMemory(
  recordId: ExecutiveMemoryId,
  timestamp: string
): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> {
  return repository.archiveExecutiveMemory(recordId, timestamp);
}

export function restoreExecutiveMemory(
  recordId: ExecutiveMemoryId,
  timestamp: string
): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> {
  return repository.restoreExecutiveMemory(recordId, timestamp);
}

export function deleteExecutiveMemory(
  recordId: ExecutiveMemoryId,
  timestamp: string
): ExecutiveMemoryStorageResult<ExecutiveMemoryStoredRecord> {
  return repository.deleteExecutiveMemory(recordId, timestamp);
}

export function getExecutiveMemoryById(recordId: ExecutiveMemoryId): ExecutiveMemoryStoredRecord | null {
  return repository.getExecutiveMemoryById(recordId);
}

export function hasExecutiveMemory(recordId: ExecutiveMemoryId): boolean {
  return repository.hasExecutiveMemory(recordId);
}

export function getExecutiveMemories(query?: ExecutiveMemoryListQuery): readonly ExecutiveMemoryStoredRecord[] {
  return repository.getExecutiveMemories(query);
}

export function getExecutiveMemoryMetadata(recordId: ExecutiveMemoryId): ExecutiveMemoryMetadata | null {
  return repository.getExecutiveMemoryMetadata(recordId);
}

export function getExecutiveMemoryStatistics(): ExecutiveMemoryStorageStatistics {
  return repository.getExecutiveMemoryStatistics();
}

export const ExecutiveMemoryStorageEngine = Object.freeze({
  initializeExecutiveMemoryStorageEngine,
  isExecutiveMemoryStorageEngineInitialized,
  getExecutiveMemoryStorageState,
  resetExecutiveMemoryStorageEngineForTests,
  createExecutiveMemory,
  saveExecutiveMemory,
  updateExecutiveMemory,
  archiveExecutiveMemory,
  restoreExecutiveMemory,
  deleteExecutiveMemory,
  getExecutiveMemoryById,
  hasExecutiveMemory,
  getExecutiveMemories,
  getExecutiveMemoryMetadata,
  getExecutiveMemoryStatistics,
  version: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
});
