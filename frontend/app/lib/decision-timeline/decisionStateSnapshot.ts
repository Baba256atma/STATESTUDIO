/**
 * APP-6:5 — Decision State snapshot builder.
 * Immutable consumer snapshots — no persistence.
 */

import type { DecisionState, DecisionStateSnapshot } from "./decisionStateTypes.ts";

export function createDecisionStateSnapshotId(
  decisionId: string,
  workspaceId: string,
  generatedAt: string
): string {
  const normalizedTime = generatedAt.replace(/[:.]/g, "-");
  return `decision-state-snapshot-${workspaceId}-${decisionId}-${normalizedTime}`;
}

export function buildDecisionStateSnapshot(state: DecisionState): DecisionStateSnapshot {
  return Object.freeze({
    snapshotId: createDecisionStateSnapshotId(state.decisionId, state.workspaceId, state.generatedAt),
    decisionId: state.decisionId,
    workspaceId: state.workspaceId,
    currentLifecycle: state.currentLifecycle,
    currentStatus: state.currentStatus,
    currentVersion: state.currentVersion,
    latestEventId: state.latestEventId,
    latestTimestamp: state.latestTimestamp,
    isTerminal: state.isTerminal,
    isValid: state.isValid,
    validationMessages: Object.freeze([...state.validationMessages]),
    historyVersion: state.historyVersion,
    generatedAt: state.generatedAt,
    readOnly: true as const,
  });
}

export const DecisionStateSnapshotBuilder = Object.freeze({
  buildDecisionStateSnapshot,
  createDecisionStateSnapshotId,
});
