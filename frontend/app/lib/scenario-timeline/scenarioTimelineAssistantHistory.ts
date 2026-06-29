/**
 * APP-5:7 — Scenario Timeline Assistant history and change builders.
 */

import { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_LIMITS } from "./scenarioTimelineAssistantConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type { ScenarioTimelineAssistantChangeRecord } from "./scenarioTimelineAssistantTypes.ts";

export function buildScenarioTimelineRecentChanges(
  events: readonly ScenarioTimelineEvent[]
): readonly ScenarioTimelineAssistantChangeRecord[] {
  const changes: ScenarioTimelineAssistantChangeRecord[] = [];
  for (let index = 1; index < events.length; index += 1) {
    const previous = events[index - 1]!;
    const current = events[index]!;
    changes.push(
      Object.freeze({
        eventId: current.eventId,
        fromStage: previous.stage,
        toStage: current.stage,
        timestamp: current.timestamp,
        title: current.title,
        summary: current.summary,
        readOnly: true as const,
      })
    );
  }
  return Object.freeze(changes.slice(-SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_LIMITS.maxRecentChanges));
}

export function buildScenarioTimelineHistoryExplanation(input: {
  scenarioId: string;
  events: readonly ScenarioTimelineEvent[];
  duration: number | null;
}): string {
  if (input.events.length === 0) {
    return `Scenario ${input.scenarioId} has no recorded timeline history.`;
  }
  const first = input.events[0]!;
  const last = input.events.at(-1)!;
  const durationText =
    input.duration !== null && input.duration > 0
      ? ` over ${Math.round(input.duration / 1000)} seconds`
      : "";
  return `Scenario ${input.scenarioId} timeline history contains ${input.events.length} event(s) from ${first.stage} to ${last.stage}${durationText}.`;
}

export function describeWhatChanged(changes: readonly ScenarioTimelineAssistantChangeRecord[]): string {
  if (changes.length === 0) {
    return "No timeline changes are recorded yet.";
  }
  const latest = changes.at(-1)!;
  if (latest.fromStage === latest.toStage) {
    return `The latest update repeated stage ${latest.toStage}: ${latest.title}.`;
  }
  return `Timeline moved from ${latest.fromStage ?? "start"} to ${latest.toStage}: ${latest.title}.`;
}

export const ScenarioTimelineAssistantHistoryBuilder = Object.freeze({
  buildScenarioTimelineRecentChanges,
  buildScenarioTimelineHistoryExplanation,
  describeWhatChanged,
});
