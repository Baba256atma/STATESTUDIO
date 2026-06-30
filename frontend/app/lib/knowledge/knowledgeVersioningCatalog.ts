/**
 * KNL-11 — Knowledge Versioning Platform catalog constants.
 */

export const KNOWLEDGE_VERSIONING_CONTRACT_VERSION = "KNL/11" as const;
export const KNOWLEDGE_VERSIONING_ARCHITECTURE_VERSION = "KNL/11-knowledge-versioning-arch" as const;
export const KNOWLEDGE_VERSIONING_PLATFORM_ID = "knowledge-versioning-platform" as const;
export const KNOWLEDGE_VERSIONING_PLATFORM_NAME = "Knowledge Versioning Platform" as const;
export const KNOWLEDGE_VERSIONING_NAMESPACE = "knowledge-versioning-platform" as const;
export const KNOWLEDGE_VERSIONING_OWNER = "knowledge-versioning-platform-engine" as const;
export const KNOWLEDGE_VERSIONING_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const KNOWLEDGE_VERSIONING_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const KNOWLEDGE_VERSIONING_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const KNOWLEDGE_VERSIONING_GRAPH_DEPENDENCY = "KNL/4" as const;
export const KNOWLEDGE_VERSIONING_INDUSTRY_DEPENDENCY = "KNL/5" as const;
export const KNOWLEDGE_VERSIONING_FRAMEWORK_DEPENDENCY = "KNL/6" as const;
export const KNOWLEDGE_VERSIONING_POLICY_DEPENDENCY = "KNL/7" as const;
export const KNOWLEDGE_VERSIONING_BEST_PRACTICE_DEPENDENCY = "KNL/8" as const;
export const KNOWLEDGE_VERSIONING_RETRIEVAL_DEPENDENCY = "KNL/9" as const;
export const KNOWLEDGE_VERSIONING_VALIDATION_DEPENDENCY = "KNL/10" as const;

export const KNOWLEDGE_VERSIONING_TAGS = Object.freeze([
  "[KNL_11]",
  "[KNOWLEDGE_VERSIONING]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_MIGRATION]",
  "[NO_MUTATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const VERSIONED_ASSET_KEYS = Object.freeze([
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
] as const);

export const VERSION_SCOPE_KEYS = Object.freeze([
  "platform",
  "registry",
  "contract",
  "catalog",
  "manifest",
] as const);

export const VERSION_STATUS_KEYS = Object.freeze(["draft", "active", "deprecated", "reserved"] as const);

export const VERSION_NAMESPACE_KEYS = Object.freeze([
  "knowledge-versioning-platform",
  "knowledge-versioning-assets",
  "knowledge-versioning-releases",
  "knowledge-versioning-extension",
] as const);

export const VERSION_DEPENDENCY_KEYS = Object.freeze([
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
] as const);

export const VERSION_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_learning_bridge",
  "platform_certification",
] as const);

export const VERSIONED_ASSET_PLATFORM_ID_MAP: Readonly<Record<(typeof VERSIONED_ASSET_KEYS)[number], string>> =
  Object.freeze({
    knl_foundation: "knowledge-platform",
    knl_ontology: "business-ontology",
    knl_vocabulary: "business-vocabulary",
    knl_graph: "knowledge-graph",
    knl_industry: "industry-models",
    knl_framework: "framework-library",
    knl_policy: "policy-rule-base",
    knl_best_practice: "best-practice-platform",
    knl_retrieval: "knowledge-retrieval-engine",
    knl_validation: "knowledge-validation-platform",
  });

export const VERSIONED_ASSET_KNL_VERSION_MAP: Readonly<Record<(typeof VERSIONED_ASSET_KEYS)[number], string>> =
  Object.freeze({
    knl_foundation: "KNL/1",
    knl_ontology: "KNL/2",
    knl_vocabulary: "KNL/3",
    knl_graph: "KNL/4",
    knl_industry: "KNL/5",
    knl_framework: "KNL/6",
    knl_policy: "KNL/7",
    knl_best_practice: "KNL/8",
    knl_retrieval: "KNL/9",
    knl_validation: "KNL/10",
  });

export const VERSIONED_ASSET_LABELS = Object.freeze({
  knl_foundation: "Knowledge Foundation",
  knl_ontology: "Business Ontology",
  knl_vocabulary: "Business Vocabulary",
  knl_graph: "Knowledge Graph",
  knl_industry: "Industry Models",
  knl_framework: "Framework Library",
  knl_policy: "Policy & Rule Base",
  knl_best_practice: "Best Practices",
  knl_retrieval: "Knowledge Retrieval Engine",
  knl_validation: "Knowledge Validation Platform",
} as const);

export const KNOWLEDGE_VERSIONING_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_VERSIONING_NAMESPACE_PATTERN = /^knowledge-versioning-[a-z][a-z0-9-]*$/;
export const VERSIONED_ASSET_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const KNOWLEDGE_VERSIONING_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_VERSIONING_PRINCIPLES = Object.freeze([
  "version_metadata_is_not_migration_or_mutation",
  "no_migration_engine_or_runtime_version_resolver",
  "knl_11_consumes_knl_1_through_knl_10_only",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_version_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
  "rollback_diffing_and_runtime_resolution_deferred",
] as const);

export const KNOWLEDGE_VERSIONING_MUST_NOT_OWN = Object.freeze([
  "migration_engine",
  "runtime_version_resolver",
  "rollback",
  "diffing",
  "asset_mutation",
  "runtime_upgrade",
  "search",
  "retrieval",
  "semantic_search",
  "graph_traversal",
  "recommendations",
  "machine_learning",
  "llm_reasoning",
  "learning",
  "reasoning",
  "app_integration",
  "lay_integration",
  "int_integration",
  "ops_integration",
  "database",
  "caching",
  "external_apis",
  "persistence",
] as const);

export const KNOWLEDGE_VERSIONING_FUTURE_PHASE_KEYS = Object.freeze([
  "knowledge_learning_bridge",
  "platform_certification",
] as const);

export const KNOWLEDGE_VERSIONING_PUBLIC_API_REGISTRY = Object.freeze([
  "registerKnowledgeVersion",
  "registerVersionedKnowledgeAsset",
  "registerKnowledgeVersionCompatibility",
  "getKnowledgeVersioningPlatform",
  "validateKnowledgeVersioningPlatform",
  "getKnowledgeVersioningManifest",
] as const);

export const KNOWLEDGE_VERSIONING_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredVersions: 256,
  maxRegisteredAssets: 256,
  maxRegisteredCompatibilities: 512,
  maxRegisteredDependencies: 64,
  maxRegisteredReleases: 256,
  maxRegisteredNamespaces: 64,
  maxRegisteredStatuses: 32,
} as const);

export const KNOWLEDGE_VERSIONING_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "migrate(",
  "rollback(",
  "diffVersions",
  "resolveVersion",
  "mutationEngine",
  "upgradeRuntime",
  "graphTraversal",
  "retrievalEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_VERSIONING_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "version-id-unique", description: "Knowledge version identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "asset-id-unique", description: "Versioned asset identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "release-id-unique", description: "Version release record identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "compatibility-id-unique", description: "Version compatibility identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-10-prerequisite", description: "Knowledge versioning platform requires KNL/1 through KNL/10.", enforced: true as const }),
] as const);
