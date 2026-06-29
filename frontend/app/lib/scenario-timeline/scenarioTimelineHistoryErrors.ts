/**
 * APP-5:4 — Scenario Timeline History Engine errors.
 */

import { SCENARIO_TIMELINE_HISTORY_ENGINE_ERROR_CODES } from "./scenarioTimelineHistoryConstants.ts";
import type { ScenarioTimelineHistoryResult } from "./scenarioTimelineHistoryTypes.ts";

export { SCENARIO_TIMELINE_HISTORY_ENGINE_ERROR_CODES };

export function historyFailure<T>(reason: string): ScenarioTimelineHistoryResult<T> {
  return Object.freeze({ success: false, reason, data: null, readOnly: true as const });
}

export function historySuccess<T>(reason: string, data: T): ScenarioTimelineHistoryResult<T> {
  return Object.freeze({ success: true, reason, data, readOnly: true as const });
}
