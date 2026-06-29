/**
 * APP-5:8 — Scenario Timeline Dashboard context validator.
 */

import {
  SCENARIO_TIMELINE_DASHBOARD_CONTEXT_MANDATORY_FIELDS,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_DASHBOARD_VIEW_MODEL_MANDATORY_FIELDS,
} from "./scenarioTimelineDashboardConstants.ts";
import type {
  ScenarioTimelineDashboardContext,
  ScenarioTimelineDashboardIntegrationResult,
  ScenarioTimelineDashboardViewModel,
} from "./scenarioTimelineDashboardTypes.ts";

export function validateScenarioTimelineDashboardContext(
  context: ScenarioTimelineDashboardContext
): ScenarioTimelineDashboardIntegrationResult<{ valid: boolean; missingFields: readonly string[] }> {
  const missingFields = SCENARIO_TIMELINE_DASHBOARD_CONTEXT_MANDATORY_FIELDS.filter(
    (field) => !(field in context)
  );

  const valid =
    missingFields.length === 0 &&
    context.readOnly === true &&
    context.platformVersion === SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION &&
    context.diagnostics.readOnly === true &&
    context.timelineHealth.readOnly === true;

  return Object.freeze({
    success: valid,
    reason: valid ? "Dashboard context is valid." : "Dashboard context validation failed.",
    data: Object.freeze({ valid, missingFields: Object.freeze(missingFields) }),
    readOnly: true as const,
  });
}

export function validateScenarioTimelineDashboardViewModel(
  viewModel: ScenarioTimelineDashboardViewModel
): ScenarioTimelineDashboardIntegrationResult<{ valid: boolean; missingFields: readonly string[] }> {
  const missingFields = SCENARIO_TIMELINE_DASHBOARD_VIEW_MODEL_MANDATORY_FIELDS.filter(
    (field) => !(field in viewModel)
  );

  const valid =
    missingFields.length === 0 &&
    viewModel.readOnly === true &&
    viewModel.metrics.readOnly === true;

  return Object.freeze({
    success: valid,
    reason: valid ? "Dashboard view model is valid." : "Dashboard view model validation failed.",
    data: Object.freeze({ valid, missingFields: Object.freeze(missingFields) }),
    readOnly: true as const,
  });
}

export const ScenarioTimelineDashboardValidator = Object.freeze({
  validateScenarioTimelineDashboardContext,
  validateScenarioTimelineDashboardViewModel,
});
