/**
 * APP-5:9 — Scenario Timeline Platform end-to-end certification.
 * Validates the complete pipeline exclusively through public integration APIs.
 */

import { buildScenarioTimelineAssistantContext } from "./scenarioTimelineAssistantIntegration.ts";
import { buildScenarioTimelineDashboardViewModel } from "./scenarioTimelineDashboardIntegration.ts";
import {
  createScenarioTimelineEvent,
  getScenarioTimeline,
  initializeScenarioTimeline,
  queryScenarioTimeline,
} from "./scenarioTimelineApiLayer.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelineLifecycleStage } from "./scenarioTimelinePlatformTypes.ts";
import type { ScenarioTimelinePlatformEndToEndResult } from "./scenarioTimelinePlatformCertificationTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const SCENARIO_ID = "scenario-platform-e2e-001";
const WORKSPACE_ID = "ws-platform-e2e-001";

export function runScenarioTimelineEndToEndCertification(): ScenarioTimelinePlatformEndToEndResult {
  const stagesExecuted: string[] = [];

  try {
    const init = initializeScenarioTimeline(FIXED_TIME);
    if (!init.success) {
      return Object.freeze({
        success: false,
        stagesExecuted: Object.freeze(stagesExecuted),
        failureStage: "platform_initialization",
        summary: init.errors[0]?.message ?? "Platform initialization failed.",
        readOnly: true as const,
      });
    }
    stagesExecuted.push("platform_initialization");
    stagesExecuted.push("scenario_creation");

    for (const [index, stage] of (SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS as readonly ScenarioTimelineLifecycleStage[]).entries()) {
      const result = createScenarioTimelineEvent({
        scenarioId: SCENARIO_ID,
        workspaceId: WORKSPACE_ID,
        stage,
        eventId: `platform-e2e-${stage}`,
        timestamp: `2026-01-01T00:00:${String(index + 1).padStart(2, "0")}.000Z`,
        createdBy: "platform-e2e-certification",
        title: `Platform E2E ${stage}`,
        summary: "APP-5:9 end-to-end certification event.",
      });
      if (!result.success) {
        return Object.freeze({
          success: false,
          stagesExecuted: Object.freeze(stagesExecuted),
          failureStage: index === 0 ? "timeline_event" : "lifecycle_calculation",
          summary: result.errors[0]?.message ?? "Timeline event creation failed.",
          readOnly: true as const,
        });
      }
    }
    stagesExecuted.push("timeline_event");
    stagesExecuted.push("lifecycle_calculation");
    stagesExecuted.push("history_reconstruction");

    const query = queryScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
    if (!query.success || !query.data) {
      return Object.freeze({
        success: false,
        stagesExecuted: Object.freeze(stagesExecuted),
        failureStage: "timeline_query",
        summary: query.errors[0]?.message ?? "Timeline query failed.",
        readOnly: true as const,
      });
    }
    if (!query.data.lifecycle || !query.data.history) {
      return Object.freeze({
        success: false,
        stagesExecuted: Object.freeze(stagesExecuted),
        failureStage: "timeline_query",
        summary: "Query result missing lifecycle or history projections.",
        readOnly: true as const,
      });
    }
    stagesExecuted.push("timeline_query");

    const apiView = getScenarioTimeline({ scenarioId: SCENARIO_ID, workspaceId: WORKSPACE_ID });
    if (!apiView.success || !apiView.data) {
      return Object.freeze({
        success: false,
        stagesExecuted: Object.freeze(stagesExecuted),
        failureStage: "public_api",
        summary: apiView.errors[0]?.message ?? "Public API failed.",
        readOnly: true as const,
      });
    }
    if (apiView.data.events.length !== SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length) {
      return Object.freeze({
        success: false,
        stagesExecuted: Object.freeze(stagesExecuted),
        failureStage: "public_api",
        summary: `Expected ${SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length} events, received ${apiView.data.events.length}.`,
        readOnly: true as const,
      });
    }
    stagesExecuted.push("public_api");

    const assistantContext = buildScenarioTimelineAssistantContext({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
    });
    if (!assistantContext.success || !assistantContext.data?.readOnly) {
      return Object.freeze({
        success: false,
        stagesExecuted: Object.freeze(stagesExecuted),
        failureStage: "assistant_context",
        summary: assistantContext.reason,
        readOnly: true as const,
      });
    }
    stagesExecuted.push("assistant_context");

    const dashboardViewModel = buildScenarioTimelineDashboardViewModel({
      scenarioId: SCENARIO_ID,
      workspaceId: WORKSPACE_ID,
    });
    if (!dashboardViewModel.success || !dashboardViewModel.data?.readOnly) {
      return Object.freeze({
        success: false,
        stagesExecuted: Object.freeze(stagesExecuted),
        failureStage: "dashboard_viewmodel",
        summary: dashboardViewModel.reason,
        readOnly: true as const,
      });
    }
    stagesExecuted.push("dashboard_viewmodel");

    return Object.freeze({
      success: true,
      stagesExecuted: Object.freeze(stagesExecuted),
      failureStage: null,
      summary: `End-to-end pipeline executed ${stagesExecuted.length} stages successfully via APP-5:6 public APIs.`,
      readOnly: true as const,
    });
  } catch (error) {
    return Object.freeze({
      success: false,
      stagesExecuted: Object.freeze(stagesExecuted),
      failureStage: stagesExecuted.at(-1) ?? "unknown",
      summary: error instanceof Error ? error.message : "End-to-end certification failed.",
      readOnly: true as const,
    });
  }
}
