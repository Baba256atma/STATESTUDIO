/**
 * APP-5:6 — Scenario Timeline API facade.
 */

import { SCENARIO_TIMELINE_API_ERROR_CODES } from "./scenarioTimelineApiConstants.ts";
import { buildScenarioTimelineApiResponse, translateScenarioTimelineApiError } from "./scenarioTimelineApiErrors.ts";
import { registerScenarioTimelineApiRequest } from "./scenarioTimelineApiRegistry.ts";
import {
  routeBuildScenarioTimelineLifecycle,
  routeCreateScenarioTimelineEvent,
  routeGetScenarioTimeline,
  routeGetScenarioTimelineHistory,
  routeQueryScenarioTimeline,
} from "./scenarioTimelineApiRouter.ts";
import { ScenarioTimelineApiSources } from "./scenarioTimelineApiSources.ts";
import { validateScenarioTimelineApiCompatibility } from "./scenarioTimelineApiCompatibility.ts";
import { getScenarioTimelineVersion } from "./scenarioTimelineApiVersion.ts";
import { validateScenarioTimelineQueryFilters } from "./scenarioTimelineApiValidator.ts";
import type {
  CreateTimelineEventInput,
  ScenarioTimelineApiHealth,
  ScenarioTimelineApiResponse,
  ScenarioTimelineQueryFilters,
  ScenarioTimelineView,
} from "./scenarioTimelineApiTypes.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineHistory } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycle } from "./scenarioTimelineLifecycleTypes.ts";
import type { ScenarioTimelineQueryResult } from "./scenarioTimelineQueryTypes.ts";

let apiTimestamp = "2026-01-01T00:00:00.000Z";
let apiLayerInitialized = false;

function diagnostics() {
  return ScenarioTimelineApiSources.readScenarioTimelineApiDiagnostics();
}

function ensureApiLayerReady(timestamp: string): ScenarioTimelineApiResponse<null> | null {
  if (!apiLayerInitialized || !ScenarioTimelineApiSources.areScenarioTimelineApiEnginesReady()) {
    return buildScenarioTimelineApiResponse({
      success: false,
      status: "error",
      data: null,
      category: "initialization",
      errors: [
        translateScenarioTimelineApiError(
          SCENARIO_TIMELINE_API_ERROR_CODES.apiNotInitialized,
          "Scenario Timeline API Layer is not initialized."
        ),
      ],
      diagnostics: diagnostics(),
      timestamp,
    });
  }
  return null;
}

function wrapSimpleQuery<T>(
  category: ScenarioTimelineApiResponse<T>["metadata"]["category"],
  filters: ScenarioTimelineQueryFilters,
  resolver: () => T | null,
  timestamp: string
): ScenarioTimelineApiResponse<T> {
  const notReady = ensureApiLayerReady(timestamp);
  if (notReady) {
    return notReady as ScenarioTimelineApiResponse<T>;
  }

  const errors = validateScenarioTimelineQueryFilters(filters);
  if (errors.length > 0 || !filters.scenarioId) {
    const response = buildScenarioTimelineApiResponse<T>({
      success: false,
      status: "error",
      data: null,
      category,
      errors,
      diagnostics: diagnostics(),
      timestamp,
    });
    registerScenarioTimelineApiRequest(response.metadata);
    return response;
  }

  const data = resolver();
  const response = buildScenarioTimelineApiResponse<T>({
    success: data !== null,
    status: data !== null ? "ok" : "error",
    data,
    category,
    errors: data === null ? [translateScenarioTimelineApiError(SCENARIO_TIMELINE_API_ERROR_CODES.scenarioNotFound, "Scenario not found.", "scenarioId")] : [],
    diagnostics: diagnostics(),
    timestamp,
  });
  registerScenarioTimelineApiRequest(response.metadata);
  return response;
}

export function initializeScenarioTimelineApiLayer(timestamp: string = apiTimestamp): ScenarioTimelineApiResponse<ReturnType<typeof diagnostics>> {
  apiTimestamp = timestamp;
  const engineDiagnostics = ScenarioTimelineApiSources.initializeScenarioTimelineApiEngines(timestamp);
  apiLayerInitialized = true;
  const compatibility = validateScenarioTimelineApiCompatibility();
  const response = buildScenarioTimelineApiResponse({
    success: compatibility.compatible,
    status: compatibility.compatible ? (compatibility.warnings.length > 0 ? "warning" : "ok") : "error",
    data: engineDiagnostics,
    category: "initialization",
    errors: compatibility.errors,
    warnings: compatibility.warnings,
    diagnostics: engineDiagnostics,
    timestamp,
  });
  registerScenarioTimelineApiRequest(response.metadata);
  return response;
}

export function isScenarioTimelineApiLayerInitialized(): boolean {
  return apiLayerInitialized;
}

export function resetScenarioTimelineApiLayerForTests(): void {
  apiLayerInitialized = false;
  apiTimestamp = "2026-01-01T00:00:00.000Z";
}

export function initializeScenarioTimeline(timestamp: string = apiTimestamp): ScenarioTimelineApiResponse<ReturnType<typeof diagnostics>> {
  return initializeScenarioTimelineApiLayer(timestamp);
}

export function createScenarioTimelineEvent(input: CreateTimelineEventInput): ScenarioTimelineApiResponse<ScenarioTimelineEvent> {
  const notReady = ensureApiLayerReady(apiTimestamp);
  if (notReady) {
    return notReady as ScenarioTimelineApiResponse<ScenarioTimelineEvent>;
  }
  return routeCreateScenarioTimelineEvent(input, apiTimestamp);
}

export function buildScenarioTimelineLifecycle(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<ScenarioTimelineLifecycle> {
  const notReady = ensureApiLayerReady(apiTimestamp);
  if (notReady) {
    return notReady as ScenarioTimelineApiResponse<ScenarioTimelineLifecycle>;
  }
  return routeBuildScenarioTimelineLifecycle(filters, apiTimestamp);
}

export function getScenarioTimeline(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<ScenarioTimelineView> {
  const notReady = ensureApiLayerReady(apiTimestamp);
  if (notReady) {
    return notReady as ScenarioTimelineApiResponse<ScenarioTimelineView>;
  }
  return routeGetScenarioTimeline(filters, apiTimestamp);
}

export function queryScenarioTimeline(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<ScenarioTimelineQueryResult> {
  const notReady = ensureApiLayerReady(apiTimestamp);
  if (notReady) {
    return notReady as ScenarioTimelineApiResponse<ScenarioTimelineQueryResult>;
  }
  return routeQueryScenarioTimeline(filters, apiTimestamp);
}

export function getScenarioTimelineHistory(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<ScenarioTimelineHistory> {
  const notReady = ensureApiLayerReady(apiTimestamp);
  if (notReady) {
    return notReady as ScenarioTimelineApiResponse<ScenarioTimelineHistory>;
  }
  return routeGetScenarioTimelineHistory(filters, apiTimestamp);
}

export function getScenarioTimelineStatus(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<ScenarioTimelineLifecycle["status"] | null> {
  return wrapSimpleQuery("lifecycle", filters, () =>
    filters.scenarioId ? ScenarioTimelineApiSources.getScenarioStatus(filters.scenarioId) : null
  , apiTimestamp);
}

export function getScenarioTimelineProgress(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<number | null> {
  return wrapSimpleQuery("lifecycle", filters, () =>
    filters.scenarioId ? ScenarioTimelineApiSources.getScenarioProgress(filters.scenarioId) : null
  , apiTimestamp);
}

export function getScenarioTimelineSummary(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<ReturnType<typeof ScenarioTimelineApiSources.getScenarioHistorySummary>> {
  return wrapSimpleQuery("history", filters, () =>
    filters.scenarioId ? ScenarioTimelineApiSources.getScenarioHistorySummary(filters.scenarioId) : null
  , apiTimestamp);
}

export function getScenarioTimelineMilestones(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<ReturnType<typeof ScenarioTimelineApiSources.getScenarioHistoryMilestones>> {
  return wrapSimpleQuery("history", filters, () =>
    filters.scenarioId ? ScenarioTimelineApiSources.getScenarioHistoryMilestones(filters.scenarioId) : null
  , apiTimestamp);
}

export function validateScenarioTimeline(filters: ScenarioTimelineQueryFilters): ScenarioTimelineApiResponse<Readonly<{ valid: boolean; issueCount: number }>> {
  const notReady = ensureApiLayerReady(apiTimestamp);
  if (notReady) {
    return notReady as ScenarioTimelineApiResponse<Readonly<{ valid: boolean; issueCount: number }>>;
  }

  const platform = ScenarioTimelineApiSources.validateScenarioTimelinePlatform(apiTimestamp);
  const queryValidation = ScenarioTimelineApiSources.validateTimelineQuery({
    queryType: "scenario_timeline",
    filters,
  });
  const history = filters.scenarioId ? ScenarioTimelineApiSources.getScenarioHistory(filters.scenarioId) : null;
  const historyValidation = history ? ScenarioTimelineApiSources.validateScenarioHistory(history) : { valid: false, issues: [] as readonly { code: string; message: string }[] };

  const valid = platform.valid && queryValidation.valid && historyValidation.valid;
  const issueCount = platform.issues.length + queryValidation.issues.length + historyValidation.issues.length;

  const response = buildScenarioTimelineApiResponse({
    success: valid,
    status: valid ? "ok" : "warning",
    data: Object.freeze({ valid, issueCount }),
    category: "validation",
    diagnostics: diagnostics(),
    timestamp: apiTimestamp,
  });
  registerScenarioTimelineApiRequest(response.metadata);
  return response;
}

export function getScenarioTimelineHealth(): ScenarioTimelineApiResponse<ScenarioTimelineApiHealth> {
  const engineDiagnostics = diagnostics();
  const healthy = apiLayerInitialized && ScenarioTimelineApiSources.areScenarioTimelineApiEnginesReady();
  const response = buildScenarioTimelineApiResponse({
    success: healthy,
    status: healthy ? "ok" : "error",
    data: Object.freeze({
      healthy,
      status: healthy ? "ok" : "error",
      enginesReady: engineDiagnostics,
      timestamp: apiTimestamp,
      readOnly: true as const,
    }),
    category: "health",
    diagnostics: engineDiagnostics,
    timestamp: apiTimestamp,
  });
  registerScenarioTimelineApiRequest(response.metadata);
  return response;
}

export { getScenarioTimelineVersion };

export const ScenarioTimelineApiFacade = Object.freeze({
  initializeScenarioTimelineApiLayer,
  initializeScenarioTimeline,
  createScenarioTimelineEvent,
  buildScenarioTimelineLifecycle,
  getScenarioTimeline,
  queryScenarioTimeline,
  getScenarioTimelineHistory,
  getScenarioTimelineStatus,
  getScenarioTimelineProgress,
  getScenarioTimelineSummary,
  getScenarioTimelineMilestones,
  validateScenarioTimeline,
  getScenarioTimelineHealth,
  getScenarioTimelineVersion,
});
