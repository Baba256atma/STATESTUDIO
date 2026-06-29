/**
 * APP-6:7 — Decision Comparison snapshot builder.
 */

import type { DecisionComparison, DecisionComparisonSnapshot } from "./decisionComparisonTypes.ts";

export function createDecisionComparisonSnapshotId(
  comparisonId: string,
  capturedAt: string
): string {
  const normalizedTime = capturedAt.replace(/[:.]/g, "-");
  return `decision-comparison-snapshot-${comparisonId}-${normalizedTime}`;
}

export function buildDecisionComparisonSnapshot(
  comparison: DecisionComparison,
  capturedAt: string = comparison.generatedAt
): DecisionComparisonSnapshot {
  return Object.freeze({
    snapshotId: createDecisionComparisonSnapshotId(comparison.comparisonId, capturedAt),
    comparisonId: comparison.comparisonId,
    leftDecisionId: comparison.leftDecisionId,
    rightDecisionId: comparison.rightDecisionId,
    lifecycleDiff: Object.freeze({ ...comparison.lifecycleDiff }),
    statusDiff: Object.freeze({ ...comparison.statusDiff }),
    versionDiff: Object.freeze({ ...comparison.versionDiff }),
    terminalDiff: Object.freeze({ ...comparison.terminalDiff }),
    validationDiff: Object.freeze({ ...comparison.validationDiff }),
    validationMessages: Object.freeze([...comparison.validationMessages]),
    capturedAt,
    readOnly: true as const,
  });
}

export const DecisionComparisonSnapshotBuilder = Object.freeze({
  buildDecisionComparisonSnapshot,
  createDecisionComparisonSnapshotId,
});
