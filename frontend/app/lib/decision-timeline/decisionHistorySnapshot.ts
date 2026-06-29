/**
 * APP-6:3 — Decision History snapshot builder.
 * Immutable read-only history snapshots — no persistence.
 */

import {
  createDecisionHistoryId,
  DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
  type DecisionHistory,
  type DecisionHistorySnapshot,
} from "./decisionHistoryTypes.ts";
import { freezeDecisionHistory } from "./decisionHistoryBuilder.ts";

export function createDecisionHistorySnapshotId(
  decisionId: string,
  workspaceId: string,
  capturedAt: string
): string {
  const normalizedTime = capturedAt.replace(/[:.]/g, "-");
  return `decision-history-snapshot-${workspaceId}-${decisionId}-${normalizedTime}`;
}

export function buildDecisionHistorySnapshot(
  history: DecisionHistory,
  capturedAt: string = history.updatedAt ?? history.createdAt ?? new Date(0).toISOString()
): DecisionHistorySnapshot {
  const frozenHistory = freezeDecisionHistory(history);

  return Object.freeze({
    snapshotId: createDecisionHistorySnapshotId(frozenHistory.decisionId, frozenHistory.workspaceId, capturedAt),
    decisionId: frozenHistory.decisionId,
    workspaceId: frozenHistory.workspaceId,
    historyVersion: DECISION_HISTORY_ENGINE_CONTRACT_VERSION,
    eventCount: frozenHistory.eventCount,
    currentLifecycle: frozenHistory.currentLifecycle,
    firstEventId: frozenHistory.firstEvent?.eventId ?? null,
    latestEventId: frozenHistory.latestEvent?.eventId ?? null,
    createdAt: frozenHistory.createdAt,
    updatedAt: frozenHistory.updatedAt,
    capturedAt,
    readOnly: true as const,
  });
}

export const DecisionHistorySnapshotBuilder = Object.freeze({
  buildDecisionHistorySnapshot,
  createDecisionHistorySnapshotId,
});
