/**
 * APP-6:8 — Decision Replay snapshot builder.
 */

import type { DecisionReplay, DecisionReplaySnapshot } from "./decisionReplayTypes.ts";

export function createDecisionReplaySnapshotId(replayId: string, capturedAt: string): string {
  const normalizedTime = capturedAt.replace(/[:.]/g, "-");
  return `decision-replay-snapshot-${replayId}-${normalizedTime}`;
}

export function buildDecisionReplaySnapshot(
  replay: DecisionReplay,
  capturedAt: string = replay.generatedAt
): DecisionReplaySnapshot {
  return Object.freeze({
    snapshotId: createDecisionReplaySnapshotId(replay.replayId, capturedAt),
    replayId: replay.replayId,
    decisionId: replay.decisionId,
    workspaceId: replay.workspaceId,
    historyVersion: replay.historyVersion,
    cursorIndex: replay.cursorIndex,
    currentEventId: replay.currentEvent?.eventId ?? null,
    totalEvents: replay.totalEvents,
    isFirst: replay.isFirst,
    isLast: replay.isLast,
    capturedAt,
    readOnly: true as const,
  });
}

export function freezeDecisionReplaySnapshot(snapshot: DecisionReplaySnapshot): DecisionReplaySnapshot {
  return Object.freeze({
    ...snapshot,
    readOnly: true as const,
  });
}

export const DecisionReplaySnapshotBuilder = Object.freeze({
  buildDecisionReplaySnapshot,
  freezeDecisionReplaySnapshot,
  createDecisionReplaySnapshotId,
});
