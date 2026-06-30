/**
 * KNL-3 — Business Vocabulary catalog constants.
 */

export const BUSINESS_VOCABULARY_CONTRACT_VERSION = "KNL/3" as const;
export const BUSINESS_VOCABULARY_ARCHITECTURE_VERSION = "KNL/3-vocabulary-arch" as const;
export const BUSINESS_VOCABULARY_ID = "business-vocabulary" as const;
export const BUSINESS_VOCABULARY_NAME = "Business Vocabulary" as const;
export const BUSINESS_VOCABULARY_NAMESPACE = "knowledge-business-vocabulary" as const;
export const BUSINESS_VOCABULARY_OWNER = "business-vocabulary-engine" as const;
export const BUSINESS_VOCABULARY_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const BUSINESS_VOCABULARY_ONTOLOGY_DEPENDENCY = "KNL/2" as const;

export const BUSINESS_VOCABULARY_TAGS = Object.freeze([
  "[KNL_3]",
  "[BUSINESS_VOCABULARY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_NLP]",
  "[NO_TRANSLATION]",
  "[NO_RETRIEVAL]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_VOCABULARY_CATEGORY_KEYS = Object.freeze([
  "core",
  "domain",
  "process",
  "performance",
  "governance",
  "risk",
  "strategy",
  "technology",
] as const);

export const BUSINESS_VOCABULARY_DOMAIN_KEYS = Object.freeze([
  "business",
  "finance",
  "operations",
  "technology",
  "governance",
  "strategy",
] as const);

export const BUSINESS_VOCABULARY_LANGUAGE_KEYS = Object.freeze(["en", "en-US", "nb", "nb-NO"] as const);

export const BUSINESS_VOCABULARY_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "deprecated",
  "reserved",
] as const);

export const BUSINESS_VOCABULARY_SOURCE_KEYS = Object.freeze([
  "ontology",
  "platform",
  "governance",
  "extension",
] as const);

export const BUSINESS_VOCABULARY_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_graph",
  "knowledge_retrieval",
  "framework_library",
  "industry_models",
] as const);

export const BUSINESS_VOCABULARY_VERSION_PATTERN = /^KNL\/\d+$/;
export const BUSINESS_VOCABULARY_LANGUAGE_CODE_PATTERN = /^[a-z]{2}(-[A-Z]{2})?$/;
export const BUSINESS_VOCABULARY_CANONICAL_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const BUSINESS_VOCABULARY_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const BUSINESS_VOCABULARY_MANDATORY_TERM_FIELDS = Object.freeze([
  "termId",
  "canonicalName",
  "displayName",
  "preferredLabel",
  "businessDefinition",
  "description",
  "categoryKey",
  "domainKey",
  "languageCode",
  "status",
  "sourceKey",
  "version",
  "metadata",
  "readOnly",
] as const);

export const BUSINESS_VOCABULARY_PRINCIPLES = Object.freeze([
  "vocabulary_is_metadata_not_nlp",
  "vocabulary_is_canonical_language_of_nexora",
  "knl_3_consumes_knl_1_and_knl_2_only",
  "no_translation_or_semantic_search",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_terms",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const BUSINESS_VOCABULARY_MUST_NOT_OWN = Object.freeze([
  "translation_engine",
  "nlp",
  "semantic_search",
  "embeddings",
  "knowledge_graph",
  "knowledge_retrieval",
  "machine_learning",
  "llm_reasoning",
  "learning",
  "reasoning",
  "inference",
  "app_integration",
  "lay_integration",
  "int_integration",
  "ops_integration",
  "database",
  "caching",
  "external_apis",
  "persistence",
] as const);

export const BUSINESS_VOCABULARY_FUTURE_PHASE_KEYS = Object.freeze([
  "knowledge_graph",
  "knowledge_retrieval",
  "knowledge_policy",
  "framework_library",
  "industry_models",
  "best_practices",
  "platform_certification",
] as const);

export const BUSINESS_VOCABULARY_PUBLIC_API_REGISTRY = Object.freeze([
  "registerBusinessTerm",
  "registerBusinessAlias",
  "registerBusinessAcronym",
  "getBusinessVocabulary",
  "validateBusinessVocabulary",
  "getBusinessVocabularyManifest",
] as const);

export const BUSINESS_VOCABULARY_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredTerms: 4096,
  maxRegisteredAliases: 8192,
  maxRegisteredAcronyms: 4096,
  maxRegisteredCategories: 128,
  maxRegisteredDomains: 128,
  maxRegisteredLanguages: 64,
  maxRegisteredTags: 1024,
  maxRegisteredSources: 64,
} as const);

export const BUSINESS_VOCABULARY_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "translate(",
  "nlpEngine",
  "retrievalEngine",
  "graphTraversal",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const BUSINESS_VOCABULARY_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "canonical-name-unique", description: "Canonical names must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "alias-unique", description: "Aliases must be unique within vocabulary.", enforced: true as const }),
  Object.freeze({ ruleId: "ontology-reference-valid", description: "Ontology references must resolve to registered entities.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-2-prerequisite", description: "Vocabulary requires KNL/1 and KNL/2.", enforced: true as const }),
] as const);
