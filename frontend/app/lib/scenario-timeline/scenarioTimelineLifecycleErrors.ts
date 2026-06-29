/**
 * APP-5:3 — Scenario Timeline Lifecycle Engine errors.
 */

import { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_ERROR_CODES } from "./scenarioTimelineLifecycleConstants.ts";

export { SCENARIO_TIMELINE_LIFECYCLE_ENGINE_ERROR_CODES };

export type ScenarioTimelineLifecycleEngineError = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export function createScenarioTimelineLifecycleEngineError(
  code: string,
  message: string,
  field?: string
): ScenarioTimelineLifecycleEngineError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function scenarioTimelineLifecycleEngineErrorFromCode(
  code: keyof typeof SCENARIO_TIMELINE_LIFECYCLE_ENGINE_ERROR_CODES,
  message: string,
  field?: string
): ScenarioTimelineLifecycleEngineError {
  return createScenarioTimelineLifecycleEngineError(
    SCENARIO_TIMELINE_LIFECYCLE_ENGINE_ERROR_CODES[code],
    message,
    field
  );
}
