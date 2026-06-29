/**
 * APP-6:10 — Decision Assistant adapter.
 * Orchestrates APP-6:9 Dashboard Integration only.
 */

import {
  buildDecisionDashboardModel,
  buildDecisionDashboardSummary,
} from "./decisionDashboardEngine.ts";
import type {
  DecisionDashboardIntegrationInput,
  DecisionDashboardIntegrationResponse,
  DecisionDashboardModel,
} from "./decisionDashboardTypes.ts";
import type { DecisionAssistantBinding, DecisionAssistantIntegrationInput } from "./decisionAssistantTypes.ts";

function mapAssistantBindingToDashboard(
  binding: DecisionAssistantBinding
): DecisionDashboardIntegrationInput["binding"] {
  switch (binding) {
    case "single_decision_explanation":
    case "decision_summary":
    case "status_explanation":
      return "single_decision";
    case "comparison_summary":
      return "decision_comparison";
    case "replay_summary":
      return "replay_summary";
    case "active_decision_summary":
      return "active_decisions";
    case "terminal_decision_summary":
      return "terminal_decisions";
    default:
      return "single_decision";
  }
}

export function fetchAssistantDashboardModel(
  input: DecisionAssistantIntegrationInput
): DecisionDashboardIntegrationResponse {
  const dashboardInput = Object.freeze({
    binding: mapAssistantBindingToDashboard(input.binding),
    decisionId: input.decisionId,
    leftDecisionId: input.leftDecisionId,
    rightDecisionId: input.rightDecisionId,
    workspaceId: input.workspaceId,
    replayId: input.replayId,
    comparisonId: input.comparisonId,
    recentLimit: input.recentLimit,
  } satisfies DecisionDashboardIntegrationInput);

  return buildDecisionDashboardModel(dashboardInput);
}

export function fetchAssistantDashboardSummary(
  input: DecisionAssistantIntegrationInput
): DecisionDashboardIntegrationResponse {
  const dashboardInput = Object.freeze({
    binding: mapAssistantBindingToDashboard(input.binding),
    decisionId: input.decisionId,
    leftDecisionId: input.leftDecisionId,
    rightDecisionId: input.rightDecisionId,
    workspaceId: input.workspaceId,
    replayId: input.replayId,
    comparisonId: input.comparisonId,
    recentLimit: input.recentLimit,
  } satisfies DecisionDashboardIntegrationInput);

  return buildDecisionDashboardSummary(dashboardInput);
}

export function readAssistantDashboardModel(
  dashboardModel: DecisionDashboardModel | null
): DecisionDashboardModel | null {
  return dashboardModel;
}

export const DecisionAssistantAdapter = Object.freeze({
  fetchAssistantDashboardModel,
  fetchAssistantDashboardSummary,
  readAssistantDashboardModel,
  mapAssistantBindingToDashboard,
});
