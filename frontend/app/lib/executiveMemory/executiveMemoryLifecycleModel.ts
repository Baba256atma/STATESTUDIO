/**
 * APP-4:10 — Executive Memory Lifecycle builders.
 */

import {
  EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_LIFECYCLE_SCHEMA_VERSION,
  EXECUTIVE_MEMORY_RETENTION_POLICY_IDS,
} from "./executiveMemoryLifecycleConstants.ts";
import type {
  ExecutiveMemoryLifecycle,
  ExecutiveMemoryLifecycleAuditMetadata,
  ExecutiveMemoryMergeOperation,
  ExecutiveMemoryRetentionPolicy,
  ExecutiveMemorySplitOperation,
  ExecutiveMemorySupersedeOperation,
  ExecutiveMemoryVersionHistory,
  ExecutiveMemoryVersionRecord,
} from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

export function createExecutiveMemoryLifecycleAuditMetadata(
  input: Omit<ExecutiveMemoryLifecycleAuditMetadata, "readOnly">
): ExecutiveMemoryLifecycleAuditMetadata {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryLifecycle(input: {
  memoryId: ExecutiveMemoryId;
  canonicalMemoryId?: ExecutiveMemoryId;
  governanceState?: ExecutiveMemoryLifecycle["governanceState"];
  currentVersionId: string;
  retentionPolicyId?: string;
  supersededBy?: ExecutiveMemoryId | null;
  mergedInto?: ExecutiveMemoryId | null;
  splitFrom?: ExecutiveMemoryId | null;
  lockedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  audit: ExecutiveMemoryLifecycleAuditMetadata;
}): ExecutiveMemoryLifecycle {
  return Object.freeze({
    memoryId: input.memoryId,
    canonicalMemoryId: input.canonicalMemoryId ?? input.memoryId,
    governanceState: input.governanceState ?? "active",
    currentVersionId: input.currentVersionId,
    retentionPolicyId: input.retentionPolicyId ?? EXECUTIVE_MEMORY_RETENTION_POLICY_IDS.keepForever,
    supersededBy: input.supersededBy ?? null,
    mergedInto: input.mergedInto ?? null,
    splitFrom: input.splitFrom ?? null,
    lockedAt: input.lockedAt ?? null,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    audit: input.audit,
    readOnly: true as const,
  });
}

export function createExecutiveMemoryVersionRecord(
  input: Omit<ExecutiveMemoryVersionRecord, "readOnly">
): ExecutiveMemoryVersionRecord {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryVersionHistory(
  canonicalMemoryId: ExecutiveMemoryId,
  versions: readonly ExecutiveMemoryVersionRecord[]
): ExecutiveMemoryVersionHistory {
  const sorted = [...versions].sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  return Object.freeze({
    canonicalMemoryId,
    versions: Object.freeze(sorted),
    latestVersionId: sorted.at(-1)?.versionId ?? null,
    readOnly: true as const,
  });
}

export function createExecutiveMemoryRetentionPolicy(
  input: Omit<ExecutiveMemoryRetentionPolicy, "readOnly">
): ExecutiveMemoryRetentionPolicy {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryMergeOperation(
  input: Omit<ExecutiveMemoryMergeOperation, "readOnly">
): ExecutiveMemoryMergeOperation {
  return Object.freeze({
    ...input,
    sourceMemoryIds: Object.freeze([...input.sourceMemoryIds]),
    readOnly: true as const,
  });
}

export function createExecutiveMemorySplitOperation(
  input: Omit<ExecutiveMemorySplitOperation, "readOnly">
): ExecutiveMemorySplitOperation {
  return Object.freeze({
    ...input,
    targetMemoryIds: Object.freeze([...input.targetMemoryIds]),
    readOnly: true as const,
  });
}

export function createExecutiveMemorySupersedeOperation(
  input: Omit<ExecutiveMemorySupersedeOperation, "readOnly">
): ExecutiveMemorySupersedeOperation {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function bumpExecutiveMemorySemanticVersion(version: string): string {
  const parts = version.split(".").map((entry) => Number.parseInt(entry, 10));
  if (parts.length !== 3 || parts.some((entry) => Number.isNaN(entry))) return "1.0.1";
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export const ExecutiveMemoryLifecycleBuilder = Object.freeze({
  createExecutiveMemoryLifecycle,
  createExecutiveMemoryLifecycleAuditMetadata,
  createExecutiveMemoryVersionRecord,
  createExecutiveMemoryVersionHistory,
  createExecutiveMemoryRetentionPolicy,
  createExecutiveMemoryMergeOperation,
  createExecutiveMemorySplitOperation,
  createExecutiveMemorySupersedeOperation,
  bumpExecutiveMemorySemanticVersion,
  schemaVersion: EXECUTIVE_MEMORY_LIFECYCLE_SCHEMA_VERSION,
  contractVersion: EXECUTIVE_MEMORY_LIFECYCLE_CONTRACT_VERSION,
});
