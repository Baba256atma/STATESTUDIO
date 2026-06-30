/**
 * KNL-7 — Policy & Rule Base catalog constants.
 */

export const POLICY_RULE_BASE_CONTRACT_VERSION = "KNL/7" as const;
export const POLICY_RULE_BASE_ARCHITECTURE_VERSION = "KNL/7-policy-rule-base-arch" as const;
export const POLICY_RULE_BASE_ID = "policy-rule-base" as const;
export const POLICY_RULE_BASE_NAME = "Policy & Rule Base" as const;
export const POLICY_RULE_BASE_NAMESPACE = "knowledge-policy-rule-base" as const;
export const POLICY_RULE_BASE_OWNER = "policy-rule-base-engine" as const;
export const POLICY_RULE_BASE_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const POLICY_RULE_BASE_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const POLICY_RULE_BASE_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const POLICY_RULE_BASE_GRAPH_DEPENDENCY = "KNL/4" as const;
export const POLICY_RULE_BASE_INDUSTRY_DEPENDENCY = "KNL/5" as const;
export const POLICY_RULE_BASE_FRAMEWORK_DEPENDENCY = "KNL/6" as const;

export const POLICY_RULE_BASE_TAGS = Object.freeze([
  "[KNL_7]",
  "[POLICY_RULE_BASE]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RULE_ENGINE]",
  "[NO_EXECUTION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const POLICY_KEYS = Object.freeze([
  "financial",
  "hr",
  "security",
  "compliance",
  "risk",
  "procurement",
  "quality",
  "governance",
  "data",
  "privacy",
  "operational",
  "it",
] as const);

export const POLICY_CATEGORY_KEYS = Object.freeze([
  "financial",
  "human_resources",
  "security",
  "compliance",
  "risk",
  "operations",
  "governance",
  "technology",
] as const);

export const RULE_TYPE_KEYS = Object.freeze([
  "mandatory",
  "conditional",
  "prohibitive",
  "advisory",
  "exception",
] as const);

export const RULE_SCOPE_KEYS = Object.freeze([
  "organization",
  "department",
  "process",
  "system",
  "data",
  "vendor",
] as const);

export const RULE_PRIORITY_KEYS = Object.freeze(["critical", "high", "medium", "low"] as const);

export const RULE_SEVERITY_KEYS = Object.freeze(["critical", "major", "minor", "informational"] as const);

export const RULE_STATUS_KEYS = Object.freeze(["draft", "active", "deprecated", "reserved"] as const);

export const COMPLIANCE_TAG_KEYS = Object.freeze([
  "sox",
  "gdpr",
  "iso27001",
  "pci_dss",
  "hipaa",
  "internal",
] as const);

export const POLICY_GROUP_KEYS = Object.freeze([
  "corporate",
  "regulatory",
  "operational",
  "technical",
] as const);

export const POLICY_NAMESPACE_KEYS = Object.freeze([
  "knowledge-policy-rule-base",
  "knowledge-policy-groups",
  "knowledge-policy-compliance",
  "knowledge-policy-extension",
] as const);

export const POLICY_EXTENSION_POINT_KEYS = Object.freeze([
  "best_practices",
  "knowledge_retrieval",
  "platform_certification",
] as const);

export const POLICY_RULE_BASE_VERSION_PATTERN = /^KNL\/\d+$/;
export const POLICY_RULE_BASE_NAMESPACE_PATTERN = /^knowledge-policy-[a-z][a-z0-9-]*$/;
export const POLICY_CANONICAL_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const POLICY_RULE_BASE_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const POLICY_LABELS = Object.freeze({
  financial: "Financial Policy",
  hr: "HR Policy",
  security: "Security Policy",
  compliance: "Compliance Policy",
  risk: "Risk Policy",
  procurement: "Procurement Policy",
  quality: "Quality Policy",
  governance: "Governance Policy",
  data: "Data Policy",
  privacy: "Privacy Policy",
  operational: "Operational Policy",
  it: "IT Policy",
} as const);

export const POLICY_RULE_BASE_PRINCIPLES = Object.freeze([
  "policies_and_rules_are_metadata_not_execution",
  "no_rule_engine_or_evaluation_in_base",
  "knl_7_consumes_knl_1_through_knl_6_only",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_policy_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const POLICY_RULE_BASE_MUST_NOT_OWN = Object.freeze([
  "rule_engine",
  "rule_evaluation",
  "rule_execution",
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

export const POLICY_RULE_BASE_FUTURE_PHASE_KEYS = Object.freeze([
  "best_practices",
  "knowledge_retrieval",
  "platform_certification",
] as const);

export const POLICY_RULE_BASE_PUBLIC_API_REGISTRY = Object.freeze([
  "registerPolicy",
  "registerBusinessRule",
  "registerPolicyCategory",
  "getPolicyRuleBase",
  "validatePolicyRuleBase",
  "getPolicyRuleBaseManifest",
] as const);

export const POLICY_RULE_BASE_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredPolicies: 512,
  maxRegisteredRules: 4096,
  maxRegisteredCategories: 128,
  maxRegisteredGroups: 64,
  maxRegisteredOwners: 256,
  maxRegisteredComplianceTags: 128,
  maxRegisteredNamespaces: 64,
} as const);

export const POLICY_RULE_BASE_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "executeRule",
  "evaluateRule",
  "ruleEngine",
  "decisionEngine",
  "graphTraversal",
  "retrievalEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const POLICY_RULE_BASE_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "policy-id-unique", description: "Policy identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "rule-id-unique", description: "Business rule identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "name-unique", description: "Policy and rule canonical names must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-6-prerequisite", description: "Policy rule base requires KNL/1 through KNL/6.", enforced: true as const }),
] as const);

export const POLICY_CATEGORY_MAP: Readonly<Record<(typeof POLICY_KEYS)[number], (typeof POLICY_CATEGORY_KEYS)[number]>> =
  Object.freeze({
    financial: "financial",
    hr: "human_resources",
    security: "security",
    compliance: "compliance",
    risk: "risk",
    procurement: "operations",
    quality: "operations",
    governance: "governance",
    data: "technology",
    privacy: "compliance",
    operational: "operations",
    it: "technology",
  });

export const POLICY_GROUP_MAP: Readonly<Record<(typeof POLICY_KEYS)[number], (typeof POLICY_GROUP_KEYS)[number]>> =
  Object.freeze({
    financial: "corporate",
    hr: "corporate",
    security: "technical",
    compliance: "regulatory",
    risk: "regulatory",
    procurement: "operational",
    quality: "operational",
    governance: "corporate",
    data: "technical",
    privacy: "regulatory",
    operational: "operational",
    it: "technical",
  });
