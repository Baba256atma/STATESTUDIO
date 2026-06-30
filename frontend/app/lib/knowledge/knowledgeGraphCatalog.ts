/**
 * KNL-4 — Knowledge Graph catalog constants.
 */

export const KNOWLEDGE_GRAPH_CONTRACT_VERSION = "KNL/4" as const;
export const KNOWLEDGE_GRAPH_ARCHITECTURE_VERSION = "KNL/4-graph-arch" as const;
export const KNOWLEDGE_GRAPH_ID = "knowledge-graph" as const;
export const KNOWLEDGE_GRAPH_NAME = "Knowledge Graph" as const;
export const KNOWLEDGE_GRAPH_NAMESPACE = "knowledge-graph-core" as const;
export const KNOWLEDGE_GRAPH_OWNER = "knowledge-graph-engine" as const;
export const KNOWLEDGE_GRAPH_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const KNOWLEDGE_GRAPH_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const KNOWLEDGE_GRAPH_VOCABULARY_DEPENDENCY = "KNL/3" as const;

export const KNOWLEDGE_GRAPH_TAGS = Object.freeze([
  "[KNL_4]",
  "[KNOWLEDGE_GRAPH]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_TRAVERSAL]",
  "[NO_ALGORITHMS]",
  "[NO_RETRIEVAL]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const KNOWLEDGE_GRAPH_NODE_TYPE_KEYS = Object.freeze([
  "entity",
  "concept",
  "process",
  "resource",
  "event",
  "decision",
  "goal",
  "kpi",
  "risk",
  "stakeholder",
  "policy",
  "extension",
] as const);

export const KNOWLEDGE_GRAPH_EDGE_TYPE_KEYS = Object.freeze([
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
  "references",
] as const);

export const KNOWLEDGE_GRAPH_NAMESPACE_KEYS = Object.freeze([
  "knowledge-graph-core",
  "knowledge-graph-ontology",
  "knowledge-graph-vocabulary",
  "knowledge-graph-extension",
] as const);

export const KNOWLEDGE_GRAPH_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_retrieval",
  "industry_models",
  "framework_library",
  "best_practices",
] as const);

export const KNOWLEDGE_GRAPH_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_GRAPH_NAMESPACE_PATTERN = /^knowledge-graph-[a-z][a-z0-9-]*$/;

export const KNOWLEDGE_GRAPH_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_GRAPH_PRINCIPLES = Object.freeze([
  "graph_is_structure_not_traversal",
  "graph_is_metadata_only",
  "knl_4_consumes_knl_1_2_3_only",
  "no_graph_algorithms_or_path_finding",
  "no_semantic_search_or_embeddings",
  "no_ml_llm_or_ai_inference",
  "deterministic_and_explainable_graph_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
] as const);

export const KNOWLEDGE_GRAPH_MUST_NOT_OWN = Object.freeze([
  "graph_traversal",
  "graph_algorithms",
  "shortest_path",
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

export const KNOWLEDGE_GRAPH_FUTURE_PHASE_KEYS = Object.freeze([
  "industry_models",
  "knowledge_retrieval",
  "knowledge_policy",
  "framework_library",
  "best_practices",
  "platform_certification",
] as const);

export const KNOWLEDGE_GRAPH_PUBLIC_API_REGISTRY = Object.freeze([
  "registerKnowledgeNode",
  "registerKnowledgeEdge",
  "registerKnowledgeNodeType",
  "getKnowledgeGraph",
  "validateKnowledgeGraph",
  "getKnowledgeGraphManifest",
] as const);

export const KNOWLEDGE_GRAPH_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredNodes: 8192,
  maxRegisteredEdges: 16384,
  maxRegisteredNodeTypes: 128,
  maxRegisteredEdgeTypes: 128,
  maxRegisteredNamespaces: 64,
  maxRegisteredMetadata: 512,
} as const);

export const KNOWLEDGE_GRAPH_FORBIDDEN_PATTERNS = Object.freeze([
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
  "shortestPath",
  "dijkstra",
  "bfs(",
  "dfs(",
  "retrievalEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_GRAPH_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "node-id-unique", description: "Node identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "edge-id-unique", description: "Edge identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "edge-node-refs-valid", description: "Edge source and target must reference registered nodes.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-2-3-prerequisite", description: "Graph requires KNL/1, KNL/2, and KNL/3.", enforced: true as const }),
] as const);
