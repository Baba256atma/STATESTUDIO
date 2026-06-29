/**
 * APP-5:7 — Scenario Timeline Assistant context builder.
 */

import { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION } from "./scenarioTimelineAssistantConstants.ts";
import {
  fetchScenarioTimelineQuery,
  fetchScenarioTimelineSummary,
  fetchScenarioTimelineValidation,
  fetchScenarioTimelineView,
  readScenarioTimelineAssistantDiagnostics,
} from "./scenarioTimelineAssistantAdapter.ts";
import { buildScenarioTimelineRecentChanges } from "./scenarioTimelineAssistantHistory.ts";
import {
  buildScenarioTimelineAssistantSummaryFromView,
  mapAssistantMilestones,
  selectImportantEvents,
} from "./scenarioTimelineAssistantSummary.ts";
import type {
  ScenarioTimelineAssistantContext,
  ScenarioTimelineAssistantIntegrationInput,
  ScenarioTimelineAssistantIntegrationResult,
  ScenarioTimelineAssistantWarning,
} from "./scenarioTimelineAssistantTypes.ts";
import { registerScenarioTimelineAssistantContext } from "./scenarioTimelineAssistantRegistry.ts";

function buildWarnings(
  validationValid: boolean,
  apiSuccess: boolean
): readonly ScenarioTimelineAssistantWarning[] {
  const warnings: ScenarioTimelineAssistantWarning[] = [];
  if (!apiSuccess) {
    warnings.push(
      Object.freeze({
        code: "timeline_unavailable",
        message: "Scenario timeline could not be loaded through APP-5:6.",
        readOnly: true as const,
      })
    );
  }
  if (!validationValid) {
    warnings.push(
      Object.freeze({
        code: "timeline_validation_failed",
        message: "Scenario timeline validation reported issues.",
        readOnly: true as const,
      })
    );
  }
  return Object.freeze(warnings);
}

export function buildScenarioTimelineAssistantContext(
  input: ScenarioTimelineAssistantIntegrationInput
): ScenarioTimelineAssistantIntegrationResult<ScenarioTimelineAssistantContext> {
  const filters = Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
  });

  const viewResponse = fetchScenarioTimelineView(filters);
  const queryResponse = fetchScenarioTimelineQuery(filters);
  const summaryResponse = fetchScenarioTimelineSummary(filters);
  const validationResponse = fetchScenarioTimelineValidation(filters);

  if (!viewResponse.success || !viewResponse.data) {
    return Object.freeze({
      success: false,
      reason: viewResponse.errors[0]?.message ?? "Unable to load scenario timeline.",
      data: null,
      readOnly: true as const,
    });
  }

  const view = viewResponse.data;
  const query = queryResponse.data ?? view.query;
  const events = view.events;
  const recentChanges = buildScenarioTimelineRecentChanges(events);
  const importantEvents = selectImportantEvents(events);
  const milestones = mapAssistantMilestones(query?.milestones ?? view.history?.milestones ?? []);
  const summary = summaryResponse.data?.narrative ?? buildScenarioTimelineAssistantSummaryFromView(input, view).narrative;
  const baseDiagnostics = readScenarioTimelineAssistantDiagnostics();
  const validationValid = validationResponse.success && validationResponse.data?.valid === true;

  const context = Object.freeze({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    timelineSummary: summary,
    timelineHistory: Object.freeze([...events]),
    currentStage: query?.lifecycle?.currentStage ?? view.lifecycle?.currentStage ?? null,
    progress: query?.progress ?? view.progress,
    status: query?.status ?? view.status,
    milestones,
    recentChanges,
    importantEvents,
    historyDuration: query?.duration ?? null,
    completedStages: Object.freeze([...(query?.completedStages ?? view.lifecycle?.completedStages ?? [])]),
    remainingStages: Object.freeze([...(query?.remainingStages ?? view.lifecycle?.remainingStages ?? [])]),
    warnings: buildWarnings(validationValid, viewResponse.success),
    diagnostics: Object.freeze({
      ...baseDiagnostics,
      validationValid,
      readOnly: true as const,
    }),
    platformVersion: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
    metadata: Object.freeze({ ...(input.metadata ?? {}) }),
    readOnly: true as const,
  });

  registerScenarioTimelineAssistantContext(context);

  return Object.freeze({
    success: true,
    reason: "Scenario timeline assistant context built.",
    data: context,
    readOnly: true as const,
  });
}

export const ScenarioTimelineAssistantContextBuilder = Object.freeze({
  buildScenarioTimelineAssistantContext,
});
