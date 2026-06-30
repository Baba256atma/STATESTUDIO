/**
 * KNL-10 — Knowledge Validation Platform catalog constants.
 */

export const KNOWLEDGE_VALIDATION_CONTRACT_VERSION = "KNL/10" as const;
export const KNOWLEDGE_VALIDATION_ARCHITECTURE_VERSION = "KNL/10-knowledge-validation-arch" as const;
export const KNOWLEDGE_VALIDATION_PLATFORM_ID = "knowledge-validation-platform" as const;
export const KNOWLEDGE_VALIDATION_PLATFORM_NAME = "Knowledge Validation Platform" as const;
export const KNOWLEDGE_VALIDATION_NAMESPACE = "knowledge-validation-platform" as const;
export const KNOWLEDGE_VALIDATION_OWNER = "knowledge-validation-platform-engine" as const;
export const KNOWLEDGE_VALIDATION_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const KNOWLEDGE_VALIDATION_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const KNOWLEDGE_VALIDATION_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const KNOWLEDGE_VALIDATION_GRAPH_DEPENDENCY = "KNL/4" as const;
export const KNOWLEDGE_VALIDATION_INDUSTRY_DEPENDENCY = "KNL/5" as const;
export const KNOWLEDGE_VALIDATION_FRAMEWORK_DEPENDENCY = "KNL/6" as const;
export const KNOWLEDGE_VALIDATION_POLICY_DEPENDENCY = "KNL/7" as const;
export const KNOWLEDGE_VALIDATION_BEST_PRACTICE_DEPENDENCY = "KNL/8" as const;
export const KNOWLEDGE_VALIDATION_RETRIEVAL_DEPENDENCY = "KNL/9" as const;

export const KNOWLEDGE_VALIDATION_TAGS = Object.freeze([
  "[KNL_10]",
  "[KNOWLEDGE_VALIDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME_VALIDATION]",
  "[NO_RULE_EXECUTION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const VALIDATION_PROFILE_KEYS = Object.freeze([
  "knl_foundation",
  "knl_ontology",
  "knl_vocabulary",
  "knl_graph",
  "knl_industry",
  "knl_framework",
  "knl_policy",
  "knl_best_practice",
  "knl_retrieval",
] as const);

export const VALIDATION_CATEGORY_KEYS = Object.freeze([
  "structural",
  "semantic",
  "domain",
  "governance",
  "operational",
  "compliance",
  "reference",
  "retrieval",
  "platform",
] as const);

export const VALIDATION_SCOPE_KEYS = Object.freeze([
  "platform",
  "registry",
  "contract",
  "catalog",
  "manifest",
] as const);

export const VALIDATION_TARGET_KEYS = Object.freeze([
  "foundation_platform",
  "ontology_platform",
  "vocabulary_platform",
  "graph_platform",
  "industry_platform",
  "framework_platform",
  "policy_platform",
  "best_practice_platform",
  "retrieval_platform",
] as const);

export const VALIDATION_SEVERITY_KEYS = Object.freeze(["critical", "major", "minor", "informational"] as const);

export const VALIDATION_STATUS_KEYS = Object.freeze(["draft", "active", "deprecated", "reserved"] as const);

export const VALIDATION_NAMESPACE_KEYS = Object.freeze([
  "knowledge-validation-platform",
  "knowledge-validation-profiles",
  "knowledge-validation-rules",
  "knowledge-validation-extension",
] as const);

export const VALIDATION_DEPENDENCY_KEYS = Object.freeze([
  "KNL/1",
  "KNL/2",
  "KNL/3",
  "KNL/4",
  "KNL/5",
  "KNL/6",
  "KNL/7",
  "KNL/8",
  "KNL/9",
] as const);

export const VALIDATION_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_versioning",
  "platform_certification",
] as const);

export const VALIDATION_PLATFORM_ID_MAP: Readonly<Record<(typeof VALIDATION_PROFILE_KEYS)[number], string>> =
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
  });

export const VALIDATION_PROFILE_LABELS = Object.freeze({
  knl_foundation: "Knowledge Foundation",
  knl_ontology: "Business Ontology",
  knl_vocabulary: "Business Vocabulary",
  knl_graph: "Knowledge Graph",
  knl_industry: "Industry Models",
  knl_framework: "Framework Library",
  knl_policy: "Policy & Rule Base",
  knl_best_practice: "Best Practices",
  knl_retrieval: "Knowledge Retrieval Engine",
} as const);

export const VALIDATION_PROFILE_CATEGORY_MAP: Readonly<
  Record<(typeof VALIDATION_PROFILE_KEYS)[number], (typeof VALIDATION_CATEGORY_KEYS)[number]>
> = Object.freeze({
  knl_foundation: "structural",
  knl_ontology: "semantic",
  knl_vocabulary: "semantic",
  knl_graph: "reference",
  knl_industry: "domain",
  knl_framework: "domain",
  knl_policy: "governance",
  knl_best_practice: "operational",
  knl_retrieval: "retrieval",
});

export const VALIDATION_PROFILE_TARGET_MAP: Readonly<
  Record<(typeof VALIDATION_PROFILE_KEYS)[number], (typeof VALIDATION_TARGET_KEYS)[number]>
> = Object.freeze({
  knl_foundation: "foundation_platform",
  knl_ontology: "ontology_platform",
  knl_vocabulary: "vocabulary_platform",
  knl_graph: "graph_platform",
  knl_industry: "industry_platform",
  knl_framework: "framework_platform",
  knl_policy: "policy_platform",
  knl_best_practice: "best_practice_platform",
  knl_retrieval: "retrieval_platform",
});

export const VALIDATION_PROFILE_DEPENDENCY_MAP: Readonly<
  Record<(typeof VALIDATION_PROFILE_KEYS)[number], (typeof VALIDATION_DEPENDENCY_KEYS)[number]>
> = Object.freeze({
  knl_foundation: "KNL/1",
  knl_ontology: "KNL/2",
  knl_vocabulary: "KNL/3",
  knl_graph: "KNL/4",
  knl_industry: "KNL/5",
  knl_framework: "KNL/6",
  knl_policy: "KNL/7",
  knl_best_practice: "KNL/8",
  knl_retrieval: "KNL/9",
});

export const KNOWLEDGE_VALIDATION_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_VALIDATION_NAMESPACE_PATTERN = /^knowledge-validation-[a-z][a-z0-9-]*$/;
export const KNOWLEDGE_VALIDATION_PROFILE_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const KNOWLEDGE_VALIDATION_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_VALIDATION_PRINCIPLES = Object.freeze([
  "validation_profiles_are_metadata_not_runtime_checks",
  "no_validation_engine_or_rule_execution_in_platform",
  "knl_10_consumes_knl_1_through_knl_9_only",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_validation_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
  "runtime_validation_deferred_to_future_layers",
] as const);

export const KNOWLEDGE_VALIDATION_MUST_NOT_OWN = Object.freeze([
  "runtime_validation",
  "validation_engine",
  "rule_execution",
  "rule_evaluation",
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

export const KNOWLEDGE_VALIDATION_FUTURE_PHASE_KEYS = Object.freeze([
  "knowledge_versioning",
  "platform_certification",
] as const);

export const KNOWLEDGE_VALIDATION_PUBLIC_API_REGISTRY = Object.freeze([
  "registerKnowledgeValidationProfile",
  "registerKnowledgeValidationRule",
  "registerKnowledgeValidationCategory",
  "getKnowledgeValidationPlatform",
  "validateKnowledgeValidationPlatform",
  "getKnowledgeValidationManifest",
] as const);

export const KNOWLEDGE_VALIDATION_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredProfiles: 128,
  maxRegisteredRules: 512,
  maxRegisteredCategories: 64,
  maxRegisteredScopes: 32,
  maxRegisteredTargets: 64,
  maxRegisteredNamespaces: 64,
  maxRegisteredDependencies: 32,
} as const);

export const KNOWLEDGE_VALIDATION_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "executeValidation",
  "runValidation",
  "validationEngine",
  "evaluateRule",
  "graphTraversal",
  "retrievalEngine",
  "searchEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_VALIDATION_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "profile-id-unique", description: "Validation profile identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "profile-name-unique", description: "Validation profile names must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "rule-id-unique", description: "Validation rule identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "namespace-key-unique", description: "Validation namespace keys must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-9-prerequisite", description: "Knowledge validation platform requires KNL/1 through KNL/9.", enforced: true as const }),
] as const);
