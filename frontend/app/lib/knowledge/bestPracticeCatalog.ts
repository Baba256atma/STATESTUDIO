/**
 * KNL-8 — Best Practices catalog constants.
 */

export const BEST_PRACTICE_CONTRACT_VERSION = "KNL/8" as const;
export const BEST_PRACTICE_ARCHITECTURE_VERSION = "KNL/8-best-practices-arch" as const;
export const BEST_PRACTICE_PLATFORM_ID = "best-practice-platform" as const;
export const BEST_PRACTICE_PLATFORM_NAME = "Best Practices" as const;
export const BEST_PRACTICE_NAMESPACE = "knowledge-best-practices" as const;
export const BEST_PRACTICE_OWNER = "best-practice-platform-engine" as const;
export const BEST_PRACTICE_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const BEST_PRACTICE_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const BEST_PRACTICE_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const BEST_PRACTICE_GRAPH_DEPENDENCY = "KNL/4" as const;
export const BEST_PRACTICE_INDUSTRY_DEPENDENCY = "KNL/5" as const;
export const BEST_PRACTICE_FRAMEWORK_DEPENDENCY = "KNL/6" as const;
export const BEST_PRACTICE_POLICY_DEPENDENCY = "KNL/7" as const;

export const BEST_PRACTICE_TAGS = Object.freeze([
  "[KNL_8]",
  "[BEST_PRACTICES]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_ADVISORY_ENGINE]",
  "[NO_RECOMMENDATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BEST_PRACTICE_CATEGORY_KEYS = Object.freeze([
  "strategic_planning",
  "operational_excellence",
  "financial_management",
  "risk_management",
  "governance",
  "decision_making",
  "kpi_management",
  "performance_management",
  "process_improvement",
  "change_management",
  "resource_management",
  "stakeholder_management",
] as const);

export const BEST_PRACTICE_SOURCE_KEYS = Object.freeze([
  "industry_standard",
  "executive_playbook",
  "regulatory_guidance",
  "internal_knowledge",
] as const);

export const BEST_PRACTICE_CONTEXT_KEYS = Object.freeze([
  "organization",
  "department",
  "executive",
  "project",
  "initiative",
] as const);

export const BEST_PRACTICE_NAMESPACE_KEYS = Object.freeze([
  "knowledge-best-practices",
  "knowledge-best-practice-templates",
  "knowledge-best-practice-sources",
  "knowledge-best-practice-extension",
] as const);

export const BEST_PRACTICE_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_retrieval",
  "platform_certification",
] as const);

export const BEST_PRACTICE_VERSION_PATTERN = /^KNL\/\d+$/;
export const BEST_PRACTICE_NAMESPACE_PATTERN = /^knowledge-best-practice[a-z0-9-]*$/;
export const BEST_PRACTICE_CANONICAL_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const BEST_PRACTICE_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const BEST_PRACTICE_LABELS = Object.freeze({
  strategic_planning: "Strategic Planning",
  operational_excellence: "Operational Excellence",
  financial_management: "Financial Management",
  risk_management: "Risk Management",
  governance: "Governance",
  decision_making: "Decision Making",
  kpi_management: "KPI Management",
  performance_management: "Performance Management",
  process_improvement: "Process Improvement",
  change_management: "Change Management",
  resource_management: "Resource Management",
  stakeholder_management: "Stakeholder Management",
} as const);

export const BEST_PRACTICE_PRINCIPLES = Object.freeze([
  "best_practices_are_metadata_not_advice",
  "no_advisory_engine_or_recommendations_in_platform",
  "knl_8_consumes_knl_1_through_knl_7_only",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_best_practice_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const BEST_PRACTICE_MUST_NOT_OWN = Object.freeze([
  "recommendation_engine",
  "advisory_engine",
  "ranking",
  "scoring",
  "decision_engine",
  "recommendations",
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

export const BEST_PRACTICE_FUTURE_PHASE_KEYS = Object.freeze([
  "knowledge_retrieval",
  "platform_certification",
] as const);

export const BEST_PRACTICE_PUBLIC_API_REGISTRY = Object.freeze([
  "registerBestPractice",
  "registerBestPracticeTemplate",
  "registerBestPracticeCategory",
  "getBestPracticePlatform",
  "validateBestPracticePlatform",
  "getBestPracticeManifest",
] as const);

export const BEST_PRACTICE_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredPractices: 512,
  maxRegisteredTemplates: 512,
  maxRegisteredCategories: 128,
  maxRegisteredPrinciples: 256,
  maxRegisteredSources: 64,
  maxRegisteredOwners: 128,
  maxRegisteredNamespaces: 64,
} as const);

export const BEST_PRACTICE_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "recommend(",
  "rankBestPractice",
  "scoreBestPractice",
  "advisoryEngine",
  "decisionEngine",
  "graphTraversal",
  "retrievalEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const BEST_PRACTICE_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "practice-id-unique", description: "Best practice identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "template-id-unique", description: "Best practice template identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "name-unique", description: "Best practice canonical names must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-7-prerequisite", description: "Best practice platform requires KNL/1 through KNL/7.", enforced: true as const }),
] as const);

export const BEST_PRACTICE_POLICY_MAP: Readonly<Record<(typeof BEST_PRACTICE_CATEGORY_KEYS)[number], string>> =
  Object.freeze({
    strategic_planning: "policy-governance",
    operational_excellence: "policy-operational",
    financial_management: "policy-financial",
    risk_management: "policy-risk",
    governance: "policy-governance",
    decision_making: "policy-governance",
    kpi_management: "policy-it",
    performance_management: "policy-operational",
    process_improvement: "policy-quality",
    change_management: "policy-hr",
    resource_management: "policy-procurement",
    stakeholder_management: "policy-compliance",
  });

export const BEST_PRACTICE_FRAMEWORK_MAP: Readonly<Record<(typeof BEST_PRACTICE_CATEGORY_KEYS)[number], string>> =
  Object.freeze({
    strategic_planning: "framework-swot",
    operational_excellence: "framework-pdca",
    financial_management: "framework-balanced_scorecard",
    risk_management: "framework-porters_five_forces",
    governance: "framework-raci",
    decision_making: "framework-swot",
    kpi_management: "framework-kpi_framework",
    performance_management: "framework-okr",
    process_improvement: "framework-pdca",
    change_management: "framework-mckinsey_7s",
    resource_management: "framework-value_chain",
    stakeholder_management: "framework-pestel",
  });
