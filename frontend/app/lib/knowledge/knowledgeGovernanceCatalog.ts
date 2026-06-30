/**
 * KNL-13 — Knowledge Governance Platform catalog constants.
 */

export const KNOWLEDGE_GOVERNANCE_CONTRACT_VERSION = "KNL/13" as const;
export const KNOWLEDGE_GOVERNANCE_ARCHITECTURE_VERSION = "KNL/13-knowledge-governance-arch" as const;
export const KNOWLEDGE_GOVERNANCE_PLATFORM_ID = "knowledge-governance-platform" as const;
export const KNOWLEDGE_GOVERNANCE_PLATFORM_NAME = "Knowledge Governance Platform" as const;
export const KNOWLEDGE_GOVERNANCE_NAMESPACE = "knowledge-governance-platform" as const;
export const KNOWLEDGE_GOVERNANCE_OWNER = "knowledge-governance-platform-engine" as const;
export const KNOWLEDGE_GOVERNANCE_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const KNOWLEDGE_GOVERNANCE_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const KNOWLEDGE_GOVERNANCE_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const KNOWLEDGE_GOVERNANCE_GRAPH_DEPENDENCY = "KNL/4" as const;
export const KNOWLEDGE_GOVERNANCE_INDUSTRY_DEPENDENCY = "KNL/5" as const;
export const KNOWLEDGE_GOVERNANCE_FRAMEWORK_DEPENDENCY = "KNL/6" as const;
export const KNOWLEDGE_GOVERNANCE_POLICY_DEPENDENCY = "KNL/7" as const;
export const KNOWLEDGE_GOVERNANCE_BEST_PRACTICE_DEPENDENCY = "KNL/8" as const;
export const KNOWLEDGE_GOVERNANCE_RETRIEVAL_DEPENDENCY = "KNL/9" as const;
export const KNOWLEDGE_GOVERNANCE_VALIDATION_DEPENDENCY = "KNL/10" as const;
export const KNOWLEDGE_GOVERNANCE_VERSIONING_DEPENDENCY = "KNL/11" as const;
export const KNOWLEDGE_GOVERNANCE_LEARNING_BRIDGE_DEPENDENCY = "KNL/12" as const;

export const KNOWLEDGE_GOVERNANCE_TAGS = Object.freeze([
  "[KNL_13]",
  "[KNOWLEDGE_GOVERNANCE]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_WORKFLOW_ENGINE]",
  "[NO_RUNTIME_GOVERNANCE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const GOVERNANCE_PLATFORM_KEYS = Object.freeze([
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
] as const);

export const GOVERNANCE_SCOPE_KEYS = Object.freeze([
  "platform",
  "registry",
  "contract",
  "catalog",
  "ecosystem",
] as const);

export const GOVERNANCE_LIFECYCLE_KEYS = Object.freeze([
  "draft",
  "active",
  "review",
  "certified",
  "deprecated",
] as const);

export const GOVERNANCE_RULE_KEYS = Object.freeze([
  "ownership",
  "stewardship",
  "certification",
  "audit",
  "compliance",
] as const);

export const APPROVAL_POLICY_KEYS = Object.freeze([
  "metadata_review",
  "structural_review",
  "certification_review",
] as const);

export const CERTIFICATION_POLICY_KEYS = Object.freeze([
  "platform_certification",
  "contract_certification",
  "regression_certification",
] as const);

export const AUDIT_POLICY_KEYS = Object.freeze([
  "metadata_audit",
  "boundary_audit",
  "dependency_audit",
] as const);

export const GOVERNANCE_STATUS_KEYS = Object.freeze(["draft", "active", "deprecated", "reserved"] as const);

export const GOVERNANCE_NAMESPACE_KEYS = Object.freeze([
  "knowledge-governance-platform",
  "knowledge-governance-policies",
  "knowledge-governance-owners",
  "knowledge-governance-extension",
] as const);

export const GOVERNANCE_DEPENDENCY_KEYS = Object.freeze([
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
] as const);

export const GOVERNANCE_EXTENSION_POINT_KEYS = Object.freeze([
  "platform_certification",
  "knowledge_platform_integration",
] as const);

export const GOVERNANCE_PLATFORM_ID_MAP: Readonly<Record<(typeof GOVERNANCE_PLATFORM_KEYS)[number], string>> =
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
    knl_versioning: "knowledge-versioning-platform",
    knl_learning_bridge: "knowledge-learning-bridge",
  });

export const GOVERNANCE_KNL_VERSION_MAP: Readonly<Record<(typeof GOVERNANCE_PLATFORM_KEYS)[number], string>> =
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
    knl_versioning: "KNL/11",
    knl_learning_bridge: "KNL/12",
  });

export const GOVERNANCE_PLATFORM_LABELS = Object.freeze({
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
  knl_versioning: "Knowledge Versioning Platform",
  knl_learning_bridge: "Knowledge Learning Bridge",
} as const);

export const GOVERNANCE_POLICY_KEY_PATTERN = /^[a-z][a-z0-9_]*$/;
export const KNOWLEDGE_GOVERNANCE_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_GOVERNANCE_NAMESPACE_PATTERN = /^knowledge-governance-[a-z][a-z0-9-]*$/;

export const KNOWLEDGE_GOVERNANCE_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_GOVERNANCE_PRINCIPLES = Object.freeze([
  "governance_is_metadata_not_workflow_engine",
  "no_approval_authorization_or_permissions_in_governance",
  "knl_13_consumes_knl_1_through_knl_12_only",
  "deterministic_and_explainable_governance_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
  "runtime_governance_and_audit_execution_deferred",
] as const);

export const KNOWLEDGE_GOVERNANCE_MUST_NOT_OWN = Object.freeze([
  "approval_workflow",
  "authorization",
  "authentication",
  "permissions",
  "runtime_governance",
  "audit_execution",
  "policy_enforcement",
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

export const KNOWLEDGE_GOVERNANCE_FUTURE_PHASE_KEYS = Object.freeze([
  "platform_certification",
  "knowledge_platform_integration",
] as const);

export const KNOWLEDGE_GOVERNANCE_PUBLIC_API_REGISTRY = Object.freeze([
  "registerKnowledgeGovernancePolicy",
  "registerKnowledgeOwner",
  "registerKnowledgeSteward",
  "getKnowledgeGovernancePlatform",
  "validateKnowledgeGovernancePlatform",
  "getKnowledgeGovernanceManifest",
] as const);

export const KNOWLEDGE_GOVERNANCE_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredPolicies: 128,
  maxRegisteredOwners: 64,
  maxRegisteredStewards: 64,
  maxRegisteredRules: 256,
  maxRegisteredApprovalPolicies: 64,
  maxRegisteredCertificationPolicies: 64,
  maxRegisteredAuditPolicies: 64,
  maxRegisteredNamespaces: 64,
  maxRegisteredDependencies: 32,
} as const);

export const KNOWLEDGE_GOVERNANCE_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "authorize(",
  "authenticate(",
  "permissionCheck",
  "workflowEngine",
  "approvalWorkflow",
  "executeAudit",
  "enforcePolicy",
  "runtimeGovernance",
  "semanticSearch",
  "retrievalEngine",
  "machineLearning",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_GOVERNANCE_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "policy-id-unique", description: "Governance policy identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "policy-key-unique", description: "Governance policy keys must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "owner-id-unique", description: "Knowledge owner identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "owner-key-unique", description: "Knowledge owner keys must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "steward-id-unique", description: "Knowledge steward identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "steward-key-unique", description: "Knowledge steward keys must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-12-prerequisite", description: "Knowledge governance requires KNL/1 through KNL/12.", enforced: true as const }),
] as const);
