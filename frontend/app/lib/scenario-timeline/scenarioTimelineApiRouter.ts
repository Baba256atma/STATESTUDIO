/**
 * APP-5:6 — Scenario Timeline API router.
 */

import { SCENARIO_TIMELINE_API_ERROR_CODES } from "./scenarioTimelineApiConstants.ts";
import { buildScenarioTimelineApiResponse, translateEngineFailure, translateScenarioTimelineApiError } from "./scenarioTimelineApiErrors.ts";
import { registerScenarioTimelineApiRequest } from "./scenarioTimelineApiRegistry.ts";
import { ScenarioTimelineApiSources } from "./scenarioTimelineApiSources.ts";
import {
  validateCreateScenarioTimelineEventInput,
  validateScenarioTimelineApiScenarioRef,
  validateScenarioTimelineQueryFilters,
} from "./scenarioTimelineApiValidator.ts";
import type {
  CreateTimelineEventInput,
  ScenarioTimelineApiCategory,
  ScenarioTimelineApiResponse,
  ScenarioTimelineQueryFilters,
  ScenarioTimelineView,
} from "./scenarioTimelineApiTypes.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";

function diagnostics() {
  return ScenarioTimelineApiSources.readScenarioTimelineApiDiagnostics();
}

function finalize<T>(response: ScenarioTimelineApiResponse<T>): ScenarioTimelineApiResponse<T> {
  registerScenarioTimelineApiRequest(response.metadata);
  return response;
}

function mergeScenarioEvents(
  scenarioId: string,
  newEvent: ScenarioTimelineEvent
): readonly ScenarioTimelineEvent[] {
  const existing = ScenarioTimelineApiSources.getScenarioHistory(scenarioId);
  const prior = existing?.orderedEvents.filter((event) => event.eventId !== newEvent.eventId) ?? [];
  return Object.freeze([...prior, newEvent].sort((left, right) => left.sequenceOrder - right.sequenceOrder));
}

function refreshScenarioProjections(scenarioId: string, events: readonly ScenarioTimelineEvent[]): void {
  const lifecycle = ScenarioTimelineApiSources.buildScenarioLifecycle({ events });
  ScenarioTimelineApiSources.calculateScenarioLifecycle({ events });
  ScenarioTimelineApiSources.calculateScenarioHistory({ events, lifecycle });
}

export function routeCreateScenarioTimelineEvent(
  input: CreateTimelineEventInput,
  timestamp: string
): ScenarioTimelineApiResponse<ScenarioTimelineEvent> {
  const category: ScenarioTimelineApiCategory = "event";
  const validationErrors = validateCreateScenarioTimelineEventInput(input);
  if (validationErrors.length > 0) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors: validationErrors,
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const created = ScenarioTimelineApiSources.createTimelineEvent(input);
  if (!created.success || !created.data) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors: [translateEngineFailure(created.reason)],
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const events = mergeScenarioEvents(input.scenarioId, created.data);
  refreshScenarioProjections(input.scenarioId, events);

  return finalize(
    buildScenarioTimelineApiResponse({
      success: true,
      data: created.data,
      category,
      diagnostics: diagnostics(),
      timestamp,
    })
  );
}

export function routeBuildScenarioTimelineLifecycle(
  filters: ScenarioTimelineQueryFilters,
  timestamp: string
): ScenarioTimelineApiResponse<ReturnType<typeof ScenarioTimelineApiSources.buildScenarioLifecycle>> {
  const category: ScenarioTimelineApiCategory = "lifecycle";
  const errors = validateScenarioTimelineQueryFilters(filters);
  if (errors.length > 0 || !filters.scenarioId) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors: errors.length > 0 ? errors : [translateScenarioTimelineApiError("missing_field", "scenarioId is required.", "scenarioId")],
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const history = ScenarioTimelineApiSources.getScenarioHistory(filters.scenarioId);
  if (!history) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors: [translateScenarioTimelineApiError(SCENARIO_TIMELINE_API_ERROR_CODES.scenarioNotFound, "Scenario history not found.", "scenarioId")],
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const lifecycle = ScenarioTimelineApiSources.buildScenarioLifecycle({ events: history.orderedEvents });
  const calculated = ScenarioTimelineApiSources.calculateScenarioLifecycle({ events: history.orderedEvents });
  if (!calculated.success || !calculated.data) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors: [translateEngineFailure(calculated.reason)],
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  return finalize(
    buildScenarioTimelineApiResponse({
      success: true,
      data: calculated.data,
      category,
      diagnostics: diagnostics(),
      timestamp,
    })
  );
}

export function routeGetScenarioTimeline(
  filters: ScenarioTimelineQueryFilters,
  timestamp: string
): ScenarioTimelineApiResponse<ScenarioTimelineView> {
  const category: ScenarioTimelineApiCategory = "query";
  const errors = validateScenarioTimelineQueryFilters(filters);
  if (errors.length > 0) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors,
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const query = ScenarioTimelineApiSources.queryScenarioTimeline(filters);
  if (!query.success || !query.data) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors: [translateEngineFailure(query.reason)],
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const view = Object.freeze({
    scenarioId: query.data.scenarioId ?? filters.scenarioId ?? "unknown-scenario",
    workspaceId: query.data.workspaceId ?? filters.workspaceId ?? "unknown-workspace",
    events: query.data.events,
    lifecycle: query.data.lifecycle,
    history: query.data.history,
    query: query.data,
    progress: query.data.progress,
    status: query.data.status,
    readOnly: true as const,
  });

  return finalize(
    buildScenarioTimelineApiResponse({
      success: true,
      data: view,
      category,
      diagnostics: diagnostics(),
      timestamp,
    })
  );
}

export function routeQueryScenarioTimeline(
  filters: ScenarioTimelineQueryFilters,
  timestamp: string
): ScenarioTimelineApiResponse<NonNullable<ReturnType<typeof ScenarioTimelineApiSources.queryScenarioTimeline>["data"]>> {
  const category: ScenarioTimelineApiCategory = "query";
  const errors = validateScenarioTimelineQueryFilters(filters);
  if (errors.length > 0) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors,
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const query = ScenarioTimelineApiSources.queryScenarioTimeline(filters);
  return finalize(
    buildScenarioTimelineApiResponse({
      success: query.success,
      status: query.success ? "ok" : "error",
      data: query.data,
      category,
      errors: query.success ? [] : [translateEngineFailure(query.reason)],
      diagnostics: diagnostics(),
      timestamp,
    })
  );
}

export function routeGetScenarioTimelineHistory(
  filters: ScenarioTimelineQueryFilters,
  timestamp: string
): ScenarioTimelineApiResponse<ReturnType<typeof ScenarioTimelineApiSources.getScenarioHistory>> {
  const category: ScenarioTimelineApiCategory = "history";
  const errors = validateScenarioTimelineApiScenarioRef({
    scenarioId: filters.scenarioId,
    workspaceId: filters.workspaceId,
  });
  if (errors.length > 0 || !filters.scenarioId) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors,
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  const history = ScenarioTimelineApiSources.getScenarioHistory(filters.scenarioId);
  if (!history) {
    return finalize(
      buildScenarioTimelineApiResponse({
        success: false,
        status: "error",
        data: null,
        category,
        errors: [translateScenarioTimelineApiError(SCENARIO_TIMELINE_API_ERROR_CODES.scenarioNotFound, "Scenario history not found.", "scenarioId")],
        diagnostics: diagnostics(),
        timestamp,
      })
    );
  }

  return finalize(
    buildScenarioTimelineApiResponse({
      success: true,
      data: history,
      category,
      diagnostics: diagnostics(),
      timestamp,
    })
  );
}

export const ScenarioTimelineApiRouter = Object.freeze({
  routeCreateScenarioTimelineEvent,
  routeBuildScenarioTimelineLifecycle,
  routeGetScenarioTimeline,
  routeQueryScenarioTimeline,
  routeGetScenarioTimelineHistory,
});
