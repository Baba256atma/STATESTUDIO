/**
 * APP-4:10 — Executive Memory supersede manager.
 */

import { archiveExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  commitExecutiveMemoryLifecycle,
  commitExecutiveMemorySupersedeOperation,
  getExecutiveMemoryLifecycle,
  listExecutiveMemorySupersedeOperations,
} from "./executiveMemoryLifecycleRegistry.ts";
import {
  createExecutiveMemoryLifecycleAuditMetadata,
  createExecutiveMemorySupersedeOperation,
} from "./executiveMemoryLifecycleModel.ts";
import {
  validateExecutiveMemoryLifecycleTransition,
  validateSupersedeExecutiveMemoryInput,
} from "./executiveMemoryLifecycleValidator.ts";
import { createMemoryVersion } from "./executiveMemoryLifecycleVersionManager.ts";
import type {
  ExecutiveMemorySupersedeOperation,
  SupersedeExecutiveMemoryInput,
} from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

export function validateSupersede(input: SupersedeExecutiveMemoryInput) {
  return validateSupersedeExecutiveMemoryInput(input);
}

export function inspectSupersedeHistory(): readonly ExecutiveMemorySupersedeOperation[] {
  return listExecutiveMemorySupersedeOperations();
}

export function supersedeExecutiveMemory(
  input: SupersedeExecutiveMemoryInput
): Readonly<{ success: boolean; reason: string; operation: ExecutiveMemorySupersedeOperation | null }> {
  const validation = validateSupersedeExecutiveMemoryInput(input);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      operation: null,
    });
  }

  const obsoleteLifecycle = getExecutiveMemoryLifecycle(input.obsoleteMemoryId);
  if (!obsoleteLifecycle) {
    return Object.freeze({ success: false, reason: "Obsolete lifecycle not registered.", operation: null });
  }

  const transition = validateExecutiveMemoryLifecycleTransition({
    memoryId: input.obsoleteMemoryId,
    toState: "superseded",
  });
  if (!transition.valid) {
    return Object.freeze({
      success: false,
      reason: transition.issues.map((entry) => entry.message).join("; "),
      operation: null,
    });
  }

  archiveExecutiveMemory(input.obsoleteMemoryId, input.timestamp);
  commitExecutiveMemoryLifecycle(
    Object.freeze({
      ...obsoleteLifecycle,
      governanceState: "superseded",
      supersededBy: input.replacementMemoryId,
      updatedAt: input.timestamp,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: input.author,
        sourceModule: "executive-memory-lifecycle",
        reason: input.reason ?? "Superseded by replacement memory.",
      }),
      readOnly: true as const,
    })
  );

  createMemoryVersion({
    memoryId: input.replacementMemoryId,
    author: input.author,
    operation: "supersede",
    timestamp: input.timestamp,
    reason: input.reason ?? `Supersedes ${input.obsoleteMemoryId}.`,
  });

  const operation = createExecutiveMemorySupersedeOperation({
    operationId: `supersede-${input.obsoleteMemoryId}-${input.timestamp}`,
    obsoleteMemoryId: input.obsoleteMemoryId,
    replacementMemoryId: input.replacementMemoryId,
    author: input.author,
    createdAt: input.timestamp,
  });
  commitExecutiveMemorySupersedeOperation(operation);

  return Object.freeze({ success: true, reason: "Memory superseded.", operation });
}

export function restoreSupersededMemory(input: {
  memoryId: ExecutiveMemoryId;
  author: string;
  timestamp: string;
}): Readonly<{ success: boolean; reason: string }> {
  const lifecycle = getExecutiveMemoryLifecycle(input.memoryId);
  if (!lifecycle) {
    return Object.freeze({ success: false, reason: `Lifecycle not found: ${input.memoryId}.` });
  }
  if (lifecycle.governanceState !== "superseded") {
    return Object.freeze({ success: false, reason: "Memory is not superseded." });
  }

  const transition = validateExecutiveMemoryLifecycleTransition({
    memoryId: input.memoryId,
    toState: "active",
  });
  if (!transition.valid) {
    return Object.freeze({
      success: false,
      reason: transition.issues.map((entry) => entry.message).join("; "),
    });
  }

  commitExecutiveMemoryLifecycle(
    Object.freeze({
      ...lifecycle,
      governanceState: "active",
      supersededBy: null,
      updatedAt: input.timestamp,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: input.author,
        sourceModule: "executive-memory-lifecycle",
        reason: "Superseded memory restored.",
      }),
      readOnly: true as const,
    })
  );

  return Object.freeze({ success: true, reason: "Superseded memory restored." });
}

export const ExecutiveMemorySupersedeManager = Object.freeze({
  validateSupersede,
  inspectSupersedeHistory,
  supersedeExecutiveMemory,
  restoreSupersededMemory,
});
