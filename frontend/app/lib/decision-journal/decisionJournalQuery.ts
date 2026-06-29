/**
 * APP-8:3 — Decision Journal Query + Ordering Layer.
 * Read-only gateway over APP-8:2 DecisionJournalEngineEntry records.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_JOURNAL_MUST_NOT_OWN } from "./decisionJournalConstants.ts";
import { isDecisionJournalPlatformInitialized } from "./decisionJournalFoundation.ts";
import {
  DECISION_JOURNAL_ENGINE_SELF_MANIFEST,
  isDecisionJournalEngineInitialized,
} from "./decisionJournalEngine.ts";
import { orderDecisionJournalEntries } from "./decisionJournalOrdering.ts";
import { applyDecisionJournalQueryFilters } from "./decisionJournalQueryFilters.ts";
import {
  buildDecisionJournalReadModel,
  buildDecisionJournalSummary,
} from "./decisionJournalReadModel.ts";
import {
  DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
  DECISION_JOURNAL_QUERY_FILTER_KEYS,
  DECISION_JOURNAL_QUERY_FORBIDDEN_PATTERNS,
  DECISION_JOURNAL_QUERY_ORDER_FIELDS,
  DECISION_JOURNAL_QUERY_TAGS,
  queryFailure,
  querySuccess,
  type DecisionJournalQueryEngineState,
  type DecisionJournalQueryFilters,
  type DecisionJournalQueryInput,
  type DecisionJournalQueryResponse,
  type DecisionJournalQueryResult,
  type DecisionJournalQuerySummary,
} from "./decisionJournalQueryTypes.ts";
import {
  validateDecisionJournalQueryInput,
  validateDecisionJournalQueryResult,
  validateFoundationCompatibilityForQuery,
  validateJournalEngineAvailabilityForQuery,
  validateWorkspaceIsolationForQueryResult,
} from "./decisionJournalQueryValidation.ts";

export const DECISION_JOURNAL_QUERY_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_JOURNAL_QUERY_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_JOURNAL_QUERY_SELF_MANIFEST = Object.freeze({
  stageId: "APP-8/3",
  title: "Decision Journal Query + Ordering Layer",
  goal: "Read-only ordered decision journal read model over APP-8:2 entries.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_JOURNAL_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-journal/decisionJournalQueryTypes.ts",
    "frontend/app/lib/decision-journal/decisionJournalQueryValidation.ts",
    "frontend/app/lib/decision-journal/decisionJournalOrdering.ts",
    "frontend/app/lib/decision-journal/decisionJournalQueryFilters.ts",
    "frontend/app/lib/decision-journal/decisionJournalReadModel.ts",
    "frontend/app/lib/decision-journal/decisionJournalQuery.ts",
    "frontend/app/lib/decision-journal/decisionJournalQueryRunner.ts",
    "frontend/app/lib/decision-journal/decisionJournalQuery.test.ts",
    "docs/app-8-3-decision-journal-query-ordering.md",
  ]),
  forbiddenPatterns: DECISION_JOURNAL_QUERY_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-8/1", "APP-8/2"]),
  runtimePath: "library-only" as const,
  tags: DECISION_JOURNAL_QUERY_TAGS,
} satisfies StageManifest);

export const DECISION_JOURNAL_QUERY_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  entryDerivedOnly: true,
  noEntryCreation: true,
  noEntryMutation: true,
  noArchiveMutation: true,
  noPersistence: true,
  noVisualization: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noDecisionTimelineIntegration: true,
} as const);

let queryLayerInitialized = false;
let queryLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionJournalQueryLayer(
  timestamp: string = queryLayerTimestamp
): DecisionJournalQueryEngineState {
  queryLayerInitialized = true;
  queryLayerTimestamp = timestamp;
  return getDecisionJournalQueryEngineState(timestamp);
}

export function isDecisionJournalQueryLayerInitialized(): boolean {
  return queryLayerInitialized;
}

export function getDecisionJournalQueryEngineState(
  timestamp: string = queryLayerTimestamp
): DecisionJournalQueryEngineState {
  return Object.freeze({
    engineId: "decision-journal-query-engine",
    contractVersion: DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
    initialized: queryLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionJournalQueryLayerForTests(): void {
  queryLayerInitialized = false;
  queryLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertQueryLayerReady(): DecisionJournalQueryResponse | null {
  if (!isDecisionJournalPlatformInitialized()) {
    return queryFailure("APP-8:1 Decision Journal Foundation is not initialized.");
  }
  const engineAvailability = validateJournalEngineAvailabilityForQuery();
  if (!engineAvailability.valid) {
    return queryFailure(engineAvailability.issues[0]?.message ?? "APP-8:2 engine unavailable.");
  }
  if (!isDecisionJournalQueryLayerInitialized()) {
    return queryFailure("Decision Journal Query Layer is not initialized.");
  }
  return null;
}

function executeDecisionJournalQuery(input: DecisionJournalQueryInput): DecisionJournalQueryResponse {
  const readiness = assertQueryLayerReady();
  if (readiness) {
    return readiness;
  }

  const validation = validateDecisionJournalQueryInput(input);
  if (!validation.valid) {
    return queryFailure(validation.issues[0]?.message ?? "Decision journal query validation failed.");
  }

  const result = buildDecisionJournalReadModel(input.filters, input.generatedAt ?? queryLayerTimestamp);
  const resultValidation = validateDecisionJournalQueryResult(result);
  if (!resultValidation.valid) {
    return queryFailure(resultValidation.issues[0]?.message ?? "Decision journal query result validation failed.");
  }

  const isolation = validateWorkspaceIsolationForQueryResult(result.entries, input.filters.workspaceId);
  if (!isolation.valid) {
    return queryFailure(isolation.issues[0]?.message ?? "Workspace isolation validation failed.");
  }

  return querySuccess("Decision journal query executed.", result);
}

export function queryDecisionJournal(filters: DecisionJournalQueryFilters): DecisionJournalQueryResponse {
  return executeDecisionJournalQuery(Object.freeze({ filters: Object.freeze({ ...filters }) }));
}

export function getDecisionJournalEntriesOrdered(
  filters: DecisionJournalQueryFilters
): readonly DecisionJournalQueryResult["entries"] {
  const response = queryDecisionJournal(filters);
  return response.data?.entries ?? Object.freeze([]);
}

export function getDecisionJournalRange(
  workspaceId: DecisionJournalQueryFilters["workspaceId"],
  updatedAtFrom?: string,
  updatedAtTo?: string,
  direction?: DecisionJournalQueryFilters["direction"]
): DecisionJournalQueryResponse {
  return queryDecisionJournal(
    Object.freeze({
      workspaceId,
      updatedAtFrom,
      updatedAtTo,
      direction,
    })
  );
}

export function getDecisionJournalSummary(
  filters: DecisionJournalQueryFilters
): DecisionJournalQuerySummary {
  const response = queryDecisionJournal(filters);
  if (response.data) {
    return response.data.summary;
  }
  return buildDecisionJournalSummary(Object.freeze([]));
}

export { buildDecisionJournalReadModel, buildDecisionJournalSummary };

export function validateDecisionJournalQuery(
  input: DecisionJournalQueryInput
): ReturnType<typeof validateDecisionJournalQueryInput> {
  const issues = [...validateDecisionJournalQueryInput(input).issues];
  const foundation = validateFoundationCompatibilityForQuery(input.generatedAt ?? queryLayerTimestamp);
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  const engine = validateJournalEngineAvailabilityForQuery();
  if (!engine.valid) {
    issues.push(...engine.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function getDecisionJournalQueryContract() {
  return Object.freeze({
    contractVersion: DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
    supportedFilters: DECISION_JOURNAL_QUERY_FILTER_KEYS,
    supportedOrderFields: DECISION_JOURNAL_QUERY_ORDER_FIELDS,
    readOnly: true as const,
  });
}

export { runDecisionJournalQueryCertification } from "./decisionJournalQueryRunner.ts";

export const DECISION_JOURNAL_QUERY_VERSION = DECISION_JOURNAL_QUERY_CONTRACT_VERSION;
export const DECISION_JOURNAL_QUERY_OWNER = "decision-journal-query-layer";

export const DecisionJournalQueryLayer = Object.freeze({
  initializeDecisionJournalQueryLayer,
  isDecisionJournalQueryLayerInitialized,
  getDecisionJournalQueryEngineState,
  queryDecisionJournal,
  getDecisionJournalEntriesOrdered,
  getDecisionJournalRange,
  getDecisionJournalSummary,
  buildDecisionJournalReadModel,
  validateDecisionJournalQuery,
  getDecisionJournalQueryContract,
  version: DECISION_JOURNAL_QUERY_CONTRACT_VERSION,
  tags: DECISION_JOURNAL_QUERY_TAGS,
  mustNotOwn: DECISION_JOURNAL_MUST_NOT_OWN,
});

export { DECISION_JOURNAL_QUERY_TAGS, orderDecisionJournalEntries, applyDecisionJournalQueryFilters };
