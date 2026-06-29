/**
 * APP-5:5 — Scenario Timeline Query selector and projection engine.
 */

import { SCENARIO_TIMELINE_QUERY_ENGINE_LIMITS } from "./scenarioTimelineQueryConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineLifecycleStatus } from "./scenarioTimelineLifecycleTypes.ts";
import type { ScenarioTimelineQuerySourceContext } from "./scenarioTimelineQuerySources.ts";
import type { ScenarioTimelineQueryFilters, ScenarioTimelineQueryType } from "./scenarioTimelineQueryTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

export function selectEventsForQueryType(
  queryType: ScenarioTimelineQueryType,
  context: ScenarioTimelineQuerySourceContext,
  filteredEvents: readonly ScenarioTimelineEvent[]
): readonly ScenarioTimelineEvent[] {
  const events = filteredEvents.slice(0, SCENARIO_TIMELINE_QUERY_ENGINE_LIMITS.maxResultEvents);

  switch (queryType) {
    case "latest_event":
      return Object.freeze(events.length > 0 ? [events.at(-1)!] : []);
    case "first_event":
      return Object.freeze(events.length > 0 ? [events[0]!] : []);
    case "by_stage":
    case "by_date":
    case "timeline_events":
    case "by_event_id":
    case "scenario_timeline":
    case "timeline_history":
    case "timeline_lifecycle":
    case "timeline_milestones":
    case "timeline_summary":
    case "timeline_progress":
    case "timeline_status":
    case "by_history_id":
      return events;
    default:
      return events;
  }
}

export function projectTimelineQueryFields(input: {
  queryType: ScenarioTimelineQueryType;
  filters: ScenarioTimelineQueryFilters;
  context: ScenarioTimelineQuerySourceContext;
  events: readonly ScenarioTimelineEvent[];
}): Readonly<{
  progress: number | null;
  status: ScenarioTimelineLifecycleStatus | null;
  completedStages: readonly ScenarioTimelineLifecycleStage[];
  remainingStages: readonly ScenarioTimelineLifecycleStage[];
  latestEvent: ScenarioTimelineEvent | null;
  firstEvent: ScenarioTimelineEvent | null;
  duration: number | null;
  readOnly: true;
}> {
  const scenarioId = input.context.history?.scenarioId ?? input.filters.scenarioId ?? null;
  const progress = scenarioId !== null ? input.context.lifecycle?.progressPercentage ?? null : null;
  const status = scenarioId !== null ? input.context.lifecycle?.status ?? null : null;

  return Object.freeze({
    progress,
    status,
    completedStages: input.context.lifecycle?.completedStages ?? Object.freeze([]),
    remainingStages: input.context.lifecycle?.remainingStages ?? Object.freeze([]),
    latestEvent: input.events.at(-1) ?? null,
    firstEvent: input.events[0] ?? null,
    duration: input.context.history?.duration ?? null,
    readOnly: true as const,
  });
}

export const ScenarioTimelineQuerySelectors = Object.freeze({
  selectEventsForQueryType,
  projectTimelineQueryFields,
});
