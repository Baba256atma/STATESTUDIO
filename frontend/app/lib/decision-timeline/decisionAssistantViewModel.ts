/**
 * APP-6:10 — Decision Assistant view model builder.
 */

import { fetchAssistantDashboardModel } from "./decisionAssistantAdapter.ts";
import {
  buildDecisionAssistantSummaryFromDashboard,
  buildDecisionExplanation,
} from "./decisionAssistantExplanation.ts";
import {
  DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  type DecisionAssistantIntegrationInput,
  type DecisionAssistantModel,
} from "./decisionAssistantTypes.ts";
import type { DecisionDashboardModel } from "./decisionDashboardTypes.ts";
import type { DecisionValidationResult } from "./decisionTimelineTypes.ts";

let modelSequence = 0;

export function resetDecisionAssistantModelSequenceForTests(): void {
  modelSequence = 0;
}

function createModelId(binding: string, generatedAt: string): string {
  modelSequence += 1;
  const normalizedTime = generatedAt.replace(/[:.]/g, "-");
  return `decision-assistant-${binding}-${normalizedTime}-${String(modelSequence).padStart(4, "0")}`;
}

function collectValidationMessages(dashboard: DecisionDashboardModel): readonly string[] {
  const messages: string[] = [];
  if (!dashboard.validation.valid) {
    messages.push(...dashboard.validation.issues.map((issue) => issue.message));
  }
  if (dashboard.comparisonSummary?.messages.length) {
    messages.push(...dashboard.comparisonSummary.messages);
  }
  return Object.freeze(messages);
}

export function buildDecisionAssistantModelFromDashboard(
  input: DecisionAssistantIntegrationInput,
  dashboard: DecisionDashboardModel,
  generatedAt: string
): DecisionAssistantModel {
  const explanation = buildDecisionExplanation(input, dashboard, generatedAt);
  const validationMessages = collectValidationMessages(dashboard);

  return Object.freeze({
    modelId: createModelId(input.binding, generatedAt),
    binding: input.binding,
    workspaceId: dashboard.workspaceId,
    decisionSummary: dashboard.decisionSummary,
    decisionExplanation: explanation.text,
    decisionStateSummary: dashboard.decisionState,
    decisionStateSummaries: Object.freeze([...dashboard.decisionStates]),
    comparisonSummary: dashboard.comparisonSummary,
    replaySummary: dashboard.replaySummary,
    dashboardSummary: buildDecisionAssistantSummaryFromDashboard(dashboard, explanation),
    status: dashboard.status,
    lifecycle: dashboard.lifecycle,
    validationMessages,
    validation: dashboard.validation,
    generatedAt,
    contractVersion: DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildDecisionAssistantModelForInput(
  input: DecisionAssistantIntegrationInput,
  generatedAt: string
): DecisionAssistantModel | null {
  const dashboardResponse = fetchAssistantDashboardModel(input);
  if (!dashboardResponse.success || !dashboardResponse.data) {
    return null;
  }
  return buildDecisionAssistantModelFromDashboard(input, dashboardResponse.data, generatedAt);
}

export const DecisionAssistantViewModel = Object.freeze({
  buildDecisionAssistantModelFromDashboard,
  buildDecisionAssistantModelForInput,
  resetDecisionAssistantModelSequenceForTests,
});
