/**
 * APP-6:7 — Decision Comparison validation.
 */

import { DECISION_QUERY_ENGINE_CONTRACT_VERSION } from "./decisionQueryTypes.ts";
import { isDecisionQueryEngineInitialized } from "./decisionQueryEngine.ts";
import {
  DECISION_COMPARISON_ENGINE_CONTRACT_VERSION,
  DECISION_COMPARISON_ENGINE_LIMITS,
  type DecisionComparison,
  type DecisionComparisonInput,
  type DecisionValidationIssue,
  type DecisionValidationResult,
} from "./decisionComparisonTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import { DECISION_STATE_ENGINE_CONTRACT_VERSION } from "./decisionStateTypes.ts";
import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateQueryCompatibilityForComparison(): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!isDecisionQueryEngineInitialized()) {
    issues.push(issue("query_incompatible", "Decision Query Engine is not initialized.", "queryEngine"));
  }
  void DECISION_QUERY_ENGINE_CONTRACT_VERSION;
  return result(issues);
}

export function validateFoundationCompatibilityForComparison(timestamp: string): DecisionValidationResult {
  const report = validateDecisionTimelineFoundation(timestamp);
  if (report.valid) {
    return result([]);
  }
  return result(report.issues.map((entry) => issue("foundation_incompatible", entry.message, entry.field)));
}

export function validateDecisionStateForComparison(state: DecisionState | null, label: string): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!state) {
    issues.push(issue("missing_state", `${label} DecisionState is missing.`, label));
    return result(issues);
  }
  if (state.readOnly !== true) {
    issues.push(issue("state_incompatible", `${label} DecisionState must be read-only.`, label));
  }
  if (state.stateVersion !== DECISION_STATE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("state_incompatible", `${label} DecisionState version must be APP-6/5.`, label));
  }
  return result(issues);
}

export function validateComparisonInput(input: DecisionComparisonInput): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!input.leftDecisionId.trim()) {
    issues.push(issue("missing_field", "leftDecisionId is required.", "leftDecisionId"));
  }
  if (!input.rightDecisionId.trim()) {
    issues.push(issue("missing_field", "rightDecisionId is required.", "rightDecisionId"));
  }
  if (input.leftDecisionId && input.rightDecisionId && input.leftDecisionId === input.rightDecisionId) {
    issues.push(issue("same_decision", "Cannot compare a decision with itself.", "rightDecisionId"));
  }

  return result(issues);
}

export function validateWorkspaceIsolationForComparison(
  left: DecisionState,
  right: DecisionState,
  expectedWorkspaceId?: string
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (left.workspaceId !== right.workspaceId) {
    issues.push(
      issue(
        "workspace_isolation_violation",
        "Compared decisions must belong to the same workspace.",
        "workspaceId"
      )
    );
  }
  if (expectedWorkspaceId && left.workspaceId !== expectedWorkspaceId) {
    issues.push(
      issue(
        "workspace_isolation_violation",
        "Decision workspace does not match requested workspace.",
        "workspaceId"
      )
    );
  }

  return result(issues);
}

export function validateDecisionStatesForMultiComparison(states: readonly DecisionState[]): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (states.length < 2) {
    issues.push(issue("invalid_input", "At least two DecisionState objects are required.", "states"));
  }
  if (states.length > DECISION_COMPARISON_ENGINE_LIMITS.maxMultiComparisonStates) {
    issues.push(issue("invalid_input", "Too many states for multi-comparison.", "states"));
  }

  const decisionIds = new Set<string>();
  let workspaceId: string | null = null;

  for (const state of states) {
    issues.push(...validateDecisionStateForComparison(state, state.decisionId).issues);
    if (decisionIds.has(state.decisionId)) {
      issues.push(issue("duplicate_decision", `Duplicate decisionId: ${state.decisionId}.`, "states"));
    }
    decisionIds.add(state.decisionId);
    if (workspaceId === null) {
      workspaceId = state.workspaceId;
    } else if (workspaceId !== state.workspaceId) {
      issues.push(issue("workspace_isolation_violation", "All compared states must share a workspace.", "workspaceId"));
    }
  }

  return result(issues);
}

export function validateDecisionComparisonResult(comparison: DecisionComparison): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (comparison.readOnly !== true) {
    issues.push(issue("contract_violation", "Comparison must be read-only.", "readOnly"));
  }
  if (comparison.comparisonVersion !== DECISION_COMPARISON_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid comparisonVersion.", "comparisonVersion"));
  }
  if (!comparison.comparisonId.trim()) {
    issues.push(issue("missing_field", "comparisonId is required.", "comparisonId"));
  }
  if (comparison.leftDecisionId === comparison.rightDecisionId) {
    issues.push(issue("same_decision", "Comparison cannot reference the same decision twice.", "rightDecisionId"));
  }
  if (!Object.isFrozen(comparison)) {
    issues.push(issue("immutability_violation", "Comparison must be immutable.", "comparison"));
  }

  issues.push(
    ...validateWorkspaceIsolationForComparison(comparison.leftState, comparison.rightState).issues
  );

  return result(issues);
}

export function validateDecisionComparisonInput(
  input: DecisionComparisonInput,
  left: DecisionState | null,
  right: DecisionState | null
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  issues.push(...validateQueryCompatibilityForComparison().issues);
  issues.push(...validateComparisonInput(input).issues);
  issues.push(...validateDecisionStateForComparison(left, "left").issues);
  issues.push(...validateDecisionStateForComparison(right, "right").issues);

  if (left && right) {
    issues.push(...validateWorkspaceIsolationForComparison(left, right, input.workspaceId).issues);
  }

  return result(issues);
}

export const DecisionComparisonValidation = Object.freeze({
  validateQueryCompatibilityForComparison,
  validateFoundationCompatibilityForComparison,
  validateDecisionStateForComparison,
  validateComparisonInput,
  validateWorkspaceIsolationForComparison,
  validateDecisionStatesForMultiComparison,
  validateDecisionComparisonResult,
  validateDecisionComparisonInput,
});
