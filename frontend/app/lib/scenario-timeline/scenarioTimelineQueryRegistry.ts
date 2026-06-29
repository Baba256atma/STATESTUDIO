/**
 * APP-5:5 — Scenario Timeline Query registry.
 */

import {
  SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_QUERY_ENGINE_LIMITS,
} from "./scenarioTimelineQueryConstants.ts";
import { queryFailure, querySuccess } from "./scenarioTimelineQueryErrors.ts";
import type {
  ScenarioTimelineQueryRegistrySnapshot,
  ScenarioTimelineQueryResponse,
  ScenarioTimelineQueryResult,
} from "./scenarioTimelineQueryTypes.ts";

const queryRegistry = new Map<string, ScenarioTimelineQueryResult>();

export function resetScenarioTimelineQueryRegistryForTests(): void {
  queryRegistry.clear();
}

export function registerTimelineQueryResult(result: ScenarioTimelineQueryResult): ScenarioTimelineQueryResponse {
  if (queryRegistry.size >= SCENARIO_TIMELINE_QUERY_ENGINE_LIMITS.maxRegisteredQueries) {
    return queryFailure("Timeline query registry is full.");
  }
  queryRegistry.set(result.queryId, result);
  return querySuccess("Timeline query registered.", result);
}

export function getRegisteredTimelineQuery(queryId: string): ScenarioTimelineQueryResult | null {
  return queryRegistry.get(queryId) ?? null;
}

export function getTimelineQueryRegistry(): ScenarioTimelineQueryRegistrySnapshot {
  return Object.freeze({
    registryVersion: SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
    registeredQueryCount: queryRegistry.size,
    queryIds: Object.freeze([...queryRegistry.keys()]),
    readOnly: true as const,
  });
}

export const ScenarioTimelineQueryRegistry = Object.freeze({
  registerTimelineQueryResult,
  getRegisteredTimelineQuery,
  getTimelineQueryRegistry,
});
