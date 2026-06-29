/**
 * APP-10:5 — Failure Learning Engine immutable registry.
 */

import { FAILURE_LEARNING_ENGINE_CONTRACT_VERSION, FAILURE_LEARNING_ENGINE_LIMITS } from "./failureLearningEngineConstants.ts";
import type {
  ExecutiveFailure,
  FailureEngineResult,
  FailureId,
  FailureRegistrySnapshot,
  FailureWorkspaceId,
} from "./failureLearningEngineTypes.ts";
import { validateExecutiveFailure } from "./failureLearningEngineValidation.ts";

const failureRegistry = new Map<FailureId, ExecutiveFailure>();
const workspaceIndex = new Map<FailureWorkspaceId, Set<FailureId>>();

function indexFailure(failure: ExecutiveFailure): void {
  const ids = workspaceIndex.get(failure.failure.workspaceId) ?? new Set<FailureId>();
  ids.add(failure.failure.failureId);
  workspaceIndex.set(failure.failure.workspaceId, ids);
}

function unindexFailure(failure: ExecutiveFailure): void {
  const ids = workspaceIndex.get(failure.failure.workspaceId);
  if (!ids) {
    return;
  }
  ids.delete(failure.failure.failureId);
  if (ids.size === 0) {
    workspaceIndex.delete(failure.failure.workspaceId);
  }
}

export function clearFailureLearningRegistryForTests(): void {
  failureRegistry.clear();
  workspaceIndex.clear();
}

export function failureExists(failureId: FailureId): boolean {
  return failureRegistry.has(failureId);
}

export function registerFailure(failure: ExecutiveFailure): FailureEngineResult<ExecutiveFailure> {
  const validation = validateExecutiveFailure(failure);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      data: null,
      error: validation.issues[0] ?? null,
      readOnly: true as const,
    });
  }
  if (failureRegistry.has(failure.failure.failureId)) {
    return Object.freeze({
      success: false,
      reason: `Duplicate failure id: ${failure.failure.failureId}.`,
      data: null,
      error: Object.freeze({
        code: "duplicate_failure",
        message: "Duplicate failure id.",
        field: "failureId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (failureRegistry.size >= FAILURE_LEARNING_ENGINE_LIMITS.maxRegisteredFailures) {
    return Object.freeze({
      success: false,
      reason: "Failure registry is full.",
      data: null,
      error: Object.freeze({
        code: "registry_full",
        message: "Failure registry is full.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  failureRegistry.set(failure.failure.failureId, failure);
  indexFailure(failure);
  return Object.freeze({
    success: true,
    reason: "Executive failure registered.",
    data: failure,
    error: null,
    readOnly: true as const,
  });
}

export function unregisterFailure(failureId: FailureId): FailureEngineResult<FailureId> {
  const existing = failureRegistry.get(failureId);
  if (!existing) {
    return Object.freeze({
      success: false,
      reason: `Failure not found: ${failureId}.`,
      data: null,
      error: Object.freeze({
        code: "failure_not_found",
        message: "Failure not found.",
        field: "failureId",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  failureRegistry.delete(failureId);
  unindexFailure(existing);
  return Object.freeze({
    success: true,
    reason: "Executive failure unregistered.",
    data: failureId,
    error: null,
    readOnly: true as const,
  });
}

export function getFailure(failureId: FailureId): ExecutiveFailure | null {
  return failureRegistry.get(failureId) ?? null;
}

export function getFailures(workspaceId?: FailureWorkspaceId): readonly ExecutiveFailure[] {
  if (!workspaceId) {
    return Object.freeze(
      [...failureRegistry.values()].sort((left, right) => left.failure.failureId.localeCompare(right.failure.failureId))
    );
  }
  const ids = workspaceIndex.get(workspaceId);
  if (!ids) {
    return Object.freeze([]);
  }
  return Object.freeze(
    [...ids]
      .map((id) => failureRegistry.get(id))
      .filter((entry): entry is ExecutiveFailure => entry !== undefined)
      .sort((left, right) => left.failure.failureId.localeCompare(right.failure.failureId))
  );
}

export function getFailureRegistrySnapshot(): FailureRegistrySnapshot {
  return Object.freeze({
    registryVersion: FAILURE_LEARNING_ENGINE_CONTRACT_VERSION,
    failureCount: failureRegistry.size,
    failureIds: Object.freeze([...failureRegistry.keys()].sort()),
    readOnly: true as const,
  });
}

export const FailureLearningEngineRegistry = Object.freeze({
  clearFailureLearningRegistryForTests,
  failureExists,
  registerFailure,
  unregisterFailure,
  getFailure,
  getFailures,
  getFailureRegistrySnapshot,
});
