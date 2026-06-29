/**
 * APP-5:7 — Scenario Timeline Assistant context validator.
 */

import {
  SCENARIO_TIMELINE_ASSISTANT_CONTEXT_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
} from "./scenarioTimelineAssistantConstants.ts";
import type {
  ScenarioTimelineAssistantContext,
  ScenarioTimelineAssistantIntegrationResult,
} from "./scenarioTimelineAssistantTypes.ts";

export function validateScenarioTimelineAssistantContext(
  context: ScenarioTimelineAssistantContext
): ScenarioTimelineAssistantIntegrationResult<{ valid: boolean; missingFields: readonly string[] }> {
  const missingFields = SCENARIO_TIMELINE_ASSISTANT_CONTEXT_MANDATORY_FIELDS.filter(
    (field) => !(field in context)
  );

  const valid =
    missingFields.length === 0 &&
    context.readOnly === true &&
    context.platformVersion === SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION &&
    context.diagnostics.readOnly === true;

  return Object.freeze({
    success: valid,
    reason: valid ? "Assistant context is valid." : "Assistant context validation failed.",
    data: Object.freeze({ valid, missingFields: Object.freeze(missingFields) }),
    readOnly: true as const,
  });
}

export const ScenarioTimelineAssistantValidator = Object.freeze({
  validateScenarioTimelineAssistantContext,
});
