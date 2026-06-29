/**
 * APP-7:1 — Business Timeline Platform constants.
 */

import type {
  BusinessEventCategory,
  BusinessEventImportance,
  BusinessEventSource,
  BusinessEventStatus,
  BusinessEventType,
  BusinessEventTypeId,
} from "./businessTimelineTypes.ts";

export const BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION = "APP-7/1" as const;
export const BUSINESS_TIMELINE_PLATFORM_ARCHITECTURE_VERSION = "APP-7/1-arch" as const;
export const BUSINESS_TIMELINE_PLATFORM_API_VERSION = "APP-7/1" as const;
export const BUSINESS_TIMELINE_PLATFORM_SOURCE = "business-timeline-platform-foundation" as const;
export const BUSINESS_TIMELINE_PLATFORM_LOG_PREFIX = "[NexoraBusinessTimeline]" as const;
export const BUSINESS_TIMELINE_PLATFORM = "nexora-type-c" as const;

export const BUSINESS_TIMELINE_PLATFORM_ID = "business-timeline-platform" as const;
export const BUSINESS_TIMELINE_PLATFORM_NAME = "Business Timeline" as const;

export const BUSINESS_TIMELINE_PLATFORM_TAGS = Object.freeze([
  "[APP7_1]",
  "[BUSINESS_TIMELINE_FOUNDATION]",
  "[BUSINESS_TIMELINE_CONTRACT]",
  "[METADATA_ONLY]",
  "[ARCHITECTURE_SAFE]",
  "[BACKWARD_COMPATIBLE]",
  "[NO_PERSISTENCE]",
  "[NO_VISUALIZATION]",
  "[NO_RUNTIME]",
] as const);

export const BUSINESS_TIMELINE_CATEGORY_KEYS = Object.freeze([
  "corporate",
  "financial",
  "operations",
  "human_resources",
  "sales",
  "marketing",
  "technology",
  "legal",
  "compliance",
  "risk",
  "strategy",
  "investment",
  "product",
  "customer",
  "supply_chain",
  "manufacturing",
  "infrastructure",
  "governance",
  "other",
] as const satisfies readonly BusinessEventCategory[]);

export const BUSINESS_TIMELINE_EVENT_TYPE_KEYS = Object.freeze([
  "milestone",
  "achievement",
  "failure",
  "incident",
  "transformation",
  "expansion",
  "reduction",
  "investment",
  "partnership",
  "acquisition",
  "merger",
  "policy",
  "organization",
  "operational",
  "technology",
  "financial",
  "custom",
] as const satisfies readonly BusinessEventType[]);

export const BUSINESS_TIMELINE_IMPORTANCE_KEYS = Object.freeze([
  "low",
  "medium",
  "high",
  "critical",
] as const satisfies readonly BusinessEventImportance[]);

export const BUSINESS_TIMELINE_STATUS_KEYS = Object.freeze([
  "planned",
  "completed",
  "cancelled",
  "archived",
] as const satisfies readonly BusinessEventStatus[]);

export const BUSINESS_TIMELINE_SOURCE_KEYS = Object.freeze([
  "manual",
  "assistant",
  "imported",
  "api",
  "data_source",
  "simulation",
] as const satisfies readonly BusinessEventSource[]);

export const BUSINESS_TIMELINE_RESERVED_TYPE_IDS = Object.freeze([
  "business-system",
  "business-reserved",
  "business-internal",
  "business-placeholder",
] as const satisfies readonly BusinessEventTypeId[]);

export const BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS = Object.freeze([
  "id",
  "workspaceId",
  "title",
  "description",
  "category",
  "type",
  "importance",
  "status",
  "source",
  "createdAt",
  "occurredAt",
  "createdBy",
  "tags",
  "metadata",
  "version",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_PRINCIPLES = Object.freeze([
  "business_event_ids_are_immutable",
  "timeline_events_are_append_only",
  "historical_entries_never_rewritten",
  "every_event_belongs_to_one_workspace",
  "business_timestamps_are_immutable",
  "business_metadata_is_version_safe",
  "platform_must_remain_deterministic",
  "no_runtime_mutations",
  "no_execution_logic",
  "no_visualization_logic",
] as const);

export const BUSINESS_TIMELINE_FUTURE_PHASE_KEYS = Object.freeze([
  "business_events",
  "business_storage",
  "business_visualization",
  "business_analytics",
  "business_dashboard",
  "business_assistant",
  "business_search",
  "business_replay",
  "business_ml",
] as const);

export const BUSINESS_TIMELINE_MUST_NOT_OWN = Object.freeze([
  "business_storage",
  "timeline_engine",
  "visualization",
  "dashboard",
  "assistant",
  "search",
  "analytics",
  "ml",
  "execution_engine",
  "database",
  "persistence",
  "api_routes",
  "react_ui",
  "timeline_rendering",
  "timeline_calculations",
] as const);

export const BUSINESS_TIMELINE_PLATFORM_CAPABILITIES = Object.freeze([
  "platform_identity",
  "business_event_contracts",
  "business_timeline_registry",
  "business_validation",
  "manifest_generation",
  "extension_registration",
  "workspace_isolation_contracts",
] as const);

export const BUSINESS_TIMELINE_FUTURE_COMPATIBILITY = Object.freeze({
  app7Ready: true,
  eventsReady: false,
  storageReady: false,
  visualizationReady: false,
  dashboardReady: false,
  assistantReady: false,
  analyticsReady: false,
  scenarioTimelineConsumerReady: true,
  decisionTimelineConsumerReady: true,
  workspaceConsumerReady: true,
  readOnly: true,
  metadataOnly: true,
} as const);

export const BUSINESS_TIMELINE_DEFAULT_LIMITS = Object.freeze({
  maxEventTypeLabelLength: 128,
  maxEventTypeDescriptionLength: 512,
  maxEventTitleLength: 256,
  maxEventDescriptionLength: 4096,
  maxRegisteredEventTypes: 64,
  maxRegisteredTimelines: 256,
  maxRegisteredCategories: 32,
  maxRegisteredStatusTypes: 16,
  maxTagsPerEvent: 32,
  maxTagLength: 64,
} as const);

export const BUSINESS_TIMELINE_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "business-visualization", label: "Business Visualization", phaseKey: "business_visualization", status: "registered" as const }),
  Object.freeze({ extensionId: "business-analytics", label: "Business Analytics", phaseKey: "business_analytics", status: "registered" as const }),
  Object.freeze({ extensionId: "business-dashboard", label: "Business Dashboard", phaseKey: "business_dashboard", status: "registered" as const }),
  Object.freeze({ extensionId: "business-assistant", label: "Business Assistant", phaseKey: "business_assistant", status: "registered" as const }),
] as const);

export const BUSINESS_TIMELINE_METADATA_EXTENSION_REGISTRY = Object.freeze([
  Object.freeze({ extensionId: "business-metadata-context", label: "Business Context Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "business-metadata-tags", label: "Business Tags Metadata", status: "registered" as const }),
  Object.freeze({ extensionId: "business-metadata-source", label: "Business Source Metadata", status: "registered" as const }),
] as const);

export const BUSINESS_TIMELINE_COMPATIBILITY_REGISTRY = Object.freeze([
  Object.freeze({ guaranteeId: "backward-compatibility", description: "Public interfaces extend only; breaking changes forbidden.", enforced: true as const }),
  Object.freeze({ guaranteeId: "metadata-only-foundation", description: "APP-7:1 provides contracts and registry only — no runtime execution.", enforced: true as const }),
  Object.freeze({ guaranteeId: "business-life-story-canonical", description: "Business Timeline stores organizational life events — not scenarios or decisions.", enforced: true as const }),
  Object.freeze({ guaranteeId: "app5-scenario-reference", description: "Compatible with APP-5 Scenario Timeline without modification.", enforced: true as const }),
  Object.freeze({ guaranteeId: "app6-decision-reference", description: "Compatible with APP-6 Decision Timeline without modification.", enforced: true as const }),
  Object.freeze({ guaranteeId: "frozen-prior-platforms", description: "Does not modify certified APP-1 through APP-6 platforms.", enforced: true as const }),
] as const);

export const BUSINESS_TIMELINE_RELEASE_METADATA = Object.freeze({
  releaseStage: "foundation",
  certificationStatus: "pending",
  freezeState: "open",
  platformStatus: "build",
  readOnly: true,
} as const);

export const BUSINESS_TIMELINE_CERTIFICATION_METADATA = Object.freeze({
  certificationPhase: "APP-7/1",
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

export const BUSINESS_TIMELINE_RESERVED_METADATA_KEYS = Object.freeze([
  "business-system-metadata",
  "business-reserved-metadata",
  "business-internal-metadata",
] as const);
