/**
 * APP-6:5 — Decision State validation.
 * Validates derived state against APP-6:4 lifecycle contracts only.
 */

import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import {
  DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  type DecisionLifecycle,
} from "./decisionLifecycleTypes.ts";
import {
  DECISION_STATE_ENGINE_CONTRACT_VERSION,
  type DecisionState,
  type DecisionValidationIssue,
  type DecisionValidationResult,
} from "./decisionStateTypes.ts";
import { DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./decisionTimelineConstants.ts";
import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateLifecycleCompatibility(lifecycle: DecisionLifecycle): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (lifecycle.readOnly !== true) {
    issues.push(issue("lifecycle_mutation_risk", "Lifecycle must be read-only.", "readOnly"));
  }
  if (lifecycle.lifecycleVersion !== DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("lifecycle_incompatible", "Lifecycle version is incompatible with APP-6:4.", "lifecycleVersion"));
  }
  if (!lifecycle.decisionId.trim()) {
    issues.push(issue("missing_field", "decisionId is required on lifecycle.", "decisionId"));
  }
  if (!lifecycle.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required on lifecycle.", "workspaceId"));
  }

  return result(issues);
}

export function validateHistoryCompatibilityForState(lifecycle: DecisionLifecycle): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (lifecycle.historyVersion !== DECISION_HISTORY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("history_incompatible", "History version is incompatible with APP-6:3.", "historyVersion"));
  }

  return result(issues);
}

export function validateFoundationCompatibilityForState(timestamp: string): DecisionValidationResult {
  const report = validateDecisionTimelineFoundation(timestamp);
  if (report.valid) {
    return result([]);
  }
  return result(
    report.issues.map((entry) => issue("foundation_incompatible", entry.message, entry.field))
  );
}

export function validateEngineCompatibilityForState(lifecycle: DecisionLifecycle): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (lifecycle.validationResult.valid === false && lifecycle.isValid === true) {
    issues.push(issue("engine_incompatible", "Lifecycle isValid flag inconsistent with validation result.", "isValid"));
  }

  const lastTransition = lifecycle.transitionHistory.at(-1);
  if (lastTransition && lifecycle.currentLifecycle !== lastTransition.toLifecycle) {
    issues.push(
      issue(
        "lifecycle_incompatible",
        "currentLifecycle must match last transition toLifecycle.",
        "currentLifecycle"
      )
    );
  }

  void DECISION_EVENT_ENGINE_CONTRACT_VERSION;
  void DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION;

  return result(issues);
}

export function validateDecisionStateShape(state: DecisionState): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (state.readOnly !== true) {
    issues.push(issue("contract_violation", "Decision state must be read-only.", "readOnly"));
  }
  if (state.stateVersion !== DECISION_STATE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_state_version", "Invalid stateVersion.", "stateVersion"));
  }
  if (state.lifecycleVersion !== DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("lifecycle_incompatible", "Invalid lifecycleVersion on state.", "lifecycleVersion"));
  }
  if (state.historyVersion !== DECISION_HISTORY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("history_incompatible", "Invalid historyVersion on state.", "historyVersion"));
  }
  if (!state.decisionId.trim()) {
    issues.push(issue("missing_field", "decisionId is required.", "decisionId"));
  }
  if (!state.workspaceId.trim()) {
    issues.push(issue("missing_field", "workspaceId is required.", "workspaceId"));
  }
  if (!state.currentVersion.includes(String(state.historyVersion))) {
    issues.push(issue("version_inconsistent", "currentVersion must include historyVersion.", "currentVersion"));
  }
  if (!state.currentVersion.includes(String(state.lifecycleVersion))) {
    issues.push(issue("version_inconsistent", "currentVersion must include lifecycleVersion.", "currentVersion"));
  }
  if (!state.generatedAt.trim()) {
    issues.push(issue("missing_field", "generatedAt is required.", "generatedAt"));
  }

  return result(issues);
}

export function validateTerminalStateConsistency(state: DecisionState, lifecycle: DecisionLifecycle): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (state.isTerminal !== lifecycle.isTerminal) {
    issues.push(issue("terminal_inconsistent", "isTerminal must match lifecycle.isTerminal.", "isTerminal"));
  }
  if (state.isValid !== lifecycle.isValid) {
    issues.push(issue("validity_inconsistent", "isValid must match lifecycle.isValid.", "isValid"));
  }
  if (state.currentLifecycle !== lifecycle.currentLifecycle) {
    issues.push(issue("lifecycle_inconsistent", "currentLifecycle must match lifecycle.", "currentLifecycle"));
  }
  if (state.currentStatus !== lifecycle.currentStatus) {
    issues.push(issue("status_inconsistent", "currentStatus must match lifecycle.", "currentStatus"));
  }

  return result(issues);
}

export function validateWorkspaceIsolationForState(state: DecisionState, lifecycle: DecisionLifecycle): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (state.workspaceId !== lifecycle.workspaceId) {
    issues.push(issue("workspace_isolation_violation", "State workspaceId must match lifecycle.", "workspaceId"));
  }
  if (state.decisionId !== lifecycle.decisionId) {
    issues.push(issue("identity_mismatch", "State decisionId must match lifecycle.", "decisionId"));
  }

  return result(issues);
}

export function validateDecisionState(state: DecisionState, lifecycle: DecisionLifecycle): DecisionValidationResult {
  const issues = [
    ...validateDecisionStateShape(state).issues,
    ...validateLifecycleCompatibility(lifecycle).issues,
    ...validateHistoryCompatibilityForState(lifecycle).issues,
    ...validateEngineCompatibilityForState(lifecycle).issues,
    ...validateTerminalStateConsistency(state, lifecycle).issues,
    ...validateWorkspaceIsolationForState(state, lifecycle).issues,
  ];
  return result(issues);
}

export const DecisionStateValidation = Object.freeze({
  validateLifecycleCompatibility,
  validateHistoryCompatibilityForState,
  validateFoundationCompatibilityForState,
  validateEngineCompatibilityForState,
  validateDecisionStateShape,
  validateTerminalStateConsistency,
  validateWorkspaceIsolationForState,
  validateDecisionState,
});
