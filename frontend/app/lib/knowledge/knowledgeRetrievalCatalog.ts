/**
 * KNL-9 — Knowledge Retrieval Engine catalog constants.
 */

export const KNOWLEDGE_RETRIEVAL_CONTRACT_VERSION = "KNL/9" as const;
export const KNOWLEDGE_RETRIEVAL_ARCHITECTURE_VERSION = "KNL/9-knowledge-retrieval-arch" as const;
export const KNOWLEDGE_RETRIEVAL_ENGINE_ID = "knowledge-retrieval-engine" as const;
export const KNOWLEDGE_RETRIEVAL_ENGINE_NAME = "Knowledge Retrieval Engine" as const;
export const KNOWLEDGE_RETRIEVAL_NAMESPACE = "knowledge-retrieval-engine" as const;
export const KNOWLEDGE_RETRIEVAL_OWNER = "knowledge-retrieval-engine" as const;
export const KNOWLEDGE_RETRIEVAL_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const KNOWLEDGE_RETRIEVAL_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const KNOWLEDGE_RETRIEVAL_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const KNOWLEDGE_RETRIEVAL_GRAPH_DEPENDENCY = "KNL/4" as const;
export const KNOWLEDGE_RETRIEVAL_INDUSTRY_DEPENDENCY = "KNL/5" as const;
export const KNOWLEDGE_RETRIEVAL_FRAMEWORK_DEPENDENCY = "KNL/6" as const;
export const KNOWLEDGE_RETRIEVAL_POLICY_DEPENDENCY = "KNL/7" as const;
export const KNOWLEDGE_RETRIEVAL_BEST_PRACTICE_DEPENDENCY = "KNL/8" as const;

export const KNOWLEDGE_RETRIEVAL_TAGS = Object.freeze([
  "[KNL_9]",
  "[KNOWLEDGE_RETRIEVAL]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_SEARCH_ENGINE]",
  "[NO_QUERY_ENGINE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const RETRIEVAL_SOURCE_KEYS = Object.freeze([
  "knl_foundation",
  "knl_ontology",
  "knl_vocabulary",
  "knl_graph",
  "knl_industry",
  "knl_framework",
  "knl_policy",
  "knl_best_practice",
] as const);

export const RETRIEVAL_CATEGORY_KEYS = Object.freeze([
  "knl_foundation",
  "knl_ontology",
  "knl_vocabulary",
  "knl_graph",
  "knl_industry",
  "knl_framework",
  "knl_policy",
  "knl_best_practice",
] as const);

export const RETRIEVAL_NAMESPACE_KEYS = Object.freeze([
  "knowledge-retrieval-engine",
  "knowledge-retrieval-indexes",
  "knowledge-retrieval-sources",
  "knowledge-retrieval-extension",
] as const);

export const RETRIEVAL_FILTER_KEYS = Object.freeze([
  "by_namespace",
  "by_category",
  "by_source",
  "by_target",
] as const);

export const RETRIEVAL_SELECTOR_KEYS = Object.freeze([
  "all_sources",
  "single_source",
  "multi_source",
  "indexed_only",
] as const);

export const RETRIEVAL_TARGET_KEYS = Object.freeze([
  "foundation_registry",
  "ontology_registry",
  "vocabulary_registry",
  "graph_registry",
  "industry_registry",
  "framework_registry",
  "policy_registry",
  "best_practice_registry",
] as const);

export const RETRIEVAL_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_validation",
  "platform_certification",
] as const);

export const RETRIEVAL_PLATFORM_ID_MAP: Readonly<Record<(typeof RETRIEVAL_SOURCE_KEYS)[number], string>> =
  Object.freeze({
    knl_foundation: "knowledge-platform",
    knl_ontology: "business-ontology",
    knl_vocabulary: "business-vocabulary",
    knl_graph: "knowledge-graph",
    knl_industry: "industry-models",
    knl_framework: "framework-library",
    knl_policy: "policy-rule-base",
    knl_best_practice: "best-practice-platform",
  });

export const RETRIEVAL_SOURCE_LABELS = Object.freeze({
  knl_foundation: "Knowledge Foundation",
  knl_ontology: "Business Ontology",
  knl_vocabulary: "Business Vocabulary",
  knl_graph: "Knowledge Graph",
  knl_industry: "Industry Models",
  knl_framework: "Framework Library",
  knl_policy: "Policy & Rule Base",
  knl_best_practice: "Best Practices",
} as const);

export const KNOWLEDGE_RETRIEVAL_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_RETRIEVAL_NAMESPACE_PATTERN = /^knowledge-retrieval-[a-z][a-z0-9-]*$/;
export const KNOWLEDGE_INDEX_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const KNOWLEDGE_RETRIEVAL_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_RETRIEVAL_PRINCIPLES = Object.freeze([
  "retrieval_metadata_is_not_search_or_query_execution",
  "no_search_engine_or_ranking_in_engine",
  "knl_9_consumes_knl_1_through_knl_8_only",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_retrieval_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
  "actual_retrieval_deferred_to_future_runtime_layers",
] as const);

export const KNOWLEDGE_RETRIEVAL_MUST_NOT_OWN = Object.freeze([
  "search_engine",
  "query_engine",
  "ranking",
  "retrieval_algorithms",
  "semantic_search",
  "vector_search",
  "embeddings",
  "recommendations",
  "machine_learning",
  "llm_reasoning",
  "learning",
  "reasoning",
  "graph_traversal",
  "app_integration",
  "lay_integration",
  "int_integration",
  "ops_integration",
  "database",
  "caching",
  "external_apis",
  "persistence",
] as const);

export const KNOWLEDGE_RETRIEVAL_FUTURE_PHASE_KEYS = Object.freeze([
  "knowledge_validation",
  "platform_certification",
] as const);

export const KNOWLEDGE_RETRIEVAL_PUBLIC_API_REGISTRY = Object.freeze([
  "registerKnowledgeRetrievalSource",
  "registerKnowledgeIndex",
  "registerKnowledgeCategory",
  "getKnowledgeRetrievalEngine",
  "validateKnowledgeRetrievalEngine",
  "getKnowledgeRetrievalManifest",
] as const);

export const KNOWLEDGE_RETRIEVAL_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredSources: 64,
  maxRegisteredIndexes: 256,
  maxRegisteredCategories: 128,
  maxRegisteredTargets: 64,
  maxRegisteredNamespaces: 64,
  maxRegisteredFilters: 64,
  maxRegisteredSelectors: 64,
} as const);

export const KNOWLEDGE_RETRIEVAL_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "searchEngine",
  "queryEngine",
  "executeQuery",
  "rankResults",
  "graphTraversal",
  "retrievalAlgorithm",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_RETRIEVAL_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "source-id-unique", description: "Retrieval source identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "index-id-unique", description: "Knowledge index identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "index-name-unique", description: "Knowledge index names must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "source-key-unique", description: "Retrieval source keys must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-8-prerequisite", description: "Knowledge retrieval engine requires KNL/1 through KNL/8.", enforced: true as const }),
] as const);

export const RETRIEVAL_TARGET_MAP: Readonly<Record<(typeof RETRIEVAL_SOURCE_KEYS)[number], (typeof RETRIEVAL_TARGET_KEYS)[number]>> =
  Object.freeze({
    knl_foundation: "foundation_registry",
    knl_ontology: "ontology_registry",
    knl_vocabulary: "vocabulary_registry",
    knl_graph: "graph_registry",
    knl_industry: "industry_registry",
    knl_framework: "framework_registry",
    knl_policy: "policy_registry",
    knl_best_practice: "best_practice_registry",
  });
