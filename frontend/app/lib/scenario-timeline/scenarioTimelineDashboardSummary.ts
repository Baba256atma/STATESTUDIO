/**
 * APP-5:8 — Scenario Timeline Dashboard summary and executive summary builders.
 */

import type { ScenarioTimelineView } from "./scenarioTimelineApiTypes.ts";
import type {
  ScenarioTimelineDashboardIntegrationInput,
  ScenarioTimelineDashboardMetrics,
} from "./scenarioTimelineDashboardTypes.ts";

export function buildDashboardTimelineSummaryFromView(
  input: ScenarioTimelineDashboardIntegrationInput,
  view: ScenarioTimelineView
): string {
  return (
    view.query?.summary?.narrative ??
    view.history?.historySummary?.narrative ??
    `Scenario ${input.scenarioId} timeline summary unavailable.`
  );
}

export function buildDashboardHistorySummary(
  input: ScenarioTimelineDashboardIntegrationInput,
  view: ScenarioTimelineView
): string {
  const eventCount = view.events.length;
  if (eventCount === 0) {
    return `Scenario ${input.scenarioId} has no recorded timeline history.`;
  }
  const first = view.events[0]!;
  const last = view.events.at(-1)!;
  return `Scenario ${input.scenarioId} timeline: ${eventCount} event(s) from ${first.stage} to ${last.stage}.`;
}

export function buildScenarioTimelineExecutiveSummary(input: {
  scenarioId: string;
  summary: string;
  status: string | null;
  currentStage: string | null;
  progress: number | null;
  metrics: ScenarioTimelineDashboardMetrics;
}): string {
  const progressText = input.progress === null ? "unknown" : `${input.progress}%`;
  return `${input.summary} Status: ${input.status ?? "unknown"}. Stage: ${input.currentStage ?? "none"}. Progress: ${progressText}. Events: ${input.metrics.eventCount}. Milestones: ${input.metrics.milestoneCount}.`;
}

export const ScenarioTimelineDashboardSummaryBuilder = Object.freeze({
  buildDashboardTimelineSummaryFromView,
  buildDashboardHistorySummary,
  buildScenarioTimelineExecutiveSummary,
});
