/**
 * APP-11:1 — Executive Inbox Platform constants.
 */

import type {
  ExecutiveInboxItemStatus,
  ExecutiveInboxSessionStatus,
  ExecutiveInboxSourceType,
} from "./executiveInboxTypes.ts";

export const EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION = "APP-11/1" as const;
export const EXECUTIVE_INBOX_PLATFORM_ARCHITECTURE_VERSION = "APP-11/1-arch" as const;
export const EXECUTIVE_INBOX_PLATFORM_API_VERSION = "APP-11/1" as const;
export const EXECUTIVE_INBOX_PLATFORM_SOURCE = "executive-inbox-platform-foundation" as const;
export const EXECUTIVE_INBOX_PLATFORM_LOG_PREFIX = "[NexoraExecutiveInbox]" as const;
export const EXECUTIVE_INBOX_PLATFORM = "nexora-type-c" as const;

export const EXECUTIVE_INBOX_PLATFORM_ID = "executive-inbox-platform" as const;
export const EXECUTIVE_INBOX_PLATFORM_NAME = "Executive Inbox" as const;

export const EXECUTIVE_INBOX_PLATFORM_TAGS = Object.freeze([
  "[APP11_1]",
  "[EXECUTIVE_INBOX_FOUNDATION]",
  "[UNIFIED_EXECUTIVE_ATTENTION]",
  "[METADATA_ONLY]",
  "[DETERMINISTIC]",
  "[CONSUMER_ONLY]",
  "[NO_AGGREGATION]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
] as const);

export const EXECUTIVE_INBOX_SOURCE_TYPE_KEYS = Object.freeze([
  "scenario",
  "decision",
  "timeline",
  "risk",
  "strategy",
  "recommendation",
  "workspace",
  "report",
  "assistant",
] as const satisfies readonly ExecutiveInboxSourceType[]);

export const EXECUTIVE_INBOX_ITEM_STATUS_KEYS = Object.freeze([
  "registered",
  "validated",
  "archived",
  "dismissed",
] as const satisfies readonly ExecutiveInboxItemStatus[]);

export const EXECUTIVE_INBOX_SESSION_STATUS_KEYS = Object.freeze([
  "draft",
  "active",
  "archived",
] as const satisfies readonly ExecutiveInboxSessionStatus[]);

export const EXECUTIVE_INBOX_MANDATORY_INBOX_ITEM_FIELDS = Object.freeze([
  "itemId",
  "workspaceId",
  "sessionId",
  "sourceType",
  "sourceReferenceId",
  "status",
  "label",
  "description",
  "metadata",
  "registeredAt",
  "version",
] as const);

export const EXECUTIVE_INBOX_MANDATORY_INBOX_CONTEXT_FIELDS = Object.freeze([
  "contextId",
  "workspaceId",
  "sessionId",
  "sourceTypes",
  "scope",
  "metadata",
  "createdAt",
  "version",
] as const);

export const EXECUTIVE_INBOX_MANDATORY_INBOX_SESSION_FIELDS = Object.freeze([
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

export const EXECUTIVE_INBOX_MANDATORY_INBOX_SOURCE_FIELDS = Object.freeze([
  "sourceId",
  "sourceType",
  "platformId",
  "appId",
  "referenceId",
  "label",
  "description",
  "consumerOnly",
  "metadata",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_PRINCIPLES = Object.freeze([
  "inbox_is_deterministic_and_explainable",
  "executive_inbox_is_consumer_only",
  "certified_platforms_are_first_class_inbox_sources",
  "executive_attention_is_aggregated_not_inferred",
  "every_inbox_artifact_belongs_to_one_workspace",
  "inbox_metadata_is_version_safe",
  "platform_must_remain_metadata_only",
  "no_inbox_aggregation_in_foundation",
  "no_prioritization_in_foundation",
  "no_notification_delivery_in_foundation",
  "no_workflow_execution_in_foundation",
  "no_machine_learning_in_foundation",
] as const);

export const EXECUTIVE_INBOX_FUTURE_PHASE_KEYS = Object.freeze([
  "aggregation_engine",
  "prioritization_engine",
  "notification_engine",
  "reminder_engine",
  "scheduling_engine",
  "inbox_query",
  "inbox_api",
  "platform_certification",
  "platform_freeze",
] as const);

export const EXECUTIVE_INBOX_MUST_NOT_OWN = Object.freeze([
  "inbox_aggregation",
  "prioritization_engine",
  "notification_delivery",
  "reminder_delivery",
  "scheduling_engine",
  "workflow_execution",
  "recommendation_generation",
  "machine_learning",
  "neural_networks",
  "statistical_prediction",
  "embeddings",
  "vector_search",
  "scenario_engine",
  "decision_journal_engine",
  "confidence_evolution_engine",
  "cross_scenario_learning_engine",
  "visualization",
  "dashboard",
  "assistant",
  "persistence",
  "database",
  "react_ui",
] as const);

export const EXECUTIVE_INBOX_PLATFORM_CAPABILITIES = Object.freeze([
  "platform_identity",
  "inbox_contracts",
  "inbox_registry",
  "dependency_validation",
  "manifest_generation",
  "extension_registration",
  "consumer_registry",
  "source_provider_registry",
  "workspace_isolation_contracts",
] as const);

export const EXECUTIVE_INBOX_FUTURE_COMPATIBILITY = Object.freeze({
  app11Ready: true,
  aggregationEngineReady: false,
  prioritizationEngineReady: false,
  notificationEngineReady: false,
  reminderEngineReady: false,
  schedulingEngineReady: false,
  inboxQueryReady: false,
  inboxApiReady: false,
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
  workspaceConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const EXECUTIVE_INBOX_DEFAULT_LIMITS = Object.freeze({
  maxSessionLabelLength: 128,
  maxSessionDescriptionLength: 512,
  maxItemLabelLength: 128,
  maxItemDescriptionLength: 512,
  maxRegisteredSessions: 256,
  maxRegisteredItems: 1024,
  maxSourceTypesPerSession: 9,
} as const);

export const EXECUTIVE_INBOX_CONSUMER_REGISTRY = Object.freeze([
  Object.freeze({ consumerId: "workspace-consumer", label: "Workspace Consumer", integrationPath: "future APP-11 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "dashboard-consumer", label: "Dashboard Consumer", integrationPath: "future APP-11 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "assistant-consumer", label: "Assistant Consumer", integrationPath: "future APP-11 API facade", status: "registered" as const }),
  Object.freeze({ consumerId: "report-consumer", label: "Report Consumer", integrationPath: "future APP-11 API facade", status: "registered" as const }),
] as const);

export const EXECUTIVE_INBOX_SOURCE_PROVIDER_REGISTRY = Object.freeze([
  Object.freeze({ providerId: "scenario-timeline-provider", label: "Scenario Timeline Provider", appId: "APP-5", platformId: "scenario-timeline-platform", status: "registered" as const }),
  Object.freeze({ providerId: "decision-timeline-provider", label: "Decision Timeline Provider", appId: "APP-6", platformId: "decision-timeline-platform", status: "registered" as const }),
  Object.freeze({ providerId: "business-timeline-provider", label: "Business Timeline Provider", appId: "APP-7", platformId: "business-timeline-platform", status: "registered" as const }),
  Object.freeze({ providerId: "decision-journal-provider", label: "Decision Journal Provider", appId: "APP-8", platformId: "decision-journal-platform", status: "registered" as const }),
  Object.freeze({ providerId: "confidence-evolution-provider", label: "Confidence Evolution Provider", appId: "APP-9", platformId: "confidence-evolution-platform", status: "registered" as const }),
  Object.freeze({ providerId: "cross-scenario-learning-provider", label: "Cross-Scenario Learning Provider", appId: "APP-10", platformId: "cross-scenario-learning-platform", status: "registered" as const }),
] as const);

export const EXECUTIVE_INBOX_FUTURE_ENGINE_REGISTRY = Object.freeze([
  Object.freeze({ engineId: "aggregation-engine", label: "Aggregation Engine", phaseKey: "aggregation_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "prioritization-engine", label: "Prioritization Engine", phaseKey: "prioritization_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "notification-engine", label: "Notification Engine", phaseKey: "notification_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "reminder-engine", label: "Reminder Engine", phaseKey: "reminder_engine", status: "reserved" as const }),
  Object.freeze({ engineId: "scheduling-engine", label: "Scheduling Engine", phaseKey: "scheduling_engine", status: "reserved" as const }),
] as const);

export const EXECUTIVE_INBOX_FUTURE_API_REGISTRY = Object.freeze([
  Object.freeze({ apiId: "inbox-query-api", label: "Inbox Query API", phaseKey: "inbox_query", status: "reserved" as const }),
  Object.freeze({ apiId: "inbox-facade-api", label: "Inbox Facade API", phaseKey: "inbox_api", status: "reserved" as const }),
] as const);

export const EXECUTIVE_INBOX_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "aggregation-engine", label: "Aggregation Engine", phaseKey: "aggregation_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "prioritization-engine", label: "Prioritization Engine", phaseKey: "prioritization_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "notification-engine", label: "Notification Engine", phaseKey: "notification_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "reminder-engine", label: "Reminder Engine", phaseKey: "reminder_engine", status: "reserved" as const }),
  Object.freeze({ extensionId: "scheduling-engine", label: "Scheduling Engine", phaseKey: "scheduling_engine", status: "reserved" as const }),
] as const);

export const EXECUTIVE_INBOX_METADATA_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "inbox-metadata-priority", label: "Priority Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "inbox-metadata-attention", label: "Attention Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "inbox-metadata-explanation", label: "Explanation Metadata", status: "registered" as const }),
] as const);

export const EXECUTIVE_INBOX_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({ guaranteeId: "backward-compatibility", description: "Public interfaces extend only; breaking changes forbidden.", enforced: true as const }),
  Object.freeze({ guaranteeId: "metadata-only-foundation", description: "APP-11:1 provides contracts and registry only — no inbox aggregation.", enforced: true as const }),
  Object.freeze({ guaranteeId: "consumer-only-platform", description: "Executive Inbox consumes certified platforms — never modifies them.", enforced: true as const }),
  Object.freeze({ guaranteeId: "deterministic-inbox", description: "All inbox outputs must be reproducible without ML inference.", enforced: true as const }),
  Object.freeze({ guaranteeId: "frozen-prior-platforms", description: "Does not modify certified APP-1 through APP-10 platforms.", enforced: true as const }),
  Object.freeze({ guaranteeId: "certified-dependencies-only", description: "Consumes only certified platform releases as inbox sources.", enforced: true as const }),
] as const);

export const EXECUTIVE_INBOX_CERTIFIED_DEPENDENCIES = Object.freeze([
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
  Object.freeze({ appId: "DS", platformId: "ds-platform", required: true as const, consumerOnly: true as const }),
  Object.freeze({ appId: "INT", platformId: "int-platform", required: true as const, consumerOnly: true as const }),
] as const);

export const EXECUTIVE_INBOX_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const EXECUTIVE_INBOX_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-11/1",
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

export const EXECUTIVE_INBOX_RESERVED_SESSION_IDS = Object.freeze([
  "executive-inbox-system",
  "executive-inbox-reserved",
  "executive-inbox-internal",
] as const);

export const EXECUTIVE_INBOX_RESERVED_METADATA_KEYS = Object.freeze([
  "executive-inbox-system-metadata",
  "executive-inbox-reserved-metadata",
  "executive-inbox-internal-metadata",
] as const);

export const EXECUTIVE_INBOX_PUBLIC_API_REGISTRY = Object.freeze([
  "buildExecutiveInboxFoundation",
  "validateExecutiveInboxFoundation",
  "getExecutiveInboxManifest",
  "runExecutiveInboxFoundation",
] as const);
