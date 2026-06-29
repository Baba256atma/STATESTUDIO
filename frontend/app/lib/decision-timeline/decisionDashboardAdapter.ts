/**
 * APP-6:9 — Decision Dashboard adapter.
 * Consumes only APP-6:6 Query, APP-6:7 Comparison, and APP-6:8 Replay engines.
 */

import { compareDecisions } from "./decisionComparisonEngine.ts";
import { getRegisteredDecisionComparison } from "./decisionComparisonRegistry.ts";
import type { DecisionComparison } from "./decisionComparisonTypes.ts";
import { createDecisionReplay, getReplaySnapshot } from "./decisionReplayEngine.ts";
import { getRegisteredDecisionReplay } from "./decisionReplayRegistry.ts";
import type { DecisionReplay, DecisionReplaySnapshot } from "./decisionReplayTypes.ts";
import {
  getActiveDecisions,
  getDecisionById,
  getRecentDecisions,
  getTerminalDecisions,
  listDecisionStates,
} from "./decisionQueryEngine.ts";
import type { DecisionQueryResponse } from "./decisionQueryTypes.ts";
import type { DecisionState } from "./decisionStateTypes.ts";
import type { DecisionId, DecisionWorkspaceId } from "./decisionTimelineTypes.ts";

export function fetchDashboardDecisionState(decisionId: DecisionId): DecisionState | null {
  return getDecisionById(decisionId);
}

export function fetchDashboardDecisionList(): DecisionQueryResponse {
  return listDecisionStates();
}

export function fetchDashboardActiveDecisions(): DecisionQueryResponse {
  return getActiveDecisions();
}

export function fetchDashboardTerminalDecisions(): DecisionQueryResponse {
  return getTerminalDecisions();
}

export function fetchDashboardRecentDecisions(limit: number = 10): DecisionQueryResponse {
  return getRecentDecisions(limit);
}

export function fetchDashboardComparison(
  leftDecisionId: DecisionId,
  rightDecisionId: DecisionId
): DecisionComparison | null {
  const response = compareDecisions(Object.freeze({ leftDecisionId, rightDecisionId }));
  return response.success ? response.data : null;
}

export function fetchDashboardComparisonById(comparisonId: string): DecisionComparison | null {
  return getRegisteredDecisionComparison(comparisonId);
}

export function fetchDashboardReplay(
  decisionId: DecisionId,
  workspaceId?: DecisionWorkspaceId
): DecisionReplay | null {
  const response = createDecisionReplay(Object.freeze({ decisionId, workspaceId }));
  return response.success ? response.data : null;
}

export function fetchDashboardReplayById(replayId: string): DecisionReplay | null {
  return getRegisteredDecisionReplay(replayId);
}

export function fetchDashboardReplaySnapshot(replayId: string): DecisionReplaySnapshot | null {
  return getReplaySnapshot(replayId);
}

export const DecisionDashboardAdapter = Object.freeze({
  fetchDashboardDecisionState,
  fetchDashboardDecisionList,
  fetchDashboardActiveDecisions,
  fetchDashboardTerminalDecisions,
  fetchDashboardRecentDecisions,
  fetchDashboardComparison,
  fetchDashboardComparisonById,
  fetchDashboardReplay,
  fetchDashboardReplayById,
  fetchDashboardReplaySnapshot,
});
