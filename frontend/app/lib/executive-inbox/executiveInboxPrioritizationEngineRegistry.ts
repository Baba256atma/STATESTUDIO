/**
 * APP-11:3 — Executive Inbox Prioritization Engine immutable registry.
 */

import {
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_LIMITS,
} from "./executiveInboxPrioritizationEngineConstants.ts";
import type { InboxWorkspaceId } from "./executiveInboxAggregationEngineTypes.ts";
import type {
  ExecutiveInboxPriority,
  PrioritizationEngineResult,
  PrioritizationRegistrySnapshot,
  PriorityId,
} from "./executiveInboxPrioritizationEngineTypes.ts";
import { validateExecutivePriority } from "./executiveInboxPrioritizationEngineValidation.ts";

const priorityRegistry = new Map<PriorityId, ExecutiveInboxPriority>();
const workspaceIndex = new Map<InboxWorkspaceId, Set<PriorityId>>();

function indexPriority(priority: ExecutiveInboxPriority): void {
  const ids = workspaceIndex.get(priority.workspaceId) ?? new Set<PriorityId>();
  ids.add(priority.priorityId);
  workspaceIndex.set(priority.workspaceId, ids);
}

function unindexPriority(priority: ExecutiveInboxPriority): void {
  const ids = workspaceIndex.get(priority.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(priority.priorityId);
  if (ids.size === 0) {
    workspaceIndex.delete(priority.workspaceId);
  }
}

export function resetExecutiveInboxPrioritizationEngineRegistryForTests(): void {
  priorityRegistry.clear();
  workspaceIndex.clear();
}

export function priorityExists(priorityId: PriorityId): boolean {
  return priorityRegistry.has(priorityId);
}

export function registerPriority(priority: ExecutiveInboxPriority): PrioritizationEngineResult<ExecutiveInboxPriority> {
  const validation = validateExecutivePriority(priority);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: Object.freeze({
        code: "validation_failure",
        message: validation.issues.map((entry) => entry.message).join("; "),
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (priorityRegistry.has(priority.priorityId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate priority id: ${priority.priorityId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_priority",
        message: "Duplicate priority id.",
        field: "priorityId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (priorityRegistry.size >= EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_LIMITS.maxRegisteredPriorities) {
    return Object.freeze({
      success: false,
      reason: "Priority registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Priority registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  priorityRegistry.set(priority.priorityId, priority);
  indexPriority(priority);
  return Object.freeze({
    success: true,
    reason: "Executive inbox priority registered.",
    data: priority,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterPriority(priorityId: PriorityId): PrioritizationEngineResult<PriorityId> {
  const existing = priorityRegistry.get(priorityId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Priority not found: ${priorityId}.`,
      data: null,
      error: Object.freeze({
        code: "not_found",
        message: "Priority not found.",
        field: "priorityId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  priorityRegistry.delete(priorityId);
  unindexPriority(existing);
  return Object.freeze({
    success: true,
    reason: "Executive inbox priority unregistered.",
    data: priorityId,
    error: null,
    readOnly: true as const,
  });
}

export function getPriority(priorityId: PriorityId): ExecutiveInboxPriority | null {
  return priorityRegistry.get(priorityId) ?? null;
}

export function getPriorities(workspaceId?: InboxWorkspaceId): readonly ExecutiveInboxPriority[] {
  const sortByScore = (left: ExecutiveInboxPriority, right: ExecutiveInboxPriority): number => {
    const scoreDelta = right.weightedScore - left.weightedScore;
    if (scoreDelta !== 0) {
      return scoreDelta;
    }
    return left.priorityId.localeCompare(right.priorityId);
  };

  if (!workspaceId) {
    return Object.freeze([...priorityRegistry.values()].sort(sortByScore));
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((priorityId) => priorityRegistry.get(priorityId))
      .filter((entry): entry is ExecutiveInboxPriority => entry !== undefined)
      .sort(sortByScore)
  );
}

export function getPriorityRegistrySnapshot(): PrioritizationRegistrySnapshot {
  const priorityIds = Object.freeze([...priorityRegistry.keys()].sort());
  return Object.freeze({
    registryVersion: EXECUTIVE_INBOX_PRIORITIZATION_ENGINE_CONTRACT_VERSION,
    priorityCount: priorityRegistry.size,
    priorityIds,
    readOnly: true as const,
  });
}

export const ExecutiveInboxPrioritizationEngineRegistry = Object.freeze({
  resetExecutiveInboxPrioritizationEngineRegistryForTests,
  priorityExists,
  registerPriority,
  unregisterPriority,
  getPriority,
  getPriorities,
  getPriorityRegistrySnapshot,
});
