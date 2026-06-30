/**
 * SMM-4 — Snapshot, version, branch, lineage, manifest, and lifecycle registries.
 */

import { buildSharedMentalModelRegistry } from "./sharedMentalModelIdentityExports.ts";
import {
  SMM_SNAPSHOT_CONTRACT_VERSION,
  SMM_SNAPSHOT_DEFAULT_LIMITS,
} from "./sharedMentalModelSnapshotContracts.ts";
import type {
  SharedMentalModelBranchRecord,
  SharedMentalModelLineageRecord,
  SharedMentalModelSnapshotInput,
  SharedMentalModelSnapshotLifecycleRecord,
  SharedMentalModelSnapshotManifestRecord,
  SharedMentalModelSnapshotPlatformRecord,
  SharedMentalModelSnapshotRegistrationResult,
  SharedMentalModelSnapshotRegistryBundle,
  SharedMentalModelVersionPlatformInput,
  SharedMentalModelVersionPlatformRecord,
} from "./sharedMentalModelSnapshotTypes.ts";

const snapshotRegistry = new Map<string, SharedMentalModelSnapshotPlatformRecord>();
const versionRegistry = new Map<string, SharedMentalModelVersionPlatformRecord>();
const branchRegistry = new Map<string, SharedMentalModelBranchRecord>();
const lineageRegistry = new Map<string, SharedMentalModelLineageRecord>();
const manifestRegistry = new Map<string, SharedMentalModelSnapshotManifestRecord>();
const lifecycleRegistry = new Map<string, SharedMentalModelSnapshotLifecycleRecord>();

function result<T>(success: boolean, reason: string, record: T | null): SharedMentalModelSnapshotRegistrationResult<T> {
  return Object.freeze({ success, reason, record, readOnly: true as const });
}

export function createStableBranchId(modelId: string, seed: string): string {
  return `smm-branch-${modelId}-${seed}`;
}

export function createStableLineageId(snapshotId: string, versionId: string): string {
  return `smm-lineage-${snapshotId}-${versionId}`;
}

export function createStableMergeReferenceId(branchId: string, seed: string): string {
  return `smm-merge-ref-${branchId}-${seed}`;
}

export function createStableSnapshotManifestId(snapshotId: string): string {
  return `smm-snapshot-manifest-${snapshotId}`;
}

export function createStableLifecycleId(snapshotId: string, status: string): string {
  return `smm-lifecycle-${snapshotId}-${status}`;
}

export function buildSharedMentalModelSnapshotRecord(
  input: SharedMentalModelSnapshotInput,
  timestamp: string
): SharedMentalModelSnapshotPlatformRecord {
  return Object.freeze({
    snapshotId: input.snapshotId,
    modelId: input.modelId,
    versionId: input.versionId,
    parentSnapshotId: input.parentSnapshotId ?? null,
    createdAt: timestamp,
    createdByMetadata: Object.freeze({
      ...(input.createdByMetadata ?? {}),
      contractVersion: SMM_SNAPSHOT_CONTRACT_VERSION,
    }),
    workspaceReferenceId: input.workspaceReferenceId,
    organizationReferenceId: input.organizationReferenceId,
    executiveReferenceId: input.executiveReferenceId ?? null,
    branchReferenceId: input.branchReferenceId,
    lifecycleStatus: input.lifecycleStatus ?? "created",
    immutableMetadata: Object.freeze(input.immutableMetadata ?? {}),
    readOnly: true as const,
  });
}

export function buildSharedMentalModelVersionPlatformRecord(
  input: SharedMentalModelVersionPlatformInput,
  timestamp: string
): SharedMentalModelVersionPlatformRecord {
  return Object.freeze({
    versionId: input.versionId,
    modelId: input.modelId,
    previousVersionId: input.previousVersionId ?? null,
    nextVersionId: input.nextVersionId ?? null,
    branchMetadata: Object.freeze(input.branchMetadata ?? {}),
    compatibilityMetadata: Object.freeze({
      ...(input.compatibilityMetadata ?? {}),
      contractVersion: SMM_SNAPSHOT_CONTRACT_VERSION,
    }),
    snapshotReferenceId: input.snapshotReferenceId,
    extensionMetadata: Object.freeze(input.extensionMetadata ?? {}),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function isSharedMentalModelSnapshotImmutable(record: SharedMentalModelSnapshotPlatformRecord): boolean {
  return Object.isFrozen(record);
}

export function resetSharedMentalModelSnapshotStoreForTests(): void {
  snapshotRegistry.clear();
  versionRegistry.clear();
  branchRegistry.clear();
  lineageRegistry.clear();
  manifestRegistry.clear();
  lifecycleRegistry.clear();
}

export function getSharedMentalModelSnapshotRegistryBundle(): SharedMentalModelSnapshotRegistryBundle {
  const sortByKey = <T>(entries: readonly T[], getKey: (entry: T) => string) =>
    Object.freeze([...entries].sort((left, right) => getKey(left).localeCompare(getKey(right))));

  const snapshots = sortByKey([...snapshotRegistry.values()], (entry) => entry.snapshotId);
  const versions = sortByKey([...versionRegistry.values()], (entry) => entry.versionId);
  const branches = sortByKey([...branchRegistry.values()], (entry) => entry.branchId);
  const lineage = sortByKey([...lineageRegistry.values()], (entry) => entry.lineageId);
  const manifests = sortByKey([...manifestRegistry.values()], (entry) => entry.manifestId);
  const lifecycles = sortByKey([...lifecycleRegistry.values()], (entry) => entry.lifecycleId);

  return Object.freeze({
    snapshotRegistry: snapshots,
    snapshotCount: snapshots.length,
    versionRegistry: versions,
    versionCount: versions.length,
    branchRegistry: branches,
    branchCount: branches.length,
    lineageRegistry: lineage,
    lineageCount: lineage.length,
    manifestRegistry: manifests,
    manifestCount: manifests.length,
    lifecycleRegistry: lifecycles,
    lifecycleCount: lifecycles.length,
    readOnly: true as const,
  });
}

export function getSharedMentalModelSnapshotRegistry(): readonly SharedMentalModelSnapshotPlatformRecord[] {
  return getSharedMentalModelSnapshotRegistryBundle().snapshotRegistry;
}

export function getSharedMentalModelVersionRegistry(): readonly SharedMentalModelVersionPlatformRecord[] {
  return getSharedMentalModelSnapshotRegistryBundle().versionRegistry;
}

export function registerSharedMentalModelSnapshot(
  input: SharedMentalModelSnapshotInput,
  timestamp: string
): SharedMentalModelSnapshotRegistrationResult<SharedMentalModelSnapshotPlatformRecord> {
  if (snapshotRegistry.has(input.snapshotId)) {
    return result(false, "Duplicate snapshot ID.", null);
  }
  if (snapshotRegistry.size >= SMM_SNAPSHOT_DEFAULT_LIMITS.maxSnapshots) {
    return result(false, "Snapshot registry limit reached.", null);
  }
  const record = buildSharedMentalModelSnapshotRecord(input, timestamp);
  snapshotRegistry.set(record.snapshotId, record);
  return result(true, "Snapshot registered.", record);
}

export function registerSharedMentalModelVersionPlatform(
  input: SharedMentalModelVersionPlatformInput,
  timestamp: string
): SharedMentalModelSnapshotRegistrationResult<SharedMentalModelVersionPlatformRecord> {
  if (versionRegistry.has(input.versionId)) {
    return result(false, "Duplicate version ID.", null);
  }
  if (versionRegistry.size >= SMM_SNAPSHOT_DEFAULT_LIMITS.maxVersions) {
    return result(false, "Version registry limit reached.", null);
  }
  const record = buildSharedMentalModelVersionPlatformRecord(input, timestamp);
  versionRegistry.set(record.versionId, record);
  return result(true, "Version registered.", record);
}

export function registerSharedMentalModelBranch(
  branchId: string,
  modelId: string,
  branchLabel: string,
  parentBranchId: string | null,
  mergeReferenceId: string | null,
  timestamp: string
): SharedMentalModelSnapshotRegistrationResult<SharedMentalModelBranchRecord> {
  if (branchRegistry.has(branchId)) {
    return result(false, "Duplicate branch ID.", null);
  }
  const record = Object.freeze({
    branchId,
    modelId,
    branchLabel,
    parentBranchId,
    mergeReferenceId,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  branchRegistry.set(branchId, record);
  return result(true, "Branch registered.", record);
}

export function registerSharedMentalModelLineage(
  lineageId: string,
  modelId: string,
  snapshotId: string,
  versionId: string,
  parentSnapshotId: string | null,
  parentVersionId: string | null,
  branchReferenceId: string,
  timestamp: string
): SharedMentalModelSnapshotRegistrationResult<SharedMentalModelLineageRecord> {
  if (lineageRegistry.has(lineageId)) {
    return result(false, "Duplicate lineage ID.", null);
  }
  const record = Object.freeze({
    lineageId,
    modelId,
    snapshotId,
    versionId,
    parentSnapshotId,
    parentVersionId,
    branchReferenceId,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  lineageRegistry.set(lineageId, record);
  return result(true, "Lineage registered.", record);
}

export function registerSharedMentalModelSnapshotManifest(
  manifestId: string,
  snapshotId: string,
  modelId: string,
  versionId: string,
  payloadRef: string,
  timestamp: string
): SharedMentalModelSnapshotRegistrationResult<SharedMentalModelSnapshotManifestRecord> {
  if (manifestRegistry.has(manifestId)) {
    return result(false, "Duplicate manifest ID.", null);
  }
  const record = Object.freeze({
    manifestId,
    snapshotId,
    modelId,
    versionId,
    payloadRef,
    registeredAt: timestamp,
    readOnly: true as const,
  });
  manifestRegistry.set(manifestId, record);
  return result(true, "Snapshot manifest registered.", record);
}

export function registerSharedMentalModelSnapshotLifecycle(
  lifecycleId: string,
  snapshotId: string,
  status: SharedMentalModelSnapshotLifecycleRecord["status"],
  transitionMetadata: Readonly<Record<string, string>>,
  timestamp: string
): SharedMentalModelSnapshotRegistrationResult<SharedMentalModelSnapshotLifecycleRecord> {
  if (lifecycleRegistry.has(lifecycleId)) {
    return result(false, "Duplicate lifecycle ID.", null);
  }
  const record = Object.freeze({
    lifecycleId,
    snapshotId,
    status,
    transitionMetadata: Object.freeze(transitionMetadata),
    recordedAt: timestamp,
    readOnly: true as const,
  });
  lifecycleRegistry.set(lifecycleId, record);
  return result(true, "Lifecycle registered.", record);
}

export function ensureSharedMentalModelSnapshotDependenciesReady(timestamp: string): boolean {
  const identity = buildSharedMentalModelRegistry(timestamp);
  return identity.success;
}

export function lookupSharedMentalModelSnapshot(snapshotId: string): SharedMentalModelSnapshotPlatformRecord | null {
  return snapshotRegistry.get(snapshotId) ?? null;
}

export function lookupSharedMentalModelVersionPlatform(versionId: string): SharedMentalModelVersionPlatformRecord | null {
  return versionRegistry.get(versionId) ?? null;
}
