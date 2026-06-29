/**
 * APP-10:1 — Cross-Scenario Learning Platform constants.
 */

import type {
  LearningCandidateStatus,
  LearningSessionStatus,
  LearningSourceType,
} from "./crossScenarioLearningTypes.ts";

export const CROSS_SCENARIO_LEARNING_PLATFORM_CONTRACT_VERSION = "APP-10/1" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_ARCHITECTURE_VERSION = "APP-10/1-arch" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_API_VERSION = "APP-10/1" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_SOURCE = "cross-scenario-learning-platform-foundation" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_LOG_PREFIX = "[NexoraCrossScenarioLearning]" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM = "nexora-type-c" as const;

export const CROSS_SCENARIO_LEARNING_PLATFORM_ID = "cross-scenario-learning-platform" as const;
export const CROSS_SCENARIO_LEARNING_PLATFORM_NAME = "Cross-Scenario Learning" as const;

export const CROSS_SCENARIO_LEARNING_PLATFORM_TAGS = Object.freeze([
  "[APP10_1]",
  "[CROSS_SCENARIO_LEARNING_FOUNDATION]",
  "[EXECUTIVE_INTELLIGENCE_LEARNING]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[CONSUMER_ONLY]",
  "[NO_ML]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const CROSS_SCENARIO_LEARNING_SOURCE_KEYS = Object.freeze([
  "completed_scenario",
  "final_outcome",
  "executive_decision",
  "confidence_evolution",
  "historical_timeline",
  "validated_business_knowledge",
  "decision_journal",
  "scenario_timeline",
] as const satisfies readonly LearningSourceType[]);

export const CROSS_SCENARIO_LEARNING_CANDIDATE_STATUS_KEYS = Object.freeze([
  "registered",
  "validated",
  "archived",
] as const satisfies readonly LearningCandidateStatus[]);

export const CROSS_SCENARIO_LEARNING_SESSION_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "completed",
  "archived",
] as const satisfies readonly LearningSessionStatus[]);

export const CROSS_SCENARIO_LEARNING_MANDATORY_SCENARIO_SNAPSHOT_FIELDS = Object.freeze([
  "snapshotId",
  "workspaceId",
  "scenarioId",
  "scenarioTitle",
  "completionStatus",
  "sourceType",
  "sourceReferenceId",
  "metadata",
  "capturedAt",
  "version",
] as const);

export const CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_CANDIDATE_FIELDS = Object.freeze([
  "candidateId",
  "workspaceId",
  "sessionId",
  "snapshotId",
  "sourceType",
  "status",
  "label",
  "description",
  "metadata",
  "registeredAt",
  "version",
] as const);

export const CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_CONTEXT_FIELDS = Object.freeze([
  "contextId",
  "workspaceId",
  "sessionId",
  "sourceTypes",
  "scope",
  "metadata",
  "createdAt",
  "version",
] as const);

export const CROSS_SCENARIO_LEARNING_MANDATORY_LEARNING_SESSION_FIELDS = Object.freeze([
  "sessionId",
  "workspaceId",
  "status",
  "label",
  "description",
  "sourceTypes",
  "metadata",
  "createdAt",
  "updatedAt",
  "version",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_PRINCIPLES = Object.freeze([
  "learning_is_deterministic_and_reproducible",
  "cross_scenario_learning_is_consumer_only",
  "completed_scenarios_are_first_class_learning_inputs",
  "executive_knowledge_is_extracted_not_inferred",
  "every_learning_artifact_belongs_to_one_workspace",
  "learning_metadata_is_version_safe",
  "platform_must_remain_metadata_only",
  "no_machine_learning_in_foundation",
  "no_similarity_engine_in_foundation",
  "no_recommendation_engine_in_foundation",
  "no_statistical_prediction_in_foundation",
  "no_embeddings_or_vector_search_in_foundation",
] as const);

export const CROSS_SCENARIO_LEARNING_FUTURE_PHASE_KEYS = Object.freeze([
  "pattern_learning",
  "similarity_engine",
  "outcome_learning",
  "failure_learning",
  "strategy_learning",
  "recommendation_learning",
  "learning_engine",
  "learning_query",
  "learning_api",
  "platform_certification",
] as const);

export const CROSS_SCENARIO_LEARNING_MUST_NOT_OWN = Object.freeze([
  "pattern_discovery",
  "similarity_engine",
  "clustering",
  "embeddings",
  "vector_search",
  "recommendation_engine",
  "machine_learning",
  "neural_networks",
  "statistical_prediction",
  "scenario_engine",
  "decision_journal_engine",
  "confidence_evolution_engine",
  "executive_memory_engine",
  "visualization",
  "dashboard",
  "assistant",
  "persistence",
  "database",
  "react_ui",
] as const);

export const CROSS_SCENARIO_LEARNING_PLATFORM_CAPABILITIES = Object.freeze([
  "platform_identity",
  "learning_contracts",
  "learning_registry",
  "dependency_validation",
  "manifest_generation",
  "extension_registration",
  "consumer_registry",
  "workspace_isolation_contracts",
] as const);

export const CROSS_SCENARIO_LEARNING_FUTURE_COMPATIBILITY = Object.freeze({
  app10Ready: true,
  patternLearningReady: false,
  similarityEngineReady: false,
  outcomeLearningReady: false,
  failureLearningReady: false,
  strategyLearningReady: false,
  recommendationLearningReady: false,
  learningEngineReady: false,
  scenarioTimelineConsumerReady: true,
  decisionTimelineConsumerReady: true,
  businessTimelineConsumerReady: true,
  decisionJournalConsumerReady: true,
  confidenceEvolutionConsumerReady: true,
  workspaceConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const CROSS_SCENARIO_LEARNING_DEFAULT_LIMITS = Object.freeze({
  maxSessionLabelLength: 128,
  maxSessionDescriptionLength: 512,
  maxCandidateLabelLength: 128,
  maxCandidateDescriptionLength: 512,
  maxRegisteredSessions: 256,
  maxRegisteredCandidates: 1024,
  maxSourceTypesPerSession: 8,
} as const);

export const CROSS_SCENARIO_LEARNING_CONSUMER_REGISTRY = Object.freeze([
  Object.freeze({ consumerId: "workspace-consumer", label: "Workspace Consumer", integrationPath: "future APP-10 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "dashboard-consumer", label: "Dashboard Consumer", integrationPath: "future APP-10 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "assistant-consumer", label: "Assistant Consumer", integrationPath: "future APP-10 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "report-consumer", label: "Report Consumer", integrationPath: "future APP-10 API facade", status: "registered" as const }),
] as const);

export const CROSS_SCENARIO_LEARNING_FUTURE_ENGINE_REGISTRY = Object.freeze([
  Object.freeze({ engineId: "pattern-learning-engine", label: "Pattern Learning Engine", phaseKey: "pattern_learning", status: "reserved" as const }),
  Object.freeze({ engineId: "similarity-engine", label: "Similarity Engine", phaseKey: "similarity_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "outcome-learning-engine", label: "Outcome Learning Engine", phaseKey: "outcome_learning", status: "reserved" as const }),
  Object.freeze({ engineId: "failure-learning-engine", label: "Failure Learning Engine", phaseKey: "failure_learning", status: "reserved" as const }),
  Object.freeze({ engineId: "strategy-learning-engine", label: "Strategy Learning Engine", phaseKey: "strategy_learning", status: "reserved" as const }),
  Object.freeze({ engineId: "recommendation-learning-engine", label: "Recommendation Learning Engine", phaseKey: "recommendation_learning", status: "reserved" as const }),
] as const);

export const CROSS_SCENARIO_LEARNING_FUTURE_API_REGISTRY = Object.freeze([
  Object.freeze({ apiId: "learning-query-api", label: "Learning Query API", phaseKey: "learning_query", status: "reserved" as const }),
  Object.freeze({ apiId: "learning-facade-api", label: "Learning Facade API", phaseKey: "learning_api", status: "reserved" as const }),
] as const);

export const CROSS_SCENARIO_LEARNING_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "pattern-learning", label: "Pattern Learning", phaseKey: "pattern_learning", status: "reserved" as const }),
  Object.freeze({ extensionId: "similarity-engine", label: "Similarity Engine", phaseKey: "similarity_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "outcome-learning", label: "Outcome Learning", phaseKey: "outcome_learning", status: "reserved" as const }),
  Object.freeze({ extensionId: "failure-learning", label: "Failure Learning", phaseKey: "failure_learning", status: "reserved" as const }),
  Object.freeze({ extensionId: "strategy-learning", label: "Strategy Learning", phaseKey: "strategy_learning", status: "reserved" as const }),
  Object.freeze({ extensionId: "recommendation-learning", label: "Recommendation Learning", phaseKey: "recommendation_learning", status: "reserved" as const }),
] as const);

export const CROSS_SCENARIO_LEARNING_METADATA_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "learning-metadata-strategy", label: "Strategy Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "learning-metadata-outcome", label: "Outcome Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "learning-metadata-condition", label: "Business Condition Metadata", status: "registered" as const }),
] as const);

export const CROSS_SCENARIO_LEARNING_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({ guaranteeId: "backward-compatibility", description: "Public interfaces extend only; breaking changes forbidden.", enforced: true as const }),
  Object.freeze({ guaranteeId: "metadata-only-foundation", description: "APP-10:1 provides contracts and registry only — no runtime learning.", enforced: true as const }),
  Object.freeze({ guaranteeId: "consumer-only-platform", description: "Cross-Scenario Learning consumes certified platforms — never modifies them.", enforced: true as const }),
  Object.freeze({ guaranteeId: "deterministic-learning", description: "All learning results must be reproducible without ML inference.", enforced: true as const }),
  Object.freeze({ guaranteeId: "frozen-prior-platforms", description: "Does not modify certified APP-1 through APP-9 platforms.", enforced: true as const }),
  Object.freeze({ guaranteeId: "certified-dependencies-only", description: "Consumes only certified platform releases as learning sources.", enforced: true as const }),
] as const);

export const CROSS_SCENARIO_LEARNING_CERTIFIED_DEPENDENCIES = Object.freeze([
  Object.freeze({ appId: "APP-5", platformId: "scenario-timeline-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-6", platformId: "decision-timeline-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-7", platformId: "business-timeline-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-8", platformId: "decision-journal-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-9", platformId: "confidence-evolution-platform", required: true as const, consumerOnly: true as const }),
] as const);

export const CROSS_SCENARIO_LEARNING_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const CROSS_SCENARIO_LEARNING_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-10/1",
  certificationScope: "platform-foundation",
  requiredChecks: Object.freeze([
    "platform_identity",
    "contracts",
    "registry",
    "constants",
    "manifest",
    "dependency_gates",
    "extension_registry",
    "public_api",
    "workspace_isolation",
  ]),
  readOnly: true,
} as const);

export const CROSS_SCENARIO_LEARNING_RESERVED_SESSION_IDS = Object.freeze([
  "cross-scenario-learning-system",
  "cross-scenario-learning-reserved",
  "cross-scenario-learning-internal",
] as const);

export const CROSS_SCENARIO_LEARNING_RESERVED_METADATA_KEYS = Object.freeze([
  "cross-scenario-learning-system-metadata",
  "cross-scenario-learning-reserved-metadata",
  "cross-scenario-learning-internal-metadata",
] as const);
