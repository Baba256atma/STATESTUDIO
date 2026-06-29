/**
 * APP-6:4 — Decision Lifecycle snapshot builder.
 * Immutable read-only lifecycle snapshots — no persistence.
 */

import {
  resolveDecisionStatusFromLifecycle,
  isTerminalLifecycleState,
} from "./decisionLifecycleRules.ts";
import {
  DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
  type DecisionLifecycle,
  type DecisionLifecycleSnapshot,
} from "./decisionLifecycleTypes.ts";

export function buildDecisionLifecycleSnapshot(
  lifecycle: DecisionLifecycle,
  generatedAt: string = new Date(0).toISOString()
): DecisionLifecycleSnapshot {
  return Object.freeze({
    decisionId: lifecycle.decisionId,
    workspaceId: lifecycle.workspaceId,
    currentLifecycle: lifecycle.currentLifecycle,
    previousLifecycle: lifecycle.previousLifecycle,
    transitionCount: lifecycle.transitionCount,
    isTerminal:
      lifecycle.currentLifecycle !== null &&
      (isTerminalLifecycleState(lifecycle.currentLifecycle) ||
        lifecycle.currentLifecycle === "completed"),
    isValid: lifecycle.isValid,
    validationMessages: Object.freeze([...lifecycle.validationMessages]),
    historyVersion: lifecycle.historyVersion,
    generatedAt,
    readOnly: true as const,
  });
}

export function createLifecycleSnapshotSummary(lifecycle: DecisionLifecycle): Readonly<{
  decisionId: string;
  currentLifecycle: DecisionLifecycle["currentLifecycle"];
  currentStatus: ReturnType<typeof resolveDecisionStatusFromLifecycle>;
  lifecycleVersion: typeof DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION;
  readOnly: true;
}> {
  return Object.freeze({
    decisionId: lifecycle.decisionId,
    currentLifecycle: lifecycle.currentLifecycle,
    currentStatus: resolveDecisionStatusFromLifecycle(lifecycle.currentLifecycle),
    lifecycleVersion: DECISION_LIFECYCLE_ENGINE_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export const DecisionLifecycleSnapshotBuilder = Object.freeze({
  buildDecisionLifecycleSnapshot,
  createLifecycleSnapshotSummary,
});
