/**
 * APP-4:8 — Executive Context Memory repository.
 */

import { applyExecutiveContextMemoryUpdate, createExecutiveContextMemory } from "./executiveContextMemoryModel.ts";
import { executiveContextMemoryErrorFromCode } from "./executiveContextMemoryErrors.ts";
import {
  commitExecutiveContextMemory,
  getExecutiveContextMemoryFromRegistry,
  hasExecutiveContextMemoryInRegistry,
  listExecutiveContextMemoriesFromRegistry,
  restoreExecutiveContextMemorySnapshot,
  snapshotExecutiveContextMemories,
} from "./executiveContextMemoryRegistry.ts";
import {
  buildExecutiveContextMemorySignature,
  validateExecutiveContextMemory,
} from "./executiveContextMemoryValidator.ts";
import type {
  CreateExecutiveContextMemoryInput,
  ExecutiveContextMemory,
  ExecutiveContextMemoryId,
  ExecutiveContextMemoryQuery,
  ExecutiveContextMemoryResult,
  UpdateExecutiveContextMemoryInput,
} from "./executiveContextMemoryTypes.ts";

function createResult<T>(
  success: boolean,
  reason: string,
  data: T | null,
  error: ExecutiveContextMemoryResult<T>["error"] = null
): ExecutiveContextMemoryResult<T> {
  return Object.freeze({ success, reason, data, error, readOnly: true as const });
}

function hasDuplicateActiveContextMemory(candidate: ExecutiveContextMemory): boolean {
  const active = listExecutiveContextMemoriesFromRegistry({
    lifecycle: "active",
    workspaceId: candidate.workspaceId,
  });
  const signature = buildExecutiveContextMemorySignature(candidate);
  return active.some(
    (memory) =>
      memory.memoryId !== candidate.memoryId &&
      buildExecutiveContextMemorySignature(memory) === signature
  );
}

function runTransaction<T>(
  operation: () => ExecutiveContextMemoryResult<T>
): ExecutiveContextMemoryResult<T> {
  const snapshot = snapshotExecutiveContextMemories();
  const outcome = operation();
  if (!outcome.success) {
    restoreExecutiveContextMemorySnapshot(snapshot);
    return createResult(
      false,
      outcome.reason,
      null,
      outcome.error ??
        executiveContextMemoryErrorFromCode("transactionRollback", "Context memory transaction rolled back.")
    );
  }
  return outcome;
}

export function createContextMemory(
  input: CreateExecutiveContextMemoryInput
): ExecutiveContextMemoryResult<ExecutiveContextMemory> {
  return runTransaction(() => {
    const memory = createExecutiveContextMemory(input);
    const validation = validateExecutiveContextMemory(memory);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveContextMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasExecutiveContextMemoryInRegistry(memory.memoryId)) {
      return createResult(
        false,
        `Duplicate context memory id: ${memory.memoryId}.`,
        null,
        executiveContextMemoryErrorFromCode("duplicateContext", `Duplicate context memory id: ${memory.memoryId}.`, "memoryId")
      );
    }
    if (hasDuplicateActiveContextMemory(memory)) {
      return createResult(
        false,
        "Duplicate active context memory for workspace and snapshot.",
        null,
        executiveContextMemoryErrorFromCode("duplicateContext", "Duplicate active context memory for workspace and snapshot.")
      );
    }
    commitExecutiveContextMemory(memory);
    return createResult(true, "Context memory created.", memory);
  });
}

export function updateContextMemory(
  memoryId: ExecutiveContextMemoryId,
  updates: UpdateExecutiveContextMemoryInput,
  timestamp: string
): ExecutiveContextMemoryResult<ExecutiveContextMemory> {
  return runTransaction(() => {
    const existing = getExecutiveContextMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Context memory not found: ${memoryId}.`,
        null,
        executiveContextMemoryErrorFromCode("memoryNotFound", `Context memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        "Archived context memory cannot be updated.",
        null,
        executiveContextMemoryErrorFromCode("invalidLifecycle", "Archived context memory cannot be updated.", "lifecycle")
      );
    }
    const updated = applyExecutiveContextMemoryUpdate(existing, updates, timestamp);
    const validation = validateExecutiveContextMemory(updated);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveContextMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    commitExecutiveContextMemory(updated);
    return createResult(true, "Context memory updated.", updated);
  });
}

export function archiveContextMemory(
  memoryId: ExecutiveContextMemoryId,
  timestamp: string
): ExecutiveContextMemoryResult<ExecutiveContextMemory> {
  return runTransaction(() => {
    const existing = getExecutiveContextMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Context memory not found: ${memoryId}.`,
        null,
        executiveContextMemoryErrorFromCode("memoryNotFound", `Context memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        `Context memory already archived: ${memoryId}.`,
        null,
        executiveContextMemoryErrorFromCode("invalidLifecycle", `Context memory already archived: ${memoryId}.`, "lifecycle")
      );
    }
    const archived = Object.freeze({
      ...existing,
      lifecycle: "archived" as const,
      archivedAt: timestamp,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    commitExecutiveContextMemory(archived);
    return createResult(true, "Context memory archived.", archived);
  });
}

export function restoreContextMemory(
  memoryId: ExecutiveContextMemoryId,
  timestamp: string
): ExecutiveContextMemoryResult<ExecutiveContextMemory> {
  return runTransaction(() => {
    const existing = getExecutiveContextMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Context memory not found: ${memoryId}.`,
        null,
        executiveContextMemoryErrorFromCode("memoryNotFound", `Context memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "active") {
      return createResult(
        false,
        `Context memory is not archived: ${memoryId}.`,
        null,
        executiveContextMemoryErrorFromCode("invalidLifecycle", `Context memory is not archived: ${memoryId}.`, "lifecycle")
      );
    }
    const restored = Object.freeze({
      ...existing,
      lifecycle: "active" as const,
      archivedAt: null,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    const validation = validateExecutiveContextMemory(restored);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveContextMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasDuplicateActiveContextMemory(restored)) {
      return createResult(
        false,
        "Duplicate active context memory for workspace and snapshot.",
        null,
        executiveContextMemoryErrorFromCode("duplicateContext", "Duplicate active context memory for workspace and snapshot.")
      );
    }
    commitExecutiveContextMemory(restored);
    return createResult(true, "Context memory restored.", restored);
  });
}

export function getContextMemoryById(memoryId: ExecutiveContextMemoryId): ExecutiveContextMemory | null {
  return getExecutiveContextMemoryFromRegistry(memoryId);
}

export function getContextMemories(query: ExecutiveContextMemoryQuery = {}): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry(query);
}

export function getContextMemoryByWorkspace(workspaceId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ workspaceId });
}

export function getContextMemoryByGoal(goalId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ goalId });
}

export function getContextMemoryByIntent(intentId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ intentId });
}

export function getContextMemoryByScenario(scenarioId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ scenarioId });
}

export function getContextMemoryByDecision(decisionId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ decisionId });
}

export function getContextMemoryByBusinessContext(businessContextId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ businessContextId });
}

export function getContextMemoryByStakeholder(stakeholderId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ stakeholderId });
}

export function getContextMemoryByExternalEvent(externalEventId: string): readonly ExecutiveContextMemory[] {
  return listExecutiveContextMemoriesFromRegistry({ externalEventId });
}

export function hasContextMemory(memoryId: ExecutiveContextMemoryId): boolean {
  return hasExecutiveContextMemoryInRegistry(memoryId);
}

export function validateContextMemory(memory: ExecutiveContextMemory) {
  return validateExecutiveContextMemory(memory);
}

export const ExecutiveContextMemoryRepository = Object.freeze({
  createContextMemory,
  updateContextMemory,
  archiveContextMemory,
  restoreContextMemory,
  getContextMemoryById,
  getContextMemories,
  getContextMemoryByWorkspace,
  getContextMemoryByGoal,
  getContextMemoryByIntent,
  getContextMemoryByScenario,
  getContextMemoryByDecision,
  getContextMemoryByBusinessContext,
  getContextMemoryByStakeholder,
  getContextMemoryByExternalEvent,
  hasContextMemory,
  validateContextMemory,
});
