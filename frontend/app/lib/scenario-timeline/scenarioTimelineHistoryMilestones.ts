/**
 * APP-5:4 — Scenario Timeline History milestone detector.
 */

import { SCENARIO_TIMELINE_HISTORY_ENGINE_LIMITS } from "./scenarioTimelineHistoryConstants.ts";
import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type {
  ScenarioTimelineHistoryMilestone,
  ScenarioTimelineHistoryMilestoneKey,
} from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";

const STAGE_MILESTONE_MAP = Object.freeze({
  scenario_created: "history_started",
  scenario_updated: "stage_reached",
  scenario_simulated: "stage_reached",
  decision_made: "decision_recorded",
  execution_started: "execution_started",
  execution_finished: "execution_finished",
  actual_results_recorded: "results_recorded",
  lessons_learned: "lessons_learned",
} as const satisfies Readonly<Record<ScenarioTimelineLifecycleStage, ScenarioTimelineHistoryMilestoneKey>>);

function milestoneId(eventId: string, milestoneKey: string): string {
  return `milestone-${milestoneKey}-${eventId}`;
}

export function detectHistoryMilestones(
  orderedEvents: readonly ScenarioTimelineEvent[]
): readonly ScenarioTimelineHistoryMilestone[] {
  const milestones: ScenarioTimelineHistoryMilestone[] = [];
  const seenStageFirst = new Set<ScenarioTimelineLifecycleStage>();

  for (const event of orderedEvents) {
    if (milestones.length >= SCENARIO_TIMELINE_HISTORY_ENGINE_LIMITS.maxMilestones) {
      break;
    }

    const milestoneKey = STAGE_MILESTONE_MAP[event.stage as keyof typeof STAGE_MILESTONE_MAP];
    const isFirstForStage = !seenStageFirst.has(event.stage);

    if (event.stage === "scenario_updated" && !isFirstForStage) {
      continue;
    }

    if (isFirstForStage) {
      seenStageFirst.add(event.stage);
    } else if (event.stage !== "scenario_updated") {
      continue;
    }

    milestones.push(
      Object.freeze({
        milestoneId: milestoneId(event.eventId, milestoneKey),
        milestoneKey,
        stage: event.stage,
        eventId: event.eventId,
        timestamp: event.timestamp,
        title: event.title,
        summary: event.summary,
        readOnly: true as const,
      })
    );
  }

  const terminalEvent = orderedEvents.find((event) => event.stage === "lessons_learned");
  if (terminalEvent && milestones.every((entry) => entry.milestoneKey !== "history_completed")) {
    milestones.push(
      Object.freeze({
        milestoneId: milestoneId(terminalEvent.eventId, "history_completed"),
        milestoneKey: "history_completed",
        stage: terminalEvent.stage,
        eventId: terminalEvent.eventId,
        timestamp: terminalEvent.timestamp,
        title: "History completed",
        summary: "Scenario timeline history reached terminal lifecycle stage.",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze(milestones);
}

export const ScenarioTimelineHistoryMilestones = Object.freeze({
  detectHistoryMilestones,
});
