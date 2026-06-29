/**
 * APP-6:6 — Decision Query snapshot builder.
 * Immutable query result snapshots — no persistence.
 */

import type { DecisionQueryResult, DecisionQuerySnapshot } from "./decisionQueryTypes.ts";

export function createDecisionQuerySnapshotId(
  queryId: string,
  capturedAt: string
): string {
  const normalizedTime = capturedAt.replace(/[:.]/g, "-");
  return `decision-query-snapshot-${queryId}-${normalizedTime}`;
}

export function buildDecisionQuerySnapshot(
  result: DecisionQueryResult,
  capturedAt: string = result.queryTimestamp
): DecisionQuerySnapshot {
  return Object.freeze({
    snapshotId: createDecisionQuerySnapshotId(result.queryId, capturedAt),
    queryId: result.queryId,
    filters: Object.freeze({ ...result.filters }),
    sort: Object.freeze({ ...result.sort }),
    states: Object.freeze([...result.states]),
    totalCount: result.totalCount,
    capturedAt,
    readOnly: true as const,
  });
}

export function freezeDecisionQuerySnapshot(snapshot: DecisionQuerySnapshot): DecisionQuerySnapshot {
  return Object.freeze({
    ...snapshot,
    filters: Object.freeze({ ...snapshot.filters }),
    sort: Object.freeze({ ...snapshot.sort }),
    states: Object.freeze([...snapshot.states]),
    readOnly: true as const,
  });
}

export const DecisionQuerySnapshotBuilder = Object.freeze({
  buildDecisionQuerySnapshot,
  freezeDecisionQuerySnapshot,
  createDecisionQuerySnapshotId,
});
