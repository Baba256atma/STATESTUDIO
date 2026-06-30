/**
 * SMM-5 — Synchronization Platform contracts and constants.
 */

export const SMM_SYNC_CONTRACT_VERSION = "SMM/5" as const;
export const SMM_SYNC_PLATFORM_ID = "smm-synchronization-platform" as const;
export const SMM_SYNC_PLATFORM_NAME = "Shared Mental Model Synchronization Platform" as const;
export const SMM_SYNC_SNAPSHOT_DEPENDENCY = "SMM/4" as const;
export const SMM_SYNC_IDENTITY_DEPENDENCY = "SMM/3" as const;
export const SMM_SYNC_DOMAIN_DEPENDENCY = "SMM/2" as const;
export const SMM_SYNC_FOUNDATION_DEPENDENCY = "SMM/1" as const;

export const SMM_SYNC_TAGS = Object.freeze([
  "[SMM_5]",
  "[SYNCHRONIZATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SMM_SYNC_SCOPE_KEYS = Object.freeze([
  "workspace_workspace",
  "executive_executive",
  "organization_organization",
  "scenario_scenario",
  "model_model",
  "snapshot_snapshot",
] as const);

export const SMM_SYNC_POLICY_KEYS = Object.freeze([
  "manual",
  "automatic",
  "read_only",
  "reference_only",
  "one_way",
  "two_way",
] as const);

export const SMM_SYNC_REGISTRY_KEYS = Object.freeze([
  "synchronization_registry",
  "scope_registry",
  "policy_registry",
  "reference_registry",
  "manifest_registry",
  "validation_registry",
] as const);

export const SMM_SYNC_STATUS_KEYS = Object.freeze([
  "registered",
  "pending",
  "active",
  "suspended",
  "archived",
] as const);

export const SMM_SYNC_PUBLIC_API_REGISTRY = Object.freeze([
  "buildSharedMentalModelSynchronizationPlatform",
  "validateSharedMentalModelSynchronization",
  "getSharedMentalModelSynchronizationRegistry",
  "getSharedMentalModelSynchronizationManifest",
  "getSharedMentalModelSynchronizationPolicies",
] as const);

export const SMM_SYNC_COMPATIBLE_VERSIONS = Object.freeze(["SMM/1", "SMM/2", "SMM/3", "SMM/4"] as const);

export const SMM_SYNC_PRINCIPLES = Object.freeze([
  "synchronization_records_immutable_after_registration",
  "policies_are_descriptive_metadata_only",
  "no_runtime_synchronization_no_message_passing",
  "deterministic_scope_mapping_metadata_only",
  "future_engines_consume_sync_contracts_unchanged",
  "reference_based_registries",
] as const);

export const SMM_SYNC_MANDATORY_FIELDS = Object.freeze([
  "synchronizationId",
  "sourceReferenceId",
  "targetReferenceId",
  "synchronizationScope",
  "synchronizationPolicy",
  "synchronizationStatusMetadata",
  "versionCompatibilityMetadata",
  "snapshotReferenceIds",
  "createdAt",
  "createdMetadata",
  "extensionMetadata",
  "readOnly",
] as const);

export const SMM_SYNC_DEFAULT_LIMITS = Object.freeze({
  maxSynchronizations: 4096,
  maxScopes: 2048,
  maxPolicies: 256,
  maxReferences: 8192,
  maxManifests: 4096,
  maxValidationRules: 512,
} as const);

export const SMM_SYNC_MUST_NOT_OWN = Object.freeze([
  "ai_reasoning",
  "similarity_algorithms",
  "alignment_calculations",
  "conflict_detection",
  "consensus_generation",
  "recommendations",
  "runtime_synchronization",
  "event_processing",
  "message_passing",
  "event_queues",
] as const);
