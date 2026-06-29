/**
 * APP-7:3 — Business Timeline Query + Ordering Layer.
 * Read-only gateway over APP-7:2 BusinessEngineEvent records.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { BUSINESS_TIMELINE_MUST_NOT_OWN } from "./businessTimelineConstants.ts";
import {
  isBusinessTimelinePlatformInitialized,
} from "./businessTimelineFoundation.ts";
import { isBusinessEventEngineInitialized, BUSINESS_EVENT_ENGINE_SELF_MANIFEST } from "./businessEventEngine.ts";
import { orderBusinessTimelineEvents } from "./businessTimelineOrdering.ts";
import { applyBusinessTimelineQueryFilters } from "./businessTimelineQueryFilters.ts";
import {
  buildBusinessTimelineReadModel,
  buildBusinessTimelineSummary,
} from "./businessTimelineReadModel.ts";
import {
  BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
  BUSINESS_TIMELINE_QUERY_FILTER_KEYS,
  BUSINESS_TIMELINE_QUERY_FORBIDDEN_PATTERNS,
  BUSINESS_TIMELINE_QUERY_ORDER_FIELDS,
  BUSINESS_TIMELINE_QUERY_TAGS,
  queryFailure,
  querySuccess,
  type BusinessTimelineQueryEngineState,
  type BusinessTimelineQueryFilters,
  type BusinessTimelineQueryInput,
  type BusinessTimelineQueryResponse,
  type BusinessTimelineQueryResult,
  type BusinessTimelineQuerySummary,
} from "./businessTimelineQueryTypes.ts";
import {
  validateBusinessTimelineQueryInput,
  validateBusinessTimelineQueryResult,
  validateEventEngineAvailabilityForQuery,
  validateFoundationCompatibilityForQuery,
  validateWorkspaceIsolationForQueryResult,
} from "./businessTimelineQueryValidation.ts";

export const BUSINESS_TIMELINE_QUERY_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BUSINESS_TIMELINE_QUERY_FORBIDDEN_PATTERNS,
] as const);

export const BUSINESS_TIMELINE_QUERY_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/3",
  title: "Business Timeline Query + Ordering Layer",
  goal: "Read-only ordered business timeline read model over APP-7:2 events.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...BUSINESS_EVENT_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/business-timeline/businessTimelineQueryTypes.ts",
    "frontend/app/lib/business-timeline/businessTimelineQueryValidation.ts",
    "frontend/app/lib/business-timeline/businessTimelineOrdering.ts",
    "frontend/app/lib/business-timeline/businessTimelineQueryFilters.ts",
    "frontend/app/lib/business-timeline/businessTimelineReadModel.ts",
    "frontend/app/lib/business-timeline/businessTimelineQuery.ts",
    "frontend/app/lib/business-timeline/businessTimelineQueryRunner.ts",
    "frontend/app/lib/business-timeline/businessTimelineQuery.test.ts",
    "docs/app-7-3-business-timeline-query-ordering.md",
  ]),
  forbiddenPatterns: BUSINESS_TIMELINE_QUERY_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-7/1", "APP-7/2"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_TIMELINE_QUERY_TAGS,
} satisfies StageManifest);

export const BUSINESS_TIMELINE_QUERY_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  readOnlyGateway: true,
  eventDerivedOnly: true,
  noEventCreation: true,
  noEventMutation: true,
  noArchiveMutation: true,
  noPersistence: true,
  noVisualization: true,
  noReact: true,
  noDashboardIntegration: true,
  noAssistantIntegration: true,
  noScenarioCoupling: true,
  noDecisionCoupling: true,
} as const);

let queryLayerInitialized = false;
let queryLayerTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeBusinessTimelineQueryLayer(
  timestamp: string = queryLayerTimestamp
): BusinessTimelineQueryEngineState {
  queryLayerInitialized = true;
  queryLayerTimestamp = timestamp;
  return getBusinessTimelineQueryEngineState(timestamp);
}

export function isBusinessTimelineQueryLayerInitialized(): boolean {
  return queryLayerInitialized;
}

export function getBusinessTimelineQueryEngineState(
  timestamp: string = queryLayerTimestamp
): BusinessTimelineQueryEngineState {
  return Object.freeze({
    engineId: "business-timeline-query-engine",
    contractVersion: BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
    initialized: queryLayerInitialized,
    timestamp,
    readOnly: true as const,
  });
}

export function resetBusinessTimelineQueryLayerForTests(): void {
  queryLayerInitialized = false;
  queryLayerTimestamp = "2026-01-01T00:00:00.000Z";
}

function assertQueryLayerReady(): BusinessTimelineQueryResponse | null {
  if (!isBusinessTimelinePlatformInitialized()) {
    return queryFailure("APP-7:1 Business Timeline Foundation is not initialized.");
  }
  const engineAvailability = validateEventEngineAvailabilityForQuery();
  if (!engineAvailability.valid) {
    return queryFailure(engineAvailability.issues[0]?.message ?? "APP-7:2 engine unavailable.");
  }
  if (!isBusinessTimelineQueryLayerInitialized()) {
    return queryFailure("Business Timeline Query Layer is not initialized.");
  }
  return null;
}

function executeBusinessTimelineQuery(input: BusinessTimelineQueryInput): BusinessTimelineQueryResponse {
  const readiness = assertQueryLayerReady();
  if (readiness) {
    return readiness;
  }

  const validation = validateBusinessTimelineQueryInput(input);
  if (!validation.valid) {
    return queryFailure(validation.issues[0]?.message ?? "Business timeline query validation failed.");
  }

  const result = buildBusinessTimelineReadModel(input.filters, input.generatedAt ?? queryLayerTimestamp);
  const resultValidation = validateBusinessTimelineQueryResult(result);
  if (!resultValidation.valid) {
    return queryFailure(resultValidation.issues[0]?.message ?? "Business timeline query result validation failed.");
  }

  const isolation = validateWorkspaceIsolationForQueryResult(result.events, input.filters.workspaceId);
  if (!isolation.valid) {
    return queryFailure(isolation.issues[0]?.message ?? "Workspace isolation validation failed.");
  }

  return querySuccess("Business timeline query executed.", result);
}

export function queryBusinessTimeline(filters: BusinessTimelineQueryFilters): BusinessTimelineQueryResponse {
  return executeBusinessTimelineQuery(Object.freeze({ filters: Object.freeze({ ...filters }) }));
}

export function getBusinessTimelineOrderedEvents(
  filters: BusinessTimelineQueryFilters
): readonly BusinessTimelineQueryResult["events"] {
  const response = queryBusinessTimeline(filters);
  return response.data?.events ?? Object.freeze([]);
}

export function getBusinessTimelineRange(
  workspaceId: BusinessTimelineQueryFilters["workspaceId"],
  occurredFrom?: string,
  occurredTo?: string,
  direction?: BusinessTimelineQueryFilters["direction"]
): BusinessTimelineQueryResponse {
  return queryBusinessTimeline(
    Object.freeze({
      workspaceId,
      occurredFrom,
      occurredTo,
      direction,
    })
  );
}

export function getBusinessTimelineSummary(
  filters: BusinessTimelineQueryFilters
): BusinessTimelineQuerySummary {
  const response = queryBusinessTimeline(filters);
  if (response.data) {
    return response.data.summary;
  }
  return buildBusinessTimelineSummary(Object.freeze([]));
}

export { buildBusinessTimelineReadModel, buildBusinessTimelineSummary };

export function validateBusinessTimelineQuery(input: BusinessTimelineQueryInput): ReturnType<typeof validateBusinessTimelineQueryInput> {
  const issues = [...validateBusinessTimelineQueryInput(input).issues];
  const foundation = validateFoundationCompatibilityForQuery(input.generatedAt ?? queryLayerTimestamp);
  if (!foundation.valid) {
    issues.push(...foundation.issues);
  }
  const engine = validateEventEngineAvailabilityForQuery();
  if (!engine.valid) {
    issues.push(...engine.issues);
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function getBusinessTimelineQueryContract() {
  return Object.freeze({
    contractVersion: BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
    supportedFilters: BUSINESS_TIMELINE_QUERY_FILTER_KEYS,
    supportedOrderFields: BUSINESS_TIMELINE_QUERY_ORDER_FIELDS,
    readOnly: true as const,
  });
}

export { runBusinessTimelineQueryCertification } from "./businessTimelineQueryRunner.ts";

export const BUSINESS_TIMELINE_QUERY_VERSION = BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION;
export const BUSINESS_TIMELINE_QUERY_OWNER = "business-timeline-query-layer";

export const BusinessTimelineQueryLayer = Object.freeze({
  initializeBusinessTimelineQueryLayer,
  isBusinessTimelineQueryLayerInitialized,
  getBusinessTimelineQueryEngineState,
  queryBusinessTimeline,
  getBusinessTimelineOrderedEvents,
  getBusinessTimelineRange,
  getBusinessTimelineSummary,
  buildBusinessTimelineReadModel,
  validateBusinessTimelineQuery,
  getBusinessTimelineQueryContract,
  version: BUSINESS_TIMELINE_QUERY_CONTRACT_VERSION,
  tags: BUSINESS_TIMELINE_QUERY_TAGS,
  mustNotOwn: BUSINESS_TIMELINE_MUST_NOT_OWN,
});

export { BUSINESS_TIMELINE_QUERY_TAGS, orderBusinessTimelineEvents, applyBusinessTimelineQueryFilters };
