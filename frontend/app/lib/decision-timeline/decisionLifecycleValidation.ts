/**
 * APP-6:4 — Decision Lifecycle validation.
 * Derives and validates lifecycle state from immutable decision history.
 */

import { DECISION_EVENT_ENGINE_CONTRACT_VERSION } from "./decisionEventTypes.ts";
import type { DecisionEngineEvent, DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import { validateDecisionEvent } from "./decisionEventValidation.ts";
import {
  DECISION_LIFECYCLE_INITIAL_STATE,
  isTerminalLifecycleState,
  validateDecisionLifecycleTransition,
} from "./decisionLifecycleRules.ts";
import {
  DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  type DecisionLifecycle,
  type DecisionLifecycleTransitionRecord,
  type DecisionValidationIssue,
  type DecisionValidationResult,
} from "./decisionLifecycleTypes.ts";
import type { DecisionHistory } from "./decisionHistoryTypes.ts";
import { validateDecisionHistory } from "./decisionHistoryBuilder.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import { DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./decisionTimelineConstants.ts";
import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export type DecisionHistoryLifecycleAnalysis = Readonly<{
  transitionHistory: readonly DecisionLifecycleTransitionRecord[];
  validationResult: DecisionValidationResult;
  currentLifecycle: DecisionEngineLifecycle | null;
  previousLifecycle: DecisionEngineLifecycle | null;
  lifecycleOccurrences: Readonly<Record<string, number>>;
  readOnly: true;
}>;

export function analyzeDecisionHistoryForLifecycle(
  history: DecisionHistory
): DecisionHistoryLifecycleAnalysis {
  const issues: DecisionValidationIssue[] = [];
  const transitionHistory: DecisionLifecycleTransitionRecord[] = [];
  const lifecycleOccurrences: Record<string, number> = {};

  if (!history || history.eventCount === 0) {
    return Object.freeze({
      transitionHistory: Object.freeze([]),
      validationResult: result([issue("missing_history", "Decision history is required.", "history")]),
      currentLifecycle: null,
      previousLifecycle: null,
      lifecycleOccurrences: Object.freeze({}),
      readOnly: true as const,
    });
  }

  const historyValidation = validateDecisionHistory(history);
  if (!historyValidation.valid) {
    issues.push(...historyValidation.issues);
  }

  if (history.historyVersion !== DECISION_HISTORY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("history_incompatible", "History version is incompatible with APP-6:3.", "historyVersion"));
  }

  const orderedEvents = history.orderedEvents;
  let currentLifecycle: DecisionEngineLifecycle | null = null;
  let previousLifecycle: DecisionEngineLifecycle | null = null;

  for (const event of orderedEvents) {
    const eventValidation = validateDecisionEvent(event);
    if (!eventValidation.valid) {
      issues.push(...eventValidation.issues.map((entry) => issue(entry.code, entry.message, entry.field)));
    }

    if (event.workspaceId !== history.workspaceId) {
      issues.push(issue("workspace_isolation_violation", "Event workspaceId must match history workspaceId.", "workspaceId"));
    }
    if (event.decisionId !== history.decisionId) {
      issues.push(issue("identity_mismatch", "Event decisionId must match history decisionId.", "decisionId"));
    }
    if (event.platformVersion !== DECISION_EVENT_ENGINE_CONTRACT_VERSION) {
      issues.push(issue("engine_incompatible", `Event ${event.eventId} is incompatible with APP-6:2.`, "platformVersion"));
    }
  }

  for (const event of orderedEvents) {
    const transition = validateDecisionLifecycleTransition(currentLifecycle, event.lifecycle, {
      lifecycleOccurrences: Object.freeze({ ...lifecycleOccurrences }),
    });

    transitionHistory.push(
      Object.freeze({
        fromLifecycle: currentLifecycle,
        toLifecycle: event.lifecycle,
        eventId: event.eventId,
        timestamp: event.timestamp,
        sequenceNumber: event.sequenceNumber,
        valid: transition.valid,
        readOnly: true as const,
      })
    );

    if (!transition.valid) {
      issues.push(issue("invalid_transition", transition.reason, "lifecycle"));
    } else {
      previousLifecycle = currentLifecycle;
      currentLifecycle = event.lifecycle;
      lifecycleOccurrences[event.lifecycle] = (lifecycleOccurrences[event.lifecycle] ?? 0) + 1;
    }
  }

  if (orderedEvents[0]?.lifecycle !== DECISION_LIFECYCLE_INITIAL_STATE) {
    issues.push(issue("missing_initial_lifecycle", "Lifecycle must begin with proposed.", "lifecycle"));
  }

  for (const [lifecycle, count] of Object.entries(lifecycleOccurrences)) {
    if (count > 1 && lifecycle !== "evaluated") {
      issues.push(
        issue("duplicate_lifecycle", `Duplicate lifecycle state detected: ${lifecycle}.`, "lifecycle")
      );
    }
  }

  if (currentLifecycle !== null && isTerminalLifecycleState(currentLifecycle)) {
    const lastTransition = transitionHistory.at(-1);
    if (lastTransition && !lastTransition.valid) {
      issues.push(issue("terminal_state_violation", "Terminal lifecycle reached via invalid transition.", "lifecycle"));
    }
  }

  return Object.freeze({
    transitionHistory: Object.freeze(transitionHistory),
    validationResult: result(issues),
    currentLifecycle,
    previousLifecycle,
    lifecycleOccurrences: Object.freeze({ ...lifecycleOccurrences }),
    readOnly: true as const,
  });
}

export function validateDecisionLifecycleShape(lifecycle: DecisionLifecycle): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (lifecycle.readOnly !== true) {
    issues.push(issue("contract_violation", "Lifecycle must be read-only.", "readOnly"));
  }
  if (lifecycle.lifecycleVersion !== DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_lifecycle_version", "Invalid lifecycleVersion.", "lifecycleVersion"));
  }
  if (lifecycle.transitionCount !== lifecycle.transitionHistory.length) {
    issues.push(issue("integrity_violation", "transitionCount must match transitionHistory length.", "transitionCount"));
  }
  if (lifecycle.isValid !== lifecycle.validationResult.valid) {
    issues.push(issue("integrity_violation", "isValid must match validationResult.valid.", "isValid"));
  }
  if (lifecycle.isTerminal && lifecycle.currentLifecycle !== null && !isTerminalLifecycleState(lifecycle.currentLifecycle)) {
    if (lifecycle.currentLifecycle !== "completed") {
      issues.push(issue("terminal_mismatch", "isTerminal flag inconsistent with current lifecycle.", "isTerminal"));
    }
  }

  return result(issues);
}

export function validateDecisionLifecycle(lifecycle: DecisionLifecycle): DecisionValidationResult {
  const shapeValidation = validateDecisionLifecycleShape(lifecycle);
  const issues = [...shapeValidation.issues, ...lifecycle.validationResult.issues];
  return result(issues);
}

export function validateFoundationCompatibilityForLifecycle(timestamp: string): DecisionValidationResult {
  const report = validateDecisionTimelineFoundation(timestamp);
  if (report.valid) {
    return result([]);
  }
  return result(
    report.issues.map((entry) => issue("foundation_incompatible", entry.message, entry.field))
  );
}

export function validateHistoryCompatibility(history: DecisionHistory): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  const validation = validateDecisionHistory(history);
  if (!validation.valid) {
    issues.push(...validation.issues);
  }
  if (history.readOnly !== true) {
    issues.push(issue("history_mutation_risk", "History must be read-only.", "readOnly"));
  }
  if (history.currentVersion?.foundationContractVersion !== DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(issue("foundation_incompatible", "History foundation version mismatch.", "currentVersion"));
  }
  return result(issues);
}

export const DecisionLifecycleValidation = Object.freeze({
  analyzeDecisionHistoryForLifecycle,
  validateDecisionLifecycle,
  validateDecisionLifecycleShape,
  validateFoundationCompatibilityForLifecycle,
  validateHistoryCompatibility,
});
