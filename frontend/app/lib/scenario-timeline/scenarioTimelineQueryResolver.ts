/**
 * APP-5:5 — Scenario Timeline Query resolver.
 */

import { applyTimelineQueryFilters } from "./scenarioTimelineQueryFilters.ts";
import {
  areTimelineQuerySourcesReady,
  resolveEventById,
  resolveHistoryByHistoryId,
  resolveQuerySourceContext,
  resolveScenarioIdsForWorkspace,
  ScenarioTimelineQuerySources,
} from "./scenarioTimelineQuerySources.ts";
import { selectEventsForQueryType, projectTimelineQueryFields } from "./scenarioTimelineQuerySelectors.ts";
import { validateTimelineQueryCompatibility } from "./scenarioTimelineQueryCompatibility.ts";
import { validateTimelineQueryInput } from "./scenarioTimelineQueryValidator.ts";
import type { ScenarioTimelineQueryInput, ScenarioTimelineValidationResult } from "./scenarioTimelineQueryTypes.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineQuerySourceContext } from "./scenarioTimelineQuerySources.ts";

export type ScenarioTimelineQueryResolution = Readonly<{
  context: ScenarioTimelineQuerySourceContext;
  events: readonly ScenarioTimelineEvent[];
  validationResult: ScenarioTimelineValidationResult;
  readOnly: true;
}>;

function resolvePrimaryScenarioId(input: ScenarioTimelineQueryInput): string | undefined {
  if (input.filters.scenarioId) {
    return input.filters.scenarioId;
  }
  if (input.filters.historyId) {
    return resolveHistoryByHistoryId(input.filters.historyId)?.scenarioId;
  }
  if (input.filters.eventId) {
    return resolveEventById(input.filters.eventId)?.scenarioId;
  }
  if (input.filters.workspaceId) {
    return resolveScenarioIdsForWorkspace(input.filters.workspaceId)[0];
  }
  return undefined;
}

export function resolveTimelineQuery(input: ScenarioTimelineQueryInput): ScenarioTimelineQueryResolution {
  const issues = [...validateTimelineQueryInput(input).issues];

  if (!areTimelineQuerySourcesReady()) {
    issues.push(
      Object.freeze({
        code: "sources_not_ready",
        message: "APP-5:2, APP-5:3, and APP-5:4 engines must be initialized.",
        readOnly: true as const,
      })
    );
    return Object.freeze({
      context: resolveQuerySourceContext({}),
      events: Object.freeze([]),
      validationResult: Object.freeze({ valid: false, issues: Object.freeze(issues), readOnly: true as const }),
      readOnly: true as const,
    });
  }

  const scenarioId = resolvePrimaryScenarioId(input);
  const context = resolveQuerySourceContext({
    scenarioId,
    historyId: input.filters.historyId,
    eventId: input.filters.eventId,
  });

  const compatibility = validateTimelineQueryCompatibility(context);
  issues.push(...compatibility.issues);

  let baseEvents = context.events;
  if (input.filters.workspaceId && !input.filters.scenarioId) {
    const scenarioIds = resolveScenarioIdsForWorkspace(input.filters.workspaceId);
    baseEvents = Object.freeze(
      scenarioIds.flatMap((id) => ScenarioTimelineQuerySources.resolveHistoryForScenario(id)?.orderedEvents ?? [])
    );
  }

  const filteredEvents = applyTimelineQueryFilters(baseEvents, input.filters);
  const events = selectEventsForQueryType(input.queryType, context, filteredEvents);

  if (
    (input.queryType === "scenario_timeline" || input.queryType === "timeline_history") &&
    input.filters.scenarioId &&
    !context.history
  ) {
    issues.push(
      Object.freeze({
        code: "history_not_found",
        message: `No registered history for scenario: ${input.filters.scenarioId}.`,
        field: "scenarioId",
        readOnly: true as const,
      })
    );
  }

  if (input.queryType === "by_event_id" && input.filters.eventId && events.length === 0) {
    issues.push(
      Object.freeze({
        code: "event_not_found",
        message: `No event found for eventId: ${input.filters.eventId}.`,
        field: "eventId",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    context,
    events,
    validationResult: Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const }),
    readOnly: true as const,
  });
}

export function resolveTimelineQueryProjection(input: ScenarioTimelineQueryInput): Readonly<{
  resolution: ScenarioTimelineQueryResolution;
  projection: ReturnType<typeof projectTimelineQueryFields>;
  readOnly: true;
}> {
  const resolution = resolveTimelineQuery(input);
  const projection = projectTimelineQueryFields({
    queryType: input.queryType,
    filters: input.filters,
    context: resolution.context,
    events: resolution.events,
  });
  return Object.freeze({ resolution, projection, readOnly: true as const });
}

export const ScenarioTimelineQueryResolver = Object.freeze({
  resolveTimelineQuery,
  resolveTimelineQueryProjection,
});
