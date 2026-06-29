/**
 * APP-5:6 — Scenario Timeline API error translator and response builder.
 */

import {
  SCENARIO_TIMELINE_API_ERROR_CODES,
  SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
  SCENARIO_TIMELINE_API_LAYER_LIMITS,
} from "./scenarioTimelineApiConstants.ts";
import type {
  ScenarioTimelineApiCategory,
  ScenarioTimelineApiDiagnostics,
  ScenarioTimelineApiError,
  ScenarioTimelineApiResponse,
  ScenarioTimelineApiStatus,
  ScenarioTimelineApiWarning,
} from "./scenarioTimelineApiTypes.ts";

let requestSequence = 0;

export function resetScenarioTimelineApiRequestSequenceForTests(): void {
  requestSequence = 0;
}

export function createScenarioTimelineApiRequestId(category: ScenarioTimelineApiCategory): string {
  requestSequence += 1;
  return `timeline-api-${category}-${requestSequence}`;
}

export function translateScenarioTimelineApiError(
  code: string,
  message: string,
  field?: string
): ScenarioTimelineApiError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function translateEngineFailure(message: string, field?: string): ScenarioTimelineApiError {
  return translateScenarioTimelineApiError(
    SCENARIO_TIMELINE_API_ERROR_CODES.engineFailure,
    message,
    field
  );
}

export function buildScenarioTimelineApiResponse<T>(input: {
  success: boolean;
  status?: ScenarioTimelineApiStatus;
  data: T | null;
  category: ScenarioTimelineApiCategory;
  errors?: readonly ScenarioTimelineApiError[];
  warnings?: readonly ScenarioTimelineApiWarning[];
  diagnostics: ScenarioTimelineApiDiagnostics;
  timestamp?: string;
}): ScenarioTimelineApiResponse<T> {
  const requestId = createScenarioTimelineApiRequestId(input.category);
  const timestamp = input.timestamp ?? new Date().toISOString();
  const errors = Object.freeze((input.errors ?? []).slice(0, SCENARIO_TIMELINE_API_LAYER_LIMITS.maxErrors));
  const warnings = Object.freeze((input.warnings ?? []).slice(0, SCENARIO_TIMELINE_API_LAYER_LIMITS.maxWarnings));
  const status: ScenarioTimelineApiStatus =
    input.status ?? (input.success ? (warnings.length > 0 ? "warning" : "ok") : "error");

  return Object.freeze({
    success: input.success,
    status,
    data: input.data,
    errors,
    warnings,
    metadata: Object.freeze({
      requestId,
      timestamp,
      platformVersion: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
      contractVersion: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
      apiVersion: SCENARIO_TIMELINE_API_LAYER_CONTRACT_VERSION,
      category: input.category,
      readOnly: true as const,
    }),
    diagnostics: input.diagnostics,
    readOnly: true as const,
  });
}

export const ScenarioTimelineApiErrors = Object.freeze({
  translateScenarioTimelineApiError,
  translateEngineFailure,
  buildScenarioTimelineApiResponse,
});
