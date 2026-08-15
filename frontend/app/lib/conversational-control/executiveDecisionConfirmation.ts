/**
 * CC:10 — Pending decision confirmation (session-only).
 */

import type { NexoraDecisionTransitionAction } from "./executiveDecisionTransition.ts";

export const NEXORA_PENDING_DECISION_CONFIRMATION_STATUSES = Object.freeze([
  "pending",
  "confirmed",
  "cancelled",
  "expired",
] as const);

export type NexoraPendingDecisionConfirmationStatus =
  (typeof NEXORA_PENDING_DECISION_CONFIRMATION_STATUSES)[number];

export type NexoraPendingDecisionConfirmation = {
  readonly confirmationId: string;
  readonly candidateId: string;
  readonly requestedAction: NexoraDecisionTransitionAction;
  readonly workspaceId?: string | null;
  readonly modelId?: string | null;
  readonly scenarioId?: string | null;
  readonly scenarioRevision?: number | null;
  readonly createdFromCommandId: string;
  readonly status: NexoraPendingDecisionConfirmationStatus;
};

export function buildPendingDecisionConfirmation(input: {
  readonly candidateId: string;
  readonly requestedAction: NexoraDecisionTransitionAction;
  readonly commandId: string;
  readonly workspaceId?: string | null;
  readonly modelId?: string | null;
  readonly scenarioId?: string | null;
  readonly scenarioRevision?: number | null;
}): NexoraPendingDecisionConfirmation {
  return Object.freeze({
    confirmationId: `cc10:confirm:${input.candidateId}:${input.requestedAction}`,
    candidateId: input.candidateId,
    requestedAction: input.requestedAction,
    workspaceId: input.workspaceId ?? null,
    modelId: input.modelId ?? null,
    scenarioId: input.scenarioId ?? null,
    scenarioRevision: input.scenarioRevision ?? null,
    createdFromCommandId: input.commandId,
    status: "pending" as const,
  });
}

export function isPendingDecisionConfirmationStale(input: {
  readonly pending: NexoraPendingDecisionConfirmation;
  readonly workspaceId?: string | null;
  readonly modelId?: string | null;
  readonly scenarioRevisionById?: Readonly<Record<string, number>>;
}): boolean {
  const { pending } = input;
  if (pending.status !== "pending") return true;
  if (
    pending.workspaceId != null &&
    input.workspaceId != null &&
    pending.workspaceId !== input.workspaceId
  ) {
    return true;
  }
  if (
    pending.modelId != null &&
    input.modelId != null &&
    pending.modelId !== input.modelId
  ) {
    return true;
  }
  if (
    pending.scenarioId != null &&
    pending.scenarioRevision != null &&
    input.scenarioRevisionById
  ) {
    const live = input.scenarioRevisionById[pending.scenarioId];
    if (live != null && live !== pending.scenarioRevision) return true;
  }
  return false;
}
