/**
 * APP-6:4 — Decision Lifecycle transition rules.
 * Validation only — no workflow execution or history mutation.
 */

import { DECISION_ENGINE_LIFECYCLE_KEYS } from "./decisionEventTypes.ts";
import type { DecisionEngineLifecycle } from "./decisionEventTypes.ts";
import type { DecisionStatus } from "./decisionTimelineTypes.ts";
import type { DecisionLifecycleTransitionValidation } from "./decisionLifecycleTypes.ts";
import { isDecisionEngineLifecycle } from "./decisionEventValidation.ts";

export const DECISION_LIFECYCLE_INITIAL_STATE = "proposed" as const satisfies DecisionEngineLifecycle;

export const DECISION_LIFECYCLE_TERMINAL_STATES = Object.freeze([
  "rejected",
  "cancelled",
  "superseded",
  "archived",
] as const satisfies readonly DecisionEngineLifecycle[]);

export const DECISION_LIFECYCLE_REPEATABLE_STATES = Object.freeze([
  "evaluated",
] as const satisfies readonly DecisionEngineLifecycle[]);

export const DECISION_LIFECYCLE_ALLOWED_TRANSITIONS = Object.freeze({
  proposed: Object.freeze(["evaluated", "cancelled"]),
  evaluated: Object.freeze(["approved", "rejected", "cancelled", "superseded"]),
  approved: Object.freeze(["executed", "cancelled", "superseded"]),
  rejected: Object.freeze([]),
  cancelled: Object.freeze([]),
  superseded: Object.freeze([]),
  executed: Object.freeze(["completed", "cancelled"]),
  completed: Object.freeze(["archived"]),
  archived: Object.freeze([]),
} as const satisfies Readonly<Record<DecisionEngineLifecycle, readonly DecisionEngineLifecycle[]>>);

export const DECISION_LIFECYCLE_TO_STATUS_MAP = Object.freeze({
  proposed: "proposed",
  evaluated: "proposed",
  approved: "committed",
  rejected: "revoked",
  cancelled: "deferred",
  superseded: "superseded",
  executed: "committed",
  completed: "committed",
  archived: "committed",
} as const satisfies Readonly<Record<DecisionEngineLifecycle, DecisionStatus>>);

export function getLifecycleStateIndex(lifecycle: DecisionEngineLifecycle): number {
  return (DECISION_ENGINE_LIFECYCLE_KEYS as readonly DecisionEngineLifecycle[]).indexOf(lifecycle);
}

export function isTerminalLifecycleState(lifecycle: DecisionEngineLifecycle): boolean {
  return (DECISION_LIFECYCLE_TERMINAL_STATES as readonly string[]).includes(lifecycle);
}

export function isRepeatableLifecycleState(lifecycle: DecisionEngineLifecycle): boolean {
  return (DECISION_LIFECYCLE_REPEATABLE_STATES as readonly string[]).includes(lifecycle);
}

export function resolveDecisionStatusFromLifecycle(
  lifecycle: DecisionEngineLifecycle | null
): DecisionStatus {
  if (!lifecycle) {
    return "draft";
  }
  return DECISION_LIFECYCLE_TO_STATUS_MAP[lifecycle];
}

export function validateDecisionLifecycleTransition(
  fromLifecycle: DecisionEngineLifecycle | null,
  toLifecycle: DecisionEngineLifecycle,
  options?: Readonly<{ lifecycleOccurrences?: Readonly<Record<string, number>> }>
): DecisionLifecycleTransitionValidation {
  if (!isDecisionEngineLifecycle(toLifecycle)) {
    return Object.freeze({
      valid: false,
      fromLifecycle,
      toLifecycle,
      reason: "Target lifecycle is not in the APP-6:2 vocabulary.",
      readOnly: true as const,
    });
  }

  if (fromLifecycle === null) {
    const valid = toLifecycle === DECISION_LIFECYCLE_INITIAL_STATE;
    return Object.freeze({
      valid,
      fromLifecycle,
      toLifecycle,
      reason: valid ? "Initial lifecycle transition is valid." : "Lifecycle must begin with proposed.",
      readOnly: true as const,
    });
  }

  if (!isDecisionEngineLifecycle(fromLifecycle)) {
    return Object.freeze({
      valid: false,
      fromLifecycle,
      toLifecycle,
      reason: "Source lifecycle is not in the APP-6:2 vocabulary.",
      readOnly: true as const,
    });
  }

  if (fromLifecycle === toLifecycle && isRepeatableLifecycleState(toLifecycle)) {
    return Object.freeze({
      valid: true,
      fromLifecycle,
      toLifecycle,
      reason: "Repeatable lifecycle transition is valid.",
      readOnly: true as const,
    });
  }

  if (isTerminalLifecycleState(fromLifecycle) && toLifecycle !== fromLifecycle) {
    return Object.freeze({
      valid: false,
      fromLifecycle,
      toLifecycle,
      reason: `Terminal lifecycle ${fromLifecycle} cannot transition forward.`,
      readOnly: true as const,
    });
  }

  const allowed = DECISION_LIFECYCLE_ALLOWED_TRANSITIONS[fromLifecycle] as readonly string[];
  if (!allowed.includes(toLifecycle)) {
    return Object.freeze({
      valid: false,
      fromLifecycle,
      toLifecycle,
      reason: `Invalid transition: ${fromLifecycle} → ${toLifecycle}.`,
      readOnly: true as const,
    });
  }

  if (toLifecycle === fromLifecycle && !isRepeatableLifecycleState(toLifecycle)) {
    return Object.freeze({
      valid: false,
      fromLifecycle,
      toLifecycle,
      reason: `Lifecycle ${toLifecycle} does not allow duplicate transitions.`,
      readOnly: true as const,
    });
  }

  const occurrences = options?.lifecycleOccurrences?.[toLifecycle] ?? 0;
  if (
    toLifecycle === fromLifecycle &&
    !isRepeatableLifecycleState(toLifecycle) &&
    occurrences > 0
  ) {
    return Object.freeze({
      valid: false,
      fromLifecycle,
      toLifecycle,
      reason: `Duplicate lifecycle ${toLifecycle} is not allowed.`,
      readOnly: true as const,
    });
  }

  return Object.freeze({
    valid: true,
    fromLifecycle,
    toLifecycle,
    reason: "Lifecycle transition is valid.",
    readOnly: true as const,
  });
}

export const DecisionLifecycleRules = Object.freeze({
  getLifecycleStateIndex,
  isTerminalLifecycleState,
  isRepeatableLifecycleState,
  resolveDecisionStatusFromLifecycle,
  validateDecisionLifecycleTransition,
});
