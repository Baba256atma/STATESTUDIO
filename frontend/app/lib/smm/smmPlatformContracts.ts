/**
 * SMM-1 — Shared Mental Model Platform contracts and constants.
 */

export const SMM_PLATFORM_CONTRACT_VERSION = "SMM/1" as const;
export const SMM_PLATFORM_ARCHITECTURE_VERSION = "SMM/1-arch" as const;
export const SMM_PLATFORM_API_VERSION = "SMM/1" as const;
export const SMM_PLATFORM_COMPATIBILITY_VERSION = "SMM/1-compat" as const;
export const SMM_PLATFORM_SOURCE = "smm-platform-foundation" as const;
export const SMM_PLATFORM_LOG_PREFIX = "[NexoraSMM]" as const;
export const SMM_PLATFORM_LAYER_ID = "SMM" as const;

export const SMM_PLATFORM_ID = "smm-platform" as const;
export const SMM_PLATFORM_NAME = "Shared Mental Model Platform" as const;

export const SMM_PLATFORM_TAGS = Object.freeze([
  "[SMM_1]",
  "[SMM_FOUNDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_INFERENCE]",
  "[NO_RUNTIME]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const SMM_PLATFORM_PRINCIPLES = Object.freeze([
  "completely_modular",
  "deterministic_contracts",
  "no_hidden_state",
  "no_circular_dependencies",
  "no_duplicated_business_logic",
  "single_responsibility_per_module",
  "future_phases_consume_contracts_only",
  "enterprise_scalable_architecture",
  "reference_based_not_inference_based",
  "shared_understanding_not_ai_reasoning",
] as const);

export const SMM_MODEL_SCOPE_KEYS = Object.freeze([
  "workspace",
  "organization",
  "scenario",
  "object",
  "relationship",
  "executive",
] as const);

export const SMM_MODEL_ARTIFACT_TYPE_KEYS = Object.freeze([
  "belief",
  "assumption",
  "constraint",
  "invariant",
  "narrative",
  "perspective",
] as const);

export const SMM_MODEL_CONTRACT_KEYS = Object.freeze([
  "model_definition",
  "model_snapshot",
  "model_reference",
  "model_version",
  "model_boundary",
  "model_sync",
] as const);

export const SMM_EXTENSION_POINT_KEYS = Object.freeze([
  "model_builder",
  "model_registry",
  "model_validation",
  "model_sync",
  "model_query",
  "model_governance",
  "model_integration",
  "model_certification",
] as const);

export const SMM_PLATFORM_MUST_OWN = Object.freeze([
  "shared_mental_model_contracts",
  "model_scope_definitions",
  "model_artifact_contracts",
  "model_reference_contracts",
  "model_version_contracts",
  "model_boundary_definitions",
  "extension_point_registry",
] as const);

export const SMM_PLATFORM_MUST_NOT_OWN = Object.freeze([
  "llm_execution",
  "provider_calls",
  "inference_algorithms",
  "ai_reasoning",
  "business_logic",
  "executive_intelligence",
  "knowledge_generation",
  "kpi_calculations",
  "decision_making",
  "scenario_reasoning",
  "hidden_state_persistence",
  "runtime_execution",
  "prompt_generation",
  "context_building",
] as const);

export const SMM_FUTURE_PHASE_KEYS = Object.freeze([
  "model_builder",
  "model_registry",
  "model_validation",
  "model_sync",
  "model_query",
  "model_governance",
  "model_integration",
  "platform_certification",
] as const);

export const SMM_COMPATIBLE_LAYER_KEYS = Object.freeze([
  "CORE",
  "KNL",
  "APP",
  "LLM",
  "ASS",
  "LAY",
] as const);

export const SMM_FUTURE_DEPENDENCY_RULES = Object.freeze([
  Object.freeze({
    ruleId: "smm-1-prerequisite",
    description: "All SMM phases must depend on SMM/1.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-inference-in-foundation",
    description: "SMM/1 defines contracts only; no inference or reasoning implementation.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-knl-modification",
    description: "SMM must not modify certified KNL platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-app-modification",
    description: "SMM must not modify certified APP platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "no-llm-modification",
    description: "SMM must not modify certified LLM platforms.",
    enforced: true as const,
  }),
  Object.freeze({
    ruleId: "extend-only-contracts",
    description: "Future SMM phases extend contracts additively; no breaking changes to SMM/1.",
    enforced: true as const,
  }),
] as const);

export const SMM_PUBLIC_API_REGISTRY = Object.freeze([
  "getSmmPlatformIdentity",
  "getSmmPlatformBoundaries",
  "getSmmPlatformRegistry",
  "getSmmPlatformVersionMetadata",
  "buildSmmPlatformFoundation",
  "validateSmmPlatformContracts",
  "getSmmPlatformManifest",
] as const);

export const SMM_VERSION_PATTERN = /^SMM\/\d+$/;

export const SMM_RELEASE_METADATA = Object.freeze({
  releaseStage: "mvp-foundation",
  mvpStatus: "active",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  compatibilityLevel: "foundation",
  readOnly: true as const,
});

export const SMM_MIGRATION_STRATEGY = Object.freeze({
  strategyId: "smm-contract-extension",
  description: "Future SMM phases extend SMM/1 contracts additively. Breaking changes require a new platform major version.",
  additiveOnly: true,
  breakingChangesForbidden: true,
  readOnly: true as const,
});

export const SMM_MODEL_SCOPE_LABELS = Object.freeze({
  workspace: "Workspace Scope",
  organization: "Organization Scope",
  scenario: "Scenario Scope",
  object: "Object Scope",
  relationship: "Relationship Scope",
  executive: "Executive Scope",
} as const);

export const SMM_MODEL_ARTIFACT_TYPE_LABELS = Object.freeze({
  belief: "Belief Artifact",
  assumption: "Assumption Artifact",
  constraint: "Constraint Artifact",
  invariant: "Invariant Artifact",
  narrative: "Narrative Artifact",
  perspective: "Perspective Artifact",
} as const);

export const SMM_MODEL_CONTRACT_LABELS = Object.freeze({
  model_definition: "Model Definition Contract",
  model_snapshot: "Model Snapshot Contract",
  model_reference: "Model Reference Contract",
  model_version: "Model Version Contract",
  model_boundary: "Model Boundary Contract",
  model_sync: "Model Sync Contract",
} as const);

export const SMM_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "smm-model-builder", label: "Model Builder", phaseKey: "model_builder", status: "reserved" as const }),
  Object.freeze({ extensionId: "smm-model-registry", label: "Model Registry", phaseKey: "model_registry", status: "reserved" as const }),
  Object.freeze({ extensionId: "smm-model-validation", label: "Model Validation", phaseKey: "model_validation", status: "reserved" as const }),
  Object.freeze({ extensionId: "smm-model-sync", label: "Model Sync", phaseKey: "model_sync", status: "reserved" as const }),
  Object.freeze({ extensionId: "smm-model-query", label: "Model Query", phaseKey: "model_query", status: "reserved" as const }),
  Object.freeze({ extensionId: "smm-model-governance", label: "Model Governance", phaseKey: "model_governance", status: "reserved" as const }),
  Object.freeze({ extensionId: "smm-model-integration", label: "Model Integration", phaseKey: "model_integration", status: "reserved" as const }),
  Object.freeze({ extensionId: "smm-model-certification", label: "Platform Certification", phaseKey: "model_certification", status: "reserved" as const }),
] as const);

export const SMM_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredScopes: 16,
  maxRegisteredArtifactTypes: 16,
  maxRegisteredModelContracts: 16,
  maxRegisteredExtensionPoints: 32,
} as const);

export const SMM_ARCHITECTURE_STACK = Object.freeze([
  "CORE",
  "KNL",
  "APP",
  "LLM",
  "SMM",
  "ASS",
  "IDN",
  "LAY",
  "EBUS",
  "INTG",
  "SEC",
  "OPS",
] as const);

export const SMM_POSITION_STATEMENT = Object.freeze({
  smmIsNot: Object.freeze([
    "an_llm_provider_layer",
    "an_inference_engine",
    "an_ai_reasoning_system",
    "app_business_intelligence",
    "knl_knowledge_generation",
    "runtime_execution",
    "hidden_state_store",
  ]),
  smmIs: Object.freeze([
    "shared_mental_model_contract_layer",
    "deterministic_reference_architecture",
    "modular_foundation_for_organizational_understanding",
    "consumer_of_reference_contracts_from_certified_layers",
    "publisher_of_model_contracts_for_future_ass_and_lay_phases",
  ]),
  readOnly: true as const,
});
