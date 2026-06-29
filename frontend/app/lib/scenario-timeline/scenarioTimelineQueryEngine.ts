/**
 * APP-5:5 — Scenario Timeline Query Engine.
 * Read-only gateway for canonical timeline information retrieval.
 */

import {
  buildTimelineQueryResult,
  resetScenarioTimelineQueryIdSequenceForTests,
  validateScenarioTimelineQueryResult,
} from "./scenarioTimelineQueryBuilder.ts";
import {
  SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_QUERY_ENGINE_TAGS,
} from "./scenarioTimelineQueryConstants.ts";
import { queryFailure, querySuccess } from "./scenarioTimelineQueryErrors.ts";
import { getTimelineQueryContract } from "./scenarioTimelineQueryContracts.ts";
import {
  getTimelineQueryRegistry,
  registerTimelineQueryResult,
  resetScenarioTimelineQueryRegistryForTests,
} from "./scenarioTimelineQueryRegistry.ts";
import { validateTimelineQueryInput } from "./scenarioTimelineQueryValidator.ts";
import type {
  ScenarioTimelineQueryEngineState,
  ScenarioTimelineQueryFilters,
  ScenarioTimelineQueryInput,
  ScenarioTimelineQueryResponse,
} from "./scenarioTimelineQueryTypes.ts";

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeScenarioTimelineQueryEngine(
  timestamp: string = engineTimestamp
): ScenarioTimelineQueryEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getScenarioTimelineQueryEngineState(timestamp);
}

export function isScenarioTimelineQueryEngineInitialized(): boolean {
  return engineInitialized;
}

export function getScenarioTimelineQueryEngineState(
  timestamp: string = engineTimestamp
): ScenarioTimelineQueryEngineState {
  const registry = getTimelineQueryRegistry();
  return Object.freeze({
    engineId: "scenario-timeline-query-engine",
    contractVersion: SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredQueryCount: registry.registeredQueryCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetScenarioTimelineQueryEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetScenarioTimelineQueryRegistryForTests();
  resetScenarioTimelineQueryIdSequenceForTests();
}

function executeTimelineQuery(input: ScenarioTimelineQueryInput): ScenarioTimelineQueryResponse {
  if (!isScenarioTimelineQueryEngineInitialized()) {
    return queryFailure("Scenario Timeline Query Engine is not initialized.");
  }

  const validation = validateTimelineQueryInput(input);
  if (!validation.valid) {
    return queryFailure(validation.issues[0]?.message ?? "Timeline query validation failed.");
  }

  const result = buildTimelineQueryResult(input, engineTimestamp);
  const registration = registerTimelineQueryResult(result);
  if (!registration.success || !registration.data) {
    return queryFailure(registration.reason);
  }

  return querySuccess("Timeline query executed.", registration.data);
}

function withScenarioFilters(
  filters: ScenarioTimelineQueryFilters,
  queryType: ScenarioTimelineQueryInput["queryType"]
): ScenarioTimelineQueryInput {
  return Object.freeze({ queryType, filters: Object.freeze({ ...filters }) });
}

export function queryScenarioTimeline(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "scenario_timeline"));
}

export function queryTimelineEvents(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "timeline_events"));
}

export function queryTimelineHistory(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "timeline_history"));
}

export function queryTimelineLifecycle(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "timeline_lifecycle"));
}

export function queryTimelineMilestones(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "timeline_milestones"));
}

export function queryTimelineSummary(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "timeline_summary"));
}

export function queryTimelineProgress(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "timeline_progress"));
}

export function queryTimelineStatus(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "timeline_status"));
}

export function queryLatestTimelineEvent(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "latest_event"));
}

export function queryTimelineByStage(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "by_stage"));
}

export function queryTimelineByDate(filters: ScenarioTimelineQueryFilters): ScenarioTimelineQueryResponse {
  return executeTimelineQuery(withScenarioFilters(filters, "by_date"));
}

export function validateTimelineQuery(input: ScenarioTimelineQueryInput): ReturnType<typeof validateTimelineQueryInput> {
  return validateTimelineQueryInput(input);
}

export { getTimelineQueryRegistry, validateScenarioTimelineQueryResult };
export { getTimelineQueryContract };
export { certifyScenarioTimelineQueryEngine } from "./scenarioTimelineQueryCertification.ts";

export const SCENARIO_TIMELINE_QUERY_ENGINE_VERSION = SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION;
export const SCENARIO_TIMELINE_QUERY_ENGINE_OWNER = "scenario-timeline-query-engine";
export { SCENARIO_TIMELINE_QUERY_ENGINE_TAGS };

export const ScenarioTimelineQueryEngine = Object.freeze({
  initializeScenarioTimelineQueryEngine,
  isScenarioTimelineQueryEngineInitialized,
  getScenarioTimelineQueryEngineState,
  queryScenarioTimeline,
  queryTimelineEvents,
  queryTimelineHistory,
  queryTimelineLifecycle,
  queryTimelineMilestones,
  queryTimelineSummary,
  queryTimelineProgress,
  queryTimelineStatus,
  queryLatestTimelineEvent,
  queryTimelineByStage,
  queryTimelineByDate,
  validateTimelineQuery,
  getTimelineQueryRegistry,
  getTimelineQueryContract,
});
