/**
 * APP-9:3 — Confidence Evolution Query + Ordering Layer.
 * Read-only gateway over APP-9:2 ConfidenceEvolutionEngineRecord records.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { CONFIDENCE_EVOLUTION_MUST_NOT_OWN } from "./confidenceEvolutionConstants.ts";
import { isConfidenceEvolutionPlatformInitialized } from "./confidenceEvolutionFoundation.ts";
import {
  CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST,
  isConfidenceEvolutionEngineInitialized,
} from "./confidenceEvolutionEngine.ts";
import { orderConfidenceRecords } from "./confidenceEvolutionOrdering.ts";
import { applyConfidenceEvolutionQueryFilters } from "./confidenceEvolutionQueryFilters.ts";
import {
  buildConfidenceEvolutionReadModel,
  buildConfidenceEvolutionSummary,
} from "./confidenceEvolutionReadModel.ts";
import {
  CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_QUERY_FILTER_KEYS,
  CONFIDENCE_EVOLUTION_QUERY_FORBIDDEN_PATTERNS,
  CONFIDENCE_EVOLUTION_QUERY_ORDER_FIELDS,
  CONFIDENCE_EVOLUTION_QUERY_TAGS,
  queryFailure,
  querySuccess,
  type ConfidenceEvolutionQueryEngineState,
  type ConfidenceEvolutionQueryFilters,
  type ConfidenceEvolutionQueryInput,
  type ConfidenceEvolutionQueryResponse,
  type ConfidenceEvolutionQueryResult,
  type ConfidenceEvolutionQuerySummary,
} from "./confidenceEvolutionQueryTypes.ts";
import {
  validateConfidenceEngineAvailabilityForQuery,
  validateConfidenceEvolutionQueryInput,
  validateConfidenceEvolutionQueryResult,
  validateFoundationCompatibilityForQuery,
  validateWorkspaceIsolationForQueryResult,
} from "./confidenceEvolutionQueryValidation.ts";

export const CONFIDENCE_EVOLUTION_QUERY_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...CONFIDENCE_EVOLUTION_QUERY_FORBIDDEN_PATTERNS,
] as const);

export const CONFIDENCE_EVOLUTION_QUERY_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/3",
  title: "Confidence Evolution Query + Ordering Layer",
  goal: "Read-only ordered confidence evolution read model over APP-9:2 records.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionQueryTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionQueryValidation.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionOrdering.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionQueryFilters.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionReadModel.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionQuery.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionQueryRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionQuery.test.ts",
    "docs/app-9-3-confidence-evolution-query-ordering.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_QUERY_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-9/1", "APP-9/2"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_QUERY_TAGS,
} satisfies StageManifest);

export const CONFIDENCE_EVOLUTION_QUERY_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  recordDerivedOnly: true,
  noRecordCreation: true,
  noRecordMutation: true,
  noArchiveMutation: true,
  noPersistence: true,
  noTrendAnalysis: true,
  noVisualization: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noDecisionJournalIntegration: true,
  noDecisionTimelineIntegration: true,
} as const);

let queryLayerInitialized = false;
let queryLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeConfidenceEvolutionQueryLayer(
  timestamp: string = queryLayerTimestamp
): ConfidenceEvolutionQueryEngineState {
  queryLayerInitialized = true;
  queryLayerTimestamp = timestamp;
  return getConfidenceEvolutionQueryEngineState(timestamp);
}

export function isConfidenceEvolutionQueryLayerInitialized(): boolean {
  return queryLayerInitialized;
}

export function getConfidenceEvolutionQueryEngineState(
  timestamp: string = queryLayerTimestamp
): ConfidenceEvolutionQueryEngineState {
  return Object.freeze({
    engineId: "confidence-evolution-query-engine",
    contractVersion: CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
    initialized: queryLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetConfidenceEvolutionQueryLayerForTests(): void {
  queryLayerInitialized = false;
  queryLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertQueryLayerReady(): ConfidenceEvolutionQueryResponse | null {
  if (!isConfidenceEvolutionPlatformInitialized()) {
    return queryFailure("APP-9:1 Confidence Evolution Foundation is not initialized.");
  }
  const engineAvailability = validateConfidenceEngineAvailabilityForQuery();
  if (!engineAvailability.valid) {
    return queryFailure(engineAvailability.issues[0]?.message ?? "APP-9:2 engine unavailable.");
  }
  if (!isConfidenceEvolutionQueryLayerInitialized()) {
    return queryFailure("Confidence Evolution Query Layer is not initialized.");
  }
  return null;
}

function executeConfidenceEvolutionQuery(input: ConfidenceEvolutionQueryInput): ConfidenceEvolutionQueryResponse {
  const readiness = assertQueryLayerReady();
  if (readiness) {
    return readiness;
  }

  const validation = validateConfidenceEvolutionQueryInput(input);
  if (!validation.valid) {
    return queryFailure(validation.issues[0]?.message ?? "Confidence evolution query validation failed.");
  }

  const result = buildConfidenceEvolutionReadModel(input.filters, input.generatedAt ?? queryLayerTimestamp);
  const resultValidation = validateConfidenceEvolutionQueryResult(result);
  if (!resultValidation.valid) {
    return queryFailure(resultValidation.issues[0]?.message ?? "Confidence evolution query result validation failed.");
  }

  const isolation = validateWorkspaceIsolationForQueryResult(result.records, input.filters.workspaceId);
  if (!isolation.valid) {
    return queryFailure(isolation.issues[0]?.message ?? "Workspace isolation validation failed.");
  }

  return querySuccess("Confidence evolution query executed.", result);
}

export function queryConfidenceEvolution(filters: ConfidenceEvolutionQueryFilters): ConfidenceEvolutionQueryResponse {
  return executeConfidenceEvolutionQuery(Object.freeze({ filters: Object.freeze({ ...filters }) }));
}

export function getConfidenceRecordsOrdered(
  filters: ConfidenceEvolutionQueryFilters
): readonly ConfidenceEvolutionQueryResult["records"] {
  const response = queryConfidenceEvolution(filters);
  return response.data?.records ?? Object.freeze([]);
}

export function getConfidenceEvolutionRange(
  workspaceId: ConfidenceEvolutionQueryFilters["workspaceId"],
  updatedAtFrom?: string,
  updatedAtTo?: string,
  direction?: ConfidenceEvolutionQueryFilters["direction"]
): ConfidenceEvolutionQueryResponse {
  return queryConfidenceEvolution(
    Object.freeze({
      workspaceId,
      updatedAtFrom,
      updatedAtTo,
      direction,
    })
  );
}

export function getConfidenceEvolutionSummary(
  filters: ConfidenceEvolutionQueryFilters
): ConfidenceEvolutionQuerySummary {
  const response = queryConfidenceEvolution(filters);
  if (response.data) {
    return response.data.summary;
  }
  return buildConfidenceEvolutionSummary(Object.freeze([]));
}

export { buildConfidenceEvolutionReadModel, buildConfidenceEvolutionSummary };

export function validateConfidenceEvolutionQuery(
  input: ConfidenceEvolutionQueryInput
): ReturnType<typeof validateConfidenceEvolutionQueryInput> {
  const issues = [...validateConfidenceEvolutionQueryInput(input).issues];
  const foundation = validateFoundationCompatibilityForQuery(input.generatedAt ?? queryLayerTimestamp);
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  const engine = validateConfidenceEngineAvailabilityForQuery();
  if (!engine.valid) {
    issues.push(...engine.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function getConfidenceEvolutionQueryContract() {
  return Object.freeze({
    contractVersion: CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
    supportedFilters: CONFIDENCE_EVOLUTION_QUERY_FILTER_KEYS,
    supportedOrderFields: CONFIDENCE_EVOLUTION_QUERY_ORDER_FIELDS,
    readOnly: true as const,
  });
}

export { runConfidenceEvolutionQueryCertification } from "./confidenceEvolutionQueryRunner.ts";

export const CONFIDENCE_EVOLUTION_QUERY_VERSION = CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION;
export const CONFIDENCE_EVOLUTION_QUERY_OWNER = "confidence-evolution-query-layer";

export const ConfidenceEvolutionQueryLayer = Object.freeze({
  initializeConfidenceEvolutionQueryLayer,
  isConfidenceEvolutionQueryLayerInitialized,
  getConfidenceEvolutionQueryEngineState,
  queryConfidenceEvolution,
  getConfidenceRecordsOrdered,
  getConfidenceEvolutionRange,
  getConfidenceEvolutionSummary,
  buildConfidenceEvolutionReadModel,
  validateConfidenceEvolutionQuery,
  getConfidenceEvolutionQueryContract,
  version: CONFIDENCE_EVOLUTION_QUERY_CONTRACT_VERSION,
  tags: CONFIDENCE_EVOLUTION_QUERY_TAGS,
  mustNotOwn: CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
});

export { CONFIDENCE_EVOLUTION_QUERY_TAGS, orderConfidenceRecords, applyConfidenceEvolutionQueryFilters };
