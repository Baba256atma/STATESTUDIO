/**
 * APP-4:10 — Executive Memory Lifecycle registry.
 */

import type {
  ExecutiveMemoryLifecycle,
  ExecutiveMemoryMergeOperation,
  ExecutiveMemoryRetentionPolicy,
  ExecutiveMemorySplitOperation,
  ExecutiveMemorySupersedeOperation,
  ExecutiveMemoryVersionRecord,
} from "./executiveMemoryLifecycleTypes.ts";
import type { ExecutiveMemoryId } from "./executiveMemoryTypes.ts";

const lifecycles = new Map<ExecutiveMemoryId, ExecutiveMemoryLifecycle>();
const versions = new Map<ExecutiveMemoryId, ExecutiveMemoryVersionRecord[]>();
const mergeOperations = new Map<string, ExecutiveMemoryMergeOperation>();
const splitOperations = new Map<string, ExecutiveMemorySplitOperation>();
const supersedeOperations = new Map<string, ExecutiveMemorySupersedeOperation>();
const retentionPolicies = new Map<string, ExecutiveMemoryRetentionPolicy>();

export type ExecutiveMemoryLifecycleRegistrySnapshot = Readonly<{
  lifecycles: ReadonlyMap<ExecutiveMemoryId, ExecutiveMemoryLifecycle>;
  versions: ReadonlyMap<ExecutiveMemoryId, ExecutiveMemoryVersionRecord[]>;
  mergeOperations: ReadonlyMap<string, ExecutiveMemoryMergeOperation>;
  splitOperations: ReadonlyMap<string, ExecutiveMemorySplitOperation>;
  supersedeOperations: ReadonlyMap<string, ExecutiveMemorySupersedeOperation>;
  retentionPolicies: ReadonlyMap<string, ExecutiveMemoryRetentionPolicy>;
}>;

export function resetExecutiveMemoryLifecycleRegistryForTests(): void {
  lifecycles.clear();
  versions.clear();
  mergeOperations.clear();
  splitOperations.clear();
  supersedeOperations.clear();
  retentionPolicies.clear();
}

export function snapshotExecutiveMemoryLifecycleRegistry(): ExecutiveMemoryLifecycleRegistrySnapshot {
  return Object.freeze({
    lifecycles: new Map(lifecycles),
    versions: new Map(versions),
    mergeOperations: new Map(mergeOperations),
    splitOperations: new Map(splitOperations),
    supersedeOperations: new Map(supersedeOperations),
    retentionPolicies: new Map(retentionPolicies),
  });
}

export function restoreExecutiveMemoryLifecycleRegistrySnapshot(
  snapshot: ExecutiveMemoryLifecycleRegistrySnapshot
): void {
  lifecycles.clear();
  versions.clear();
  mergeOperations.clear();
  splitOperations.clear();
  supersedeOperations.clear();
  retentionPolicies.clear();
  for (const [key, value] of snapshot.lifecycles.entries()) lifecycles.set(key, value);
  for (const [key, value] of snapshot.versions.entries()) versions.set(key, [...value]);
  for (const [key, value] of snapshot.mergeOperations.entries()) mergeOperations.set(key, value);
  for (const [key, value] of snapshot.splitOperations.entries()) splitOperations.set(key, value);
  for (const [key, value] of snapshot.supersedeOperations.entries()) supersedeOperations.set(key, value);
  for (const [key, value] of snapshot.retentionPolicies.entries()) retentionPolicies.set(key, value);
}

export function commitExecutiveMemoryLifecycle(lifecycle: ExecutiveMemoryLifecycle): void {
  lifecycles.set(lifecycle.memoryId, lifecycle);
}

export function getExecutiveMemoryLifecycle(memoryId: ExecutiveMemoryId): ExecutiveMemoryLifecycle | null {
  return lifecycles.get(memoryId) ?? null;
}

export function listExecutiveMemoryLifecycles(): readonly ExecutiveMemoryLifecycle[] {
  return Object.freeze(
    [...lifecycles.values()].sort((left, right) => left.memoryId.localeCompare(right.memoryId))
  );
}

export function appendExecutiveMemoryVersionRecord(
  canonicalMemoryId: ExecutiveMemoryId,
  version: ExecutiveMemoryVersionRecord
): void {
  const existing = versions.get(canonicalMemoryId) ?? [];
  versions.set(canonicalMemoryId, [...existing, version]);
}

export function getExecutiveMemoryVersionRecords(
  canonicalMemoryId: ExecutiveMemoryId
): readonly ExecutiveMemoryVersionRecord[] {
  return Object.freeze([...(versions.get(canonicalMemoryId) ?? [])]);
}

export function commitExecutiveMemoryMergeOperation(operation: ExecutiveMemoryMergeOperation): void {
  mergeOperations.set(operation.operationId, operation);
}

export function listExecutiveMemoryMergeOperations(): readonly ExecutiveMemoryMergeOperation[] {
  return Object.freeze(
    [...mergeOperations.values()].sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  );
}

export function commitExecutiveMemorySplitOperation(operation: ExecutiveMemorySplitOperation): void {
  splitOperations.set(operation.operationId, operation);
}

export function listExecutiveMemorySplitOperations(): readonly ExecutiveMemorySplitOperation[] {
  return Object.freeze(
    [...splitOperations.values()].sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  );
}

export function commitExecutiveMemorySupersedeOperation(operation: ExecutiveMemorySupersedeOperation): void {
  supersedeOperations.set(operation.operationId, operation);
}

export function listExecutiveMemorySupersedeOperations(): readonly ExecutiveMemorySupersedeOperation[] {
  return Object.freeze(
    [...supersedeOperations.values()].sort((left, right) => left.createdAt.localeCompare(right.createdAt))
  );
}

export function registerExecutiveMemoryRetentionPolicyRecord(policy: ExecutiveMemoryRetentionPolicy): void {
  retentionPolicies.set(policy.policyId, policy);
}

export function getExecutiveMemoryRetentionPolicyRecord(
  policyId: string
): ExecutiveMemoryRetentionPolicy | null {
  return retentionPolicies.get(policyId) ?? null;
}

export function listExecutiveMemoryRetentionPolicyRecords(): readonly ExecutiveMemoryRetentionPolicy[] {
  return Object.freeze(
    [...retentionPolicies.values()].sort((left, right) => left.policyId.localeCompare(right.policyId))
  );
}

export const ExecutiveMemoryLifecycleRegistry = Object.freeze({
  resetExecutiveMemoryLifecycleRegistryForTests,
  snapshotExecutiveMemoryLifecycleRegistry,
  restoreExecutiveMemoryLifecycleRegistrySnapshot,
  commitExecutiveMemoryLifecycle,
  getExecutiveMemoryLifecycle,
  listExecutiveMemoryLifecycles,
  appendExecutiveMemoryVersionRecord,
  getExecutiveMemoryVersionRecords,
  commitExecutiveMemoryMergeOperation,
  listExecutiveMemoryMergeOperations,
  commitExecutiveMemorySplitOperation,
  listExecutiveMemorySplitOperations,
  commitExecutiveMemorySupersedeOperation,
  listExecutiveMemorySupersedeOperations,
  registerExecutiveMemoryRetentionPolicyRecord,
  getExecutiveMemoryRetentionPolicyRecord,
  listExecutiveMemoryRetentionPolicyRecords,
});
