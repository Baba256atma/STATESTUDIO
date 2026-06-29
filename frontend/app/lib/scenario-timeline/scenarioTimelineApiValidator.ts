/**
 * APP-5:6 — Scenario Timeline API validator.
 */

import type { CreateTimelineEventInput, ScenarioTimelineQueryFilters } from "./scenarioTimelineApiTypes.ts";
import type { ScenarioTimelineApiError } from "./scenarioTimelineApiTypes.ts";
import { isScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformValidation.ts";

export function validateScenarioTimelineApiScenarioRef(input: {
  scenarioId?: string;
  workspaceId?: string;
}): readonly ScenarioTimelineApiError[] {
  const errors: ScenarioTimelineApiError[] = [];
  if (!input.scenarioId || input.scenarioId.trim().length === 0) {
    errors.push(Object.freeze({ code: "missing_field", message: "scenarioId is required.", field: "scenarioId", readOnly: true as const }));
  }
  if (!input.workspaceId || input.workspaceId.trim().length === 0) {
    errors.push(Object.freeze({ code: "missing_field", message: "workspaceId is required.", field: "workspaceId", readOnly: true as const }));
  }
  return Object.freeze(errors);
}

export function validateCreateScenarioTimelineEventInput(input: CreateTimelineEventInput): readonly ScenarioTimelineApiError[] {
  const errors = [...validateScenarioTimelineApiScenarioRef(input)];
  if (!input.timestamp || input.timestamp.trim().length === 0) {
    errors.push(Object.freeze({ code: "missing_field", message: "timestamp is required.", field: "timestamp", readOnly: true as const }));
  }
  if (!input.createdBy || input.createdBy.trim().length === 0) {
    errors.push(Object.freeze({ code: "missing_field", message: "createdBy is required.", field: "createdBy", readOnly: true as const }));
  }
  if (!isScenarioTimelineLifecycleStage(input.stage)) {
    errors.push(Object.freeze({ code: "invalid_field", message: "Invalid lifecycle stage.", field: "stage", readOnly: true as const }));
  }
  return Object.freeze(errors);
}

export function validateScenarioTimelineQueryFilters(filters: ScenarioTimelineQueryFilters): readonly ScenarioTimelineApiError[] {
  const errors: ScenarioTimelineApiError[] = [];
  if (!filters.scenarioId && !filters.workspaceId && !filters.eventId && !filters.historyId) {
    errors.push(
      Object.freeze({
        code: "missing_filter",
        message: "At least one of scenarioId, workspaceId, eventId, or historyId is required.",
        field: "filters",
        readOnly: true as const,
      })
    );
  }
  return Object.freeze(errors);
}

export const ScenarioTimelineApiValidator = Object.freeze({
  validateScenarioTimelineApiScenarioRef,
  validateCreateScenarioTimelineEventInput,
  validateScenarioTimelineQueryFilters,
});
