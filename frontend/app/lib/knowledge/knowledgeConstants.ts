/**
 * KNL-1 — Knowledge Platform constants.
 */

export const KNOWLEDGE_PLATFORM_CONTRACT_VERSION = "KNL/1" as const;
export const KNOWLEDGE_PLATFORM_ARCHITECTURE_VERSION = "KNL/1-arch" as const;
export const KNOWLEDGE_PLATFORM_API_VERSION = "KNL/1" as const;
export const KNOWLEDGE_PLATFORM_SOURCE = "knowledge-platform-foundation" as const;
export const KNOWLEDGE_PLATFORM_LOG_PREFIX = "[NexoraKnowledge]" as const;
export const KNOWLEDGE_PLATFORM = "nexora-knl" as const;

export const KNOWLEDGE_PLATFORM_ID = "knowledge-platform" as const;
export const KNOWLEDGE_PLATFORM_NAME = "Knowledge Platform" as const;
export const KNOWLEDGE_LAYER_ID = "KNL" as const;

export const KNOWLEDGE_PLATFORM_TAGS = Object.freeze([
  "[KNL_1]",
  "[KNOWLEDGE_FOUNDATION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_AI]",
  "[NO_RETRIEVAL]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const KNOWLEDGE_DOMAIN_KEYS = Object.freeze([
  "structural",
  "reference",
  "operational",
  "governance",
  "extension",
] as const);

export const KNOWLEDGE_CATEGORY_KEYS = Object.freeze([
  "domain",
  "provider",
  "capability",
  "namespace",
  "extension_point",
] as const);

export const KNOWLEDGE_CAPABILITY_KEYS = Object.freeze([
  "platform_identity",
  "knowledge_contracts",
  "knowledge_registry",
  "dependency_validation",
  "manifest_generation",
  "extension_registration",
  "namespace_registry",
  "validation_gates",
] as const);

export const KNOWLEDGE_NAMESPACE_KEYS = Object.freeze([
  "knowledge-core",
  "knowledge-foundation",
  "knowledge-extension",
] as const);

export const KNOWLEDGE_EXTENSION_POINT_KEYS = Object.freeze([
  "business_ontology",
  "knowledge_graph",
  "knowledge_retrieval",
  "knowledge_policy",
  "framework_library",
  "industry_models",
  "best_practices",
  "knowledge_learning",
] as const);

export const KNOWLEDGE_VERSION_PATTERN = /^KNL\/\d+$/;

export const KNOWLEDGE_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_MANDATORY_REGISTRATION_FIELDS = Object.freeze([
  "registrationId",
  "registryType",
  "label",
  "description",
  "version",
  "registeredAt",
  "readOnly",
] as const);

export const KNOWLEDGE_PLATFORM_PRINCIPLES = Object.freeze([
  "knowledge_is_metadata_not_runtime_intelligence",
  "knowledge_platform_is_foundation_only",
  "all_future_knl_phases_depend_on_knl_1",
  "no_business_ontology_in_foundation",
  "no_retrieval_or_embeddings_in_foundation",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const KNOWLEDGE_MUST_NOT_OWN = Object.freeze([
  "business_ontology",
  "knowledge_graph",
  "knowledge_retrieval",
  "embeddings",
  "semantic_search",
  "policies",
  "framework_library",
  "industry_models",
  "best_practices",
  "learning",
  "reasoning",
  "recommendations",
  "executive_intelligence",
  "machine_learning",
  "neural_networks",
  "llm_reasoning",
  "vector_search",
  "database",
  "caching",
  "external_apis",
  "app_integration",
  "lay_integration",
  "ops_integration",
  "persistence",
  "react_ui",
] as const);

export const KNOWLEDGE_FUTURE_PHASE_KEYS = Object.freeze([
  "business_ontology",
  "knowledge_graph",
  "knowledge_retrieval",
  "knowledge_policy",
  "framework_library",
  "industry_models",
  "best_practices",
  "knowledge_learning",
  "platform_certification",
  "platform_freeze",
] as const);

export const KNOWLEDGE_FUTURE_DEPENDENCY_RULES = Object.freeze([
  Object.freeze({ ruleId: "knl-1-prerequisite", description: "All KNL phases must depend on KNL/1.", enforced: true as const }),
  Object.freeze({ ruleId: "no-app-modification", description: "KNL must not modify certified APP platforms.", enforced: true as const }),
  Object.freeze({ ruleId: "no-lay-modification", description: "KNL must not modify LAY platforms.", enforced: true as const }),
  Object.freeze({ ruleId: "no-int-modification", description: "KNL must not modify INT platforms.", enforced: true as const }),
  Object.freeze({ ruleId: "no-ops-modification", description: "KNL must not modify OPS platforms.", enforced: true as const }),
  Object.freeze({ ruleId: "extend-only-contracts", description: "Future phases extend contracts only.", enforced: true as const }),
] as const);

export const KNOWLEDGE_PUBLIC_API_REGISTRY = Object.freeze([
  "registerKnowledgeDomain",
  "registerKnowledgeProvider",
  "registerKnowledgeCapability",
  "getKnowledgeRegistry",
  "validateKnowledgeFoundation",
  "buildKnowledgeFoundation",
  "createKnowledgeFoundation",
] as const);

export const KNOWLEDGE_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredDomains: 256,
  maxRegisteredCategories: 256,
  maxRegisteredProviders: 512,
  maxRegisteredCapabilities: 512,
  maxRegisteredNamespaces: 128,
  maxRegisteredExtensionPoints: 128,
} as const);

export const KNOWLEDGE_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const KNOWLEDGE_DOMAIN_LABELS = Object.freeze({
  structural: "Structural Knowledge Domain",
  reference: "Reference Knowledge Domain",
  operational: "Operational Knowledge Domain",
  governance: "Governance Knowledge Domain",
  extension: "Extension Knowledge Domain",
} as const);

export const KNOWLEDGE_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "business-ontology-engine", label: "Business Ontology Engine", phaseKey: "business_ontology", status: "reserved" as const }),
  Object.freeze({ extensionId: "knowledge-graph-engine", label: "Knowledge Graph Engine", phaseKey: "knowledge_graph", status: "reserved" as const }),
  Object.freeze({ extensionId: "knowledge-retrieval-engine", label: "Knowledge Retrieval Engine", phaseKey: "knowledge_retrieval", status: "reserved" as const }),
  Object.freeze({ extensionId: "knowledge-policy-engine", label: "Knowledge Policy Engine", phaseKey: "knowledge_policy", status: "reserved" as const }),
  Object.freeze({ extensionId: "framework-library-engine", label: "Framework Library Engine", phaseKey: "framework_library", status: "reserved" as const }),
] as const);
