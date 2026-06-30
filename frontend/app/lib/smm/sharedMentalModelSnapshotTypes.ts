/**
 * SMM-4 — Snapshot & Version Platform domain types.
 */

import type {
  SMM_SNAPSHOT_CONTRACT_VERSION,
  SMM_SNAPSHOT_LIFECYCLE_STATUS_KEYS,
  SMM_SNAPSHOT_REGISTRY_KEYS,
} from "./sharedMentalModelSnapshotContracts.ts";

export type SharedMentalModelSnapshotLifecycleStatus = (typeof SMM_SNAPSHOT_LIFECYCLE_STATUS_KEYS)[number];
export type SharedMentalModelSnapshotRegistryKey = (typeof SMM_SNAPSHOT_REGISTRY_KEYS)[number];

export type SharedMentalModelSnapshotPlatformRecord = Readonly<{
  snapshotId: string;
  modelId: string;
  versionId: string;
  parentSnapshotId: string | null;
  createdAt: string;
  createdByMetadata: Readonly<Record<string, string>>;
  workspaceReferenceId: string;
  organizationReferenceId: string;
  executiveReferenceId: string | null;
  branchReferenceId: string;
  lifecycleStatus: SharedMentalModelSnapshotLifecycleStatus;
  immutableMetadata: Readonly<Record<string, string>>;
  readOnly: true;
}>;

export type SharedMentalModelVersionPlatformRecord = Readonly<{
  versionId: string;
  modelId: string;
  previousVersionId: string | null;
  nextVersionId: string | null;
  branchMetadata: Readonly<Record<string, string>>;
  compatibilityMetadata: Readonly<Record<string, string>>;
  snapshotReferenceId: string;
  extensionMetadata: Readonly<Record<string, string>>;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelBranchRecord = Readonly<{
  branchId: string;
  modelId: string;
  branchLabel: string;
  parentBranchId: string | null;
  mergeReferenceId: string | null;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelLineageRecord = Readonly<{
  lineageId: string;
  modelId: string;
  snapshotId: string;
  versionId: string;
  parentSnapshotId: string | null;
  parentVersionId: string | null;
  branchReferenceId: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotManifestRecord = Readonly<{
  manifestId: string;
  snapshotId: string;
  modelId: string;
  versionId: string;
  payloadRef: string;
  registeredAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotLifecycleRecord = Readonly<{
  lifecycleId: string;
  snapshotId: string;
  status: SharedMentalModelSnapshotLifecycleStatus;
  transitionMetadata: Readonly<Record<string, string>>;
  recordedAt: string;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotRegistryBundle = Readonly<{
  snapshotRegistry: readonly SharedMentalModelSnapshotPlatformRecord[];
  snapshotCount: number;
  versionRegistry: readonly SharedMentalModelVersionPlatformRecord[];
  versionCount: number;
  branchRegistry: readonly SharedMentalModelBranchRecord[];
  branchCount: number;
  lineageRegistry: readonly SharedMentalModelLineageRecord[];
  lineageCount: number;
  manifestRegistry: readonly SharedMentalModelSnapshotManifestRecord[];
  manifestCount: number;
  lifecycleRegistry: readonly SharedMentalModelSnapshotLifecycleRecord[];
  lifecycleCount: number;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotPlatformManifest = Readonly<{
  manifestId: string;
  platformId: typeof import("./sharedMentalModelSnapshotContracts.ts").SMM_SNAPSHOT_PLATFORM_ID;
  version: typeof SMM_SNAPSHOT_CONTRACT_VERSION;
  title: typeof import("./sharedMentalModelSnapshotContracts.ts").SMM_SNAPSHOT_PLATFORM_NAME;
  goal: string;
  registryKeys: readonly string[];
  snapshotCount: number;
  versionCount: number;
  validationResult: "valid" | "invalid";
  compatibility: readonly string[];
  readOnly: true;
}>;

export type SharedMentalModelSnapshotValidationIssue = Readonly<{
  code: string;
  message: string;
  field?: string;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotValidationReport = Readonly<{
  valid: boolean;
  issues: readonly SharedMentalModelSnapshotValidationIssue[];
  readOnly: true;
}>;

export type SharedMentalModelSnapshotLayerState = Readonly<{
  contractVersion: typeof SMM_SNAPSHOT_CONTRACT_VERSION;
  identityDependency: typeof import("./sharedMentalModelSnapshotContracts.ts").SMM_SNAPSHOT_IDENTITY_DEPENDENCY;
  initialized: boolean;
  registry: SharedMentalModelSnapshotRegistryBundle;
  timestamp: string;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotBuildResult = Readonly<{
  success: boolean;
  reason: string;
  data: SharedMentalModelSnapshotLayerState | null;
  readOnly: true;
}>;

export type SharedMentalModelSnapshotInput = Readonly<{
  snapshotId: string;
  modelId: string;
  versionId: string;
  parentSnapshotId?: string | null;
  createdByMetadata?: Readonly<Record<string, string>>;
  workspaceReferenceId: string;
  organizationReferenceId: string;
  executiveReferenceId?: string | null;
  branchReferenceId: string;
  lifecycleStatus?: SharedMentalModelSnapshotLifecycleStatus;
  immutableMetadata?: Readonly<Record<string, string>>;
}>;

export type SharedMentalModelVersionPlatformInput = Readonly<{
  versionId: string;
  modelId: string;
  previousVersionId?: string | null;
  nextVersionId?: string | null;
  branchMetadata?: Readonly<Record<string, string>>;
  compatibilityMetadata?: Readonly<Record<string, string>>;
  snapshotReferenceId: string;
  extensionMetadata?: Readonly<Record<string, string>>;
}>;

export type SharedMentalModelSnapshotRegistrationResult<T> = Readonly<{
  success: boolean;
  reason: string;
  record: T | null;
  readOnly: true;
}>;
