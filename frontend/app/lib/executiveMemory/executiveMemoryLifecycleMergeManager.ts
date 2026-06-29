/**
 * APP-4:10 — Executive Memory merge manager.
 */

import { getExecutiveMemoryById as getStoredExecutiveMemoryById } from "./executiveMemoryRetrievalEngine.ts";
import { archiveExecutiveMemory, createExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  commitExecutiveMemoryLifecycle,
  commitExecutiveMemoryMergeOperation,
  getExecutiveMemoryLifecycle,
  listExecutiveMemoryMergeOperations,
} from "./executiveMemoryLifecycleRegistry.ts";
import {
  createExecutiveMemoryLifecycleAuditMetadata,
  createExecutiveMemoryMergeOperation,
} from "./executiveMemoryLifecycleModel.ts";
import {
  validateExecutiveMemoryLifecycleTransition,
  validateMergeExecutiveMemoriesInput,
} from "./executiveMemoryLifecycleValidator.ts";
import { registerGovernedExecutiveMemory, createMemoryVersion } from "./executiveMemoryLifecycleVersionManager.ts";
import { createExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import type {
  ExecutiveMemoryMergeOperation,
  MergeExecutiveMemoriesInput,
} from "./executiveMemoryLifecycleTypes.ts";

export function validateMerge(input: MergeExecutiveMemoriesInput) {
  return validateMergeExecutiveMemoriesInput(input);
}

export function inspectMergeHistory(): readonly ExecutiveMemoryMergeOperation[] {
  return listExecutiveMemoryMergeOperations();
}

export function mergeExecutiveMemories(
  input: MergeExecutiveMemoriesInput
): Readonly<{ success: boolean; reason: string; operation: ExecutiveMemoryMergeOperation | null }> {
  const validation = validateMergeExecutiveMemoriesInput(input);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      operation: null,
    });
  }

  const primary = getStoredExecutiveMemoryById(input.sourceMemoryIds[0]!);
  if (!primary.success || !primary.data) {
    return Object.freeze({ success: false, reason: "Primary source memory not found.", operation: null });
  }

  const mergedRecord = createExecutiveMemoryRecord({
    ...primary.data.record,
    id: input.mergedMemoryId,
    header: Object.freeze({
      ...primary.data.record.header,
      title: `Merged: ${primary.data.record.header.title}`,
      summary: `Merged executive memory from ${input.sourceMemoryIds.join(", ")}.`,
    }),
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
    metadata: Object.freeze({
      ...primary.data.record.metadata,
      memoryId: input.mergedMemoryId,
    }),
  });

  const created = createExecutiveMemory(mergedRecord, input.timestamp);
  if (!created.success || !created.data) {
    return Object.freeze({
      success: false,
      reason: created.reason ?? "Failed to create merged memory.",
      operation: null,
    });
  }

  registerGovernedExecutiveMemory({
    memoryId: input.mergedMemoryId,
    author: input.author,
    timestamp: input.timestamp,
  });
  createMemoryVersion({
    memoryId: input.mergedMemoryId,
    author: input.author,
    operation: "merge",
    timestamp: input.timestamp,
    reason: input.reason ?? "Merge operation.",
  });

  for (const sourceId of input.sourceMemoryIds) {
    const lifecycle = getExecutiveMemoryLifecycle(sourceId);
    if (!lifecycle) continue;
    const transition = validateExecutiveMemoryLifecycleTransition({
      memoryId: sourceId,
      toState: "merged",
    });
    if (!transition.valid) continue;

    archiveExecutiveMemory(sourceId, input.timestamp);
    commitExecutiveMemoryLifecycle(
      Object.freeze({
        ...lifecycle,
        governanceState: "merged",
        mergedInto: input.mergedMemoryId,
        updatedAt: input.timestamp,
        audit: createExecutiveMemoryLifecycleAuditMetadata({
          author: input.author,
          sourceModule: "executive-memory-lifecycle",
          reason: input.reason ?? "Merged into consolidated memory.",
        }),
        readOnly: true as const,
      })
    );
  }

  const operation = createExecutiveMemoryMergeOperation({
    operationId: `merge-${input.mergedMemoryId}-${input.timestamp}`,
    sourceMemoryIds: input.sourceMemoryIds,
    mergedMemoryId: input.mergedMemoryId,
    author: input.author,
    createdAt: input.timestamp,
  });
  commitExecutiveMemoryMergeOperation(operation);

  return Object.freeze({ success: true, reason: "Memories merged.", operation });
}

export const ExecutiveMemoryMergeManager = Object.freeze({
  validateMerge,
  inspectMergeHistory,
  mergeExecutiveMemories,
});
