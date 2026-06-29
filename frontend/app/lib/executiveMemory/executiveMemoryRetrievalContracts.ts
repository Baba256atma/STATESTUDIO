/**
 * APP-4:4 — Executive Memory retrieval contracts.
 * Canonical APP-4:4 contract surface — extends APP-4:1, APP-4:2, and APP-4:3 only.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_MEMORY_CONTRACT_VERSION as EXECUTIVE_MEMORY_FOUNDATION_VERSION } from "./executiveMemoryConstants.ts";
import { EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION } from "./executiveMemoryRecordConstants.ts";
import { EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION } from "./executiveMemoryStorageConstants.ts";
import {
  EXECUTIVE_MEMORY_RETRIEVAL_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_RETRIEVAL_TAGS,
} from "./executiveMemoryRetrievalConstants.ts";

export {
  createExecutiveMemoryQuery,
  createExecutiveMemoryQueryPagination,
  createExecutiveMemoryQuerySort,
  ExecutiveMemoryQueryBuilder,
} from "./executiveMemoryQuery.ts";

export {
  validateExecutiveMemoryQuery,
  ExecutiveMemoryQueryValidator,
} from "./executiveMemoryQueryValidator.ts";

export {
  executeExecutiveMemoryQuery,
  retrieveExecutiveMemoryById,
  countExecutiveMemoryMatches,
  ExecutiveMemoryRetrievalExecutor,
} from "./executiveMemoryRetrievalExecutor.ts";

export {
  createExecutiveMemoryRetrievalStatistics,
  ExecutiveMemoryRetrievalStatisticsService,
} from "./executiveMemoryRetrievalStatistics.ts";

export {
  getExecutiveMemoryById,
  findExecutiveMemories,
  findExecutiveMemoriesByWorkspace,
  findExecutiveMemoriesByGoal,
  findExecutiveMemoriesByIntent,
  findExecutiveMemoriesByScenario,
  findExecutiveMemoriesByDecision,
  findExecutiveMemoriesByCategory,
  findExecutiveMemoriesByProvider,
  findExecutiveMemoriesByReference,
  findExecutiveMemoriesByReferenceType,
  findExecutiveMemoriesByTag,
  getRecentExecutiveMemories,
  findArchivedExecutiveMemories,
  countExecutiveMemories,
  initializeExecutiveMemoryRetrievalEngine,
  isExecutiveMemoryRetrievalEngineInitialized,
  getExecutiveMemoryRetrievalState,
  resetExecutiveMemoryRetrievalEngineForTests,
  ExecutiveMemoryRetrievalEngine,
} from "./executiveMemoryRetrievalEngine.ts";

export {
  createExecutiveMemoryRetrievalError,
  executiveMemoryRetrievalErrorFromCode,
  EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES,
} from "./executiveMemoryRetrievalErrors.ts";

export type {
  CreateExecutiveMemoryQueryInput,
  ExecutiveMemoryQuery,
  ExecutiveMemoryQueryPagination,
  ExecutiveMemoryQueryResult,
  ExecutiveMemoryQuerySort,
  ExecutiveMemoryQueryValidationResult,
  ExecutiveMemoryRetrievalError,
  ExecutiveMemoryRetrievalQueryType,
  ExecutiveMemoryRetrievalResult,
  ExecutiveMemoryRetrievalState,
  ExecutiveMemoryRetrievalStatistics,
} from "./executiveMemoryRetrievalTypes.ts";

export const EXECUTIVE_MEMORY_RETRIEVAL_IDENTITY = Object.freeze({
  appId: "APP-4" as const,
  phaseId: "APP-4/4" as const,
  title: "Executive Memory Retrieval Engine",
  retrievalContractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  storageContractVersion: EXECUTIVE_MEMORY_STORAGE_CONTRACT_VERSION,
  recordContractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  foundationContractVersion: EXECUTIVE_MEMORY_FOUNDATION_VERSION,
  architectureVersion: EXECUTIVE_MEMORY_RETRIEVAL_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_RETRIEVAL_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/4",
  title: "Executive Memory Retrieval Engine",
  goal: "Deterministic Executive Memory retrieval using structured metadata queries only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalErrors.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryQuery.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryQueryValidator.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalStatistics.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalExecutor.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalEngine.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRetrievalContracts.test.ts",
    "docs/app-4-4-executive-memory-retrieval-engine-report.md",
  ]),
  forbiddenPatterns: Object.freeze([
    ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
    "executiveIntent/",
    "executive-time/",
    "dashboard/",
    "assistant/",
    "components/",
    ".tsx",
    "semanticSearch",
    "vectorSearch",
    "embedding",
    "MemoryRanking",
    "relevanceScore",
    "naturalLanguage",
  ]),
  prerequisites: Object.freeze(["APP-4/1", "APP-4/2", "APP-4/3", "APP-1", "APP-2", "APP-3"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_RETRIEVAL_TAGS,
} satisfies StageManifest);

export const ExecutiveMemoryRetrievalContracts = Object.freeze({
  identity: EXECUTIVE_MEMORY_RETRIEVAL_IDENTITY,
  manifest: EXECUTIVE_MEMORY_RETRIEVAL_SELF_MANIFEST,
  version: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
  tags: EXECUTIVE_MEMORY_RETRIEVAL_TAGS,
});
