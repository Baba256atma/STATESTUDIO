/**
 * SMM-2 — Shared Mental Model Domain contracts and constants.
 */

export const SMM_DOMAIN_CONTRACT_VERSION = "SMM/2" as const;
export const SMM_DOMAIN_PLATFORM_ID = "smm-shared-mental-model-domain" as const;
export const SMM_DOMAIN_PLATFORM_NAME = "Shared Mental Model Domain Contracts" as const;
export const SMM_DOMAIN_FOUNDATION_DEPENDENCY = "SMM/1" as const;

export const SMM_DOMAIN_TAGS = Object.freeze([
  "[SMM_2]",
  "[DOMAIN_CONTRACTS]",
  "[CONTRACT_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const SMM_DOMAIN_MODEL_KEYS = Object.freeze([
  "mental_model",
  "belief",
  "assumption",
  "constraint",
  "perspective",
  "narrative",
  "executive_view",
  "organization_view",
  "workspace_view",
  "scenario_view",
  "model_snapshot",
  "model_reference",
  "model_version",
  "model_metadata",
] as const);

export const SMM_DOMAIN_VIEW_KEYS = Object.freeze([
  "executive_view",
  "organization_view",
  "workspace_view",
  "scenario_view",
] as const);

export const SMM_DOMAIN_ARTIFACT_KEYS = Object.freeze([
  "belief",
  "assumption",
  "constraint",
  "perspective",
  "narrative",
] as const);

export const SMM_DOMAIN_REGISTRY_KEYS = Object.freeze([
  "domain_registry",
  "contract_registry",
  "artifact_registry",
  "version_registry",
  "extension_registry",
] as const);

export const SMM_DOMAIN_PUBLIC_API_REGISTRY = Object.freeze([
  "buildSharedMentalModelContracts",
  "validateSharedMentalModelContracts",
  "getSharedMentalModelContractRegistry",
  "getSharedMentalModelManifest",
] as const);

export const SMM_DOMAIN_COMPATIBLE_VERSIONS = Object.freeze(["SMM/1"] as const);

export const SMM_DOMAIN_PRINCIPLES = Object.freeze([
  "interface_only_domain_contracts",
  "deterministic_semantic_representation",
  "no_runtime_no_inference_no_algorithms",
  "future_engines_consume_without_modification",
  "immutable_registries",
  "metadata_validation_only",
] as const);

export const SMM_DOMAIN_MUST_NOT_OWN = Object.freeze([
  "similarity_algorithms",
  "alignment_algorithms",
  "conflict_detection",
  "recommendation_engines",
  "ai_reasoning",
  "business_validation",
  "runtime_execution",
] as const);

export const SMM_DOMAIN_MANDATORY_IDENTITY_FIELDS = Object.freeze([
  "entityId",
  "contractVersion",
  "foundationVersion",
  "scopeRef",
  "contentRef",
  "createdAt",
  "readOnly",
] as const);

export const SMM_DOMAIN_MODEL_LABELS = Object.freeze({
  mental_model: "Mental Model",
  belief: "Belief",
  assumption: "Assumption",
  constraint: "Constraint",
  perspective: "Perspective",
  narrative: "Narrative",
  executive_view: "Executive View",
  organization_view: "Organization View",
  workspace_view: "Workspace View",
  scenario_view: "Scenario View",
  model_snapshot: "Model Snapshot",
  model_reference: "Model Reference",
  model_version: "Model Version",
  model_metadata: "Model Metadata",
} as const);

export const SMM_DOMAIN_DEFAULT_LIMITS = Object.freeze({
  maxDomainEntries: 32,
  maxContractEntries: 32,
  maxArtifactEntries: 16,
  maxVersionEntries: 16,
  maxExtensionEntries: 16,
} as const);

export const SMM_DOMAIN_VERSION_PATTERN = /^SMM\/\d+$/;
