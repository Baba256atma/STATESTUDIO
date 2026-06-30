/**
 * KNL-5 — Industry Models catalog constants.
 */

export const INDUSTRY_MODELS_CONTRACT_VERSION = "KNL/5" as const;
export const INDUSTRY_MODELS_ARCHITECTURE_VERSION = "KNL/5-industry-models-arch" as const;
export const INDUSTRY_MODELS_ID = "industry-models" as const;
export const INDUSTRY_MODELS_NAME = "Industry Models" as const;
export const INDUSTRY_MODELS_NAMESPACE = "knowledge-industry-models" as const;
export const INDUSTRY_MODELS_OWNER = "industry-models-engine" as const;
export const INDUSTRY_MODELS_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const INDUSTRY_MODELS_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const INDUSTRY_MODELS_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const INDUSTRY_MODELS_GRAPH_DEPENDENCY = "KNL/4" as const;

export const INDUSTRY_MODELS_TAGS = Object.freeze([
  "[KNL_5]",
  "[INDUSTRY_MODELS]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_SIMULATION]",
  "[NO_CALCULATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const INDUSTRY_SECTOR_KEYS = Object.freeze([
  "manufacturing",
  "retail",
  "healthcare",
  "banking",
  "insurance",
  "logistics",
  "energy",
  "government",
  "education",
  "construction",
  "technology",
  "telecommunications",
] as const);

export const INDUSTRY_CATEGORY_KEYS = Object.freeze([
  "primary",
  "secondary",
  "tertiary",
  "public_sector",
  "regulated",
  "digital",
] as const);

export const INDUSTRY_CAPABILITY_KEYS = Object.freeze([
  "model_registry",
  "template_registry",
  "category_registry",
  "sector_catalog",
  "namespace_registry",
  "manifest_generation",
  "validation_gates",
  "catalog_seeding",
] as const);

export const INDUSTRY_TEMPLATE_TYPE_KEYS = Object.freeze([
  "process",
  "kpi",
  "risk",
  "resource",
  "relationship",
  "profile",
] as const);

export const INDUSTRY_NAMESPACE_KEYS = Object.freeze([
  "knowledge-industry-models",
  "knowledge-industry-templates",
  "knowledge-industry-sectors",
  "knowledge-industry-extension",
] as const);

export const INDUSTRY_EXTENSION_POINT_KEYS = Object.freeze([
  "framework_library",
  "knowledge_retrieval",
  "best_practices",
  "platform_certification",
] as const);

export const INDUSTRY_MODELS_VERSION_PATTERN = /^KNL\/\d+$/;
export const INDUSTRY_MODELS_NAMESPACE_PATTERN = /^knowledge-industry-[a-z][a-z0-9-]*$/;

export const INDUSTRY_MODELS_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const INDUSTRY_SECTOR_LABELS = Object.freeze({
  manufacturing: "Manufacturing",
  retail: "Retail",
  healthcare: "Healthcare",
  banking: "Banking",
  insurance: "Insurance",
  logistics: "Logistics",
  energy: "Energy",
  government: "Government",
  education: "Education",
  construction: "Construction",
  technology: "Technology",
  telecommunications: "Telecommunications",
} as const);

export const INDUSTRY_MODELS_PRINCIPLES = Object.freeze([
  "industry_models_are_metadata_not_business_logic",
  "industry_models_are_reusable_templates_only",
  "knl_5_consumes_knl_1_through_knl_4_only",
  "no_simulation_or_business_calculations",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_templates",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const INDUSTRY_MODELS_MUST_NOT_OWN = Object.freeze([
  "business_calculations",
  "simulation",
  "scenario_execution",
  "recommendations",
  "machine_learning",
  "llm_reasoning",
  "learning",
  "reasoning",
  "semantic_search",
  "knowledge_retrieval",
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

export const INDUSTRY_MODELS_FUTURE_PHASE_KEYS = Object.freeze([
  "framework_library",
  "knowledge_retrieval",
  "knowledge_policy",
  "best_practices",
  "platform_certification",
] as const);

export const INDUSTRY_MODELS_PUBLIC_API_REGISTRY = Object.freeze([
  "registerIndustryModel",
  "registerIndustryTemplate",
  "registerIndustryCategory",
  "getIndustryModels",
  "validateIndustryModels",
  "getIndustryModelsManifest",
] as const);

export const INDUSTRY_MODELS_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredModels: 512,
  maxRegisteredTemplates: 2048,
  maxRegisteredCategories: 128,
  maxRegisteredSectors: 128,
  maxRegisteredCapabilities: 64,
  maxRegisteredNamespaces: 64,
} as const);

export const INDUSTRY_MODELS_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "simulate(",
  "runSimulation",
  "calculateRevenue",
  "graphTraversal",
  "retrievalEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const INDUSTRY_MODELS_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "model-id-unique", description: "Industry model identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "template-id-unique", description: "Industry template identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "category-unique", description: "Industry categories must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-4-prerequisite", description: "Industry models require KNL/1 through KNL/4.", enforced: true as const }),
] as const);
