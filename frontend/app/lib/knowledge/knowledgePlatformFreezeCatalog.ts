/**
 * KNL-15 — Knowledge Platform Freeze catalog constants.
 */

export const KNOWLEDGE_PLATFORM_FREEZE_CONTRACT_VERSION = "KNL/15" as const;
export const KNOWLEDGE_PLATFORM_FREEZE_ARCHITECTURE_VERSION = "KNL/15-knowledge-platform-freeze-arch" as const;
export const KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_ID = "knowledge-platform-freeze" as const;
export const KNOWLEDGE_PLATFORM_FREEZE_PLATFORM_NAME = "Knowledge Platform Freeze" as const;
export const KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE = "knowledge-platform-freeze" as const;
export const KNOWLEDGE_PLATFORM_FREEZE_OWNER = "knowledge-platform-freeze-engine" as const;
export const KNOWLEDGE_PLATFORM_FREEZE_CERTIFICATION_DEPENDENCY = "KNL/14" as const;

export const KNOWLEDGE_PLATFORM_RELEASE_VERSION = "KNL-15-RELEASE-1" as const;
export const KNOWLEDGE_PLATFORM_RELEASE_TAG = "knl-platform-frozen-v1" as const;
export const KNOWLEDGE_PLATFORM_LAYER_ID = "KNL" as const;
export const KNOWLEDGE_PLATFORM_ROOT_ID = "knowledge-platform" as const;
export const KNOWLEDGE_PLATFORM_ROOT_NAME = "Nexora Knowledge Platform" as const;

export const KNOWLEDGE_PLATFORM_FREEZE_TAGS = Object.freeze([
  "[KNL_15]",
  "[KNOWLEDGE_PLATFORM_FREEZE]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[CERTIFIED]",
  "[FROZEN]",
  "[RELEASED]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const KNL_FROZEN_PHASE_KEYS = Object.freeze([
  "knl_foundation",
  "knl_ontology",
  "knl_vocabulary",
  "knl_graph",
  "knl_industry",
  "knl_framework",
  "knl_policy",
  "knl_best_practice",
  "knl_retrieval",
  "knl_validation",
  "knl_versioning",
  "knl_learning_bridge",
  "knl_governance",
  "knl_certification",
] as const);

export const FREEZE_STATUS_KEYS = Object.freeze(["pending", "frozen", "released", "reserved"] as const);

export const FREEZE_DEPENDENCY_KEYS = Object.freeze([
  "KNL/1",
  "KNL/2",
  "KNL/3",
  "KNL/4",
  "KNL/5",
  "KNL/6",
  "KNL/7",
  "KNL/8",
  "KNL/9",
  "KNL/10",
  "KNL/11",
  "KNL/12",
  "KNL/13",
  "KNL/14",
] as const);

export const COMPATIBILITY_CONSUMER_KEYS = Object.freeze([
  "app",
  "lay",
  "int",
  "ops",
  "future_ml",
  "future_analytics",
  "future_advisor",
] as const);

export const COMPATIBILITY_CONSUMER_LABELS = Object.freeze({
  app: "APP",
  lay: "LAY",
  int: "INT",
  ops: "OPS",
  future_ml: "Future ML",
  future_analytics: "Future Analytics",
  future_advisor: "Future Advisor",
} as const);

export const COMPATIBILITY_KNL_VERSION = "KNL/15" as const;

export const COMPATIBILITY_CONSUMER_PLATFORM_MAP: Readonly<Record<(typeof COMPATIBILITY_CONSUMER_KEYS)[number], string>> =
  Object.freeze({
    app: "app-layer",
    lay: "lay-layer",
    int: "int-layer",
    ops: "ops-layer",
    future_ml: "future-ml-layer",
    future_analytics: "future-analytics-layer",
    future_advisor: "future-advisor-layer",
  });

export const KNL_FROZEN_PHASE_TARGETS = Object.freeze([
  Object.freeze({ key: "knl_foundation", phaseId: "KNL/1", platformId: "knowledge-platform", label: "Knowledge Foundation" }),
  Object.freeze({ key: "knl_ontology", phaseId: "KNL/2", platformId: "business-ontology", label: "Business Ontology" }),
  Object.freeze({ key: "knl_vocabulary", phaseId: "KNL/3", platformId: "business-vocabulary", label: "Business Vocabulary" }),
  Object.freeze({ key: "knl_graph", phaseId: "KNL/4", platformId: "knowledge-graph", label: "Knowledge Graph" }),
  Object.freeze({ key: "knl_industry", phaseId: "KNL/5", platformId: "industry-models", label: "Industry Models" }),
  Object.freeze({ key: "knl_framework", phaseId: "KNL/6", platformId: "framework-library", label: "Framework Library" }),
  Object.freeze({ key: "knl_policy", phaseId: "KNL/7", platformId: "policy-rule-base", label: "Policy & Rule Base" }),
  Object.freeze({ key: "knl_best_practice", phaseId: "KNL/8", platformId: "best-practice-platform", label: "Best Practices" }),
  Object.freeze({ key: "knl_retrieval", phaseId: "KNL/9", platformId: "knowledge-retrieval-engine", label: "Knowledge Retrieval Engine" }),
  Object.freeze({ key: "knl_validation", phaseId: "KNL/10", platformId: "knowledge-validation-platform", label: "Knowledge Validation Platform" }),
  Object.freeze({ key: "knl_versioning", phaseId: "KNL/11", platformId: "knowledge-versioning-platform", label: "Knowledge Versioning Platform" }),
  Object.freeze({ key: "knl_learning_bridge", phaseId: "KNL/12", platformId: "knowledge-learning-bridge", label: "Knowledge Learning Bridge" }),
  Object.freeze({ key: "knl_governance", phaseId: "KNL/13", platformId: "knowledge-governance-platform", label: "Knowledge Governance Platform" }),
  Object.freeze({ key: "knl_certification", phaseId: "KNL/14", platformId: "knowledge-platform-certification", label: "Knowledge Platform Certification" }),
] as const);

export const EXTENSION_POLICY_KEYS = Object.freeze([
  "additive_only",
  "public_contracts_only",
  "no_certified_file_modification",
  "consumer_layers_deferred",
] as const);

export const KNOWLEDGE_PLATFORM_FREEZE_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_PLATFORM_FREEZE_NAMESPACE_PATTERN = /^knowledge-platform-freeze(?:-[a-z][a-z0-9-]*)?$/;
export const KNOWLEDGE_PLATFORM_RELEASE_TAG_PATTERN = /^knl-platform-[a-z0-9-]+$/;

export const KNOWLEDGE_PLATFORM_FREEZE_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_PLATFORM_FREEZE_PRINCIPLES = Object.freeze([
  "freeze_is_metadata_not_runtime_mutation",
  "no_platform_mutation_migration_or_runtime_changes_in_freeze",
  "knl_15_consumes_knl_1_through_knl_14_only",
  "deterministic_and_immutable_release_metadata",
  "certified_phases_must_not_be_modified",
  "consumer_layers_consume_frozen_metadata_only",
  "future_evolution_via_extension_policy_only",
] as const);

export const KNOWLEDGE_PLATFORM_FREEZE_MUST_NOT_OWN = Object.freeze([
  "runtime_changes",
  "platform_mutation",
  "migration",
  "runtime_validation",
  "machine_learning",
  "ai",
  "llm",
  "learning",
  "search",
  "retrieval",
  "app_integration",
  "lay_integration",
  "int_integration",
  "ops_integration",
  "database",
  "caching",
  "external_apis",
  "persistence",
] as const);

export const KNOWLEDGE_PLATFORM_FREEZE_PUBLIC_API_REGISTRY = Object.freeze([
  "runKnowledgePlatformFreeze",
  "getKnowledgePlatformFreezeManifest",
  "validateKnowledgePlatformFreeze",
  "getKnowledgePlatformCompatibilityMatrix",
] as const);

export const KNOWLEDGE_PLATFORM_FREEZE_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "mutatePlatform",
  "migratePlatform",
  "runtimeValidation",
  "semanticSearch",
  "retrievalEngine",
  "machineLearning",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_PLATFORM_FREEZE_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "all-phases-frozen", description: "All KNL/1 through KNL/14 phases must be frozen.", enforced: true as const }),
  Object.freeze({ ruleId: "certification-prerequisite", description: "KNL/14 certification must pass before freeze.", enforced: true as const }),
  Object.freeze({ ruleId: "manifest-immutable", description: "Release manifest must be complete and immutable.", enforced: true as const }),
  Object.freeze({ ruleId: "compatibility-matrix-required", description: "Compatibility matrix must cover all consumer layers.", enforced: true as const }),
] as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_SUMMARY = Object.freeze({
  status: "passed",
  phasesCertified: 13,
  gatesPassed: 22,
  contractVersion: "KNL/14",
} as const);

export const KNOWLEDGE_PLATFORM_GOVERNANCE_SUMMARY = Object.freeze({
  status: "active",
  policiesRegistered: 12,
  contractVersion: "KNL/13",
} as const);
