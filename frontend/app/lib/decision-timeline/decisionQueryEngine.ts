/**
 * APP-6:6 — Decision Query Engine.
 * Canonical read-only query layer over APP-6:5 DecisionState.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { applyDecisionQueryFilters, applyDecisionQuerySort } from "./decisionQueryFilters.ts";
import {
  collectQueryableDecisionStates,
  getDecisionQueryAttributesRegistry,
  getDecisionQueryRegistry,
  registerDecisionQueryResult,
  resetDecisionQueryRegistryForTests,
} from "./decisionQueryRegistry.ts";
import { buildDecisionQuerySnapshot } from "./decisionQuerySnapshot.ts";
import {
  DECISION_QUERY_ENGINE_CONTRACT_VERSION,
  DECISION_QUERY_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_QUERY_ENGINE_TAGS,
  DECISION_QUERY_FILTER_KEYS,
  DECISION_QUERY_FUTURE_CONSUMERS,
  DECISION_QUERY_SORT_FIELDS,
  DEFAULT_DECISION_QUERY_SORT,
  queryFailure,
  type DecisionQueryContractSurface,
  type DecisionQueryEngineState,
  type DecisionQueryFilters,
  type DecisionQueryInput,
  type DecisionQueryResponse,
  type DecisionQueryResult,
  type DecisionQuerySort,
} from "./decisionQueryTypes.ts";
import {
  validateDecisionQuery,
  validateDecisionQueryInput,
  validateDecisionQueryResult,
  validateDecisionStateCompatibility,
  validateWorkspaceIsolationForQuery,
} from "./decisionQueryValidation.ts";
import { DECISION_STATE_ENGINE_SELF_MANIFEST, getDecisionState } from "./decisionStateEngine.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import type { DecisionCategory, DecisionId, DecisionStatus, DecisionTag, DecisionWorkspaceId } from "./decisionTimelineTypes.ts";
import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";

export const DECISION_QUERY_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_QUERY_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_QUERY_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/6",
  title: "Decision Query Engine",
  goal: "Canonical read-only query layer over APP-6:5 DecisionState for downstream APP-6 consumers.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_STATE_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionQueryTypes.ts",
    "frontend/app/lib/decision-timeline/decisionQueryFilters.ts",
    "frontend/app/lib/decision-timeline/decisionQueryValidation.ts",
    "frontend/app/lib/decision-timeline/decisionQueryRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionQuerySnapshot.ts",
    "frontend/app/lib/decision-timeline/decisionQueryEngine.ts",
    "frontend/app/lib/decision-timeline/decisionQueryRunner.ts",
    "frontend/app/lib/decision-timeline/decisionQueryEngine.test.ts",
    "docs/app-6-6-decision-query-engine-report.md",
  ]),
  forbiddenPatterns: DECISION_QUERY_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1", "APP-6/2", "APP-6/3", "APP-6/4", "APP-6/5"]),
  runtimePath: "library-only" as const,
  tags: DECISION_QUERY_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_QUERY_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  stateDerivedOnly: true,
  noLifecycleRecalculation: true,
  noHistoryRebuild: true,
  noStateDerivation: true,
  noPersistence: true,
  noSearchIndex: true,
  noVisualization: true,
  noPlayback: true,
  noReact: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";
let querySequence = 0;

export function initializeDecisionQueryEngine(
  timestamp: string = engineTimestamp
): DecisionQueryEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionQueryEngineState(timestamp);
}

export function isDecisionQueryEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionQueryEngineState(
  timestamp: string = engineTimestamp
): DecisionQueryEngineState {
  const registry = getDecisionQueryRegistry();
  const stateRegistry = collectQueryableDecisionStates();
  return Object.freeze({
    engineId: "decision-query-engine",
    contractVersion: DECISION_QUERY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredQueryCount: registry.registeredQueryCount,
    indexedStateCount: stateRegistry.length,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionQueryEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  querySequence = 0;
  resetDecisionQueryRegistryForTests();
}

function resetDecisionQueryIdSequenceForTests(): void {
  querySequence = 0;
}

function createQueryId(): string {
  querySequence += 1;
  return `decision-query-${String(querySequence).padStart(6, "0")}`;
}

function resolveSort(sort?: DecisionQuerySort): DecisionQuerySort {
  return Object.freeze(sort ?? DEFAULT_DECISION_QUERY_SORT);
}

function buildQueryResult(
  filters: DecisionQueryFilters,
  sort: DecisionQuerySort,
  states: readonly DecisionState[],
  queryTimestamp: string
): DecisionQueryResult {
  return Object.freeze({
    queryId: createQueryId(),
    filters: Object.freeze({ ...filters }),
    sort: Object.freeze({ ...sort }),
    states: Object.freeze([...states]),
    totalCount: states.length,
    queryTimestamp,
    contractVersion: DECISION_QUERY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

function executeDecisionQuery(input: DecisionQueryInput): DecisionQueryResponse {
  if (!isDecisionQueryEngineInitialized()) {
    return queryFailure("Decision Query Engine is not initialized.");
  }

  const validation = validateDecisionQueryInput(input);
  if (!validation.valid) {
    return queryFailure(validation.issues[0]?.message ?? "Decision query validation failed.");
  }

  const sort = resolveSort(input.sort);

  if (input.filters.decisionId && input.filters.workspaceId) {
    const existing = getDecisionState(input.filters.decisionId);
    if (existing && existing.workspaceId !== input.filters.workspaceId) {
      return queryFailure("decisionId does not belong to the requested workspace.");
    }
  }

  const attributes = getDecisionQueryAttributesRegistry();
  const sourceStates = collectQueryableDecisionStates();

  for (const state of sourceStates) {
    const compatibility = validateDecisionStateCompatibility(state);
    if (!compatibility.valid) {
      return queryFailure(compatibility.issues[0]?.message ?? "DecisionState compatibility failed.");
    }
  }

  let filtered = applyDecisionQueryFilters(sourceStates, input.filters, attributes);
  filtered = applyDecisionQuerySort(filtered, sort);

  if (input.limit !== undefined) {
    filtered = Object.freeze(filtered.slice(0, input.limit));
  }

  const isolation = validateWorkspaceIsolationForQuery(filtered, input.filters);
  if (!isolation.valid) {
    return queryFailure(isolation.issues[0]?.message ?? "Workspace isolation validation failed.");
  }

  const result = buildQueryResult(input.filters, sort, filtered, engineTimestamp);
  const resultValidation = validateDecisionQueryResult(result);
  if (!resultValidation.valid) {
    return queryFailure(resultValidation.issues[0]?.message ?? "Decision query result validation failed.");
  }

  return registerDecisionQueryResult(result);
}

function withFilters(filters: DecisionQueryFilters, sort?: DecisionQuerySort, limit?: number): DecisionQueryInput {
  return Object.freeze({
    filters: Object.freeze({ ...filters }),
    sort: sort ? Object.freeze({ ...sort }) : undefined,
    limit,
  });
}

export function queryDecisionStates(input: DecisionQueryInput): DecisionQueryResponse {
  return executeDecisionQuery(input);
}

export function getDecisionById(decisionId: DecisionId): DecisionState | null {
  return getDecisionState(decisionId);
}

export { getDecisionState };

export function getDecisionsByWorkspace(workspaceId: DecisionWorkspaceId): DecisionQueryResponse {
  return queryDecisionStates(withFilters({ workspaceId }));
}

export function getDecisionsByLifecycle(lifecycle: DecisionEngineLifecycle): DecisionQueryResponse {
  return queryDecisionStates(withFilters({ lifecycle }));
}

export function getDecisionsByStatus(status: DecisionStatus): DecisionQueryResponse {
  return queryDecisionStates(withFilters({ status }));
}

export function getDecisionsByCategory(category: DecisionCategory): DecisionQueryResponse {
  return queryDecisionStates(withFilters({ category }));
}

export function getDecisionsByTag(tag: DecisionTag): DecisionQueryResponse {
  return queryDecisionStates(withFilters({ tags: Object.freeze([tag]) }));
}

export function getTerminalDecisions(): DecisionQueryResponse {
  return queryDecisionStates(withFilters({ terminal: true }));
}

export function getActiveDecisions(): DecisionQueryResponse {
  return queryDecisionStates(withFilters({ active: true }));
}

export function getRecentDecisions(limit: number = 10): DecisionQueryResponse {
  return queryDecisionStates(
    withFilters({}, { field: "latestTimestamp", direction: "desc" }, limit)
  );
}

export function listDecisionStates(): DecisionQueryResponse {
  return queryDecisionStates(withFilters({}));
}

export function getDecisionQueryContract(): DecisionQueryContractSurface {
  return Object.freeze({
    contractVersion: DECISION_QUERY_ENGINE_CONTRACT_VERSION,
    supportedFilters: DECISION_QUERY_FILTER_KEYS,
    supportedSortFields: DECISION_QUERY_SORT_FIELDS,
    futureConsumers: DECISION_QUERY_FUTURE_CONSUMERS,
    readOnly: true as const,
  });
}

export { validateDecisionQuery, buildDecisionQuerySnapshot };
export { runDecisionQueryEngine } from "./decisionQueryRunner.ts";

export const DECISION_QUERY_ENGINE_VERSION = DECISION_QUERY_ENGINE_CONTRACT_VERSION;
export const DECISION_QUERY_ENGINE_OWNER = "decision-query-engine";

export const DecisionQueryEngine = Object.freeze({
  initializeDecisionQueryEngine,
  isDecisionQueryEngineInitialized,
  getDecisionQueryEngineState,
  queryDecisionStates,
  getDecisionById,
  getDecisionState,
  getDecisionsByWorkspace,
  getDecisionsByLifecycle,
  getDecisionsByStatus,
  getDecisionsByCategory,
  getDecisionsByTag,
  getTerminalDecisions,
  getActiveDecisions,
  getRecentDecisions,
  listDecisionStates,
  validateDecisionQuery,
  buildDecisionQuerySnapshot,
  getDecisionQueryContract,
  version: DECISION_QUERY_ENGINE_CONTRACT_VERSION,
  tags: DECISION_QUERY_ENGINE_TAGS,
});

export { DECISION_QUERY_ENGINE_TAGS, DECISION_QUERY_FUTURE_CONSUMERS, resetDecisionQueryIdSequenceForTests };
