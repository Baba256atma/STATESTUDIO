/**
 * APP-5:7 — Scenario Timeline Assistant summary and status builders.
 */

import type { ScenarioTimelineEvent } from "./scenarioTimelineEventTypes.ts";
import type {
  ScenarioTimelineAssistantMilestoneView,
  ScenarioTimelineAssistantSummary,
  ScenarioTimelineAssistantIntegrationInput,
} from "./scenarioTimelineAssistantTypes.ts";
import type { ScenarioTimelineHistoryMilestone } from "./scenarioTimelineHistoryTypes.ts";
import type { ScenarioTimelineView } from "./scenarioTimelineApiTypes.ts";

export function mapAssistantMilestones(
  milestones: readonly ScenarioTimelineHistoryMilestone[]
): readonly ScenarioTimelineAssistantMilestoneView[] {
  return Object.freeze(
    milestones.map((entry) =>
      Object.freeze({
        milestoneId: entry.milestoneId,
        milestoneKey: entry.milestoneKey,
        stage: entry.stage,
        title: entry.title,
        summary: entry.summary,
        timestamp: entry.timestamp,
        readOnly: true as const,
      })
    )
  );
}

export function buildScenarioTimelineAssistantSummaryFromView(
  input: ScenarioTimelineAssistantIntegrationInput,
  view: ScenarioTimelineView
): ScenarioTimelineAssistantSummary {
  return Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    narrative: view.query?.summary?.narrative ?? view.history?.historySummary?.narrative ?? `Scenario ${input.scenarioId} timeline summary unavailable.`,
    eventCount: view.events.length,
    milestoneCount: view.query?.milestones.length ?? 0,
    currentStage: view.lifecycle?.currentStage ?? view.query?.lifecycle?.currentStage ?? null,
    progress: view.progress ?? view.query?.progress ?? null,
    status: view.status ?? view.query?.status ?? null,
    readOnly: true as const,
  });
}

export function buildScenarioTimelineStatusExplanation(input: {
  scenarioId: string;
  status: string | null;
  currentStage: string | null;
  progress: number | null;
  isBlocked: boolean;
}): string {
  if (input.isBlocked) {
    return `Scenario ${input.scenarioId} timeline progress is blocked at stage ${input.currentStage ?? "unknown"}.`;
  }
  if (input.status === "completed") {
    return `Scenario ${input.scenarioId} timeline is completed at ${input.currentStage ?? "lessons_learned"}.`;
  }
  if (input.status === "in_progress") {
    return `Scenario ${input.scenarioId} is in progress at ${input.currentStage ?? "unknown"} (${input.progress ?? 0}% complete).`;
  }
  if (input.status === "not_started") {
    return `Scenario ${input.scenarioId} timeline has not started.`;
  }
  return `Scenario ${input.scenarioId} timeline status is ${input.status ?? "unknown"}.`;
}

export function selectImportantEvents(events: readonly ScenarioTimelineEvent[]): readonly ScenarioTimelineEvent[] {
  const stageSet = new Set<string>();
  const important: ScenarioTimelineEvent[] = [];
  for (const event of events) {
    if (!stageSet.has(event.stage)) {
      stageSet.add(event.stage);
      important.push(event);
    }
  }
  if (events.length > 0 && important.at(-1)?.eventId !== events.at(-1)?.eventId) {
    important.push(events.at(-1)!);
  }
  return Object.freeze(important);
}

export const ScenarioTimelineAssistantSummaryBuilder = Object.freeze({
  mapAssistantMilestones,
  buildScenarioTimelineAssistantSummaryFromView,
  buildScenarioTimelineStatusExplanation,
  selectImportantEvents,
});
