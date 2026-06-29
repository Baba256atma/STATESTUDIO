/**
 * APP-1:4 — Executive Time State Mutation.
 * Sole mutation entry for entity lifecycle state — authority contract enforced.
 */

import type {
  ExecutiveTimeApprovedTransitionInput,
  ExecutiveTimeStateMutationContract,
  ExecutiveTimeStateMutationResult,
} from "./executiveTimeTransitionAuthorityTypes.ts";
import { EXECUTIVE_TIME_STATE_MUTATION_OWNER } from "./executiveTimeTransitionAuthorityTypes.ts";
import { isKnownExecutiveTimeEntityType } from "./executiveTimeStateRegistry.ts";
import { isKnownState } from "./executiveTimeStateResolver.ts";
import type { ExecutiveTimeEntityType } from "./executiveTimeStateTypes.ts";

type EntityStateKey = `${string}:${ExecutiveTimeEntityType}:${string}`;

const entityStateStore = new Map<EntityStateKey, string>();

function nowIso(): string {
  return new Date().toISOString();
}

function entityKey(workspaceId: string, entityType: ExecutiveTimeEntityType, entityId: string): EntityStateKey {
  return `${workspaceId.trim()}:${entityType}:${entityId.trim()}`;
}

export function resetExecutiveTimeEntityStateStoreForTests(): void {
  entityStateStore.clear();
}

export function getExecutiveTimeEntityCurrentState(input: {
  workspaceId: string;
  entityType: ExecutiveTimeEntityType;
  entityId: string;
  fallbackState?: string;
}): string | null {
  const key = entityKey(input.workspaceId, input.entityType, input.entityId);
  const stored = entityStateStore.get(key);
  if (stored) return stored;
  return input.fallbackState ?? null;
}

export function applyApprovedTransition(input: ExecutiveTimeApprovedTransitionInput): ExecutiveTimeStateMutationResult {
  const result = input.authorityResult;
  const workspaceId = result.workspaceId.trim();
  const entityId = result.entityId.trim();
  const entityType = result.entityType;

  if (!result.approved || result.rejected) {
    return Object.freeze({
      success: false,
      workspaceId,
      entityId,
      entityType,
      previousState: result.currentState,
      currentState: result.currentState,
      appliedAt: input.timestamp,
      reason: "Mutation rejected: transition authority did not approve.",
      mutationOwner: EXECUTIVE_TIME_STATE_MUTATION_OWNER,
    });
  }

  if (!isKnownExecutiveTimeEntityType(entityType) || !isKnownState(entityType, result.requestedState)) {
    return Object.freeze({
      success: false,
      workspaceId,
      entityId,
      entityType,
      previousState: result.currentState,
      currentState: result.currentState,
      appliedAt: input.timestamp,
      reason: "Mutation rejected: requested state is invalid.",
      mutationOwner: EXECUTIVE_TIME_STATE_MUTATION_OWNER,
    });
  }

  const key = entityKey(workspaceId, entityType, entityId);
  const previousState = entityStateStore.get(key) ?? result.currentState;
  entityStateStore.set(key, result.requestedState);

  return Object.freeze({
    success: true,
    workspaceId,
    entityId,
    entityType,
    previousState,
    currentState: result.requestedState,
    appliedAt: input.timestamp,
    reason: result.reason,
    mutationOwner: EXECUTIVE_TIME_STATE_MUTATION_OWNER,
  });
}

export const ExecutiveTimeStateMutationContract: ExecutiveTimeStateMutationContract = Object.freeze({
  mutationOwner: EXECUTIVE_TIME_STATE_MUTATION_OWNER,
  applyApprovedTransition,
});
