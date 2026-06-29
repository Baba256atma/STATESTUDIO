/**
 * APP-5:4 — Scenario Timeline History summary builder.
 */

import { SCENARIO_TIMELINE_HISTORY_ENGINE_LIMITS } from "./scenarioTimelineHistoryConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type {
  ScenarioTimelineHistoryMilestone,
  ScenarioTimelineHistorySummary,
} from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

export function calculateHistoryDurationMs(historyStart: string | null, historyEnd: string | null): number {
  if (!historyStart || !historyEnd) {
    return 0;
  }
  const start = Date.parse(historyStart);
  const end = Date.parse(historyEnd);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return 0;
  }
  return end - start;
}

export function buildHistoryNarrative(input: {
  scenarioId: string;
  orderedEvents: readonly ScenarioTimelineEvent[];
  milestones: readonly ScenarioTimelineHistoryMilestone[];
  latestStage: ScenarioTimelineLifecycleStage | null;
}): string {
  if (input.orderedEvents.length === 0) {
    return `Scenario ${input.scenarioId} has no timeline history.`;
  }

  const first = input.orderedEvents[0]!;
  const last = input.orderedEvents.at(-1)!;
  const narrative = [
    `Scenario ${input.scenarioId} timeline history spans ${input.orderedEvents.length} event(s)`,
    `from ${first.stage} to ${last.stage}.`,
    `${input.milestones.length} milestone(s) detected.`,
    input.latestStage ? `Latest stage: ${input.latestStage}.` : "",
  ]
    .filter((part) => part.length > 0)
    .join(" ");

  return narrative.slice(0, SCENARIO_TIMELINE_HISTORY_ENGINE_LIMITS.maxSummaryLength);
}

export function buildScenarioHistorySummary(input: {
  historyId: string;
  scenarioId: string;
  workspaceId: string;
  orderedEvents: readonly ScenarioTimelineEvent[];
  milestones: readonly ScenarioTimelineHistoryMilestone[];
  latestStage: ScenarioTimelineLifecycleStage | null;
  latestEventId: string | null;
  historyStart: string | null;
  historyEnd: string | null;
}): ScenarioTimelineHistorySummary {
  const durationMs = calculateHistoryDurationMs(input.historyStart, input.historyEnd);

  return Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    historyId: input.historyId,
    narrative: buildHistoryNarrative({
      scenarioId: input.scenarioId,
      orderedEvents: input.orderedEvents,
      milestones: input.milestones,
      latestStage: input.latestStage,
    }),
    eventCount: input.orderedEvents.length,
    milestoneCount: input.milestones.length,
    latestStage: input.latestStage,
    latestEventId: input.latestEventId,
    historyStart: input.historyStart,
    historyEnd: input.historyEnd,
    durationMs,
    readOnly: true as const,
  });
}

export const ScenarioTimelineHistorySummaryBuilder = Object.freeze({
  calculateHistoryDurationMs,
  buildHistoryNarrative,
  buildScenarioHistorySummary,
});
