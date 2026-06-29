/**
 * APP-5:7 — Scenario Timeline Assistant Integration.
 * Official integration layer for Executive Assistant timeline knowledge.
 */

import {
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_TAGS,
} from "./scenarioTimelineAssistantConstants.ts";
import { certifyScenarioTimelineAssistantIntegration } from "./scenarioTimelineAssistantCertification.ts";
import { buildScenarioTimelineAssistantContext } from "./scenarioTimelineAssistantContext.ts";
import {
  getScenarioTimelineAssistantIntegrationContract,
  SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_PUBLIC_API_RULES,
} from "./scenarioTimelineAssistantContracts.ts";
import { buildScenarioTimelineExplanation } from "./scenarioTimelineAssistantExplanation.ts";
import {
  buildScenarioTimelineHistoryExplanation as buildHistoryExplanationText,
  buildScenarioTimelineRecentChanges as buildRecentChangesFromEvents,
} from "./scenarioTimelineAssistantHistory.ts";
import {
  answerScenarioTimelineQuestion,
  listScenarioTimelineAssistantQuestions,
} from "./scenarioTimelineAssistantRouter.ts";
import {
  buildScenarioTimelineAssistantSummaryFromView,
  buildScenarioTimelineStatusExplanation,
  mapAssistantMilestones,
} from "./scenarioTimelineAssistantSummary.ts";
import { validateScenarioTimelineAssistantContext } from "./scenarioTimelineAssistantValidator.ts";
import {
  fetchScenarioTimelineMilestones,
  fetchScenarioTimelineProgress,
  fetchScenarioTimelineStatus,
  fetchScenarioTimelineSummary,
  fetchScenarioTimelineView,
} from "./scenarioTimelineAssistantAdapter.ts";
import type {
  ScenarioTimelineAssistantChangeRecord,
  ScenarioTimelineAssistantContext,
  ScenarioTimelineAssistantExplanation,
  ScenarioTimelineAssistantIntegrationInput,
  ScenarioTimelineAssistantIntegrationResult,
  ScenarioTimelineAssistantMilestoneView,
  ScenarioTimelineAssistantSummary,
} from "./scenarioTimelineAssistantTypes.ts";

export function buildScenarioTimelineSummary(
  input: ScenarioTimelineAssistantIntegrationInput
): ScenarioTimelineAssistantIntegrationResult<ScenarioTimelineAssistantSummary> {
  const viewResponse = fetchScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to build timeline summary.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Timeline summary built.",
    data: buildScenarioTimelineAssistantSummaryFromView(input, viewResponse.data),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineHistoryExplanation(
  input: ScenarioTimelineAssistantIntegrationInput
): ScenarioTimelineAssistantIntegrationResult<{ explanation: string }> {
  const contextResult = buildScenarioTimelineAssistantContext(input);
  if (!contextResult.success || !contextResult.data) {
    return Object.freeze({
      success: false,
      reason: contextResult.reason,
      data: null,
      readOnly: true as const,
    });
  }
  const explanation = buildHistoryExplanationText({
    scenarioId: input.scenarioId,
    events: contextResult.data.timelineHistory,
    duration: contextResult.data.historyDuration,
  });
  return Object.freeze({
    success: true,
    reason: "Timeline history explanation built.",
    data: Object.freeze({ explanation }),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineMilestones(
  input: ScenarioTimelineAssistantIntegrationInput
): ScenarioTimelineAssistantIntegrationResult<readonly ScenarioTimelineAssistantMilestoneView[]> {
  const response = fetchScenarioTimelineMilestones({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!response.success || !response.data) {
    return Object.freeze({
      success: false,
      reason: response.errors[0]?.message ?? "Unable to load milestones.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Timeline milestones built.",
    data: mapAssistantMilestones(response.data),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineStatus(
  input: ScenarioTimelineAssistantIntegrationInput
): ScenarioTimelineAssistantIntegrationResult<{
  status: string | null;
  currentStage: string | null;
  progress: number | null;
  explanation: string;
}> {
  const statusResponse = fetchScenarioTimelineStatus({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  const progressResponse = fetchScenarioTimelineProgress({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  const viewResponse = fetchScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });

  if (!statusResponse.success || !viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: statusResponse.errors[0]?.message ?? "Unable to build timeline status.",
      data: null,
      readOnly: true as const,
    });
  }

  const currentStage =
    viewResponse.data.lifecycle?.currentStage ?? viewResponse.data.query?.lifecycle?.currentStage ?? null;
  const status = statusResponse.data;
  const progress = progressResponse.data;
  const explanation = buildScenarioTimelineStatusExplanation({
    scenarioId: input.scenarioId,
    status,
    currentStage,
    progress,
    isBlocked: status === "blocked",
  });

  return Object.freeze({
    success: true,
    reason: "Timeline status built.",
    data: Object.freeze({ status, currentStage, progress, explanation }),
    readOnly: true as const,
  });
}

export function buildScenarioTimelineRecentChanges(
  input: ScenarioTimelineAssistantIntegrationInput
): ScenarioTimelineAssistantIntegrationResult<readonly ScenarioTimelineAssistantChangeRecord[]> {
  const viewResponse = fetchScenarioTimelineView({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });
  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to build recent changes.",
      data: null,
      readOnly: true as const,
    });
  }
  return Object.freeze({
    success: true,
    reason: "Recent timeline changes built.",
    data: buildRecentChangesFromEvents(viewResponse.data.events),
    readOnly: true as const,
  });
}

export {
  buildScenarioTimelineAssistantContext,
  buildScenarioTimelineExplanation,
  answerScenarioTimelineQuestion,
  validateScenarioTimelineAssistantContext,
  certifyScenarioTimelineAssistantIntegration,
  getScenarioTimelineAssistantIntegrationContract,
  listScenarioTimelineAssistantQuestions,
};

export const SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_VERSION = SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION;
export { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_TAGS, SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_PUBLIC_API_RULES };

export const ScenarioTimelineAssistantIntegration = Object.freeze({
  buildScenarioTimelineAssistantContext,
  buildScenarioTimelineSummary,
  buildScenarioTimelineExplanation,
  buildScenarioTimelineHistoryExplanation,
  buildScenarioTimelineMilestones,
  buildScenarioTimelineStatus,
  buildScenarioTimelineRecentChanges,
  answerScenarioTimelineQuestion,
  validateScenarioTimelineAssistantContext,
  certifyScenarioTimelineAssistantIntegration,
  getScenarioTimelineAssistantIntegrationContract,
  version: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
});

export type { ScenarioTimelineAssistantContext, ScenarioTimelineAssistantExplanation };
