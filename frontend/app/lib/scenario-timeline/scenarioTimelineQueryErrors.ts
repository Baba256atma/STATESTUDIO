/**
 * APP-5:5 — Scenario Timeline Query Engine errors.
 */

import { SCENARIO_TIMELINE_QUERY_ENGINE_ERROR_CODES } from "./scenarioTimelineQueryConstants.ts";
import type { ScenarioTimelineQueryResponse } from "./scenarioTimelineQueryTypes.ts";

export { SCENARIO_TIMELINE_QUERY_ENGINE_ERROR_CODES };

export function queryFailure(reason: string): ScenarioTimelineQueryResponse {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}

export function querySuccess(reason: string, data: ScenarioTimelineQueryResponse["data"]): ScenarioTimelineQueryResponse {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}
