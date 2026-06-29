/**
 * APP-4:7 — Executive Decision Memory repository.
 */

import { applyExecutiveDecisionMemoryUpdate, createExecutiveDecisionMemory } from "./executiveDecisionMemoryModel.ts";
import { executiveDecisionMemoryErrorFromCode } from "./executiveDecisionMemoryErrors.ts";
import {
  commitExecutiveDecisionMemory,
  getExecutiveDecisionMemoryFromRegistry,
  hasExecutiveDecisionMemoryInRegistry,
  listExecutiveDecisionMemoriesFromRegistry,
  restoreExecutiveDecisionMemorySnapshot,
  snapshotExecutiveDecisionMemories,
} from "./executiveDecisionMemoryRegistry.ts";
import {
  buildExecutiveDecisionMemorySignature,
  validateExecutiveDecisionMemory,
} from "./executiveDecisionMemoryValidator.ts";
import type {
  CreateExecutiveDecisionMemoryInput,
  ExecutiveDecisionMemory,
  ExecutiveDecisionMemoryId,
  ExecutiveDecisionMemoryQuery,
  ExecutiveDecisionMemoryResult,
  UpdateExecutiveDecisionMemoryInput,
} from "./executiveDecisionMemoryTypes.ts";

function createResult<T>(
  success: boolean,
  reason: string,
  data: T | null,
  error: ExecutiveDecisionMemoryResult<T>["error"] = null
): ExecutiveDecisionMemoryResult<T> {
  return Object.freeze({ success, reason, data, error, readOnly: true as const });
}

function hasDuplicateActiveDecisionMemory(candidate: ExecutiveDecisionMemory): boolean {
  const active = listExecutiveDecisionMemoriesFromRegistry({
    lifecycle: "active",
    decisionId: candidate.decisionId,
  });
  const signature = buildExecutiveDecisionMemorySignature(candidate);
  return active.some(
    (memory) =>
      memory.memoryId !== candidate.memoryId &&
      buildExecutiveDecisionMemorySignature(memory) === signature
  );
}

function runTransaction<T>(
  operation: () => ExecutiveDecisionMemoryResult<T>
): ExecutiveDecisionMemoryResult<T> {
  const snapshot = snapshotExecutiveDecisionMemories();
  const outcome = operation();
  if (!outcome.success) {
    restoreExecutiveDecisionMemorySnapshot(snapshot);
    return createResult(
      false,
      outcome.reason,
      null,
      outcome.error ??
        executiveDecisionMemoryErrorFromCode("transactionRollback", "Decision memory transaction rolled back.")
    );
  }
  return outcome;
}

export function createDecisionMemory(
  input: CreateExecutiveDecisionMemoryInput
): ExecutiveDecisionMemoryResult<ExecutiveDecisionMemory> {
  return runTransaction(() => {
    const memory = createExecutiveDecisionMemory(input);
    const validation = validateExecutiveDecisionMemory(memory);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveDecisionMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasExecutiveDecisionMemoryInRegistry(memory.memoryId)) {
      return createResult(
        false,
        `Duplicate decision memory id: ${memory.memoryId}.`,
        null,
        executiveDecisionMemoryErrorFromCode("duplicateMemory", `Duplicate decision memory id: ${memory.memoryId}.`, "memoryId")
      );
    }
    if (hasDuplicateActiveDecisionMemory(memory)) {
      return createResult(
        false,
        "Duplicate active decision memory for decision and workspace.",
        null,
        executiveDecisionMemoryErrorFromCode("duplicateMemory", "Duplicate active decision memory for decision and workspace.")
      );
    }
    commitExecutiveDecisionMemory(memory);
    return createResult(true, "Decision memory created.", memory);
  });
}

export function updateDecisionMemory(
  memoryId: ExecutiveDecisionMemoryId,
  updates: UpdateExecutiveDecisionMemoryInput,
  timestamp: string
): ExecutiveDecisionMemoryResult<ExecutiveDecisionMemory> {
  return runTransaction(() => {
    const existing = getExecutiveDecisionMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Decision memory not found: ${memoryId}.`,
        null,
        executiveDecisionMemoryErrorFromCode("memoryNotFound", `Decision memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        "Archived decision memory cannot be updated.",
        null,
        executiveDecisionMemoryErrorFromCode("invalidLifecycle", "Archived decision memory cannot be updated.", "lifecycle")
      );
    }
    const updated = applyExecutiveDecisionMemoryUpdate(existing, updates, timestamp);
    const validation = validateExecutiveDecisionMemory(updated);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveDecisionMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    commitExecutiveDecisionMemory(updated);
    return createResult(true, "Decision memory updated.", updated);
  });
}

export function archiveDecisionMemory(
  memoryId: ExecutiveDecisionMemoryId,
  timestamp: string
): ExecutiveDecisionMemoryResult<ExecutiveDecisionMemory> {
  return runTransaction(() => {
    const existing = getExecutiveDecisionMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Decision memory not found: ${memoryId}.`,
        null,
        executiveDecisionMemoryErrorFromCode("memoryNotFound", `Decision memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        `Decision memory already archived: ${memoryId}.`,
        null,
        executiveDecisionMemoryErrorFromCode("invalidLifecycle", `Decision memory already archived: ${memoryId}.`, "lifecycle")
      );
    }
    const archived = Object.freeze({
      ...existing,
      lifecycle: "archived" as const,
      archivedAt: timestamp,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    commitExecutiveDecisionMemory(archived);
    return createResult(true, "Decision memory archived.", archived);
  });
}

export function restoreDecisionMemory(
  memoryId: ExecutiveDecisionMemoryId,
  timestamp: string
): ExecutiveDecisionMemoryResult<ExecutiveDecisionMemory> {
  return runTransaction(() => {
    const existing = getExecutiveDecisionMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Decision memory not found: ${memoryId}.`,
        null,
        executiveDecisionMemoryErrorFromCode("memoryNotFound", `Decision memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "active") {
      return createResult(
        false,
        `Decision memory is not archived: ${memoryId}.`,
        null,
        executiveDecisionMemoryErrorFromCode("invalidLifecycle", `Decision memory is not archived: ${memoryId}.`, "lifecycle")
      );
    }
    const restored = Object.freeze({
      ...existing,
      lifecycle: "active" as const,
      archivedAt: null,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    const validation = validateExecutiveDecisionMemory(restored);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveDecisionMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasDuplicateActiveDecisionMemory(restored)) {
      return createResult(
        false,
        "Duplicate active decision memory for decision and workspace.",
        null,
        executiveDecisionMemoryErrorFromCode("duplicateMemory", "Duplicate active decision memory for decision and workspace.")
      );
    }
    commitExecutiveDecisionMemory(restored);
    return createResult(true, "Decision memory restored.", restored);
  });
}

export function getDecisionMemoryById(memoryId: ExecutiveDecisionMemoryId): ExecutiveDecisionMemory | null {
  return getExecutiveDecisionMemoryFromRegistry(memoryId);
}

export function getDecisionMemories(query: ExecutiveDecisionMemoryQuery = {}): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry(query);
}

export function getDecisionMemoryByDecision(decisionId: string): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({ decisionId });
}

export function getDecisionMemoryByGoal(goalId: string): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({ goalId });
}

export function getDecisionMemoryByIntent(intentId: string): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({ intentId });
}

export function getDecisionMemoryByScenario(scenarioId: string): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({ scenarioId });
}

export function getDecisionMemoryByWorkspace(workspaceId: string): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({ workspaceId });
}

export function getDecisionMemoryByRisk(riskId: string): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({ riskId });
}

export function getDecisionMemoryByKPI(kpiId: string): readonly ExecutiveDecisionMemory[] {
  return listExecutiveDecisionMemoriesFromRegistry({ kpiId });
}

export function hasDecisionMemory(memoryId: ExecutiveDecisionMemoryId): boolean {
  return hasExecutiveDecisionMemoryInRegistry(memoryId);
}

export function validateDecisionMemory(memory: ExecutiveDecisionMemory) {
  return validateExecutiveDecisionMemory(memory);
}

export const ExecutiveDecisionMemoryRepository = Object.freeze({
  createDecisionMemory,
  updateDecisionMemory,
  archiveDecisionMemory,
  restoreDecisionMemory,
  getDecisionMemoryById,
  getDecisionMemories,
  getDecisionMemoryByDecision,
  getDecisionMemoryByGoal,
  getDecisionMemoryByIntent,
  getDecisionMemoryByScenario,
  getDecisionMemoryByWorkspace,
  getDecisionMemoryByRisk,
  getDecisionMemoryByKPI,
  hasDecisionMemory,
  validateDecisionMemory,
});
