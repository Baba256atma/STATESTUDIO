/**
 * SMM-3 — Registry & Identity Engine contracts and constants.
 */

export const SMM_IDENTITY_CONTRACT_VERSION = "SMM/3" as const;
export const SMM_IDENTITY_PLATFORM_ID = "smm-identity-registry-engine" as const;
export const SMM_IDENTITY_PLATFORM_NAME = "Shared Mental Model Registry & Identity Engine" as const;
export const SMM_IDENTITY_DOMAIN_DEPENDENCY = "SMM/2" as const;
export const SMM_IDENTITY_FOUNDATION_DEPENDENCY = "SMM/1" as const;

export const SMM_IDENTITY_TAGS = Object.freeze([
  "[SMM_3]",
  "[IDENTITY_REGISTRY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SMM_IDENTITY_REGISTRY_KEYS = Object.freeze([
  "identity_registry",
  "reference_registry",
  "snapshot_registry",
  "version_registry",
  "artifact_registry",
  "executive_registry",
  "workspace_registry",
  "organization_registry",
  "scenario_registry",
] as const);

export const SMM_IDENTITY_REFERENCE_TYPE_KEYS = Object.freeze([
  "model",
  "parent",
  "workspace",
  "organization",
  "executive",
  "snapshot",
  "artifact",
  "version",
  "scenario",
] as const);

export const SMM_IDENTITY_PUBLIC_API_REGISTRY = Object.freeze([
  "buildSharedMentalModelRegistry",
  "validateSharedMentalModelRegistry",
  "getSharedMentalModelIdentityRegistry",
  "resolveSharedMentalModelReference",
  "getSharedMentalModelRegistryManifest",
] as const);

export const SMM_IDENTITY_COMPATIBLE_VERSIONS = Object.freeze(["SMM/1", "SMM/2"] as const);

export const SMM_IDENTITY_PRINCIPLES = Object.freeze([
  "authoritative_for_identity_not_business_state",
  "immutable_ids_never_change_after_creation",
  "deterministic_reference_resolution",
  "no_inference_no_semantic_validation",
  "future_engines_resolve_through_registry_only",
  "reference_based_registries",
] as const);

export const SMM_IDENTITY_MANDATORY_FIELDS = Object.freeze([
  "modelId",
  "modelVersion",
  "workspaceReferenceId",
  "organizationReferenceId",
  "snapshotReferenceId",
  "createdAt",
  "readOnly",
] as const);

export const SMM_IDENTITY_DEFAULT_LIMITS = Object.freeze({
  maxIdentities: 4096,
  maxReferences: 8192,
  maxSnapshots: 4096,
  maxVersions: 2048,
  maxArtifacts: 4096,
  maxExecutives: 1024,
  maxWorkspaces: 1024,
  maxOrganizations: 512,
  maxScenarios: 2048,
} as const);

export const SMM_IDENTITY_MUST_NOT_OWN = Object.freeze([
  "similarity_algorithms",
  "alignment_algorithms",
  "conflict_detection",
  "recommendations",
  "ai_reasoning",
  "semantic_validation",
  "runtime_execution",
  "business_state",
] as const);
