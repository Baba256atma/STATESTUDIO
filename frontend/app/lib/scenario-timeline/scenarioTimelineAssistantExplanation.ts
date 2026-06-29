/**
 * APP-5:7 — Scenario Timeline Assistant explanation builder.
 */

import type {
  ScenarioTimelineAssistantContext,
  ScenarioTimelineAssistantExplanation,
  ScenarioTimelineAssistantIntegrationInput,
} from "./scenarioTimelineAssistantTypes.ts";
import { buildScenarioTimelineHistoryExplanation, describeWhatChanged } from "./scenarioTimelineAssistantHistory.ts";
import { buildScenarioTimelineStatusExplanation } from "./scenarioTimelineAssistantSummary.ts";

export function buildScenarioTimelineExplanation(
  input: ScenarioTimelineAssistantIntegrationInput,
  context: ScenarioTimelineAssistantContext,
  topic: string = "timeline_overview"
): ScenarioTimelineAssistantExplanation {
  let explanation = context.timelineSummary;
  if (topic === "status") {
    explanation = buildScenarioTimelineStatusExplanation({
      scenarioId: input.scenarioId,
      status: context.status,
      currentStage: context.currentStage,
      progress: context.progress,
      isBlocked: context.status === "blocked",
    });
  } else if (topic === "history") {
    explanation = buildScenarioTimelineHistoryExplanation({
      scenarioId: input.scenarioId,
      events: context.timelineHistory,
      duration: context.historyDuration,
    });
  } else if (topic === "changes") {
    explanation = describeWhatChanged(context.recentChanges);
  }

  return Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    topic,
    explanation,
    evidenceEventIds: Object.freeze(context.importantEvents.map((event) => event.eventId)),
    readOnly: true as const,
  });
}

export const ScenarioTimelineAssistantExplanationBuilder = Object.freeze({
  buildScenarioTimelineExplanation,
});
