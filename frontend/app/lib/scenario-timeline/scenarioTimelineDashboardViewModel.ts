/**
 * APP-5:8 — Scenario Timeline Dashboard ViewModel builder.
 */

import { buildScenarioTimelineDashboardContext } from "./scenarioTimelineDashboardContext.ts";
import {
  buildScenarioTimelineExecutiveSummary,
} from "./scenarioTimelineDashboardSummary.ts";
import { buildScenarioTimelineDashboardMetricsFromView } from "./scenarioTimelineDashboardMetrics.ts";
import { fetchDashboardScenarioTimelineView } from "./scenarioTimelineDashboardAdapter.ts";
import { registerScenarioTimelineDashboardViewModel } from "./scenarioTimelineDashboardRegistry.ts";
import type {
  ScenarioTimelineDashboardContext,
  ScenarioTimelineDashboardIntegrationInput,
  ScenarioTimelineDashboardIntegrationResult,
  ScenarioTimelineDashboardViewModel,
} from "./scenarioTimelineDashboardTypes.ts";

export function buildScenarioTimelineDashboardViewModelFromContext(
  context: ScenarioTimelineDashboardContext,
  metrics: ReturnType<typeof buildScenarioTimelineDashboardMetricsFromView>
): ScenarioTimelineDashboardViewModel {
  const executiveSummary = buildScenarioTimelineExecutiveSummary({
    scenarioId: context.scenarioId,
    summary: context.summary,
    status: context.status,
    currentStage: context.currentStage,
    progress: context.progress,
    metrics,
  });

  return Object.freeze({
    scenarioId: context.scenarioId,
    workspaceId: context.workspaceId,
    summary: context.summary,
    executiveSummary,
    status: context.status,
    progress: context.progress,
    currentStage: context.currentStage,
    milestones: context.milestones,
    recentChanges: context.recentChanges,
    recentEvents: context.recentEvents,
    historySummary: context.historySummary,
    historyDuration: context.historyDuration,
    completedStages: context.completedStages,
    remainingStages: context.remainingStages,
    eventCount: context.eventCount,
    timelineHealth: context.timelineHealth,
    metrics,
    diagnostics: context.diagnostics,
    platformVersion: context.platformVersion,
    metadata: context.metadata,
    readOnly: true as const,
  });
}

export function buildScenarioTimelineDashboardViewModel(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<ScenarioTimelineDashboardViewModel> {
  const contextResult = buildScenarioTimelineDashboardContext(input);
  if (!contextResult.success || !contextResult.data) {
    return Object.freeze({
      success: false,
      reason: contextResult.reason,
      data: null,
      readOnly: true as const,
    });
  }

  const viewResponse = fetchDashboardScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to build dashboard view model.",
      data: null,
      readOnly: true as const,
    });
  }

  const metrics = buildScenarioTimelineDashboardMetricsFromView(viewResponse.data);
  const viewModel = buildScenarioTimelineDashboardViewModelFromContext(contextResult.data, metrics);
  registerScenarioTimelineDashboardViewModel(viewModel);

  return Object.freeze({
    success: true,
    reason: "Scenario timeline dashboard view model built.",
    data: viewModel,
    readOnly: true as const,
  });
}

export const ScenarioTimelineDashboardViewModelBuilder = Object.freeze({
  buildScenarioTimelineDashboardViewModel,
  buildScenarioTimelineDashboardViewModelFromContext,
});
