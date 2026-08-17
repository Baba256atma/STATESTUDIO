/** CC:11 canonical execution eligibility and transition policy. */

import type { NexoraExecutiveDecisionStatus } from "./executiveDecisionTransition.ts";

export const NEXORA_EXECUTION_STATUSES = Object.freeze([
  "planned",
  "ready",
  "in-progress",
  "blocked",
  "at-risk",
  "completed",
  "cancelled",
] as const);

export type NexoraExecutiveExecutionStatus =
  (typeof NEXORA_EXECUTION_STATUSES)[number];

export type NexoraExecutionTransitionAction =
  | "prepare"
  | "start"
  | "block"
  | "mark-at-risk"
  | "resume"
  | "complete"
  | "cancel";

const TARGET: Readonly<Record<NexoraExecutionTransitionAction, NexoraExecutiveExecutionStatus>> =
  Object.freeze({
    prepare: "ready",
    start: "in-progress",
    block: "blocked",
    "mark-at-risk": "at-risk",
    resume: "in-progress",
    complete: "completed",
    cancel: "cancelled",
  });

const LEGAL = Object.freeze({
  planned: Object.freeze(["ready", "cancelled"]),
  ready: Object.freeze(["in-progress", "cancelled"]),
  "in-progress": Object.freeze(["blocked", "at-risk", "completed", "cancelled"]),
  blocked: Object.freeze(["in-progress", "cancelled"]),
  "at-risk": Object.freeze(["in-progress", "blocked", "completed", "cancelled"]),
  completed: Object.freeze([]),
  cancelled: Object.freeze([]),
} satisfies Record<NexoraExecutiveExecutionStatus, readonly NexoraExecutiveExecutionStatus[]>);

export function assessDecisionExecutionEligibility(status: NexoraExecutiveDecisionStatus): {
  readonly eligible: boolean;
  readonly reason: string;
} {
  return status === "Approved"
    ? Object.freeze({ eligible: true, reason: "execution-decision-approved" })
    : Object.freeze({ eligible: false, reason: "execution-decision-not-approved" });
}

export function executionTransitionTarget(action: NexoraExecutionTransitionAction): NexoraExecutiveExecutionStatus {
  return TARGET[action];
}

export function isExecutionTransitionAllowed(
  current: NexoraExecutiveExecutionStatus,
  action: NexoraExecutionTransitionAction,
): boolean {
  const target = TARGET[action];
  return current === target || (LEGAL[current] as readonly NexoraExecutiveExecutionStatus[]).includes(target);
}

export function executionMutationRequiresConfirmation(
  action: NexoraExecutionTransitionAction,
): boolean {
  return action === "complete" || action === "cancel";
}
