/**
 * APP-6:10 — Decision Assistant explanation builder.
 * Formats certified dashboard outputs into assistant-ready text.
 */

import type { DecisionDashboardModel } from "./decisionDashboardTypes.ts";
import type {
  DecisionAssistantBinding,
  DecisionAssistantExplanation,
  DecisionAssistantIntegrationInput,
} from "./decisionAssistantTypes.ts";

export function buildDecisionExplanationText(
  binding: DecisionAssistantBinding,
  dashboard: DecisionDashboardModel
): string {
  switch (binding) {
    case "single_decision_explanation":
      return `Decision ${dashboard.decisionState?.decisionId ?? "unknown"} is currently ${dashboard.lifecycle ?? "unknown"} with status ${dashboard.status ?? "unknown"}. ${dashboard.decisionSummary}`;
    case "decision_summary":
      return dashboard.decisionSummary;
    case "comparison_summary":
      if (dashboard.comparisonSummary) {
        return dashboard.comparisonSummary.messages.join(" ");
      }
      return "No comparison summary available.";
    case "replay_summary":
      if (dashboard.replaySummary) {
        return `Replay position ${dashboard.replaySummary.cursorIndex + 1} of ${dashboard.replaySummary.totalEvents} for decision ${dashboard.replaySummary.decisionId}.`;
      }
      return "No replay summary available.";
    case "status_explanation":
      return `Current status is ${dashboard.status ?? "unknown"} at lifecycle ${dashboard.lifecycle ?? "unknown"}.`;
    case "active_decision_summary":
      return `${dashboard.decisionStates.length} active decision(s) in scope. ${dashboard.decisionSummary}`;
    case "terminal_decision_summary":
      return `${dashboard.decisionStates.length} terminal decision(s) in scope. ${dashboard.decisionSummary}`;
    default:
      return dashboard.decisionSummary;
  }
}

export function buildDecisionExplanation(
  input: DecisionAssistantIntegrationInput,
  dashboard: DecisionDashboardModel,
  generatedAt: string
): DecisionAssistantExplanation {
  return Object.freeze({
    explanationId: `decision-assistant-explanation-${dashboard.modelId}`,
    binding: input.binding,
    decisionId: dashboard.decisionState?.decisionId ?? input.decisionId ?? null,
    workspaceId: dashboard.workspaceId,
    text: buildDecisionExplanationText(input.binding, dashboard),
    readOnly: true as const,
  });
}

export function buildDecisionAssistantSummaryFromDashboard(
  dashboard: DecisionDashboardModel,
  explanation: DecisionAssistantExplanation
): string {
  return [dashboard.decisionSummary, explanation.text].join(" ");
}

export const DecisionAssistantExplanationBuilder = Object.freeze({
  buildDecisionExplanationText,
  buildDecisionExplanation,
  buildDecisionAssistantSummaryFromDashboard,
});
