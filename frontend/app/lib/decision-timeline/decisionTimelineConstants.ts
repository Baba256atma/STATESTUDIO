/**
 * APP-6:1 — Decision Timeline Platform constants.
 * Versioning, decision vocabulary, limits, and certification tags.
 */

import type {
  DecisionCategory,
  DecisionEventType,
  DecisionSource,
  DecisionStatus,
  DecisionTypeId,
} from "./decisionTimelineTypes.ts";

export const DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION = "APP-6/1" as const;
export const DECISION_TIMELINE_PLATFORM_ARCHITECTURE_VERSION = "APP-6/1-arch" as const;
export const DECISION_TIMELINE_PLATFORM_API_VERSION = "APP-6/1" as const;
export const DECISION_TIMELINE_PLATFORM_SOURCE = "decision-timeline-platform-foundation" as const;
export const DECISION_TIMELINE_PLATFORM_LOG_PREFIX = "[NexoraDecisionTimeline]" as const;
export const DECISION_TIMELINE_PLATFORM = "nexora-type-c" as const;

export const DECISION_TIMELINE_PLATFORM_ID = "decision-timeline-platform" as const;
export const DECISION_TIMELINE_PLATFORM_NAME = "Decision Timeline" as const;

export const DECISION_TIMELINE_PLATFORM_TAGS = Object.freeze([
  "[APP6_1]",
  "[DECISION_TIMELINE_FOUNDATION]",
  "[DECISION_TIMELINE_CONTRACT]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NO_PERSISTENCE]",
  "[NO_ANALYTICS]",
  "[NO_REPLAY]",
] as const);

export const DECISION_TIMELINE_STATUS_KEYS = Object.freeze([
  "draft",
  "proposed",
  "committed",
  "deferred",
  "revoked",
  "superseded",
] as const satisfies readonly DecisionStatus[]);

export const DECISION_TIMELINE_SOURCE_KEYS = Object.freeze([
  "executive_direct",
  "delegation",
  "board_resolution",
  "committee",
  "system_record",
] as const satisfies readonly DecisionSource[]);

export const DECISION_TIMELINE_CATEGORY_KEYS = Object.freeze([
  "strategic",
  "operational",
  "financial",
  "personnel",
  "governance",
  "risk",
  "compliance",
] as const satisfies readonly DecisionCategory[]);

export const DECISION_TIMELINE_EVENT_TYPE_KEYS = Object.freeze([
  "decision_created",
  "decision_updated",
  "decision_committed",
  "decision_deferred",
  "decision_revoked",
  "decision_superseded",
  "decision_reference_added",
  "metadata_annotation",
  "custom",
] as const satisfies readonly DecisionEventType[]);

export const DECISION_TIMELINE_RESERVED_TYPE_IDS = Object.freeze([
  "decision-system",
  "decision-reserved",
  "decision-internal",
  "decision-placeholder",
] as const satisfies readonly DecisionTypeId[]);

export const DECISION_TIMELINE_RESERVED_EVENT_TYPES = Object.freeze([
  "decision-system-event",
  "decision-reserved-event",
  "decision-internal-event",
] as const);

export const DECISION_TIMELINE_MANDATORY_DECISION_FIELDS = Object.freeze([
  "decisionId",
  "workspaceId",
  "status",
  "source",
  "category",
  "title",
  "decidedAt",
  "contractVersion",
] as const);

export const DECISION_TIMELINE_MANDATORY_EVENT_FIELDS = Object.freeze([
  "eventId",
  "decisionId",
  "workspaceId",
  "eventType",
  "occurredAt",
  "sourceModule",
  "contractVersion",
] as const);

export const DECISION_TIMELINE_PLATFORM_PRINCIPLES = Object.freeze([
  "decision_ids_are_immutable",
  "timeline_events_are_append_only",
  "historical_entries_never_rewritten",
  "every_decision_belongs_to_one_workspace",
  "decision_timestamps_are_immutable",
  "decision_metadata_is_version_safe",
  "platform_must_remain_deterministic",
  "no_runtime_mutations",
  "no_execution_logic",
  "no_learning_logic",
] as const);

export const DECISION_TIMELINE_FUTURE_PHASE_KEYS = Object.freeze([
  "decision_events",
  "decision_storage",
  "decision_replay",
  "decision_analytics",
  "decision_outcomes",
  "decision_comparison",
  "decision_dashboard",
  "decision_assistant",
  "decision_ml",
  "decision_search",
] as const);

export const DECISION_TIMELINE_MUST_NOT_OWN = Object.freeze([
  "decision_storage",
  "timeline_engine",
  "replay_engine",
  "dashboard",
  "assistant",
  "search",
  "outcome_tracking",
  "decision_comparison",
  "ml",
  "analytics",
  "execution_engine",
  "risk_integration",
  "scenario_mutation",
  "database",
  "persistence",
  "api_routes",
  "react_ui",
] as const);

export const DECISION_TIMELINE_PLATFORM_CAPABILITIES = Object.freeze([
  "platform_identity",
  "decision_contracts",
  "decision_registry",
  "decision_validation",
  "manifest_generation",
  "extension_registration",
  "workspace_isolation_contracts",
] as const);

export const DECISION_TIMELINE_FUTURE_COMPATIBILITY = Object.freeze({
  app6Ready: true,
  eventsReady: false,
  storageReady: false,
  replayReady: false,
  analyticsReady: false,
  outcomesReady: false,
  comparisonReady: false,
  dashboardReady: false,
  assistantReady: false,
  mlReady: false,
  scenarioTimelineConsumerReady: true,
  executiveIntentConsumerReady: true,
  executiveMemoryConsumerReady: true,
  executiveTimeConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const DECISION_TIMELINE_FUTURE_COMPATIBILITY_VERSION = "APP-6/1-future" as const;

export const DECISION_TIMELINE_DEFAULT_LIMITS = Object.freeze({
  maxDecisionTypeLabelLength: 128,
  maxDecisionTypeDescriptionLength: 512,
  maxDecisionTitleLength: 256,
  maxDecisionSummaryLength: 2048,
  maxRegisteredDecisionTypes: 64,
  maxRegisteredCategories: 32,
  maxRegisteredStatusTypes: 16,
  maxTagsPerDecision: 32,
  maxTagLength: 64,
} as const);

export const DECISION_TIMELINE_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({
    extensionId: "decision-replay",
    label: "Decision Replay",
    phaseKey: "decision_replay",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "decision-analytics",
    label: "Decision Analytics",
    phaseKey: "decision_analytics",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "decision-outcomes",
    label: "Decision Outcomes",
    phaseKey: "decision_outcomes",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "decision-ml",
    label: "Decision ML",
    phaseKey: "decision_ml",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "decision-dashboard",
    label: "Decision Dashboard",
    phaseKey: "decision_dashboard",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "decision-assistant",
    label: "Decision Assistant",
    phaseKey: "decision_assistant",
    status: "registered" as const,
  }),
] as const);

export const DECISION_TIMELINE_METADATA_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({
    extensionId: "decision-metadata-context",
    label: "Decision Context Metadata",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "decision-metadata-reference",
    label: "Decision Reference Metadata",
    status: "registered" as const,
  }),
  Object.freeze({
    extensionId: "decision-metadata-tags",
    label: "Decision Tags Metadata",
    status: "registered" as const,
  }),
] as const);

export const DECISION_TIMELINE_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({
    guaranteeId: "backward-compatibility",
    description: "Public interfaces extend only; breaking changes forbidden.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "metadata-only-foundation",
    description: "APP-6:1 provides contracts and registry only — no runtime execution.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "decision-commitment-canonical",
    description: "Decision Timeline stores executive commitment — not scenarios or recommendations.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "app5-scenario-consumer",
    description: "Compatible with APP-5 Scenario Timeline identity contracts.",
    enforced: true as const,
  }),
  Object.freeze({
    guaranteeId: "frozen-app1-app5",
    description: "Does not modify certified APP-1 through APP-5 platforms.",
    enforced: true as const,
  }),
] as const);

export const DECISION_TIMELINE_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const DECISION_TIMELINE_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-6/1",
  certificationScope: "platform-foundation",
  requiredChecks: Object.freeze([
    "platform_identity",
    "contracts",
    "registry",
    "manifest",
    "compatibility",
    "extension_registry",
    "api_stability",
    "architecture_boundaries",
    "workspace_isolation",
    "timeline_identity",
  ]),
  readOnly: true,
} as const);

export const DECISION_TIMELINE_RESERVED_METADATA_KEYS = Object.freeze([
  "decision-system-metadata",
  "decision-reserved-metadata",
  "decision-internal-metadata",
] as const);
