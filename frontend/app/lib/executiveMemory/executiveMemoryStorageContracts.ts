/**
 * APP-4:3 — Executive Memory storage contracts.
 * Canonical APP-4:3 contract surface — extends APP-4:1 and APP-4:2 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import {
  EXECUTIVE_MEMORY_STORAGE_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_STORAGE_FUTURE_PROVIDERS,
  EXECUTIVE_MEMORY_STORAGE_TAGS,
} from "./executiveMemoryStorageConstants.ts";

export {
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
  initializeExecutiveMemoryStorageEngine,
  isExecutiveMemoryStorageEngineInitialized,
  getExecutiveMemoryStorageState,
  resetExecutiveMemoryStorageEngineForTests,
  ExecutiveMemoryStorageEngine,
} from "./executiveMemoryStorageEngine.ts";

export {
  createExecutiveMemoryRepository,
  ExecutiveMemoryRepositoryFactory,
} from "./executiveMemoryRepository.ts";

export {
  createExecutiveMemoryStore,
  ExecutiveMemoryStoreFactory,
} from "./executiveMemoryStore.ts";

export {
  createExecutiveMemoryInMemoryProvider,
  ExecutiveMemoryInMemoryProvider,
} from "./executiveMemoryInMemoryProvider.ts";

export {
  ExecutiveMemoryStorageProviderRegistry,
  resolveExecutiveMemoryStorageProviderCapabilities,
  isExecutiveMemoryStorageProviderKind,
} from "./executiveMemoryStorageProvider.ts";

export {
  validateExecutiveMemoryRecordForStorage,
  validateExecutiveMemoryStorageProvider,
  applyExecutiveMemoryUpdate,
  validateExecutiveMemoryUpdateIdentifiers,
} from "./executiveMemoryStorageValidation.ts";

export {
  computeExecutiveMemoryStorageStatistics,
  ExecutiveMemoryStorageStatisticsService,
} from "./executiveMemoryStorageStatistics.ts";

export {
  buildExecutiveMemoryStorageIndex,
  countByKey,
  countByLifecycle,
} from "./executiveMemoryStorageIndex.ts";

export {
  createExecutiveMemoryStorageError,
  executiveMemoryStorageErrorFromCode,
  EXECUTIVE_MEMORY_STORAGE_ERROR_CODES,
} from "./executiveMemoryStorageErrors.ts";

export type {
  ExecutiveMemoryLifecycleState,
  ExecutiveMemoryListQuery,
  ExecutiveMemoryRepositoryResult,
  ExecutiveMemoryStorageError,
  ExecutiveMemoryStorageProviderKind,
  ExecutiveMemoryStorageResult,
  ExecutiveMemoryStorageState,
  ExecutiveMemoryStorageStatistics,
  ExecutiveMemoryStorageTransactionSnapshot,
  ExecutiveMemoryStoredRecord,
  ExecutiveMemoryUpdateInput,
} from "./executiveMemoryStorageTypes.ts";

export type { ExecutiveMemoryRepository } from "./executiveMemoryRepository.ts";
export type { ExecutiveMemoryStore } from "./executiveMemoryStore.ts";
export type { ExecutiveMemoryStorageProviderAdapter } from "./executiveMemoryStorageProvider.ts";

export const EXECUTIVE_MEMORY_STORAGE_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/3" as const,
  title: "Executive Memory Storage Engine",
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_MEMORY_STORAGE_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_STORAGE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/3",
  title: "Executive Memory Storage Engine",
  goal: "Safe Executive Memory record storage — create, update, archive, restore, and list only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemoryStorageConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageErrors.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageProvider.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryInMemoryProvider.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageIndex.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStore.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageValidation.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRepository.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageEngine.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryStorageContracts.test.ts",
    "docs/app-4-3-executive-memory-storage-engine-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "executiveIntent/",
    "executive-time/",
    "dashboard/",
    "assistant/",
    "components/",
    ".tsx",
    "MemoryRetrieval",
    "MemoryRanking",
    "MemorySearch",
    "vector",
    "semanticSearch",
    "localStorage.setItem",
    "filesystem",
    "database",
  ]),
  prerequisites: Object.freeze(["APP-4/1", "APP-4/2", "APP-1", "APP-2", "APP-3"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_STORAGE_TAGS,
} satisfies StageManifest);

export const ExecutiveMemoryStorageContracts = Object.freeze({
  identity: EXECUTIVE_MEMORY_STORAGE_IDENTITY,
  manifest: EXECUTIVE_MEMORY_STORAGE_SELF_MANIFEST,
  version: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  futureProviders: EXECUTIVE_MEMORY_STORAGE_FUTURE_PROVIDERS,
  tags: EXECUTIVE_MEMORY_STORAGE_TAGS,
});
