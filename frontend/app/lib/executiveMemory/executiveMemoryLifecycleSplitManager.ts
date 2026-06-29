/**
 * APP-4:10 — Executive Memory split manager.
 */

import { getExecutiveMemoryById as getStoredExecutiveMemoryById } from "./executiveMemoryRetrievalEngine.ts";
import { archiveExecutiveMemory, createExecutiveMemory } from "./executiveMemoryStorageEngine.ts";
import {
  commitExecutiveMemoryLifecycle,
  commitExecutiveMemorySplitOperation,
  getExecutiveMemoryLifecycle,
  listExecutiveMemorySplitOperations,
} from "./executiveMemoryLifecycleRegistry.ts";
import {
  createExecutiveMemoryLifecycle,
  createExecutiveMemoryLifecycleAuditMetadata,
  createExecutiveMemorySplitOperation,
} from "./executiveMemoryLifecycleModel.ts";
import {
  validateExecutiveMemoryLifecycleTransition,
  validateSplitExecutiveMemoryInput,
} from "./executiveMemoryLifecycleValidator.ts";
import { createMemoryVersion, registerGovernedExecutiveMemory } from "./executiveMemoryLifecycleVersionManager.ts";
import { createExecutiveMemoryRecord } from "./executiveMemoryRecord.ts";
import type {
  ExecutiveMemorySplitOperation,
  SplitExecutiveMemoryInput,
} from "./executiveMemoryLifecycleTypes.ts";

export function validateSplit(input: SplitExecutiveMemoryInput) {
  return validateSplitExecutiveMemoryInput(input);
}

export function inspectSplitHistory(): readonly ExecutiveMemorySplitOperation[] {
  return listExecutiveMemorySplitOperations();
}

export function splitExecutiveMemory(
  input: SplitExecutiveMemoryInput
): Readonly<{ success: boolean; reason: string; operation: ExecutiveMemorySplitOperation | null }> {
  const validation = validateSplitExecutiveMemoryInput(input);
  if (!validation.valid) {
    return Object.freeze({
      success: false,
      reason: validation.issues.map((entry) => entry.message).join("; "),
      operation: null,
    });
  }

  const source = getStoredExecutiveMemoryById(input.sourceMemoryId);
  if (!source.success || !source.data) {
    return Object.freeze({ success: false, reason: "Source memory not found.", operation: null });
  }

  const sourceLifecycle = getExecutiveMemoryLifecycle(input.sourceMemoryId);
  if (!sourceLifecycle) {
    return Object.freeze({ success: false, reason: "Source lifecycle not registered.", operation: null });
  }

  const transition = validateExecutiveMemoryLifecycleTransition({
    memoryId: input.sourceMemoryId,
    toState: "split",
  });
  if (!transition.valid) {
    return Object.freeze({
      success: false,
      reason: transition.issues.map((entry) => entry.message).join("; "),
      operation: null,
    });
  }

  const targetIds: string[] = [];
  for (const target of input.targets) {
    const splitRecord = createExecutiveMemoryRecord({
      ...source.data.record,
      id: target.memoryId,
      header: Object.freeze({
        ...source.data.record.header,
        title: target.label,
        summary: `Split from ${input.sourceMemoryId}: ${target.label}`,
      }),
      createdAt: input.timestamp,
      updatedAt: input.timestamp,
      metadata: Object.freeze({
        ...source.data.record.metadata,
        memoryId: target.memoryId,
      }),
    });
    const created = createExecutiveMemory(splitRecord, input.timestamp);
    if (!created.success) {
      return Object.freeze({ success: false, reason: created.reason ?? "Split target creation failed.", operation: null });
    }
    targetIds.push(target.memoryId);

    registerGovernedExecutiveMemory({
      memoryId: target.memoryId,
      author: input.author,
      timestamp: input.timestamp,
    });
    commitExecutiveMemoryLifecycle(
      createExecutiveMemoryLifecycle({
        memoryId: target.memoryId,
        canonicalMemoryId: sourceLifecycle.canonicalMemoryId,
        governanceState: "active",
        currentVersionId: `version-${target.memoryId}-001`,
        retentionPolicyId: sourceLifecycle.retentionPolicyId,
        splitFrom: input.sourceMemoryId,
        createdAt: input.timestamp,
        updatedAt: input.timestamp,
        audit: createExecutiveMemoryLifecycleAuditMetadata({
          author: input.author,
          sourceModule: "executive-memory-lifecycle",
          reason: input.reason ?? "Split target memory.",
        }),
      })
    );
    createMemoryVersion({
      memoryId: target.memoryId,
      author: input.author,
      operation: "split",
      timestamp: input.timestamp,
      reason: input.reason ?? "Split operation.",
    });
  }

  archiveExecutiveMemory(input.sourceMemoryId, input.timestamp);
  commitExecutiveMemoryLifecycle(
    Object.freeze({
      ...sourceLifecycle,
      governanceState: "split",
      updatedAt: input.timestamp,
      audit: createExecutiveMemoryLifecycleAuditMetadata({
        author: input.author,
        sourceModule: "executive-memory-lifecycle",
        reason: input.reason ?? "Split into derived memories.",
      }),
      readOnly: true as const,
    })
  );

  const operation = createExecutiveMemorySplitOperation({
    operationId: `split-${input.sourceMemoryId}-${input.timestamp}`,
    sourceMemoryId: input.sourceMemoryId,
    targetMemoryIds: Object.freeze(targetIds),
    author: input.author,
    createdAt: input.timestamp,
  });
  commitExecutiveMemorySplitOperation(operation);

  return Object.freeze({ success: true, reason: "Memory split completed.", operation });
}

export const ExecutiveMemorySplitManager = Object.freeze({
  validateSplit,
  inspectSplitHistory,
  splitExecutiveMemory,
});
