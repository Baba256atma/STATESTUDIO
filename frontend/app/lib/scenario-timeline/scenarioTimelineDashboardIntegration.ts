/**
 * APP-5:8 — Scenario Timeline Dashboard Integration.
 * Official integration layer for Executive Dashboard timeline data.
 */

import {
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_TAGS,
} from "./scenarioTimelineDashboardConstants.ts";
import {
  fetchDashboardScenarioTimelineMilestones,
  fetchDashboardScenarioTimelineProgress,
  fetchDashboardScenarioTimelineStatus,
  fetchDashboardScenarioTimelineView,
} from "./scenarioTimelineDashboardAdapter.ts";
import { certifyScenarioTimelineDashboardIntegration } from "./scenarioTimelineDashboardCertification.ts";
import { buildScenarioTimelineDashboardContext } from "./scenarioTimelineDashboardContext.ts";
import {
  getScenarioTimelineDashboardIntegrationContract,
  SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_PUBLIC_API_RULES,
} from "./scenarioTimelineDashboardContracts.ts";
import {
  buildDashboardRecentChanges,
  buildScenarioTimelineDashboardMetricsFromView,
  mapDashboardMilestones,
} from "./scenarioTimelineDashboardMetrics.ts";
import {
  buildDashboardTimelineSummaryFromView,
} from "./scenarioTimelineDashboardSummary.ts";
import { validateScenarioTimelineDashboardContext } from "./scenarioTimelineDashboardValidator.ts";
import { buildScenarioTimelineDashboardViewModel } from "./scenarioTimelineDashboardViewModel.ts";
import type {
  ScenarioTimelineDashboardChangeRecord,
  ScenarioTimelineDashboardContext,
  ScenarioTimelineDashboardIntegrationInput,
  ScenarioTimelineDashboardIntegrationResult,
  ScenarioTimelineDashboardMetrics,
  ScenarioTimelineDashboardMilestoneView,
  ScenarioTimelineDashboardViewModel,
} from "./scenarioTimelineDashboardTypes.ts";

export function buildScenarioTimelineDashboardSummary(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<{ summary: string }> {
  const viewResponse = fetchDashboardScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to build dashboard summary.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Dashboard timeline summary built.",
    data: Object.freeze({
      summary: buildDashboardTimelineSummaryFromView(input, viewResponse.data),
    }),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineDashboardStatus(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<{
  status: string | null;
  currentStage: string | null;
}> {
  const statusResponse = fetchDashboardScenarioTimelineStatus({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  const viewResponse = fetchDashboardScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!statusResponse.success || !viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: statusResponse.errors[0]?.message ?? "Unable to build dashboard status.",
      data: null,
      readOnly: true as const,
    });
  }
  const currentStage =
    viewResponse.data.lifecycle?.currentStage ?? viewResponse.data.query?.lifecycle?.currentStage ?? null;
  return Object.freeze({
    success: true,
    reason: "Dashboard timeline status built.",
    data: Object.freeze({ status: statusResponse.data, currentStage }),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineDashboardProgress(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<{ progress: number | null }> {
  const progressResponse = fetchDashboardScenarioTimelineProgress({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!progressResponse.success) {
    return Object.freeze({
      success: false,
      reason: progressResponse.errors[0]?.message ?? "Unable to build dashboard progress.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Dashboard timeline progress built.",
    data: Object.freeze({ progress: progressResponse.data }),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineDashboardMilestones(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<readonly ScenarioTimelineDashboardMilestoneView[]> {
  const response = fetchDashboardScenarioTimelineMilestones({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!response.success || !response.data) {
    return Object.freeze({
      success: false,
      reason: response.errors[0]?.message ?? "Unable to load dashboard milestones.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Dashboard timeline milestones built.",
    data: mapDashboardMilestones(response.data),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineDashboardRecentChanges(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<readonly ScenarioTimelineDashboardChangeRecord[]> {
  const viewResponse = fetchDashboardScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to build dashboard recent changes.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Dashboard recent changes built.",
    data: buildDashboardRecentChanges(viewResponse.data.events),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineDashboardMetrics(
  input: ScenarioTimelineDashboardIntegrationInput
): ScenarioTimelineDashboardIntegrationResult<ScenarioTimelineDashboardMetrics> {
  const viewResponse = fetchDashboardScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to build dashboard metrics.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Dashboard timeline metrics built.",
    data: buildScenarioTimelineDashboardMetricsFromView(viewResponse.data),
    readOnly: true as const,
  });
}

export {
  buildScenarioTimelineDashboardContext,
  buildScenarioTimelineDashboardViewModel,
  validateScenarioTimelineDashboardContext,
  certifyScenarioTimelineDashboardIntegration,
  getScenarioTimelineDashboardIntegrationContract,
};

export const SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_VERSION = SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
export { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_TAGS, SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_PUBLIC_API_RULES };

export const ScenarioTimelineDashboardIntegration = Object.freeze({
  buildScenarioTimelineDashboardContext,
  buildScenarioTimelineDashboardViewModel,
  buildScenarioTimelineDashboardSummary,
  buildScenarioTimelineDashboardStatus,
  buildScenarioTimelineDashboardProgress,
  buildScenarioTimelineDashboardMilestones,
  buildScenarioTimelineDashboardRecentChanges,
  buildScenarioTimelineDashboardMetrics,
  validateScenarioTimelineDashboardContext,
  certifyScenarioTimelineDashboardIntegration,
  getScenarioTimelineDashboardIntegrationContract,
  version: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
});

export type { ScenarioTimelineDashboardContext, ScenarioTimelineDashboardViewModel };
