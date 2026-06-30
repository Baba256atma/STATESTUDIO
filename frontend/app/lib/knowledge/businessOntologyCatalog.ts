/**
 * KNL-2 — Business Ontology catalog constants.
 */

export const BUSINESS_ONTOLOGY_CONTRACT_VERSION = "KNL/2" as const;
export const BUSINESS_ONTOLOGY_ARCHITECTURE_VERSION = "KNL/2-ontology-arch" as const;
export const BUSINESS_ONTOLOGY_ID = "business-ontology" as const;
export const BUSINESS_ONTOLOGY_NAME = "Business Ontology" as const;
export const BUSINESS_ONTOLOGY_NAMESPACE = "knowledge-business-ontology" as const;
export const BUSINESS_ONTOLOGY_OWNER = "business-ontology-engine" as const;
export const BUSINESS_ONTOLOGY_FOUNDATION_DEPENDENCY = "KNL/1" as const;

export const BUSINESS_ONTOLOGY_TAGS = Object.freeze([
  "[KNL_2]",
  "[BUSINESS_ONTOLOGY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_AI]",
  "[NO_GRAPH_TRAVERSAL]",
  "[NO_RETRIEVAL]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const BUSINESS_ENTITY_TYPE_KEYS = Object.freeze([
  "domain",
  "entity",
  "object",
  "process",
  "function",
  "capability",
  "goal",
  "kpi",
  "risk",
  "resource",
  "stakeholder",
  "policy",
  "rule",
  "event",
  "scenario",
  "decision",
  "dependency",
  "constraint",
  "opportunity",
] as const);

export const BUSINESS_RELATIONSHIP_TYPE_KEYS = Object.freeze([
  "owns",
  "depends_on",
  "measures",
  "affects",
  "contains",
  "produces",
  "consumes",
  "reports_to",
  "belongs_to",
  "supports",
  "blocks",
  "mitigates",
] as const);

export const BUSINESS_ONTOLOGY_CATEGORY_KEYS = Object.freeze([
  "structural",
  "operational",
  "governance",
  "performance",
  "risk_compliance",
  "strategy",
] as const);

export const BUSINESS_ONTOLOGY_CAPABILITY_KEYS = Object.freeze([
  "entity_registry",
  "relationship_registry",
  "category_registry",
  "metadata_registry",
  "ontology_manifest",
  "ontology_validation",
  "contract_definitions",
  "catalog_seeding",
] as const);

export const BUSINESS_ONTOLOGY_VERSION_PATTERN = /^KNL\/\d+$/;

export const BUSINESS_ONTOLOGY_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const BUSINESS_ONTOLOGY_PRINCIPLES = Object.freeze([
  "ontology_is_structure_not_runtime_intelligence",
  "all_ontology_definitions_are_metadata_only",
  "knl_2_consumes_knl_1_only",
  "no_graph_traversal_or_semantic_reasoning",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_definitions",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const BUSINESS_ONTOLOGY_MUST_NOT_OWN = Object.freeze([
  "knowledge_graph",
  "graph_traversal",
  "semantic_search",
  "embeddings",
  "knowledge_retrieval",
  "recommendations",
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

export const BUSINESS_ONTOLOGY_FUTURE_PHASE_KEYS = Object.freeze([
  "business_vocabulary",
  "knowledge_graph",
  "knowledge_retrieval",
  "knowledge_policy",
  "framework_library",
  "industry_models",
  "best_practices",
  "knowledge_learning",
] as const);

export const BUSINESS_ONTOLOGY_PUBLIC_API_REGISTRY = Object.freeze([
  "registerBusinessEntity",
  "registerBusinessRelationship",
  "registerBusinessCapability",
  "getBusinessOntology",
  "validateBusinessOntology",
  "getBusinessOntologyManifest",
] as const);

export const BUSINESS_ONTOLOGY_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredEntities: 2048,
  maxRegisteredRelationships: 4096,
  maxRegisteredCapabilities: 256,
  maxRegisteredCategories: 128,
  maxRegisteredMetadata: 512,
} as const);

export const BUSINESS_ONTOLOGY_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "semanticSearch",
  "graphTraversal",
  "traverseGraph",
  "retrievalEngine",
  "inferenceEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const BUSINESS_ONTOLOGY_RELATIONSHIP_LABELS = Object.freeze({
  owns: "Owns",
  depends_on: "Depends On",
  measures: "Measures",
  affects: "Affects",
  contains: "Contains",
  produces: "Produces",
  consumes: "Consumes",
  reports_to: "Reports To",
  belongs_to: "Belongs To",
  supports: "Supports",
  blocks: "Blocks",
  mitigates: "Mitigates",
} as const);
