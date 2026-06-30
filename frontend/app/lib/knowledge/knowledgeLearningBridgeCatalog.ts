/**
 * KNL-12 — Knowledge Learning Bridge catalog constants.
 */

export const KNOWLEDGE_LEARNING_BRIDGE_CONTRACT_VERSION = "KNL/12" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_ARCHITECTURE_VERSION = "KNL/12-knowledge-learning-bridge-arch" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_ID = "knowledge-learning-bridge" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_PLATFORM_NAME = "Knowledge Learning Bridge" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE = "knowledge-learning-bridge" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_OWNER = "knowledge-learning-bridge-engine" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_FOUNDATION_DEPENDENCY = "KNL/1" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_ONTOLOGY_DEPENDENCY = "KNL/2" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_VOCABULARY_DEPENDENCY = "KNL/3" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_GRAPH_DEPENDENCY = "KNL/4" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_INDUSTRY_DEPENDENCY = "KNL/5" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_FRAMEWORK_DEPENDENCY = "KNL/6" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_POLICY_DEPENDENCY = "KNL/7" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_BEST_PRACTICE_DEPENDENCY = "KNL/8" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_RETRIEVAL_DEPENDENCY = "KNL/9" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_VALIDATION_DEPENDENCY = "KNL/10" as const;
export const KNOWLEDGE_LEARNING_BRIDGE_VERSIONING_DEPENDENCY = "KNL/11" as const;

export const KNOWLEDGE_LEARNING_BRIDGE_TAGS = Object.freeze([
  "[KNL_12]",
  "[KNOWLEDGE_LEARNING_BRIDGE]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[NO_LEARNING_ENGINE]",
  "[NO_RUNTIME_INTEGRATION]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const LEARNING_BRIDGE_KEYS = Object.freeze([
  "app_layer",
  "lay_layer",
  "int_layer",
  "ops_layer",
  "future_ml_layer",
  "future_analytics_layer",
  "future_advisor_layer",
] as const);

export const LEARNING_SOURCE_KEYS = Object.freeze([
  "app_layer",
  "lay_layer",
  "int_layer",
  "ops_layer",
  "future_ml_layer",
  "future_analytics_layer",
  "future_advisor_layer",
] as const);

export const LEARNING_TARGET_KEYS = Object.freeze([
  "knl_platform",
  "knowledge_versioning_platform",
] as const);

export const FEEDBACK_TYPE_KEYS = Object.freeze([
  "observation",
  "suggestion",
  "correction",
  "enhancement",
] as const);

export const OBSERVATION_TYPE_KEYS = Object.freeze([
  "usage",
  "pattern",
  "anomaly",
  "context",
] as const);

export const LEARNING_CONTEXT_KEYS = Object.freeze([
  "session",
  "batch",
  "stream",
  "event",
] as const);

export const LEARNING_STATUS_KEYS = Object.freeze(["draft", "active", "deprecated", "reserved"] as const);

export const LEARNING_NAMESPACE_KEYS = Object.freeze([
  "knowledge-learning-bridge",
  "knowledge-learning-sources",
  "knowledge-learning-targets",
  "knowledge-learning-extension",
] as const);

export const LEARNING_DEPENDENCY_KEYS = Object.freeze([
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
] as const);

export const LEARNING_EXTENSION_POINT_KEYS = Object.freeze([
  "knowledge_governance",
  "platform_certification",
] as const);

export const LEARNING_PLATFORM_ID_MAP: Readonly<Record<(typeof LEARNING_BRIDGE_KEYS)[number], string>> =
  Object.freeze({
    app_layer: "app-layer",
    lay_layer: "lay-layer",
    int_layer: "int-layer",
    ops_layer: "ops-layer",
    future_ml_layer: "future-ml-layer",
    future_analytics_layer: "future-analytics-layer",
    future_advisor_layer: "future-advisor-layer",
  });

export const LEARNING_BRIDGE_TARGET_MAP: Readonly<Record<(typeof LEARNING_BRIDGE_KEYS)[number], (typeof LEARNING_TARGET_KEYS)[number]>> =
  Object.freeze({
    app_layer: "knl_platform",
    lay_layer: "knl_platform",
    int_layer: "knl_platform",
    ops_layer: "knl_platform",
    future_ml_layer: "knowledge_versioning_platform",
    future_analytics_layer: "knowledge_versioning_platform",
    future_advisor_layer: "knowledge_versioning_platform",
  });

export const LEARNING_TARGET_PLATFORM_ID_MAP: Readonly<Record<(typeof LEARNING_TARGET_KEYS)[number], string>> =
  Object.freeze({
    knl_platform: "knowledge-platform",
    knowledge_versioning_platform: "knowledge-versioning-platform",
  });

export const LEARNING_BRIDGE_LABELS = Object.freeze({
  app_layer: "APP Layer",
  lay_layer: "LAY Layer",
  int_layer: "INT Layer",
  ops_layer: "OPS Layer",
  future_ml_layer: "Future ML Layer",
  future_analytics_layer: "Future Analytics Layer",
  future_advisor_layer: "Future Advisor Layer",
} as const);

export const KNOWLEDGE_LEARNING_BRIDGE_VERSION_PATTERN = /^KNL\/\d+$/;
export const KNOWLEDGE_LEARNING_BRIDGE_NAMESPACE_PATTERN = /^knowledge-learning-[a-z][a-z0-9-]*$/;
export const LEARNING_BRIDGE_NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

export const KNOWLEDGE_LEARNING_BRIDGE_MANDATORY_METADATA_FIELDS = Object.freeze([
  "metadataId",
  "metadataVersion",
  "namespace",
  "owner",
  "createdAt",
  "readOnly",
] as const);

export const KNOWLEDGE_LEARNING_BRIDGE_PRINCIPLES = Object.freeze([
  "learning_bridge_is_metadata_not_learning_engine",
  "no_ml_ai_or_adaptive_learning_in_bridge",
  "knl_12_consumes_knl_1_through_knl_11_only",
  "deterministic_and_explainable_bridge_metadata",
  "consumer_platforms_must_not_be_modified",
  "extend_only_public_contracts",
  "runtime_learning_and_feedback_processing_deferred",
] as const);

export const KNOWLEDGE_LEARNING_BRIDGE_MUST_NOT_OWN = Object.freeze([
  "machine_learning",
  "ai",
  "llm",
  "reinforcement_learning",
  "feedback_processing",
  "adaptive_learning",
  "knowledge_updating",
  "knowledge_mutation",
  "runtime_learning",
  "search",
  "retrieval",
  "reasoning",
  "app_runtime_integration",
  "lay_runtime_integration",
  "int_runtime_integration",
  "ops_runtime_integration",
  "database",
  "caching",
  "external_apis",
  "persistence",
] as const);

export const KNOWLEDGE_LEARNING_BRIDGE_FUTURE_PHASE_KEYS = Object.freeze([
  "knowledge_governance",
  "platform_certification",
] as const);

export const KNOWLEDGE_LEARNING_BRIDGE_PUBLIC_API_REGISTRY = Object.freeze([
  "registerKnowledgeLearningSource",
  "registerKnowledgeLearningTarget",
  "registerKnowledgeLearningBridge",
  "getKnowledgeLearningBridgePlatform",
  "validateKnowledgeLearningBridgePlatform",
  "getKnowledgeLearningBridgeManifest",
] as const);

export const KNOWLEDGE_LEARNING_BRIDGE_DEFAULT_LIMITS = Object.freeze({
  maxRegisteredSources: 64,
  maxRegisteredTargets: 32,
  maxRegisteredBridges: 128,
  maxRegisteredFeedbackTypes: 32,
  maxRegisteredObservationTypes: 32,
  maxRegisteredProposals: 128,
  maxRegisteredNamespaces: 64,
  maxRegisteredDependencies: 32,
} as const);

export const KNOWLEDGE_LEARNING_BRIDGE_FORBIDDEN_PATTERNS = Object.freeze([
  "openai",
  "ChatGPT",
  "prompt(",
  "embedding",
  "vectorSearch",
  "neural",
  "machineLearning",
  "reinforcementLearning",
  "trainModel",
  "adaptKnowledge",
  "processFeedback",
  "runtimeLearning",
  "semanticSearch",
  "retrievalEngine",
  "reasoningEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
] as const);

export const KNOWLEDGE_LEARNING_BRIDGE_GOVERNANCE_RULES = Object.freeze([
  Object.freeze({ ruleId: "bridge-id-unique", description: "Learning bridge identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "bridge-key-unique", description: "Learning bridge keys must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "source-id-unique", description: "Learning source identifiers must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "source-key-unique", description: "Learning source keys must be unique.", enforced: true as const }),
  Object.freeze({ ruleId: "knl-1-11-prerequisite", description: "Knowledge learning bridge requires KNL/1 through KNL/11.", enforced: true as const }),
] as const);
