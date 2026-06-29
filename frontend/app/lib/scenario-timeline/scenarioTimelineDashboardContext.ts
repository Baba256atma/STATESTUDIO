/**
 * APP-5:8 — Scenario Timeline Dashboard context builder.
 */

import { buildScenarioTimelineAssistantContext } from "./scenarioTimelineAssistantIntegration.ts";
import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./scenarioTimelineDashboardConstants.ts";
import {
  fetchDashboardScenarioTimelineHealth,
  fetchDashboardScenarioTimelineValidation,
  fetchDashboardScenarioTimelineView,
  readScenarioTimelineDashboardDiagnostics,
} from "./scenarioTimelineDashboardAdapter.ts";
import {
  buildDashboardHistorySummary,
  buildDashboardTimelineSummaryFromView,
} from "./scenarioTimelineDashboardSummary.ts";
import {
  buildDashboardRecentChanges,
  mapDashboardMilestones,
  resolveDashboardStageData,
  selectDashboardRecentEvents,
} from "./scenarioTimelineDashboardMetrics.ts";
import { registerScenarioTimelineDashboardContext } from "./scenarioTimelineDashboardRegistry.ts";
import type {
  ScenarioTimelineDashboardContext,
  ScenarioTimelineDashboardHealth,
  ScenarioTimelineDashboardIntegrationInput,
  ScenarioTimelineDashboardIntegrationResult,
} from "./scenarioTimelineDashboardTypes.ts";

function buildTimelineHealth(): ScenarioTimelineDashboardHealth {
  const health = fetchDashboardScenarioTimelineHealth();
  return Object.freeze({
    healthy: health.data?.healthy === true,
    status: health.data?.status ?? "unknown",
    readOnly: true as const,
  });
}

export function buildScenarioTimelineDashboardContext(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<ScenarioTimelineDashboardContext> {
  const filters = Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });

  const viewResponse = fetchDashboardScenarioTimelineView(filters);
  const validationResponse = fetchDashboardScenarioTimelineValidation(filters);

  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to load scenario timeline for dashboard.",
      data: null,
      readOnly: true as const,
    });
  }

  const view = viewResponse.data;
  const stageData = resolveDashboardStageData(view);
  const events = view.events;
  const milestones = mapDashboardMilestones(view.query?.milestones ?? view.history?.milestones ?? []);
  const recentChanges = buildDashboardRecentChanges(events);
  const recentEvents = selectDashboardRecentEvents(events);

  let summary = buildDashboardTimelineSummaryFromView(input, view);
  let assistantContextUsed = false;

  if (input.useAssistantContext === true) {
    const assistantResult = buildScenarioTimelineAssistantContext({
      scenarioId: input.scenarioId,
      workspaceId: input.workspaceId,
      metadata: input.metadata,
    });
    if (assistantResult.success && assistantResult.data) {
      summary = assistantResult.data.timelineSummary;
      assistantContextUsed = true;
    }
  }

  const baseDiagnostics = readScenarioTimelineDashboardDiagnostics();
  const validationValid = validationResponse.success && validationResponse.data?.valid === true;

  const context = Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    summary,
    status: stageData.status,
    progress: stageData.progress,
    currentStage: stageData.currentStage,
    milestones,
    recentChanges,
    recentEvents: Object.freeze([...recentEvents]),
    historySummary: buildDashboardHistorySummary(input, view),
    historyDuration: stageData.historyDuration,
    completedStages: stageData.completedStages,
    remainingStages: stageData.remainingStages,
    eventCount: events.length,
    timelineHealth: buildTimelineHealth(),
    diagnostics: Object.freeze({
      ...baseDiagnostics,
      validationValid,
      assistantContextUsed,
      readOnly: true as const,
    }),
    platformVersion: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
    readOnly: true as const,
  });

  registerScenarioTimelineDashboardContext(context);

  return Object.freeze({
    success: true,
    reason: "Scenario timeline dashboard context built.",
    data: context,
    readOnly: true as const,
  });
}

export const ScenarioTimelineDashboardContextBuilder = Object.freeze({
  buildScenarioTimelineDashboardContext,
});
