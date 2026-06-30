/**
 * KNL-14 — Knowledge Platform Certification catalog constants.
 */

export const KNOWLEDGE_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "KNL/14" as const;
export const KNOWLEDGE_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "KNL/14-knowledge-platform-certification-arch" as const;
export const KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_ID = "knowledge-platform-certification" as const;
export const KNOWLEDGE_PLATFORM_CERTIFICATION_PLATFORM_NAME = "Knowledge Platform Certification" as const;
export const KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE = "knowledge-platform-certification" as const;
export const KNOWLEDGE_PLATFORM_CERTIFICATION_OWNER = "knowledge-platform-certification-engine" as const;
export const KNOWLEDGE_PLATFORM_CERTIFICATION_GOVERNANCE_DEPENDENCY = "KNL/13" as const;

export const KNOWLEDGE_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[KNL_14]",
  "[KNOWLEDGE_PLATFORM_CERTIFICATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_RUNTIME_VALIDATION]",
  "[NO_PLATFORM_FREEZE]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const KNL_CERTIFICATION_PHASE_KEYS = Object.freeze([
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
] as const);

export const CERTIFICATION_SCOPE_KEYS = Object.freeze([
  "ecosystem",
  "platform",
  "registry",
  "contract",
  "manifest",
] as const);

export const CERTIFICATION_STATUS_KEYS = Object.freeze(["pending", "passed", "failed", "reserved"] as const);

export const CERTIFICATION_GATE_KEYS = Object.freeze([
  "A_knl_1_foundation",
  "B_knl_2_ontology",
  "C_knl_3_vocabulary",
  "D_knl_4_graph",
  "E_knl_5_industry",
  "F_knl_6_framework",
  "G_knl_7_policy",
  "H_knl_8_best_practice",
  "I_knl_9_retrieval",
  "J_knl_10_validation",
  "K_knl_11_versioning",
  "L_knl_12_learning_bridge",
  "M_knl_13_governance",
  "N_manifest_completeness",
  "O_dependency_chain",
  "P_public_api_presence",
  "Q_boundary_rules",
  "R_platform_id_consistency",
  "S_version_label_validity",
  "T_extension_points_reserved",
  "U_additive_architecture",
  "Z_platform_readiness",
] as const);

export const CERTIFICATION_NAMESPACE_KEYS = Object.freeze([
  "knowledge-platform-certification",
  "knowledge-platform-certification-profiles",
  "knowledge-platform-certification-gates",
  "knowledge-platform-certification-extension",
] as const);

export const CERTIFICATION_DEPENDENCY_KEYS = Object.freeze([
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
] as const);

export const CERTIFICATION_EXTENSION_POINT_KEYS = Object.freeze([
  "platform_freeze",
  "knowledge_platform_integration",
] as const);

export const KNL_PHASE_CERTIFICATION_TARGETS = Object.freeze([
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
] as const);

export const CERTIFICATION_GATE_KEY_BY_PHASE = Object.freeze({
  knl_foundation: "A_knl_1_foundation",
  knl_ontology: "B_knl_2_ontology",
  knl_vocabulary: "C_knl_3_vocabulary",
  knl_graph: "D_knl_4_graph",
  knl_industry: "E_knl_5_industry",
  knl_framework: "F_knl_6_framework",
  knl_policy: "G_knl_7_policy",
  knl_best_practice: "H_knl_8_best_practice",
  knl_retrieval: "I_knl_9_retrieval",
  knl_validation: "J_knl_10_validation",
  knl_versioning: "K_knl_11_versioning",
  knl_learning_bridge: "L_knl_12_learning_bridge",
  knl_governance: "M_knl_13_governance",
} as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_PLATFORM_CERTIFICATION_NAMESPACE_PATTERN =
  /^knowledge-platform-certification(?:-[a-z][a-z0-9-]*)?$/;

export const KNOWLEDGE_PLATFORM_CERTIFICATION_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_PRINCIPLES = Object.freeze([
  "certification_is_metadata_not_runtime_validator",
  "no_platform_freeze_migration_or_mutation_in_certification",
  "knl_14_consumes_knl_1_through_knl_13_only",
  "deterministic_and_explainable_certification_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
  "runtime_validation_and_rule_execution_deferred",
] as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_MUST_NOT_OWN = Object.freeze([
  "platform_freeze",
  "runtime_validation",
  "rule_execution",
  "migration",
  "rollback",
  "asset_mutation",
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

export const KNOWLEDGE_PLATFORM_CERTIFICATION_FUTURE_PHASE_KEYS = Object.freeze([
  "platform_freeze",
  "knowledge_platform_integration",
] as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_PUBLIC_API_REGISTRY = Object.freeze([
  "runKnowledgePlatformCertification",
  "getKnowledgePlatformCertificationManifest",
  "validateKnowledgePlatformCertification",
  "getKnowledgePlatformCertificationReport",
] as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "freezePlatform",
  "migratePlatform",
  "rollbackPlatform",
  "mutateAsset",
  "executeRule",
  "runtimeValidation",
  "enforcePolicy",
  "semanticSearch",
  "retrievalEngine",
  "machineLearning",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_PLATFORM_CERTIFICATION_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "all-knl-phases-certified", description: "All KNL/1 through KNL/13 phases must pass certification.", enforced: true as const }),
  Object.freeze({ ruleId: "manifest-required", description: "Each certified phase must expose a manifest.", enforced: true as const }),
  Object.freeze({ ruleId: "public-api-required", description: "Each certified phase must declare public APIs.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-13-prerequisite", description: "Platform certification requires KNL/1 through KNL/13.", enforced: true as const }),
] as const);
