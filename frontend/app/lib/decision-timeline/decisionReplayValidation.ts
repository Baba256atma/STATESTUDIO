/**
 * APP-6:8 — Decision Replay validation.
 */

import { DECISION_QUERY_ENGINE_CONTRACT_VERSION } from "./decisionQueryTypes.ts";
import { isDecisionQueryEngineInitialized } from "./decisionQueryEngine.ts";
import {
  DECISION_REPLAY_CURSOR_ACTIONS,
  DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
  type DecisionReplay,
  type DecisionReplayCreateInput,
  type DecisionReplayCursorMove,
  type DecisionReplaySession,
  type DecisionValidationIssue,
  type DecisionValidationResult,
} from "./decisionReplayTypes.ts";
import { DECISION_HISTORY_ENGINE_CONTRACT_VERSION } from "./decisionHistoryTypes.ts";
import type { DecisionHistory, DecisionHistorySnapshot } from "./decisionHistoryTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import { validateDecisionTimelineFoundation } from "./decisionTimelineContracts.ts";

function issue(code: string, message: string, field?: string): DecisionValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function result(issues: DecisionValidationIssue[]): DecisionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateFoundationCompatibilityForReplay(timestamp: string): DecisionValidationResult {
  const report = validateDecisionTimelineFoundation(timestamp);
  if (report.valid) {
    return result([]);
  }
  return result(report.issues.map((entry) => issue("foundation_incompatible", entry.message, entry.field)));
}

export function validateQueryCompatibilityForReplay(): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!isDecisionQueryEngineInitialized()) {
    issues.push(issue("query_incompatible", "Decision Query Engine is not initialized.", "queryEngine"));
  }
  void DECISION_QUERY_ENGINE_CONTRACT_VERSION;
  return result(issues);
}

export function validateHistoryCompatibilityForReplay(
  history: DecisionHistory | null,
  snapshot: DecisionHistorySnapshot | null
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!history) {
    issues.push(issue("missing_history", "Decision history is missing.", "history"));
    return result(issues);
  }
  if (history.readOnly !== true) {
    issues.push(issue("history_incompatible", "Decision history must be read-only.", "history"));
  }
  if (history.historyVersion !== DECISION_HISTORY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("history_incompatible", "History version is incompatible with APP-6/3.", "historyVersion"));
  }
  if (!snapshot) {
    issues.push(issue("missing_history_snapshot", "Decision history snapshot is missing.", "historySnapshot"));
  }

  return result(issues);
}

export function validateDecisionStateForReplay(state: DecisionState | null): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];
  if (!state) {
    issues.push(issue("missing_state", "DecisionState is missing for replay.", "decisionId"));
  }
  return result(issues);
}

export function validateReplayCreateInput(input: DecisionReplayCreateInput): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!input.decisionId.trim()) {
    issues.push(issue("missing_field", "decisionId is required.", "decisionId"));
  }
  if (input.startIndex !== undefined) {
    if (!Number.isInteger(input.startIndex) || input.startIndex < 0) {
      issues.push(issue("invalid_cursor", "startIndex must be a non-negative integer.", "startIndex"));
    }
  }

  return result(issues);
}

export function validateReplaySession(session: DecisionReplaySession | null): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!session) {
    issues.push(issue("missing_replay", "Replay session not found.", "replayId"));
    return result(issues);
  }
  if (session.readOnly !== true) {
    issues.push(issue("contract_violation", "Replay session must be read-only.", "readOnly"));
  }
  if (session.cursorIndex < 0 || session.cursorIndex >= Math.max(session.events.length, 1)) {
    issues.push(issue("invalid_cursor", "Replay cursor is out of bounds.", "cursorIndex"));
  }

  return result(issues);
}

export function validateReplayCursorMove(
  move: DecisionReplayCursorMove,
  session: DecisionReplaySession | null
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (!move.replayId.trim()) {
    issues.push(issue("missing_field", "replayId is required.", "replayId"));
  }
  if (!(DECISION_REPLAY_CURSOR_ACTIONS as readonly string[]).includes(move.action)) {
    issues.push(issue("invalid_action", "Unsupported replay cursor action.", "action"));
  }

  issues.push(...validateReplaySession(session).issues);

  if (session && move.action === "jumpToIndex") {
    if (move.index === undefined || !Number.isInteger(move.index)) {
      issues.push(issue("invalid_cursor", "index is required for jumpToIndex.", "index"));
    } else if (move.index < 0 || move.index >= session.events.length) {
      issues.push(issue("invalid_cursor", "index is out of bounds.", "index"));
    }
  }

  if (session && move.action === "jumpToEvent") {
    if (!move.eventId?.trim()) {
      issues.push(issue("invalid_cursor", "eventId is required for jumpToEvent.", "eventId"));
    } else if (!session.events.some((event) => event.eventId === move.eventId)) {
      issues.push(issue("missing_event", "eventId not found in replay history.", "eventId"));
    }
  }

  return result(issues);
}

export function validateWorkspaceIsolationForReplay(
  state: DecisionState,
  history: DecisionHistory,
  expectedWorkspaceId?: string
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (state.workspaceId !== history.workspaceId) {
    issues.push(
      issue(
        "workspace_isolation_violation",
        "DecisionState workspace must match history workspace.",
        "workspaceId"
      )
    );
  }
  if (expectedWorkspaceId && state.workspaceId !== expectedWorkspaceId) {
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

export function validateDecisionReplay(replay: DecisionReplay): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  if (replay.readOnly !== true) {
    issues.push(issue("contract_violation", "Replay must be read-only.", "readOnly"));
  }
  if (replay.replayVersion !== DECISION_REPLAY_ENGINE_CONTRACT_VERSION) {
    issues.push(issue("invalid_version", "Invalid replayVersion.", "replayVersion"));
  }
  if (!Object.isFrozen(replay)) {
    issues.push(issue("immutability_violation", "Replay must be immutable.", "replay"));
  }
  if (replay.cursorIndex < 0 || replay.cursorIndex >= Math.max(replay.totalEvents, 1)) {
    issues.push(issue("invalid_cursor", "Replay cursor is out of bounds.", "cursorIndex"));
  }
  if (replay.totalEvents > 0 && !replay.currentEvent) {
    issues.push(issue("missing_event", "currentEvent is required when totalEvents > 0.", "currentEvent"));
  }

  return result(issues);
}

export function validateDecisionReplayCreate(
  input: DecisionReplayCreateInput,
  state: DecisionState | null,
  history: DecisionHistory | null,
  snapshot: DecisionHistorySnapshot | null
): DecisionValidationResult {
  const issues: DecisionValidationIssue[] = [];

  issues.push(...validateQueryCompatibilityForReplay().issues);
  issues.push(...validateReplayCreateInput(input).issues);
  issues.push(...validateDecisionStateForReplay(state).issues);
  issues.push(...validateHistoryCompatibilityForReplay(history, snapshot).issues);

  if (state && history) {
    issues.push(...validateWorkspaceIsolationForReplay(state, history, input.workspaceId).issues);
  }

  if (history && input.startIndex !== undefined && input.startIndex >= history.eventCount) {
    issues.push(issue("invalid_cursor", "startIndex exceeds history event count.", "startIndex"));
  }

  return result(issues);
}

export const DecisionReplayValidation = Object.freeze({
  validateFoundationCompatibilityForReplay,
  validateQueryCompatibilityForReplay,
  validateHistoryCompatibilityForReplay,
  validateDecisionStateForReplay,
  validateReplayCreateInput,
  validateReplaySession,
  validateReplayCursorMove,
  validateWorkspaceIsolationForReplay,
  validateDecisionReplay,
  validateDecisionReplayCreate,
});
