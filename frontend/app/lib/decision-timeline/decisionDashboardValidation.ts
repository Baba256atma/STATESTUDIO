/**
 * APP-6:9 — Decision Dashboard validation.
 */

import { isDecisionComparisonEngineInitialized } from "./decisionComparisonEngine.ts";
import { isDecisionQueryEngineInitialized } from "./decisionQueryEngine.ts";
import { isDecisionReplayEngineInitialized } from "./decisionReplayEngine.ts";
import {
  DECISION_DASHBOARD_BINDINGS,
  DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  type DecisionDashboardIntegrationInput,
  type DecisionDashboardModel,
  type DecisionValidationIssue,
  type DecisionValidationResult,
} from "./decisionDashboardTypes.ts";
import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForDashboard(timestamp: string): DecisionValidationResult {
  const report = validateDecisionTimelineFoundation(timestamp);
  if (report.valid) {
    return result([]);
  }
  return result(report.issues.map((entry) => issue("foundation_incompatible", entry.message, entry.field)));
}

export function validateEngineCompatibilityForDashboard(): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!isDecisionQueryEngineInitialized()) {
    issues.push(issue("query_incompatible", "Decision Query Engine is not initialized.", "queryEngine"));
  }
  if (!isDecisionComparisonEngineInitialized()) {
    issues.push(issue("comparison_incompatible", "Decision Comparison Engine is not initialized.", "comparisonEngine"));
  }
  if (!isDecisionReplayEngineInitialized()) {
    issues.push(issue("replay_incompatible", "Decision Replay Engine is not initialized.", "replayEngine"));
  }
  return result(issues);
}

export function validateDecisionDashboardInput(input: DecisionDashboardIntegrationInput): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!(DECISION_DASHBOARD_BINDINGS as readonly string[]).includes(input.binding)) {
    issues.push(issue("invalid_binding", "Unsupported dashboard binding.", "binding"));
  }

  switch (input.binding) {
    case "single_decision":
    case "replay_summary":
      if (!input.decisionId?.trim() && !input.replayId?.trim()) {
        issues.push(issue("missing_field", "decisionId or replayId is required.", "decisionId"));
      }
      break;
    case "decision_comparison":
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

export function validateWorkspaceIsolationForDashboard(model: DecisionDashboardModel): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (model.workspaceId) {
    for (const state of model.decisionStates) {
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
    if (model.decisionState && model.decisionState.workspaceId !== model.workspaceId) {
      issues.push(issue("workspace_isolation_violation", "Primary decision state workspace mismatch.", "workspaceId"));
    }
  }

  return result(issues);
}

export function validateDecisionDashboardModel(model: DecisionDashboardModel): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (model.readOnly !== true) {
    issues.push(issue("contract_violation", "Dashboard model must be read-only.", "readOnly"));
  }
  if (model.contractVersion !== DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid dashboard contract version.", "contractVersion"));
  }
  if (!Object.isFrozen(model)) {
    issues.push(issue("immutability_violation", "Dashboard model must be immutable.", "model"));
  }
  if (!model.decisionSummary.trim()) {
    issues.push(issue("missing_field", "decisionSummary is required.", "decisionSummary"));
  }

  issues.push(...validateWorkspaceIsolationForDashboard(model).issues);

  return result(issues);
}

export function validateDecisionDashboard(
  input: DecisionDashboardIntegrationInput,
  model: DecisionDashboardModel | null
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  issues.push(...validateEngineCompatibilityForDashboard().issues);
  issues.push(...validateDecisionDashboardInput(input).issues);
  if (!model) {
    issues.push(issue("missing_model", "Dashboard model is missing.", "model"));
    return result(issues);
  }
  issues.push(...validateDecisionDashboardModel(model).issues);
  return result(issues);
}

export const DecisionDashboardValidation = Object.freeze({
  validateFoundationCompatibilityForDashboard,
  validateEngineCompatibilityForDashboard,
  validateDecisionDashboardInput,
  validateWorkspaceIsolationForDashboard,
  validateDecisionDashboardModel,
  validateDecisionDashboard,
});
