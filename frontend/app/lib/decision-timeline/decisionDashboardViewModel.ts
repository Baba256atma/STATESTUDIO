/**
 * APP-6:9 — Decision Dashboard view model builder.
 * Formats certified engine outputs into dashboard-ready models.
 */

import {
  fetchDashboardActiveDecisions,
  fetchDashboardComparison,
  fetchDashboardComparisonById,
  fetchDashboardDecisionList,
  fetchDashboardDecisionState,
  fetchDashboardRecentDecisions,
  fetchDashboardReplay,
  fetchDashboardReplayById,
  fetchDashboardTerminalDecisions,
} from "./decisionDashboardAdapter.ts";
import type {
  DecisionDashboardComparisonSummary,
  DecisionDashboardIntegrationInput,
  DecisionDashboardModel,
  DecisionDashboardReplaySummary,
  DecisionDashboardStateSummary,
} from "./decisionDashboardTypes.ts";
import { DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION } from "./decisionDashboardTypes.ts";
import type { DecisionComparison } from "./decisionComparisonTypes.ts";
import type { DecisionReplay } from "./decisionReplayTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import type { DecisionValidationResult } from "./decisionTimelineTypes.ts";

function emptyValidation(): DecisionValidationResult {
  return Object.freeze({ valid: true, issues: Object.freeze([]), readOnly: true as const });
}

function invalidValidation(message: string): DecisionValidationResult {
  return Object.freeze({
    valid: false,
    issues: Object.freeze([
      Object.freeze({ code: "dashboard_adapter", message, readOnly: true as const }),
    ]),
    readOnly: true as const,
  });
}

export function mapDecisionStateSummary(state: DecisionState): DecisionDashboardStateSummary {
  return Object.freeze({
    decisionId: state.decisionId,
    workspaceId: state.workspaceId,
    status: state.currentStatus,
    lifecycle: state.currentLifecycle,
    isTerminal: state.isTerminal,
    isValid: state.isValid,
    currentVersion: state.currentVersion,
    latestTimestamp: state.latestTimestamp,
    readOnly: true as const,
  });
}

export function mapComparisonSummary(comparison: DecisionComparison): DecisionDashboardComparisonSummary {
  return Object.freeze({
    comparisonId: comparison.comparisonId,
    leftDecisionId: comparison.leftDecisionId,
    rightDecisionId: comparison.rightDecisionId,
    hasDifferences:
      comparison.lifecycleDiff.changed ||
      comparison.statusDiff.changed ||
      comparison.terminalDiff.changed,
    lifecycleChanged: comparison.lifecycleDiff.changed,
    statusChanged: comparison.statusDiff.changed,
    terminalChanged: comparison.terminalDiff.changed,
    messages: Object.freeze([...comparison.validationMessages]),
    readOnly: true as const,
  });
}

export function mapReplaySummary(replay: DecisionReplay): DecisionDashboardReplaySummary {
  return Object.freeze({
    replayId: replay.replayId,
    decisionId: replay.decisionId,
    cursorIndex: replay.cursorIndex,
    totalEvents: replay.totalEvents,
    currentEventId: replay.currentEvent?.eventId ?? null,
    isFirst: replay.isFirst,
    isLast: replay.isLast,
    readOnly: true as const,
  });
}

export function buildDecisionSummaryText(
  state: DecisionDashboardStateSummary | null,
  binding: DecisionDashboardModel["binding"]
): string {
  if (!state) {
    return `Decision dashboard binding: ${binding}.`;
  }
  return `Decision ${state.decisionId} is ${state.lifecycle ?? "unknown"} (${state.status}).`;
}

let modelSequence = 0;

function createModelId(binding: string, generatedAt: string): string {
  modelSequence += 1;
  const normalizedTime = generatedAt.replace(/[:.]/g, "-");
  return `decision-dashboard-${binding}-${normalizedTime}-${String(modelSequence).padStart(4, "0")}`;
}

export function resetDecisionDashboardModelSequenceForTests(): void {
  modelSequence = 0;
}

export function buildDecisionDashboardModelFromParts(input: {
  binding: DecisionDashboardModel["binding"];
  workspaceId: DecisionDashboardModel["workspaceId"];
  decisionState: DecisionDashboardStateSummary | null;
  decisionStates: readonly DecisionDashboardStateSummary[];
  comparisonSummary: DecisionDashboardComparisonSummary | null;
  replaySummary: DecisionDashboardReplaySummary | null;
  validation: DecisionValidationResult;
  generatedAt: string;
}): DecisionDashboardModel {
  const primary = input.decisionState ?? input.decisionStates[0] ?? null;
  return Object.freeze({
    modelId: createModelId(input.binding, input.generatedAt),
    binding: input.binding,
    workspaceId: input.workspaceId,
    decisionSummary: buildDecisionSummaryText(primary, input.binding),
    decisionState: input.decisionState,
    decisionStates: Object.freeze([...input.decisionStates]),
    comparisonSummary: input.comparisonSummary,
    replaySummary: input.replaySummary,
    status: primary?.status ?? null,
    lifecycle: primary?.lifecycle ?? null,
    validation: input.validation,
    generatedAt: input.generatedAt,
    contractVersion: DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function buildDecisionDashboardModelForInput(
  input: DecisionDashboardIntegrationInput,
  generatedAt: string
): DecisionDashboardModel | null {
  switch (input.binding) {
    case "single_decision": {
      if (!input.decisionId) {
        return null;
      }
      const state = fetchDashboardDecisionState(input.decisionId);
      if (!state) {
        return null;
      }
      const summary = mapDecisionStateSummary(state);
      return buildDecisionDashboardModelFromParts({
        binding: input.binding,
        workspaceId: summary.workspaceId,
        decisionState: summary,
        decisionStates: Object.freeze([]),
        comparisonSummary: null,
        replaySummary: null,
        validation: emptyValidation(),
        generatedAt,
      });
    }
    case "decision_list": {
      const query = fetchDashboardDecisionList();
      if (!query.success || !query.data) {
        return null;
      }
      const states = query.data.states.map(mapDecisionStateSummary);
      return buildDecisionDashboardModelFromParts({
        binding: input.binding,
        workspaceId: input.workspaceId ?? states[0]?.workspaceId ?? null,
        decisionState: states[0] ?? null,
        decisionStates: states,
        comparisonSummary: null,
        replaySummary: null,
        validation: emptyValidation(),
        generatedAt,
      });
    }
    case "active_decisions": {
      const query = fetchDashboardActiveDecisions();
      if (!query.success || !query.data) {
        return null;
      }
      const states = query.data.states.map(mapDecisionStateSummary);
      return buildDecisionDashboardModelFromParts({
        binding: input.binding,
        workspaceId: input.workspaceId ?? states[0]?.workspaceId ?? null,
        decisionState: states[0] ?? null,
        decisionStates: states,
        comparisonSummary: null,
        replaySummary: null,
        validation: emptyValidation(),
        generatedAt,
      });
    }
    case "terminal_decisions": {
      const query = fetchDashboardTerminalDecisions();
      if (!query.success || !query.data) {
        return null;
      }
      const states = query.data.states.map(mapDecisionStateSummary);
      return buildDecisionDashboardModelFromParts({
        binding: input.binding,
        workspaceId: input.workspaceId ?? states[0]?.workspaceId ?? null,
        decisionState: states[0] ?? null,
        decisionStates: states,
        comparisonSummary: null,
        replaySummary: null,
        validation: emptyValidation(),
        generatedAt,
      });
    }
    case "recent_decisions": {
      const query = fetchDashboardRecentDecisions(input.recentLimit ?? 10);
      if (!query.success || !query.data) {
        return null;
      }
      const states = query.data.states.map(mapDecisionStateSummary);
      return buildDecisionDashboardModelFromParts({
        binding: input.binding,
        workspaceId: input.workspaceId ?? states[0]?.workspaceId ?? null,
        decisionState: states[0] ?? null,
        decisionStates: states,
        comparisonSummary: null,
        replaySummary: null,
        validation: emptyValidation(),
        generatedAt,
      });
    }
    case "decision_comparison": {
      const comparison =
        (input.comparisonId ? fetchDashboardComparisonById(input.comparisonId) : null) ??
        (input.leftDecisionId && input.rightDecisionId
          ? fetchDashboardComparison(input.leftDecisionId, input.rightDecisionId)
          : null);
      if (!comparison) {
        return null;
      }
      const comparisonSummary = mapComparisonSummary(comparison);
      const leftSummary = mapDecisionStateSummary(comparison.leftState);
      const rightSummary = mapDecisionStateSummary(comparison.rightState);
      return buildDecisionDashboardModelFromParts({
        binding: input.binding,
        workspaceId: leftSummary.workspaceId,
        decisionState: leftSummary,
        decisionStates: Object.freeze([leftSummary, rightSummary]),
        comparisonSummary,
        replaySummary: null,
        validation: emptyValidation(),
        generatedAt,
      });
    }
    case "replay_summary": {
      const replay =
        (input.replayId ? fetchDashboardReplayById(input.replayId) : null) ??
        (input.decisionId ? fetchDashboardReplay(input.decisionId, input.workspaceId) : null);
      if (!replay) {
        return null;
      }
      const replaySummary = mapReplaySummary(replay);
      const state = fetchDashboardDecisionState(replay.decisionId);
      const decisionSummary = state ? mapDecisionStateSummary(state) : null;
      return buildDecisionDashboardModelFromParts({
        binding: input.binding,
        workspaceId: replaySummary ? state?.workspaceId ?? input.workspaceId ?? null : null,
        decisionState: decisionSummary,
        decisionStates: decisionSummary ? Object.freeze([decisionSummary]) : Object.freeze([]),
        comparisonSummary: null,
        replaySummary,
        validation: emptyValidation(),
        generatedAt,
      });
    }
    default:
      return null;
  }
}

export function buildDecisionDashboardSummaryFromModel(model: DecisionDashboardModel): string {
  const parts = [model.decisionSummary];
  if (model.comparisonSummary) {
    parts.push(
      `Comparison ${model.comparisonSummary.comparisonId}: ${model.comparisonSummary.hasDifferences ? "differences detected" : "no differences"}.`
    );
  }
  if (model.replaySummary) {
    parts.push(
      `Replay at event ${model.replaySummary.cursorIndex + 1} of ${model.replaySummary.totalEvents}.`
    );
  }
  return parts.join(" ");
}

export const DecisionDashboardViewModel = Object.freeze({
  mapDecisionStateSummary,
  mapComparisonSummary,
  mapReplaySummary,
  buildDecisionDashboardModelFromParts,
  buildDecisionDashboardModelForInput,
  buildDecisionDashboardSummaryFromModel,
});
