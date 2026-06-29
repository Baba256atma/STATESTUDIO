/**
 * APP-4:6 — Executive Scenario Memory repository.
 */

import { applyExecutiveScenarioMemoryUpdate, createExecutiveScenarioMemory } from "./executiveScenarioMemoryModel.ts";
import { executiveScenarioMemoryErrorFromCode } from "./executiveScenarioMemoryErrors.ts";
import {
  commitExecutiveScenarioMemory,
  getExecutiveScenarioMemoryFromRegistry,
  hasExecutiveScenarioMemoryInRegistry,
  listExecutiveScenarioMemoriesFromRegistry,
  restoreExecutiveScenarioMemorySnapshot,
  snapshotExecutiveScenarioMemories,
} from "./executiveScenarioMemoryRegistry.ts";
import {
  buildExecutiveScenarioMemorySignature,
  validateExecutiveScenarioMemory,
} from "./executiveScenarioMemoryValidator.ts";
import type {
  CreateExecutiveScenarioMemoryInput,
  ExecutiveScenarioMemory,
  ExecutiveScenarioMemoryId,
  ExecutiveScenarioMemoryQuery,
  ExecutiveScenarioMemoryResult,
  UpdateExecutiveScenarioMemoryInput,
} from "./executiveScenarioMemoryTypes.ts";

function createResult<T>(
  success: boolean,
  reason: string,
  data: T | null,
  error: ExecutiveScenarioMemoryResult<T>["error"] = null
): ExecutiveScenarioMemoryResult<T> {
  return Object.freeze({ success, reason, data, error, readOnly: true as const });
}

function hasDuplicateActiveScenarioMemory(candidate: ExecutiveScenarioMemory): boolean {
  const active = listExecutiveScenarioMemoriesFromRegistry({ lifecycle: "active", scenarioId: candidate.scenarioId });
  const signature = buildExecutiveScenarioMemorySignature(candidate);
  return active.some(
    (memory) =>
      memory.memoryId !== candidate.memoryId &&
      buildExecutiveScenarioMemorySignature(memory) === signature
  );
}

function runTransaction<T>(
  operation: () => ExecutiveScenarioMemoryResult<T>
): ExecutiveScenarioMemoryResult<T> {
  const snapshot = snapshotExecutiveScenarioMemories();
  const outcome = operation();
  if (!outcome.success) {
    restoreExecutiveScenarioMemorySnapshot(snapshot);
    return createResult(
      false,
      outcome.reason,
      null,
      outcome.error ??
        executiveScenarioMemoryErrorFromCode("transactionRollback", "Scenario memory transaction rolled back.")
    );
  }
  return outcome;
}

export function createScenarioMemory(
  input: CreateExecutiveScenarioMemoryInput
): ExecutiveScenarioMemoryResult<ExecutiveScenarioMemory> {
  return runTransaction(() => {
    const memory = createExecutiveScenarioMemory(input);
    const validation = validateExecutiveScenarioMemory(memory);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveScenarioMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasExecutiveScenarioMemoryInRegistry(memory.memoryId)) {
      return createResult(
        false,
        `Duplicate scenario memory id: ${memory.memoryId}.`,
        null,
        executiveScenarioMemoryErrorFromCode("duplicateMemory", `Duplicate scenario memory id: ${memory.memoryId}.`, "memoryId")
      );
    }
    if (hasDuplicateActiveScenarioMemory(memory)) {
      return createResult(
        false,
        "Duplicate active scenario memory for scenario and workspace.",
        null,
        executiveScenarioMemoryErrorFromCode("duplicateMemory", "Duplicate active scenario memory for scenario and workspace.")
      );
    }
    commitExecutiveScenarioMemory(memory);
    return createResult(true, "Scenario memory created.", memory);
  });
}

export function updateScenarioMemory(
  memoryId: ExecutiveScenarioMemoryId,
  updates: UpdateExecutiveScenarioMemoryInput,
  timestamp: string
): ExecutiveScenarioMemoryResult<ExecutiveScenarioMemory> {
  return runTransaction(() => {
    const existing = getExecutiveScenarioMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Scenario memory not found: ${memoryId}.`,
        null,
        executiveScenarioMemoryErrorFromCode("memoryNotFound", `Scenario memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        "Archived scenario memory cannot be updated.",
        null,
        executiveScenarioMemoryErrorFromCode("invalidLifecycle", "Archived scenario memory cannot be updated.", "lifecycle")
      );
    }
    const updated = applyExecutiveScenarioMemoryUpdate(existing, updates, timestamp);
    const validation = validateExecutiveScenarioMemory(updated);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveScenarioMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    commitExecutiveScenarioMemory(updated);
    return createResult(true, "Scenario memory updated.", updated);
  });
}

export function archiveScenarioMemory(
  memoryId: ExecutiveScenarioMemoryId,
  timestamp: string
): ExecutiveScenarioMemoryResult<ExecutiveScenarioMemory> {
  return runTransaction(() => {
    const existing = getExecutiveScenarioMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Scenario memory not found: ${memoryId}.`,
        null,
        executiveScenarioMemoryErrorFromCode("memoryNotFound", `Scenario memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "archived") {
      return createResult(
        false,
        `Scenario memory already archived: ${memoryId}.`,
        null,
        executiveScenarioMemoryErrorFromCode("invalidLifecycle", `Scenario memory already archived: ${memoryId}.`, "lifecycle")
      );
    }
    const archived = Object.freeze({
      ...existing,
      lifecycle: "archived" as const,
      archivedAt: timestamp,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    commitExecutiveScenarioMemory(archived);
    return createResult(true, "Scenario memory archived.", archived);
  });
}

export function restoreScenarioMemory(
  memoryId: ExecutiveScenarioMemoryId,
  timestamp: string
): ExecutiveScenarioMemoryResult<ExecutiveScenarioMemory> {
  return runTransaction(() => {
    const existing = getExecutiveScenarioMemoryFromRegistry(memoryId);
    if (!existing) {
      return createResult(
        false,
        `Scenario memory not found: ${memoryId}.`,
        null,
        executiveScenarioMemoryErrorFromCode("memoryNotFound", `Scenario memory not found: ${memoryId}.`, "memoryId")
      );
    }
    if (existing.lifecycle === "active") {
      return createResult(
        false,
        `Scenario memory is not archived: ${memoryId}.`,
        null,
        executiveScenarioMemoryErrorFromCode("invalidLifecycle", `Scenario memory is not archived: ${memoryId}.`, "lifecycle")
      );
    }
    const restored = Object.freeze({
      ...existing,
      lifecycle: "active" as const,
      archivedAt: null,
      updatedAt: timestamp,
      readOnly: true as const,
    });
    const validation = validateExecutiveScenarioMemory(restored);
    if (!validation.valid) {
      return createResult(
        false,
        validation.issues.map((entry) => entry.message).join("; "),
        null,
        executiveScenarioMemoryErrorFromCode(
          "validationFailure",
          validation.issues.map((entry) => entry.message).join("; ")
        )
      );
    }
    if (hasDuplicateActiveScenarioMemory(restored)) {
      return createResult(
        false,
        "Duplicate active scenario memory for scenario and workspace.",
        null,
        executiveScenarioMemoryErrorFromCode("duplicateMemory", "Duplicate active scenario memory for scenario and workspace.")
      );
    }
    commitExecutiveScenarioMemory(restored);
    return createResult(true, "Scenario memory restored.", restored);
  });
}

export function getScenarioMemoryById(memoryId: ExecutiveScenarioMemoryId): ExecutiveScenarioMemory | null {
  return getExecutiveScenarioMemoryFromRegistry(memoryId);
}

export function getScenarioMemories(query: ExecutiveScenarioMemoryQuery = {}): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry(query);
}

export function getScenarioMemoryByScenario(scenarioId: string): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ scenarioId });
}

export function getScenarioMemoryByGoal(goalId: string): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ goalId });
}

export function getScenarioMemoryByIntent(intentId: string): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ intentId });
}

export function getScenarioMemoryByDecision(decisionId: string): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ decisionId });
}

export function getScenarioMemoryByWorkspace(workspaceId: string): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ workspaceId });
}

export function getScenarioMemoryByRisk(riskId: string): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ riskId });
}

export function getScenarioMemoryByKPI(kpiId: string): readonly ExecutiveScenarioMemory[] {
  return listExecutiveScenarioMemoriesFromRegistry({ kpiId });
}

export function hasScenarioMemory(memoryId: ExecutiveScenarioMemoryId): boolean {
  return hasExecutiveScenarioMemoryInRegistry(memoryId);
}

export function validateScenarioMemory(memory: ExecutiveScenarioMemory) {
  return validateExecutiveScenarioMemory(memory);
}

export const ExecutiveScenarioMemoryRepository = Object.freeze({
  createScenarioMemory,
  updateScenarioMemory,
  archiveScenarioMemory,
  restoreScenarioMemory,
  getScenarioMemoryById,
  getScenarioMemories,
  getScenarioMemoryByScenario,
  getScenarioMemoryByGoal,
  getScenarioMemoryByIntent,
  getScenarioMemoryByDecision,
  getScenarioMemoryByWorkspace,
  getScenarioMemoryByRisk,
  getScenarioMemoryByKPI,
  hasScenarioMemory,
  validateScenarioMemory,
});
