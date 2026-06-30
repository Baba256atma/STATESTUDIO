/**
 * SMM-4 — Snapshot & Version Platform contracts and constants.
 */

export const SMM_SNAPSHOT_CONTRACT_VERSION = "SMM/4" as const;
export const SMM_SNAPSHOT_PLATFORM_ID = "smm-snapshot-version-platform" as const;
export const SMM_SNAPSHOT_PLATFORM_NAME = "Shared Mental Model Snapshot & Version Platform" as const;
export const SMM_SNAPSHOT_IDENTITY_DEPENDENCY = "SMM/3" as const;
export const SMM_SNAPSHOT_DOMAIN_DEPENDENCY = "SMM/2" as const;
export const SMM_SNAPSHOT_FOUNDATION_DEPENDENCY = "SMM/1" as const;

export const SMM_SNAPSHOT_TAGS = Object.freeze([
  "[SMM_4]",
  "[SNAPSHOT_VERSION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SMM_SNAPSHOT_REGISTRY_KEYS = Object.freeze([
  "snapshot_registry",
  "version_registry",
  "branch_registry",
  "lineage_registry",
  "manifest_registry",
  "lifecycle_registry",
] as const);

export const SMM_SNAPSHOT_LIFECYCLE_STATUS_KEYS = Object.freeze(["created", "sealed", "archived"] as const);

export const SMM_SNAPSHOT_PUBLIC_API_REGISTRY = Object.freeze([
  "buildSharedMentalModelSnapshotPlatform",
  "validateSharedMentalModelSnapshots",
  "getSharedMentalModelSnapshotRegistry",
  "getSharedMentalModelVersionRegistry",
  "getSharedMentalModelSnapshotManifest",
] as const);

export const SMM_SNAPSHOT_COMPATIBLE_VERSIONS = Object.freeze(["SMM/1", "SMM/2", "SMM/3"] as const);

export const SMM_SNAPSHOT_PRINCIPLES = Object.freeze([
  "snapshots_are_permanently_immutable",
  "versions_never_overwrite_other_versions",
  "deterministic_lineage_metadata_only",
  "no_merge_algorithms_no_history_reconstruction",
  "future_engines_consume_snapshot_contracts_unchanged",
  "reference_based_registries",
] as const);

export const SMM_SNAPSHOT_MANDATORY_FIELDS = Object.freeze([
  "snapshotId",
  "modelId",
  "versionId",
  "parentSnapshotId",
  "createdAt",
  "createdByMetadata",
  "workspaceReferenceId",
  "organizationReferenceId",
  "branchReferenceId",
  "lifecycleStatus",
  "immutableMetadata",
  "readOnly",
] as const);

export const SMM_VERSION_MANDATORY_FIELDS = Object.freeze([
  "versionId",
  "modelId",
  "previousVersionId",
  "nextVersionId",
  "branchMetadata",
  "compatibilityMetadata",
  "snapshotReferenceId",
  "extensionMetadata",
  "registeredAt",
  "readOnly",
] as const);

export const SMM_SNAPSHOT_DEFAULT_LIMITS = Object.freeze({
  maxSnapshots: 4096,
  maxVersions: 2048,
  maxBranches: 512,
  maxLineageEntries: 8192,
  maxManifests: 4096,
  maxLifecycleEntries: 8192,
} as const);

export const SMM_SNAPSHOT_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "similarity_algorithms",
  "alignment",
  "conflict_detection",
  "recommendations",
  "runtime_execution",
  "merge_algorithms",
  "history_reconstruction",
  "semantic_processing",
] as const);
