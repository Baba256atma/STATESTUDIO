/**
 * APP-4:10 — Executive Memory Lifecycle repository.
 */

import { getExecutiveMemoryById as getStoredExecutiveMemoryById } from "./executiveMemoryRetrievalEngine.ts";
import { archiveExecutiveMemory, restoreExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import { executiveMemoryLifecycleErrorFromCode } from "./executiveMemoryLifecycleErrors.ts";
import { inspectMemoryIntegrity } from "./executiveMemoryLifecycleIntegrityInspector.ts";
import { mergeExecutiveMemories, validateMerge, inspectMergeHistory } from "./executiveMemoryLifecycleMergeManager.ts";
import {
  restoreExecutiveMemoryLifecycleRegistrySnapshot,
  snapshotExecutiveMemoryLifecycleRegistry,
  commitExecutiveMemoryLifecycle,
  getExecutiveMemoryLifecycle,
} from "./executiveMemoryLifecycleRegistry.ts";
import { applyRetentionPolicy } from "./executiveMemoryLifecycleRetentionManager.ts";
import { splitExecutiveMemory, validateSplit, inspectSplitHistory } from "./executiveMemoryLifecycleSplitManager.ts";
import {
  restoreSupersededMemory,
  supersedeExecutiveMemory,
} from "./executiveMemoryLifecycleSupersedeManager.ts";
import { computeExecutiveMemoryLifecycleStatistics } from "./executiveMemoryLifecycleStatistics.ts";
import {
  createExecutiveMemoryLifecycleAuditMetadata,
} from "./executiveMemoryLifecycleModel.ts";
import {
  validateExecutiveMemoryLifecycleRecord,
  validateExecutiveMemoryLifecycleTransition,
} from "./executiveMemoryLifecycleValidator.ts";
import {
  compareVersions,
  createMemoryVersion,
  getLatestVersion,
  getMemoryVersionHistory,
  registerGovernedExecutiveMemory,
} from "./executiveMemoryLifecycleVersionManager.ts";
import type {
  CreateMemoryVersionInput,
  ExecutiveMemoryIntegrityReport,
  ExecutiveMemoryLifecycle,
  ExecutiveMemoryLifecycleResult,
  ExecutiveMemoryLifecycleStatistics,
  MergeExecutiveMemoriesInput,
  SplitExecutiveMemoryInput,
  SupersedeExecutiveMemoryInput,
} from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

function createResult<T>(
  success: boolean,
  reason: string,
  data: T | null,
  error: ExecutiveMemoryLifecycleResult<T>["error"] = null
): ExecutiveMemoryLifecycleResult<T> {
  return Object.freeze({ success, reason, data, error, readOnly: true as const });
}

function runTransaction<T>(operation: () => ExecutiveMemoryLifecycleResult<T>): ExecutiveMemoryLifecycleResult<T> {
  const snapshot = snapshotExecutiveMemoryLifecycleRegistry();
  const outcome = operation();
  if (!outcome.success) {
    restoreExecutiveMemoryLifecycleRegistrySnapshot(snapshot);
    return createResult(
      false,
      outcome.reason,
      null,
      outcome.error ??
        executiveMemoryLifecycleErrorFromCode("transactionRollback", "Lifecycle transaction rolled back.")
    );
  }
  return outcome;
}

export function registerGovernedMemory(
  memoryId: ExecutiveMemoryId,
  author: string,
  timestamp: string
): ExecutiveMemoryLifecycleResult<ExecutiveMemoryLifecycle> {
  return runTransaction(() => {
    const registered = registerGovernedExecutiveMemory({ memoryId, author, timestamp });
    if (!registered.success) {
      return createResult(false, registered.reason, null);
    }
    const lifecycle = getExecutiveMemoryLifecycle(memoryId);
    return createResult(true, registered.reason, lifecycle);
  });
}

export function createMemoryVersionOperation(
  input: CreateMemoryVersionInput
): ExecutiveMemoryLifecycleResult<ExecutiveMemoryLifecycle> {
  return runTransaction(() => {
    const created = createMemoryVersion(input);
    if (!created.success || !created.version) {
      return createResult(
        false,
        created.reason,
        null,
        executiveMemoryLifecycleErrorFromCode("validationFailure", created.reason)
      );
    }
    const lifecycle = getExecutiveMemoryLifecycle(input.memoryId);
    return createResult(true, created.reason, lifecycle);
  });
}

export function getMemoryVersionHistoryOperation(memoryId: ExecutiveMemoryId) {
  return getMemoryVersionHistory(memoryId);
}

export function getLatestVersionOperation(memoryId: ExecutiveMemoryId) {
  return getLatestVersion(memoryId);
}

export function compareVersionsOperation(
  leftVersionId: string,
  rightVersionId: string,
  canonicalMemoryId: ExecutiveMemoryId
) {
  return compareVersions(leftVersionId, rightVersionId, canonicalMemoryId);
}

export function mergeExecutiveMemoriesOperation(input: MergeExecutiveMemoriesInput) {
  return mergeExecutiveMemories(input);
}

export function splitExecutiveMemoryOperation(input: SplitExecutiveMemoryInput) {
  return splitExecutiveMemory(input);
}

export function supersedeExecutiveMemoryOperation(input: SupersedeExecutiveMemoryInput) {
  return supersedeExecutiveMemory(input);
}

export function restoreSupersededMemoryOperation(input: {
  memoryId: ExecutiveMemoryId;
  author: string;
  timestamp: string;
}) {
  return restoreSupersededMemory(input);
}

export function archiveMemoryLifecycle(input: {
  memoryId: ExecutiveMemoryId;
  author: string;
  timestamp: string;
  reason?: string | null;
}): ExecutiveMemoryLifecycleResult<ExecutiveMemoryLifecycle> {
  return runTransaction(() => {
    const transition = validateExecutiveMemoryLifecycleTransition({
      memoryId: input.memoryId,
      toState: "archived",
    });
    if (!transition.valid) {
      return createResult(
        false,
        transition.issues.map((entry) => entry.message).join("; "),
        null,
        executiveMemoryLifecycleErrorFromCode("invalidTransition", transition.issues[0]!.message)
      );
    }
    const lifecycle = getExecutiveMemoryLifecycle(input.memoryId);
    if (!lifecycle) {
      return createResult(
        false,
        `Lifecycle not found: ${input.memoryId}.`,
        null,
        executiveMemoryLifecycleErrorFromCode("memoryNotFound", `Lifecycle not found: ${input.memoryId}.`)
      );
    }
    const archived = archiveExecutiveMemory(input.memoryId, input.timestamp);
    if (!archived.success) {
      return createResult(false, archived.reason ?? "Archive failed.", null);
    }
    const next = Object.freeze({
      ...lifecycle,
      governanceState: "archived" as const,
      updatedAt: input.timestamp,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: input.author,
        sourceModule: "executive-memory-lifecycle",
        reason: input.reason ?? "Archived by lifecycle governance.",
      }),
      readOnly: true as const,
    });
    commitExecutiveMemoryLifecycle(next);
    return createResult(true, "Memory lifecycle archived.", next);
  });
}

export function restoreExecutiveMemoryVersion(input: {
  memoryId: ExecutiveMemoryId;
  versionId: string;
  author: string;
  timestamp: string;
}): ExecutiveMemoryLifecycleResult<ExecutiveMemoryLifecycle> {
  return runTransaction(() => {
    const lifecycle = getExecutiveMemoryLifecycle(input.memoryId);
    if (!lifecycle) {
      return createResult(
        false,
        `Lifecycle not found: ${input.memoryId}.`,
        null,
        executiveMemoryLifecycleErrorFromCode("memoryNotFound", `Lifecycle not found: ${input.memoryId}.`)
      );
    }
    const history = getMemoryVersionHistory(input.memoryId);
    const version = history.versions.find((entry) => entry.versionId === input.versionId);
    if (!version) {
      return createResult(
        false,
        `Version not found: ${input.versionId}.`,
        null,
        executiveMemoryLifecycleErrorFromCode("invalidVersionChain", `Version not found: ${input.versionId}.`)
      );
    }

    const stored = getStoredExecutiveMemoryById(input.memoryId);
    if (stored.data?.lifecycle === "archived") {
      restoreExecutiveMemory(input.memoryId, input.timestamp);
    }

    const transition = validateExecutiveMemoryLifecycleTransition({
      memoryId: input.memoryId,
      toState: "active",
    });
    if (!transition.valid && lifecycle.governanceState !== "active") {
      return createResult(
        false,
        transition.issues.map((entry) => entry.message).join("; "),
        null,
        executiveMemoryLifecycleErrorFromCode("invalidTransition", transition.issues[0]!.message)
      );
    }

    const next = Object.freeze({
      ...lifecycle,
      governanceState: "active" as const,
      currentVersionId: input.versionId,
      updatedAt: input.timestamp,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: input.author,
        sourceModule: "executive-memory-lifecycle",
        reason: `Restored to version ${input.versionId}.`,
      }),
      readOnly: true as const,
    });
    commitExecutiveMemoryLifecycle(next);
    return createResult(true, "Memory version restored.", next);
  });
}

export function applyRetentionPolicyOperation(input: {
  memoryId: ExecutiveMemoryId;
  policyId: string;
  timestamp: string;
}) {
  return applyRetentionPolicy(input);
}

export function inspectMemoryIntegrityOperation(timestamp: string): ExecutiveMemoryIntegrityReport {
  return inspectMemoryIntegrity(timestamp);
}

export function validateMemoryLifecycle(memoryId: ExecutiveMemoryId) {
  const lifecycle = getExecutiveMemoryLifecycle(memoryId);
  if (!lifecycle) {
    return Object.freeze({ valid: false, issues: Object.freeze([{ code: "memory_not_found", message: "Lifecycle not found.", readOnly: true as const }]), readOnly: true as const });
  }
  return validateExecutiveMemoryLifecycleRecord(lifecycle);
}

export function getExecutiveMemoryLifecycleStatistics(timestamp: string): ExecutiveMemoryLifecycleStatistics {
  return computeExecutiveMemoryLifecycleStatistics(timestamp);
}

export { validateMerge, validateSplit, inspectMergeHistory, inspectSplitHistory };

export const ExecutiveMemoryLifecycleRepository = Object.freeze({
  registerGovernedMemory,
  createMemoryVersionOperation,
  getMemoryVersionHistoryOperation,
  getLatestVersionOperation,
  compareVersionsOperation,
  mergeExecutiveMemoriesOperation,
  splitExecutiveMemoryOperation,
  supersedeExecutiveMemoryOperation,
  restoreSupersededMemoryOperation,
  archiveMemoryLifecycle,
  restoreExecutiveMemoryVersion,
  applyRetentionPolicyOperation,
  inspectMemoryIntegrityOperation,
  validateMemoryLifecycle,
  getExecutiveMemoryLifecycleStatistics,
  validateMerge,
  validateSplit,
  inspectMergeHistory,
  inspectSplitHistory,
});
