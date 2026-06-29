/**
 * APP-4:4 — Executive Memory Retrieval Engine.
 * Official retrieval entry point — extends APP-4:1, APP-4:2, and APP-4:3 only.
 */

import { createExecutiveMemoryQuery } from "./executiveMemoryQuery.ts";
import {
  countExecutiveMemoryMatches,
  executeExecutiveMemoryQuery,
  retrieveExecutiveMemoryById,
} from "./executiveMemoryRetrievalExecutor.ts";
import { EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION } from "./executiveMemoryRetrievalConstants.ts";
import type { ExecutiveMemoryCategory, ExecutiveMemoryId, ExecutiveMemoryProviderId, ExecutiveMemoryWorkspaceId } from "./executiveMemoryTypes.ts";
import type { ExecutiveMemoryReferenceType } from "./executiveMemoryReference.ts";
import type { ExecutiveMemoryLifecycleState } from "./executiveMemoryStorageTypes.ts";
import type {
  CreateExecutiveMemoryQueryInput,
  ExecutiveMemoryQuery,
  ExecutiveMemoryQueryResult,
  ExecutiveMemoryRetrievalResult,
  ExecutiveMemoryRetrievalState,
} from "./executiveMemoryRetrievalTypes.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";

let initialized = false;

export function initializeExecutiveMemoryRetrievalEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string; state: ExecutiveMemoryRetrievalState | null }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: "Executive Memory retrieval engine initialized.",
    state: getExecutiveMemoryRetrievalState(timestamp),
  });
}

export function isExecutiveMemoryRetrievalEngineInitialized(): boolean {
  return initialized;
}

export function getExecutiveMemoryRetrievalState(timestamp: string): ExecutiveMemoryRetrievalState {
  return Object.freeze({
    engineId: "executive-memory-retrieval-engine",
    contractVersion: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
    initialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveMemoryRetrievalEngineForTests(): void {
  initialized = false;
}

export function getExecutiveMemoryById(
  recordId: ExecutiveMemoryId
): ExecutiveMemoryRetrievalResult<ExecutiveMemoryStoredRecord> {
  return retrieveExecutiveMemoryById(recordId);
}

export function findExecutiveMemories(query: CreateExecutiveMemoryQueryInput | ExecutiveMemoryQuery): ExecutiveMemoryQueryResult {
  const normalized = "readOnly" in query ? query : createExecutiveMemoryQuery(query);
  return executeExecutiveMemoryQuery(normalized, "find");
}

export function findExecutiveMemoriesByWorkspace(
  workspaceId: ExecutiveMemoryWorkspaceId,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(
    createExecutiveMemoryQuery({ ...options, workspaceId }),
    "by_workspace"
  );
}

export function findExecutiveMemoriesByGoal(
  goalId: string,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(createExecutiveMemoryQuery({ ...options, goalId }), "by_goal");
}

export function findExecutiveMemoriesByIntent(
  intentId: string,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(createExecutiveMemoryQuery({ ...options, intentId }), "by_intent");
}

export function findExecutiveMemoriesByScenario(
  scenarioId: string,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(createExecutiveMemoryQuery({ ...options, scenarioId }), "by_scenario");
}

export function findExecutiveMemoriesByDecision(
  decisionId: string,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(createExecutiveMemoryQuery({ ...options, decisionId }), "by_decision");
}

export function findExecutiveMemoriesByCategory(
  category: ExecutiveMemoryCategory,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(createExecutiveMemoryQuery({ ...options, category }), "by_category");
}

export function findExecutiveMemoriesByProvider(
  providerId: ExecutiveMemoryProviderId,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(createExecutiveMemoryQuery({ ...options, providerId }), "by_provider");
}

export function findExecutiveMemoriesByReference(
  referenceId: string,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(
    createExecutiveMemoryQuery({ ...options, referenceIds: Object.freeze([referenceId]) }),
    "by_reference"
  );
}

export function findExecutiveMemoriesByReferenceType(
  referenceType: ExecutiveMemoryReferenceType,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(
    createExecutiveMemoryQuery({ ...options, referenceTypes: Object.freeze([referenceType]) }),
    "by_reference"
  );
}

export function findExecutiveMemoriesByTag(
  tag: string,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(
    createExecutiveMemoryQuery({ ...options, tags: Object.freeze([tag]) }),
    "by_tag"
  );
}

export function getRecentExecutiveMemories(
  limit: number,
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(
    createExecutiveMemoryQuery({
      ...options,
      sortBy: "updatedAt",
      sortDirection: "desc",
      limit,
    }),
    "recent"
  );
}

export function findArchivedExecutiveMemories(
  options: CreateExecutiveMemoryQueryInput = {}
): ExecutiveMemoryQueryResult {
  return executeExecutiveMemoryQuery(
    createExecutiveMemoryQuery({ ...options, lifecycleState: "archived" as ExecutiveMemoryLifecycleState }),
    "find"
  );
}

export function countExecutiveMemories(
  query: CreateExecutiveMemoryQueryInput | ExecutiveMemoryQuery
): ExecutiveMemoryRetrievalResult<number> {
  const normalized = "readOnly" in query ? query : createExecutiveMemoryQuery(query);
  return countExecutiveMemoryMatches(normalized);
}

export const ExecutiveMemoryRetrievalEngine = Object.freeze({
  initializeExecutiveMemoryRetrievalEngine,
  isExecutiveMemoryRetrievalEngineInitialized,
  getExecutiveMemoryRetrievalState,
  resetExecutiveMemoryRetrievalEngineForTests,
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
  version: EXECUTIVE_MEMORY_RETRIEVAL_CONTRACT_VERSION,
});
