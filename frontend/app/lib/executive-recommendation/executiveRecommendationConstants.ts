/**
 * APP-12:1 — Executive Recommendation Platform constants.
 */

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CONTRACT_VERSION = "APP-12/1" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_ARCHITECTURE_VERSION = "APP-12/1-arch" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_API_VERSION = "APP-12/1" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_SOURCE = "executive-recommendation-platform-foundation" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_LOG_PREFIX = "[NexoraExecutiveRecommendation]" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM = "nexora-type-c" as const;

export const EXECUTIVE_RECOMMENDATION_PLATFORM_ID = "executive-recommendation-platform" as const;
export const EXECUTIVE_RECOMMENDATION_PLATFORM_NAME = "Executive Recommendation" as const;

export const EXECUTIVE_RECOMMENDATION_PLATFORM_TAGS = Object.freeze([
  "[APP12_1]",
  "[EXECUTIVE_RECOMMENDATION_FOUNDATION]",
  "[EXECUTIVE_ADVISORY]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[CONSUMER_ONLY]",
  "[NO_GENERATION]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_RECOMMENDATION_DOMAIN_KEYS = Object.freeze([
  "strategic",
  "financial",
  "operational",
  "resource",
  "risk",
  "scenario",
  "timeline",
  "organizational",
  "customer",
  "mixed",
] as const);

export const EXECUTIVE_RECOMMENDATION_CANDIDATE_STATUS_KEYS = Object.freeze([
  "registered",
  "validated",
  "archived",
  "dismissed",
] as const);

export const EXECUTIVE_RECOMMENDATION_SESSION_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "archived",
] as const);

export const EXECUTIVE_RECOMMENDATION_MANDATORY_REQUEST_FIELDS = Object.freeze([
  "requestId",
  "workspaceId",
  "sessionId",
  "domain",
  "label",
  "description",
  "metadata",
  "createdAt",
  "version",
] as const);

export const EXECUTIVE_RECOMMENDATION_MANDATORY_CONTEXT_FIELDS = Object.freeze([
  "contextId",
  "workspaceId",
  "sessionId",
  "domains",
  "scope",
  "metadata",
  "createdAt",
  "version",
] as const);

export const EXECUTIVE_RECOMMENDATION_MANDATORY_CANDIDATE_FIELDS = Object.freeze([
  "candidateId",
  "workspaceId",
  "sessionId",
  "domain",
  "sourceProviderId",
  "sourceReferenceId",
  "status",
  "label",
  "description",
  "metadata",
  "registeredAt",
  "version",
] as const);

export const EXECUTIVE_RECOMMENDATION_MANDATORY_SESSION_FIELDS = Object.freeze([
  "sessionId",
  "workspaceId",
  "status",
  "label",
  "description",
  "domains",
  "metadata",
  "createdAt",
  "updatedAt",
  "version",
] as const);

export const EXECUTIVE_RECOMMENDATION_MANDATORY_SOURCE_PROVIDER_FIELDS = Object.freeze([
  "providerId",
  "label",
  "platformId",
  "appId",
  "consumerOnly",
  "metadata",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_PRINCIPLES = Object.freeze([
  "recommendations_are_deterministic_and_explainable",
  "executive_recommendation_is_consumer_only",
  "certified_platforms_are_first_class_recommendation_sources",
  "executive_advisory_is_metadata_not_autonomous_action",
  "every_recommendation_artifact_belongs_to_one_workspace",
  "recommendation_metadata_is_version_safe",
  "platform_must_remain_metadata_only",
  "no_recommendation_generation_in_foundation",
  "no_recommendation_scoring_in_foundation",
  "no_recommendation_execution_in_foundation",
  "no_workflow_execution_in_foundation",
  "no_machine_learning_in_foundation",
] as const);

export const EXECUTIVE_RECOMMENDATION_FUTURE_PHASE_KEYS = Object.freeze([
  "generation_engine",
  "evaluation_engine",
  "explainability_engine",
  "governance_engine",
  "optimization_engine",
  "delivery_engine",
  "recommendation_query",
  "recommendation_api",
  "platform_certification",
  "platform_freeze",
] as const);

export const EXECUTIVE_RECOMMENDATION_MUST_NOT_OWN = Object.freeze([
  "recommendation_generation",
  "recommendation_scoring",
  "recommendation_ranking",
  "recommendation_optimization",
  "recommendation_execution",
  "workflow_execution",
  "notification_delivery",
  "machine_learning",
  "neural_networks",
  "statistical_prediction",
  "embeddings",
  "vector_search",
  "llm_reasoning",
  "scenario_engine",
  "decision_journal_engine",
  "confidence_evolution_engine",
  "cross_scenario_learning_engine",
  "executive_inbox_engine",
  "visualization",
  "dashboard",
  "assistant",
  "persistence",
  "database",
  "react_ui",
] as const);

export const EXECUTIVE_RECOMMENDATION_PLATFORM_CAPABILITIES = Object.freeze([
  "platform_identity",
  "recommendation_contracts",
  "recommendation_registry",
  "dependency_validation",
  "manifest_generation",
  "extension_registration",
  "consumer_registry",
  "source_provider_registry",
  "workspace_isolation_contracts",
] as const);

export const EXECUTIVE_RECOMMENDATION_FUTURE_COMPATIBILITY = Object.freeze({
  app12Ready: true,
  generationEngineReady: false,
  evaluationEngineReady: false,
  explainabilityEngineReady: false,
  governanceEngineReady: false,
  optimizationEngineReady: false,
  deliveryEngineReady: false,
  recommendationQueryReady: false,
  recommendationApiReady: false,
  executiveTimeConsumerReady: true,
  scenarioIntelligenceConsumerReady: true,
  executiveIntentConsumerReady: true,
  executiveMemoryConsumerReady: true,
  scenarioTimelineConsumerReady: true,
  decisionTimelineConsumerReady: true,
  businessTimelineConsumerReady: true,
  decisionJournalConsumerReady: true,
  confidenceEvolutionConsumerReady: true,
  crossScenarioLearningConsumerReady: true,
  executiveInboxConsumerReady: true,
  workspaceConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const EXECUTIVE_RECOMMENDATION_DEFAULT_LIMITS = Object.freeze({
  maxSessionLabelLength: 128,
  maxSessionDescriptionLength: 512,
  maxCandidateLabelLength: 128,
  maxCandidateDescriptionLength: 512,
  maxRegisteredSessions: 256,
  maxRegisteredCandidates: 1024,
  maxDomainsPerSession: 10,
} as const);

export const EXECUTIVE_RECOMMENDATION_CONSUMER_REGISTRY = Object.freeze([
  Object.freeze({ consumerId: "workspace-consumer", label: "Workspace Consumer", integrationPath: "future APP-12 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "dashboard-consumer", label: "Dashboard Consumer", integrationPath: "future APP-12 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "assistant-consumer", label: "Assistant Consumer", integrationPath: "future APP-12 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "report-consumer", label: "Report Consumer", integrationPath: "future APP-12 API facade", status: "registered" as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_SOURCE_PROVIDER_REGISTRY = Object.freeze([
  Object.freeze({ providerId: "executive-time-provider", label: "Executive Time Provider", appId: "APP-1", platformId: "executive-time-platform", status: "registered" as const }),
  Object.freeze({ providerId: "scenario-intelligence-provider", label: "Scenario Intelligence Provider", appId: "APP-2", platformId: "scenario-intelligence-platform", status: "registered" as const }),
  Object.freeze({ providerId: "executive-intent-provider", label: "Executive Intent Provider", appId: "APP-3", platformId: "executive-intent-platform", status: "registered" as const }),
  Object.freeze({ providerId: "executive-memory-provider", label: "Executive Memory Provider", appId: "APP-4", platformId: "executive-memory-platform", status: "registered" as const }),
  Object.freeze({ providerId: "scenario-timeline-provider", label: "Scenario Timeline Provider", appId: "APP-5", platformId: "scenario-timeline-platform", status: "registered" as const }),
  Object.freeze({ providerId: "decision-timeline-provider", label: "Decision Timeline Provider", appId: "APP-6", platformId: "decision-timeline-platform", status: "registered" as const }),
  Object.freeze({ providerId: "business-timeline-provider", label: "Business Timeline Provider", appId: "APP-7", platformId: "business-timeline-platform", status: "registered" as const }),
  Object.freeze({ providerId: "decision-journal-provider", label: "Decision Journal Provider", appId: "APP-8", platformId: "decision-journal-platform", status: "registered" as const }),
  Object.freeze({ providerId: "confidence-evolution-provider", label: "Confidence Evolution Provider", appId: "APP-9", platformId: "confidence-evolution-platform", status: "registered" as const }),
  Object.freeze({ providerId: "cross-scenario-learning-provider", label: "Cross-Scenario Learning Provider", appId: "APP-10", platformId: "cross-scenario-learning-platform", status: "registered" as const }),
  Object.freeze({ providerId: "executive-inbox-provider", label: "Executive Inbox Provider", appId: "APP-11", platformId: "executive-inbox-platform", status: "registered" as const }),
  Object.freeze({ providerId: "ds-platform-provider", label: "DS Platform Provider", appId: "DS", platformId: "ds-platform", status: "registered" as const }),
  Object.freeze({ providerId: "int-platform-provider", label: "INT Platform Provider", appId: "INT", platformId: "int-platform", status: "registered" as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_FUTURE_ENGINE_REGISTRY = Object.freeze([
  Object.freeze({ engineId: "generation-engine", label: "Recommendation Generation Engine", phaseKey: "generation_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "evaluation-engine", label: "Recommendation Evaluation Engine", phaseKey: "evaluation_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "explainability-engine", label: "Explainability Engine", phaseKey: "explainability_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "governance-engine", label: "Governance Engine", phaseKey: "governance_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "optimization-engine", label: "Optimization Engine", phaseKey: "optimization_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "delivery-engine", label: "Delivery Engine", phaseKey: "delivery_engine", status: "reserved" as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_FUTURE_API_REGISTRY = Object.freeze([
  Object.freeze({ apiId: "recommendation-query-api", label: "Recommendation Query API", phaseKey: "recommendation_query", status: "reserved" as const }),
  Object.freeze({ apiId: "recommendation-facade-api", label: "Recommendation Facade API", phaseKey: "recommendation_api", status: "reserved" as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "generation-engine", label: "Generation Engine", phaseKey: "generation_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "evaluation-engine", label: "Evaluation Engine", phaseKey: "evaluation_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "explainability-engine", label: "Explainability Engine", phaseKey: "explainability_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "governance-engine", label: "Governance Engine", phaseKey: "governance_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "optimization-engine", label: "Optimization Engine", phaseKey: "optimization_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "delivery-engine", label: "Delivery Engine", phaseKey: "delivery_engine", status: "reserved" as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_METADATA_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "recommendation-metadata-priority", label: "Priority Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "recommendation-metadata-explanation", label: "Explanation Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "recommendation-metadata-governance", label: "Governance Metadata", status: "registered" as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({ guaranteeId: "backward-compatibility", description: "Public interfaces extend only; breaking changes forbidden.", enforced: true as const }),
  Object.freeze({ guaranteeId: "metadata-only-foundation", description: "APP-12:1 provides contracts and registry only — no recommendation generation.", enforced: true as const }),
  Object.freeze({ guaranteeId: "consumer-only-platform", description: "Executive Recommendation consumes certified platforms — never modifies them.", enforced: true as const }),
  Object.freeze({ guaranteeId: "deterministic-recommendations", description: "All recommendation outputs must be reproducible without ML inference.", enforced: true as const }),
  Object.freeze({ guaranteeId: "frozen-prior-platforms", description: "Does not modify certified APP-1 through APP-11 platforms.", enforced: true as const }),
  Object.freeze({ guaranteeId: "certified-dependencies-only", description: "Consumes only certified platform releases as recommendation sources.", enforced: true as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_CERTIFIED_DEPENDENCIES = Object.freeze([
  Object.freeze({ appId: "APP-1", platformId: "executive-time-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-2", platformId: "scenario-intelligence-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-3", platformId: "executive-intent-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-4", platformId: "executive-memory-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-5", platformId: "scenario-timeline-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-6", platformId: "decision-timeline-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-7", platformId: "business-timeline-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-8", platformId: "decision-journal-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-9", platformId: "confidence-evolution-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-10", platformId: "cross-scenario-learning-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "APP-11", platformId: "executive-inbox-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "DS", platformId: "ds-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "INT", platformId: "int-platform", required: true as const, consumerOnly: true as const }),
] as const);

export const EXECUTIVE_RECOMMENDATION_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const EXECUTIVE_RECOMMENDATION_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-12/1",
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

export const EXECUTIVE_RECOMMENDATION_RESERVED_SESSION_IDS = Object.freeze([
  "executive-recommendation-system",
  "executive-recommendation-reserved",
  "executive-recommendation-internal",
] as const);

export const EXECUTIVE_RECOMMENDATION_RESERVED_METADATA_KEYS = Object.freeze([
  "executive-recommendation-system-metadata",
  "executive-recommendation-reserved-metadata",
  "executive-recommendation-internal-metadata",
] as const);

export const EXECUTIVE_RECOMMENDATION_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveRecommendationFoundation",
  "validateExecutiveRecommendationFoundation",
  "getExecutiveRecommendationManifest",
  "runExecutiveRecommendationFoundation",
] as const);

export const EXECUTIVE_RECOMMENDATION_DOMAIN_LABELS = Object.freeze({
  strategic: "Strategic Recommendation",
  financial: "Financial Recommendation",
  operational: "Operational Recommendation",
  resource: "Resource Recommendation",
  risk: "Risk Recommendation",
  scenario: "Scenario Recommendation",
  timeline: "Timeline Recommendation",
  organizational: "Organizational Recommendation",
  customer: "Customer Recommendation",
  mixed: "Mixed Recommendation",
} as const);
