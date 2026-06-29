/**
 * APP-6:10 — Decision Assistant validation.
 */

import { isDecisionDashboardIntegrationInitialized } from "./decisionDashboardEngine.ts";
import {
  DECISION_ASSISTANT_BINDINGS,
  DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION,
  type DecisionAssistantIntegrationInput,
  type DecisionAssistantModel,
  type DecisionValidationIssue,
  type DecisionValidationResult,
} from "./decisionAssistantTypes.ts";
import { validateFoundationCompatibilityForDashboard } from "./decisionDashboardValidation.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForAssistant(timestamp: string): DecisionValidationResult {
  return validateFoundationCompatibilityForDashboard(timestamp);
}

export function validateEngineCompatibilityForAssistant(): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!isDecisionDashboardIntegrationInitialized()) {
    issues.push(
      issue("dashboard_incompatible", "Decision Dashboard Integration is not initialized.", "dashboardIntegration")
    );
  }
  return result(issues);
}

export function validateDecisionAssistantInput(input: DecisionAssistantIntegrationInput): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!(DECISION_ASSISTANT_BINDINGS as readonly string[]).includes(input.binding)) {
    issues.push(issue("invalid_binding", "Unsupported assistant binding.", "binding"));
  }

  switch (input.binding) {
    case "single_decision_explanation":
    case "decision_summary":
    case "status_explanation":
    case "replay_summary":
      if (!input.decisionId?.trim() && !input.replayId?.trim()) {
        issues.push(issue("missing_field", "decisionId or replayId is required.", "decisionId"));
      }
      break;
    case "comparison_summary":
      if (!input.comparisonId?.trim() && (!input.leftDecisionId?.trim() || !input.rightDecisionId?.trim())) {
        issues.push(
          issue(
            "missing_field",
            "comparisonId or both leftDecisionId and rightDecisionId are required.",
            "leftDecisionId"
          )
        );
      }
      break;
    default:
      break;
  }

  return result(issues);
}

export function validateWorkspaceIsolationForAssistant(model: DecisionAssistantModel): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (model.workspaceId) {
    for (const state of model.decisionStateSummaries) {
      if (state.workspaceId !== model.workspaceId) {
        issues.push(
          issue(
            "workspace_isolation_violation",
            `Decision ${state.decisionId} is outside workspace ${model.workspaceId}.`,
            "workspaceId"
          )
        );
      }
    }
    if (model.decisionStateSummary && model.decisionStateSummary.workspaceId !== model.workspaceId) {
      issues.push(issue("workspace_isolation_violation", "Primary state workspace mismatch.", "workspaceId"));
    }
  }

  return result(issues);
}

export function validateDecisionAssistantModel(model: DecisionAssistantModel): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Assistant model must be read-only.", "readOnly"));
  }
  if (model.contractVersion !== DECISION_ASSISTANT_INTEGRATION_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid assistant contract version.", "contractVersion"));
  }
  if (!Object.isFrozen(model)) {
    issues.push(issue("immutability_violation", "Assistant model must be immutable.", "model"));
  }
  if (!model.decisionExplanation.trim()) {
    issues.push(issue("missing_field", "decisionExplanation is required.", "decisionExplanation"));
  }
  if (!model.dashboardSummary.trim()) {
    issues.push(issue("missing_field", "dashboardSummary is required.", "dashboardSummary"));
  }

  issues.push(...validateWorkspaceIsolationForAssistant(model).issues);

  return result(issues);
}

export function validateDecisionAssistant(
  input: DecisionAssistantIntegrationInput,
  model: DecisionAssistantModel | null
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  issues.push(...validateEngineCompatibilityForAssistant().issues);
  issues.push(...validateDecisionAssistantInput(input).issues);
  if (!model) {
    issues.push(issue("missing_model", "Assistant model is missing.", "model"));
    return result(issues);
  }
  issues.push(...validateDecisionAssistantModel(model).issues);
  return result(issues);
}

export const DecisionAssistantValidation = Object.freeze({
  validateFoundationCompatibilityForAssistant,
  validateEngineCompatibilityForAssistant,
  validateDecisionAssistantInput,
  validateWorkspaceIsolationForAssistant,
  validateDecisionAssistantModel,
  validateDecisionAssistant,
});
