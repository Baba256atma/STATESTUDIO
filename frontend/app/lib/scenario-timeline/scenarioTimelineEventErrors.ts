/**
 * APP-5:2 — Scenario Timeline Event Engine errors.
 */

import { SCENARIO_TIMELINE_EVENT_ENGINE_ERROR_CODES } from "./scenarioTimelineEventConstants.ts";
import type { ScenarioTimelineEventEngineError } from "./scenarioTimelineEventTypes.ts";

export { SCENARIO_TIMELINE_EVENT_ENGINE_ERROR_CODES };

export function createScenarioTimelineEventEngineError(
  code: string,
  message: string,
  field?: string
): ScenarioTimelineEventEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function scenarioTimelineEventEngineErrorFromCode(
  code: keyof typeof SCENARIO_TIMELINE_EVENT_ENGINE_ERROR_CODES,
  message: string,
  field?: string
): ScenarioTimelineEventEngineError {
  return createScenarioTimelineEventEngineError(
    SCENARIO_TIMELINE_EVENT_ENGINE_ERROR_CODES[code],
    message,
    field
  );
}
