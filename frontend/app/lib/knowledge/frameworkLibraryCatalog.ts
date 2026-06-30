/**
 * KNL-6 — Framework Library catalog constants.
 */

export const FRAMEWORK_LIBRARY_CONTRACT_VERSION = "KNL/6" as const;
export const FRAMEWORK_LIBRARY_ARCHITECTURE_VERSION = "KNL/6-framework-library-arch" as const;
export const FRAMEWORK_LIBRARY_ID = "framework-library" as const;
export const FRAMEWORK_LIBRARY_NAME = "Framework Library" as const;
export const FRAMEWORK_LIBRARY_NAMESPACE = "knowledge-framework-library" as const;
export const FRAMEWORK_LIBRARY_OWNER = "framework-library-engine" as const;
export const FRAMEWORK_LIBRARY_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const FRAMEWORK_LIBRARY_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const FRAMEWORK_LIBRARY_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const FRAMEWORK_LIBRARY_GRAPH_DEPENDENCY = "KNL/4" as const;
export const FRAMEWORK_LIBRARY_INDUSTRY_DEPENDENCY = "KNL/5" as const;

export const FRAMEWORK_LIBRARY_TAGS = Object.freeze([
  "[KNL_6]",
  "[FRAMEWORK_LIBRARY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_EXECUTION]",
  "[NO_SCORING]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const FRAMEWORK_KEYS = Object.freeze([
  "swot",
  "pestel",
  "porters_five_forces",
  "business_model_canvas",
  "balanced_scorecard",
  "okr",
  "kpi_framework",
  "value_chain",
  "mckinsey_7s",
  "bcg_matrix",
  "ansoff_matrix",
  "vrio",
  "raci",
  "smart_goals",
  "pdca",
] as const);

export const FRAMEWORK_CATEGORY_KEYS = Object.freeze([
  "strategic_analysis",
  "performance_management",
  "operational_excellence",
  "organizational_design",
  "goal_setting",
  "risk_governance",
] as const);

export const FRAMEWORK_CAPABILITY_KEYS = Object.freeze([
  "framework_registry",
  "template_registry",
  "category_registry",
  "component_registry",
  "namespace_registry",
  "manifest_generation",
  "validation_gates",
  "catalog_seeding",
] as const);

export const FRAMEWORK_NAMESPACE_KEYS = Object.freeze([
  "knowledge-framework-library",
  "knowledge-framework-templates",
  "knowledge-framework-components",
  "knowledge-framework-extension",
] as const);

export const FRAMEWORK_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_policy",
  "knowledge_retrieval",
  "best_practices",
  "platform_certification",
] as const);

export const FRAMEWORK_LIBRARY_VERSION_PATTERN = /^KNL\/\d+$/;
export const FRAMEWORK_LIBRARY_NAMESPACE_PATTERN = /^knowledge-framework-[a-z][a-z0-9-]*$/;
export const FRAMEWORK_CANONICAL_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const FRAMEWORK_LIBRARY_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const FRAMEWORK_LABELS = Object.freeze({
  swot: "SWOT Analysis",
  pestel: "PESTEL Analysis",
  porters_five_forces: "Porter's Five Forces",
  business_model_canvas: "Business Model Canvas",
  balanced_scorecard: "Balanced Scorecard",
  okr: "Objectives and Key Results (OKR)",
  kpi_framework: "KPI Framework",
  value_chain: "Value Chain Analysis",
  mckinsey_7s: "McKinsey 7S Framework",
  bcg_matrix: "BCG Matrix",
  ansoff_matrix: "Ansoff Matrix",
  vrio: "VRIO Framework",
  raci: "RACI Matrix",
  smart_goals: "SMART Goals",
  pdca: "Plan-Do-Check-Act (PDCA)",
} as const);

export const FRAMEWORK_LIBRARY_PRINCIPLES = Object.freeze([
  "framework_library_is_metadata_not_execution",
  "frameworks_are_descriptive_templates_only",
  "knl_6_consumes_knl_1_through_knl_5_only",
  "no_framework_scoring_or_evaluation",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_framework_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const FRAMEWORK_LIBRARY_MUST_NOT_OWN = Object.freeze([
  "framework_execution",
  "framework_scoring",
  "recommendations",
  "decision_engines",
  "machine_learning",
  "llm_reasoning",
  "learning",
  "reasoning",
  "knowledge_retrieval",
  "semantic_search",
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

export const FRAMEWORK_LIBRARY_FUTURE_PHASE_KEYS = Object.freeze([
  "knowledge_policy",
  "knowledge_retrieval",
  "best_practices",
  "platform_certification",
] as const);

export const FRAMEWORK_LIBRARY_PUBLIC_API_REGISTRY = Object.freeze([
  "registerFramework",
  "registerFrameworkTemplate",
  "registerFrameworkCategory",
  "getFrameworkLibrary",
  "validateFrameworkLibrary",
  "getFrameworkLibraryManifest",
] as const);

export const FRAMEWORK_LIBRARY_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredFrameworks: 512,
  maxRegisteredTemplates: 2048,
  maxRegisteredCategories: 128,
  maxRegisteredComponents: 4096,
  maxRegisteredCapabilities: 64,
  maxRegisteredNamespaces: 64,
} as const);

export const FRAMEWORK_LIBRARY_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "executeFramework",
  "scoreFramework",
  "evaluateFramework",
  "graphTraversal",
  "retrievalEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const FRAMEWORK_LIBRARY_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "framework-id-unique", description: "Framework identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "framework-name-unique", description: "Framework canonical names must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "category-unique", description: "Framework categories must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-5-prerequisite", description: "Framework library requires KNL/1 through KNL/5.", enforced: true as const }),
] as const);
