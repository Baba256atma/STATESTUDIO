/**
 * APP-5:5 — Scenario Timeline Query builder.
 */

import { SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION } from "./scenarioTimelineQueryConstants.ts";
import { ScenarioTimelineQuerySources } from "./scenarioTimelineQuerySources.ts";
import { resolveTimelineQueryProjection } from "./scenarioTimelineQueryResolver.ts";
import { validateTimelineQueryResult } from "./scenarioTimelineQueryValidator.ts";
import type {
  ScenarioTimelineQueryInput,
  ScenarioTimelineQueryResult,
  ScenarioTimelineValidationResult,
} from "./scenarioTimelineQueryTypes.ts";

let querySequence = 0;

export function resetScenarioTimelineQueryIdSequenceForTests(): void {
  querySequence = 0;
}

function createQueryId(queryType: string): string {
  querySequence += 1;
  return `timeline-query-${queryType}-${querySequence}`;
}

export function buildTimelineQueryResult(
  input: ScenarioTimelineQueryInput,
  queryTimestamp: string = new Date().toISOString()
): ScenarioTimelineQueryResult {
  const { resolution, projection } = resolveTimelineQueryProjection(input);
  const history = resolution.context.history;
  const lifecycle = resolution.context.lifecycle;
  const scenarioId = history?.scenarioId ?? input.filters.scenarioId ?? projection.firstEvent?.scenarioId ?? null;
  const workspaceId = history?.workspaceId ?? input.filters.workspaceId ?? projection.firstEvent?.workspaceId ?? null;

  const summary =
    scenarioId !== null ? ScenarioTimelineQuerySources.readScenarioHistorySummary(scenarioId) : history?.historySummary ?? null;
  const milestones =
    scenarioId !== null
      ? ScenarioTimelineQuerySources.readScenarioHistoryMilestones(scenarioId)
      : history?.milestones ?? Object.freeze([]);

  return Object.freeze({
    scenarioId,
    workspaceId,
    queryId: createQueryId(input.queryType),
    queryType: input.queryType,
    filters: Object.freeze({ ...input.filters }),
    events: resolution.events,
    history,
    lifecycle,
    summary,
    milestones,
    progress: projection.progress,
    status: projection.status,
    completedStages: projection.completedStages,
    remainingStages: projection.remainingStages,
    latestEvent: projection.latestEvent,
    firstEvent: projection.firstEvent,
    duration: projection.duration,
    validationResult: resolution.validationResult,
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
    queryTimestamp,
    platformVersion: SCENARIO_TIMELINE_QUERY_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function validateScenarioTimelineQueryResult(resultObject: ScenarioTimelineQueryResult): ScenarioTimelineValidationResult {
  return validateTimelineQueryResult(resultObject);
}

export const ScenarioTimelineQueryBuilder = Object.freeze({
  buildTimelineQueryResult,
  validateScenarioTimelineQueryResult,
});
